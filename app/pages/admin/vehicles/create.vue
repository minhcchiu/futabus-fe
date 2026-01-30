<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ZodError } from "zod";
import { useBusCompanyStore } from "~/stores/bus_company.store";
import { useVehicleStore } from "~/stores/vehicle.store";
import {
  CreateVehicleSchema,
  VehicleLevelEnum,
  VehicleStatusEnum,
  type CreateVehicle,
} from "~/validations/admin/vehicle.validation";

definePageMeta({ layout: "admin" });

const router = useRouter();
const vehicleStore = useVehicleStore();
const companyStore = useBusCompanyStore();

/* FORM STATE */
const form = reactive<CreateVehicle>({
  companyId: "",
  plateNumber: "",
  level: VehicleLevelEnum.SLEEPER,
  status: VehicleStatusEnum.ACTIVE,
  amenities: [],
});

const errors = ref<Record<string, string>>({});
const submitting = ref(false);

/* FETCH BUS COMPANIES */
onMounted(async () => {
  await companyStore.fetchAll();
});

/* VALIDATE */
const validateForm = (): boolean => {
  try {
    CreateVehicleSchema.parse({
      ...form,
    });
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
  if (submitting.value) return;

  submitting.value = true;
  const res = await vehicleStore.create(form);
  submitting.value = false;

  if (res) {
    router.push("/admin/vehicles");
  }
};

/* AMENITIES */
const addAmenity = () => form.amenities?.push("");
const removeAmenity = (i: number) => form.amenities?.splice(i, 1);
</script>

<template>
  <div class="max-w-xl space-y-6">
    <!-- HEADER -->
    <div>
      <h1 class="text-2xl font-semibold">Tạo Xe</h1>
      <p class="text-sm text-gray-500">Thêm xe mới vào hệ thống</p>
    </div>

    <!-- FORM -->
    <div class="space-y-4">
      <!-- COMPANY -->
      <div>
        <label class="mb-1 block text-sm font-medium">Nhà Xe</label>
        <select v-model="form.companyId" class="input">
          <option value="">Chọn nhà xe</option>
          <option v-for="c in companyStore.list" :key="c._id" :value="c._id">
            {{ c.name }}
          </option>
        </select>
        <p v-if="errors.companyId" class="error">{{ errors.companyId }}</p>
      </div>

      <!-- PLATE -->
      <div>
        <label class="mb-1 block text-sm font-medium">Biển số</label>
        <input v-model="form.plateNumber" class="input" />
        <p v-if="errors.plateNumber" class="error">{{ errors.plateNumber }}</p>
      </div>

      <!-- LEVEL -->
      <div>
        <label class="mb-1 block text-sm font-medium">Loại xe</label>
        <select v-model="form.level" class="input">
          <option value="SLEEPER">Sleeper</option>
          <option value="SEAT">Seat</option>
          <option value="LIMOUSINE">Limousine</option>
        </select>
      </div>

      <!-- AMENITIES -->
      <div>
        <label class="mb-1 block text-sm font-medium">Amenities</label>

        <div v-for="(a, i) in form.amenities" :key="i" class="mb-2 flex gap-2">
          <input
            v-model="form.amenities[i]"
            placeholder="wifi, tv..."
            class="input flex-1"
          />
          <button
            type="button"
            class="text-sm text-red-500"
            @click="removeAmenity(i)"
          >
            Remove
          </button>
        </div>

        <button type="button" class="text-sm text-primary" @click="addAmenity">
          + Add amenity
        </button>
      </div>

      <!-- STATUS -->
      <div>
        <label class="mb-1 block text-sm font-medium">Status</label>
        <select v-model="form.status" class="input">
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
      </div>
    </div>

    <!-- ACTION -->
    <div class="flex gap-3">
      <button
        :disabled="submitting || vehicleStore.loading"
        class="btn-primary flex items-center justify-center gap-2"
        @click="submit"
      >
        <span
          v-if="submitting || vehicleStore.loading"
          class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
        />
        <span>{{
          submitting || vehicleStore.loading ? "Saving..." : "Create"
        }}</span>
      </button>

      <NuxtLink to="/admin/vehicles" class="btn-secondary"> Cancel </NuxtLink>
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
  @apply rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60;
}
</style>
