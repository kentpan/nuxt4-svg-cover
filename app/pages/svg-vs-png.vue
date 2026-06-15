<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: t('pages.svgVsPng.metaTitle'),
  meta: [
    { name: 'description', content: t('pages.svgVsPng.metaDescription') }
  ]
})
</script>

<template>
  <div class="py-16 px-4 bg-background">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-foreground mb-6">{{ t('pages.svgVsPng.title') }}</h1>

      <div class="text-muted-foreground leading-relaxed space-y-4">
        <p>{{ t('pages.svgVsPng.p1') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.svgVsPng.h2Difference') }}</h2>
        <p v-html="t('pages.svgVsPng.p2', { bold1: `<strong class='text-foreground'>${t('pages.svgVsPng.p2Bold1')}</strong>`, bold2: `<strong class='text-foreground'>${t('pages.svgVsPng.p2Bold2')}</strong>` })" />

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.svgVsPng.h2Table') }}</h2>

        <!-- Comparison Table -->
        <div class="overflow-x-auto rounded-lg border border-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted/50">
              <tr>
                <th class="px-4 py-3 font-semibold text-foreground">{{ t('pages.svgVsPng.tableFeature') }}</th>
                <th class="px-4 py-3 font-semibold text-foreground">SVG</th>
                <th class="px-4 py-3 font-semibold text-foreground">PNG</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr>
                <td class="px-4 py-3 font-medium text-foreground">{{ t('pages.svgVsPng.tableType') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableVector') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableRaster') }}</td>
              </tr>
              <tr class="bg-muted/30">
                <td class="px-4 py-3 font-medium text-foreground">{{ t('pages.svgVsPng.tableScalability') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableInfinite') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableDegrades') }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium text-foreground">{{ t('pages.svgVsPng.tableFileSizeIcons') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableVerySmall') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableLarger') }}</td>
              </tr>
              <tr class="bg-muted/30">
                <td class="px-4 py-3 font-medium text-foreground">{{ t('pages.svgVsPng.tableFileSizePhotos') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableExtremelyLarge') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableReasonable') }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium text-foreground">{{ t('pages.svgVsPng.tableTransparency') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableFullAlpha') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableFullAlpha') }}</td>
              </tr>
              <tr class="bg-muted/30">
                <td class="px-4 py-3 font-medium text-foreground">{{ t('pages.svgVsPng.tableAnimations') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableCssSmil') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableNotSupported') }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium text-foreground">{{ t('pages.svgVsPng.tableEditability') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableCodeEditor') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableRasterEditor') }}</td>
              </tr>
              <tr class="bg-muted/30">
                <td class="px-4 py-3 font-medium text-foreground">{{ t('pages.svgVsPng.tableSeo') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableIndexable') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableAltText') }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium text-foreground">{{ t('pages.svgVsPng.tableBrowserSupport') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableAllModern') }}</td>
                <td class="px-4 py-3">{{ t('pages.svgVsPng.tableUniversal') }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.svgVsPng.h2WhenSvg') }}</h2>
        <p>{{ t('pages.svgVsPng.p3') }}</p>

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.svgVsPng.h2WhenPng') }}</h2>
        <p v-html="t('pages.svgVsPng.p4', { link: `<a href='${localePath('/svg-to-png')}' class='text-primary underline underline-offset-2 hover:text-primary/80 transition-colors'>${t('pages.svgVsPng.p4Link')}</a>` })" />

        <h2 class="text-xl font-semibold text-foreground mt-8 mb-3">{{ t('pages.svgVsPng.h2BottomLine') }}</h2>
        <p>{{ t('pages.svgVsPng.p5') }}</p>
      </div>
    </div>
  </div>
</template>
