<script setup lang="ts">
import { Zap, UserX, ShieldCheck, ArrowDown, Download, RotateCcw, Type, Palette, Maximize2, Move, Blend } from 'lucide-vue-next'

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

// Icon configuration
const config = ref({
  text: 'A',
  bgColorHex: '#4f6ef2',
  bgOpacity: 1,
  textColor: '#ffffff',
  bgRadius: 40,
  fontSize: 80,
  fontFamily: 'Arial, sans-serif',
  // Text gradient
  textGradientEnabled: false,
  textGradientStart: '#ffffff',
  textGradientEnd: '#a5b4fc',
  textGradientOpacityStart: 1,
  textGradientOpacityEnd: 0.6,
  textGradientDirection: 'to right' as 'to right' | 'to bottom' | 'to bottom right' | 'to bottom left',
})

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

const gradientDirOptions = [
  { label: '→', value: 'to right' as const },
  { label: '↓', value: 'to bottom' as const },
  { label: '↘', value: 'to bottom right' as const },
  { label: '↙', value: 'to bottom left' as const },
]

// Text position
const textPos = ref({ x: 90, y: 90 })
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

// Helper: hex to rgba
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Build SVG gradient definition string
const gradientDef = computed(() => {
  if (!config.value.textGradientEnabled) return ''
  const c = config.value
  const dirMap: Record<string, { x1: string; y1: string; x2: string; y2: string }> = {
    'to right':         { x1: '0%', y1: '50%', x2: '100%', y2: '50%' },
    'to bottom':        { x1: '50%', y1: '0%', x2: '50%', y2: '100%' },
    'to bottom right':  { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
    'to bottom left':   { x1: '100%', y1: '0%', x2: '0%', y2: '100%' },
  }
  const dir = dirMap[c.textGradientDirection] || dirMap['to right']
  return `  <defs>
    <linearGradient id="textGrad" x1="${dir.x1}" y1="${dir.y1}" x2="${dir.x2}" y2="${dir.y2}">
      <stop offset="0%" stop-color="${hexToRgba(c.textGradientStart, c.textGradientOpacityStart)}" />
      <stop offset="100%" stop-color="${hexToRgba(c.textGradientEnd, c.textGradientOpacityEnd)}" />
    </linearGradient>
  </defs>`
})

// Text fill: gradient or solid
const textFill = computed(() => {
  return config.value.textGradientEnabled ? 'url(#textGrad)' : config.value.textColor
})

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
  let newX = textPos.value.x + dx
  let newY = textPos.value.y + dy
  newX = Math.max(0, Math.min(180, newX))
  newY = Math.max(0, Math.min(180, newY))
  textPos.value = { x: newX, y: newY }
  dragStart.value = { x: clientX, y: clientY }
}

function stopDrag() {
  isDragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
}

// Generate SVG string
function generateSvgString() {
  return `<svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
${gradientDef.value}
  <rect width="180" height="180" rx="${config.value.bgRadius}" fill="${bgColorComputed.value}"/>
  <text x="${Math.round(textPos.value.x)}" y="${Math.round(textPos.value.y)}" fill="${textFill.value}" font-size="${config.value.fontSize}" font-family="${config.value.fontFamily}" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${config.value.text}</text>
</svg>`
}

// Download SVG
function downloadSvg() {
  const svgContent = generateSvgString()
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `icon-${config.value.text || 'untitled'}.svg`
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
    textGradientEnabled: false,
    textGradientStart: '#ffffff',
    textGradientEnd: '#a5b4fc',
    textGradientOpacityStart: 1,
    textGradientOpacityEnd: 0.6,
    textGradientDirection: 'to right',
  }
  textPos.value = { x: 90, y: 90 }
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
          <div class="w-full md:w-[340px] shrink-0 space-y-5">
            <h2 class="text-xl font-bold text-foreground flex items-center gap-2">
              <Type class="w-5 h-5 text-primary" />
              {{ t('iconGen.panelTitle') }}
            </h2>

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

            <!-- Text Color (solid mode) -->
            <div v-if="!config.textGradientEnabled">
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

            <!-- Text Gradient -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Blend class="w-4 h-4 text-muted-foreground" />
                  {{ t('iconGen.textGradientLabel') }}
                </label>
                <button
                  class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                  :class="config.textGradientEnabled ? 'bg-primary' : 'bg-muted'"
                  @click="config.textGradientEnabled = !config.textGradientEnabled"
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"
                    :class="config.textGradientEnabled ? 'translate-x-4' : 'translate-x-0.5'"
                  />
                </button>
              </div>

              <!-- Gradient settings (shown when enabled) -->
              <div v-if="config.textGradientEnabled" class="space-y-3 pl-1 border-l-2 border-primary/30 ml-0.5">
                <!-- Start color + opacity -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-muted-foreground">{{ t('iconGen.gradientStart') }}</span>
                    <span class="text-xs font-mono text-muted-foreground">{{ (config.textGradientOpacityStart * 100).toFixed(0) }}%</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="relative">
                      <input
                        type="color"
                        v-model="config.textGradientStart"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        class="w-8 h-8 rounded border border-border cursor-pointer"
                        :style="{ backgroundColor: config.textGradientStart, opacity: config.textGradientOpacityStart }"
                      />
                    </div>
                    <input
                      type="range"
                      v-model.number="config.textGradientOpacityStart"
                      min="0" max="1" step="0.05"
                      class="flex-1 h-2 accent-primary"
                    />
                  </div>
                </div>

                <!-- End color + opacity -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-muted-foreground">{{ t('iconGen.gradientEnd') }}</span>
                    <span class="text-xs font-mono text-muted-foreground">{{ (config.textGradientOpacityEnd * 100).toFixed(0) }}%</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="relative">
                      <input
                        type="color"
                        v-model="config.textGradientEnd"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        class="w-8 h-8 rounded border border-border cursor-pointer"
                        :style="{ backgroundColor: config.textGradientEnd, opacity: config.textGradientOpacityEnd }"
                      />
                    </div>
                    <input
                      type="range"
                      v-model.number="config.textGradientOpacityEnd"
                      min="0" max="1" step="0.05"
                      class="flex-1 h-2 accent-primary"
                    />
                  </div>
                </div>

                <!-- Gradient direction -->
                <div>
                  <span class="text-xs text-muted-foreground block mb-1.5">{{ t('iconGen.gradientDirection') }}</span>
                  <div class="flex gap-1.5">
                    <button
                      v-for="opt in gradientDirOptions"
                      :key="opt.value"
                      @click="config.textGradientDirection = opt.value"
                      :class="[
                        'flex-1 py-1.5 text-sm rounded-md border transition-all duration-150 font-medium text-center',
                        config.textGradientDirection === opt.value
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                      ]"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>

                <!-- Gradient preview bar -->
                <div
                  class="h-4 rounded-full border border-border overflow-hidden"
                  :style="{
                    background: `linear-gradient(${config.textGradientDirection}, ${hexToRgba(config.textGradientStart, config.textGradientOpacityStart)}, ${hexToRgba(config.textGradientEnd, config.textGradientOpacityEnd)})`
                  }"
                />
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
                  <rect
                    width="180"
                    height="180"
                    :rx="config.bgRadius"
                    :fill="bgColorComputed"
                  />
                  <!-- Gradient def (v-html to render SVG defs) -->
                  <g v-if="config.textGradientEnabled" v-html="'<defs><linearGradient id=\'textGrad\' x1=\'' + (config.textGradientDirection === 'to right' ? '0%' : config.textGradientDirection === 'to bottom' ? '50%' : config.textGradientDirection === 'to bottom right' ? '0%' : '100%') + '\' y1=\'' + (config.textGradientDirection === 'to right' ? '50%' : config.textGradientDirection === 'to bottom' ? '0%' : '0%') + '\' x2=\'' + (config.textGradientDirection === 'to right' ? '100%' : config.textGradientDirection === 'to bottom' ? '50%' : config.textGradientDirection === 'to bottom right' ? '100%' : '0%') + '\' y2=\'' + (config.textGradientDirection === 'to right' ? '50%' : config.textGradientDirection === 'to bottom' ? '100%' : '100%') + '\'><stop offset=\'0%\' stop-color=\'' + hexToRgba(config.textGradientStart, config.textGradientOpacityStart) + '\'/><stop offset=\'100%\' stop-color=\'' + hexToRgba(config.textGradientEnd, config.textGradientOpacityEnd) + '\'/></linearGradient></defs>'" />
                  <text
                    :x="textPos.x"
                    :y="textPos.y"
                    :fill="textFill"
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