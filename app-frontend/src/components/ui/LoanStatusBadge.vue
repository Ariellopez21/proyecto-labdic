<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ status: string }>()

const config = computed(() => {
  switch (props.status.toLowerCase()) {
    case 'pending':
      return { label: 'Pendiente',   severity: 'warn',      icon: 'pi pi-clock' }
    case 'approved':
      return { label: 'Aprobado',    severity: 'success',   icon: 'pi pi-check-circle' }
    case 'rejected':
      return { label: 'Rechazado',   severity: 'danger',    icon: 'pi pi-times-circle' }
    case 'delivered':
      return { label: 'Entregado',   severity: 'info',      icon: 'pi pi-send' }
    case 'returned':
      return { label: 'Devuelto',    severity: 'secondary', icon: 'pi pi-undo' }
    default:
      return { label: props.status,  severity: 'secondary', icon: 'pi pi-circle' }
  }
})
</script>

<template>
  <Tag :value="config.label" :severity="config.severity" />
</template>
