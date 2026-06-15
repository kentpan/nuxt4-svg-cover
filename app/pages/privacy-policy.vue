<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { locale } = useI18n()

const formattedDate = computed(() => new Date().toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }))

useHead({
  title: t('legal.privacy.metaTitle'),
  meta: [
    { name: 'description', content: t('legal.privacy.metaDescription') }
  ]
})
</script>

<template>
  <div class="py-16 px-4 bg-background">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-foreground mb-6">{{ t('legal.privacy.title') }}</h1>

      <p class="text-sm text-muted-foreground mb-8">{{ t('legal.privacy.lastUpdated', { date: formattedDate }) }}</p>

      <div class="text-muted-foreground leading-relaxed space-y-4">
        <p>{{ t('legal.privacy.p1') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.privacy.h2ClientSide') }}</h2>
        <p v-html="t('legal.privacy.p2', { bold: `<strong class='text-foreground'>${t('legal.privacy.p2Bold')}</strong>` })" />

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.privacy.h2NoCookies') }}</h2>
        <p>{{ t('legal.privacy.p3') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.privacy.h2NoTracking') }}</h2>
        <p>{{ t('legal.privacy.p4') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.privacy.h2NoPersonalData') }}</h2>
        <p>{{ t('legal.privacy.p5') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.privacy.h2ThirdParty') }}</h2>
        <p>{{ t('legal.privacy.p6') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.privacy.h2Children') }}</h2>
        <p>{{ t('legal.privacy.p7') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.privacy.h2Changes') }}</h2>
        <p>{{ t('legal.privacy.p8') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('legal.privacy.h2Contact') }}</h2>
        <p v-html="t('legal.privacy.p9', { link: `<a href='${localePath('/contact')}' class='text-primary underline underline-offset-2 hover:text-primary/80 transition-colors'>${t('legal.privacy.p9Link')}</a>` })" />
      </div>
    </div>
  </div>
</template>
