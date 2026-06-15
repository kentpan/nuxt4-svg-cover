<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Header />
    <main id="main-content">
      <slot />
    </main>
    <Footer />
  </div>
</template>