<script setup lang="ts">
import { formatDateTime } from "~/utils/helpers/data.helper";
import type { Booking } from "~/validations/admin/booking.validation";

defineProps<{
  booked: Booking;
}>();
</script>

<template>
  <div class="rounded-xl bg-white p-4 shadow">
    <h3 class="mb-3 font-semibold">Thông tin lượt đi</h3>

    <div class="space-y-2 text-sm">
      <!-- Tuyến -->
      <div>
        <b>Tuyến:</b>
        {{ booked?.tripId?.routeId?.startStopId?.name }}
        -
        {{ booked?.tripId?.routeId?.endStopId?.name }}
      </div>

      <!-- Xuất bến -->
      <div>
        <b>Xuất bến:</b>
        {{ formatDateTime(booked?.departureTime || Date.now()) }}
      </div>

      <!-- Ghế -->
      <div>
        <b>Số ghế:</b>
        {{ booked?.seatIds?.map((seat) => seat.name).join(", ") }}
      </div>

      <!-- Điểm đón -->
      <div>
        <b>Điểm đón:</b>
        <span v-if="booked?.fromStopId">
          🚌 {{ booked?.fromStopId?.stopId.name }}
          <span class="text-gray-500">
            ({{ booked?.fromStopId?.stopId.address || "—" }})
          </span>
        </span>

        <span v-else> 📍 {{ booked?.pickupCustomAddress || "--" }} </span>
      </div>

      <!-- Điểm trả -->
      <div>
        <b>Điểm trả:</b>
        <span v-if="booked?.toStopId">
          🚌 {{ booked?.toStopId?.stopId.name }}
          <span class="text-gray-500">
            ({{ booked?.toStopId?.stopId.address || "—" }})
          </span>
        </span>

        <span v-else> 📍 {{ booked?.dropoffCustomAddress || "—" }} </span>
      </div>

      <!-- Lên xe trước -->
      <div class="text-red-500">
        <b>Lên xe trước:</b>
        {{
          formatDateTime((booked?.departureTime || Date.now()) - 30 * 60 * 1000)
        }}
      </div>
    </div>
  </div>
</template>
