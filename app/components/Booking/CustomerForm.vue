<script setup lang="ts">
import { reactive, watch } from "vue";

/* =========================
  TYPES
========================= */
type FormType = {
  name: string;
  phone: string;
  email: string;
  note: string;
  accepted: boolean;
};

/* =========================
  PROPS & EMIT
========================= */
const props = defineProps<{
  form: FormType;
}>();

const emit = defineEmits<{
  (e: "change", value: FormType): void;
}>();

/* =========================
  LOCAL FORM
========================= */
const localForm = reactive<FormType>({
  name: props.form.name || "",
  phone: props.form.phone || "",
  email: props.form.email || "",
  note: props.form.note || "",
  accepted: props.form.accepted || false,
});

/* =========================
  ERRORS
========================= */
const errors = reactive<{
  name?: string;
  phone?: string;
  email?: string;
  accepted?: string;
}>({});

/* =========================
  VALIDATION
========================= */
const validate = () => {
  let valid = true;

  // Name
  if (!localForm.name.trim()) {
    errors.name = "Vui lòng nhập họ tên";
    valid = false;
  } else {
    delete errors.name;
  }

  // Phone (VN: 10 số, bắt đầu bằng 0)
  if (!/^0\d{9}$/.test(localForm.phone)) {
    errors.phone = "Số điện thoại không hợp lệ";
    valid = false;
  } else {
    delete errors.phone;
  }

  // Email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localForm.email)) {
    errors.email = "Email không hợp lệ";
    valid = false;
  } else {
    delete errors.email;
  }

  // Accepted
  if (!localForm.accepted) {
    errors.accepted = "Bạn phải chấp nhận điều khoản";
    valid = false;
  } else {
    delete errors.accepted;
  }

  return valid;
};

/* =========================
  WATCH → EMIT KHI VALID
========================= */
watch(
  () => ({ ...localForm }),
  (val) => {
    validate();
    emit("change", { ...val });
  },
  { deep: true },
);
</script>

<template>
  <section class="rounded-xl border bg-white p-5 pt-6">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- LEFT -->
      <div>
        <h3 class="mb-4 font-semibold">Thông tin khách hàng</h3>

        <!-- Name -->
        <div class="mb-4">
          <label class="mb-1 block text-sm">
            Họ và tên <span class="text-red-500">*</span>
          </label>
          <input
            v-model="localForm.name"
            type="text"
            class="w-full rounded-md border px-3 py-2"
            placeholder="Nhập họ và tên"
          >
          <p v-if="errors.name" class="mt-1 text-xs text-red-500">
            {{ errors.name }}
          </p>
        </div>

        <!-- Phone -->
        <div class="mb-4">
          <label class="mb-1 block text-sm">
            Số điện thoại (Zalo) <span class="text-red-500">*</span>
          </label>
          <input
            v-model="localForm.phone"
            type="tel"
            class="w-full rounded-md border px-3 py-2"
            placeholder="Số điện thoại (Zalo)"
          >
          <p v-if="errors.phone" class="mt-1 text-xs text-red-500">
            {{ errors.phone }}
          </p>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="mb-1 block text-sm">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            v-model="localForm.email"
            type="email"
            class="w-full rounded-md border px-3 py-2"
            placeholder="Nhập email"
          >
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">
            {{ errors.email }}
          </p>
        </div>

        <!-- Note -->
        <div class="mb-4">
          <label class="mb-1 block text-sm">Ghi chú</label>
          <textarea
            v-model="localForm.note"
            rows="3"
            class="w-full rounded-md border px-3 py-2"
            placeholder="Đón ở bến xe Đà Nẵng..."
          />
        </div>
      </div>

      <!-- RIGHT -->
      <div>
        <h3 class="mb-3 font-semibold text-green-500">ĐIỀU KHOẢN & LƯU Ý</h3>

        <p class="mb-3 text-sm font-medium text-red-500">
          Quý khách vui lòng Đăng ký/Đăng nhập để nhận khuyến mãi.
        </p>

        <div class="space-y-3 text-sm text-gray-700">
          <p>(*) Có mặt trước giờ khởi hành ít nhất 30 phút.</p>
          <p>
            (*) Liên hệ tổng đài
            <span class="font-medium text-green-500">1900 6067</span>
            khi cần hỗ trợ.
          </p>
        </div>
      </div>
    </div>

    <!-- ACCEPT -->
    <label class="mt-6 flex items-start gap-2 text-sm">
      <input
        v-model="localForm.accepted"
        type="checkbox"
        class="mt-1 accent-green-500"
      >
      <span>
        <span class="text-green-500">Chấp nhận điều khoản</span>
        & chính sách bảo mật
      </span>
    </label>

    <p v-if="errors.accepted" class="mt-1 text-xs text-red-500">
      {{ errors.accepted }}
    </p>
  </section>
</template>
