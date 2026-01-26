<template>
  <div class="flex w-full items-center rounded-full border bg-white px-4 py-2">
    <img
      src="https://futabus.vn/images/icons/search.svg"
      alt=""
      class="mr-2 h-4 w-4"
    >
    <input
      :placeholder="placeholder"
      class="w-full border-none text-sm outline-none"
    >
  </div>
</template>

<script setup lang="ts">
defineProps<{
  placeholder: string;
}>();
</script>
