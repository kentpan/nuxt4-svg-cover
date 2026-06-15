<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps<{
  icon: string
  title: string
  description: string
}>()

const iconComponent = computed(() => {
  return (LucideIcons as Record<string, unknown>)[props.icon]
})
</script>

<template>
  <div class="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
    <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
      <component :is="iconComponent" class="w-5 h-5" />
    </div>
    <h3 class="font-semibold text-foreground">{{ title }}</h3>
    <p class="text-sm text-muted-foreground leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>