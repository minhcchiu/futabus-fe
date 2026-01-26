<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
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

const route = useRoute();
const router = useRouter();

const tripStore = useTripStore();
const routeStore = useRouteStore();
const vehicleStore = useVehicleStore();

const vehicleList = computed(() => vehicleStore.list || []);
/* =========================
  FORM STATE
========================= */
const form = reactive<CreateTrip>({
  routeId: "",
  companyId: "",
  vehicleId: "",
  departureTime: Date.now(),
  status: TripStatus.CREATED,
});

const statusList = computed(() => Object.values(TripStatus));
const errors = ref<Record<string, string>>({});

/* =========================
  HELPERS
========================= */
const getCompanyIdFromRoute = (r: any) => {
  if (!r?.companyId) return "";
  return typeof r.companyId === "string" ? r.companyId : r.companyId._id;
};

const getCompanyIdFromTrip = (c: any) => {
  if (!c) return "";
  return typeof c === "string" ? c : c._id;
};

/* =========================
  FETCH DETAIL (EDIT)
========================= */
const fetchDetail = async () => {
  const res: any = await tripStore.fetchById(route.params.id as string);
  if (!res) return;

  form.routeId = res.routeId;
  form.companyId = getCompanyIdFromTrip(res.companyId);
  form.vehicleId = res.vehicleId;
  form.departureTime = res.departureTime;
  form.status = res.status;

  if (form.companyId) {
    await vehicleStore.fetchAll({ companyId: form.companyId });
  }
};

/* =========================
  INIT LOAD
========================= */
onMounted(async () => {
  // Load routes first
  await routeStore.fetchAll({
    _populate: "companyId,startStopId,endStopId",
  });

  // Then load trip detail
  if (route.params.id) {
    await fetchDetail();
  }
});

/* =========================
  WATCH ROUTE CHANGE
========================= */
watch(
  () => form.routeId,
  async (routeId, oldRouteId) => {
    if (!routeId) return;

    const r = routeStore.list.find((i) => i._id === routeId);
    if (!r) return;

    const companyId = getCompanyIdFromRoute(r);
    if (!companyId) return;

    // Nếu user đổi route → reset vehicle
    if (oldRouteId && routeId !== oldRouteId) {
      form.vehicleId = "";
    }

    form.companyId = companyId;
    await vehicleStore.fetchAll({ companyId });
  },
);

/* =========================
  DATETIME BINDING
========================= */
const departureTimeInput = computed({
  get: () => new Date(form.departureTime).toISOString().slice(0, 16),
  set: (val: string) => {
    form.departureTime = new Date(val).getTime();
  },
});

/* =========================
  VALIDATE
========================= */
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

/* =========================
  SUBMIT
========================= */
const submit = async () => {
  if (!validateForm()) return;

  const res = await tripStore.updateById(route.params.id as string, form);
  if (res) router.push("/admin/trips");
};
</script>

<template>
  <div class="max-w-xl space-y-6">
    <h1 class="text-2xl font-semibold">Update Trip</h1>

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
          <option v-for="v in vehicleList" :key="v._id" :value="v._id">
            {{ v.plateNumber }}
          </option>
        </select>
        <p class="error">{{ errors.vehicleId }}</p>
      </div>

      <!-- DEPARTURE -->
      <div>
        <label>Departure Time</label>
        <input
          type="datetime-local"
          v-model="departureTimeInput"
          class="input"
        />
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
      <button class="btn-primary" @click="submit">Update</button>
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
.btn-primary {
  @apply rounded-lg bg-primary px-4 py-2 text-white;
}
.btn-secondary {
  @apply rounded-lg border !bg-red-400 px-4 py-2 text-white;
}
</style>
