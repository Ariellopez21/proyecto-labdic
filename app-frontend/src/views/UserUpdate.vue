<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import UserForm from '@/components/forms/UserForm.vue'
import { getUser, updateUser } from '@/api/users'
import type { User, NewUserPayload } from '@/interfaces/User'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const route = useRoute()  // Para rastrear la id a través de la URL
const router = useRouter() // Para redirigir después de guardar
const toast = useToast()

const auth = useAuthStore()
const userStore = useUserStore()

const submitting = ref(false)
const loading = ref(true)
const userId = Number(route.params.id)


const initial_form = ref<NewUserPayload>({
  username: '',
  rut: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  isAdmin: false,
  roleIds: [],
})

async function loadUser() {
  loading.value = true
  try {
    const u: User = await getUser(userId)
    //console.log('User loaded for edit:', u)
    initial_form.value = {
      username: u.username,
      rut: u.rut,
      name: u.name,
      email: u.email,
      phone: u.phone,
      address: u.address,
      isAdmin: u.isAdmin,
      password: '',   // no la traemos del backend
      roleIds: u.roles.map((r) => r.id),
    }
  } catch (err) {
    console.error(err)
    toast.add({
      severity: 'error',
      summary: 'Error al cargar usuario',
      detail: 'No se pudo obtener la información del usuario.',
      life: 4000,
    })
    router.push({ name: 'users-list' })
  } finally {
    loading.value = false
  }
}

/**
 * Maneja el envío del formulario de actualización de usuario.
 * - Construye el payload parcialmente (elimina la contraseña vacía).
 * - Llama a la API `updateUser`.
 * - Si el usuario editado es el mismo que está logueado, limpia sesión y
 *   redirige al login para que vuelva a autenticarse.
 * - En caso contrario redirige a la lista de usuarios.
 * - Maneja errores mostrando toasts y asegura que `submitting` siempre
 *   vuelva a `false` en el finally.
 */
async function handleSubmit(payload: NewUserPayload) {
  submitting.value = true
  try {
    // Construir el payload que se enviará al backend (partial)
    const toSend: Partial<NewUserPayload> = { ...payload }

    // Si la contraseña está vacía o solo espacios, no la incluimos
    if (!toSend.password || !toSend.password.trim()) {
      delete toSend.password
    }

    // Llamada a la API para actualizar el usuario
    await updateUser(userId, toSend)

    // Si el usuario actualizado es el mismo que está en sesión,
    // notificamos, limpiamos token/usuario y forzamos re-login
    const isEditingSelf =
      !!userStore.currentUser && userStore.currentUser.id === userId

    if (isEditingSelf) {
      toast.add({
        severity: 'info',
        summary: 'Datos actualizados',
        detail: 'Tus datos fueron actualizados. Vuelve a iniciar sesión.',
        life: 4000,
      })

      auth.clearToken()
      userStore.clearUser()

      router.push({ name: 'login', query: { selfUpdated: '1' } })
      return
    }

    // Mensaje de éxito y navegación a la lista de usuarios
    toast.add({
      severity: 'success',
      summary: 'Usuario actualizado',
      detail: `Se actualizaron los datos de "${payload.username}".`,
      life: 3000,
    })

    router.push({ name: 'users-list' })
  } catch (err) {
    console.error(err)
    toast.add({
      severity: 'error',
      summary: 'Error al actualizar usuario',
      detail: 'No se pudo actualizar el usuario. Intenta nuevamente.',
      life: 4000,
    })
  } finally {
    submitting.value = false
  }
}

function handleCancel() {
  router.push({ name: 'users-list' })
}

onMounted(() => {
  if (Number.isNaN(userId)) {
    router.push({ name: 'users-list' })
  } else {
    loadUser()
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
              <div class="app-name">Editar usuario</div>
              <div class="app-sub">Modifica los datos del usuario</div>
            </div>
          </div>
        </template>

        <template #content>
          <div v-if="loading" class="py-8 text-center text-slate-300">Cargando datos del usuario...</div>
          <div v-else>
            <UserForm
            :model-value="initial_form"
            :submitting="submitting"
            mode="edit"
            @submit="handleSubmit"
            @cancel="handleCancel" />
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
.logo{ width:36px; height:36px; border-radius:8px; background:linear-gradient(135deg,#4f46e5,#06b6d4); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; }
.app-name{ color: #fff; font-weight:600 }
.app-sub{ color: rgba(255,255,255,0.7); font-size:0.85rem }
@media (max-width:640px){ .login-container{ padding:0 0.5rem } }
</style>
