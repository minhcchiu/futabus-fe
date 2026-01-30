<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ZodError } from "zod";
import { useRouteStore } from "~/stores/route.store";
import { useTripStore } from "~/stores/trip.store";
import { useVehicleStore } from "~/stores/vehicle.store";
import {
  CreateTripSchema,
  TripStatus,
  type CreateTrip,
} from "~/validations/admin/trip.validation";

definePageMeta({ layout: "admin" });

const router = useRouter();
const store = useTripStore();
const routeStore = useRouteStore();
const vehicleStore = useVehicleStore();

const form = reactive<CreateTrip>({
  companyId: "",
  routeId: "",
  vehicleId: "",
  departureTime: Date.now(),
  status: TripStatus.OPEN,
});
const statusList = computed(() => Object.values(TripStatus));

const errors = ref<Record<string, string>>({});

/* FETCH */
onMounted(async () => {
  await routeStore.fetchAll({
    _populate: "companyId,startStopId,endStopId",
  });
});

/* AUTO FILTER VEHICLE BY ROUTE */
watch(
  () => form.routeId,
  async (routeId) => {
    form.vehicleId = "";
    if (!routeId) return;

    const route = routeStore.list.find((r) => r._id === routeId);
    if (!route?.companyId) return;
    form.companyId = route.companyId._id;

    await vehicleStore.fetchAll({ companyId: route.companyId._id });
  },
);

/* DATETIME HANDLER */
const departureTimeInput = computed({
  get: () => new Date(form.departureTime).toISOString().slice(0, 16),
  set: (val: string) => {
    form.departureTime = new Date(val).getTime();
  },
});

/* VALIDATE */
const validateForm = () => {
  try {
    CreateTripSchema.parse(form);
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

/* SUBMIT */
const submit = async () => {
  if (!validateForm()) return;

  const res = await store.create(form);
  if (res) router.push("/admin/trips");
};
</script>

<template>
  <div class="max-w-xl space-y-6">
    <h1 class="text-2xl font-semibold">Tạo Trip</h1>

    <div class="space-y-4">
      <!-- ROUTE -->
      <div>
        <label>Route</label>
        <select v-model="form.routeId" class="input">
          <option value="">Select route</option>
          <option v-for="r in routeStore.list" :key="r._id" :value="r._id">
            {{ r.startStopId?.name }} → {{ r.endStopId?.name }}
          </option>
        </select>
        <p class="error">{{ errors.routeId }}</p>
      </div>

      <!-- VEHICLE -->
      <div>
        <label>Vehicle</label>
        <select
          v-model="form.vehicleId"
          class="input"
          :disabled="!form.routeId"
        >
          <option value="">Select vehicle</option>
          <option v-for="v in vehicleStore.list" :key="v._id" :value="v._id">
            {{ v.plateNumber }}
          </option>
        </select>
        <p class="error">{{ errors.vehicleId }}</p>
      </div>

      <!-- DEPARTURE -->
      <div>
        <label>Departure Time</label>
        <input
          v-model="departureTimeInput"
          type="datetime-local"
          class="input"
        >
        <p class="error">{{ errors.departureTime }}</p>
      </div>

      <!-- STATUS -->
      <div>
        <label>Status</label>
        <select v-model="form.status" class="input">
          <option v-for="s in statusList" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex gap-3">
      <button class="btn-primary" @click="submit">Create</button>
      <NuxtLink to="/admin/trips" class="btn-secondary">Cancel</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full rounded-lg border px-3 py-2 text-sm;
}
.error {
  @apply mt-1 text-xs text-red-500;
}

.btn-secondary {
  @apply rounded-lg border !bg-red-400 px-4 py-2 text-white;
}
</style>
