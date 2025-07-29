<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'

import { useTodoStore } from '@/stores/todos'

import type { Todo } from '@/interfaces/todolist'

interface Props {
  todo: Todo
}

interface Emits {
  (e: 'editTodo', todoId: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const todoStore = useTodoStore()

const confirm = useConfirm()

async function handleDeleteTodo(todoId: number) {
  confirm.require({
    message: '¿Estás seguro de que quieres eliminar esta tarea?',
    acceptProps: {
      label: 'Eliminar',
      severity: 'danger',
    },
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
    },
    accept: async () => {
      await todoStore.removeTodo(todoId)
    },
  })
}

function handleEditTodo(todoId: number) {
  emit('editTodo', todoId)
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-3">
          <Checkbox
            :model-value="todo.completed" class="scale-110"
            binary
            @update:model-value="todoStore.toggleTodoComplete(todo.id)"
          />
          <h3
            class="text-lg font-semibold text-gray-900 flex-1"
            :class="{ 'line-through text-gray-500': todo.completed }"
          >
            {{ todo.title }}
          </h3>
          <span
            :class="todo.completed
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-amber-100 text-amber-800 border border-amber-200'
            " class="px-3 py-1 rounded-full text-xs font-medium"
          >
            {{ todo.completed ? 'Completada' : 'Pendiente' }}
          </span>
        </div>

        <p v-if="todo.description" class="text-gray-600 mb-3" :class="{ 'line-through text-gray-400': todo.completed }">
          {{ todo.description }}
        </p>

        <div v-if="todo.categories.length > 0" class="flex flex-wrap gap-2">
          <span
            v-for="category in todo.categories" :key="category.id"
            class="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium border border-blue-200"
          >
            {{ category.name }}
          </span>
        </div>
      </div>

      <div class="flex gap-2 ml-4">
        <Button
          icon="pi pi-pencil" severity="secondary" size="small" class="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
          @click="handleEditTodo(todo.id)"
        />
        <Button
          icon="pi pi-trash" severity="danger" size="small" class="bg-red-100 hover:bg-red-200 text-red-700 border-red-300"
          @click="handleDeleteTodo(todo.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
