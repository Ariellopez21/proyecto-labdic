// src/services/user.service.ts
import type { User, NewUserPayload, UpdateUserPayload } from '@/types/user.types'
import { apiFetch } from '@/services/api'

const USERS = '/labdic_inventory/users'

/**
 * Convierte el payload del formulario al formato que espera el backend.
 * El backend requiere roles como [{id, name}], no solo [{id}].
 * Los roleIds vienen del formulario junto a rolesData (lookup completo).
 */
function mapUserPayload<T extends { roleIds?: number[], rolesData?: { id: number, name: string }[] }>(
  payload: T,
): Omit<T, 'roleIds' | 'rolesData'> & { roles?: { id: number, name: string }[] } {
  const { roleIds, rolesData, ...rest } = payload

  // Si tenemos rolesData (con nombres), los usamos directamente
  // Si no, mandamos solo ids (fallback, puede dar 400 en algunos casos)
  let roles: { id: number, name: string }[] | undefined = undefined

  if (rolesData && rolesData.length > 0) {
    roles = rolesData
  } else if (roleIds && roleIds.length > 0) {
    roles = roleIds.map(id => ({ id, name: '' }))
  }

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

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
  const body = mapUserPayload(payload)
  return await apiFetch<User>(`${USERS}/${id}`, {
    method: 'PATCH',
    json: body,
  })
}

export async function deleteUser(id: number): Promise<void> {
  await apiFetch(`${USERS}/${id}`, { method: 'DELETE' })
}
