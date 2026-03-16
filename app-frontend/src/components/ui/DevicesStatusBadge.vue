<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ status: string }>()

const config = computed(() => {
  switch (props.status.toLowerCase()) {
    case 'disponible':
      return { label: 'Disponible',    severity: 'success' }
    case 'prestado':
      return { label: 'Prestado',      severity: 'warn' }
    case 'en_mantenimiento':
      return { label: 'En mantención', severity: 'danger'  }
    case 'devuelto':
      return { label: 'Devuelto',      severity: 'secondary' }
    default:
      return { label: props.status,    severity: 'secondary' }
  }
})
</script>

<template>
  <Tag :value="config.label" :severity="config.severity" />
</template>
