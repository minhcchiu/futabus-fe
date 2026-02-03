<script setup lang="ts">
import { ref } from "vue";
import type { Sepay } from "~/validations/admin/sepay.validation";

defineProps<{
  banks: Sepay[];
  cash?: {
    bankName: string;
    note?: string;
  };
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | "CASH"): void;
}>();

const model = ref<string | "CASH" | null>(null);
</script>

<template>
  <div class="rounded-xl bg-white p-4">
    <h2 class="mb-4 hidden text-lg font-semibold md:block">
      Chọn phương thức thanh toán
    </h2>

    <div class="space-y-3">
      <!-- BANK LIST -->
      <label
        v-for="item in banks"
        :key="item.code"
        class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50"
      >
        <input
          v-model="model"
          type="radio"
          class="accent-green-500"
          :value="item.code"
          @change="emit('update:modelValue', item.code)"
        />

        <img :src="item.logo" class="w-12" />

        <div>
          <div class="font-medium">
            {{ item.shortName || item.short_name }}
          </div>
          <div v-if="item.note" class="text-xs text-green-500">
            {{ item.note }}
          </div>
        </div>
      </label>

      <!-- CASH -->
      <label
        class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50"
      >
        <input
          v-model="model"
          type="radio"
          class="accent-green-500"
          value="CASH"
          @change="emit('update:modelValue', 'CASH')"
        />

        <div
          class="ml-2 mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700"
        >
          💵
        </div>

        <div>
          <div class="font-medium">Tiền mặt</div>
          <div class="text-xs text-gray-500">
            Liên hệ nhà xe và thanh toán tại nhà xe
          </div>
        </div>
      </label>
    </div>
  </div>
</template>
