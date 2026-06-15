<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: t('pages.svgForFavicon.metaTitle'),
  meta: [
    { name: 'description', content: t('pages.svgForFavicon.metaDescription') }
  ]
})

const codeClass = 'rounded bg-muted px-1.5 py-0.5 text-sm text-foreground'
</script>

<template>
  <div class="py-16 px-4 bg-background">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-foreground mb-6">{{ t('pages.svgForFavicon.title') }}</h1>

      <div class="text-muted-foreground leading-relaxed space-y-4">
        <p>{{ t('pages.svgForFavicon.p1') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.svgForFavicon.h2DesignSmall') }}</h2>
        <p>{{ t('pages.svgForFavicon.p2') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.svgForFavicon.h2BestPractices') }}</h2>
        <p v-html="t('pages.svgForFavicon.p3', {
          bold: `<strong class='text-foreground'>${t('pages.svgForFavicon.p3Bold')}</strong>`,
          code1: `<code class='${codeClass}'>${t('pages.svgForFavicon.p3Code1')}</code>`,
          code2: `<code class='${codeClass}'>${t('pages.svgForFavicon.p3Code2')}</code>`,
          code3: `<code class='${codeClass}'>${t('pages.svgForFavicon.p3Code3')}</code>`,
          code4: `<code class='${codeClass}'>${t('pages.svgForFavicon.p3Code4')}</code>`
        })" />
        <p v-html="t('pages.svgForFavicon.p4', { bold: `<strong class='text-foreground'>${t('pages.svgForFavicon.p4Bold')}</strong>` })" />
        <p v-html="t('pages.svgForFavicon.p5', { bold: `<strong class='text-foreground'>${t('pages.svgForFavicon.p5Bold')}</strong>` })" />

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.svgForFavicon.h2AddingFavicon') }}</h2>
        <p v-html="t('pages.svgForFavicon.p6', {
          code1: `<code class='${codeClass}'>&lt;head&gt;</code>`,
          code2: `<code class='${codeClass}'>&lt;link rel=&quot;icon&quot; href=&quot;/favicon.svg&quot; type=&quot;image/svg+xml&quot;&gt;</code>`,
          code3: `<code class='${codeClass}'>type</code>`,
          code4: `<code class='${codeClass}'>sizes</code>`
        })" />

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.svgForFavicon.h2ConvertingIco') }}</h2>
        <p v-html="t('pages.svgForFavicon.p7', {
          link1: `<a href='${localePath('/svg-to-ico')}' class='text-primary underline underline-offset-2 hover:text-primary/80 transition-colors'>${t('pages.svgForFavicon.p7Link1')}</a>`,
          link2: `<a href='${localePath('/svg-to-png')}' class='text-primary underline underline-offset-2 hover:text-primary/80 transition-colors'>${t('pages.svgForFavicon.p7Link2')}</a>`
        })" />
        <p>{{ t('pages.svgForFavicon.p8') }}</p>
      </div>
    </div>
  </div>
</template>
