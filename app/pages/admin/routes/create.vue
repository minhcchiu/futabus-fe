<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useBusCompanyStore } from "~/stores/bus_company.store";
import { useRouteStore } from "~/stores/route.store";

definePageMeta({ layout: "admin" });

const router = useRouter();
const routeStore = useRouteStore();
const companyStore = useBusCompanyStore();
const stopStore = useStopLocationStore();

const form = ref({
  companyId: "",
  startStopId: "",
  endStopId: "",
});

onMounted(async () => {
  await Promise.all([companyStore.fetchAll(), stopStore.fetchAll()]);
});

async function submit() {
  await routeStore.create(form.value);
  router.push("/admin/routes");
}
</script>

<template>
  <div class="max-w-xl space-y-5">
    <h1 class="text-xl font-semibold">Create Route</h1>

    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700"
        >Company</label
      >
      <select
        v-model="form.companyId"
        class="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
      >
        <option value="">Select company</option>
        <option v-for="c in companyStore.list" :key="c._id" :value="c._id">
          {{ c.name }}
        </option>
      </select>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">From</label>
      <select
        v-model="form.startStopId"
        class="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
      >
        <option value="">Select start stop</option>
        <option v-for="s in stopStore.list" :key="s._id" :value="s._id">
          {{ s.name }}
        </option>
      </select>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">To</label>
      <select
        v-model="form.endStopId"
        class="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
      >
        <option value="">Select end stop</option>
        <option v-for="s in stopStore.list" :key="s._id" :value="s._id">
          {{ s.name }}
        </option>
      </select>
    </div>

    <div class="flex gap-3 pt-2">
      <button
        @click="submit"
        class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Create
      </button>
      <NuxtLink
        to="/admin/routes"
        class="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
      >
        Cancel
      </NuxtLink>
    </div>
  </div>
</template>
