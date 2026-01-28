<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { TripStop } from "~/validations/admin/trip_stop.validation";

const props = defineProps<{
  tripStops: TripStop[];
}>();

const emit = defineEmits<{
  (
    e: "change",
    payload: {
      pickupTripStopId: string;
      dropoffTripStopId: string;
      pickupType: "station" | "transfer";
      dropoffType: "station" | "transfer";
    },
  ): void;
}>();

/* ========================
   STATE
======================== */
const pickupType = ref<"station" | "transfer">("station");
const dropoffType = ref<"station" | "transfer">("station");

const pickupTripStopId = ref<string>("");
const dropoffTripStopId = ref<string>("");

/* ========================
   OPTIONS
======================== */
const startLocations = computed(() =>
  props.tripStops.filter((ts) => ts.departureTime),
);

const endLocations = computed(() =>
  props.tripStops.filter((ts) => ts.arrivalTime),
);

/* ========================
   EMIT DATA
======================== */
watch(
  [pickupTripStopId, dropoffTripStopId, pickupType, dropoffType],
  () => {
    emit("change", {
      pickupTripStopId: pickupTripStopId.value,
      dropoffTripStopId: dropoffTripStopId.value,
      pickupType: pickupType.value,
      dropoffType: dropoffType.value,
    });
  },
  { immediate: true },
);
</script>

<template>
  <div class="rounded-xl border bg-white p-5 pt-6">
    <div class="mb-4 flex items-center gap-2">
      <h3 class="font-semibold">Thông tin đón trả</h3>
      <span class="text-green-500">ⓘ</span>
    </div>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <!-- ================= ĐIỂM ĐÓN ================= -->
      <div>
        <h4 class="mb-2 font-medium">ĐIỂM ĐÓN</h4>

        <div class="mb-3 flex gap-4 text-sm">
          <label class="flex items-center gap-1">
            <input
              v-model="pickupType"
              type="radio"
              value="station"
              class="accent-green-500"
            />
            Bến xe/VP
          </label>

          <label class="hidden items-center gap-1 text-gray-400">
            <input type="radio" disabled />
            Trung chuyển
          </label>
        </div>

        <PickupLocationSelect
          v-model="pickupTripStopId"
          :options="startLocations"
          placeholder="Chọn điểm đón"
        />
      </div>

      <!-- ================= ĐIỂM TRẢ ================= -->
      <div>
        <h4 class="mb-2 font-medium">ĐIỂM TRẢ</h4>

        <div class="mb-3 flex gap-4 text-sm">
          <label class="flex items-center gap-1">
            <input
              v-model="dropoffType"
              type="radio"
              value="station"
              class="accent-green-500"
            />
            Bến xe/VP
          </label>

          <label class="hidden items-center gap-1 text-gray-400">
            <input type="radio" disabled />
            Trung chuyển
          </label>
        </div>

        <PickupLocationSelect
          v-model="dropoffTripStopId"
          :options="endLocations"
          placeholder="Chọn điểm trả"
        />
      </div>
    </div>
  </div>
</template>
