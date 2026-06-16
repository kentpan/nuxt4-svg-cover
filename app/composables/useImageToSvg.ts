export function useImageToSvg() {
  const imageFile = ref<File | null>(null)
  const imagePreviewUrl = ref('')
  const imageWidth = ref(0)
  const imageHeight = ref(0)
  const numberOfColors = ref(16)
  const detailLevel = ref<'high' | 'medium' | 'low'>('medium')
  const colorMode = ref<'color' | 'grayscale' | 'bw'>('color')
  const isConverting = ref(false)
  const svgOutput = ref('')
  const outputBlob = ref<Blob | null>(null)
  const outputUrl = ref('')
  const error = ref<string | null>(null)

  // ============================================================
  // Public API
  // ============================================================

  function loadImageFile(file: File) {
    error.value = null
    svgOutput.value = ''
    outputBlob.value = null
    if (outputUrl.value) URL.revokeObjectURL(outputUrl.value)
    outputUrl.value = ''

    imageFile.value = file
    imagePreviewUrl.value = URL.createObjectURL(file)

    const img = new Image()
    img.onload = () => {
      imageWidth.value = img.naturalWidth
      imageHeight.value = img.naturalHeight
    }
    img.src = imagePreviewUrl.value
  }

  async function convert() {
    isConverting.value = true
    error.value = null

    try {
      const img = await loadImage(imagePreviewUrl.value)

      // Draw image to canvas to get ImageData
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // Check if image has transparency
      const hasTransparency = checkTransparency(imgData)

      // Build imagetracerjs options
      const options = buildTracerOptions(hasTransparency)

      // Dynamic import to keep bundle small
      const ImageTracerModule = await import('imagetracerjs')
      const ImageTracer = (ImageTracerModule as any).default || ImageTracerModule

      if (!ImageTracer || typeof ImageTracer.imagedataToSVG !== 'function') {
        throw new Error('ImageTracer library failed to load')
      }

      // Run tracing
      const svgStr = ImageTracer.imagedataToSVG(imgData, options)

      // Ensure SVG has width/height for proper rendering
      const finalSvg = ensureSvgDimensions(svgStr, canvas.width, canvas.height)

      svgOutput.value = finalSvg
      outputBlob.value = new Blob([finalSvg], { type: 'image/svg+xml' })
      outputUrl.value = URL.createObjectURL(outputBlob.value)
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Conversion failed'
    } finally {
      isConverting.value = false
    }
  }

  /**
   * Check if ImageData has any semi-transparent pixels (alpha < 250).
   */
  function checkTransparency(imgData: ImageData): boolean {
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] < 250) return true
    }
    return false
  }

  /**
   * Build imagetracerjs options.
   *
   * Strategy:
   * - Start from the library's own default preset (proven to work)
   * - Only override the fields we need to change
   * - For grayscale & B&W: use `pal` (fixed palette) from svgconv.com
   * - For color: adjust colorsampling/colorquantcycles to eliminate stripes
   */
  function buildTracerOptions(hasTransparency: boolean): Record<string, any> {
    // Detail level → pathomit mapping (from svgconv.com)
    const detailIndex = detailLevel.value === 'high' ? 0 : detailLevel.value === 'medium' ? 1 : 2
    const pathomit = [4, 8, 16][detailIndex]
    const blurradius = detailIndex === 2 ? 2 : 0

    // --- Black & white: fixed 2-color palette (from svgconv.com) ---
    if (colorMode.value === 'bw') {
      const pal = hasTransparency
        ? [{ r: 0, g: 0, b: 0, a: 0 }, { r: 0, g: 0, b: 0, a: 255 }, { r: 255, g: 255, b: 255, a: 255 }]
        : [{ r: 0, g: 0, b: 0, a: 255 }, { r: 255, g: 255, b: 255, a: 255 }]

      return {
        numberofcolors: 2,
        colorsampling: 0,
        colorquantcycles: 1,
        pathomit,
        blurradius,
        strokewidth: 1,
        scale: 1,
        viewbox: false,
        pal,
      }
    }

    // --- Grayscale: fixed evenly-spaced gray palette (from svgconv.com) ---
    if (colorMode.value === 'grayscale') {
      const pal: Array<{ r: number; g: number; b: number; a: number }> = hasTransparency
        ? [{ r: 0, g: 0, b: 0, a: 0 }]
        : []

      for (let i = 0; i < numberOfColors.value; i++) {
        const v = Math.round((i / Math.max(1, numberOfColors.value - 1)) * 255)
        pal.push({ r: v, g: v, b: v, a: 255 })
      }

      return {
        numberofcolors: numberOfColors.value,
        colorsampling: 0,
        colorquantcycles: 1,
        pathomit,
        blurradius,
        strokewidth: 1,
        scale: 1,
        viewbox: false,
        pal,
      }
    }

    // --- Color mode: default preset + stripe fix ---
    return {
      numberofcolors: numberOfColors.value,
      colorsampling: 0,     // sample every pixel (fixes stripe banding from default=2)
      colorquantcycles: 3,  // default, keep as-is
      pathomit,
      blurradius,
      strokewidth: 1,
      scale: 1,
      viewbox: false,
    }
  }

  /**
   * Ensure the SVG string has proper width/height attributes.
   * imagetracerjs may omit them when viewbox=false and scale=1.
   */
  function ensureSvgDimensions(svgStr: string, w: number, h: number): string {
    if (svgStr.includes('width=') && svgStr.includes('height=')) {
      return svgStr
    }
    return svgStr.replace(
      /<svg(\s)/,
      `<svg width="${w}" height="${h}"$1`,
    )
  }

  function download() {
    if (!outputBlob.value) return
    const name = (imageFile.value?.name || 'image').replace(/\.[^.]+$/, '') + '.svg'
    const a = document.createElement('a')
    a.href = outputUrl.value
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  function reset() {
    imageFile.value = null
    if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value)
    imagePreviewUrl.value = ''
    imageWidth.value = 0
    imageHeight.value = 0
    numberOfColors.value = 16
    detailLevel.value = 'medium'
    colorMode.value = 'color'
    isConverting.value = false
    svgOutput.value = ''
    outputBlob.value = null
    if (outputUrl.value) URL.revokeObjectURL(outputUrl.value)
    outputUrl.value = ''
    error.value = null
  }

  // ============================================================
  // Helper – Image Loading
  // ============================================================

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = src
    })
  }

  // ============================================================
  // Return the stable public API
  // ============================================================

  return {
    imageFile,
    imagePreviewUrl,
    imageWidth,
    imageHeight,
    numberOfColors,
    detailLevel,
    colorMode,
    isConverting,
    svgOutput,
    outputBlob,
    outputUrl,
    error,
    loadImageFile,
    convert,
    download,
    reset,
  }
}