// src/interfaces/User.ts

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
}

export type UpdateUserPayload = Partial<NewUserPayload>
