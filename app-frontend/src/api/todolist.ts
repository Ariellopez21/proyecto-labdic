import { apiFetch } from '.'

import type { Category, CategoryCreate, Todo, TodoCreate } from '@/interfaces/todolist'

// Todo API functions
export async function getTodos(): Promise<Todo[]> {
  return await apiFetch('/todolist/todos')
}

export async function getTodo(id: number): Promise<Todo> {
  return await apiFetch(`/todolist/todos/${id}`)
}

export async function createTodo(todo: TodoCreate): Promise<Todo> {
  return await apiFetch('/todolist/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    json: todo,
  })
}

export async function updateTodo(id: number, todo: Partial<TodoCreate>): Promise<Todo> {
  return await apiFetch(`/todolist/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    json: todo,
  })
}

export async function deleteTodo(id: number): Promise<void> {
  await apiFetch(`/todolist/todos/${id}`, {
    method: 'DELETE',
  })
}

// Category API functions
export async function getCategories(): Promise<Category[]> {
  return await apiFetch('/todolist/categories')
}

export async function getCategory(id: number): Promise<Category> {
  return await apiFetch(`/todolist/categories/${id}`)
}

export async function createCategory(category: CategoryCreate): Promise<Category> {
  return await apiFetch('/todolist/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    json: category,
  })
}

export async function updateCategory(
  id: number,
  category: Partial<CategoryCreate>,
): Promise<Category> {
  return await apiFetch(`/todolist/categories/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    json: category,
  })
}

export async function deleteCategory(id: number): Promise<void> {
  await apiFetch(`/todolist/categories/${id}`, {
    method: 'DELETE',
  })
}
