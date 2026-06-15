export function useDxfToSvg() {
  const dxfFile = ref<File | null>(null)
  const isConverting = ref(false)
  const svgOutput = ref('')
  const outputBlob = ref<Blob | null>(null)
  const outputUrl = ref('')
  const error = ref<string | null>(null)
  const entityCount = ref(0)

  async function loadDxfFile(file: File) {
    error.value = null
    svgOutput.value = ''
    outputBlob.value = null
    if (outputUrl.value) URL.revokeObjectURL(outputUrl.value)
    outputUrl.value = ''
    entityCount.value = 0
    dxfFile.value = file
  }

  async function convert() {
    isConverting.value = true
    error.value = null

    try {
      const text = await dxfFile.value!.text()
      const lines = text.split(/\r?\n/)

      // Parse DXF entities
      const entities: string[] = []
      let i = 0
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

      while (i < lines.length) {
        const line = lines[i].trim()

        if (line === '0' && i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim()

          if (nextLine === 'LINE') {
            i += 2
            let x1 = 0, y1 = 0, x2 = 0, y2 = 0
            while (i < lines.length) {
              const code = lines[i].trim()
              if (code === '0') break
              const val = parseFloat(lines[i + 1]?.trim() || '0')
              if (code === '10') x1 = val
              else if (code === '20') y1 = val
              else if (code === '11') x2 = val
              else if (code === '21') y2 = val
              i += 2
            }
            entities.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="1"/>`)
            minX = Math.min(minX, x1, x2)
            minY = Math.min(minY, y1, y2)
            maxX = Math.max(maxX, x1, x2)
            maxY = Math.max(maxY, y1, y2)
            i-- // Don't skip the '0' we just read
          }
          else if (nextLine === 'CIRCLE') {
            i += 2
            let cx = 0, cy = 0, r = 0
            while (i < lines.length) {
              const code = lines[i].trim()
              if (code === '0') break
              const val = parseFloat(lines[i + 1]?.trim() || '0')
              if (code === '10') cx = val
              else if (code === '20') cy = val
              else if (code === '40') r = val
              i += 2
            }
            entities.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="1"/>`)
            minX = Math.min(minX, cx - r)
            minY = Math.min(minY, cy - r)
            maxX = Math.max(maxX, cx + r)
            maxY = Math.max(maxY, cy + r)
            i--
          }
          else if (nextLine === 'LWPOLYLINE' || nextLine === 'POLYLINE') {
            i += 2
            const points: number[] = []
            let closed = false
            while (i < lines.length) {
              const code = lines[i].trim()
              if (code === '0') break
              const val = parseFloat(lines[i + 1]?.trim() || '0')
              if (code === '10') points.push(val) // X
              else if (code === '20') points.push(val) // Y (skip X pairing)
              else if (code === '70' && val === 1) closed = true
              i += 2
            }
            if (points.length >= 4) {
              // Extract paired x,y coordinates
              const coords: string[] = []
              for (let j = 0; j < points.length - 1; j += 2) {
                coords.push(`${points[j]},${points[j + 1]}`)
                minX = Math.min(minX, points[j])
                minY = Math.min(minY, points[j + 1])
                maxX = Math.max(maxX, points[j])
                maxY = Math.max(maxY, points[j + 1])
              }
              const tag = closed ? 'polygon' : 'polyline'
              entities.push(`<${tag} points="${coords.join(' ')}" fill="none" stroke="currentColor" stroke-width="1" ${closed ? '' : ''}/>`)
            }
            i--
          }
          else if (nextLine === 'ELLIPSE') {
            i += 2
            let cx = 0, cy = 0, majX = 0, minRatio = 1
            while (i < lines.length) {
              const code = lines[i].trim()
              if (code === '0') break
              const val = parseFloat(lines[i + 1]?.trim() || '0')
              if (code === '10') cx = val
              else if (code === '20') cy = val
              else if (code === '40') minRatio = val
              else if (code === '41') majX = val
              i += 2
            }
            const rx = majX
            const ry = majX * minRatio
            entities.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="currentColor" stroke-width="1"/>`)
            minX = Math.min(minX, cx - rx)
            minY = Math.min(minY, cy - ry)
            maxX = Math.max(maxX, cx + rx)
            maxY = Math.max(maxY, cy + ry)
            i--
          }
          else if (nextLine === 'ARC') {
            i += 2
            let cx = 0, cy = 0, r = 0, startAngle = 0, endAngle = 0
            while (i < lines.length) {
              const code = lines[i].trim()
              if (code === '0') break
              const val = parseFloat(lines[i + 1]?.trim() || '0')
              if (code === '10') cx = val
              else if (code === '20') cy = val
              else if (code === '40') r = val
              else if (code === '50') startAngle = val * Math.PI / 180
              else if (code === '51') endAngle = val * Math.PI / 180
              i += 2
            }
            // Convert arc to SVG path
            const x1 = cx + r * Math.cos(startAngle)
            const y1 = cy + r * Math.sin(startAngle)
            const x2 = cx + r * Math.cos(endAngle)
            const y2 = cy + r * Math.sin(endAngle)
            const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0
            entities.push(`<path d="M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}" fill="none" stroke="currentColor" stroke-width="1"/>`)
            minX = Math.min(minX, cx - r, x1, x2)
            minY = Math.min(minY, cy - r, y1, y2)
            maxX = Math.max(maxX, cx + r, x1, x2)
            maxY = Math.max(maxY, cy + r, y1, y2)
            i--
          }
          else if (nextLine === 'POINT') {
            i += 2
            let px = 0, py = 0
            while (i < lines.length) {
              const code = lines[i].trim()
              if (code === '0') break
              const val = parseFloat(lines[i + 1]?.trim() || '0')
              if (code === '10') px = val
              else if (code === '20') py = val
              i += 2
            }
            entities.push(`<circle cx="${px}" cy="${py}" r="1" fill="currentColor"/>`)
            minX = Math.min(minX, px)
            minY = Math.min(minY, py)
            maxX = Math.max(maxX, px)
            maxY = Math.max(maxY, py)
            i--
          }
        }
        i++
      }

      if (entities.length === 0) {
        throw new Error('No supported entities found in DXF file')
      }

      entityCount.value = entities.length

      // Add padding
      const padding = 10
      minX -= padding
      minY -= padding
      maxX += padding
      maxY += padding
      const vbW = maxX - minX
      const vbH = maxY - minY

      // Flip Y axis (DXF Y goes up, SVG Y goes down)
      const flippedEntities = entities.map(e => {
        return e.replace(/y1="([^"]+)"/g, (_, y) => `y1="${maxY - parseFloat(y) + minY}"`)
          .replace(/y2="([^"]+)"/g, (_, y) => `y2="${maxY - parseFloat(y) + minY}"`)
          .replace(/cy="([^"]+)"/g, (_, y) => `cy="${maxY - parseFloat(y) + minY}"`)
          .replace(/points="([^"]+)"/g, (match, pts) => {
            const nums = pts.split(/[\s,]+/).map(Number)
            const flipped = nums.map((n, idx) => idx % 2 === 1 ? (maxY - n + minY) : n)
            return `points="${flipped.join(' ')}"`
          })
          .replace(/d="M ([^ ]+) ([^ ]+) A/g, (_, x, y) => {
            return `d="M ${x} ${maxY - parseFloat(y) + minY} A`
          })
          .replace(/1 ([^ ]+) ([^"]+)"/g, (_, x, y) => {
            return `1 ${x} ${maxY - parseFloat(y) + minY}"`
          })
      })

      svgOutput.value = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${vbW} ${vbH}" width="${Math.round(vbW)}" height="${Math.round(vbH)}">\n${flippedEntities.join('\n')}\n</svg>`

      outputBlob.value = new Blob([svgOutput.value], { type: 'image/svg+xml' })
      outputUrl.value = URL.createObjectURL(outputBlob.value)
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Conversion failed'
    } finally {
      isConverting.value = false
    }
  }

  function download() {
    if (!outputBlob.value) return
    const name = (dxfFile.value?.name || 'drawing').replace(/\.[^.]+$/, '') + '.svg'
    const a = document.createElement('a')
    a.href = outputUrl.value
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  function reset() {
    dxfFile.value = null
    isConverting.value = false
    svgOutput.value = ''
    outputBlob.value = null
    if (outputUrl.value) URL.revokeObjectURL(outputUrl.value)
    outputUrl.value = ''
    error.value = null
    entityCount.value = 0
  }

  return {
    dxfFile,
    isConverting,
    svgOutput,
    outputBlob,
    outputUrl,
    error,
    entityCount,
    loadDxfFile,
    convert,
    download,
    reset,
  }
}