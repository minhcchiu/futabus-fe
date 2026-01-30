<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { ZodError } from "zod";
import { useStopLocationStore } from "~/stores/stop_location.store";
import { useTripStopStore } from "~/stores/trip_stop.store";
import {
  CreateTripStopSchema,
  type CreateTripStop,
} from "~/validations/admin/trip_stop.validation";

const props = defineProps<{
  tripId: string;
  model?: any;
}>();

const emit = defineEmits(["success", "cancel"]);

const tripStopStore = useTripStopStore();
const stopLocationStore = useStopLocationStore();
const errors = ref<Record<string, string>>({});

/* =========================
  FORM STATE
========================= */
const form = reactive<CreateTripStop>({
  tripId: props.tripId,
  stopId: "",
  arrivalTime: null,
  departureTime: null,
});

const stopType = ref<"PICK_UP" | "DROP_OFF">("PICK_UP");

/* =========================
  BASE DATE (NGÀY HIỆN TẠI)
========================= */
const baseDate = ref(new Date()); // bạn có thể đổi thành trip.date sau

const buildTimestampFromTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  const d = new Date(baseDate.value);
  d.setHours(hour!, minute, 0, 0);
  return d.getTime();
};

/* =========================
  INIT DATA
========================= */
onMounted(async () => {
  await stopLocationStore.fetchAll({ _sort: "name" });

  if (props.model) {
    form.stopId = props.model.stopId?._id || "";

    if (props.model.departureTime) {
      stopType.value = "PICK_UP";
      form.departureTime = props.model.departureTime;
    }

    if (props.model.arrivalTime) {
      stopType.value = "DROP_OFF";
      form.arrivalTime = props.model.arrivalTime;
    }
  }
});

/* =========================
  WATCH STOP TYPE
========================= */
watch(stopType, (type) => {
  if (type === "PICK_UP") {
    form.arrivalTime = null;
  } else {
    form.departureTime = null;
  }
});

/* =========================
  TIME COMPUTED (HH:mm)
========================= */
const arrivalInput = computed({
  get: () => {
    if (!form.arrivalTime) return "";
    const d = new Date(form.arrivalTime);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes(),
    ).padStart(2, "0")}`;
  },
  set: (val: string) => {
    form.arrivalTime = val ? buildTimestampFromTime(val) : null;
  },
});

const departureInput = computed({
  get: () => {
    if (!form.departureTime) return "";
    const d = new Date(form.departureTime);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes(),
    ).padStart(2, "0")}`;
  },
  set: (val: string) => {
    form.departureTime = val ? buildTimestampFromTime(val) : null;
  },
});

/* =========================
  VALIDATE
========================= */
const validateForm = () => {
  try {
    CreateTripStopSchema.parse(form);

    if (stopType.value === "PICK_UP" && !form.departureTime) {
      errors.value.departureTime = "Departure time is required";
      return false;
    }

    if (stopType.value === "DROP_OFF" && !form.arrivalTime) {
      errors.value.arrivalTime = "Arrival time is required";
      return false;
    }

    errors.value = {};
    return true;
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      err.errors.forEach((e) => {
        const field = e.path[0] as string;
        fieldErrors[field] = e.message;
      });
      errors.value = fieldErrors;
    }
    return false;
  }
};

/* =========================
  SUBMIT
========================= */
const submit = async () => {
  if (!validateForm()) return;

  const payload: CreateTripStop = {
    tripId: form.tripId,
    stopId: form.stopId,
    arrivalTime: stopType.value === "DROP_OFF" ? form.arrivalTime : null,
    departureTime: stopType.value === "PICK_UP" ? form.departureTime : null,
  };

  let res;
  if (props.model?._id) {
    res = await tripStopStore.updateById(props.model._id, payload);
  } else {
    res = await tripStopStore.create(payload);
  }

  if (res) emit("success");
};
</script>

<template>
  <div class="space-y-5">
    <h3 class="text-lg font-semibold">
      {{ props.model ? "Edit Trip Stop" : "Add Trip Stop" }}
    </h3>

    <!-- STOP -->
    <div>
      <label class="mb-1 block text-sm font-medium">Stop</label>
      <select v-model="form.stopId" class="input">
        <option value="">Select stop</option>
        <option v-for="s in stopLocationStore.list" :key="s._id" :value="s._id">
          {{ s.name }}
        </option>
      </select>
      <p class="error">{{ errors.stopId }}</p>
    </div>

    <!-- STOP TYPE -->
    <div>
      <label class="mb-1 block text-sm font-medium">Stop Type</label>
      <div class="flex gap-6">
        <label class="flex cursor-pointer items-center gap-2">
          <input
            v-model="stopType"
            type="radio"
            value="PICK_UP"
            class="accent-primary"
          />
          🚏 Điểm đón
        </label>
        <label class="flex cursor-pointer items-center gap-2">
          <input
            v-model="stopType"
            type="radio"
            value="DROP_OFF"
            class="accent-primary"
          />
          🏁 Điểm trả
        </label>
      </div>
    </div>

    <!-- ARRIVAL -->
    <div v-if="stopType === 'DROP_OFF'">
      <label class="mb-1 block text-sm font-medium">Arrival Time</label>
      <input v-model="arrivalInput" type="time" class="input" />
      <p class="error">{{ errors.arrivalTime }}</p>
    </div>

    <!-- DEPARTURE -->
    <div v-if="stopType === 'PICK_UP'">
      <label class="mb-1 block text-sm font-medium">Departure Time</label>
      <input v-model="departureInput" type="time" class="input" />
      <p class="error">{{ errors.departureTime }}</p>
    </div>

    <!-- ACTION -->
    <div class="flex gap-3 pt-2">
      <button
        class="btn-primary"
        :disabled="tripStopStore.loading"
        @click="submit"
      >
        {{ tripStopStore.loading ? "Saving..." : "Save" }}
      </button>
      <button class="btn-secondary" @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary;
}
.error {
  @apply mt-1 text-xs text-red-500;
}
.btn-primary {
  @apply rounded-lg bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60;
}
</style>
