<script setup lang="ts">
defineProps<{
  label: string;
  src?: string;
  ratio?: string;
  height?: number; // px – BẮT BUỘC ĐỀU
}>();

defineEmits(["upload", "remove"]);
</script>

<template>
  <div class="flex flex-col">
    <p class="mb-2 text-sm font-medium">{{ label }}</p>

    <!-- KHUNG ẢNH -->
    <div
      class="relative flex w-full items-center justify-center overflow-hidden rounded-xl border bg-gray-50"
      :style="{
        height: `${height || 140}px`,
        aspectRatio: ratio || '1 / 1',
      }"
    >
      <img v-if="src" :src="src" class="h-full w-full object-contain" >
      <span v-else class="absolute text-xs text-gray-400"> No image </span>
    </div>

    <!-- ACTION -->
    <div class="mt-2 flex gap-3 text-sm">
      <button
        type="button"
        class="text-primary hover:underline"
        @click="$emit('upload')"
      >
        Upload
      </button>
      <button
        v-if="src"
        type="button"
        class="text-red-500 hover:underline"
        @click="$emit('remove')"
      >
        Xoá
      </button>
    </div>
  </div>
</template>
