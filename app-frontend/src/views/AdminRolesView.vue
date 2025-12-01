<!-- src/views/AdminRolesView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Card from 'primevue/card'
import type { Role } from '@/interfaces/Role'
import { getRoles, createRole, updateRole, deleteRole } from '@/api/roles'

const toast = useToast()

const roles = ref<Role[]>([])
const loading = ref(false)

const form = ref<Omit<Role, 'id'> & { id?: number }>({
  id: undefined,
  name: '',
  description: '',
})

const isEditing = ref(false)
const saving = ref(false)

async function loadRoles() {
  loading.value = true
  try {
    roles.value = await getRoles()
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los roles.',
      life: 4000,
    })
  } finally {
    loading.value = false
  }
}

function startCreate() {
  isEditing.value = false
  form.value = {
    id: undefined,
    name: '',
    description: '',
  }
}

function startEdit(role: Role) {
  isEditing.value = true
  form.value = {
    id: role.id,
    name: role.name,
    description: role.description,
  }
}

async function submit() {
  saving.value = true
  try {
    if (isEditing.value && form.value.id != null) {
      const updated = await updateRole(form.value.id, {
        name: form.value.name,
        description: form.value.description,
      })
      roles.value = roles.value.map((r) =>
        r.id === updated.id ? updated : r,
      )
      toast.add({
        severity: 'success',
        summary: 'Rol actualizado',
        detail: 'El rol fue actualizado correctamente.',
        life: 3000,
      })
    } else {
      const created = await createRole({
        name: form.value.name,
        description: form.value.description,
      })
      roles.value.push(created)
      toast.add({
        severity: 'success',
        summary: 'Rol creado',
        detail: 'El rol fue creado correctamente.',
        life: 3000,
      })
    }
    startCreate()
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error al guardar',
      detail: 'No se pudo guardar el rol.',
      life: 4000,
    })
  } finally {
    saving.value = false
  }
}

async function remove(role: Role) {
  if (!confirm(`¿Eliminar el rol "${role.name}"?`)) return

  try {
    await deleteRole(role.id)
    roles.value = roles.value.filter((r) => r.id !== role.id)
    toast.add({
      severity: 'success',
      summary: 'Rol eliminado',
      detail: 'El rol fue eliminado correctamente.',
      life: 3000,
    })
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error al eliminar',
      detail: 'No se pudo eliminar el rol.',
      life: 4000,
    })
  }
}

onMounted(() => {
  loadRoles()
  startCreate()
})
</script>

<template>
  <div class="min-h-screen page-root flex items-center justify-center px-4">
    <div class="w-full max-w-7xl grid md:grid-cols-2 gap-8">
      <!-- Lista de roles -->
      <Card class="card-panel shadow-xl rounded-2xl">
        <template #header>
          <div class="px-6 pt-6">
            <h2 class="text-xl font-semibold">Roles existentes</h2>
            <p class="text-sm text-slate-300 mt-1">
              Gestiona los roles disponibles en el sistema.
            </p>
          </div>
        </template>

        <template #content>
          <DataTable
            :value="roles"
            :loading="loading"
            dataKey="id"
            class="px-4 pb-4"
          >
            <Column field="name" header="Nombre" />
            <Column field="description" header="Descripción" />
            <Column header="Acciones" :exportable="false">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  rounded
                  text
                  severity="secondary"
                  class="mr-1"
                  @click="startEdit(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  @click="remove(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- Formulario crear/editar -->
      <Card class="card-panel shadow-xl rounded-2xl">
        <template #header>
          <div class="px-6 pt-6 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold">
                {{ isEditing ? 'Editar rol' : 'Crear rol' }}
              </h2>
              <p class="text-sm text-slate-300 mt-1">
                Define el nombre y la descripción del rol.
              </p>
            </div>
            <Button
              v-if="isEditing"
              label="Nuevo"
              icon="pi pi-plus"
              text
              class="text-sm"
              @click="startCreate"
            />
          </div>
        </template>

        <template #content>
          <div class="px-6 pb-6 pt-2 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-200 mb-1">
                Nombre
              </label>
              <InputText
                v-model="form.name"
                class="w-full"
                placeholder="Ej: Administrador"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-200 mb-1">
                Descripción
              </label>
              <Textarea
                v-model="form.description"
                class="w-full"
                rows="3"
                auto-resize
              />
            </div>
          </div>
        </template>

        <template #footer>
          <div class="px-6 pb-4 flex justify-end gap-2">
            <Button
              label="Guardar"
              icon="pi pi-check"
              :loading="saving"
              @click="submit"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
/* Use the app-level background variables so the page is "sin color" (white or black via prefers-color-scheme) */
.page-root{ min-height:100vh; display:flex; align-items:center; justify-content:center; background: linear-gradient(180deg, var(--bg-top) 0%, var(--bg-bottom) 100%); padding:2rem }

/* Card appearance: transparent background, subtle border that adapts to color scheme */
.card-panel{ background: transparent; color: inherit; padding: 0; }
.card-panel .p-card { background: transparent; box-shadow: none; }
.card-panel { border-radius: 1rem; }
.card-panel { border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 8px 30px rgba(2,6,23,0.06); }

@media (prefers-color-scheme: dark) {
  .card-panel { border: 1px solid rgba(255,255,255,0.04); box-shadow: 0 8px 30px rgba(2,6,23,0.6); }
}

/* Make inner content breathe more on wide screens */
.w-full.max-w-7xl { max-width: 80rem }

/* Maintain good spacing on mobile */
@media (max-width: 768px) {
  .page-root { padding: 1rem }
  .grid { gap: 1rem }
}

</style>
