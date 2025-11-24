<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { createUser } from '@/api/users'
import UserForm from '@/components/forms/UserForm.vue'
import type { NewUserPayload } from '@/interfaces/User'

const router = useRouter()
const toast = useToast()

// Modelo del formulario
const initial_form = ref<NewUserPayload>({
  username: '',
  rut: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  isAdmin: false,
})
const submitting = ref(false)

async function handleSubmit(payload: NewUserPayload) {
  submitting.value = true
  try {
    await createUser(payload)

    toast.add({
      severity: 'success',
      summary: 'Usuario creado',
      detail: `Se creó el usuario "${payload.username}" correctamente.`,
      life: 3000,
    })
    router.push({ name: 'users-list' })
  } catch (err) {
    console.error(err)
    toast.add({
      severity: 'error',
      summary: 'Error al crear usuario',
      detail: 'No se pudo crear el usuario. Revisa los datos o intenta nuevamente.',
      life: 4000,
    })
  } finally {
    submitting.value = false
  }
}


function handleCancel() {
  router.push({ name: 'users-list' })
}
</script>

<template>
  <div class="login-root">
    <div class="login-container">
      <Card class="login-card">
        <template #title>
          <div class="title-row">
            <div class="logo">LD</div>
            <div class="title-text">
              <div class="app-name">Crear nuevo usuario</div>
              <div class="app-sub">Completa los datos para crear un usuario</div>
            </div>
          </div>
        </template>

        <template #content>
          <UserForm
            :model-value="initial_form"
            :submitting="submitting"
            mode="create"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
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
.logo{ width:36px; height:36px; border-radius:8px; background:linear-gradient(135deg,#4f46e5,#06b6d4); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; }
.app-name{ color: #fff; font-weight:600 }
.app-sub{ color: rgba(255,255,255,0.7); font-size:0.85rem }
@media (max-width:640px){ .login-container{ padding:0 0.5rem } }
</style>
