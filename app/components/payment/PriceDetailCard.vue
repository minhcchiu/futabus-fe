<script setup lang="ts">
import { formatMoney } from "~/utils/helpers/data.helper";
import type { Booking } from "~/validations/admin/booking.validation";

defineProps<{
  booked: Booking;
}>();
</script>

<template>
  <div class="rounded-xl bg-white p-4 text-center shadow">
    <h3 class="mb-2 font-semibold">Chi tiết giá</h3>
    <div class="space-y-1 text-sm">
      <div class="flex justify-between">
        <span>Giá vé</span>
        <span class="text-green-500">{{
          formatMoney(booked?.amount || 0)
        }}</span>
      </div>
      <div class="flex justify-between">
        <span>Phí thanh toán</span>
        <span>0đ</span>
      </div>
      <hr >
      <div class="flex justify-between font-semibold">
        <span>Tổng tiền</span>
        <span class="text-green-500">{{
          formatMoney(booked?.amount || 0)
        }}</span>
      </div>
    </div>
  </div>
</template>
