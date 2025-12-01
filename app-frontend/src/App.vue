<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import BaseHeader from '@/components/base/BaseHeader.vue'

const route = useRoute()
</script>

<template>
  <Toast />

  <!-- Raíz que aplica el fondo; mantiene comportamiento especial para la ruta 'login' -->
  <div :class="['app-root', route.name === 'login' ? 'login-mode' : 'app-mode']">

    <!-- Modo login: mostrar solo la vista de login sin header ni footer -->
    <div v-if="route.name === 'login'" class="page-wrapper">
      <RouterView />
    </div>

    <!-- Modo aplicación: header, contenido central con transición y footer -->
    <div v-else class="app-shell">
      <BaseHeader class="app-header" />

      <main class="content-container">
          <RouterView />
      </main>

      <footer class="app-footer">
        <div class="container-text">© LabDIC — Ariel López · 2025</div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Fondo sin color: blanco en modo claro, negro en modo oscuro. */
:root {
  --bg-top: #ffffff;
  --bg-bottom: #ffffff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-top: #000000;
    --bg-bottom: #000000;
  }
}

.app-root{ min-height:100vh; background: linear-gradient(180deg, var(--bg-top) 0%, var(--bg-bottom) 100%); }

.page-wrapper{ min-height:100vh; display:flex; align-items:center; justify-content:center; }

.app-shell{ display:flex; flex-direction:column; min-height:100vh; }
.app-header{ z-index:50 }

.content-container{ flex:1; display:flex; align-items:flex-start; justify-content:center; padding:1.25rem; }
.content-container > * { width:100%; max-width:1100px; }

.app-footer{ text-align:center; padding:1rem 0; color:rgba(0,0,0,0.65); font-size:0.9rem; border-top:1px solid rgba(0,0,0,0.06); background: linear-gradient(180deg, rgba(0,0,0,0.02), transparent); }

.container-text{ max-width:1100px; margin:0 auto; }

/* Transición simple entre rutas */
.fade-enter-active, .fade-leave-active { transition: opacity 180ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Ajustes responsivos */
@media (max-width: 768px) {
  .content-container{ padding: 1rem; }
  .container-text{ padding:0 1rem }
}

/* Modo login: reutiliza el mismo fondo "sin color" */
.login-mode { background: linear-gradient(180deg, var(--bg-top) 0%, var(--bg-bottom) 100%); }
.login-mode .page-wrapper { padding: 2rem; }

</style>
