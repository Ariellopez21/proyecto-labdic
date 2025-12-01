<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { onMounted } from 'vue'

const route = useRoute()
const toast = useToast()

onMounted(() => {
  if (route.query.denied === 'admin') {
    toast.add({
      severity: 'error',
      summary: 'Acceso denegado',
      detail: 'No tienes permisos para acceder a esta página.',
      life: 3000,
    })
  }else if (route.query.nf === '1') {
    toast.add({
      severity: 'warn',
      summary: 'Redirigido',
      detail: 'La página que intentaste abrir no existe.',
      life: 4000,
    })
  }
})
</script>

<template>
  <div class="login-root">
    <div class="login-container">
      <Card class="login-card">
        <template #title>
          <div class="title-row">
            <div class="logo">LD</div>
            <div class="title-text">
              <div class="app-name">LabDIC Inventory</div>
              <div class="app-sub">Panel principal</div>
            </div>
          </div>
        </template>

        <template #content>
          <div class="prose text-slate-600">
            <h2 class="text-lg font-semibold mb-2">¡Bienvenido a LabDIC Inventory!</h2>
            <p class="text-sm mt-2">© Todos los derechos reservados</p>
            <p class="text-xs mt-1">Autor: Ariel López S.</p>
            <p class="text-xs mt-1">Correo: arilopez@umag.cl | ariellopez.2002@hotmail.com</p>
            <p class="text-xs mt-1">Contacto: +56 9 4139 4363</p>
            <p class="text-xs mt-1">Futuro ingeniero</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.login-root{ min-height: 100vh; display:flex; align-items:center; justify-content:center; background: linear-gradient(180deg, var(--bg-top) 0%, var(--bg-bottom) 100%); padding:2rem }
.login-container{ width:100%; max-width:920px }
.login-card{ padding:1.25rem; border-radius:12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 8px 30px rgba(2,6,23,0.6); }
.title-row{ display:flex; align-items:center; gap:0.75rem; margin-bottom:0.5rem; }
.logo{ width:44px; height:44px; border-radius:8px; background: linear-gradient(135deg,#4f46e5,#06b6d4); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; }
.app-name{ color: inherit; font-weight:600 }
.app-sub{ color: inherit; opacity:0.7; font-size:0.85rem }
@media (max-width:640px){ .login-container{ padding:0 0.5rem } }
</style>
