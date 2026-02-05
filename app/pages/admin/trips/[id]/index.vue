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

definePageMeta({ layout: "admin", middleware: "auth" });

const route = useRoute();
const router = useRouter();

const tripStore = useTripStore();
const routeStore = useRouteStore();
const vehicleStore = useVehicleStore();

const vehicleList = computed(() => vehicleStore.list || []);

/* =========================
  FORM
========================= */
const form = reactive<CreateTrip>({
  routeId: "",
  companyId: "",
  vehicleId: "",
  departureTime: Date.now(),
  arrivalTime: Date.now(), // auto
  status: TripStatus.CREATED,
});

const statusList = computed(() => Object.values(TripStatus));
const errors = ref<Record<string, string>>({});

/* =========================
  HELPERS
========================= */
const getCompanyIdFromRoute = (r: any) =>
  typeof r?.companyId === "string" ? r.companyId : r?.companyId?._id || "";

const getCompanyIdFromTrip = (c: any) =>
  typeof c === "string" ? c : c?._id || "";

/* =========================
  CALC ARRIVAL TIME
========================= */
const calcArriveTime = () => {
  const r = routeStore.list.find((i) => i._id === form.routeId);
  if (!r?.durationHour) return;

  form.arrivalTime = form.departureTime + r.durationHour * 60 * 60 * 1000;
};

/* =========================
  ROUTE SELECTED
========================= */
const selectedRoute = computed(() =>
  routeStore.list.find((i) => i._id === form.routeId),
);

/* =========================
  ETA PREVIEW (LABEL)
========================= */
const arrivalPreview = computed(() => {
  if (!selectedRoute.value?.durationHour || !form.departureTime) return "";

  const start = new Date(form.departureTime);
  const end = new Date(
    form.departureTime + selectedRoute.value.durationHour * 60 * 60 * 1000,
  );

  const fmt = (d: Date) =>
    d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return `${fmt(start)} → ${fmt(end)}`;
});

/* =========================
  FETCH DETAIL
========================= */
const fetchDetail = async () => {
  const res: any = await tripStore.fetchById(route.params.id as string);
  if (!res) return;

  form.routeId = res.routeId;
  form.companyId = getCompanyIdFromTrip(res.companyId);
  form.vehicleId = res.vehicleId;
  form.departureTime = res.departureTime;
  form.arrivalTime = res.arrivalTime;
  form.status = res.status;

  if (form.companyId) {
    await vehicleStore.fetchAll({ companyId: form.companyId });
  }
};

/* =========================
  INIT
========================= */
onMounted(async () => {
  await routeStore.fetchAll({
    _populate: "companyId,startStopId,endStopId",
  });

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

    if (oldRouteId && routeId !== oldRouteId) {
      form.vehicleId = "";
      calcArriveTime(); // auto recal
    }

    form.companyId = companyId;
    await vehicleStore.fetchAll({ companyId });
  },
);

/* =========================
  WATCH DEPARTURE TIME
========================= */
watch(
  () => form.departureTime,
  () => {
    calcArriveTime();
  },
);

/* =========================
  DATETIME INPUT
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
        fieldErrors[e.path[0] as string] = e.message;
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
    <h1 class="text-2xl font-semibold">Cập nhật chuyến</h1>

    <div class="space-y-4">
      <!-- ROUTE -->
      <div>
        <label class="flex items-center justify-between">
          <span>Tuyến đường</span>
          <span v-if="arrivalPreview" class="text-xs font-normal text-gray-500">
            ⏱ {{ arrivalPreview }}
          </span>
        </label>

        <select v-model="form.routeId" class="input">
          <option value="">Chọn tuyến</option>
          <option v-for="r in routeStore.list" :key="r._id" :value="r._id">
            {{ r.startStopId?.name }} → {{ r.endStopId?.name }}
          </option>
        </select>

        <p class="error">{{ errors.routeId }}</p>
      </div>

      <!-- VEHICLE -->
      <div>
        <label>Xe</label>
        <select
          v-model="form.vehicleId"
          class="input"
          :disabled="!form.routeId"
        >
          <option value="">Chọn xe</option>
          <option v-for="v in vehicleList" :key="v._id" :value="v._id">
            {{ v.plateNumber }}
          </option>
        </select>
        <p class="error">{{ errors.vehicleId }}</p>
      </div>

      <!-- DEPARTURE -->
      <div>
        <label>Khởi hành</label>
        <input
          v-model="departureTimeInput"
          type="datetime-local"
          class="input"
        />
        <p class="error">{{ errors.departureTime }}</p>
      </div>

      <!-- ARRIVAL -->
      <div>
        <label>Đến nơi (auto)</label>
        <input
          :value="new Date(form.arrivalTime).toLocaleString('vi-VN')"
          class="input bg-gray-100"
          disabled
        />
      </div>

      <!-- STATUS -->
      <div>
        <label>Status</label>
        <select v-model="form.status" class="input">
          <option v-for="s in statusList" :key="s" :value="s">
            {{ TripStatusText[s] }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex gap-3">
      <button class="btn-primary" @click="submit">Lưu</button>
      <NuxtLink to="/admin/trips" class="btn-secondary">Hủy</NuxtLink>
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
