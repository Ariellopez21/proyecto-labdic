<script setup lang="ts">
import { updateUser, getUserUpdate } from '@/api/users';
import UserUpdateForm from '../components/forms/UserUpdateForm.vue';
import type { UserUpdate } from '@/interfaces';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router'

const router = useRouter()
const toast = useToast()

const route = useRoute()
const userId = Number(route.params.id)
const user: Ref<UserUpdate | null> = ref(null)

async function loadUser() {
  user.value = await getUserUpdate(userId)
}
loadUser()


async function saveUser(editedUser: any) {
  if (!user.value) return
  // Asegura que el id se incluya
  const userToUpdate = { ...editedUser, id: userId }
  await updateUser(userToUpdate)
  loadUser() // Recargar el usuario actualizado
  toast.add({
    severity: 'success',
    summary: 'Éxito',
    detail: 'Usuario actualizado correctamente',
    life: 3000
  })
  await router.push({ name: 'list-users' })
}
</script>

<template>
  <div class="w-1/3 md:mx-auto flex flex-col gap-4">
    <h1 class="text-3xl text-green-500">Actualizar Usuario</h1>
    <UserUpdateForm :user="user" @submit="saveUser" />
  </div>
</template>
