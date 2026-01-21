<template>
  <div class="flex min-h-screen">
    <Sidebar />

    <div class="flex flex-1 flex-col">
      <AdminTopbar />
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
