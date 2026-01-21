<template>
  <aside class="flex w-64 flex-col border-r bg-white px-4 py-6">
    <div class="mb-6 text-xl font-bold text-primary">🚌 BusAdmin</div>

    <nav class="flex-1 space-y-2">
      <SidebarItem label="Dashboard" active />
      <SidebarItem label="Bus Companies" />
      <SidebarItem label="Vehicles" />
      <SidebarItem label="Routes & Stops" />
      <SidebarItem label="Trips" />
      <SidebarItem label="Bookings" badge="12" />
      <SidebarItem label="Reports" />
      <SidebarItem label="Settings" />
    </nav>

    <div class="mt-auto text-sm text-gray-500">
      Admin User<br />
      admin@bus.vn
    </div>
  </aside>
</template>

<script setup lang="ts"></script>
