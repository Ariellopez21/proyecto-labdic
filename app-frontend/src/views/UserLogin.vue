<script setup lang="ts">
import { getMyUser } from '@/api/users';
import { login } from '@/api/auth';
import { useAuthStore } from '../stores/auth';
import { useUserStore } from '../stores/user';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const currentUser = useUserStore()

const username = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  try {
    const token = await login(username.value, password.value);
    auth.setToken(token.accessToken)
    router.push({ name: 'home' })

    const user = await getMyUser()
    currentUser.setUser(user)
  }
  catch (error) {
    console.error('Error al iniciar sesión:', error);
  }

}

if (route.query.expiredToken) {
  error.value = 'Token expirado, por favor inicia sesión de nuevo.'
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
              <InputText id="username" v-model="username" fluid placeholder="usuario" />
              <label for="username">Usuario</label>
            </FloatLabel>

            <FloatLabel variant="in">
              <InputText type="password" id="password" v-model="password" fluid placeholder="contraseña" />
              <label for="password">Contraseña</label>
            </FloatLabel>

            <Message v-if="error" severity="error" class="message-error">
              {{ error }}
            </Message>

            <div class="actions">
              <Button type="submit" class="primary">Iniciar Sesión</Button>
            </div>
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.login-root{
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0f172a 0%, #0b1220 100%);
  padding: 2rem;
}
.login-container{ width:100%; max-width:420px; }
.login-card{ padding:1.25rem; border-radius:12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 8px 30px rgba(2,6,23,0.6); }
.title-row{ display:flex; align-items:center; gap:0.75rem; margin-bottom:0.5rem; }
.logo{ width:44px; height:44px; border-radius:8px; background:linear-gradient(135deg,#4f46e5,#06b6d4); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; }
.app-name{ color: #fff; font-weight:600; }
.app-sub{ color: rgba(255,255,255,0.7); font-size:0.85rem; }
.form-column{ display:flex; flex-direction:column; gap:1rem; }
.message-error{ margin-top:0.25rem; }
.actions{ display:flex; justify-content:flex-end; margin-top:0.5rem; }
.primary >>> .p-button{ background: linear-gradient(90deg,#4f46e5,#06b6d4) !important; border:none; }

/* Ajustes responsivos */
@media (max-width: 640px){
  .login-container{ padding:0 0.5rem; }
}
</style>
