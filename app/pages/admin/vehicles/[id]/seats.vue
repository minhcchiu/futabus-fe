<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

// const { data: seats } = await useFetch(
//   `/api/admin/vehicles/${route.params.id}/seats`,
// );
const seats = DATA.Seat;
</script>

<template>
  <div>
    <h1 class="mb-4 text-xl font-bold">Seat Layout</h1>

    <div class="grid grid-cols-8 gap-2">
      <div
        v-for="seat in seats"
        :key="seat._id"
        class="rounded border p-2 text-center"
      >
        {{ seat.code }}
        <div class="text-xs">Floor {{ seat.floor }}</div>
      </div>
    </div>
  </div>
</template>
