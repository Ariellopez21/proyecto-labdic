<script setup lang="ts">
import { getUsers, deleteUser, getUser } from '@/api/users'
import type { User } from '@/interfaces/User'
import { ref, type Ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'
import UserDetailsDialog from '@/components/dialogs/UserDetailsDialog.vue'
import UserDeleteConfirmDialog from '@/components/dialogs/UserDeleteConfirmDialog.vue'

/* =============== STORES =============== */
const user = useUserStore()

/* =============== ROUTER =============== */
const router = useRouter()

/* =============== TOAST =============== */
const toast = useToast()

/* =============== LOAD USERS =============== */
const loading = ref(false)
const users: Ref<User[]> = ref([])
async function loadUsers() {
  loading.value = true
  try{
    users.value = await getUsers()
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Error al cargar',
      detail: 'No se pudieron cargar los usuarios. Intenta nuevamente.',
      life: 4000,
    })
  } finally {
    loading.value = false
  }
}

/* =============== VIEW DETAILS =============== */
const showDialogDetails = ref(false)
const selectedUserDetails: Ref<User | null> = ref(null)

async function viewDetails(user: User) {
  selectedUserDetails.value = user
  showDialogDetails.value = true
}

/* =============== DELETE USERS =============== */
const showDeleteDialog = ref(false)
const userToDelete: Ref<User | null> = ref(null) // Este usuario se selecciona en <template>.

function confirmDeleteUser(user: User) {
  userToDelete.value = user
  showDeleteDialog.value = true
}

async function deleteUserHere() {
  if (!userToDelete.value) return

  try {
    await deleteUser(userToDelete.value.id)
    // actualizas la lista en memoria
    users.value = users.value.filter(
      u => u.id !== userToDelete.value!.id
    )

    toast.add({
      severity: 'success',
      summary: 'Usuario eliminado',
      detail: `Se eliminó a ${userToDelete.value.username}`,
      life: 3000,
    })
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Error al eliminar',
      detail: 'No se pudo eliminar el usuario.',
      life: 4000,
    })
  } finally {
    showDeleteDialog.value = false
    userToDelete.value = null
  }
}

/* =============== ON MOUNTED =============== */
onMounted(() => {
  loadUsers()
})

/* =============== PUSH FUNCTIONS =============== */
async function createUser() {
  await router.push({ name: 'new-user' })
}
function editUser(u: User) {
  router.push({
    name: 'update-user',    // nombre de la ruta que ya definimos en el router
    params: { id: u.id },   // pasamos el id en la URL
  })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end" v-if="user.name == 'admin'">
      <Button severity="primary" outlined @click="createUser" class="mb-4 gap-3 ">
        <i class="pi pi-plus"></i>
        Nuevo Usuario
      </Button>
    </div>
    <div>{{ user.name === null ? 'Sin Nombre' : user.name + ' - ' + user.isAdmin }}</div>
    <DataTable :value="users" :loading="loading" dataKey="id">
      <Column field="username" header="Usuario" />
      <Column field="name" header="Nombre" />
      <Column field="phone" header="Teléfono" />

        <!-- Columna de acciones / info -->
        <Column header="Acciones" :exportable="false">
          <template #body="slotProps">
            <!-- Botón de info -->
            <Button
              icon="pi pi-info-circle"
              rounded
              text
              severity="info"
              @click="viewDetails(slotProps.data)"
            />
            <!-- Botón de editar -->
            <Button
              icon="pi pi-pencil"
              rounded
              text
              severity="secondary"
              @click="editUser(slotProps.data)"
            />
            <!-- Botón de eliminar -->
            <Button v-if ="user.name == 'admin'"
              icon="pi pi-trash"
              rounded
              text
              severity="danger"
              @click="confirmDeleteUser(slotProps.data)"
            />

          </template>
        </Column>
    </DataTable>
  </div>

  <UserDetailsDialog
  v-model="showDialogDetails"
  :user="selectedUserDetails"
  />

  <UserDeleteConfirmDialog
  v-model="showDeleteDialog"
  :user="userToDelete"
  @confirm="deleteUserHere"
  />
</template>
