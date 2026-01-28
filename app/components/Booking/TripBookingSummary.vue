<script setup lang="ts">
import { formatMoney } from "~/utils/helpers/data.helper";
import type { Seat } from "~/validations/admin/seat.validation";
import type { Trip } from "~/validations/admin/trip.validation";

const prop = defineProps<{
  trip?: Trip | null;
  seats: Seat[];
  pickupDropOff: {
    pickupTripStopId: string;
    dropoffTripStopId: string;
    pickupType: "station" | "transfer";
    dropoffType: "station" | "transfer";
  };
  totalPrice: number;
}>();

// const pickupTripStop = computed(() =>
//   prop.trip?.tripStops.find(
//     (ts) => ts._id === prop.pickupDropOff.pickupTripStopId,
//   ),
// );
// const departureTime = computed(() =>
//   formatDateTime(
//     pickupTripStop.value?.departureTime || prop.trip?.departureTime,
//   ),
// );
</script>

<template>
  <div class="rounded-xl border bg-white p-4 text-sm">
    <h3 class="mb-3 font-semibold">Thông tin lượt đi</h3>

    <div class="space-y-2">
      <div class="flex justify-between">
        <span>Tuyến xe</span>
        <span class="font-medium"
          >{{ prop.trip?.routeId?.startStopId?.name }} -
          {{ prop.trip?.routeId?.endStopId?.name }}</span
        >
      </div>
      <!-- <div class="flex justify-between">
        <span>Thời gian xuất bến</span>
        <span class="font-medium">{{ departureTime }}</span>
      </div> -->
      <div class="flex justify-between">
        <span>Số ghế</span>
        <span
          >{{ seats.map((s) => s.name).join(", ") }}
          <span class="font-medium text-green-600">
            ({{ seats.length }} ghế)</span
          ></span
        >
      </div>
      <div class="flex justify-between">
        <span>Tổng tiền lượt đi</span>
        <span class="font-semibold text-green-600">{{
          formatMoney(totalPrice)
        }}</span>
      </div>
    </div>
  </div>
</template>
