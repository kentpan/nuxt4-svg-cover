<script setup lang="ts">
import type { OutputFormat } from '~/composables/useSvgConverter'
import { Download, RotateCcw, Loader2, AlertCircle, X, FileImage, Upload, RefreshCw } from 'lucide-vue-next'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  format: OutputFormat
  accept?: string
}>(), {
  accept: '.svg,image/svg+xml',
})

const {
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
  loadSvgFile,
  convert,
  download,
  reset,
} = useSvgConverter(props.format)

const inputRef = ref<HTMLInputElement | null>(null)
const isDragActive = ref(false)
const formatUpper = computed(() => props.format.toUpperCase())

const supportsTransparency = computed(() => ['png', 'webp'].includes(props.format))
const supportsQuality = computed(() => ['jpg', 'webp'].includes(props.format))
const supportsSizeSettings = computed(() => ['png', 'jpg', 'webp', 'ico'].includes(props.format))
const isRasterOutput = computed(() => ['png', 'jpg', 'webp'].includes(props.format))

const scaleOptions = [1, 2, 3] as const

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function handleFile(file: File) {
  loadSvgFile(file)
}

function handleReplace() {
  reset()
  nextTick(() => inputRef.value?.click())
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

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleFile(file)
    target.value = ''
  }
}

async function handleConvert() {
  await convert()
}
</script>

<template>
  <section id="converter" aria-label="SVG Converter tool" class="py-16 px-4 bg-background">
    <div class="max-w-4xl mx-auto">
      <!-- No file uploaded state -->
      <div v-if="!svgFile" class="flex flex-col items-center gap-6 py-12">
        <div
          class="w-full max-w-lg mx-auto border-2 border-dashed border-upload-border bg-upload-bg rounded-2xl p-6 sm:p-12 flex flex-col items-center gap-3 sm:gap-4 cursor-pointer transition-all hover:border-primary hover:bg-accent"
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
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Upload class="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          </div>
          <span class="font-semibold text-foreground text-base sm:text-lg">{{ t('converter.dropText') }}</span>
          <span class="text-sm text-muted-foreground">{{ t('converter.browseHint') }}</span>
        </div>
        <button
          class="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
          @click="inputRef?.click()"
        >
          {{ t('converter.uploadLabel') }}
        </button>
        <input
          ref="inputRef"
          type="file"
          :accept="accept"
          class="hidden"
          @change="handleInputChange"
        />
      </div>

      <!-- File loaded - Two Column Layout -->
      <div v-else class="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
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
                  v-if="isRasterOutput || format === 'ico'"
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
              <!-- Output File Size -->
              <p v-if="outputBlob" class="text-xs text-muted-foreground mt-2 text-center">
                {{ t('converter.outputFileSize', { size: formatFileSize(outputBlob.size) }) }}
              </p>
            </div>
          </div>

          <!-- Right Panel: Export Settings -->
          <div class="p-5 border-t md:border-t-0 md:border-l border-border space-y-4">
            <h3 class="text-sm font-semibold text-foreground">{{ t('converter.exportSettings') }}</h3>

            <!-- Output Format Display -->
            <div>
              <label class="text-xs font-medium text-muted-foreground block mb-1.5">{{ t('converter.outputFormat') }}</label>
              <div class="px-3 py-2 bg-muted rounded-md text-sm font-medium text-foreground">
                SVG → {{ formatUpper }}
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

            <!-- DXF Info -->
            <div v-if="format === 'dxf'" class="bg-muted rounded-lg p-3 space-y-1">
              <p class="text-xs font-medium text-foreground">{{ t('converter.dxfInfo.title') }}</p>
              <p class="text-xs text-muted-foreground">{{ t('converter.dxfInfo.lines') }}</p>
              <p class="text-xs text-muted-foreground">{{ t('converter.dxfInfo.circles') }}</p>
              <p class="text-xs text-muted-foreground">{{ t('converter.dxfInfo.paths') }}</p>
              <p class="text-xs text-muted-foreground">{{ t('converter.dxfInfo.polygons') }}</p>
            </div>

            <!-- PDF Info -->
            <div v-if="format === 'pdf'" class="bg-muted rounded-lg p-3 space-y-1">
              <p class="text-xs font-medium text-foreground">{{ t('converter.pdfInfo.title') }}</p>
              <p class="text-xs text-muted-foreground">{{ t('converter.pdfInfo.description') }}</p>
              <p class="text-xs text-muted-foreground">{{ t('converter.pdfInfo.dimensions', { w: (outputWidth * 0.264583).toFixed(1), h: (outputHeight * 0.264583).toFixed(1) }) }}</p>
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
                @click="download()"
              >
                <Download class="w-4 h-4" />
                {{ t('converter.downloadFile', { format: formatUpper }) }}
              </button>
            </div>

            <!-- Reset Link -->
            <button
              class="w-full text-sm text-muted-foreground hover:text-foreground text-center py-1 transition-colors"
              @click="handleReplace"
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
</template>