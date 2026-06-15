<script setup lang="ts">
defineProps<{
  number: number
  title: string
  description: string
}>()
</script>

<template>
  <div class="flex flex-col items-center text-center gap-3">
    <div class="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
      {{ number }}
    </div>
    <h3 class="font-semibold text-foreground">{{ title }}</h3>
    <p class="text-sm text-muted-foreground leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>