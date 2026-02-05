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
      departureTime?: number;

      pickupType: "station" | "custom";
      pickupTripStopId?: string;
      pickupCustomAddress?: string;

      dropoffType: "station" | "custom";
      dropoffTripStopId?: string;
      dropoffCustomAddress?: string;
    },
  ): void;
}>();

/* ========================
   STATE
======================== */
const pickupType = ref<"station" | "custom">("station");
const dropoffType = ref<"station" | "custom">("station");

const pickupTripStopId = ref<string>("");
const dropoffTripStopId = ref<string>("");

const pickupCustomAddress = ref<string>("");
const dropoffCustomAddress = ref<string>("");

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
   RESET KHI ĐỔI TYPE
======================== */
watch(pickupType, (val) => {
  if (val === "custom") {
    pickupTripStopId.value = "";
  } else {
    pickupCustomAddress.value = "";
  }
});

watch(dropoffType, (val) => {
  if (val === "custom") {
    dropoffTripStopId.value = "";
  } else {
    dropoffCustomAddress.value = "";
  }
});

/* ========================
   EMIT DATA
======================== */
watch(
  [
    pickupType,
    dropoffType,
    pickupTripStopId,
    dropoffTripStopId,
    pickupCustomAddress,
    dropoffCustomAddress,
  ],
  () => {
    emit("change", {
      departureTime:
        pickupType.value === "station"
          ? props.tripStops.find((ts) => ts._id === pickupTripStopId.value)
              ?.departureTime
          : undefined,

      pickupType: pickupType.value,
      pickupTripStopId:
        pickupType.value === "station" ? pickupTripStopId.value : undefined,
      pickupCustomAddress:
        pickupType.value === "custom" ? pickupCustomAddress.value : undefined,

      dropoffType: dropoffType.value,
      dropoffTripStopId:
        dropoffType.value === "station" ? dropoffTripStopId.value : undefined,
      dropoffCustomAddress:
        dropoffType.value === "custom" ? dropoffCustomAddress.value : undefined,
    });
  },
  { immediate: true },
);
</script>

<template>
  <div class="rounded-xl border bg-white p-5 pt-6">
    <!-- HEADER -->
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

          <label class="flex items-center gap-1">
            <input
              v-model="pickupType"
              type="radio"
              value="custom"
              class="accent-green-500"
            />
            Tự nhập
          </label>
        </div>

        <!-- Station -->
        <PickupLocationSelect
          v-if="pickupType === 'station'"
          v-model="pickupTripStopId"
          :options="startLocations"
          placeholder="Chọn điểm đón"
        />

        <!-- Custom -->
        <input
          v-else
          v-model="pickupCustomAddress"
          placeholder="Nhập điểm đón (VD: 123 Lê Duẩn, Đà Nẵng)"
          class="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
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

          <label class="flex items-center gap-1">
            <input
              v-model="dropoffType"
              type="radio"
              value="custom"
              class="accent-green-500"
            />
            Tự nhập
          </label>
        </div>

        <!-- Station -->
        <PickupLocationSelect
          v-if="dropoffType === 'station'"
          v-model="dropoffTripStopId"
          :options="endLocations"
          placeholder="Chọn điểm trả"
        />

        <!-- Custom -->
        <input
          v-else
          v-model="dropoffCustomAddress"
          placeholder="Nhập điểm trả (VD: Sân bay Tân Sơn Nhất)"
          class="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
        />
      </div>
    </div>
  </div>
</template>
