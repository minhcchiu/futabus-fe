<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { toast } from "vue-sonner";
import { useUploadStore } from "~/stores/pre-built/upload.store";
import { useSettingStore } from "~/stores/setting.store";

definePageMeta({ layout: "admin" });

const store = useSettingStore();
const uploadStore = useUploadStore();

/* ================= FORM ================= */
const form = reactive({
  shortName: "",
  fullName: "",
  logo: "",
  banner: "",
  coverImage: "",
  website: "",
  email: "",
  phone: "",
  zalo: "",
  fax: "",
  address: "",
  mapLink: "",
  termsOfUse: "",
  privacyPolicy: "",
  bankInfo: {
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    qr: "",
  },
});

const setting = computed(() => store.selected);

/* ================= INIT ================= */
onMounted(async () => {
  await store.fetchOne();
  if (store.selected) {
    Object.assign(form, store.selected);
  }
});

/* ================= UPLOAD ================= */
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const currentField = ref<"logo" | "banner" | "coverImage" | "bankQr" | null>(
  null,
);

const triggerUpload = (field: typeof currentField.value) => {
  currentField.value = field;
  fileInput.value?.click();
};

const onChooseFile = async (e: Event) => {
  const file = (e.target as HTMLInputElement)?.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Vui lòng chọn file hình ảnh");
    return;
  }

  uploading.value = true;
  const res = await uploadStore.uploadFile({ file });

  switch (currentField.value) {
    case "logo":
      form.logo = res.url;
      break;
    case "banner":
      form.banner = res.url;
      break;
    case "coverImage":
      form.coverImage = res.url;
      break;
    case "bankQr":
      form.bankInfo.qr = res.url;
      break;
  }

  uploading.value = false;
  if (fileInput.value) fileInput.value.value = "";
};

const removeImage = (field: typeof currentField.value) => {
  if (field === "bankQr") form.bankInfo.qr = "";
  else (form as any)[field!] = "";
};

/* ================= SUBMIT ================= */
const onSubmit = async () => {
  // @ts-ignore
  delete form.updatedAt;
  // @ts-ignore
  delete form.createdAt;
  // @ts-ignore
  delete form._id;

  if (!setting.value) {
    await store.create(form);
  } else {
    await store.updateById(setting.value._id, form);
  }

  await store.fetchOne();
  toast.success("Cập nhật cài đặt hệ thống thành công");
};
</script>

<template>
  <div class="max-w-5xl">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">Cài đặt hệ thống</h1>
      <p class="text-sm text-gray-500">
        Thông tin hiển thị chung cho toàn bộ hệ thống
      </p>
    </div>

    <form
      class="space-y-8 rounded-xl border bg-white p-6"
      @submit.prevent="onSubmit"
    >
      <!-- ================= MEDIA ================= -->
      <section>
        <h3 class="section-title">Hình ảnh</h3>
        <div class="grid grid-cols-3 items-start gap-6">
          <UploadImage
            label="Logo"
            :src="form.logo"
            :height="140"
            @upload="triggerUpload('logo')"
            @remove="removeImage('logo')"
          />

          <UploadImage
            label="Banner"
            ratio="16/9"
            :src="form.banner"
            :height="140"
            @upload="triggerUpload('banner')"
            @remove="removeImage('banner')"
          />

          <UploadImage
            label="Cover"
            ratio="3/1"
            :src="form.coverImage"
            :height="140"
            @upload="triggerUpload('coverImage')"
            @remove="removeImage('coverImage')"
          />
        </div>
      </section>

      <!-- ================= COMPANY ================= -->
      <section>
        <h3 class="section-title">Thông tin doanh nghiệp</h3>
        <div class="grid grid-cols-2 gap-4">
          <input
            v-model="form.shortName"
            placeholder="Tên ngắn"
            class="input"
          />
          <input
            v-model="form.fullName"
            placeholder="Tên đầy đủ"
            class="input"
          />
          <input
            v-model="form.website"
            placeholder="Website"
            class="input col-span-2"
          />
        </div>
      </section>

      <!-- ================= CONTACT ================= -->
      <section>
        <h3 class="section-title">Liên hệ</h3>
        <div class="grid grid-cols-2 gap-4">
          <input v-model="form.phone" placeholder="SĐT" class="input" />
          <input v-model="form.zalo" placeholder="Zalo" class="input" />
          <input v-model="form.email" placeholder="Email" class="input" />
          <input v-model="form.fax" placeholder="Fax" class="input" />
        </div>

        <textarea
          v-model="form.address"
          rows="2"
          placeholder="Địa chỉ"
          class="input mt-4"
        />
        <input
          v-model="form.mapLink"
          placeholder="Link bản đồ"
          class="input mt-4"
        />
      </section>

      <!-- ================= BANK ================= -->
      <section>
        <h3 class="section-title">Thông tin ngân hàng</h3>

        <div class="grid grid-cols-2 gap-4">
          <input
            v-model="form.bankInfo.bankName"
            placeholder="Tên ngân hàng"
            class="input"
          />
          <input
            v-model="form.bankInfo.accountHolder"
            placeholder="Chủ tài khoản"
            class="input"
          />
          <input
            v-model="form.bankInfo.accountNumber"
            placeholder="Số tài khoản"
            class="input col-span-2"
          />
        </div>

        <div class="mt-4 max-w-xs">
          <UploadImage
            label="QR Thanh toán"
            :src="form.bankInfo.qr"
            @upload="triggerUpload('bankQr')"
            @remove="removeImage('bankQr')"
          />
        </div>
      </section>

      <!-- ================= LEGAL ================= -->
      <section>
        <h3 class="section-title">Điều khoản & chính sách</h3>
        <textarea
          v-model="form.termsOfUse"
          rows="4"
          placeholder="Điều khoản sử dụng"
          class="input"
        />
        <textarea
          v-model="form.privacyPolicy"
          rows="4"
          placeholder="Chính sách bảo mật"
          class="input mt-3"
        />
      </section>

      <!-- ================= ACTION ================= -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="rounded-xl bg-primary px-6 py-2 text-sm font-medium text-white hover:opacity-90"
          :disabled="store.loading || uploading"
        >
          {{ setting ? "Cập nhật" : "Tạo cài đặt" }}
        </button>
      </div>
    </form>

    <!-- INPUT FILE DÙNG CHUNG -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onChooseFile"
    />
  </div>
</template>

<style scoped>
.input {
  @apply w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none;
}

.section-title {
  @apply mb-3 font-medium;
}
</style>
