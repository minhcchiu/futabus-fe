<script setup lang="ts">
import { METHODS_DATA } from "~/utils/data";

const model = ref<string | null>(null);

const emit = defineEmits(["update:model-value"]);
</script>

<template>
  <div class="rounded-xl bg-white p-4">
    <h2 class="mb-4 hidden text-lg font-semibold md:block">
      Chọn phương thức thanh toán
    </h2>

    <div class="space-y-3">
      <label
        v-for="item in METHODS_DATA"
        :key="item.key"
        class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50"
      >
        <input
          v-model="model"
          type="radio"
          class="accent-green-500"
          :value="item.key"
          @change="emit('update:model-value', item.key)"
        />
        <img :src="item.icon" class="h-8 w-8" />
        <div>
          <div class="font-medium">{{ item.label }}</div>
          <div v-if="item.note" class="text-xs text-green-500">
            {{ item.note }}
          </div>
        </div>
      </label>
    </div>
  </div>
</template>
