<script setup lang="ts">
useHead({
  title: "Mai Linh",
  meta: [
    {
      name: "Mai Linh",
      content: "Mai Linh - Book your bus ticket online",
    },
  ],
});
const { isMenuOpen } = useOpenMenu();
const { headerHeight } = useHeightHeader();
const navRef = ref();
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header
      class="relative z-30 bg-gradient-to-b from-green-300 via-green-400 to-green-500"
      :class="[headerHeight, { 'z-[999]': isMenuOpen }]"
    >
      <TopBar @open-menu="navRef?.openMobileMenu()" />

      <MainNav ref="navRef" />
    </header>

    <main class="relative mx-auto max-w-7xl px-4 sm:px-6">
      <slot />
    </main>

    <Footer />
  </div>
</template>
