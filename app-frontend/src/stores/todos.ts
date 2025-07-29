import { defineStore } from 'pinia'

import * as api from '@/api/todolist'

import type { Todo, TodoCreate } from '@/interfaces/todolist'

export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const completedTodos = computed(() => todos.value.filter(todo => todo.completed))
  const pendingTodos = computed(() => todos.value.filter(todo => !todo.completed))

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

  // Todo actions
  const fetchTodos = async () => {
    try {
      setLoading(true)
      clearError()
      todos.value = await api.getTodos()
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos')
    }
    finally {
      setLoading(false)
    }
  }

  const addTodo = async (todoData: TodoCreate) => {
    try {
      setLoading(true)
      clearError()
      const newTodo = await api.createTodo(todoData)
      todos.value.push(newTodo)
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo')
      throw err
    }
    finally {
      setLoading(false)
    }
  }

  const updateTodo = async (id: number, todoData: Partial<TodoCreate>) => {
    try {
      setLoading(true)
      clearError()
      const updatedTodo = await api.updateTodo(id, todoData)
      const index = todos.value.findIndex(todo => todo.id === id)
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo')
      throw err
    }
    finally {
      setLoading(false)
    }
  }

  const removeTodo = async (id: number) => {
    try {
      setLoading(true)
      clearError()
      await api.deleteTodo(id)
      todos.value = todos.value.filter(todo => todo.id !== id)
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo')
      throw err
    }
    finally {
      setLoading(false)
    }
  }

  const toggleTodoComplete = async (id: number) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      await updateTodo(id, { completed: !todo.completed })
    }
  }

  const getTodoById = (id: number) => {
    return todos.value.find(todo => todo.id === id)
  }

  const getTodosByCategory = (categoryId: number) => {
    return todos.value.filter(todo =>
      todo.categories.some(category => category.id === categoryId),
    )
  }

  return {
    // State
    todos,
    loading,
    error,
    // Computed
    completedTodos,
    pendingTodos,
    // Actions
    clearError,
    fetchTodos,
    addTodo,
    updateTodo,
    removeTodo,
    toggleTodoComplete,
    getTodoById,
    getTodosByCategory,
  }
})
