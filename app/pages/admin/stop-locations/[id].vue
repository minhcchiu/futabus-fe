<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ZodError } from "zod";
import { useDistrictStore } from "~/stores/pre-built/district.store";
import { useProvinceStore } from "~/stores/pre-built/province.store";
import { useWardStore } from "~/stores/pre-built/ward.store";
import { useStopLocationStore } from "~/stores/stop_location.store";
import {
  CreateStopLocationSchema,
  type CreateStopLocation,
} from "~/validations/admin/stop_location.validation";

definePageMeta({ layout: "admin" });

/* ROUTER */
const route = useRoute();
const router = useRouter();

/* STORES */
const store = useStopLocationStore();
const provinceStore = useProvinceStore();
const districtStore = useDistrictStore();
const wardStore = useWardStore();

/* FORM */
const form = reactive<CreateStopLocation>({
  name: "",
  address: "",
  provinceId: "",
  districtId: "",
  wardId: "",
});

const errors = ref<Record<string, string>>({});
const isHydrating = ref(false);

/* DATA */
const provinces = computed(() => provinceStore.list || []);
const districts = computed(() => districtStore.list || []);
const wards = computed(() => wardStore.list || []);

/* FETCHERS */
const fetchProvinces = async () => {
  await provinceStore.fetchAll({ _sort: "name" });
};

const fetchDistricts = async (provinceId: string) => {
  if (!provinceId) return;
  await districtStore.fetchAll({ provinceId, _sort: "name" });
};

const fetchWards = async (districtId: string) => {
  if (!districtId) return;
  await wardStore.fetchAll({ districtId, _sort: "name" });
};

/* CASCADE */
watch(
  () => form.provinceId,
  async (val, oldVal) => {
    if (isHydrating.value) return;
    if (!val || val === oldVal) return;

    form.districtId = "";
    form.wardId = "";

    await fetchDistricts(val);
  },
);

watch(
  () => form.districtId,
  async (val, oldVal) => {
    if (isHydrating.value) return;
    if (!val || val === oldVal) return;

    form.wardId = "";

    await fetchWards(val);
  },
);

/* FETCH DETAIL */
const fetchDetail = async () => {
  isHydrating.value = true;

  const res: any = await store.fetchById(route.params.id as string);
  if (!res) {
    router.push("/admin/stop-locations");
    return;
  }

  Object.assign(form, {
    name: res.name,
    address: res.address,
    provinceId: res.provinceId,
    districtId: res.districtId,
    wardId: res.wardId,
  });

  await fetchDistricts(res.provinceId);
  await fetchWards(res.districtId);

  isHydrating.value = false;
};

/* VALIDATE */
const validateForm = (): boolean => {
  try {
    CreateStopLocationSchema.parse(form);
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

  Object.keys(form).forEach((key) => {
    // @ts-ignore
    if (!form[key]) delete form[key];
  });
  const res = await store.updateById(route.params.id as string, form);

  if (res) {
    router.push("/admin/stop-locations");
  }
};

/* INIT */
onMounted(async () => {
  await fetchProvinces();
  await fetchDetail();
});
</script>

<template>
  <div class="max-w-xl space-y-6">
    <!-- HEADER -->
    <div>
      <h1 class="text-2xl font-semibold">Edit Stop Location</h1>
      <p class="text-sm text-gray-500">Update stop location information</p>
    </div>

    <!-- FORM -->
    <div class="space-y-4">
      <!-- NAME -->
      <div>
        <label class="mb-1 block text-sm font-medium">Location Name</label>
        <input v-model="form.name" class="input" />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <!-- ADDRESS -->
      <div>
        <label class="mb-1 block text-sm font-medium">Address</label>
        <input v-model="form.address" class="input" />
        <p v-if="errors.address" class="error">{{ errors.address }}</p>
      </div>

      <!-- PROVINCE -->
      <div>
        <label class="mb-1 block text-sm font-medium">Province</label>
        <select v-model="form.provinceId" class="input">
          <option value="">Select province</option>
          <option v-for="p in provinces" :key="p._id" :value="p._id">
            {{ p.name }}
          </option>
        </select>
        <p v-if="errors.provinceId" class="error">{{ errors.provinceId }}</p>
      </div>

      <!-- DISTRICT -->
      <div>
        <label class="mb-1 block text-sm font-medium">District</label>
        <select
          v-model="form.districtId"
          class="input"
          :disabled="!form.provinceId"
        >
          <option value="">Select district</option>
          <option v-for="d in districts" :key="d._id" :value="d._id">
            {{ d.name }}
          </option>
        </select>
        <p v-if="errors.districtId" class="error">{{ errors.districtId }}</p>
      </div>

      <!-- WARD -->
      <div>
        <label class="mb-1 block text-sm font-medium">Ward</label>
        <select
          v-model="form.wardId"
          class="input"
          :disabled="!form.districtId"
        >
          <option value="">Select ward</option>
          <option v-for="w in wards" :key="w._id" :value="w._id">
            {{ w.name }}
          </option>
        </select>
        <p v-if="errors.wardId" class="error">{{ errors.wardId }}</p>
      </div>
    </div>

    <!-- ACTION -->
    <div class="flex gap-3">
      <button
        :disabled="store.loading"
        class="btn-primary flex items-center justify-center gap-2"
        @click="submit"
      >
        <span
          v-if="store.loading"
          class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
        />
        <span>
          {{ store.loading ? "Saving..." : "Update" }}
        </span>
      </button>

      <NuxtLink to="/admin/stop-locations" class="btn-secondary">
        Cancel
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100;
}
.error {
  @apply mt-1 text-xs text-red-500;
}
.btn-primary {
  @apply rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60;
}
</style>
