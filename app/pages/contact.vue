<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('legal.contact.metaTitle'),
  meta: [
    { name: 'description', content: t('legal.contact.metaDescription') }
  ]
})
</script>

<template>
  <div class="py-16 px-4 bg-background">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-foreground mb-6">{{ t('legal.contact.title') }}</h1>

      <div class="text-muted-foreground leading-relaxed space-y-4">
        <p>{{ t('legal.contact.p1') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.contact.h2GetInTouch') }}</h2>
        <p v-html="t('legal.contact.p2', { bold: `<strong class='text-foreground'>${t('legal.contact.p2Bold')}</strong>` })" />

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.contact.h2BugReports') }}</h2>
        <p>{{ t('legal.contact.p3') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.contact.h2FeatureRequests') }}</h2>
        <p>{{ t('legal.contact.p4') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.contact.h2ResponseTime') }}</h2>
        <p>{{ t('legal.contact.p5') }}</p>
      </div>
    </div>
  </div>
</template>
