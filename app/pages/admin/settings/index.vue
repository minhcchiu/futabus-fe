<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { toast } from "vue-sonner";
import { useUploadStore } from "~/stores/pre-built/upload.store";
import { useSettingStore } from "~/stores/setting.store";

definePageMeta({ layout: "admin" });

const store = useSettingStore();
const uploadStore = useUploadStore();

const form = reactive({
  shortName: "",
  fullName: "",
  logo: "",
  banner: "",
  website: "",
  email: "",
  phone: "",
  zalo: "",
  fax: "",
  address: "",
  termsOfUse: "",
  privacyPolicy: "",
});
const setting = computed(() => store.selected);
onMounted(async () => {
  await store.fetchOne();
  if (store.selected) {
    form.shortName = store.selected.shortName;
    form.fullName = store.selected.fullName;
    form.logo = store.selected.logo;
    form.banner = store.selected.banner;
    form.website = store.selected.website;
    form.email = store.selected.email;
    form.phone = store.selected.phone;
    form.zalo = store.selected.zalo;
    form.fax = store.selected.fax;
    form.address = store.selected.address;
    form.termsOfUse = store.selected.termsOfUse;
    form.privacyPolicy = store.selected.privacyPolicy;
  }
});

const onSubmit = async () => {
  if (!setting.value) {
    await store.create(form);
  } else {
    await store.updateById(setting.value._id, form);
  }

  toast.success("Cập nhật cài đặt hệ thống thành công");
};
const fileInput = ref<HTMLInputElement | null>(null);

/* UPLOAD LOGO */
const uploading = ref(false);
const uploadLogo = async (file: File) => {
  uploading.value = true;
  const res = await uploadStore.uploadFile({ file });
  form.logo = res.url;

  uploading.value = false;
};

const onChooseLogo = (e: Event) => {
  const file = (e.target as HTMLInputElement)?.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Vui lòng chọn file hình ảnh");
    return;
  }

  uploadLogo(file);
};

const removeLogo = () => {
  form.logo = "";
  if (fileInput.value) fileInput.value.value = "";
};
</script>

<template>
  <div class="max-w-4xl">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">Cài đặt hệ thống</h1>
      <p class="text-sm text-gray-500">
        Thông tin hiển thị chung cho toàn bộ hệ thống
      </p>
    </div>

    <form
      class="space-y-6 rounded-xl border bg-white p-6"
      @submit.prevent="onSubmit"
    >
      <!-- ===== LOGO ===== -->
      <section>
        <h3 class="mb-3 font-medium">Logo</h3>

        <div class="flex items-center gap-6">
          <!-- PREVIEW -->
          <div
            class="flex h-28 w-28 items-center justify-center rounded-xl border bg-gray-50"
          >
            <img
              v-if="form.logo"
              :src="form.logo"
              class="max-h-full max-w-full object-contain"
            />
            <span v-else class="text-xs text-gray-400">No logo</span>
          </div>

          <!-- ACTION -->
          <div class="space-y-2">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onChooseLogo"
            />

            <button
              type="button"
              class="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
              :disabled="uploading"
              @click="fileInput?.click()"
            >
              {{ uploading ? "Đang upload..." : "Chọn logo" }}
            </button>

            <button
              v-if="form.logo"
              type="button"
              class="block text-sm text-red-500 hover:underline"
              @click="removeLogo"
            >
              Xoá logo
            </button>
          </div>
        </div>
      </section>

      <!-- ===== THÔNG TIN DOANH NGHIỆP ===== -->
      <section>
        <h3 class="mb-3 font-medium">Thông tin doanh nghiệp</h3>
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
          <input v-model="form.website" placeholder="Website" class="input" />
        </div>
      </section>

      <!-- ===== LIÊN HỆ ===== -->
      <section>
        <h3 class="mb-3 font-medium">Liên hệ</h3>
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
      </section>

      <!-- ===== PHÁP LÝ ===== -->
      <section>
        <h3 class="mb-3 font-medium">Điều khoản & chính sách</h3>
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

      <!-- ACTION -->
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
  </div>
</template>

<style scoped>
.input {
  @apply w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none;
}
</style>
