<script setup>
// const { data: banners } = await useFetch("/api/admin/banners");
const banners = DATA.Banner;

definePageMeta({
  layout: "admin",
});
</script>

<template>
  <div>
    <h1 class="text-xl font-bold">Banners</h1>

    <div class="grid grid-cols-4 gap-4">
      <div v-for="b in banners" :key="b._id" class="rounded border p-2">
        <img :src="b.image" class="h-32 w-full rounded object-cover" />
        <p class="font-semibold">{{ b.title }}</p>
        <p>{{ b.isShow ? "Visible" : "Hidden" }}</p>
      </div>
    </div>
  </div>
</template>
