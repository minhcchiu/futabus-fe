<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ZodError } from "zod";
import { useBusCompanyStore } from "~/stores/bus_company.store";
import { useRouteStore } from "~/stores/route.store";
import { useStopLocationStore } from "~/stores/stop_location.store";
import {
  CreateRouteSchema,
  type CreateRoute,
} from "~/validations/admin/route.validation";

definePageMeta({ layout: "admin" });

const router = useRouter();
const route = useRoute();

const store = useRouteStore();
const companyStore = useBusCompanyStore();
const stopStore = useStopLocationStore();

/* FORM */
const form = reactive<CreateRoute>({
  companyId: "",
  startStopId: "",
  endStopId: "",
  durationMinutes: 10 * 60, // 👈 thêm duration
});

const errors = ref<Record<string, string>>({});

/* FETCH DETAIL */
const fetchDetail = async () => {
  const res: any = await store.fetchById(route.params.id as string);
  if (!res) return;

  Object.assign(form, {
    companyId: res.companyId?._id || res.companyId,
    startStopId: res.startStopId?._id || res.startStopId,
    endStopId: res.endStopId?._id || res.endStopId,
    durationMinutes: res.durationMinutes,
  });
};

/* INIT */
onMounted(async () => {
  await companyStore.fetchAll();
  await stopStore.fetchAll();
  await fetchDetail();
});

/* VALIDATE */
const validateForm = () => {
  try {
    CreateRouteSchema.parse(form);
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

/* SUBMIT */
const submit = async () => {
  if (!validateForm()) return;

  const res = await store.updateById(route.params.id as string, form);
  if (res) router.push("/admin/routes");
};
</script>

<template>
  <div class="max-w-xl space-y-6">
    <h1 class="text-2xl font-semibold">Edit Route</h1>

    <div class="space-y-4">
      <!-- COMPANY -->
      <div>
        <label class="block text-sm font-medium">Company</label>
        <select v-model="form.companyId" class="input">
          <option value="">Select company</option>
          <option v-for="c in companyStore.list" :key="c._id" :value="c._id">
            {{ c.name }}
          </option>
        </select>
        <p class="error">{{ errors.companyId }}</p>
      </div>

      <!-- START -->
      <div>
        <label class="block text-sm font-medium">Start Stop</label>
        <select v-model="form.startStopId" class="input">
          <option value="">Select start stop</option>
          <option v-for="s in stopStore.list" :key="s._id" :value="s._id">
            {{ s.name }}
          </option>
        </select>
        <p class="error">{{ errors.startStopId }}</p>
      </div>

      <!-- END -->
      <div>
        <label class="block text-sm font-medium">End Stop</label>
        <select v-model="form.endStopId" class="input">
          <option value="">Select end stop</option>
          <option v-for="s in stopStore.list" :key="s._id" :value="s._id">
            {{ s.name }}
          </option>
        </select>
        <p class="error">{{ errors.endStopId }}</p>
      </div>

      <!-- DURATION -->
      <div>
        <label class="block text-sm font-medium">
          Thời gian hành trình (phút)
        </label>
        <input
          v-model.number="form.durationMinutes"
          type="number"
          min="1"
          placeholder="Ví dụ: 300"
          class="input"
        >
        <p class="error">{{ errors.durationMinutes }}</p>
      </div>
    </div>

    <div class="flex gap-3">
      <button class="btn-primary" @click="submit">Update</button>
      <NuxtLink to="/admin/routes" class="btn-secondary">Cancel</NuxtLink>
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
</style>
