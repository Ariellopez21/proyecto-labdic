<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'

import { useCategoryStore } from '@/stores/category'

interface Emits {
  (e: 'editCategory', categoryId: number): void
}

const emit = defineEmits<Emits>()
const categoryStore = useCategoryStore()

const confirm = useConfirm()

async function handleDeleteCategory(categoryId: number) {
  confirm.require({
    message: '¿Estás seguro de que quieres eliminar esta categoría?',
    acceptProps: {
      label: 'Eliminar',
      severity: 'danger',
    },
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
    },
    accept: async () => {
      await categoryStore.removeCategory(categoryId)
    },
  })
}

function handleEditCategory(categoryId: number) {
  emit('editCategory', categoryId)
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <i class="pi pi-tags text-blue-600" />
      Categorías
    </h2>
    <div class="flex flex-wrap gap-2">
      <Chip
        v-for="category in categoryStore.categories"
        :key="category.id"
        :label="category.name"
        class="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
        removable
        @click="handleEditCategory(category.id)"
      >
        <template #removeicon>
          <i class="pi pi-times-circle" @click="(e) => { e.stopPropagation(); handleDeleteCategory(category.id) }" />
        </template>
      </Chip>
      <div v-if="categoryStore.categories.length === 0" class="text-gray-500 text-sm py-2">
        No hay categorías creadas. ¡Crea tu primera categoría!
      </div>
    </div>
  </div>
</template>
