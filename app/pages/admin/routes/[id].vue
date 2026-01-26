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

const form = reactive<CreateRoute>({
  companyId: "",
  startStopId: "",
  endStopId: "",
});

const errors = ref<Record<string, string>>({});

/* FETCH */
const fetchDetail = async () => {
  const res: any = await store.fetchById(route.params.id as string);
  if (!res) return;

  Object.assign(form, {
    companyId: res.companyId,
    startStopId: res.startStopId,
    endStopId: res.endStopId,
  });
};

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
        <label>Company</label>
        <select v-model="form.companyId" class="input">
          <option v-for="c in companyStore.list" :key="c._id" :value="c._id">
            {{ c.name }}
          </option>
        </select>
      </div>

      <!-- START -->
      <div>
        <label>Start Stop</label>
        <select v-model="form.startStopId" class="input">
          <option v-for="s in stopStore.list" :key="s._id" :value="s._id">
            {{ s.name }}
          </option>
        </select>
      </div>

      <!-- END -->
      <div>
        <label>End Stop</label>
        <select v-model="form.endStopId" class="input">
          <option v-for="s in stopStore.list" :key="s._id" :value="s._id">
            {{ s.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex gap-3">
      <button class="btn-primary" @click="submit">Update</button>
      <NuxtLink to="/admin/routes" class="btn-secondary">Cancel</NuxtLink>
    </div>
  </div>
</template>
