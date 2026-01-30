<script setup lang="ts">
import { computed } from "vue";
import { formatTime } from "~/utils/helpers/data.helper";
import type { Seat } from "~/validations/admin/seat.validation";
import type { Trip } from "~/validations/admin/trip.validation";

const props = defineProps<{
  customerForm: {
    name: string;
    phone: string;
    email: string;
    note: string;
  };
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

const pickupTripStop = computed(() =>
  props.trip?.tripStops.find(
    (ts) => ts._id === props.pickupDropOff.pickupTripStopId,
  ),
);
const pickupTime = computed(() =>
  formatTime(pickupTripStop.value?.departureTime),
);

const dropoffTripStop = computed(() =>
  props.trip?.tripStops.find(
    (ts) => ts._id === props.pickupDropOff.dropoffTripStopId,
  ),
);

const dropoffTime = computed(() =>
  formatTime(dropoffTripStop.value?.arrivalTime),
);
</script>

<template>
  <div class="rounded-xl border bg-white p-4 text-sm">
    <h3 class="mb-3 font-semibold">Thông tin khách hàng</h3>

    <div class="space-y-2">
      <div class="flex justify-between">
        <span>Họ tên</span>
        <span class="font-medium">{{ customerForm.name || "--" }}</span>
      </div>

      <div class="flex justify-between">
        <span>Số điện thoại</span>
        <span class="font-medium">{{ customerForm.phone || "--" }}</span>
      </div>

      <div class="flex justify-between">
        <span>Email</span>
        <span class="font-medium">{{ customerForm.email || "--" }}</span>
      </div>

      <div class="flex justify-between">
        <span>Ghi chú</span>
        <span class="text-right font-medium">
          {{ customerForm.note || "--" }}
        </span>
      </div>
    </div>
  </div>

  <!-- ===== Điểm đón / trả ===== -->
  <div class="mt-4 rounded-xl border bg-white p-4 text-sm">
    <h3 class="mb-3 font-semibold">Thông tin đón trả</h3>

    <div class="space-y-3">
      <!-- Điểm đón -->
      <div class="grid grid-cols-[90px_1fr] gap-2">
        <span class="text-gray-600">Điểm đón</span>
        <span class="break-words font-medium">
          {{ pickupTime }} - {{ pickupTripStop?.stopId.name || "--" }}
        </span>
      </div>

      <!-- Điểm trả -->
      <div class="grid grid-cols-[90px_1fr] gap-2">
        <span class="text-gray-600">Điểm trả</span>
        <span class="break-words font-medium">
          {{ dropoffTime }} - {{ dropoffTripStop?.stopId.name || "--" }}
        </span>
      </div>
    </div>
  </div>
</template>
