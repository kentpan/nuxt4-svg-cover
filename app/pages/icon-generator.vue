<script setup lang="ts">
import { Zap, UserX, ShieldCheck, ArrowDown, Download, RotateCcw, Type, Palette, Maximize2, Move, ImagePlus, X, Code } from 'lucide-vue-next'

const { t, tm } = useI18n()

useHead({
  title: t('iconGen.metaTitle'),
  meta: [
    { name: 'description', content: t('iconGen.metaDescription') },
  ],
})

const faqItems = computed(() => {
  const raw = tm('iconGen.faq')
  if (!Array.isArray(raw)) return []
  return Array.from({ length: raw.length }, (_, i) => ({
    question: t(`iconGen.faq.${i}.q`),
    answer: t(`iconGen.faq.${i}.a`),
  }))
})

const seo2Items = computed(() => {
  const raw = tm('iconGen.seo2Items')
  if (!Array.isArray(raw)) return []
  return Array.from({ length: raw.length }, (_, i) => ({
    label: t(`iconGen.seo2Items.${i}.label`),
    desc: t(`iconGen.seo2Items.${i}.desc`),
  }))
})

// Foreground type: 'text' or 'icon'
const fgType = ref<'text' | 'icon'>('text')

// Icon configuration
const config = ref({
  text: 'A',
  bgColorHex: '#4f6ef2',
  bgOpacity: 1,
  textColor: '#ffffff',
  bgRadius: 40,
  fontSize: 80,
  fontFamily: 'Arial, sans-serif',
})

// Imported SVG icon state
const importedSvgContent = ref('')
const importedSvgFileName = ref('')
const iconSize = ref(80)
const iconOpacity = ref(1)
const iconColor = ref('#ffffff')
const svgFileInput = ref<HTMLInputElement>()

// SVG code input
const svgCodeInput = ref('')
const svgInputTab = ref<'file' | 'code'>('file')
const svgCodeError = ref(false)

// Gradient settings for icon
const iconFillMode = ref<'solid' | 'gradient'>('solid')
const iconGradColor1 = ref('#ffffff')
const iconGradColor2 = ref('#4f6ef2')
const iconGradAngle = ref(180)
const iconGradOpacity1 = ref(1)
const iconGradOpacity2 = ref(1)
const useOpacityGradient = ref(false)

// Scaling
const iconScaleX = ref(1)
const iconScaleY = ref(1)

const radiusOptions = [
  { label: '0', value: 0 },
  { label: '15%', value: 15 },
  { label: '22%', value: 40 },
  { label: '50%', value: 90 },
]

const fontOptions = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier', value: '"Courier New", monospace' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
]

// Foreground position (shared by text and icon)
const fgPos = ref({ x: 90, y: 90 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const svgContainer = ref<HTMLElement>()

// Computed bg color with opacity
const bgColorComputed = computed(() => {
  const hex = config.value.bgColorHex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${config.value.bgOpacity})`
})

// Hex to rgba helper
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// Compute gradient angle to SVG linearGradient x1/y1/x2/y2
function angleToGradientCoords(angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  const x1 = 50 - Math.cos(rad) * 50
  const y1 = 50 - Math.sin(rad) * 50
  const x2 = 50 + Math.cos(rad) * 50
  const y2 = 50 + Math.sin(rad) * 50
  return { x1, y1, x2, y2 }
}

// Unique gradient ID for this page instance
const gradId = `ig${Math.random().toString(36).slice(2, 8)}`

// Extract inner SVG content (strip <svg> wrapper) for embedding
const embeddedSvgInner = computed(() => {
  if (!importedSvgContent.value) return ''
  const str = importedSvgContent.value
  // Try to extract content between <svg>...</svg>
  const match = str.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)
  if (match) {
    // Extract viewBox from original SVG for aspect ratio
    const vbMatch = str.match(/viewBox="([^"]+)"/i)
    const wMatch = str.match(/\bwidth="([^"]+)"/i)
    const hMatch = str.match(/\bheight="([^"]+)"/i)
    let vb = vbMatch ? vbMatch[1] : ''
    // If no viewBox, try to derive from width/height
    if (!vb && wMatch && hMatch) {
      vb = `0 0 ${parseFloat(wMatch[1]) || 24} ${parseFloat(hMatch[1]) || 24}`
    }
    if (!vb) vb = '0 0 24 24'
    return { content: match[1].trim(), viewBox: vb }
  }
  return ''
})

// Re-color SVG internal fill/stroke attributes directly
function recolorSvgContent(content: string, newColor: string): string {
  // Replace fill="xxx" (keep none and url() unchanged)
  let s = content.replace(/fill="([^"]+)"/g, (m, v) => {
    if (v === 'none' || v.startsWith('url(')) return m
    return `fill="${newColor}"`
  })
  s = s.replace(/fill='([^']+)'/g, (m, v) => {
    if (v === 'none' || v.startsWith('url(')) return m
    return `fill="${newColor}"`
  })
  // Replace stroke="xxx"
  s = s.replace(/stroke="([^"]+)"/g, (m, v) => {
    if (v === 'none' || v.startsWith('url(')) return m
    return `stroke="${newColor}"`
  })
  s = s.replace(/stroke='([^']+)'/g, (m, v) => {
    if (v === 'none' || v.startsWith('url(')) return m
    return `stroke="${newColor}"`
  })
  return s
}

// Recolored content for preview (reactive)
const recoloredContent = computed(() => {
  if (!embeddedSvgInner.value) return ''
  const raw = (embeddedSvgInner.value as any).content
  if (iconFillMode.value === 'gradient') {
    return recolorSvgContent(raw, `url(#${gradId})`)
  }
  return recolorSvgContent(raw, iconColor.value)
})

// Minify SVG inner content for export
function minifySvgContent(svgStr: string): string {
  let s = svgStr
  // Remove comments
  s = s.replace(/<!--[\s\S]*?-->/g, '')
  // Remove DOCTYPE
  s = s.replace(/<!DOCTYPE[^>]*>/gi, '')
  // Remove xml declaration
  s = s.replace(/<\?xml[^?]*\?>/gi, '')
  // Remove metadata elements
  s = s.replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
  // Remove desc elements
  s = s.replace(/<desc[\s\S]*?<\/desc>/gi, '')
  // Remove title elements
  s = s.replace(/<title[\s\S]*?<\/title>/gi, '')
  // Remove defs that only contain unused stuff (keep gradients)
  // Actually, for embedded SVG, we strip all defs since we override fill
  s = s.replace(/<defs[\s\S]*?<\/defs>/gi, '')
  // Remove class attributes
  s = s.replace(/\s+class="[^"]*"/g, '')
  // Remove style attributes
  s = s.replace(/\s+style="[^"]*"/g, '')
  // Remove id attributes (keep gradient ids but those won't be here)
  s = s.replace(/\s+id="[^"]*"/g, '')
  // Remove data-* attributes
  s = s.replace(/\s+data-[\w-]+="[^"]*"/g, '')
  // Remove clip-path references (we don't use them)
  s = s.replace(/\s+clip-path="[^"]*"/g, '')
  // Remove mask references
  s = s.replace(/\s+mask="[^"]*"/g, '')
  // Remove xmlns attributes from inner elements (already in root svg)
  s = s.replace(/\s+xmlns[:\w]*="[^"]*"/g, '')
  // Remove xml:space attributes
  s = s.replace(/\s+xml:\w+="[^"]*"/g, '')
  // Remove empty g elements
  s = s.replace(/<g>\s*<\/g>/g, '')
  // Collapse multiple whitespace
  s = s.replace(/\s{2,}/g, ' ')
  // Remove whitespace between tags
  s = s.replace(/>\s+</g, '><')
  // Trim
  s = s.trim()
  return s
}

// Parse SVG file
function handleSvgFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result as string
    if (text && /<svg[\s>]/i.test(text)) {
      importedSvgContent.value = text
      importedSvgFileName.value = file.name
      fgType.value = 'icon'
    }
    input.value = ''
  }
  reader.onerror = () => {
    importedSvgContent.value = ''
    importedSvgFileName.value = ''
    input.value = ''
  }
  reader.readAsText(file)
}

// Apply SVG code input
function applySvgCode() {
  const code = svgCodeInput.value.trim()
  if (code && /<svg[\s>]/i.test(code)) {
    importedSvgContent.value = code
    importedSvgFileName.value = 'pasted-svg'
    fgType.value = 'icon'
    svgCodeError.value = false
  } else {
    svgCodeError.value = true
  }
}

function removeImportedIcon() {
  importedSvgContent.value = ''
  importedSvgFileName.value = ''
  svgCodeInput.value = ''
  svgCodeError.value = false
  fgType.value = 'text'
}

// Drag handlers
function startDrag(event: MouseEvent | TouchEvent) {
  isDragging.value = true
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
  dragStart.value = { x: clientX, y: clientY }
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend', stopDrag)
}

function onDrag(event: MouseEvent | TouchEvent) {
  if (!isDragging.value) return
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
  const dx = clientX - dragStart.value.x
  const dy = clientY - dragStart.value.y
  let newX = fgPos.value.x + dx
  let newY = fgPos.value.y + dy
  newX = Math.max(0, Math.min(180, newX))
  newY = Math.max(0, Math.min(180, newY))
  fgPos.value = { x: newX, y: newY }
  dragStart.value = { x: clientX, y: clientY }
}

function stopDrag() {
  isDragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
}

// Generate gradient defs element
function generateGradientDef(id: string) {
  if (iconFillMode.value !== 'gradient') return ''
  const gc = angleToGradientCoords(iconGradAngle.value)
  const stop1Color = useOpacityGradient.value
    ? hexToRgba(iconGradColor1.value, iconGradOpacity1.value)
    : hexToRgba(iconGradColor1.value, 1)
  const stop2Color = useOpacityGradient.value
    ? hexToRgba(iconGradColor2.value, iconGradOpacity2.value)
    : hexToRgba(iconGradColor2.value, 1)
  return `<defs><linearGradient id="${id}" x1="${gc.x1}%" y1="${gc.y1}%" x2="${gc.x2}%" y2="${gc.y2}%"><stop offset="0%" stop-color="${stop1Color}"/><stop offset="100%" stop-color="${stop2Color}"/></linearGradient></defs>`
}

// Generate SVG string
function generateSvgString() {
  const exportGradId = `g${Date.now().toString(36)}`
  let defs = ''
  let foreground = ''

  if (fgType.value === 'text') {
    foreground = `<text x="${Math.round(fgPos.value.x)}" y="${Math.round(fgPos.value.y)}" fill="${config.value.textColor}" font-size="${config.value.fontSize}" font-family="${config.value.fontFamily}" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${escapeXml(config.value.text)}</text>`
  } else if (embeddedSvgInner.value) {
    const size = iconSize.value
    const raw = (embeddedSvgInner.value as any).content
    const sx = size / 24 * iconScaleX.value
    const sy = size / 24 * iconScaleY.value
    const opacityAttr = iconOpacity.value < 1 ? ` opacity="${iconOpacity.value}"` : ''

    // Determine fill value and recolor inner elements directly
    let recoloredInner = ''
    if (iconFillMode.value === 'gradient') {
      defs = generateGradientDef(exportGradId)
      recoloredInner = recolorSvgContent(raw, `url(#${exportGradId})`)
    } else {
      recoloredInner = recolorSvgContent(raw, iconColor.value)
    }

    const inner = minifySvgContent(recoloredInner)

    foreground = `<g transform="translate(${Math.round(fgPos.value.x - (size * iconScaleX.value) / 2)},${Math.round(fgPos.value.y - (size * iconScaleY.value) / 2)}) scale(${sx},${sy})"${opacityAttr}>${inner}</g>`
  }

  // Build compact SVG
  let svg = `<svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">`
  if (defs) svg += defs
  svg += `<rect width="180" height="180" rx="${config.value.bgRadius}" fill="${bgColorComputed.value}"/>`
  svg += foreground
  svg += `</svg>`
  return svg
}

function escapeXml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Download SVG
function downloadSvg() {
  const svgContent = generateSvgString()
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const name = fgType.value === 'text'
    ? `icon-${config.value.text || 'untitled'}.svg`
    : `icon-${importedSvgFileName.value.replace(/\.svg$/i, '') || 'untitled'}.svg`
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Reset to defaults
function resetConfig() {
  config.value = {
    text: 'A',
    bgColorHex: '#4f6ef2',
    bgOpacity: 1,
    textColor: '#ffffff',
    bgRadius: 40,
    fontSize: 80,
    fontFamily: 'Arial, sans-serif',
  }
  fgPos.value = { x: 90, y: 90 }
  fgType.value = 'text'
  importedSvgContent.value = ''
  importedSvgFileName.value = ''
  iconSize.value = 80
  iconOpacity.value = 1
  iconColor.value = '#ffffff'
  svgCodeInput.value = ''
  svgCodeError.value = false
  svgInputTab.value = 'file'
  iconFillMode.value = 'solid'
  iconGradColor1.value = '#ffffff'
  iconGradColor2.value = '#4f6ef2'
  iconGradAngle.value = 180
  iconGradOpacity1.value = 1
  iconGradOpacity2.value = 1
  useOpacityGradient.value = false
  iconScaleX.value = 1
  iconScaleY.value = 1
}

function scrollToGenerator() {
  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-hero-bg pt-10 sm:pt-16 pb-12 sm:pb-20 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <div class="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-badge-bg text-badge-fg text-xs font-medium">
            <Zap class="w-3.5 h-3.5" />
            {{ t('common.freeToUse') }}
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-badge-bg text-badge-fg text-xs font-medium">
            <UserX class="w-3.5 h-3.5" />
            {{ t('common.noSignup') }}
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-badge-bg text-badge-fg text-xs font-medium">
            <ShieldCheck class="w-3.5 h-3.5" />
            {{ t('common.privacyFriendly') }}
          </span>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 text-balance">
          {{ t('iconGen.heroTitle') }}
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-muted-foreground mb-8">
          {{ t('iconGen.heroSubtitle') }}
        </p>

        <button
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
          @click="scrollToGenerator"
        >
          {{ t('common.startConverting') }}
          <ArrowDown class="w-4 h-4" />
        </button>
      </div>
    </section>

    <!-- Icon Generator Tool -->
    <section id="generator" class="py-12 sm:py-16 px-4 bg-background">
      <div class="max-w-5xl mx-auto">
        <div class="flex flex-col md:flex-row gap-8">

          <!-- Left: Control Panel -->
          <div class="w-full md:w-[360px] shrink-0 space-y-5">
            <h2 class="text-xl font-bold text-foreground flex items-center gap-2">
              <Type class="w-5 h-5 text-primary" />
              {{ t('iconGen.panelTitle') }}
            </h2>

            <!-- Foreground Type Toggle -->
            <div>
              <label class="block text-sm font-medium text-foreground mb-1.5">{{ t('iconGen.fgTypeLabel') }}</label>
              <div class="flex gap-2">
                <button
                  class="flex-1 px-3 py-2 text-sm rounded-lg border transition-all duration-150 font-medium"
                  :class="fgType === 'text'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'"
                  @click="fgType = 'text'"
                >
                  {{ t('iconGen.fgTypeText') }}
                </button>
                <button
                  class="flex-1 px-3 py-2 text-sm rounded-lg border transition-all duration-150 font-medium"
                  :class="fgType === 'icon'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'"
                  @click="fgType = 'icon'"
                >
                  {{ t('iconGen.fgTypeIcon') }}
                </button>
              </div>
            </div>

            <!-- Text Settings (visible when text mode) -->
            <template v-if="fgType === 'text'">
              <!-- Text Input -->
              <div>
                <label class="block text-sm font-medium text-foreground mb-1.5">{{ t('iconGen.textLabel') }}</label>
                <input
                  v-model="config.text"
                  maxlength="5"
                  class="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors text-lg"
                  :placeholder="t('iconGen.textPlaceholder')"
                />
              </div>

              <!-- Font Size -->
              <div>
                <label class="flex items-center justify-between text-sm font-medium text-foreground mb-1.5">
                  <span class="flex items-center gap-1.5">
                    <Maximize2 class="w-4 h-4 text-muted-foreground" />
                    {{ t('iconGen.fontSizeLabel') }}
                  </span>
                  <span class="text-primary font-mono">{{ config.fontSize }}px</span>
                </label>
                <input
                  type="range"
                  v-model.number="config.fontSize"
                  min="16" max="140"
                  class="w-full h-2 accent-primary"
                />
              </div>

              <!-- Font Family -->
              <div>
                <label class="block text-sm font-medium text-foreground mb-1.5">{{ t('iconGen.fontFamilyLabel') }}</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="opt in fontOptions"
                    :key="opt.value"
                    @click="config.fontFamily = opt.value"
                    :class="[
                      'px-3 py-1.5 text-sm rounded-lg border transition-all duration-150 text-center',
                      config.fontFamily === opt.value
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                    ]"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <!-- Text Color -->
              <div>
                <label class="block text-sm font-medium text-foreground mb-1.5">{{ t('iconGen.textColorLabel') }}</label>
                <div class="relative inline-block">
                  <input
                    type="color"
                    v-model="config.textColor"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    class="w-full h-10 rounded-lg border-2 border-border cursor-pointer shadow-sm flex items-center justify-center text-xs font-mono text-muted-foreground"
                    :style="{ backgroundColor: config.textColor }"
                  >
                    {{ config.textColor }}
                  </div>
                </div>
              </div>
            </template>

            <!-- SVG Icon Settings (visible when icon mode) -->
            <template v-else>
              <!-- Import Status / Button -->
              <div v-if="!importedSvgContent" class="space-y-3">
                <label class="block text-sm font-medium text-foreground mb-1.5">{{ t('iconGen.importSvgLabel') }}</label>
                <!-- Tab: File / Code -->
                <div class="flex gap-2">
                  <button
                    class="flex-1 px-3 py-1.5 text-xs rounded-lg border transition-all duration-150 font-medium"
                    :class="svgInputTab === 'file'
                      ? 'bg-primary/10 text-primary border-primary/40'
                      : 'bg-background text-muted-foreground border-border hover:bg-accent'"
                    @click="svgInputTab = 'file'"
                  >
                    <span class="flex items-center justify-center gap-1">
                      <ImagePlus class="w-3.5 h-3.5" />
                      {{ t('iconGen.importTabFile') }}
                    </span>
                  </button>
                  <button
                    class="flex-1 px-3 py-1.5 text-xs rounded-lg border transition-all duration-150 font-medium"
                    :class="svgInputTab === 'code'
                      ? 'bg-primary/10 text-primary border-primary/40'
                      : 'bg-background text-muted-foreground border-border hover:bg-accent'"
                    @click="svgInputTab = 'code'"
                  >
                    <span class="flex items-center justify-center gap-1">
                      <Code class="w-3.5 h-3.5" />
                      {{ t('iconGen.importTabCode') }}
                    </span>
                  </button>
                </div>
                <!-- File upload -->
                <button
                  v-if="svgInputTab === 'file'"
                  class="w-full border-2 border-dashed border-border rounded-lg px-4 py-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
                  @click="svgFileInput?.click()"
                >
                  <ImagePlus class="w-6 h-6 text-muted-foreground" />
                  <span class="text-sm text-muted-foreground">{{ t('iconGen.importSvgBtn') }}</span>
                  <span class="text-xs text-muted-foreground/70">{{ t('iconGen.importSvgHint') }}</span>
                </button>
                <!-- Code input -->
                <div v-else class="space-y-2">
                  <textarea
                    v-model="svgCodeInput"
                    rows="5"
                    class="w-full border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors text-xs font-mono resize-y"
                    :class="svgCodeError ? 'border-destructive' : 'border-border'"
                    :placeholder="t('iconGen.importCodePlaceholder')"
                    @keydown.ctrl.enter="applySvgCode"
                    @keydown.meta.enter="applySvgCode"
                  />
                  <button
                    class="w-full px-3 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    @click="applySvgCode"
                  >
                    {{ t('iconGen.importCodeBtn') }}
                  </button>
                  <p v-if="svgCodeError" class="text-xs text-destructive">{{ t('iconGen.importSvgError') }}</p>
                </div>
              </div>
              <div v-else class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-foreground">{{ t('iconGen.importSvgLabel') }}</label>
                  <button
                    class="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                    @click="removeImportedIcon"
                  >
                    <X class="w-3 h-3" />
                    {{ t('iconGen.removeIcon') }}
                  </button>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border">
                  <span class="w-5 h-5 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" class="w-5 h-5" v-html="embeddedSvgInner ? (embeddedSvgInner as any).content : ''" :fill="iconColor" ></svg>
                  </span>
                  <span class="text-sm text-foreground truncate flex-1">{{ importedSvgFileName }}</span>
                  <span class="text-xs text-green-600 font-medium">{{ t('iconGen.importSvgSuccess') }}</span>
                </div>

                <!-- Icon Size -->
                <div>
                  <label class="flex items-center justify-between text-sm font-medium text-foreground mb-1.5">
                    <span>{{ t('iconGen.iconSizeLabel') }}</span>
                    <span class="text-primary font-mono">{{ iconSize }}px</span>
                  </label>
                  <input
                    type="range"
                    v-model.number="iconSize"
                    min="1" max="100"
                    class="w-full h-2 accent-primary"
                  />
                </div>

                <!-- Icon Opacity -->
                <div>
                  <label class="flex items-center justify-between text-sm font-medium text-foreground mb-1.5">
                    <span>{{ t('iconGen.iconOpacityLabel') }}</span>
                    <span class="text-primary font-mono">{{ (iconOpacity * 100).toFixed(0) }}%</span>
                  </label>
                  <input
                    type="range"
                    v-model.number="iconOpacity"
                    min="0" max="1" step="0.05"
                    class="w-full h-2 accent-primary"
                  />
                </div>

                <!-- Fill Mode: Solid / Gradient -->
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1.5">{{ t('iconGen.iconFillModeLabel') }}</label>
                  <div class="flex gap-2">
                    <button
                      class="flex-1 px-3 py-2 text-sm rounded-lg border transition-all duration-150 font-medium"
                      :class="iconFillMode === 'solid'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'"
                      @click="iconFillMode = 'solid'"
                    >
                      {{ t('iconGen.fillModeSolid') }}
                    </button>
                    <button
                      class="flex-1 px-3 py-2 text-sm rounded-lg border transition-all duration-150 font-medium"
                      :class="iconFillMode === 'gradient'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'"
                      @click="iconFillMode = 'gradient'"
                    >
                      {{ t('iconGen.fillModeGradient') }}
                    </button>
                  </div>
                </div>

                <!-- Solid Color (visible when solid mode) -->
                <div v-if="iconFillMode === 'solid'">
                  <label class="block text-sm font-medium text-foreground mb-1.5">{{ t('iconGen.iconColorLabel') }}</label>
                  <div class="relative inline-block w-full">
                    <input
                      type="color"
                      v-model="iconColor"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      class="w-full h-10 rounded-lg border-2 border-border cursor-pointer shadow-sm flex items-center justify-center text-xs font-mono text-muted-foreground"
                      :style="{ backgroundColor: iconColor }"
                    >
                      {{ iconColor }}
                    </div>
                  </div>
                </div>

                <!-- Gradient Settings (visible when gradient mode) -->
                <template v-else>
                  <!-- Gradient Colors -->
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">{{ t('iconGen.gradColorsLabel') }}</label>
                    <div class="flex items-center gap-3">
                      <div class="relative flex-1">
                        <input
                          type="color"
                          v-model="iconGradColor1"
                          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div
                          class="w-full h-9 rounded-lg border-2 border-border cursor-pointer shadow-sm"
                          :style="{ backgroundColor: iconGradColor1 }"
                        />
                      </div>
                      <span class="text-muted-foreground text-xs">→</span>
                      <div class="relative flex-1">
                        <input
                          type="color"
                          v-model="iconGradColor2"
                          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div
                          class="w-full h-9 rounded-lg border-2 border-border cursor-pointer shadow-sm"
                          :style="{ backgroundColor: iconGradColor2 }"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Gradient Angle -->
                  <div>
                    <label class="flex items-center justify-between text-sm font-medium text-foreground mb-1.5">
                      <span>{{ t('iconGen.gradAngleLabel') }}</span>
                      <span class="text-primary font-mono">{{ iconGradAngle }}°</span>
                    </label>
                    <input
                      type="range"
                      v-model.number="iconGradAngle"
                      min="0" max="360" step="5"
                      class="w-full h-2 accent-primary"
                    />
                  </div>

                  <!-- Opacity Gradient Toggle -->
                  <div class="flex items-center justify-between">
                    <label class="text-sm font-medium text-foreground">{{ t('iconGen.gradOpacityLabel') }}</label>
                    <button
                      class="relative w-10 h-5 rounded-full transition-colors"
                      :class="useOpacityGradient ? 'bg-primary' : 'bg-border'"
                      @click="useOpacityGradient = !useOpacityGradient"
                    >
                      <span
                        class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform"
                        :class="useOpacityGradient ? 'translate-x-0.5' : '-translate-x-5'"
                      />
                    </button>
                  </div>

                  <!-- Opacity Gradient Sliders (visible when enabled) -->
                  <template v-if="useOpacityGradient">
                    <div>
                      <label class="flex items-center justify-between text-sm font-medium text-foreground mb-1.5">
                        <span>{{ t('iconGen.gradOpacity1Label') }}</span>
                        <span class="text-primary font-mono">{{ (iconGradOpacity1 * 100).toFixed(0) }}%</span>
                      </label>
                      <input
                        type="range"
                        v-model.number="iconGradOpacity1"
                        min="0" max="1" step="0.05"
                        class="w-full h-2 accent-primary"
                      />
                    </div>
                    <div>
                      <label class="flex items-center justify-between text-sm font-medium text-foreground mb-1.5">
                        <span>{{ t('iconGen.gradOpacity2Label') }}</span>
                        <span class="text-primary font-mono">{{ (iconGradOpacity2 * 100).toFixed(0) }}%</span>
                      </label>
                      <input
                        type="range"
                        v-model.number="iconGradOpacity2"
                        min="0" max="1" step="0.05"
                        class="w-full h-2 accent-primary"
                      />
                    </div>
                  </template>
                </template>

                <!-- Horizontal / Vertical Scale -->
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1.5">{{ t('iconGen.iconScaleLabel') }}</label>
                  <div class="space-y-3">
                    <!-- Horizontal -->
                    <div>
                      <div class="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>{{ t('iconGen.scaleHorizontal') }}</span>
                        <span class="font-mono text-foreground">{{ iconScaleX.toFixed(2) }}x</span>
                      </div>
                      <input
                        type="range"
                        v-model.number="iconScaleX"
                        min="0.2" max="2" step="0.05"
                        class="w-full h-2 accent-primary"
                      />
                    </div>
                    <!-- Vertical -->
                    <div>
                      <div class="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>{{ t('iconGen.scaleVertical') }}</span>
                        <span class="font-mono text-foreground">{{ iconScaleY.toFixed(2) }}x</span>
                      </div>
                      <input
                        type="range"
                        v-model.number="iconScaleY"
                        min="0.2" max="2" step="0.05"
                        class="w-full h-2 accent-primary"
                      />
                    </div>
                    <!-- Lock / Reset Scale -->
                    <div class="flex gap-2">
                      <button
                        class="flex-1 px-2 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center justify-center gap-1"
                        @click="iconScaleX = 1; iconScaleY = 1"
                      >
                        {{ t('iconGen.scaleReset') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Hidden file input -->
            <input
              ref="svgFileInput"
              type="file"
              accept=".svg,image/svg+xml"
              class="hidden"
              @change="handleSvgFileUpload"
            />

            <!-- Background Color -->
            <div>
              <label class="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
                <Palette class="w-4 h-4 text-muted-foreground" />
                {{ t('iconGen.bgColorLabel') }}
              </label>
              <div class="flex items-center gap-3">
                <div class="relative">
                  <input
                    type="color"
                    v-model="config.bgColorHex"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    class="w-10 h-10 rounded-lg border-2 border-border cursor-pointer shadow-sm"
                    :style="{ backgroundColor: config.bgColorHex }"
                  />
                </div>
                <input
                  type="range"
                  v-model.number="config.bgOpacity"
                  min="0" max="1" step="0.05"
                  class="flex-1 h-2 accent-primary"
                />
                <span class="text-xs text-muted-foreground font-mono w-10 text-right">{{ (config.bgOpacity * 100).toFixed(0) }}%</span>
              </div>
            </div>

            <!-- Border Radius -->
            <div>
              <label class="block text-sm font-medium text-foreground mb-1.5">{{ t('iconGen.radiusLabel') }}</label>
              <div class="flex gap-2">
                <button
                  v-for="opt in radiusOptions"
                  :key="opt.value"
                  @click="config.bgRadius = opt.value"
                  :class="[
                    'px-4 py-1.5 text-sm rounded-lg border transition-all duration-150 font-medium',
                    config.bgRadius === opt.value
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                  ]"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="pt-3 border-t space-y-2">
              <button
                @click="downloadSvg"
                class="w-full bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Download class="w-4 h-4" />
                {{ t('iconGen.downloadSvg') }}
              </button>
              <button
                @click="resetConfig"
                class="w-full bg-muted text-muted-foreground font-medium py-2 px-4 rounded-lg hover:bg-accent hover:text-foreground transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                {{ t('iconGen.reset') }}
              </button>
            </div>
          </div>

          <!-- Right: Preview Area -->
          <div class="flex-1 flex flex-col items-center">
            <div
              class="w-full rounded-xl border-2 border-dashed border-border p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]"
              style="background-image: linear-gradient(45deg, hsl(var(--muted)/0.3) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--muted)/0.3) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--muted)/0.3) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--muted)/0.3) 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;"
            >
              <span class="absolute top-3 left-3 text-xs text-muted-foreground font-medium">{{ t('iconGen.previewLabel') }}</span>

              <!-- SVG Preview -->
              <div
                ref="svgContainer"
                class="shadow-lg cursor-move select-none rounded-sm"
                style="width: 180px; height: 180px;"
              >
                <svg
                  viewBox="0 0 180 180"
                  xmlns="http://www.w3.org/2000/svg"
                  width="180"
                  height="180"
                  @mouseup="stopDrag"
                  @mouseleave="stopDrag"
                  @touchend="stopDrag"
                >
                  <!-- Gradient defs for preview -->
                  <defs v-if="fgType === 'icon' && iconFillMode === 'gradient'">
                    <linearGradient
                      :id="gradId"
                      :x1="angleToGradientCoords(iconGradAngle).x1 + '%'"
                      :y1="angleToGradientCoords(iconGradAngle).y1 + '%'"
                      :x2="angleToGradientCoords(iconGradAngle).x2 + '%'"
                      :y2="angleToGradientCoords(iconGradAngle).y2 + '%'"
                    >
                      <stop
                        offset="0%"
                        :stop-color="useOpacityGradient ? hexToRgba(iconGradColor1, iconGradOpacity1) : hexToRgba(iconGradColor1, 1)"
                      />
                      <stop
                        offset="100%"
                        :stop-color="useOpacityGradient ? hexToRgba(iconGradColor2, iconGradOpacity2) : hexToRgba(iconGradColor2, 1)"
                      />
                    </linearGradient>
                  </defs>

                  <rect
                    width="180"
                    height="180"
                    :rx="config.bgRadius"
                    :fill="bgColorComputed"
                  />

                  <!-- Text foreground -->
                  <text
                    v-if="fgType === 'text'"
                    :x="fgPos.x"
                    :y="fgPos.y"
                    :fill="config.textColor"
                    :font-size="config.fontSize"
                    :font-family="config.fontFamily"
                    font-weight="bold"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    style="cursor: move; user-select: none;"
                    @mousedown.prevent="startDrag"
                    @touchstart.prevent="startDrag"
                  >
                    {{ config.text }}
                  </text>

                  <!-- SVG icon foreground -->
                  <g
                    v-else-if="embeddedSvgInner"
                    :transform="`translate(${Math.round(fgPos.x - (iconSize * iconScaleX) / 2)}, ${Math.round(fgPos.y - (iconSize * iconScaleY) / 2)}) scale(${iconSize / 24 * iconScaleX}, ${iconSize / 24 * iconScaleY})`"
                    :opacity="iconOpacity < 1 ? iconOpacity : undefined"
                    style="cursor: move; user-select: none;"
                    @mousedown.prevent="startDrag"
                    @touchstart.prevent="startDrag"
                    v-html="recoloredContent"
                  />
                </svg>
              </div>

              <!-- Drag hint -->
              <p class="mt-6 text-xs text-muted-foreground flex items-center gap-1.5">
                <Move class="w-3.5 h-3.5" />
                {{ t('iconGen.dragHint') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SEO Content Section -->
    <section class="py-16 px-4 bg-background">
      <div class="max-w-3xl mx-auto space-y-12">
        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">{{ t('iconGen.seo1Title') }}</h2>
          <p class="text-muted-foreground leading-relaxed">
            {{ t('iconGen.seo1Content') }}
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">{{ t('iconGen.seo2Title') }}</h2>
          <ul class="space-y-3 text-muted-foreground">
            <li v-for="(item, i) in seo2Items" :key="i" class="flex items-start gap-3">
              <span class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span><strong class="text-foreground">{{ item.label }}</strong> — {{ item.desc }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 px-4 bg-hero-bg">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-foreground mb-8 text-center">{{ t('common.frequentlyAskedQuestions') }}</h2>
        <FaqAccordion :items="faqItems" />
      </div>
    </section>
  </div>
</template>