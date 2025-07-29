<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import BaseHeader from '@/components/base/BaseHeader.vue'

const route = useRoute()

</script>

<template>
  <Toast />
  <div v-if="route.name === 'login'">
    <RouterView />
  </div>
  <div v-else class="container mx-auto my-2">
    <BaseHeader class="mb-3 !bg-gray-100" />
    <RouterView />
  </div>
</template>

<style scoped></style>
