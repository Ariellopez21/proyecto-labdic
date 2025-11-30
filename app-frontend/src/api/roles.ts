// src/api/roles.ts
import type { Role } from '@/interfaces/Role'
import { apiFetch } from '.'

const ROLES = '/labdic_inventory/roles'

export async function getRoles(): Promise<Role[]> {
  return await apiFetch<Role[]>(ROLES)
}

export async function getRole(id: number): Promise<Role> {
  return await apiFetch<Role>(`${ROLES}/${id}`)
}

export async function createRole(payload: Omit<Role, 'id'>): Promise<Role> {
  return await apiFetch<Role>(ROLES, {
    method: 'POST',
    json: payload,
  })
}

export async function updateRole(
  id: number,
  payload: Partial<Omit<Role, 'id'>>,
): Promise<Role> {
  return await apiFetch<Role>(`${ROLES}/${id}`, {
    method: 'PATCH',
    json: payload,
  })
}

export async function deleteRole(id: number): Promise<void> {
  await apiFetch<void>(`${ROLES}/${id}`, {
    method: 'DELETE',
  })
}
