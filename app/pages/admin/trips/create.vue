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

definePageMeta({ layout: "admin", middleware: "auth" });

const router = useRouter();
const store = useTripStore();
const routeStore = useRouteStore();
const vehicleStore = useVehicleStore();

/* ================= FORM ================= */
const form = reactive<CreateTrip>({
  companyId: "",
  routeId: "",
  vehicleId: "",
  driverPhone: "",
  departureTime: Date.now(),
  arrivalTime: Date.now(),
  status: TripStatus.CREATED,
});

const statusList = computed(() => Object.values(TripStatus));
const errors = ref<Record<string, string>>({});

/* ================= FETCH ================= */
onMounted(async () => {
  await routeStore.fetchAll({
    _populate: "companyId,startStopId,endStopId",
  });
});

/* ================= UTILS ================= */
const calcArriveTime = () => {
  const route = routeStore.list.find((r) => r._id === form.routeId);
  if (!route?.durationHour) return;

  form.arrivalTime = form.departureTime + route.durationHour * 60 * 60 * 1000;
};

/* ================= PREVIEW ================= */
const arrivalPreview = computed(() => {
  if (!form.routeId) return null;

  const route = routeStore.list.find((r) => r._id === form.routeId);
  if (!route?.durationHour) return null;

  return new Date(form.arrivalTime).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
});

/* ================= WATCHERS ================= */
watch(
  () => form.routeId,
  async (routeId) => {
    form.vehicleId = "";
    if (!routeId) return;

    const route = routeStore.list.find((r) => r._id === routeId);
    if (!route?.companyId) return;

    form.companyId = route.companyId._id;

    calcArriveTime();
    await vehicleStore.fetchAll({ companyId: route.companyId._id });
  },
);

watch(
  () => form.departureTime,
  () => {
    calcArriveTime();
  },
);

/* ================= DATETIME INPUT ================= */
const departureTimeInput = computed({
  get: () => new Date(form.departureTime).toISOString().slice(0, 16),
  set: (val: string) => {
    form.departureTime = new Date(val).getTime();
  },
});

/* ================= VALIDATE ================= */
const validateForm = () => {
  try {
    CreateTripSchema.extend({
      driverPhone: CreateTripSchema.shape.companyId
        .refine(() => true)
        .transform(() => form.driverPhone),
    }).parse(form);

    if (!form.driverPhone) {
      errors.value = { driverPhone: "Số điện thoại tài xế là bắt buộc" };
      return false;
    }

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

/* ================= SUBMIT ================= */
const submit = async () => {
  if (!validateForm()) return;

  const route = routeStore.list.find((r) => r._id === form.routeId);

  const res = await store.create({
    ...form,
    departureProvinceIds: route?.startStopId?.provinceId
      ? [route.startStopId.provinceId.toString()]
      : [],
    arrivalProvinceIds: route?.endStopId?.provinceId
      ? [route.endStopId.provinceId.toString()]
      : [],
  });

  if (res) router.push("/admin/trips");
};
</script>

<template>
  <div class="max-w-xl space-y-6">
    <h1 class="text-2xl font-semibold">Tạo chuyến</h1>

    <div class="space-y-4">
      <!-- ROUTE -->
      <div>
        <label class="flex items-center gap-2">
          <span>Tuyến đường</span>

          <span
            v-if="arrivalPreview"
            class="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700"
          >
            Dự kiến tới: {{ arrivalPreview }}
          </span>

          <span
            v-else
            class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
          >
            Chưa xác định giờ tới
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
          <option v-for="v in vehicleStore.list" :key="v._id" :value="v._id">
            {{ v.plateNumber }}
          </option>
        </select>
        <p class="error">{{ errors.vehicleId }}</p>
      </div>

      <!-- DRIVER PHONE -->
      <div>
        <label>Số điện thoại tài xế <span class="text-red-500">*</span></label>
        <input
          v-model="form.driverPhone"
          type="tel"
          placeholder="VD: 0901234567"
          class="input"
        />
        <p class="error">{{ errors.driverPhone }}</p>
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
        <label>Thời gian tới (auto)</label>
        <input
          :value="new Date(form.arrivalTime).toLocaleString('vi-VN')"
          class="input bg-gray-100"
          disabled
        />
      </div>

      <!-- STATUS -->
      <div>
        <label>Trạng thái</label>
        <select v-model="form.status" class="input">
          <option v-for="s in statusList" :key="s" :value="s">
            {{ TripStatusText[s] }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex gap-3">
      <button class="btn-primary" @click="submit">Tạo</button>
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
