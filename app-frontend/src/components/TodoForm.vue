<script setup lang="ts">
import { useCategoryStore } from '@/stores/category'
import { useTodoStore } from '@/stores/todos'

import type { TodoCreate } from '@/interfaces/todolist'

interface Props {
  visible: boolean
  editingTodoId?: number | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'todoSaved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const todoStore = useTodoStore()
const categoryStore = useCategoryStore()

const todoForm = ref<TodoCreate>({
  title: '',
  description: '',
  completed: false,
  categories: [],
})

const categoryOptions = computed(() =>
  categoryStore.categories,
)

function resetForm() {
  todoForm.value = {
    title: '',
    description: '',
    completed: false,
    categories: [],
  }
}

async function handleSubmit() {
  try {
    if (props.editingTodoId) {
      await todoStore.updateTodo(props.editingTodoId, todoForm.value)
    }
    else {
      await todoStore.addTodo(todoForm.value)
    }
    emit('update:visible', false)
    emit('todoSaved')
    resetForm()
  }
  catch {
    // Error is handled in the store
  }
}

function handleCancel() {
  emit('update:visible', false)
  resetForm()
}

// Load todo data when editing
watch(
  () => props.editingTodoId,
  (todoId) => {
    if (todoId) {
      const todo = todoStore.todos.find(t => t.id === todoId)
      if (todo) {
        todoForm.value = {
          title: todo.title,
          description: todo.description || '',
          completed: todo.completed,
          categories: todo.categories.map(cat => ({ id: cat.id })),
        }
      }
    }
    else {
      resetForm()
    }
  },
  { immediate: true },
)
</script>

<template>
  <Dialog
    :visible="visible"
    :header="editingTodoId ? 'Editar Tarea' : 'Nueva Tarea'"
    modal
    class="w-full max-w-md"
    @update:visible="emit('update:visible', $event)"
    @hide="resetForm"
  >
    <div class="flex flex-col gap-4">
      <FloatLabel variant="in">
        <InputText id="title" v-model="todoForm.title" class="w-full" required />
        <label for="title">Título *</label>
      </FloatLabel>

      <FloatLabel variant="in">
        <Textarea id="description" v-model="todoForm.description" class="w-full" rows="3" />
        <label for="description">Descripción</label>
      </FloatLabel>

      <FloatLabel variant="in">
        <MultiSelect
          id="categories"
          v-model="todoForm.categories"
          :options="categoryOptions"
          option-label="name"
          :option-value="(cat) => ({ id: cat.id })"
          placeholder="Seleccionar categorías"
          class="w-full"
        />
        <label for="categories">Categorías</label>
      </FloatLabel>

      <div v-if="editingTodoId" class="flex align-items-center gap-2">
        <Checkbox id="completed" v-model="todoForm.completed" binary />
        <label for="completed" class="text-sm font-medium">Completada</label>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="handleCancel" />
        <Button
          :label="editingTodoId ? 'Actualizar' : 'Crear'"
          :disabled="!todoForm.title.trim()"
          @click="handleSubmit"
        />
      </div>
    </template>
  </Dialog>
</template>
