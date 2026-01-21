<template>
  <div class="rounded-xl border bg-white p-4">
    <h3 class="mb-4 font-semibold">Trips by Route</h3>
    <div class="flex h-52 items-end gap-3">
      <div
        v-for="v in data"
        :key="v"
        class="w-full rounded bg-primary"
        :style="{ height: v + '%' }"
      />
    </div>
  </div>
</template>

<script setup>
const data = [70, 50, 45, 40, 30];
</script>
