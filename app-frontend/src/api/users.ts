// src/api/users.ts
import type { User } from '../interfaces/User'
import { apiFetch } from '@/api/index'

// Base path for user-related API endpoints
const USERS = '/labdic_inventory/users'

export async function getUsers(): Promise<User[]> {
  return await apiFetch(USERS)
}


export async function getUser(id: number): Promise<User> {
  return await apiFetch(`${USERS}/${id}`)
}


export async function getMyUser(): Promise<User> {
  return await apiFetch(`${USERS}/me`)
}

export async function deleteUser(id: number): Promise<void> {
  await apiFetch(`${USERS}/${id}`, {
    method: 'DELETE',
  })
}
