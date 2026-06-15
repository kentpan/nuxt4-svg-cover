<script setup lang="ts">
// Prevent dark mode flash: read localStorage before hydration
// Prevent locale flash: set cookie from localStorage before i18n init
useHead({
  script: [
    {
      innerHTML: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();(function(){try{var l=localStorage.getItem('locale');if(l){document.cookie='i18n_locale='+encodeURIComponent(l)+';path=/;max-age=31536000;SameSite=Lax'}}catch(e){}})()`,
      type: 'text/javascript',
      tagPosition: 'head',
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
  </NuxtLayout>
</template>