<script setup lang="ts">
import { getUsers, getUser, deleteUser } from '@/api/users'
import type { User } from '../interfaces'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const router = useRouter()
const user = useUserStore()

const showDialogDetails = ref(false)
const selectedUserDetails = ref<User | null>(null)

// Dialog de confirmación para eliminar
const showDeleteDialog = ref(false)
const userToDelete = ref<User | null>(null)

/* LOAD USERS */
const users: Ref<User[]> = ref([])
async function loadUsers() {
  users.value = await getUsers()
}
loadUsers()

/* DIALOGS */
async function viewDetails(id: number) {
  selectedUserDetails.value = await getUser(id)
  showDialogDetails.value = true
}

  /* PUSH FUNCTIONS */
async function createUser() {
  await router.push({ name: 'new-user' })
}
async function editUser(id: number) {
  await router.push({ name: 'update-user', params: { id } })
}

function confirmDeleteUser(id: number) {
  const user = users.value.find(u => u.id === id)
  userToDelete.value = user || null
  showDeleteDialog.value = true
}


async function deleteUserHere() {
  if (!userToDelete.value) return

    await deleteUser(userToDelete.value.id)
    showDeleteDialog.value = false
    userToDelete.value = null
    selectedUserDetails.value = null
    await loadUsers()

    toast.add({
      severity: 'success',
      summary: 'Eliminado',
      detail: 'Usuario eliminado correctamente',
      life: 3000
    })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end" v-if="user.isAdmin">
      <Button severity="primary" outlined @click="createUser" class="mb-4 gap-3 ">
        <i class="pi pi-plus"></i>
        Nuevo Usuario
      </Button>
    </div>
    <div>{{ user.name === null ? 'Sin Nombre' : user.name + ' - ' + user.isAdmin }}</div>
    <DataTable v-if="users.length > 0" :value="users">
      <Column field="rut" header="RUT" />
      <Column field="username" header="Usuario" />
      <Column field="name" header="Nombre" />
      <Column field="email" header="Correo Electrónico" />
      <Column field="phone" header="Teléfono" />
      <Column>
        <template #body="slotProps">
          <div class="flex gap-4 justify-end">
          <button
            @click="viewDetails(slotProps.data.id)"

            title="Ver detalles"
          >
            <i class="pi pi-info-circle" style="color:blue; font-size:1.2rem;"></i>
          </button>
          <button
            @click="editUser(slotProps.data.id)"
            title="Editar Usuario"
          >
            <i class="pi pi-pencil" style="color:orange; font-size:1.2rem;"></i>
          </button>
          <button
            @click="confirmDeleteUser(slotProps.data.id)"
            title="Eliminar Usuario"
          >
            <i class="pi pi-trash" style="color:red; font-size:1.2rem;"></i>
          </button>
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog Confirmar Eliminación -->
    <Dialog v-model:visible="showDeleteDialog" header="Confirmar Eliminación" :modal="true" :closable="false" style="min-width:350px;">
      <template v-if="userToDelete">
        <div class="mb-4">¿Estás seguro que deseas eliminar al usuario <b>{{ userToDelete.username }}</b>?</div>
        <div class="flex justify-end gap-2">
          <Button label="Cancelar" @click="showDeleteDialog = false" severity="secondary" />
          <Button label="Aceptar" @click="deleteUserHere" severity="danger" />
        </div>
      </template>
    </Dialog>

    <!-- User Details Dialog -->
    <Dialog v-model:visible="showDialogDetails" header="Detalles del Usuario" :modal="true" :closable="true" style="min-width:350px;">
      <template v-if="selectedUserDetails">
        <div> <b>ID: </b>{{ selectedUserDetails.id }}</div>
        <div><b>RUT:</b> {{ selectedUserDetails.rut }}</div>
        <div><b>Nombre:</b> {{ selectedUserDetails.name }}</div>
        <div><b>Usuario:</b> {{ selectedUserDetails.username }}</div>
        <div><b>Email:</b> {{ selectedUserDetails.email }}</div>
        <div><b>Teléfono:</b> {{ selectedUserDetails.phone }}</div>
        <div><b>Dirección:</b> {{ selectedUserDetails.address }}</div>
        <div><b>Fecha de Creación:</b> {{ selectedUserDetails.createdAt }}</div>
        <div class="flex justify-end mt-4">
          <Button label="Cerrar" @click="showDialogDetails = false" />
        </div>
      </template>
      <template v-else>
        <div>Loading...</div>
      </template>
    </Dialog>

  </div>
</template>
