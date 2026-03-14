<script setup lang="ts">
// App.vue — punto de entrada limpio.
// El layout (sidebar, topbar, footer) vive en AppLayout.vue.
// La pantalla de login vive en AuthLayout.vue.
// El router decide qué layout usar según la ruta.
</script>

<template>
  <Toast />
  <RouterView />
</template>
