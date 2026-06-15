<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: t('pages.bestExportSettings.metaTitle'),
  meta: [
    { name: 'description', content: t('pages.bestExportSettings.metaDescription') }
  ]
})

const codeClass = 'rounded bg-muted px-1.5 py-0.5 text-sm text-foreground'
</script>

<template>
  <div class="py-16 px-4 bg-background">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-foreground mb-6">{{ t('pages.bestExportSettings.title') }}</h1>

      <div class="text-muted-foreground leading-relaxed space-y-4">
        <p>{{ t('pages.bestExportSettings.p1') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.bestExportSettings.h2GeneralRules') }}</h2>
        <p v-html="t('pages.bestExportSettings.p2', {
          bold1: `<strong class='text-foreground'>${t('pages.bestExportSettings.p2Bold1')}</strong>`,
          bold2: `<strong class='text-foreground'>${t('pages.bestExportSettings.p2Bold2')}</strong>`,
          bold3: `<strong class='text-foreground'>${t('pages.bestExportSettings.p2Bold3')}</strong>`
        })" />
        <p>{{ t('pages.bestExportSettings.p3') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.bestExportSettings.h2Web') }}</h2>
        <p v-html="t('pages.bestExportSettings.p4', {
          bold: `<strong class='text-foreground'>${t('pages.bestExportSettings.p4Bold')}</strong>`,
          code1: `<code class='${codeClass}'>width</code>`,
          code2: `<code class='${codeClass}'>height</code>`,
          code3: `<code class='${codeClass}'>viewBox</code>`,
          code4: `<code class='${codeClass}'>Arial, sans-serif</code>`,
          link: `<a href='${localePath('/svg-to-webp')}' class='text-primary underline underline-offset-2 hover:text-primary/80 transition-colors'>${t('footer.tools.svgToWebp')}</a>`
        })" />

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.bestExportSettings.h2Print') }}</h2>
        <p v-html="t('pages.bestExportSettings.p5', {
          bold: `<strong class='text-foreground'>${t('pages.bestExportSettings.p5Bold')}</strong>`,
          link: `<a href='${localePath('/svg-to-pdf')}' class='text-primary underline underline-offset-2 hover:text-primary/80 transition-colors'>${t('footer.tools.svgToPdf')}</a>`
        })" />

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.bestExportSettings.h2SocialMedia') }}</h2>
        <p v-html="t('pages.bestExportSettings.p6', {
          bold: `<strong class='text-foreground'>${t('pages.bestExportSettings.p6Bold')}</strong>`,
          link: `<a href='${localePath('/svg-to-png')}' class='text-primary underline underline-offset-2 hover:text-primary/80 transition-colors'>${t('footer.tools.svgToPng')}</a>`
        })" />

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.bestExportSettings.h2Icons') }}</h2>
        <p v-html="t('pages.bestExportSettings.p7', {
          bold: `<strong class='text-foreground'>${t('pages.bestExportSettings.p7Bold')}</strong>`,
          code: `<code class='${codeClass}'>0 0 24 24</code>`
        })" />
        <p v-html="t('pages.bestExportSettings.p8', { link: `<a href='${localePath('/')}' class='text-primary underline underline-offset-2 hover:text-primary/80 transition-colors'>${t('pages.bestExportSettings.p8Link')}</a>` })" />
      </div>
    </div>
  </div>
</template>
