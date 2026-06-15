<script setup lang="ts">
import { Upload } from 'lucide-vue-next'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  accept?: string
  label?: string
  dropText?: string
  browseHint?: string
}>(), {
  accept: '.svg,image/svg+xml',
  label: '',
  dropText: '',
  browseHint: '',
})

const emit = defineEmits<{
  'file-selected': [file: File]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isDragActive = ref(false)

function handleClick() {
  inputRef.value?.click()
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('file-selected', file)
    target.value = ''
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  isDragActive.value = true
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  isDragActive.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragActive.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    emit('file-selected', file)
  }
}
</script>

<template>
  <div
    :class="[
      'w-full max-w-lg mx-auto border-2 border-dashed border-upload-border bg-upload-bg rounded-2xl p-6 sm:p-12 flex flex-col items-center gap-3 sm:gap-4 cursor-pointer transition-all hover:border-primary hover:bg-accent',
      { 'upload-zone-active': isDragActive },
    ]"
    @click="handleClick"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    role="button"
    tabindex="0"
    :aria-label="label || t('converter.uploadLabel')"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center transition-colors">
      <Upload class="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
    </div>
    <span class="font-semibold text-foreground text-base sm:text-lg">{{ dropText || t('converter.dropText') }}</span>
    <span class="text-sm text-muted-foreground">{{ browseHint || t('converter.browseHint') }}</span>
    <input
      ref="inputRef"
      type="file"
      :accept="accept"
      class="hidden"
      @change="handleInputChange"
    />
  </div>
</template>