<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

interface FaqItem {
  question: string
  answer: string
}

const props = defineProps<{
  items: FaqItem[]
}>()

const openIndex = ref<number | null>(null)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div class="max-w-3xl mx-auto flex flex-col gap-2">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="bg-card border border-border rounded-xl overflow-hidden"
    >
      <button
        class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-accent/50 transition-colors"
        @click="toggle(index)"
        :aria-expanded="openIndex === index"
      >
        <span class="font-medium text-foreground text-sm">{{ item.question }}</span>
        <ChevronDown
          class="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200"
          :class="{ 'rotate-180': openIndex === index }"
        />
      </button>
      <div
        class="overflow-hidden transition-all duration-300 ease-in-out"
        :style="{
          maxHeight: openIndex === index ? '500px' : '0px',
          opacity: openIndex === index ? 1 : 0,
        }"
      >
        <p class="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
          {{ item.answer }}
        </p>
      </div>
    </div>
  </div>
</template>