<script setup lang="ts">
import { getMyUser } from '@/services/user.service'
import { login } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { useUserStore } from '@/stores/user.store'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const currentUser = useUserStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

console.log('LoginView mounted. Checking for expired token message...')

// Muestra el mensaje si el token expiró (redirigido desde el interceptor 401)
if (route.query.expiredToken) {
  error.value = 'Tu sesión expiró. Por favor inicia sesión nuevamente.'
}

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    const token = await login(username.value, password.value)
    auth.setToken(token.accessToken)

    // Cargamos los datos del usuario antes de redirigir
    const user = await getMyUser()
    currentUser.setUser(user)

    // Redirige al destino original si venía de una ruta protegida
    const redirect = route.query.redirect as string | undefined
    router.push(redirect ?? { name: 'home' })

  } catch (err: any) {
    // El interceptor de apiFetch ya maneja el 401 de token expirado.
    // Aquí capturamos el 401 del login (credenciales incorrectas)
    // y el 403 (cuenta inactiva).
    const status = err?.message?.match(/status: (\d+)/)?.[1]

    if (status === '401') {
      error.value = 'Usuario o contraseña incorrectos.'
    } else if (status === '403') {
      error.value = 'Tu cuenta está inactiva. Contacta al administrador.'
    } else {
      error.value = 'Error al iniciar sesión. Intenta nuevamente.'
    }
  } finally {
    loading.value = false
  }
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
              <div class="app-name">LabDIC</div>
              <div class="app-sub">Acceso al sistema</div>
            </div>
          </div>
        </template>

        <template #content>
          <form class="form-column" @submit.prevent="handleLogin">
            <FloatLabel variant="in">
              <InputText
                id="username"
                v-model="username"
                fluid
                autocomplete="username"
                :disabled="loading"
              />
              <label for="username">Usuario</label>
            </FloatLabel>

            <FloatLabel variant="in">
              <InputText
                type="password"
                id="password"
                v-model="password"
                fluid
                autocomplete="current-password"
                :disabled="loading"
              />
              <label for="password">Contraseña</label>
            </FloatLabel>

            <Message v-if="error" severity="error" class="message-error">
              {{ error }}
            </Message>

            <div class="actions">
              <Button type="submit" :loading="loading" :disabled="loading">
                Iniciar Sesión
              </Button>
            </div>
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.login-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.login-container { width: 100%; max-width: 420px; }
.login-card {
  padding: 1.25rem;
  border-radius: 12px;
  background: linear-gradient(180deg, #0f172a 0%, #0b1220 100%);
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 8px 30px rgba(2,6,23,0.6);
}
.title-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
.logo {
  width: 44px; height: 44px; border-radius: 8px;
  background: linear-gradient(135deg, #4f46e5, #06b6d4);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700;
}
.app-name { color: #fff; font-weight: 600; }
.app-sub  { color: rgba(255,255,255,0.7); font-size: 0.85rem; }
.form-column { display: flex; flex-direction: column; gap: 1rem; }
.message-error { margin-top: 0.25rem; }
.actions { display: flex; justify-content: flex-end; margin-top: 0.5rem; }

@media (max-width: 640px) {
  .login-container { padding: 0 0.5rem; }
}
</style>
