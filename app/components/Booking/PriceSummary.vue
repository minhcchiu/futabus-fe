<script setup lang="ts">
import { formatMoney } from "~/utils/helpers/data.helper";

defineProps<{
  totalPrice: number;
}>();
</script>

<template>
  <div class="rounded-xl border bg-white p-4 text-sm">
    <h3 class="mb-3 flex items-center gap-1 font-semibold">
      Chi tiết giá
      <span class="text-green-500">ⓘ</span>
    </h3>

    <div class="space-y-2">
      <div class="flex justify-between">
        <span>Giá vé lượt đi</span>
        <span>{{ formatMoney(totalPrice) }}</span>
      </div>
      <div class="flex justify-between">
        <span>Phí thanh toán</span>
        <span>{{ formatMoney(totalPrice) }}</span>
      </div>
      <div class="flex justify-between font-semibold text-green-500">
        <span>Tổng tiền</span>
        <span>{{ formatMoney(totalPrice) }}</span>
      </div>
    </div>
  </div>
</template>
