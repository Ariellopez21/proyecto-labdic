<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ status: string }>()

const config = computed(() => {
  switch (props.status.toLowerCase()) {
    case 'available':
      return { label: 'Disponible',     severity: 'success' }
    case 'borrowed':
      return { label: 'Prestado',        severity: 'warning' }
    case 'under_maintenance':
      return { label: 'En mantención',   severity: 'danger'  }
    case 'pending':
      return { label: 'Pendiente',       severity: 'info'    }
    case 'approved':
      return { label: 'Aprobado',        severity: 'success' }
    case 'rejected':
      return { label: 'Rechazado',       severity: 'danger'  }
    case 'returned':
      return { label: 'Devuelto',        severity: 'secondary' }
    default:
      return { label: props.status,      severity: 'secondary' }
  }
})
</script>

<template>
  <Tag :value="config.label" :severity="config.severity" />
</template>
