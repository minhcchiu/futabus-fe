<script setup lang="ts">
import { formatDateTime } from "~/utils/helpers/data.helper";
import type { Booking } from "~/validations/admin/booking.validation";

defineProps<{
  booked: Booking;
}>();
</script>

<template>
  <div class="rounded-xl bg-white p-4 shadow">
    <h3 class="mb-2 font-semibold">Thông tin lượt đi</h3>
    <div class="space-y-1 text-sm">
      <div>
        <b>Tuyến:</b> {{ booked?.tripId?.routeId?.startStopId?.name }} -
        {{ booked?.tripId?.routeId?.endStopId?.name }}
      </div>
      <div>
        <b>Xuất bến:</b>
        {{ formatDateTime(booked?.departureTime || Date.now()) }}
      </div>
      <div>
        <b>Số ghế:</b>
        {{ booked?.seatIds?.map((seat) => seat.name).join(", ") }}
      </div>
      <div class="text-red-500">
        <b>Lên xe trước:</b>
        {{
          formatDateTime((booked?.departureTime || Date.now()) - 30 * 60 * 1000)
        }}
      </div>
    </div>
  </div>
</template>
