<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ZodError } from "zod";
import { useSepayStore } from "~/stores/sepay.store";
import {
  UpdateSepaySchema,
  type UpdateSepay,
} from "~/validations/admin/sepay.validation";

definePageMeta({ layout: "admin", middleware: "auth" });

const router = useRouter();
const route = useRoute();
const store = useSepayStore();

/* FORM */
const form = reactive<UpdateSepay>({
  logo: "",
  name: "",
  code: "",
  bin: "",
  shortName: "",
  swift_code: "",

  transferSupported: 0,
  lookupSupported: 0,
  isTransfer: 0,
  support: 0,

  isUse: true,
  note: "",

  bankInfo: {
    accountNumber: "",
    accountHolder: "",
  },
});

const errors = ref<Record<string, string>>({});

/* FETCH DETAIL */
const fetchDetail = async () => {
  const res: any = await store.fetchById(route.params.id as string);
  if (!res) return;

  Object.assign(form, {
    logo: res.logo,
    name: res.name,
    code: res.code,
    bin: res.bin,
    shortName: res.shortName || res.short_name,
    swift_code: res.swift_code,

    transferSupported: res.transferSupported,
    lookupSupported: res.lookupSupported,
    isTransfer: res.isTransfer,
    support: res.support,

    isUse: res.isUse,
    note: res.note,

    bankInfo: {
      accountNumber: res.bankInfo?.accountNumber,
      accountHolder: res.bankInfo?.accountHolder,
    },
  });
};

/* INIT */
onMounted(fetchDetail);
/* VALIDATE */
const validateForm = () => {
  try {
    UpdateSepaySchema.parse(form);
    errors.value = {};
    return true;
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      err.errors.forEach((e) => {
        fieldErrors[e.path.join(".")] = e.message;
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
  if (res) router.push("/admin/sepay");
};
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <h1 class="text-2xl font-semibold">Cập nhật Sepay / Ngân hàng</h1>

    <div class="grid grid-cols-2 gap-4">
      <!-- NAME -->
      <div class="col-span-2">
        <label class="label">Tên ngân hàng</label>
        <input v-model="form.name" class="input" />
        <p class="error">{{ errors.name }}</p>
      </div>

      <!-- CODE -->
      <div>
        <label class="label">Code</label>
        <input v-model="form.code" class="input" />
        <p class="error">{{ errors.code }}</p>
      </div>

      <!-- BIN -->
      <div>
        <label class="label">BIN</label>
        <input v-model="form.bin" class="input" />
      </div>

      <!-- SHORT NAME -->
      <div>
        <label class="label">Short name</label>
        <input v-model="form.shortName" class="input" />
      </div>

      <!-- SWIFT -->
      <div>
        <label class="label">Swift code</label>
        <input v-model="form.swift_code" class="input" />
      </div>

      <!-- SUPPORT -->
      <div>
        <label class="label">Chuyển khoản</label>
        <select v-model.number="form.transferSupported" class="input">
          <option :value="1">Có</option>
          <option :value="0">Không</option>
        </select>
      </div>

      <div>
        <label class="label">Tra cứu</label>
        <select v-model.number="form.lookupSupported" class="input">
          <option :value="1">Có</option>
          <option :value="0">Không</option>
        </select>
      </div>

      <!-- BANK INFO -->
      <div class="col-span-2">
        <h3 class="font-medium">Thông tin tài khoản</h3>
      </div>

      <div>
        <label class="label">Số tài khoản</label>
        <input v-model="form.bankInfo!.accountNumber" class="input" />
      </div>

      <div>
        <label class="label">Chủ tài khoản</label>
        <input v-model="form.bankInfo!.accountHolder" class="input" />
      </div>

      <!-- NOTE -->
      <div class="col-span-2">
        <label class="label">Ghi chú</label>
        <textarea v-model="form.note" rows="3" class="input" />
      </div>

      <!-- IS USE -->
      <div class="col-span-2">
        <label class="flex items-center gap-2">
          <input v-model="form.isUse" type="checkbox" />
          <span>Đang sử dụng</span>
        </label>
      </div>
    </div>

    <div class="flex gap-3">
      <button class="btn-primary" @click="submit">Update</button>
      <NuxtLink to="/admin/sepay" class="btn-secondary">Cancel</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full rounded-lg border px-3 py-2 text-sm;
}
.label {
  @apply mb-1 block text-sm font-medium;
}
.error {
  @apply mt-1 text-xs text-red-500;
}
</style>
