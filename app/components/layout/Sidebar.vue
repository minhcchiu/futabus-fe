<template>
  <aside class="flex w-64 flex-col border-r bg-white px-4 py-6">
    <div class="mb-6 text-xl font-bold text-primary">🚌 BusAdmin</div>

    <nav class="flex-1 space-y-2">
      <SidebarItem label="Dashboard" active href="/admin/" />
      <SidebarItem label="Bus Companies" href="/admin/bus-companies" />
      <SidebarItem label="Vehicles" href="/admin/vehicles" />
      <SidebarItem label="Routes & Stops" href="/admin/routes" />
      <SidebarItem label="Trips" href="/admin/trips" />
      <SidebarItem label="Bookings" badge="12" href="/admin/bookings" />
      <SidebarItem label="Settings" href="/admin/" />
    </nav>

    <div class="mt-auto text-sm text-gray-500">
      Admin User<br />
      admin@bus.vn
    </div>
  </aside>
</template>

<script setup lang="ts"></script>
