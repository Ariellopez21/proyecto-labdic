<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { NewUserPayload } from '@/interfaces/User'
import type { Role } from '@/interfaces/Role'
import { getRoles } from '@/api/roles'

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

// Modelo local del formulario
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

// Si nos pasan un valor inicial (para editar), lo copiamos
watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      form.value = { ...value }
    }
  },
  { immediate: true },
)

const disabled = computed(() => props.submitting ?? false)
const submitLabel = computed(() =>
  props.mode === 'edit' ? 'Guardar cambios' : 'Crear usuario',
)

// Validación mínima
function validateForm(): string | null {
  if (!form.value.username.trim()) return 'El nombre de usuario es obligatorio.'
  if (props.mode !== 'edit' && !form.value.password.trim()) {
    return 'La contraseña es obligatoria.'
  }  if (!form.value.name.trim()) return 'El nombre es obligatorio.'
  if (!form.value.email.trim()) return 'El correo es obligatorio.'
  return null
}

const allRoles = ref<Role[]>([])
const loadingRoles = ref(false)

async function loadRoles() {
  loadingRoles.value = true
  try {
    allRoles.value = await getRoles()
    //console.log(`Roles cargados en ${props.mode === 'edit' ? 'Update' : 'Create'}:`, allRoles.value)
  } catch (err) {
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

function onSubmit() {
  const error = validateForm()
  if (error) {
    toast.add({
      severity: 'warn',
      summary: 'Datos incompletos',
      detail: error,
      life: 4000,
    })
    return
  }

  emit('submit', form.value)
  emit('update:modelValue', form.value)
}

function onCancel() {
  emit('cancel')
}

onMounted(() => {
  loadRoles()
})
</script>

<template>
  <form class="user-form flex flex-col gap-4" @submit.prevent="onSubmit">
    <!-- Username -->
    <div class="flex flex-col gap-1">
      <label for="username" class="font-medium">Usuario</label>
      <InputText
        id="username"
        v-model.trim="form.username"
        autocomplete="off"
        :disabled="disabled"
      />
    </div>

    <!-- Nombre completo -->
    <div class="flex flex-col gap-1">
      <label for="name" class="font-medium">Nombre</label>
      <InputText
        id="name"
        v-model.trim="form.name"
        autocomplete="off"
        :disabled="disabled"
      />
    </div>

    <!-- RUT -->
    <div class="flex flex-col gap-1">
      <label for="rut" class="font-medium">RUT</label>
      <InputText
        id="rut"
        v-model.trim="form.rut"
        autocomplete="off"
        placeholder="12.345.678-9"
        :disabled="disabled"
      />
    </div>

    <!-- Email -->
    <div class="flex flex-col gap-1">
      <label for="email" class="font-medium">Correo electrónico</label>
      <InputText
        id="email"
        v-model.trim="form.email"
        type="email"
        autocomplete="off"
        :disabled="disabled"
      />
    </div>

    <!-- Teléfono -->
    <div class="flex flex-col gap-1">
      <label for="phone" class="font-medium">Teléfono</label>
      <InputText
        id="phone"
        v-model.trim="form.phone"
        autocomplete="off"
        placeholder="+56 9 ..."
        :disabled="disabled"
      />
    </div>

    <!-- Dirección -->
    <div class="flex flex-col gap-1">
      <label for="address" class="font-medium">Dirección</label>
      <InputText
        id="address"
        v-model.trim="form.address"
        autocomplete="off"
        :disabled="disabled"
      />
    </div>

    <!-- Contraseña -->
    <div v-if="mode !== 'edit'" class="flex flex-col gap-1">
      <label for="password" class="font-medium">Contraseña</label>
        <Password
          id="password"
          v-model.trim="form.password"
          :feedback="false"
          toggleMask
          :disabled="disabled"
       />
    </div>

    <!-- Roles -->
    <div class="mt-3">
      <label class="block text-sm font-medium text-slate-200 mb-1">
        Roles
      </label>
      <MultiSelect
        v-model="form.roleIds"
        :options="allRoles"
        optionLabel="name"
        optionValue="id"
        placeholder="Roles del usuario"
        display="chip"
        class="w-full"
        :loading="loadingRoles"
      />
      <p class="mt-1 text-xs text-slate-400">
        Por defecto, si no seleccionas nada, el backend asignará el rol "Usuario".
      </p>
    </div>

    <!-- Es admin -->
    <div class="flex items-center gap-2 mt-2">
      <Checkbox
        inputId="isAdmin"
        v-model="form.isAdmin"
        :binary="true"
        :disabled="disabled"
      />
      <label for="isAdmin">Es administrador</label>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-2 mt-4">
      <Button
        type="button"
        label="Cancelar"
        severity="secondary"
        text
        :disabled="disabled"
        @click="onCancel"
      />
      <Button
        type="submit"
        :label="submitLabel"
        icon="pi pi-check"
        :loading="disabled"
      />
    </div>
  </form>
</template>

<style scoped>
.user-form{ color: #e6eef8 }
.user-form label{ color: rgba(255,255,255,0.85) }
.user-form >>> .p-inputtext, .user-form >>> .p-password input{ background: rgba(255,255,255,0.02); color: #fff }
.user-form >>> .p-button{ border-radius:8px }
.user-form .p-checkbox-box{ border-radius:4px }
@media (max-width:640px){ .user-form{ padding:0.25rem } }
</style>
