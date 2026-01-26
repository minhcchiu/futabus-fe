<script setup lang="ts">
const emit = defineEmits(["open-menu"]);
</script>

<template>
  <div
    class="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10"
  >
    <!-- LEFT: Hamburger + Flag -->
    <div class="flex items-center gap-3 md:pt-2">
      <!-- Hamburger (mobile) -->
      <button
        class="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 md:hidden"
        @click="emit('open-menu')"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Language -->
      <button
        class="hidden items-center gap-1 text-sm text-white hover:opacity-80 sm:flex"
      >
        <img
          src="https://futabus.vn/images/icons/vietnam.svg"
          alt="Vietnam"
          class="h-4 w-4"
        >
        <span>VI</span>
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>

    <!-- CENTER LOGO -->
    <div class="flex flex-1 justify-center">
      <img src="/logo.png" alt="FUTA Bus Lines" class="h-10 object-contain" >
    </div>

    <!-- RIGHT: Auth -->

    <div class="flex items-center gap-2 md:pt-2">
      <!-- Phone -->
      <a
        href="tel:19001234"
        class="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-green-700 shadow hover:bg-white sm:text-sm"
        title="Gọi hotline"
      >
        <!-- Phone Icon -->
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 5a2 2 0 012-2h2l2 5-2 2a16 16 0 007 7l2-2 5 2v2a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </a>

      <!-- Zalo -->
      <a
        href="https://zalo.me/0909123456"
        target="_blank"
        class="flex items-center gap-2 rounded-full bg-blue-500 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-blue-600 sm:text-sm"
        title="Chat Zalo"
      >
        <!-- Zalo Logo -->
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
          alt="Zalo"
          class="h-4 w-4 rounded-sm bg-white"
        >
      </a>
    </div>

    <div class="flex hidden items-center md:mt-2">
      <button
        class="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow hover:bg-gray-100 sm:px-4 sm:text-sm"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5.121 17.804A9 9 0 1118.9 4.1M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span class="hidden sm:inline">Đăng nhập / Đăng ký</span>
      </button>
    </div>
  </div>
</template>
