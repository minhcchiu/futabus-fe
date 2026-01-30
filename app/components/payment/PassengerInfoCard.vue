<script setup lang="ts">
import type { CustomerInfo } from "~/validations/admin/booking.validation";

defineProps<{
  customerInfo?: CustomerInfo;
}>();
</script>

<template>
  <div class="rounded-xl border bg-white p-4">
    <h3 class="mb-2 font-semibold">Thông tin hành khách</h3>
    <div class="space-y-1 text-sm">
      <div><b>Họ và tên:</b> {{ customerInfo?.name || "--" }}</div>
      <div><b>SĐT:</b> {{ customerInfo?.phone || "--" }}</div>
      <div><b>Email:</b> {{ customerInfo?.email || "--" }}</div>
      <div><b>Ghi chú:</b> {{ customerInfo?.note || "--" }}</div>
    </div>
  </div>
</template>
