<script setup lang="ts">
import { useCategoryStore } from '@/stores/category'

import type { CategoryCreate } from '@/interfaces/todolist'

interface Props {
  visible: boolean
  editingCategoryId?: number | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'categorySaved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const categoryStore = useCategoryStore()

const categoryForm = ref<CategoryCreate>({
  name: '',
  description: '',
})

function resetForm() {
  categoryForm.value = {
    name: '',
    description: '',
  }
}

async function handleSubmit() {
  try {
    if (props.editingCategoryId) {
      await categoryStore.updateCategory(props.editingCategoryId, categoryForm.value)
    }
    else {
      await categoryStore.addCategory(categoryForm.value)
    }
    emit('update:visible', false)
    emit('categorySaved')
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

// Load category data when editing
watch(
  () => props.editingCategoryId,
  (categoryId) => {
    if (categoryId) {
      const category = categoryStore.categories.find(c => c.id === categoryId)
      if (category) {
        categoryForm.value = {
          name: category.name,
          description: category.description || '',
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
    :header="editingCategoryId ? 'Editar Categoría' : 'Nueva Categoría'"
    modal
    class="w-full max-w-md"
    @update:visible="emit('update:visible', $event)"
    @hide="resetForm"
  >
    <div class="flex flex-col gap-4">
      <FloatLabel variant="in">
        <InputText id="categoryName" v-model="categoryForm.name" class="w-full" required />
        <label for="categoryName">Nombre *</label>
      </FloatLabel>

      <FloatLabel variant="in">
        <Textarea
          id="categoryDescription"
          v-model="categoryForm.description"
          class="w-full"
          rows="3"
        />
        <label for="categoryDescription">Descripción</label>
      </FloatLabel>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="handleCancel" />
        <Button
          :label="editingCategoryId ? 'Actualizar' : 'Crear'"
          :disabled="!categoryForm.name.trim()"
          @click="handleSubmit"
        />
      </div>
    </template>
  </Dialog>
</template>
