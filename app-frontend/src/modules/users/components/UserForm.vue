<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { NewUserPayload } from '@/types/user.types'
import type { Role } from '@/types/role.types'
import { getRoles } from '@/services/role.service'

interface Props {
  modelValue?: NewUserPayload | null
  submitting?: boolean
  mode?: 'create' | 'edit'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: NewUserPayload): void
  (e: 'submit', value: NewUserPayload): void
  (e: 'cancel'): void
}>()

const toast = useToast()

const form = ref<NewUserPayload>({
  username: '',
  rut: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  isAdmin: false,
  roleIds: [],
})

watch(
  () => props.modelValue,
  (value) => {
    if (value) form.value = { ...value }
  },
  { immediate: true },
)

const disabled     = computed(() => props.submitting ?? false)
const submitLabel  = computed(() => props.mode === 'edit' ? 'Guardar cambios' : 'Crear usuario')

// Roles disponibles
const allRoles     = ref<Role[]>([])
const loadingRoles = ref(false)

async function loadRoles() {
  loadingRoles.value = true
  try {
    allRoles.value = await getRoles()
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error al cargar roles',
      detail: 'No se pudieron cargar los roles disponibles.',
      life: 4000,
    })
  } finally {
    loadingRoles.value = false
  }
}

// Validación — roles ya NO son obligatorios (el backend asigna "usuario" por defecto)
function validateForm(): string | null {
  if (!form.value.username.trim()) return 'El nombre de usuario es obligatorio.'
  if (props.mode !== 'edit' && !form.value.password.trim()) return 'La contraseña es obligatoria.'
  if (!form.value.name.trim())  return 'El nombre es obligatorio.'
  if (!form.value.email.trim()) return 'El correo es obligatorio.'
  return null
}

function onSubmit() {
  const error = validateForm()
  if (error) {
    toast.add({ severity: 'warn', summary: 'Datos incompletos', detail: error, life: 4000 })
    return
  }

  // Enriquecemos los roleIds con nombres.
  // Si no se seleccionó ningún rol, usamos "usuario" por defecto.
  const selectedIds = form.value.roleIds ?? []

  const effectiveIds = selectedIds.length > 0
    ? selectedIds
    : allRoles.value.filter(r => r.name === 'usuario').map(r => r.id)

    const rolesData = effectiveIds
    .map(id => {
      const found = allRoles.value.find(r => r.id === id)
      return found ? { id: found.id, name: found.name } : null
    })
    .filter(Boolean) as { id: number, name: string }[]

  // Calcula is_admin según si el rol "administrador" está entre los seleccionados
  const isAdmin = rolesData.some(r => r.name === 'administrador')
  const payload: NewUserPayload = {
    ...form.value,
    isAdmin,    // campo extra que usa mapUserPayload en user.service.ts
    rolesData,  // campo extra que usa mapUserPayload en user.service.ts
  }

  emit('submit', payload)
  emit('update:modelValue', payload)
}

function onCancel() {
  emit('cancel')
}

onMounted(loadRoles)
</script>

<template>
  <form class="user-form flex flex-col gap-4" @submit.prevent="onSubmit">

    <div class="flex flex-col gap-1">
      <label for="username" class="font-medium">Usuario</label>
      <InputText id="username" v-model.trim="form.username" autocomplete="off" :disabled="disabled" />
    </div>

    <div class="flex flex-col gap-1">
      <label for="name" class="font-medium">Nombre</label>
      <InputText id="name" v-model.trim="form.name" autocomplete="off" :disabled="disabled" />
    </div>

    <div class="flex flex-col gap-1">
      <label for="rut" class="font-medium">RUT</label>
      <InputText id="rut" v-model.trim="form.rut" autocomplete="off" placeholder="12.345.678-9" :disabled="disabled" />
    </div>

    <div class="flex flex-col gap-1">
      <label for="email" class="font-medium">Correo electrónico</label>
      <InputText id="email" v-model.trim="form.email" type="email" autocomplete="off" :disabled="disabled" />
    </div>

    <div class="flex flex-col gap-1">
      <label for="phone" class="font-medium">Teléfono</label>
      <InputText id="phone" v-model.trim="form.phone" autocomplete="off" placeholder="+56 9 ..." :disabled="disabled" />
    </div>

    <div class="flex flex-col gap-1">
      <label for="address" class="font-medium">Dirección</label>
      <InputText id="address" v-model.trim="form.address" autocomplete="off" :disabled="disabled" />
    </div>

    <div v-if="mode !== 'edit'" class="flex flex-col gap-1">
      <label for="password" class="font-medium">Contraseña</label>
      <Password id="password" v-model.trim="form.password" :feedback="false" toggleMask :disabled="disabled" />
    </div>

    <!-- Roles (opcionales — el backend asigna "usuario" si no se selecciona ninguno) -->
    <div class="flex flex-col gap-1">
      <label class="font-medium">Roles</label>
      <MultiSelect
        v-model="form.roleIds"
        :options="allRoles"
        optionLabel="name"
        optionValue="id"
        placeholder="Selecciona roles (opcional)"
        display="chip"
        class="w-full"
        :loading="loadingRoles"
      />
      <small class="text-muted-color">
        Si no seleccionas ninguno, se asignará el rol "usuario" por defecto.
      </small>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-2 mt-2">
      <Button type="button" label="Cancelar" severity="secondary" text :disabled="disabled" @click="onCancel" />
      <Button type="submit" :label="submitLabel" icon="pi pi-check" :loading="disabled" />
    </div>

  </form>
</template>

<style scoped>
</style>
