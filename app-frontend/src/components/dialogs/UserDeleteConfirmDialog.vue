<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/interfaces/User'

interface Props {
  modelValue: boolean
  user: User | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

// puente del v-model
const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

function close() {
  visible.value = false
}

function confirm() {
  emit('confirm')
  close()
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Confirmar eliminación"
    :style="{ width: '420px' }"
  >
    <div v-if="user">
      ¿Seguro que deseas eliminar al usuario
      <b>{{ user.username }}</b>?
      <br />
      Esta acción no se puede deshacer.
    </div>

    <template #footer>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        text
        @click="close"
      />
      <Button
        label="Eliminar"
        icon="pi pi-trash"
        severity="danger"
        @click="confirm"
      />
    </template>
  </Dialog>
</template>
