import type { Token, User, UserCreate, UserUpdate } from '../interfaces/index'
import { apiFetch } from '.'

export async function getUsers(): Promise<User[]> {
  return await apiFetch('/labdic_inventory/users')
}

export async function createUser(user: UserCreate): Promise<User> {
  return await apiFetch('/labdic_inventory/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    json: user,
  })
}

export async function updateUser(user: UserUpdate): Promise<UserUpdate> {
  return await apiFetch(`/labdic_inventory/users/${user.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    json: user,
  })
}

export async function getUser(id: number): Promise<User> {
  return await apiFetch(`/labdic_inventory/users/${id}`)
}

export async function getUserUpdate(id: number): Promise<UserUpdate> {
  return await apiFetch(`/labdic_inventory/users/${id}`)
}

export async function getMyUser(): Promise<User> {
  return await apiFetch('/labdic_inventory/users/me')
}

export async function deleteUser(id: number): Promise<void> {
  await apiFetch(`/labdic_inventory/users/${id}`, {
    method: 'DELETE',
  })
}

export async function login(username: string, password: string): Promise<Token> {
  const params = new URLSearchParams()
  params.append('username', username)
  params.append('password', password)

  return await apiFetch('/labdic_inventory/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })
}
