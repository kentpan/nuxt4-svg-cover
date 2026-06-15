<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: t('pages.whatIsSvg.metaTitle'),
  meta: [
    { name: 'description', content: t('pages.whatIsSvg.metaDescription') }
  ]
})
</script>

<template>
  <div class="py-16 px-4 bg-background">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-foreground mb-6">{{ t('pages.whatIsSvg.title') }}</h1>

      <div class="text-muted-foreground leading-relaxed space-y-4">
        <p v-html="t('pages.whatIsSvg.p1', { bold: `<strong class='text-foreground'>${t('pages.whatIsSvg.p1Bold')}</strong>` })" />

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.whatIsSvg.h2HowItWorks') }}</h2>
        <p>{{ t('pages.whatIsSvg.p2') }}</p>
        <p>{{ t('pages.whatIsSvg.p3') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.whatIsSvg.h2Benefits') }}</h2>
        <p v-html="t('pages.whatIsSvg.p4', { bold: `<strong class='text-foreground'>${t('pages.whatIsSvg.p4Bold')}</strong>` })" />
        <p v-html="t('pages.whatIsSvg.p5', { bold: `<strong class='text-foreground'>${t('pages.whatIsSvg.p5Bold')}</strong>` })" />

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.whatIsSvg.h2UseCases') }}</h2>
        <p v-html="t('pages.whatIsSvg.p6', { link: `<a href='${localePath('/')}' class='text-primary underline underline-offset-2 hover:text-primary/80 transition-colors'>${t('pages.whatIsSvg.p6Link')}</a>` })" />
      </div>
    </div>
  </div>
</template>
