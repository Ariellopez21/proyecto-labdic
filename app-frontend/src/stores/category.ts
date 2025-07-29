import { defineStore } from 'pinia'

import * as api from '@/api/todolist'

import type { Category, CategoryCreate } from '@/interfaces/todolist'

export const useCategoryStore = defineStore('category', () => {
  // State
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (message: string | null) => {
    error.value = message
  }

  const clearError = () => {
    error.value = null
  }

  // Category actions
  const fetchCategories = async () => {
    try {
      setLoading(true)
      clearError()
      categories.value = await api.getCategories()
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    }
    finally {
      setLoading(false)
    }
  }

  const addCategory = async (categoryData: CategoryCreate) => {
    try {
      setLoading(true)
      clearError()
      const newCategory = await api.createCategory(categoryData)
      categories.value.push(newCategory)
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
      throw err
    }
    finally {
      setLoading(false)
    }
  }

  const updateCategory = async (id: number, categoryData: Partial<CategoryCreate>) => {
    try {
      setLoading(true)
      clearError()
      const updatedCategory = await api.updateCategory(id, categoryData)
      const index = categories.value.findIndex(category => category.id === id)
      if (index !== -1) {
        categories.value[index] = updatedCategory
      }
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category')
      throw err
    }
    finally {
      setLoading(false)
    }
  }

  const removeCategory = async (id: number) => {
    try {
      setLoading(true)
      clearError()
      await api.deleteCategory(id)
      categories.value = categories.value.filter(category => category.id !== id)
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
      throw err
    }
    finally {
      setLoading(false)
    }
  }

  const getCategoryById = (id: number) => {
    return categories.value.find(category => category.id === id)
  }

  return {
    // State
    categories,
    loading,
    error,
    // Actions
    clearError,
    fetchCategories,
    addCategory,
    updateCategory,
    removeCategory,
    getCategoryById,
  }
})
