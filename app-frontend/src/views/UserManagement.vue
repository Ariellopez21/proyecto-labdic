<script setup lang="ts">
import { getUsers, getUser, getUserUpdate, updateUser } from '@/api/users'
import type { User, UserUpdate } from '../interfaces'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Dialog from 'primevue/dialog'

const router = useRouter()
const user = useUserStore()
const emit = defineEmits(['submit'])

/* UPDATE VALUES */
const rut = ref('')
const username = ref('')
const name = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')

/* LOAD USERS */
const users: Ref<User[]> = ref([])
async function loadUsers() {
  users.value = await getUsers()
}
loadUsers()

/* DIALOGS */
const showDialogDetails = ref(false)
const showDialogUpdate = ref(false)
const selectedUserDetails = ref<User | null>(null)
const selectedUserUpdate = ref<UserUpdate | null>(null)

async function viewDetails(id: number) {
  selectedUserDetails.value = await getUser(id)
  showDialogDetails.value = true
}

/* DIALOG UPDATE WITH EMIT */
async function updateUser(id: number) {
  selectedUserUpdate.value = await getUserUpdate(id)

  username.value = selectedUserUpdate.value.username ?? ''
  name.value = selectedUserUpdate.value.name ?? ''
  email.value = selectedUserUpdate.value.email ?? ''
  phone.value = selectedUserUpdate.value.phone ?? ''
  address.value = selectedUserUpdate.value.address ?? ''
  rut.value = selectedUserUpdate.value.rut ?? ''

  showDialogUpdate.value = true
}
async function handleSubmit() {
  emit('submit', {
    username: username.value,
    name: name.value,
    email: email.value,
    phone: phone.value,
    address: address.value,
    rut: rut.value,
  })
}

  /* PUSH FUNCTIONS */
async function createUser() {
  await router.push({ name: 'new-user' })
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
            @click="updateUser(slotProps.data.id)"

            title="Editar Usuario"
          >
            <i class="pi pi-pencil" style="color:orange; font-size:1.2rem;"></i>
          </button>
          <button
            @click="viewDetails(slotProps.data.id)"

            title="Eliminar Usuario"
          >
            <i class="pi pi-trash" style="color:red; font-size:1.2rem;"></i>
          </button>
          </div>
        </template>
      </Column>
    </DataTable>

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
        <div><b>Activo:</b> {{ selectedUserDetails.isActive ? 'Sí' : 'No' }}</div>
        <div class="flex justify-end mt-4">
          <Button label="Cerrar" @click="showDialogDetails = false" />
        </div>
      </template>
      <template v-else>
        <div>Loading...</div>
      </template>
    </Dialog>

    <!-- User Update Dialog  -->
        <Dialog v-model:visible="showDialogUpdate" header="Detalles del Usuario" :modal="true" :closable="true" style="min-width:350px;">
          <template v-if="selectedUserUpdate">
              <div class="flex flex-col gap-3">
                <FloatLabel variant="in">
                  <InputText id="username" v-model="username" />
                  <label for="username">Username</label>
                </FloatLabel>
                <FloatLabel variant="in">
                  <InputText id="name" v-model="name" />
                  <label for="name">Nombre</label>
                </FloatLabel>
                <FloatLabel variant="in">
                  <InputText id="email" v-model="email" />
                  <label for="email">Email</label>
                </FloatLabel>
                <FloatLabel variant="in">
                  <InputText id="phone" v-model="phone" />
                  <label for="phone">Teléfono</label>
                </FloatLabel>
                <FloatLabel variant="in">
                  <InputText id="address" v-model="address" />
                  <label for="address">Dirección</label>
                </FloatLabel>
                <FloatLabel variant="in">
                  <InputText id="rut" v-model="rut" />
                  <label for="rut">RUT</label>
                </FloatLabel>
              </div>

              <div class="flex gap-4 justify-end mt-4">
                  <Button label="Guardar" severity="primary" @click="handleSubmit" />
                  <Button label="Cerrar" severity="secondary" @click="showDialogUpdate = false" />
              </div>
          </template>
          <template v-else>
            <div>Loading...</div>
          </template>
    </Dialog>

  </div>
</template>
