export type OutputFormat = 'png' | 'jpg' | 'webp' | 'pdf' | 'ico' | 'dxf'

export function useSvgConverter(format: OutputFormat = 'png') {
  const svgFile = ref<File | null>(null)
  const svgContent = ref<string>('')
  const svgWidth = ref(0)
  const svgHeight = ref(0)
  const outputWidth = ref(0)
  const outputHeight = ref(0)
  const scale = ref(2)
  const background = ref<'transparent' | 'white'>('transparent')
  const quality = ref(90)
  const isConverting = ref(false)
  const outputBlob = ref<Blob | null>(null)
  const outputUrl = ref('')
  const error = ref<string | null>(null)
  const fileName = ref('converted')

  // Watch scale changes to update output dimensions
  watch(scale, () => {
    outputWidth.value = Math.round(svgWidth.value * scale.value)
    outputHeight.value = Math.round(svgHeight.value * scale.value)
  })

  function svgToDataUri(svgText: string): string {
    const encoded = btoa(unescape(encodeURIComponent(svgText)))
    return `data:image/svg+xml;base64,${encoded}`
  }

  async function renderSvgToCanvas(
    svgText: string,
    width: number,
    height: number,
    bg: string,
  ): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!

        if (bg === 'white' || format === 'jpg') {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, width, height)
        }

        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas)
      }
      img.onerror = () => reject(new Error('Failed to render SVG'))
      img.src = svgToDataUri(svgText)
    })
  }

  async function loadSvgFile(file: File) {
    error.value = null
    outputBlob.value = null
    if (outputUrl.value) {
      URL.revokeObjectURL(outputUrl.value)
      outputUrl.value = ''
    }

    try {
      const text = await file.text()
      svgFile.value = file
      svgContent.value = text
      fileName.value = file.name.replace(/\.[^.]+$/, '')

      // Parse SVG dimensions
      const parser = new DOMParser()
      const doc = parser.parseFromString(text, 'image/svg+xml')
      const svgEl = doc.querySelector('svg')

      if (!svgEl) {
        throw new Error('Invalid SVG file')
      }

      let w = parseFloat(svgEl.getAttribute('width') || '0')
      let h = parseFloat(svgEl.getAttribute('height') || '0')

      // Try viewBox if width/height not set
      if ((!w || !h) && svgEl.hasAttribute('viewBox')) {
        const vb = svgEl.getAttribute('viewBox')!.split(/[\s,]+/).map(Number)
        if (vb.length === 4) {
          w = w || vb[2]
          h = h || vb[3]
        }
      }

      if (!w || !h) {
        // Fallback: render at 300x300
        w = 300
        h = 300
      }

      svgWidth.value = w
      svgHeight.value = h
      outputWidth.value = Math.round(w * scale.value)
      outputHeight.value = Math.round(h * scale.value)
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Failed to load SVG file'
    }
  }

  function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, q?: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to create image'))
        },
        mimeType,
        q,
      )
    })
  }

  async function convertToPng() {
    isConverting.value = true
    error.value = null
    try {
      const canvas = await renderSvgToCanvas(
        svgContent.value,
        outputWidth.value,
        outputHeight.value,
        background.value,
      )
      outputBlob.value = await canvasToBlob(canvas, 'image/png')
      outputUrl.value = URL.createObjectURL(outputBlob.value)
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Conversion failed'
    } finally {
      isConverting.value = false
    }
  }

  async function convertToJpg() {
    isConverting.value = true
    error.value = null
    try {
      const canvas = await renderSvgToCanvas(
        svgContent.value,
        outputWidth.value,
        outputHeight.value,
        'white', // JPG has no transparency
      )
      outputBlob.value = await canvasToBlob(canvas, 'image/jpeg', quality.value / 100)
      outputUrl.value = URL.createObjectURL(outputBlob.value)
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Conversion failed'
    } finally {
      isConverting.value = false
    }
  }

  async function convertToWebp() {
    isConverting.value = true
    error.value = null
    try {
      const canvas = await renderSvgToCanvas(
        svgContent.value,
        outputWidth.value,
        outputHeight.value,
        background.value,
      )
      outputBlob.value = await canvasToBlob(canvas, 'image/webp', quality.value / 100)
      outputUrl.value = URL.createObjectURL(outputBlob.value)
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Conversion failed'
    } finally {
      isConverting.value = false
    }
  }

  async function convertToPdf() {
    isConverting.value = true
    error.value = null
    try {
      const canvas = await renderSvgToCanvas(
        svgContent.value,
        outputWidth.value,
        outputHeight.value,
        'white',
      )
      const dataUrl = canvas.toDataURL('image/png')

      const pxToMm = 0.264583
      const pdfW = (outputWidth.value * pxToMm)
      const pdfH = (outputHeight.value * pxToMm)

      const { default: jsPDF } = await import('jspdf')
      const pdf = new jsPDF({
        orientation: pdfW > pdfH ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [pdfW, pdfH],
      })

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfW, pdfH)
      const pdfBlob = pdf.output('blob')
      outputBlob.value = pdfBlob
      outputUrl.value = URL.createObjectURL(pdfBlob)
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Conversion failed'
    } finally {
      isConverting.value = false
    }
  }

  async function convertToIco() {
    isConverting.value = true
    error.value = null
    try {
      const sizes = [16, 32, 48, 64]
      const pngDataArray: Array<{ size: number; data: Uint8Array }> = []

      for (const size of sizes) {
        const canvas = await renderSvgToCanvas(
          svgContent.value,
          size,
          size,
          'white',
        )
        const blob = await canvasToBlob(canvas, 'image/png')
        const buffer = await blob.arrayBuffer()
        pngDataArray.push({ size, data: new Uint8Array(buffer) })
      }

      outputBlob.value = buildIcoBlob(pngDataArray)
      outputUrl.value = URL.createObjectURL(outputBlob.value)
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Conversion failed'
    } finally {
      isConverting.value = false
    }
  }

  function buildIcoBlob(images: Array<{ size: number; data: Uint8Array }>): Blob {
    const count = images.length
    const headerSize = 6
    const dirEntrySize = 16
    const dirSize = dirEntrySize * count
    let dataOffset = headerSize + dirSize

    const entries = images.map((img) => {
      const entry = {
        offset: dataOffset,
        size: img.data.length,
      }
      dataOffset += img.data.length
      return entry
    })

    const totalSize = dataOffset
    const buffer = new ArrayBuffer(totalSize)
    const view = new DataView(buffer)

    // ICONDIR header
    view.setUint16(0, 0, true) // reserved
    view.setUint16(2, 1, true) // type = ICO
    view.setUint16(4, count, true) // image count

    // ICONDIRENTRY entries
    let offset = headerSize
    for (let i = 0; i < count; i++) {
      const img = images[i]
      const entry = entries[i]
      view.setUint8(offset, img.size >= 256 ? 0 : img.size) // width
      view.setUint8(offset + 1, img.size >= 256 ? 0 : img.size) // height
      view.setUint8(offset + 2, 0) // color count
      view.setUint8(offset + 3, 0) // reserved
      view.setUint16(offset + 4, 1, true) // planes
      view.setUint16(offset + 6, 32, true) // bits per pixel
      view.setUint32(offset + 8, entry.size, true) // size of image data
      view.setUint32(offset + 12, entry.offset, true) // offset to image data
      offset += dirEntrySize
    }

    // Image data
    for (const img of images) {
      const uint8 = new Uint8Array(buffer)
      uint8.set(img.data, entries[images.indexOf(img)].offset)
    }

    return new Blob([buffer], { type: 'image/x-icon' })
  }

  async function convertToDxf() {
    isConverting.value = true
    error.value = null
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(svgContent.value, 'image/svg+xml')
      const svgEl = doc.querySelector('svg')
      if (!svgEl) throw new Error('Invalid SVG')

      const vb = svgEl.getAttribute('viewBox')?.split(/[\s,]+/).map(Number)
      const maxY = vb && vb.length === 4 ? vb[1] + vb[3] : svgHeight.value

      let entities = ''

      // Helper: get transform
      function parseTransform(el: Element): { tx: number; ty: number } {
        const t = el.getAttribute('transform')
        if (!t) return { tx: 0, ty: 0 }
        const match = t.match(/translate\(\s*([\d.-]+)\s*[, ]\s*([\d.-]+)\s*\)/)
        if (match) return { tx: parseFloat(match[1]), ty: parseFloat(match[2]) }
        return { tx: 0, ty: 0 }
      }

      // Lines
      svgEl.querySelectorAll('line').forEach((el) => {
        const { tx, ty } = parseTransform(el)
        const x1 = parseFloat(el.getAttribute('x1') || '0') + tx
        const y1 = maxY - (parseFloat(el.getAttribute('y1') || '0') + ty)
        const x2 = parseFloat(el.getAttribute('x2') || '0') + tx
        const y2 = maxY - (parseFloat(el.getAttribute('y2') || '0') + ty)
        entities += `0\nLINE\n8\n0\n10\n${x1.toFixed(4)}\n20\n${y1.toFixed(4)}\n11\n${x2.toFixed(4)}\n21\n${y2.toFixed(4)}\n`
      })

      // Rectangles
      svgEl.querySelectorAll('rect').forEach((el) => {
        const { tx, ty } = parseTransform(el)
        const x = parseFloat(el.getAttribute('x') || '0') + tx
        const y = parseFloat(el.getAttribute('y') || '0') + ty
        const w = parseFloat(el.getAttribute('width') || '0')
        const h = parseFloat(el.getAttribute('height') || '0')
        const ry = maxY - y
        const ry2 = maxY - (y + h)
        entities += `0\nLINE\n8\n0\n10\n${x.toFixed(4)}\n20\n${ry.toFixed(4)}\n11\n${(x + w).toFixed(4)}\n21\n${ry.toFixed(4)}\n`
        entities += `0\nLINE\n8\n0\n10\n${(x + w).toFixed(4)}\n20\n${ry.toFixed(4)}\n11\n${(x + w).toFixed(4)}\n21\n${ry2.toFixed(4)}\n`
        entities += `0\nLINE\n8\n0\n10\n${(x + w).toFixed(4)}\n20\n${ry2.toFixed(4)}\n11\n${x.toFixed(4)}\n21\n${ry2.toFixed(4)}\n`
        entities += `0\nLINE\n8\n0\n10\n${x.toFixed(4)}\n20\n${ry2.toFixed(4)}\n11\n${x.toFixed(4)}\n21\n${ry.toFixed(4)}\n`
      })

      // Circles
      svgEl.querySelectorAll('circle').forEach((el) => {
        const { tx, ty } = parseTransform(el)
        const cx = parseFloat(el.getAttribute('cx') || '0') + tx
        const cy = maxY - (parseFloat(el.getAttribute('cy') || '0') + ty)
        const r = parseFloat(el.getAttribute('r') || '0')
        entities += `0\nCIRCLE\n8\n0\n10\n${cx.toFixed(4)}\n20\n${cy.toFixed(4)}\n40\n${r.toFixed(4)}\n`
      })

      // Ellipses
      svgEl.querySelectorAll('ellipse').forEach((el) => {
        const { tx, ty } = parseTransform(el)
        const cx = parseFloat(el.getAttribute('cx') || '0') + tx
        const cy = maxY - (parseFloat(el.getAttribute('cy') || '0') + ty)
        const rx = parseFloat(el.getAttribute('rx') || '0')
        const ry = parseFloat(el.getAttribute('ry') || '0')
        // Approximate ellipse with polyline
        const points: string[] = []
        for (let i = 0; i <= 64; i++) {
          const angle = (i / 64) * 2 * Math.PI
          const px = cx + rx * Math.cos(angle)
          const py = cy + ry * Math.sin(angle)
          points.push(`${px.toFixed(4)}`)
          points.push(`${py.toFixed(4)}`)
        }
        entities += `0\nLWPOLYLINE\n8\n0\n90\n${66}\n70\n${points.join('\n')}\n`
      })

      // Polygons and Polylines
      svgEl.querySelectorAll('polygon, polyline').forEach((el) => {
        const { tx, ty } = parseTransform(el)
        const points = (el.getAttribute('points') || '')
          .trim()
          .split(/[\s,]+/)
          .map(Number)
        const coords: string[] = []
        for (let i = 0; i < points.length - 1; i += 2) {
          coords.push((points[i] + tx).toFixed(4))
          coords.push((maxY - (points[i + 1] + ty)).toFixed(4))
        }
        if (coords.length >= 4) {
          entities += `0\nLWPOLYLINE\n8\n0\n90\n${coords.length / 2}\n70\n${coords.join('\n')}\n`
        }
      })

      // Paths (basic)
      svgEl.querySelectorAll('path').forEach((el) => {
        const { tx, ty } = parseTransform(el)
        const d = el.getAttribute('d') || ''
        // Extract M, L, and Z commands to approximate
        const commands = d.match(/[MLZ][^MLZ]*/gi)
        if (!commands) return

        const coords: string[] = []
        let cx = 0,
          cy = 0

        for (const cmd of commands) {
          const type = cmd[0].toUpperCase()
          const nums = cmd
            .slice(1)
            .trim()
            .split(/[\s,]+/)
            .filter(Boolean)
            .map(Number)

          if (type === 'M' || type === 'L') {
            if (nums.length >= 2) {
              const px = nums[0] + tx
              const py = maxY - (nums[1] + ty)
              if (type === 'M') {
                cx = px
                cy = py
              }
              coords.push(px.toFixed(4))
              coords.push(py.toFixed(4))
              cx = px
              cy = py
            }
          }
        }

        if (coords.length >= 4) {
          entities += `0\nLWPOLYLINE\n8\n0\n90\n${coords.length / 2}\n70\n${coords.join('\n')}\n`
        }
      })

      const dxf = `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n${entities}0\nENDSEC\n0\nEOF\n`
      outputBlob.value = new Blob([dxf], { type: 'application/dxf' })
      outputUrl.value = URL.createObjectURL(outputBlob.value)
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Conversion failed'
    } finally {
      isConverting.value = false
    }
  }

  async function convert() {
    switch (format) {
      case 'png':
        return convertToPng()
      case 'jpg':
        return convertToJpg()
      case 'webp':
        return convertToWebp()
      case 'pdf':
        return convertToPdf()
      case 'ico':
        return convertToIco()
      case 'dxf':
        return convertToDxf()
    }
  }

  function download(customFilename?: string) {
    if (!outputBlob.value) return
    const ext = format === 'ico' ? 'ico' : format === 'dxf' ? 'dxf' : format === 'pdf' ? 'pdf' : format === 'jpg' ? 'jpg' : format === 'webp' ? 'webp' : 'png'
    const name = customFilename || `${fileName.value}.${ext}`
    const a = document.createElement('a')
    a.href = outputUrl.value || URL.createObjectURL(outputBlob.value)
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  function reset() {
    svgFile.value = null
    svgContent.value = ''
    svgWidth.value = 0
    svgHeight.value = 0
    outputWidth.value = 0
    outputHeight.value = 0
    scale.value = 2
    background.value = 'transparent'
    quality.value = 90
    isConverting.value = false
    outputBlob.value = null
    error.value = null
    if (outputUrl.value) {
      URL.revokeObjectURL(outputUrl.value)
      outputUrl.value = ''
    }
    fileName.value = 'converted'
  }

  return {
    svgFile,
    svgContent,
    svgWidth,
    svgHeight,
    outputWidth,
    outputHeight,
    scale,
    background,
    quality,
    isConverting,
    outputBlob,
    outputUrl,
    error,
    fileName,
    loadSvgFile,
    convert,
    download,
    reset,
  }
}