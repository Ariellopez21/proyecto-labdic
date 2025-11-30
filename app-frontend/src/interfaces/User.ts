// src/interfaces/User.ts
import type { Role } from './Role'

/*
  UserBase
  Facilitar tipos parciales y evitar repetir campos comunes.
 */
export interface UserBase {
  id: number  // Borrarlo dsp.
  username: string
}

export interface User extends UserBase {
  rut: string
  name: string
  email: string
  phone: string
  address: string
  createdAt: Date
  isAdmin: boolean
  isActive: boolean
  roles: Role[]
}

export interface NewUserPayload {
  username: string
  rut: string
  name: string
  email: string
  phone: string
  address: string
  password: string
  isAdmin: boolean
  roleIds?: number[]  // ids de roles seleccionados en el formulario
  }

export type UpdateUserPayload = Partial<NewUserPayload>
