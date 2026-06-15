<script setup lang="ts">
const { t } = useI18n()

const currentYear = new Date().getFullYear()

const toolLinks = [
  { labelKey: 'footer.tools.svgConverter', href: '/' },
  { labelKey: 'footer.tools.svgToPng', href: '/svg-to-png' },
  { labelKey: 'footer.tools.svgToJpg', href: '/svg-to-jpg' },
  { labelKey: 'footer.tools.svgToWebp', href: '/svg-to-webp' },
  { labelKey: 'footer.tools.svgToPdf', href: '/svg-to-pdf' },
  { labelKey: 'footer.tools.svgToIco', href: '/svg-to-ico' },
  { labelKey: 'footer.tools.svgToDxf', href: '/svg-to-dxf' },
  { labelKey: 'footer.tools.imageToSvg', href: '/png-to-svg' },
  { labelKey: 'footer.tools.dxfToSvg', href: '/dxf-to-svg' },
  { labelKey: 'footer.tools.iconGenerator', href: '/icon-generator' },
]

const guideLinks = [
  { labelKey: 'footer.guides.whatIsSvg', href: '/what-is-svg' },
  { labelKey: 'footer.guides.svgVsPng', href: '/svg-vs-png' },
  { labelKey: 'footer.guides.howToConvert', href: '/how-to-convert-svg' },
  { labelKey: 'footer.guides.svgForFavicon', href: '/svg-for-favicon' },
  { labelKey: 'footer.guides.bestExportSettings', href: '/best-svg-export-settings' },
]

const useCaseLinks = [
  { labelKey: 'footer.useCases.logoToPng', href: '/svg-to-png' },
  { labelKey: 'footer.useCases.faviconFromSvg', href: '/svg-to-ico' },
  { labelKey: 'footer.useCases.svgForWebsites', href: '/svg-to-webp' },
  { labelKey: 'footer.useCases.svgForPresentations', href: '/svg-to-pdf' },
]

const policyLinks = [
  { labelKey: 'footer.policy.privacy', href: '/privacy-policy' },
  { labelKey: 'footer.policy.terms', href: '/terms-of-service' },
  { labelKey: 'footer.policy.contact', href: '/contact' },
]
</script>

<template>
  <footer class="bg-foreground text-primary-foreground mt-auto">
    <div class="max-w-5xl mx-auto px-4 py-12">
      <!-- 3-Column Grid -->
      <div class="sm:grid sm:grid-cols-3 gap-8 mb-10 space-y-8 sm:space-y-0">
        <!-- Tools Column -->
        <div>
          <h3 class="text-sm font-semibold mb-4 text-white/80 uppercase tracking-wide">{{ t('footer.tools.title') }}</h3>
          <ul class="space-y-2.5">
            <li v-for="link in toolLinks" :key="link.href">
              <NuxtLink :to="link.href" class="text-sm text-white/60 hover:text-white transition-colors">
                {{ t(link.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Guides Column -->
        <div>
          <h3 class="text-sm font-semibold mb-4 text-white/80 uppercase tracking-wide">{{ t('footer.guides.title') }}</h3>
          <ul class="space-y-2.5">
            <li v-for="link in guideLinks" :key="link.href">
              <NuxtLink :to="link.href" class="text-sm text-white/60 hover:text-white transition-colors">
                {{ t(link.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Use Cases Column -->
        <div>
          <h3 class="text-sm font-semibold mb-4 text-white/80 uppercase tracking-wide">{{ t('footer.useCases.title') }}</h3>
          <ul class="space-y-2.5">
            <li v-for="link in useCaseLinks" :key="link.labelKey">
              <NuxtLink :to="link.href" class="text-sm text-white/60 hover:text-white transition-colors">
                {{ t(link.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/10 pt-6 flex items-center justify-between gap-4">
        <!-- Logo & Copyright -->
        <div class="flex items-center gap-2">
          <span class="text-lg font-bold tracking-tight">
            <span class="bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">SVG</span>
          </span>
          <span class="text-sm text-white/60">{{ t('footer.copyright', { year: currentYear }) }}</span>
        </div>

        <!-- Policy Links -->
        <nav class="flex items-center gap-4 sm:gap-6">
          <NuxtLink
            v-for="link in policyLinks"
            :key="link.href"
            :to="link.href"
            class="text-sm text-white/60 hover:text-white transition-colors"
          >
            {{ t(link.labelKey) }}
          </NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>