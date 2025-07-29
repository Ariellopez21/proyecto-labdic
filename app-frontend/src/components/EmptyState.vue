<script setup lang="ts">
interface Props {
  filter: 'all' | 'pending' | 'completed'
}

interface Emits {
  (e: 'createTodo'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
    <div class="max-w-sm mx-auto">
      <i class="pi pi-inbox text-gray-400 text-5xl mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        No hay tareas
        {{ filter === 'all' ? '' : filter === 'pending' ? 'pendientes' : 'completadas' }}
      </h3>
      <p class="text-gray-600 mb-6">
        {{
          filter === 'all'
            ? '¡Comienza creando tu primera tarea!'
            : filter === 'pending'
              ? 'Todas las tareas están completadas. ¡Buen trabajo!'
              : 'No hay tareas completadas aún.'
        }}
      </p>
      <Button
        v-if="filter === 'all'"
        icon="pi pi-plus"
        label="Crear Primera Tarea"
        class="bg-blue-600 hover:bg-blue-700 border-blue-600"
        @click="emit('createTodo')"
      />
    </div>
  </div>
</template>
