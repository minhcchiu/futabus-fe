<script setup lang="ts">
const emit = defineEmits(["select"]);
const selectTrip = () => {
  emit("select");
};
</script>

<template>
  <Button
    class="rounded-full bg-green-500 text-white hover:bg-green-600"
    @click="selectTrip"
  >
    Chọn chuyến
  </Button>
</template>
