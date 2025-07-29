<script setup lang="ts">
import { useTodoStore } from '@/stores/todos'

const todoStore = useTodoStore()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card class="shadow-sm border border-gray-200">
      <template #content>
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">
              Total de tareas
            </p>
            <p class="text-2xl font-bold text-gray-900">
              {{ todoStore.todos.length }}
            </p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <i class="pi pi-list text-blue-600 text-xl" />
          </div>
        </div>
      </template>
    </Card>

    <Card class="shadow-sm border border-gray-200">
      <template #content>
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">
              Pendientes
            </p>
            <p class="text-2xl font-bold text-amber-600">
              {{ todoStore.pendingTodos.length }}
            </p>
          </div>
          <div class="p-3 bg-amber-100 rounded-lg">
            <i class="pi pi-clock text-amber-600 text-xl" />
          </div>
        </div>
      </template>
    </Card>

    <Card class="shadow-sm border border-gray-200">
      <template #content>
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">
              Completadas
            </p>
            <p class="text-2xl font-bold text-green-600">
              {{ todoStore.completedTodos.length }}
            </p>
          </div>
          <div class="p-3 bg-green-100 rounded-lg">
            <i class="pi pi-check-circle text-green-600 text-xl" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
