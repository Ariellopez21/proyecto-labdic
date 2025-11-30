// src/api/users.ts
import type { User, NewUserPayload, UpdateUserPayload } from '@/interfaces/User'
import { apiFetch } from '@/api/index'


// Base path for user-related API endpoints
const USERS = '/labdic_inventory/users'

// Helper para mapear roleIds -> roles[{id}]
function mapUserPayload<T extends { roleIds?: number[] }>(
  payload: T,
): Omit<T, 'roleIds'> & { roles?: { id: number }[] } {
  const { roleIds, ...rest } = payload
  const roles =
    roleIds && roleIds.length > 0
      ? roleIds.map((id) => ({ id }))
      : undefined

  return { ...rest, roles }
}

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
  const body = mapUserPayload(payload)
  return await apiFetch<User>(USERS, {
    method: 'POST',
    json: body,
  })
}

export async function updateUser(
  id: number,
  payload: UpdateUserPayload,
): Promise<User> {
  const body = mapUserPayload(payload)
  return await apiFetch<User>(`${USERS}/${id}`, {
    method: 'PATCH',       // o 'PATCH' si tu backend usa PATCH
    json: body,
  })
}

export async function deleteUser(id: number): Promise<void> {
  await apiFetch(`${USERS}/${id}`, {
    method: 'DELETE',
  })
}
