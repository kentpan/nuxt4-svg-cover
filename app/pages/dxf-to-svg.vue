<script setup lang="ts">
import { Zap, UserX, ShieldCheck, ArrowDown, Upload, Download, RotateCcw, Loader2, AlertCircle, X, FileImage, FileText } from 'lucide-vue-next'

const { t, tm } = useI18n()

useHead({
  title: t('dxfToSvg.metaTitle'),
  meta: [
    { name: 'description', content: t('dxfToSvg.metaDescription') },
  ],
})

const {
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
} = useDxfToSvg()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const faqItems = computed(() => {
  const raw = tm('dxfToSvg.faq')
  if (!Array.isArray(raw)) return []
  return Array.from({ length: raw.length }, (_, i) => ({
    question: t(`dxfToSvg.faq.${i}.q`),
    answer: t(`dxfToSvg.faq.${i}.a`),
  }))
})

const seo2Items = computed(() => {
  const raw = tm('dxfToSvg.seo2Items')
  if (!Array.isArray(raw)) return []
  return Array.from({ length: raw.length }, (_, i) => ({
    label: t(`dxfToSvg.seo2Items.${i}.label`),
    desc: t(`dxfToSvg.seo2Items.${i}.desc`),
  }))
})

function scrollToConverter() {
  document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' })
}

function handleFileSelect(file: File | undefined) {
  if (!file) return
  if (!file.name.toLowerCase().endsWith('.dxf')) {
    error.value = t('dxfToSvg.invalidDxf')
    return
  }
  loadDxfFile(file)
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  handleFileSelect(file)
}

function handleInputChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  handleFileSelect(file)
}

function handleConvert() {
  convert()
}

function handleReplace() {
  reset()
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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
          {{ t('dxfToSvg.heroTitle') }}
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-muted-foreground mb-8">
          {{ t('dxfToSvg.heroSubtitle') }}
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
    <section id="converter" class="py-16 px-4 bg-background">
      <div class="max-w-3xl mx-auto">
        <!-- Upload Zone (shown when no file loaded) -->
        <div
          v-if="!dxfFile"
          class="relative border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer"
          :class="isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="fileInputRef?.click()"
        >
          <input
            ref="fileInputRef"
            type="file"
            accept=".dxf"
            class="hidden"
            @change="handleInputChange"
          />
          <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload class="w-7 h-7 text-primary" />
          </div>
          <p class="text-foreground font-semibold mb-1">{{ t('dxfToSvg.dropText') }}</p>
          <p class="text-sm text-muted-foreground">{{ t('dxfToSvg.browseHint') }}</p>
        </div>

        <!-- File Info + Convert (shown when file loaded, no output yet) -->
        <div v-else-if="!outputBlob && !isConverting" class="space-y-4">
          <!-- Error Display -->
          <div v-if="error" class="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
            <AlertCircle class="w-5 h-5 mt-0.5 shrink-0" />
            <div class="flex-1">
              <p class="text-sm font-medium">{{ error }}</p>
            </div>
            <button class="shrink-0 p-1 hover:bg-destructive/20 rounded transition-colors" @click="error = null">
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- File Info Card -->
          <div class="border rounded-xl p-6 bg-card">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <FileText class="w-6 h-6 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-foreground truncate">{{ dxfFile.name }}</p>
                <p class="text-sm text-muted-foreground">{{ formatFileSize(dxfFile.size) }}</p>
              </div>
              <button
                class="shrink-0 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                :title="t('dxfToSvg.removeFile')"
                @click="handleReplace"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Convert Button -->
            <button
              class="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
              :disabled="!!error"
              @click="handleConvert"
            >
              {{ t('dxfToSvg.convertToSvg') }}
              <FileImage class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Converting State -->
        <div v-else-if="isConverting" class="border rounded-xl p-12 text-center bg-card">
          <Loader2 class="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p class="text-foreground font-semibold">{{ t('dxfToSvg.convertingDxf') }}</p>
          <p class="text-sm text-muted-foreground mt-1">{{ t('dxfToSvg.parsingEntities') }}</p>
        </div>

        <!-- Output (shown when converted) -->
        <div v-else-if="outputBlob" class="space-y-4">
          <!-- Error Display -->
          <div v-if="error" class="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
            <AlertCircle class="w-5 h-5 mt-0.5 shrink-0" />
            <div class="flex-1">
              <p class="text-sm font-medium">{{ error }}</p>
            </div>
            <button class="shrink-0 p-1 hover:bg-destructive/20 rounded transition-colors" @click="error = null">
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- SVG Preview -->
          <div class="border rounded-xl overflow-hidden bg-card">
            <div class="px-4 py-3 border-b flex items-center justify-between bg-muted/30">
              <div class="flex items-center gap-2 text-sm">
                <FileImage class="w-4 h-4 text-primary" />
                <span class="font-medium text-foreground">{{ t('dxfToSvg.svgPreview') }}</span>
              </div>
              <span class="text-xs text-muted-foreground">{{ t('dxfToSvg.entitiesConverted', { n: entityCount, entity: entityCount === 1 ? t('dxfToSvg.entity') : t('dxfToSvg.entities') }) }}</span>
            </div>
            <div class="p-6 flex items-center justify-center bg-[repeating-conic-gradient(#80808015_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] min-h-[200px] max-h-[500px] overflow-auto">
              <div
                class="text-foreground [&>svg]:max-w-full [&>svg]:max-h-[460px] [&>svg]:h-auto [&>svg]:block"
                v-html="svgOutput"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
              @click="download"
            >
              <Download class="w-4 h-4" />
              {{ t('dxfToSvg.downloadSvg') }}
            </button>
            <button
              class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-input rounded-lg font-semibold hover:bg-muted transition-colors text-sm text-foreground"
              @click="handleConvert"
            >
              {{ t('dxfToSvg.reConvert') }}
            </button>
            <button
              class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-input rounded-lg font-semibold hover:bg-muted transition-colors text-sm text-foreground"
              @click="handleReplace"
            >
              <RotateCcw class="w-4 h-4" />
              {{ t('dxfToSvg.replaceFile') }}
            </button>
          </div>

          <!-- File Info -->
          <div class="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
            <span>{{ t('dxfToSvg.source', { name: dxfFile?.name, size: dxfFile ? formatFileSize(dxfFile.size) : '' }) }}</span>
            <span>·</span>
            <span>{{ t('dxfToSvg.output', { size: formatFileSize(outputBlob.size) }) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SEO Content Section -->
    <section class="py-16 px-4 bg-background">
      <div class="max-w-3xl mx-auto space-y-12">
        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">{{ t('dxfToSvg.seo1Title') }}</h2>
          <p class="text-muted-foreground leading-relaxed">
            {{ t('dxfToSvg.seo1Content') }}
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">{{ t('dxfToSvg.seo2Title') }}</h2>
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
