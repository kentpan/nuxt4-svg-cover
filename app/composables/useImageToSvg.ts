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
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, img.width, img.height)

      // Apply color mode preprocessing
      applyColorMode(imgData, colorMode.value)

      // Build imagetracerjs options based on user settings
      const options = buildTracerOptions()

      // Dynamic import to keep bundle small
      const ImageTracerModule = await import('imagetracerjs')
      // The library uses module.exports = new ImageTracer() in CJS
      const ImageTracer = (ImageTracerModule as any).default || ImageTracerModule

      if (!ImageTracer || typeof ImageTracer.imagedataToSVG !== 'function') {
        throw new Error('ImageTracer library failed to load')
      }

      // Run tracing
      const svgStr = ImageTracer.imagedataToSVG(imgData, options)

      // Post-process: ensure SVG has proper dimensions
      const finalSvg = ensureSvgDimensions(svgStr, img.width, img.height)

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
   * Apply color mode to ImageData in-place.
   * - grayscale: convert to luminance using perceptual weights
   * - bw: convert to pure black & white (threshold 128)
   * - color: no change
   */
  function applyColorMode(imgData: ImageData, mode: 'color' | 'grayscale' | 'bw') {
    if (mode === 'color') return
    const d = imgData.data
    for (let i = 0; i < d.length; i += 4) {
      const gray = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])
      if (mode === 'bw') {
        const val = gray >= 128 ? 255 : 0
        d[i] = val
        d[i + 1] = val
        d[i + 2] = val
      } else {
        d[i] = gray
        d[i + 1] = gray
        d[i + 2] = gray
      }
    }
  }

  function buildTracerOptions(): Record<string, any> {
    // Base options optimized for small file size
    const base: Record<string, any> = {
      // Color quantization
      numberofcolors: numberOfColors.value,
      colorsampling: 2,
      colorquantcycles: 3,
      mincolorratio: 0,

      // SVG rendering — minimal output
      scale: 1,
      roundcoords: 1,
      desc: false,
      viewbox: false,
      lcpr: 0,
      qcpr: 0,

      // Blur
      blurradius: 0,
      blurdelta: 20,

      // Layering
      layering: 0,
    }

    // Detail level adjustments
    switch (detailLevel.value) {
      case 'high':
        base.ltres = 0.5
        base.qtres = 0.5
        base.pathomit = 0
        base.rightangleenhance = true
        base.linefilter = true
        base.strokewidth = 1
        break
      case 'medium':
        base.ltres = 1
        base.qtres = 1
        base.pathomit = 8
        base.rightangleenhance = true
        base.linefilter = false
        base.strokewidth = 1
        break
      case 'low':
        base.ltres = 5
        base.qtres = 5
        base.pathomit = 16
        base.rightangleenhance = true
        base.linefilter = false
        base.strokewidth = 1
        break
    }

    return base
  }

  /**
   * Ensure the SVG string has proper width/height attributes.
   * imagetracerjs may omit them when viewbox=false and scale=1.
   */
  function ensureSvgDimensions(svgStr: string, w: number, h: number): string {
    // If the SVG already has width/height, return as-is
    if (svgStr.includes('width=') && svgStr.includes('height=')) {
      return svgStr
    }
    // Inject width and height into the opening <svg> tag
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