<script setup lang="ts">
// Layout público — solo centra el contenido, sin sidebar ni topbar.
// Usado por: /login
</script>

<template>
  <div class="auth-layout">
    <RouterView />
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0f172a 0%, #0b1220 100%);
}
</style>
