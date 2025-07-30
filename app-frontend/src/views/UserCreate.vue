<script setup lang="ts">
import { createUser } from '@/api/users';
import UserForm from '../components/forms/UserForm.vue';
import type { UserCreate } from '@/interfaces';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const router = useRouter()
const toast = useToast()

async function saveUser(user: UserCreate) {
  await createUser(user)
  toast.add({
    severity: 'success',
    summary: 'Éxito',
    detail: 'Usuario creado correctamente',
    life: 3000
  })
  await router.push({ name: 'list-users' })
}
</script>

<template>
  <div class="w-1/3 md:mx-auto flex flex-col gap-4">
    <h1 class="text-3xl text-green-500">Nuevo Usuario</h1>
    <UserForm @submit="saveUser" />
  </div>
</template>
