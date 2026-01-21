<template>
  <div class="rounded-xl border bg-white p-4">
    <h3 class="mb-4 font-semibold">Revenue (Last 7 days)</h3>
    <div class="flex h-52 items-end gap-2">
      <div
        v-for="v in data"
        :key="v"
        class="w-full rounded bg-primary"
        :style="{ height: v + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
const data = [30, 40, 35, 50, 55, 70, 60];
</script>
