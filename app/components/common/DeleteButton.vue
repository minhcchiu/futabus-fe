<script setup lang="ts">
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";

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
    toast({ title: props.successMessage || "Deleted successfully" });
    showModal.value = false;
    emit("deleted");
  } catch (error: any) {
    toast({
      title: props.errorMessage || error?.message || "Delete failed",
      variant: "destructive",
    });
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
    {{ label || "Delete" }}
  </button>

  <ConfirmModal
    :show="showModal"
    title="Confirm delete"
    message="This action cannot be undone. Are you sure?"
    :loading="loading"
    @cancel="showModal = false"
    @confirm="handleConfirm"
  />
</template>
