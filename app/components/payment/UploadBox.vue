<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  label?: string;
  required?: boolean;
  modelValue?: File | null;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: File | null): void;
}>();

const previewUrl = computed(() =>
  props.modelValue ? URL.createObjectURL(props.modelValue) : null,
);

function onChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  emit("update:modelValue", file);
}
</script>

<template>
  <label
    class="relative block overflow-hidden rounded-xl border transition"
    :class="[
      disabled
        ? 'cursor-not-allowed bg-gray-100'
        : 'cursor-pointer hover:border-green-400',
    ]"
  >
    <!-- input -->
    <input
      type="file"
      accept="image/*"
      class="hidden"
      :disabled="disabled"
      @change="onChange"
    >

    <!-- PREVIEW -->
    <div v-if="previewUrl" class="h-40 bg-gray-50">
      <img :src="previewUrl" class="h-full w-full object-contain" >

      <!-- overlay hint -->
      <div
        v-if="!disabled"
        class="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-medium text-white opacity-0 transition hover:opacity-100"
      >
        Nhấn để đổi ảnh
      </div>
    </div>

    <!-- EMPTY -->
    <div
      v-else
      class="flex h-40 flex-col items-center justify-center border-2 border-dashed text-center"
    >
      <div class="mb-2 text-gray-400">
        <slot />
      </div>

      <div class="text-sm text-gray-600">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </div>
    </div>
  </label>
</template>
