<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <p class="mb-6 text-gray-500">Overview of your bus booking system</p>

    <!-- Stat cards -->
    <div class="mb-6 grid grid-cols-4 gap-4">
      <StatCard title="Trips Today" value="24" change="+12%" />
      <StatCard title="Seats Sold" value="486" change="+8%" />
      <StatCard title="Revenue" value="₫42.5M" change="+15%" />
      <StatCard title="Pending Bookings" value="12" change="-3%" negative />
    </div>

    <!-- Charts -->
    <div class="mb-6 grid grid-cols-2 gap-6">
      <RevenueChart />
      <TripsChart />
    </div>

    <!-- Bottom -->
    <div class="grid grid-cols-2 gap-6">
      <BookingStatus />
      <RecentActivity />
    </div>
  </div>
</template>
