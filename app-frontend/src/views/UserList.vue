<script setup lang="ts">
import { getUsers, deleteUser } from '@/api/users'
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
function createUser() {
  router.push({ name: 'new-user' })
}
function editUser(u: User) {
  router.push({
    name: 'update-user',    // nombre de la ruta que ya definimos en el router
    params: { id: u.id },   // pasamos el id en la URL
  })
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
              <div class="app-name">Usuarios</div>
              <div class="app-sub">Gestiona los usuarios del sistema</div>
            </div>
          </div>
        </template>

        <template #content>
          <div class="mb-4 flex justify-between items-center">
            <div class="text-sm text-slate-300">{{ user.name === null ? 'Sin Nombre' : user.name + ' - ' + user.isAdmin }}</div>
            <div v-if="user.canManageUsers">
              <Button severity="primary" outlined @click="createUser" class="gap-3">
                <i class="pi pi-plus"></i>
                Nuevo Usuario
              </Button>
            </div>
          </div>

          <DataTable :value="users" :loading="loading" dataKey="id">
            <Column field="username" header="Usuario" />
            <Column field="name" header="Nombre" />
            <Column field="phone" header="Teléfono" />

            <Column header="Acciones" :exportable="false">
              <template #body="slotProps">
                <Button
                icon="pi pi-info-circle"
                rounded text severity="info"
                @click="viewDetails(slotProps.data)" />

                <Button v-if ="user.canManageUsers"
                icon="pi pi-pencil"
                rounded text severity="secondary"
                @click="editUser(slotProps.data)" />

                <Button v-if ="user.canManageUsers"
                icon="pi pi-trash"
                rounded text severity="danger"
                @click="confirmDeleteUser(slotProps.data)" />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <UserDetailsDialog v-model="showDialogDetails" :user="selectedUserDetails" />
      <UserDeleteConfirmDialog v-model="showDeleteDialog" :user="userToDelete" @confirm="deleteUserHere" />
    </div>
  </div>
</template>

<style scoped>
.login-root{ min-height: 100vh; display:flex; align-items:flex-start; justify-content:center; background: linear-gradient(180deg, #0f172a 0%, #0b1220 100%); padding:2rem }
.login-container{ width:100%; max-width:1100px }
.login-card{ padding:1rem; border-radius:12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 8px 30px rgba(2,6,23,0.6); color: #e6eef8 }
.title-row{ display:flex; align-items:center; gap:0.75rem; margin-bottom:0.5rem; }
.logo{ width:36px; height:36px; border-radius:8px; background:linear-gradient(135deg,#4f46e5,#06b6d4); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; }
.app-name{ color: #fff; font-weight:600 }
.app-sub{ color: rgba(255,255,255,0.7); font-size:0.85rem }
@media (max-width:1024px){ .login-container{ padding:0 1rem } }
@media (max-width:640px){ .login-container{ padding:0 0.5rem } .login-root{ align-items:center } }
</style>
