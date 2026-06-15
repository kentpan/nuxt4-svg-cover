<script setup lang="ts">
import { Menu, X, Moon, Sun, Globe, ChevronDown } from 'lucide-vue-next'

const { t } = useI18n()
const { locale, locales, setLocale } = useI18n()

const mobileMenuOpen = ref(false)
const localeMenuOpen = ref(false)

const navItems = [
  { labelKey: 'header.nav.png', href: '/svg-to-png' },
  { labelKey: 'header.nav.jpg', href: '/svg-to-jpg' },
  { labelKey: 'header.nav.webp', href: '/svg-to-webp' },
  { labelKey: 'header.nav.pdf', href: '/svg-to-pdf' },
  { labelKey: 'header.nav.ico', href: '/svg-to-ico' },
  { labelKey: 'header.nav.dxf', href: '/svg-to-dxf' },
  { labelKey: 'header.nav.imageToSvg', href: '/png-to-svg' },
  { labelKey: 'header.nav.dxfToSvg', href: '/dxf-to-svg' },
  { labelKey: 'header.nav.iconGenerator', href: '/icon-generator' },
]

const isDark = ref(false)

function toggleDarkMode() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', isDark.value)
}

onMounted(() => {
  if (import.meta.client) {
    // Sync reactive state with actual DOM class (set by inline script in app.vue)
    isDark.value = document.documentElement.classList.contains('dark')
  }
})

function switchLocale(code: string) {
  localeMenuOpen.value = false
  // Persist locale choice in both localStorage and cookie
  localStorage.setItem('locale', code)
  const cookie = useCookie('i18n_locale', { maxAge: 365 * 24 * 60 * 60 })
  cookie.value = code
  setLocale(code)
}

// Close mobile menu on route change
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

// Close locale menu on outside click
onMounted(() => {
  if (import.meta.client) {
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-locale-menu]')) {
        localeMenuOpen.value = false
      }
    })
  }
})

const availableLocales = computed(() => {
  return (locales.value as Array<{ code: string; name: string }>).map(l => ({
    code: l.code,
    name: l.name,
  }))
})

const currentLocaleName = computed(() => {
  const found = availableLocales.value.find(l => l.code === locale.value)
  return found ? found.name : 'EN'
})
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
    <div class="max-w-5xl mx-auto h-14 flex items-center justify-between px-4">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
        <span class="text-xl font-extrabold tracking-tighter">
          <span class="bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">SVG</span>
        </span>
        <span class="font-bold text-lg tracking-tight text-foreground">{{ t('header.logo') }}</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden sm:flex items-center gap-0.5">
        <NuxtLink
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          class="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
        >
          {{ t(item.labelKey) }}
        </NuxtLink>
      </nav>

      <!-- Right side: dark mode, locale, mobile menu -->
      <div class="flex items-center gap-0.5">
        <!-- Dark/Light Mode Toggle -->
        <button
          class="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          @click="toggleDarkMode"
          :aria-label="isDark ? t('header.darkMode.switchToLight') : t('header.darkMode.switchToDark')"
          :title="isDark ? t('header.darkMode.switchToLight') : t('header.darkMode.switchToDark')"
        >
          <Moon v-if="!isDark" class="w-4 h-4" />
          <Sun v-else class="w-4 h-4" />
        </button>

        <!-- Language Switcher -->
        <div class="relative" data-locale-menu>
          <button
            class="flex items-center gap-1 w-9 h-9 justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors sm:w-auto sm:h-auto sm:px-2 sm:py-1.5"
            @click.stop="localeMenuOpen = !localeMenuOpen"
            aria-label="Switch language"
          >
            <Globe class="w-4 h-4" />
            <span class="text-xs font-medium hidden sm:inline">{{ currentLocaleName }}</span>
            <ChevronDown class="w-3 h-3" />
          </button>

          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="localeMenuOpen"
              class="absolute right-0 mt-1 w-36 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50"
            >
              <button
                v-for="loc in availableLocales"
                :key="loc.code"
                class="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-accent"
                :class="locale === loc.code ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'"
                @click="switchLocale(loc.code)"
              >
                {{ loc.name }}
              </button>
            </div>
          </Transition>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="sm:hidden w-9 h-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-label="t('header.menu.toggle')"
          :aria-expanded="mobileMenuOpen"
        >
          <X v-if="mobileMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="mobileMenuOpen"
        class="sm:hidden border-t bg-card px-4 py-3 space-y-1"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          class="block px-3 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
        >
          {{ t(item.labelKey) }}
        </NuxtLink>
      </div>
    </Transition>
  </header>
</template>