<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ZodError } from "zod";
import { useBusCompanyStore } from "~/stores/bus_company.store";
import { useVehicleStore } from "~/stores/vehicle.store";
import {
  CreateVehicleSchema,
  type CreateVehicle,
} from "~/validations/admin/vehicle.validation";

definePageMeta({ layout: "admin" });

const route = useRoute();
const router = useRouter();
const vehicleStore = useVehicleStore();
const companyStore = useBusCompanyStore();

const id = route.params.id as string;

/* FORM STATE */
const form = reactive<CreateVehicle>({
  companyId: "",
  plateNumber: "",
  level: "SLEEPER",
  totalSeat: 0,
  hasUpperDeck: false,
  status: "ACTIVE",
  amenities: [],
});

const errors = ref<Record<string, string>>({});
const submitting = ref(false);
const loading = ref(true);

/* FETCH DATA */
onMounted(async () => {
  await companyStore.fetchAll();

  const vehicle = await vehicleStore.fetchById(id);
  if (!vehicle) {
    router.push("/admin/vehicles");
    return;
  }

  Object.assign(form, {
    companyId: vehicle.companyId,
    plateNumber: vehicle.plateNumber,
    level: vehicle.level,
    totalSeat: vehicle.totalSeat,
    hasUpperDeck: vehicle.hasUpperDeck,
    status: vehicle.status,
    amenities: vehicle.amenities || [],
  });

  loading.value = false;
});

/* VALIDATE */
const validateForm = (): boolean => {
  try {
    CreateVehicleSchema.parse({
      ...form,
      totalSeat: Number(form.totalSeat),
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
  const res = await vehicleStore.updateById(id, form);
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
    <!-- LOADING -->
    <div v-if="loading" class="py-10 text-center text-sm text-gray-500">
      Loading vehicle...
    </div>

    <template v-else>
      <!-- HEADER -->
      <div>
        <h1 class="text-2xl font-semibold">Update Vehicle</h1>
        <p class="text-sm text-gray-500">Edit vehicle information</p>
      </div>

      <!-- FORM -->
      <div class="space-y-4">
        <!-- COMPANY -->
        <div>
          <label class="mb-1 block text-sm font-medium">Bus Company</label>
          <select v-model="form.companyId" class="input">
            <option value="">Select company</option>
            <option v-for="c in companyStore.list" :key="c._id" :value="c._id">
              {{ c.name }}
            </option>
          </select>
          <p v-if="errors.companyId" class="error">{{ errors.companyId }}</p>
        </div>

        <!-- PLATE -->
        <div>
          <label class="mb-1 block text-sm font-medium">Plate Number</label>
          <input v-model="form.plateNumber" class="input" />
          <p v-if="errors.plateNumber" class="error">
            {{ errors.plateNumber }}
          </p>
        </div>

        <!-- LEVEL -->
        <div>
          <label class="mb-1 block text-sm font-medium">Vehicle Level</label>
          <select v-model="form.level" class="input">
            <option value="SLEEPER">Sleeper</option>
            <option value="SEAT">Seat</option>
            <option value="LIMOUSINE">Limousine</option>
          </select>
        </div>

        <!-- TOTAL SEAT -->
        <div>
          <label class="mb-1 block text-sm font-medium">Total Seats</label>
          <input
            v-model.number="form.totalSeat"
            type="number"
            min="1"
            class="input"
          />
          <p v-if="errors.totalSeat" class="error">{{ errors.totalSeat }}</p>
        </div>

        <!-- UPPER DECK -->
        <div class="flex items-center gap-2">
          <input
            id="upperDeck"
            v-model="form.hasUpperDeck"
            type="checkbox"
            class="rounded border"
          />
          <label for="upperDeck" class="text-sm"> Has Upper Deck </label>
        </div>

        <!-- AMENITIES -->
        <div>
          <label class="mb-1 block text-sm font-medium">Amenities</label>

          <div
            v-for="(a, i) in form.amenities"
            :key="i"
            class="mb-2 flex gap-2"
          >
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

          <button
            type="button"
            class="text-sm text-primary"
            @click="addAmenity"
          >
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
            submitting || vehicleStore.loading ? "Saving..." : "Update"
          }}</span>
        </button>

        <NuxtLink to="/admin/vehicles" class="btn-secondary"> Cancel </NuxtLink>
      </div>
    </template>
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
.btn-secondary {
  @apply rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50;
}
</style>
