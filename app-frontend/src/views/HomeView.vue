<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { onMounted } from 'vue'

const route = useRoute()
const toast = useToast()

onMounted(() => {
  if (route.query.denied === 'admin') {
    toast.add({
      severity: 'error',
      summary: 'Acceso denegado',
      detail: 'No tienes permisos para acceder a esta página.',
      life: 3000,
    })
  }
})
</script>

<template>
  <div class="home">
    <h1>
      <label class="text-2xl font-bold mb-4">¡Bienvenido a LabDIC Inventory!</label>
    </h1>
    <p class="text-sm text-gray-500 mt-8">© Todos los derechos reservados</p>
    <p class="text-xs text-gray-400 mt-2">Autor: Ariel López S.</p>
    <p class="text-xs text-gray-400 mt-2">Correo electrónico: arilopez@umag.cl | ariellopez.2002@hotmail.com</p>
    <p class="text-xs text-gray-400 mt-2">Contacto: +56 9 4139 4363</p>
    <p class="text-xs text-gray-400 mt-2">Futuro ingeniero</p>
  </div>
</template>
