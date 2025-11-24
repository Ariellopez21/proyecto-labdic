<!-- src/views/MyUserView.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { User } from '@/interfaces/User'
import { getMyUser } from '@/api/users'

const toast = useToast()
const myUser = ref<User | null>(null)
const loading = ref(false)

async function loadMyUser() {
  loading.value = true
  try {
    myUser.value = await getMyUser()
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar tus datos de usuario.',
      life: 4000,
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMyUser()
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
              <div class="app-name">Mi usuario</div>
              <div class="app-sub">Información de tu cuenta</div>
            </div>
          </div>
        </template>

        <template #content>
          <div v-if="loading" class="py-8 text-center text-slate-300">Cargando datos...</div>

          <div v-else-if="myUser" class="grid gap-3">
            <div class="grid grid-cols-3 gap-2">
              <span class="text-sm font-semibold text-slate-400">Usuario</span>
              <span class="col-span-2 text-sm">{{ myUser.username }}</span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <span class="text-sm font-semibold text-slate-400">Nombre</span>
              <span class="col-span-2 text-sm">{{ myUser.name }}</span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <span class="text-sm font-semibold text-slate-400">Teléfono</span>
              <span class="col-span-2 text-sm">{{ myUser.phone }}</span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <span class="text-sm font-semibold text-slate-400">RUT</span>
              <span class="col-span-2 text-sm">{{ myUser.rut }}</span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <span class="text-sm font-semibold text-slate-400">Correo</span>
              <span class="col-span-2 text-sm break-all">{{ myUser.email }}</span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <span class="text-sm font-semibold text-slate-400">Dirección</span>
              <span class="col-span-2 text-sm">{{ myUser.address }}</span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <span class="text-sm font-semibold text-slate-400">Rol</span>
              <span class="col-span-2 text-sm">{{ myUser.isAdmin ? 'Administrador' : 'Usuario' }}</span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <span class="text-sm font-semibold text-slate-400">Estado</span>
              <span class="col-span-2 text-sm">{{ myUser.isActive ? 'Activo' : 'Inactivo' }}</span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <span class="text-sm font-semibold text-slate-400">Creado</span>
              <span class="col-span-2 text-sm">{{ new Date(myUser.createdAt).toLocaleString() }}</span>
            </div>
          </div>

          <div v-else class="text-sm text-slate-300">No se encontraron datos de usuario.</div>
        </template>

        <template #footer>
          <div class="flex justify-end">
            <Button label="Actualizar datos" icon="pi pi-refresh" outlined class="text-sm" @click="loadMyUser" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.login-root{ min-height: 100vh; display:flex; align-items:center; justify-content:center; background: linear-gradient(180deg, #0f172a 0%, #0b1220 100%); padding:2rem }
.login-container{ width:100%; max-width:720px }
.login-card{ padding:1rem; border-radius:12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 8px 30px rgba(2,6,23,0.6); color: #e6eef8 }
.title-row{ display:flex; align-items:center; gap:0.75rem; margin-bottom:0.5rem; }
.logo{ width:44px; height:44px; border-radius:8px; background:linear-gradient(135deg,#4f46e5,#06b6d4); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; }
.app-name{ color: #fff; font-weight:600 }
.app-sub{ color: rgba(255,255,255,0.7); font-size:0.85rem }
@media (max-width:640px){ .login-container{ padding:0 0.5rem } }
</style>
