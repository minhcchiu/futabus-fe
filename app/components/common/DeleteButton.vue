<script setup lang="ts">
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onDelete: () => Promise<any>;
  disabled?: boolean;
  label?: string;
  successMessage?: string;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const showModal = ref(false);
const loading = ref(false);

const handleConfirm = async () => {
  loading.value = true;
  try {
    await props.onDelete();
    toast.success(props.successMessage || "Đã xóa thành công");
    showModal.value = false;
    emit("deleted");
  } catch (error: any) {
    toast.error(props.errorMessage || error?.message || "Xóa thất bại!");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <button
    class="text-sm text-red-500 hover:underline disabled:opacity-50"
    :disabled="disabled"
    @click="showModal = true"
  >
    {{ label || "Xóa" }}
  </button>

  <ConfirmModal
    :show="showModal"
    title="Xác nhận xóa"
    message="Bạn có chắc chắn muốn xóa?"
    :loading="loading"
    @cancel="showModal = false"
    @confirm="handleConfirm"
  />
</template>
