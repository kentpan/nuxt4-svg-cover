<script setup lang="ts">
import { Zap, UserX, ShieldCheck, ArrowDown } from 'lucide-vue-next'

const { t, tm } = useI18n()

useHead({
  title: t('tools.pdf.metaTitle'),
  meta: [
    { name: 'description', content: t('tools.pdf.metaDescription') },
  ],
})

const seo2Items = computed(() => {
  const raw = tm('tools.pdf.seo2Items')
  if (!Array.isArray(raw)) return []
  return Array.from({ length: raw.length }, (_, i) => ({
    label: t(`tools.pdf.seo2Items.${i}.label`),
    desc: t(`tools.pdf.seo2Items.${i}.desc`),
  }))
})

const faqItems = computed(() => {
  const raw = tm('tools.pdf.faq')
  if (!Array.isArray(raw)) return []
  return Array.from({ length: raw.length }, (_, i) => ({
    question: t(`tools.pdf.faq.${i}.q`),
    answer: t(`tools.pdf.faq.${i}.a`),
  }))
})

function scrollToConverter() {
  document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-hero-bg pt-10 sm:pt-16 pb-12 sm:pb-20 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <!-- Badge row -->
        <div class="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-badge-bg text-badge-fg text-xs font-medium">
            <Zap class="w-3.5 h-3.5" />
            {{ t('common.freeToUse') }}
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-badge-bg text-badge-fg text-xs font-medium">
            <UserX class="w-3.5 h-3.5" />
            {{ t('common.noSignup') }}
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-badge-bg text-badge-fg text-xs font-medium">
            <ShieldCheck class="w-3.5 h-3.5" />
            {{ t('common.privacyFriendly') }}
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-badge-bg text-badge-fg text-xs font-medium">
            <Zap class="w-3.5 h-3.5" />
            {{ t('common.fastExport') }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 text-balance">
          {{ t('tools.pdf.heroTitle') }}
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-muted-foreground mb-8">
          {{ t('tools.pdf.heroSubtitle') }}
        </p>

        <!-- CTA Button -->
        <button
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
          @click="scrollToConverter"
        >
          {{ t('common.startConverting') }}
          <ArrowDown class="w-4 h-4" />
        </button>
      </div>
    </section>

    <!-- Converter Tool -->
    <ConverterTool format="pdf" />

    <!-- SEO Content Section -->
    <section class="py-16 px-4 bg-background">
      <div class="max-w-3xl mx-auto space-y-12">
        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">{{ t('tools.pdf.seo1Title') }}</h2>
          <p class="text-muted-foreground leading-relaxed">
            {{ t('tools.pdf.seo1Content') }}
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">{{ t('tools.pdf.seo2Title') }}</h2>
          <ul class="space-y-3 text-muted-foreground">
            <li v-for="(item, i) in seo2Items" :key="i" class="flex items-start gap-3">
              <span class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span><strong class="text-foreground">{{ item.label }}</strong> — {{ item.desc }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 px-4 bg-hero-bg">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-foreground mb-8 text-center">{{ t('common.frequentlyAskedQuestions') }}</h2>
        <FaqAccordion :items="faqItems" />
      </div>
    </section>
  </div>
</template>