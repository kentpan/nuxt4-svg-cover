<script setup lang="ts">
import { Zap, UserX, ShieldCheck, ArrowDown, Upload, Download, RotateCcw, Loader2, AlertCircle, X, FileImage, RefreshCw } from 'lucide-vue-next'

const { t, tm } = useI18n()

useHead({
  title: t('imageToSvg.metaTitle'),
  meta: [
    { name: 'description', content: t('imageToSvg.metaDescription') },
  ],
})

const {
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
} = useImageToSvg()

const inputRef = ref<HTMLInputElement | null>(null)
const isDragActive = ref(false)

const colorOptions = [16, 32, 64]

const faqItems = computed(() => {
  const raw = tm('imageToSvg.faq')
  if (!Array.isArray(raw)) return []
  return Array.from({ length: raw.length }, (_, i) => ({
    question: t(`imageToSvg.faq.${i}.q`),
    answer: t(`imageToSvg.faq.${i}.a`),
  }))
})

const seo2Items = computed(() => {
  const raw = tm('imageToSvg.seo2Items')
  if (!Array.isArray(raw)) return []
  return Array.from({ length: raw.length }, (_, i) => ({
    label: t(`imageToSvg.seo2Items.${i}.label`),
    desc: t(`imageToSvg.seo2Items.${i}.desc`),
  }))
})

function scrollToConverter() {
  document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' })
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function handleFile(file: File) {
  loadImageFile(file)
}

function handleReplace() {
  reset()
  nextTick(() => inputRef.value?.click())
}

function handleClickUpload() {
  inputRef.value?.click()
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleFile(file)
    target.value = ''
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragActive.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragActive.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragActive.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

async function handleConvert() {
  await convert()
}

function handleReset() {
  reset()
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-hero-bg pt-10 sm:pt-16 pb-12 sm:pb-20 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <!-- Badge row -->
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
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-badge-bg text-badge-fg text-xs font-medium">
            <Zap class="w-3.5 h-3.5" />
            {{ t('common.fastExport') }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 text-balance">
          {{ t('imageToSvg.heroTitle') }}
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-muted-foreground mb-8">
          {{ t('imageToSvg.heroSubtitle') }}
        </p>

        <!-- CTA Button -->
        <button
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
          @click="scrollToConverter"
        >
          {{ t('common.startConverting') }}
          <ArrowDown class="w-4 h-4" />
        </button>
      </div>
    </section>

    <!-- Converter Section -->
    <section id="converter" aria-label="Image to SVG converter tool" class="py-16 px-4 bg-background">
      <div class="max-w-4xl mx-auto">
        <!-- No file uploaded state -->
        <div v-if="!imageFile" class="flex flex-col items-center gap-6 py-12">
          <div
            class="w-full max-w-lg mx-auto border-2 border-dashed border-upload-border bg-upload-bg rounded-2xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-all hover:border-primary hover:bg-accent"
            :class="{ 'upload-zone-active': isDragActive }"
            @click="inputRef?.click()"
            @dragover.prevent="isDragActive = true"
            @dragleave.prevent="isDragActive = false"
            @drop.prevent="handleDrop"
            role="button"
            tabindex="0"
            @keydown.enter="inputRef?.click()"
            @keydown.space.prevent="inputRef?.click()"
          >
            <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Upload class="w-7 h-7 text-primary" />
            </div>
            <span class="font-semibold text-foreground text-lg">{{ t('imageToSvg.dropText') }}</span>
            <span class="text-sm text-muted-foreground">{{ t('imageToSvg.browseHint') }}</span>
          </div>
          <button
            class="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
            @click="inputRef?.click()"
          >
            {{ t('imageToSvg.uploadImage') }}
          </button>
          <input
            ref="inputRef"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/x-icon,image/webp"
            class="hidden"
            @change="handleInputChange"
          />
        </div>

        <!-- File loaded - Two Column Layout -->
        <div v-else class="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div class="grid md:grid-cols-2">
            <!-- Left Panel: Image Preview -->
            <div class="p-5 space-y-4">
              <!-- Image Preview Header -->
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-foreground">{{ t('imageToSvg.imagePreview') }}</h3>
                <button
                  class="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                  @click="handleReplace"
                >
                  <RefreshCw class="w-3 h-3" />
                  {{ t('converter.replaceFile') }}
                </button>
              </div>

              <!-- Image Preview Area -->
              <div class="bg-muted/30 border border-border/50 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                <img
                  :src="imagePreviewUrl"
                  alt="Uploaded image preview"
                  class="max-w-full max-h-[280px] object-contain"
                />
              </div>

              <!-- File Info -->
              <div class="space-y-1.5 text-xs text-muted-foreground">
                <div class="flex justify-between">
                  <span>{{ t('converter.file') }}</span>
                  <span class="text-foreground font-medium truncate ml-4 max-w-[200px]">{{ imageFile?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span>{{ t('converter.size') }}</span>
                  <span class="text-foreground font-medium">{{ imageFile ? formatFileSize(imageFile.size) : '0 B' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>{{ t('converter.type') }}</span>
                  <span class="text-foreground font-medium">{{ imageFile?.type || 'image/*' }}</span>
                </div>
              </div>

              <!-- SVG Output Preview -->
              <div v-if="outputBlob">
                <h3 class="text-sm font-semibold text-foreground mb-3">{{ t('imageToSvg.svgOutputPreview') }}</h3>
                <div class="bg-muted/30 border border-border/50 rounded-lg p-4 flex items-center justify-center min-h-[200px] overflow-hidden">
                  <div
                    v-if="svgOutput"
                    v-html="svgOutput"
                    class="max-w-full max-h-[280px] [&>svg]:max-w-full [&>svg]:max-h-[280px] [&>svg]:h-auto"
                  />
                </div>
                <!-- SVG Output File Size -->
                <p v-if="outputBlob" class="text-xs text-muted-foreground mt-2 text-center">
                  {{ t('converter.outputFileSize', { size: formatFileSize(outputBlob.size) }) }}
                </p>
              </div>
            </div>

            <!-- Right Panel: Conversion Settings -->
            <div class="p-5 border-t md:border-t-0 md:border-l border-border space-y-4">
              <h3 class="text-sm font-semibold text-foreground">{{ t('imageToSvg.conversionSettings') }}</h3>

              <!-- Color Mode -->
              <div>
                <label class="text-xs font-medium text-muted-foreground block mb-1.5">{{ t('imageToSvg.colorMode') }}</label>
                <div class="flex gap-2">
                  <button
                    class="flex-1 px-3 py-2 text-sm rounded-md border transition-colors"
                    :class="colorMode === 'color'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-foreground border-border hover:bg-accent'"
                    @click="colorMode = 'color'"
                  >
                    {{ t('imageToSvg.color') }}
                  </button>
                  <button
                    class="flex-1 px-3 py-2 text-sm rounded-md border transition-colors"
                    :class="colorMode === 'grayscale'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-foreground border-border hover:bg-accent'"
                    @click="colorMode = 'grayscale'"
                  >
                    {{ t('imageToSvg.grayscale') }}
                  </button>
                  <button
                    class="flex-1 px-3 py-2 text-sm rounded-md border transition-colors"
                    :class="colorMode === 'bw'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-foreground border-border hover:bg-accent'"
                    @click="colorMode = 'bw'"
                  >
                    {{ t('imageToSvg.blackWhite') }}
                  </button>
                </div>
              </div>

              <!-- Number of Colors -->
              <div>
                <label class="text-xs font-medium text-muted-foreground block mb-1.5">
                  {{ t('imageToSvg.numberOfColors', { n: numberOfColors }) }}
                </label>
                <div class="flex gap-2">
                  <button
                    v-for="n in colorOptions"
                    :key="n"
                    class="flex-1 px-3 py-2 text-sm rounded-md border transition-colors"
                    :class="numberOfColors === n
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-foreground border-border hover:bg-accent'"
                    @click="numberOfColors = n"
                  >
                    {{ n }}
                  </button>
                </div>
                <p class="text-xs text-muted-foreground mt-1.5">
                  {{ t('imageToSvg.colorsHint') }}
                </p>
              </div>

              <!-- Detail Level -->
              <div>
                <label class="text-xs font-medium text-muted-foreground block mb-1.5">{{ t('imageToSvg.detailLevel') }}</label>
                <div class="flex gap-2">
                  <button
                    class="flex-1 px-3 py-2 text-sm rounded-md border transition-colors"
                    :class="detailLevel === 'high'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-foreground border-border hover:bg-accent'"
                    @click="detailLevel = 'high'"
                  >
                    {{ t('imageToSvg.detailHigh') }}
                  </button>
                  <button
                    class="flex-1 px-3 py-2 text-sm rounded-md border transition-colors"
                    :class="detailLevel === 'medium'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-foreground border-border hover:bg-accent'"
                    @click="detailLevel = 'medium'"
                  >
                    {{ t('imageToSvg.detailMedium') }}
                  </button>
                  <button
                    class="flex-1 px-3 py-2 text-sm rounded-md border transition-colors"
                    :class="detailLevel === 'low'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-foreground border-border hover:bg-accent'"
                    @click="detailLevel = 'low'"
                  >
                    {{ t('imageToSvg.detailLow') }}
                  </button>
                </div>
                <p class="text-xs text-muted-foreground mt-1.5">
                  {{ t('imageToSvg.detailHint') }}
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
                  {{ isConverting ? t('imageToSvg.converting') : (outputBlob ? t('imageToSvg.reConvert') : t('imageToSvg.convertToSvg')) }}
                </button>
                <!-- Download Button - visible only after conversion -->
                <button
                  v-if="outputBlob"
                  class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2"
                  @click="download()"
                >
                  <Download class="w-4 h-4" />
                  {{ t('imageToSvg.downloadSvg') }}
                </button>
              </div>

              <!-- Reset Link -->
              <button
                class="w-full text-sm text-muted-foreground hover:text-foreground text-center py-1 transition-colors"
                @click="handleReset"
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

    <!-- SEO Content Section -->
    <section class="py-16 px-4 bg-background">
      <div class="max-w-3xl mx-auto space-y-12">
        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">{{ t('imageToSvg.seo1Title') }}</h2>
          <p class="text-muted-foreground leading-relaxed">
            {{ t('imageToSvg.seo1Content') }}
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">{{ t('imageToSvg.seo2Title') }}</h2>
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