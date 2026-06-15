<script setup lang="ts">
import { Zap, UserX, ShieldCheck, ArrowDown, Download, RotateCcw, Type, Palette, Maximize2, Move } from 'lucide-vue-next'

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
  <rect width="180" height="180" rx="${config.value.bgRadius}" fill="${bgColorComputed.value}"/>
  <text x="${Math.round(textPos.value.x)}" y="${Math.round(textPos.value.y)}" fill="${config.value.textColor}" font-size="${config.value.fontSize}" font-family="${config.value.fontFamily}" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${config.value.text}</text>
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
                  <text
                    :x="textPos.x"
                    :y="textPos.y"
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