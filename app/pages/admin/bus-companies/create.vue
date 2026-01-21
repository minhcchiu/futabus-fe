<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

const form = reactive({
  name: "",
  hotline: "",
  description: "",
  status: "ACTIVE",
});

async function submit() {
  await $fetch("/api/admin/bus-companies", {
    method: "POST",
    body: form,
  });
  navigateTo("/admin/bus-companies");
}
</script>

<template>
  <div>
    <h1 class="mb-4 text-xl font-bold">Create Bus Company</h1>

    <form @submit.prevent="submit" class="max-w-xl space-y-4">
      <Input label="Name" v-model="form.name" />
      <Input label="Hotline" v-model="form.hotline" />
      <Textarea label="Description" v-model="form.description" />
      <Select
        label="Status"
        v-model="form.status"
        :options="['ACTIVE', 'INACTIVE']"
      />

      <Button type="submit">Save</Button>
    </form>
  </div>
</template>
