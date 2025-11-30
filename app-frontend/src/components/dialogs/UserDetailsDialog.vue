<!-- src/components/dialogs/UserDetailsDialog.vue -->
<script setup lang="ts">
import type { User } from '@/interfaces/User'

interface Props {
  modelValue: boolean
  user: User | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// Puente entre la prop modelValue y el v-model interno del Dialog
const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

function close() {
  visible.value = false // esto dispara el emit automáticamente
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Detalles del usuario"
    :style="{ width: '450px' }"
  >
    <div v-if="user" class="flex flex-col gap-2">
      <div>
        <span class="font-bold">Usuario:</span>
        <span class="ml-2">{{ user.username }}</span>
      </div>
      <div>
        <span class="font-bold">Nombre:</span>
        <span class="ml-2">{{ user.name }}</span>
      </div>
      <div>
        <span class="font-bold">Teléfono:</span>
        <span class="ml-2">{{ user.phone }}</span>
      </div>
      <div>
        <span class="font-bold">RUT:</span>
        <span class="ml-2">{{ user.rut }}</span>
      </div>
      <div>
        <span class="font-bold">Correo:</span>
        <span class="ml-2">{{ user.email }}</span>
      </div>
      <div>
        <span class="font-bold">Dirección:</span>
        <span class="ml-2">{{ user.address }}</span>
      </div>
      <div>
        <span class="font-bold">Roles:</span>
        <span class="ml-2">
          <span
            v-if="user.roles && user.roles.length"
            class="inline-flex flex-wrap gap-2 align-middle"
          >
            <span
              v-for="role in user.roles"
              :key="role.id"
              class="inline-flex items-center px-2.5 py-1 rounded-full
                    bg-sky-700/60 text-sky-100 text-xs font-medium border border-sky-400/70"
            >
              {{ role.name }}
            </span>
          </span>
          <span v-else class="italic text-slate-400">
            Sin roles asignados
          </span>
        </span>
      </div>
      <div>
        <span class="font-bold">Estado:</span>
        <span class="ml-2">
          {{ user.isActive ? 'Activo' : 'Inactivo' }}
        </span>
      </div>
      <div>
        <span class="font-bold">Creado:</span>
        <span class="ml-2">
          {{ user.createdAt.toLocaleString() }}
        </span>
      </div>
    </div>

    <template #footer>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        text
        @click="close"
      />
    </template>
  </Dialog>
</template>
