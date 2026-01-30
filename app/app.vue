<script setup lang="ts">
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import "~/assets/css/global.css";
import "~/assets/css/prism.css";
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Toaster position="top-center" />
</template>
