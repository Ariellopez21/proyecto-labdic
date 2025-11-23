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
  <div class="bg-gray-600 min-h-screen flex items-center justify-center">
    <Card class="w-96 mx-auto">
      <template #title>Iniciar Sesión</template>
      <template #content>
        <div class="flex flex-col gap-3">
          <FloatLabel variant="in">
            <InputText id="username" v-model="username" fluid />
            <label for="username">Usuario</label>
          </FloatLabel>
          <FloatLabel variant="in">
            <InputText type="password" id="password" v-model="password" fluid />
            <label for="password">Contraseña</label>
          </FloatLabel>
          <Message v-if="error" severity="error">
            {{ error }}
          </Message>
          <Button @click="handleLogin">Iniciar Sesión</Button>
        </div>
      </template>
    </Card>
  </div>
</template>
