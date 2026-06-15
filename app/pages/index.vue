<script setup lang="ts">
import { Zap, UserX, ShieldCheck, FileImage, Monitor, Globe, Layers, Upload, X, ChevronDown, RotateCcw, Download, Loader2, AlertCircle, RefreshCw } from 'lucide-vue-next'
import type { OutputFormat } from '~/composables/useSvgConverter'

const { t, tm } = useI18n()

useHead({
  title: t('index.metaTitle'),
  meta: [
    {
      name: 'description',
      content: t('index.metaDescription'),
    },
    {
      name: 'keywords',
      content: 'SVG converter, SVG to PNG, SVG to JPG, SVG to WebP, SVG to PDF, SVG to ICO, SVG to DXF, free online converter',
    },
  ],
})

const badges = [
  { icon: Zap, label: t('common.freeToUse') },
  { icon: UserX, label: t('common.noSignup') },
  { icon: ShieldCheck, label: t('common.privacyFriendly') },
  { icon: Zap, label: t('common.fastExport') },
]

const formatCards = [
  {
    title: t('index.formatCards.pngTitle'),
    description: t('index.formatCards.pngDesc'),
    href: '/svg-to-png',
    colorClass: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900',
  },
  {
    title: t('index.formatCards.jpgTitle'),
    description: t('index.formatCards.jpgDesc'),
    href: '/svg-to-jpg',
    colorClass: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
  },
  {
    title: t('index.formatCards.webpTitle'),
    description: t('index.formatCards.webpDesc'),
    href: '/svg-to-webp',
    colorClass: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950 dark:text-green-300 dark:border-green-900',
  },
  {
    title: t('index.formatCards.pdfTitle'),
    description: t('index.formatCards.pdfDesc'),
    href: '/svg-to-pdf',
    colorClass: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950 dark:text-red-300 dark:border-red-900',
  },
  {
    title: t('index.formatCards.icoTitle'),
    description: t('index.formatCards.icoDesc'),
    href: '/svg-to-ico',
    colorClass: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-900',
  },
  {
    title: t('index.formatCards.dxfTitle'),
    description: t('index.formatCards.dxfDesc'),
    href: '/svg-to-dxf',
    colorClass: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-900',
  },
]

const useCases = computed(() => [
  {
    icon: 'Image',
    title: t('index.useCases.logoExport.title'),
    description: t('index.useCases.logoExport.desc'),
  },
  {
    icon: 'Monitor',
    title: t('index.useCases.faviconCreation.title'),
    description: t('index.useCases.faviconCreation.desc'),
  },
  {
    icon: 'Globe',
    title: t('index.useCases.webOptimization.title'),
    description: t('index.useCases.webOptimization.desc'),
  },
  {
    icon: 'FileImage',
    title: t('index.useCases.designDelivery.title'),
    description: t('index.useCases.designDelivery.desc'),
  },
  {
    icon: 'Layers',
    title: t('index.useCases.appAssets.title'),
    description: t('index.useCases.appAssets.desc'),
  },
])

const benefits = computed(() => {
  const raw = tm('index.benefits')
  if (!Array.isArray(raw)) return []
  return Array.from({ length: raw.length }, (_, i) => t(`index.benefits.${i}`))
})

const toolHrefs = [
  '/svg-to-png', '/svg-to-jpg', '/svg-to-webp', '/svg-to-pdf',
  '/svg-to-ico', '/svg-to-dxf', '/png-to-svg', '/dxf-to-svg',
]

const toolList = computed(() => {
  const raw = tm('index.toolList')
  if (!Array.isArray(raw)) return []
  return Array.from({ length: raw.length }, (_, i) => ({
    title: t(`index.toolList.${i}.title`),
    description: t(`index.toolList.${i}.desc`),
    href: toolHrefs[i],
  }))
})

const steps = computed(() => {
  const raw = tm('index.steps')
  if (!Array.isArray(raw)) return []
  return Array.from({ length: raw.length }, (_, i) => ({
    number: i + 1,
    title: t(`index.steps.${i}.title`),
    description: t(`index.steps.${i}.desc`),
  }))
})

const faqItems = computed(() => {
  const raw = tm('index.faq')
  if (!Array.isArray(raw)) return []
  return Array.from({ length: raw.length }, (_, i) => ({
    question: t(`index.faq.${i}.q`),
    answer: t(`index.faq.${i}.a`),
  }))
})

// === Homepage Converter State ===
const heroInputRef = ref<HTMLInputElement | null>(null)
const heroIsDragActive = ref(false)
const showConverter = ref(false)

// Converter state
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
const formatDropdownOpen = ref(false)

const formatOptions = computed(() => [
  { value: 'png' as OutputFormat, label: t('index.formatCards.pngTitle') },
  { value: 'jpg' as OutputFormat, label: t('index.formatCards.jpgTitle') },
  { value: 'webp' as OutputFormat, label: t('index.formatCards.webpTitle') },
  { value: 'pdf' as OutputFormat, label: t('index.formatCards.pdfTitle') },
  { value: 'ico' as OutputFormat, label: t('index.formatCards.icoTitle') },
  { value: 'dxf' as OutputFormat, label: t('index.formatCards.dxfTitle') },
])

const selectedFormat = ref<OutputFormat>('png')
const formatUpper = computed(() => selectedFormat.value.toUpperCase())

const supportsTransparency = computed(() => ['png', 'webp'].includes(selectedFormat.value))
const supportsQuality = computed(() => ['jpg', 'webp'].includes(selectedFormat.value))
const supportsSizeSettings = computed(() => ['png', 'jpg', 'webp', 'ico'].includes(selectedFormat.value))
const isRasterOutput = computed(() => ['png', 'jpg', 'webp'].includes(selectedFormat.value))

const scaleOptions = [1, 2, 3] as const

// Watch scale to update output dimensions
watch(scale, () => {
  outputWidth.value = Math.round(svgWidth.value * scale.value)
  outputHeight.value = Math.round(svgHeight.value * scale.value)
})

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function svgToDataUri(svgText: string): string {
  const encoded = btoa(unescape(encodeURIComponent(svgText)))
  return `data:image/svg+xml;base64,${encoded}`
}

async function renderSvgToCanvas(svgText: string, w: number, h: number, bg: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      if (bg === 'white' || selectedFormat.value === 'jpg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)
      }
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas)
    }
    img.onerror = () => reject(new Error('Failed to render SVG'))
    img.src = svgToDataUri(svgText)
  })
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

function handleHeroUpload(file: File) {
  svgFile.value = file
  error.value = null
  outputBlob.value = null
  if (outputUrl.value) URL.revokeObjectURL(outputUrl.value)
  outputUrl.value = ''

  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result as string
    svgContent.value = text
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'image/svg+xml')
    const svgEl = doc.querySelector('svg')
    if (svgEl) {
      const w = parseFloat(svgEl.getAttribute('width') || '0')
      const h = parseFloat(svgEl.getAttribute('height') || '0')
      const vb = svgEl.getAttribute('viewBox')
      if (w && h) {
        svgWidth.value = w
        svgHeight.value = h
      } else if (vb) {
        const parts = vb.split(/[\s,]+/).map(Number)
        if (parts.length >= 4) {
          svgWidth.value = parts[2]
          svgHeight.value = parts[3]
        }
      }
      if (!svgWidth.value || !svgHeight.value) {
        svgWidth.value = 300
        svgHeight.value = 300
      }
      outputWidth.value = Math.round(svgWidth.value * scale.value)
      outputHeight.value = Math.round(svgHeight.value * scale.value)
    }
    showConverter.value = true
    nextTick(() => {
      document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' })
    })
  }
  reader.readAsText(file)
}

async function handleConvert() {
  isConverting.value = true
  error.value = null
  try {
    const fmt = selectedFormat.value
    if (['png', 'jpg', 'webp', 'ico'].includes(fmt)) {
      const bg = fmt === 'jpg' ? 'white' : background.value
      const canvas = await renderSvgToCanvas(svgContent.value, outputWidth.value, outputHeight.value, bg)
      const mimeType = fmt === 'jpg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png'
      const q = fmt === 'jpg' || fmt === 'webp' ? quality.value / 100 : undefined
      outputBlob.value = await canvasToBlob(canvas, mimeType, q)
      outputUrl.value = URL.createObjectURL(outputBlob.value)
    } else if (fmt === 'pdf') {
      const canvas = await renderSvgToCanvas(svgContent.value, outputWidth.value, outputHeight.value, 'white')
      const dataUrl = canvas.toDataURL('image/png')
      const pxToMm = 0.264583
      const pdfW = outputWidth.value * pxToMm
      const pdfH = outputHeight.value * pxToMm
      const { default: jsPDF } = await import('jspdf')
      const pdf = new jsPDF({
        orientation: pdfW > pdfH ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [pdfW, pdfH],
      })
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfW, pdfH)
      outputBlob.value = pdf.output('blob')
      outputUrl.value = URL.createObjectURL(outputBlob.value)
    } else if (fmt === 'dxf') {
      // Simple DXF text output
      const parser = new DOMParser()
      const doc = parser.parseFromString(svgContent.value, 'image/svg+xml')
      const svgEl = doc.querySelector('svg')
      const vb = svgEl?.getAttribute('viewBox')?.split(/[\s,]+/).map(Number)
      const maxY = vb && vb.length === 4 ? vb[1] + vb[3] : svgHeight.value
      let entities = ''
      svgEl?.querySelectorAll('line').forEach((el) => {
        const x1 = parseFloat(el.getAttribute('x1') || '0')
        const y1 = maxY - parseFloat(el.getAttribute('y1') || '0')
        const x2 = parseFloat(el.getAttribute('x2') || '0')
        const y2 = maxY - parseFloat(el.getAttribute('y2') || '0')
        entities += `0\nLINE\n8\n0\n10\n${x1.toFixed(4)}\n20\n${y1.toFixed(4)}\n11\n${x2.toFixed(4)}\n21\n${y2.toFixed(4)}\n`
      })
      svgEl?.querySelectorAll('rect').forEach((el) => {
        const x = parseFloat(el.getAttribute('x') || '0')
        const y = parseFloat(el.getAttribute('y') || '0')
        const w = parseFloat(el.getAttribute('width') || '0')
        const h = parseFloat(el.getAttribute('height') || '0')
        const ry = maxY - y
        const ry2 = maxY - (y + h)
        entities += `0\nLINE\n8\n0\n10\n${x.toFixed(4)}\n20\n${ry.toFixed(4)}\n11\n${(x + w).toFixed(4)}\n21\n${ry.toFixed(4)}\n`
        entities += `0\nLINE\n8\n0\n10\n${(x + w).toFixed(4)}\n20\n${ry.toFixed(4)}\n11\n${(x + w).toFixed(4)}\n21\n${ry2.toFixed(4)}\n`
        entities += `0\nLINE\n8\n0\n10\n${(x + w).toFixed(4)}\n20\n${ry2.toFixed(4)}\n11\n${x.toFixed(4)}\n21\n${ry2.toFixed(4)}\n`
        entities += `0\nLINE\n8\n0\n10\n${x.toFixed(4)}\n20\n${ry2.toFixed(4)}\n11\n${x.toFixed(4)}\n21\n${ry.toFixed(4)}\n`
      })
      svgEl?.querySelectorAll('circle').forEach((el) => {
        const cx = parseFloat(el.getAttribute('cx') || '0')
        const cy = maxY - parseFloat(el.getAttribute('cy') || '0')
        const r = parseFloat(el.getAttribute('r') || '0')
        entities += `0\nCIRCLE\n8\n0\n10\n${cx.toFixed(4)}\n20\n${cy.toFixed(4)}\n40\n${r.toFixed(4)}\n`
      })
      const dxf = `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n${entities}0\nENDSEC\n0\nEOF\n`
      outputBlob.value = new Blob([dxf], { type: 'application/dxf' })
      outputUrl.value = URL.createObjectURL(outputBlob.value)
    }
  } catch (e: unknown) {
    error.value = (e as Error).message || 'Conversion failed'
  } finally {
    isConverting.value = false
  }
}

function handleDownload() {
  if (!outputBlob.value) return
  const ext = selectedFormat.value
  const name = `${svgFile.value?.name?.replace(/\.[^.]+$/, '') || 'converted'}.${ext}`
  const a = document.createElement('a')
  a.href = outputUrl.value || URL.createObjectURL(outputBlob.value)
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function resetHeroUpload() {
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
  showConverter.value = false
  selectedFormat.value = 'png'
}

function handleReplace() {
  resetHeroUpload()
  nextTick(() => heroInputRef.value?.click())
}

function handleHeroClickUpload() {
  heroInputRef.value?.click()
}

function handleHeroInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleHeroUpload(file)
    target.value = ''
  }
}

function handleHeroDragOver(e: DragEvent) {
  e.preventDefault()
  heroIsDragActive.value = true
}

function handleHeroDragLeave(e: DragEvent) {
  e.preventDefault()
  heroIsDragActive.value = false
}

function handleHeroDrop(e: DragEvent) {
  e.preventDefault()
  heroIsDragActive.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) handleHeroUpload(file)
}

// Close format dropdown on outside click
onMounted(() => {
  if (import.meta.client) {
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-format-picker]')) {
        formatDropdownOpen.value = false
      }
    })
  }
})
</script>

<template>
  <div>
    <!-- 1. Hero Section -->
    <section class="bg-hero-bg pt-10 sm:pt-16 pb-12 sm:pb-20 px-4 animate-fade-in-up">
      <div class="max-w-5xl mx-auto flex flex-col items-center text-center gap-6 sm:gap-8">
        <!-- Badge row -->
        <div class="flex flex-wrap items-center justify-center gap-2">
          <span
            v-for="badge in badges"
            :key="badge.label"
            class="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-badge-bg text-badge-fg border border-primary/10"
          >
            <component :is="badge.icon" class="w-3.5 h-3.5" />
            {{ badge.label }}
          </span>
        </div>

        <!-- H1 -->
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-foreground">
          {{ t('index.heroTitle') }}
          <span class="block text-primary mt-1">{{ t('index.heroSubtitle') }}</span>
        </h1>

        <!-- Description -->
        <p class="text-base sm:text-lg text-muted-foreground max-w-xl">
          {{ t('index.heroDescription') }}
        </p>

        <!-- Upload Zone (functional) -->
        <div
          class="w-full max-w-lg mx-auto border-2 border-dashed border-upload-border bg-upload-bg rounded-2xl p-6 sm:p-12 flex flex-col items-center gap-3 sm:gap-4 cursor-pointer transition-all hover:border-primary hover:bg-accent"
          :class="{ 'upload-zone-active': heroIsDragActive }"
          @click="handleHeroClickUpload"
          @dragover="handleHeroDragOver"
          @dragleave="handleHeroDragLeave"
          @drop="handleHeroDrop"
          role="button"
          tabindex="0"
          @keydown.enter="handleHeroClickUpload"
          @keydown.space.prevent="handleHeroClickUpload"
        >
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Upload class="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          </div>
          <span class="font-semibold text-foreground text-base sm:text-lg">{{ t('converter.dropText') }}</span>
          <span class="text-sm text-muted-foreground">{{ t('converter.browseHint') }}</span>
        </div>
        <input
          ref="heroInputRef"
          type="file"
          accept=".svg,image/svg+xml"
          class="hidden"
          @change="handleHeroInputChange"
        />

        <!-- Small text -->
        <p class="text-xs text-muted-foreground">
          {{ t('index.smallText') }}
        </p>
      </div>
    </section>

    <!-- 2. Converter Section -->
    <section id="converter" class="py-16 px-4 bg-background">
      <div v-if="!showConverter" class="max-w-4xl mx-auto flex flex-col items-center text-center gap-4">
        <div class="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
          <FileImage class="w-8 h-8 text-muted-foreground" />
        </div>
        <p class="text-muted-foreground">
          {{ t('index.placeholderText') }}
        </p>
      </div>

      <!-- Active Converter Panel: Two Column Layout -->
      <div v-else class="max-w-4xl mx-auto">
        <div class="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div class="grid md:grid-cols-2">
            <!-- Left Panel: Preview -->
            <div class="p-5 space-y-4">
              <!-- SVG Preview Header -->
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-foreground">{{ t('converter.svgPreview') }}</h3>
                <button
                  class="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                  @click="handleReplace"
                >
                  <RefreshCw class="w-3 h-3" />
                  {{ t('converter.replaceFile') }}
                </button>
              </div>

              <!-- SVG Preview Area -->
              <div class="bg-muted/30 border border-border/50 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                <div
                  v-html="svgContent"
                  class="max-w-full max-h-[280px] [&>svg]:max-w-full [&>svg]:max-h-[280px] [&>svg]:h-auto"
                />
              </div>

              <!-- File Info -->
              <div class="space-y-1.5 text-xs text-muted-foreground">
                <div class="flex justify-between">
                  <span>{{ t('converter.file') }}</span>
                  <span class="text-foreground font-medium truncate ml-4 max-w-[200px]">{{ svgFile?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span>{{ t('converter.size') }}</span>
                  <span class="text-foreground font-medium">{{ svgFile ? formatFileSize(svgFile.size) : '0 B' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>{{ t('converter.dimensions') }}</span>
                  <span class="text-foreground font-medium">{{ svgWidth }} × {{ svgHeight }}px</span>
                </div>
              </div>

              <!-- Output Preview -->
              <div v-if="outputBlob">
                <h3 class="text-sm font-semibold text-foreground mb-3">{{ t('converter.outputPreview') }}</h3>
                <div
                  class="bg-muted/30 border border-border/50 rounded-lg p-4 flex items-center justify-center min-h-[200px] overflow-hidden"
                  :class="{ checkerboard: supportsTransparency && background === 'transparent' }"
                >
                  <img
                    v-if="isRasterOutput || selectedFormat === 'ico'"
                    :src="outputUrl"
                    alt="Output preview"
                    class="max-w-full max-h-[280px] object-contain"
                  />
                  <div v-else class="text-center">
                    <FileImage class="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p class="text-sm text-muted-foreground">
                      {{ t('converter.fileReady', { format: formatUpper }) }}
                    </p>
                  </div>
                </div>
                <p v-if="outputBlob" class="text-xs text-muted-foreground mt-2 text-center">
                  {{ t('converter.outputFileSize', { size: formatFileSize(outputBlob.size) }) }}
                </p>
              </div>
            </div>

            <!-- Right Panel: Export Settings -->
            <div class="p-5 border-t md:border-t-0 md:border-l border-border space-y-4">
              <h3 class="text-sm font-semibold text-foreground">{{ t('converter.exportSettings') }}</h3>

              <!-- Output Format Dropdown -->
              <div data-format-picker>
                <label class="text-xs font-medium text-muted-foreground block mb-1.5">{{ t('converter.outputFormat') }}</label>
                <div class="relative">
                  <button
                    class="w-full px-3 py-2.5 bg-muted border border-border rounded-md text-sm font-medium text-foreground flex items-center justify-between hover:bg-accent transition-colors"
                    @click.stop="formatDropdownOpen = !formatDropdownOpen"
                  >
                    <span>SVG → {{ formatOptions.find(f => f.value === selectedFormat)?.label }}</span>
                    <ChevronDown class="w-4 h-4 text-muted-foreground transition-transform" :class="{ 'rotate-180': formatDropdownOpen }" />
                  </button>

                  <Transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="opacity-0 -translate-y-1"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-1"
                  >
                    <div
                      v-if="formatDropdownOpen"
                      class="absolute left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
                    >
                      <button
                        v-for="fmt in formatOptions"
                        :key="fmt.value"
                        class="w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-accent flex items-center justify-between"
                        :class="selectedFormat === fmt.value ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'"
                        @click="selectedFormat = fmt.value; formatDropdownOpen = false"
                      >
                        <span>SVG → {{ fmt.label }}</span>
                        <span v-if="selectedFormat === fmt.value" class="text-primary text-xs">✓</span>
                      </button>
                    </div>
                  </Transition>
                </div>
              </div>

              <!-- Size Settings -->
              <template v-if="supportsSizeSettings">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-xs font-medium text-muted-foreground block mb-1.5">{{ t('converter.widthPx') }}</label>
                    <input
                      v-model.number="outputWidth"
                      type="number"
                      min="1"
                      class="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label class="text-xs font-medium text-muted-foreground block mb-1.5">{{ t('converter.heightPx') }}</label>
                    <input
                      v-model.number="outputHeight"
                      type="number"
                      min="1"
                      class="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <!-- Scale Buttons -->
                <div>
                  <label class="text-xs font-medium text-muted-foreground block mb-1.5">{{ t('converter.scaleLabel') }}</label>
                  <div class="flex gap-2">
                    <button
                      v-for="s in scaleOptions"
                      :key="s"
                      class="flex-1 px-3 py-2 text-sm rounded-md border transition-colors"
                      :class="scale === s
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-foreground border-border hover:bg-accent'"
                      @click="scale = s"
                    >
                      {{ s }}x
                    </button>
                  </div>
                  <p class="text-xs text-muted-foreground mt-1.5">
                    {{ t('converter.output', { w: outputWidth, h: outputHeight }) }}
                  </p>
                </div>
              </template>

              <!-- Background -->
              <div v-if="supportsTransparency">
                <label class="text-xs font-medium text-muted-foreground block mb-1.5">{{ t('converter.background') }}</label>
                <div class="flex gap-2">
                  <button
                    class="flex-1 px-3 py-2 text-sm rounded-md border transition-colors"
                    :class="background === 'transparent'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-foreground border-border hover:bg-accent'"
                    @click="background = 'transparent'"
                  >
                    {{ t('converter.transparent') }}
                  </button>
                  <button
                    class="flex-1 px-3 py-2 text-sm rounded-md border transition-colors"
                    :class="background === 'white'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-foreground border-border hover:bg-accent'"
                    @click="background = 'white'"
                  >
                    {{ t('converter.white') }}
                  </button>
                </div>
              </div>

              <!-- Quality -->
              <div v-if="supportsQuality">
                <label class="text-xs font-medium text-muted-foreground block mb-1.5">
                  {{ t('converter.quality', { quality: quality }) }}
                </label>
                <input
                  v-model.number="quality"
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p class="text-xs text-muted-foreground mt-1">
                  {{ t('converter.qualityDescription') }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3 pt-2">
                <!-- Convert Button - always visible -->
                <button
                  class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  :disabled="isConverting"
                  @click="handleConvert"
                >
                  <Loader2 v-if="isConverting" class="w-4 h-4 animate-spin" />
                  {{ isConverting ? t('converter.converting') : (outputBlob ? t('converter.reConvert') : t('converter.convertNow')) }}
                </button>
                <!-- Download Button - visible only after conversion -->
                <button
                  v-if="outputBlob"
                  class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2"
                  @click="handleDownload"
                >
                  <Download class="w-4 h-4" />
                  {{ t('converter.downloadFile', { format: formatUpper }) }}
                </button>
              </div>

              <!-- Reset Link -->
              <button
                class="w-full text-sm text-muted-foreground hover:text-foreground text-center py-1 transition-colors"
                @click="resetHeroUpload"
              >
                {{ t('converter.resetAndUpload') }}
              </button>
            </div>
          </div>

          <!-- Error -->
          <div
            v-if="error"
            class="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border-t border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400"
          >
            <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
            <span>{{ error }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Convert SVG to Popular Formats -->
    <section class="py-16 px-4 bg-background animate-fade-in-up animation-delay-100">
      <div class="max-w-5xl mx-auto flex flex-col gap-8">
        <div class="text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-foreground">{{ t('index.section2Title') }}</h2>
          <p class="text-muted-foreground mt-3 max-w-xl mx-auto">
            {{ t('index.section2Desc') }}
          </p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormatCard
            v-for="card in formatCards"
            :key="card.title"
            :title="card.title"
            :description="card.description"
            :href="card.href"
            :color-class="card.colorClass"
          />
        </div>
      </div>
    </section>

    <!-- 4. Perfect for Web, Design, and Icon Export -->
    <section class="bg-hero-bg py-16 px-4 animate-fade-in-up animation-delay-200">
      <div class="max-w-5xl mx-auto flex flex-col gap-8">
        <div class="text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-foreground">{{ t('index.section3Title') }}</h2>
          <p class="text-muted-foreground mt-3 max-w-xl mx-auto">
            {{ t('index.section3Desc') }}
          </p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UseCaseCard
            v-for="useCase in useCases"
            :key="useCase.title"
            :icon="useCase.icon"
            :title="useCase.title"
            :description="useCase.description"
          />
        </div>
      </div>
    </section>

    <!-- 5. Why Use This SVG Converter -->
    <section class="py-16 px-4 bg-background animate-fade-in-up">
      <div class="max-w-5xl mx-auto flex flex-col gap-8">
        <div class="text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-foreground">{{ t('index.section4Title') }}</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="benefit in benefits"
            :key="benefit"
            class="bg-card border border-border rounded-xl p-5 flex items-start gap-3"
          >
            <span class="text-primary mt-0.5 font-bold">✓</span>
            <span class="text-sm text-foreground">{{ benefit }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Popular SVG Conversion Tools -->
    <section class="bg-hero-bg py-16 px-4 animate-fade-in-up animation-delay-100">
      <div class="max-w-5xl mx-auto flex flex-col gap-8">
        <div class="text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-foreground">{{ t('index.section5Title') }}</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="tool in toolList"
            :key="tool.title"
            class="bg-card border border-border rounded-xl p-4 flex flex-col gap-2"
          >
            <h3 class="font-semibold text-sm text-foreground">{{ tool.title }}</h3>
            <p class="text-xs text-muted-foreground flex-1">{{ tool.description }}</p>
            <NuxtLink :to="tool.href" class="text-xs text-primary hover:underline">{{ t('common.openTool') }}</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. How to Convert SVG Online -->
    <section class="py-16 px-4 bg-background animate-fade-in-up animation-delay-200">
      <div class="max-w-5xl mx-auto flex flex-col gap-8">
        <div class="text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-foreground">{{ t('index.section6Title') }}</h2>
        </div>
        <div class="grid sm:grid-cols-3 gap-6">
          <StepCard
            v-for="step in steps"
            :key="step.number"
            :number="step.number"
            :title="step.title"
            :description="step.description"
          />
        </div>
      </div>
    </section>

    <!-- 8. FAQ Section -->
    <section class="py-16 px-4 bg-background animate-fade-in-up">
      <div class="max-w-3xl mx-auto flex flex-col gap-8">
        <div class="text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-foreground">{{ t('common.frequentlyAskedQuestions') }}</h2>
        </div>
        <FaqAccordion :items="faqItems" />
      </div>
    </section>
  </div>
</template>