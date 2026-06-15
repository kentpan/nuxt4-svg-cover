// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Nuxt 4 compatibility version - enables all Nuxt 4 features and behaviors
  compatibilityVersion: 4,

  devtools: { enabled: false },

  // Static site generation for Cloudflare Pages
  ssr: true,
  nitro: {
    // Use cloudflare-pages only for production build; dev uses default node server
    preset: process.env.NODE_ENV === 'production' ? 'cloudflare-pages' : undefined,
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/svg-to-png',
        '/svg-to-jpg',
        '/svg-to-webp',
        '/svg-to-pdf',
        '/svg-to-ico',
        '/svg-to-dxf',
        '/png-to-svg',
        '/dxf-to-svg',
        '/what-is-svg',
        '/svg-vs-png',
        '/how-to-convert-svg',
        '/svg-for-favicon',
        '/best-svg-export-settings',
        '/privacy-policy',
        '/terms-of-service',
        '/contact',
        '/icon-generator',
      ],
    },
  },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],

  i18n: {
    locales: [
      { code: 'zh', name: '简体中文', file: 'zh.json' },
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
      { code: 'ja', name: '日本語', file: 'ja.json' },
    ],
    defaultLocale: 'zh',
    strategy: 'no_prefix',
    langDir: 'app/locales',
    lazy: false,
    restructureDir: false,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'no prefix',
      alwaysRedirect: false,
    },
  },

  app: {
    head: {
      title: 'Free SVG Converter Online – Convert SVG to PNG, JPG, WebP, PDF, ICO & DXF',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Convert SVG files online for free. Export SVG to PNG, JPG, WebP, PDF, ICO, or DXF. Convert images and DXF to SVG. No signup required.',
        },
        {
          name: 'keywords',
          content:
            'SVG Converter,Free SVG Converter,Online SVG Converter,SVG to PNG,SVG to JPG,SVG to WebP,SVG to PDF,SVG to ICO,SVG to DXF,DXF to SVG,PNG to SVG',
        },
        {
          property: 'og:title',
          content: 'Free SVG Converter Online – Convert SVG to PNG, JPG, WebP, PDF, ICO & DXF',
        },
        {
          property: 'og:description',
          content:
            'Convert SVG files online for free. Export SVG to PNG, JPG, WebP, PDF, ICO, or DXF. Convert images and DXF to SVG. No signup required.',
        },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary' },
      ],
      link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
      htmlAttrs: {
        lang: 'zh',
        dir: 'ltr',
      },
    },
  },

  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },

  css: ['~/assets/css/main.css'],

  vite: {
    optimizeDeps: {
      include: ['jspdf', 'lucide-vue-next', 'imagetracerjs'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
})