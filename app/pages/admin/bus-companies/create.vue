<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ZodError } from "zod";
import { useBusCompanyStore } from "~/stores/bus_company.store";
import {
  CreateBusCompanySchema,
  type CreateBusCompany,
} from "~/validations/admin/bus_company.validation";

definePageMeta({ layout: "admin" });

const router = useRouter();
const store = useBusCompanyStore();

/* FORM STATE */
const form = reactive<CreateBusCompany>({
  name: "",
  hotline: "",
  hotlineList: [],
  description: "",
  policy: "",
  status: "ACTIVE",
});

const errors = ref<Record<string, string>>({});
const submitting = ref(false);

/* VALIDATE */
const validateForm = (): boolean => {
  try {
    CreateBusCompanySchema.parse(form);
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
  const res = await store.create(form);
  submitting.value = false;

  if (res) {
    router.push("/admin/bus-companies");
  }
};
</script>

<template>
  <div class="max-w-xl space-y-6">
    <!-- HEADER -->
    <div>
      <h1 class="text-2xl font-semibold">Create Bus Company</h1>
      <p class="text-sm text-gray-500">Add a new bus operator</p>
    </div>

    <!-- FORM -->
    <div class="space-y-4">
      <!-- NAME -->
      <div>
        <label class="mb-1 block text-sm font-medium">Company Name</label>
        <input v-model="form.name" class="input" />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <!-- HOTLINE -->
      <div>
        <label class="mb-1 block text-sm font-medium">Hotline</label>
        <input v-model="form.hotline" class="input" />
        <p v-if="errors.hotline" class="error">{{ errors.hotline }}</p>
      </div>

      <!-- HOTLINE LIST -->
      <div>
        <label class="mb-1 block text-sm font-medium">Other Hotlines</label>
        <div
          v-for="(h, i) in form.hotlineList"
          :key="i"
          class="mb-2 flex gap-2"
        >
          <input v-model="form.hotlineList[i]" class="input flex-1" />
          <button
            type="button"
            class="text-sm text-red-500"
            @click="form.hotlineList.splice(i, 1)"
          >
            Remove
          </button>
        </div>
        <button
          type="button"
          class="text-sm text-primary"
          @click="form.hotlineList.push('')"
        >
          + Add hotline
        </button>
      </div>

      <!-- DESCRIPTION -->
      <div>
        <label class="mb-1 block text-sm font-medium">Description</label>
        <textarea v-model="form.description" rows="3" class="input" />
      </div>

      <!-- POLICY -->
      <div>
        <label class="mb-1 block text-sm font-medium">Policy</label>
        <textarea v-model="form.policy" rows="3" class="input" />
      </div>

      <!-- STATUS -->
      <div>
        <label class="mb-1 block text-sm font-medium">Status</label>
        <select v-model="form.status" class="input">
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <p v-if="errors.status" class="error">{{ errors.status }}</p>
      </div>
    </div>

    <!-- ACTION -->
    <div class="flex gap-3">
      <button
        :disabled="submitting || store.loading"
        class="btn-primary flex items-center justify-center gap-2"
        @click="submit"
      >
        <span
          v-if="submitting || store.loading"
          class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
        />
        <span>{{ submitting || store.loading ? "Saving..." : "Create" }}</span>
      </button>

      <NuxtLink to="/admin/bus-companies" class="btn-secondary">
        Cancel
      </NuxtLink>
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
.btn-secondary {
  @apply rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50;
}
</style>
