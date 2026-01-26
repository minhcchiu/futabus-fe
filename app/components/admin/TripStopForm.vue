<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ZodError } from "zod";
import { useTripStopStore } from "~/stores/trip_stop.store";
import {
  CreateTripStopSchema,
  type CreateTripStop,
} from "~/validations/admin/trip_stop.validation";

const props = defineProps<{
  tripId: string;
  model?: any; // nếu edit
}>();

const emit = defineEmits(["success", "cancel"]);

const tripStopStore = useTripStopStore();
const routeStore = useRouteStore();

const errors = ref<Record<string, string>>({});

/* =========================
  FORM STATE
========================= */
const form = reactive<CreateTripStop>({
  tripId: props.tripId,
  routeId: "",
  arrivalTime: Date.now(),
  departureTime: Date.now(),
});

/* =========================
  INIT DATA
========================= */
onMounted(async () => {
  await routeStore.fetchAll({
    _sort: "name",
    _populate: "startStopId,endStopId",
  });

  if (props.model) {
    form.routeId = props.model.routeId?._id || "";
    form.arrivalTime = props.model.arrivalTime || null;
    form.departureTime = props.model.departureTime || null;
  }
});

/* =========================
  DATETIME COMPUTED
========================= */
const arrivalInput = computed({
  get: () =>
    form.arrivalTime
      ? new Date(form.arrivalTime).toISOString().slice(0, 16)
      : "",
  set: (val: string) => {
    form.arrivalTime = val ? new Date(val).getTime() : Date.now();
  },
});

const departureInput = computed({
  get: () =>
    form.departureTime
      ? new Date(form.departureTime).toISOString().slice(0, 16)
      : "",
  set: (val: string) => {
    form.departureTime = val ? new Date(val).getTime() : Date.now();
  },
});

/* =========================
  VALIDATE
========================= */
const validateForm = () => {
  try {
    CreateTripStopSchema.parse(form);
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

  let res;
  if (props.model?._id) {
    res = await tripStopStore.updateById(props.model._id, form);
  } else {
    res = await tripStopStore.create(form);
  }

  if (res) emit("success");
};
</script>

<template>
  <div class="space-y-5">
    <h3 class="text-lg font-semibold">
      {{ props.model ? "Edit Route" : "Add Route" }}
    </h3>

    <!-- ROUTE -->
    <div>
      <label class="mb-1 block text-sm font-medium">Route</label>
      <select v-model="form.routeId" class="input">
        <option value="">Select stop</option>
        <option v-for="s in routeStore.list" :key="s._id" :value="s._id">
          {{ s.startStopId?.name }} → {{ s.endStopId?.name }}
        </option>
      </select>
      <p class="error">{{ errors.routeId }}</p>
    </div>

    <!-- ARRIVAL -->
    <div>
      <label class="mb-1 block text-sm font-medium">Arrival Time</label>
      <input type="datetime-local" v-model="arrivalInput" class="input" />
      <p class="error">{{ errors.arrivalTime }}</p>
    </div>

    <!-- DEPARTURE -->
    <div>
      <label class="mb-1 block text-sm font-medium">Departure Time</label>
      <input type="datetime-local" v-model="departureInput" class="input" />
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
.btn-secondary {
  @apply rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-50;
}
</style>
