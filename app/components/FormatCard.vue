<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  title: string
  description: string
  href: string
  colorClass?: string
}>()
</script>

<template>
  <div class="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
    <span
      class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border w-fit"
      :class="colorClass"
    >
      {{ title }}
    </span>
    <p class="text-sm text-muted-foreground leading-relaxed flex-1">
      {{ description }}
    </p>
    <a
      :href="href"
      class="text-sm font-medium text-primary hover:underline"
    >
      {{ t('common.learnMore') }}
    </a>
  </div>
</template>