<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { locale } = useI18n()

const formattedDate = computed(() => new Date().toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }))

useHead({
  title: t('legal.terms.metaTitle'),
  meta: [
    { name: 'description', content: t('legal.terms.metaDescription') }
  ]
})
</script>

<template>
  <div class="py-16 px-4 bg-background">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-foreground mb-6">{{ t('legal.terms.title') }}</h1>

      <p class="text-sm text-muted-foreground mb-8">{{ t('legal.terms.lastUpdated', { date: formattedDate }) }}</p>

      <div class="text-muted-foreground leading-relaxed space-y-4">
        <p>{{ t('legal.terms.p1') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.terms.h2Description') }}</h2>
        <p>{{ t('legal.terms.p2') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.terms.h2Free') }}</h2>
        <p>{{ t('legal.terms.p3') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.terms.h2NoWarranty') }}</h2>
        <p>{{ t('legal.terms.p4') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.terms.h2Accuracy') }}</h2>
        <p>{{ t('legal.terms.p5') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.terms.h2IP') }}</h2>
        <p>{{ t('legal.terms.p6') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.terms.h2Liability') }}</h2>
        <p>{{ t('legal.terms.p7') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.terms.h2Prohibited') }}</h2>
        <p>{{ t('legal.terms.p8') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.terms.h2TermsChanges') }}</h2>
        <p>{{ t('legal.terms.p9') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.terms.h2TermsContact') }}</h2>
        <p v-html="t('legal.terms.p10', { link: `<a href='${localePath('/contact')}' class='text-primary underline underline-offset-2 hover:text-primary/80 transition-colors'>${t('legal.terms.p10Link')}</a>` })" />
      </div>
    </div>
  </div>
</template>
