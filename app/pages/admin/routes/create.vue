<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
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

/* INIT */
onMounted(async () => {
  await companyStore.fetchAll();
  await stopStore.fetchAll();
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

  const res = await store.create(form);

  toast.success("Tạo tuyến đường thành công");
  if (res) router.push("/admin/routes");
};
</script>

<template>
  <div class="max-w-xl space-y-6">
    <h1 class="text-2xl font-semibold">Tạo tuyến đường</h1>

    <div class="space-y-4">
      <!-- COMPANY -->
      <div>
        <label class="block text-sm font-medium">Nhà xe</label>
        <select v-model="form.companyId" class="input">
          <option value="">Chọn nhà xe</option>
          <option v-for="c in companyStore.list" :key="c._id" :value="c._id">
            {{ c.name }}
          </option>
        </select>
        <p class="error">{{ errors.companyId }}</p>
      </div>

      <!-- START -->
      <div>
        <label class="block text-sm font-medium">Điểm bắt đầu</label>
        <select v-model="form.startStopId" class="input">
          <option value="">Chọn điểm bắt đầu</option>
          <option v-for="s in stopStore.list" :key="s._id" :value="s._id">
            {{ s.name }}
          </option>
        </select>
        <p class="error">{{ errors.startStopId }}</p>
      </div>

      <!-- END -->
      <div>
        <label class="block text-sm font-medium">Điểm kết thúc</label>
        <select v-model="form.endStopId" class="input">
          <option value="">Chọn điểm kết thúc</option>
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
        />
        <p class="error">{{ errors.durationMinutes }}</p>
      </div>
    </div>

    <div class="flex gap-3">
      <button class="btn-primary" @click="submit">Tạo</button>
      <NuxtLink to="/admin/routes" class="btn-secondary">Hủy</NuxtLink>
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
