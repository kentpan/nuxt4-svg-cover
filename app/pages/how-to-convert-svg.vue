<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: t('pages.howToConvert.metaTitle'),
  meta: [
    { name: 'description', content: t('pages.howToConvert.metaDescription') }
  ]
})
</script>

<template>
  <div class="py-16 px-4 bg-background">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-foreground mb-6">{{ t('pages.howToConvert.title') }}</h1>

      <div class="text-muted-foreground leading-relaxed space-y-4">
        <p>{{ t('pages.howToConvert.p1') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.howToConvert.h2Step1') }}</h2>
        <p v-html="t('pages.howToConvert.p2', { link1: `<a href='${localePath('/')}' class='text-primary underline underline-offset-2 hover:text-primary/80 transition-colors'>${t('pages.howToConvert.p2Link1')}</a>` })" />

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.howToConvert.h2Step2') }}</h2>
        <p>{{ t('pages.howToConvert.p3') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.howToConvert.h2Step3') }}</h2>
        <p>{{ t('pages.howToConvert.p4') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.howToConvert.h2Step4') }}</h2>
        <p>{{ t('pages.howToConvert.p5') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.howToConvert.h2WhyBrowser') }}</h2>
        <p>{{ t('pages.howToConvert.p6') }}</p>
        <p v-html="t('pages.howToConvert.p7', {
          link1: `<a href='${localePath('/what-is-svg')}' class='text-primary underline underline-offset-2 hover:text-primary/80 transition-colors'>${t('pages.howToConvert.p7Link1')}</a>`,
          link2: `<a href='${localePath('/svg-vs-png')}' class='text-primary underline underline-offset-2 hover:text-primary/80 transition-colors'>${t('pages.howToConvert.p7Link2')}</a>`
        })" />
      </div>
    </div>
  </div>
</template>
