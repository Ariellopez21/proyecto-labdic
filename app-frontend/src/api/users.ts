// src/api/users.ts
import type { User, NewUserPayload, UpdateUserPayload } from '@/interfaces/User'
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

export async function createUser(payload: NewUserPayload): Promise<User> {
  return await apiFetch<User>(USERS, {
    method: 'POST',
    json: payload,  // tu apiFetch viejo se encarga de JSON + snake/camel
  })
}

export async function updateUser(
  id: number,
  payload: UpdateUserPayload,
): Promise<User> {
  return await apiFetch<User>(`${USERS}/${id}`, {
    method: 'PATCH',       // o 'PATCH' si tu backend usa PATCH
    json: payload,
  })
}

export async function deleteUser(id: number): Promise<void> {
  await apiFetch(`${USERS}/${id}`, {
    method: 'DELETE',
  })
}
