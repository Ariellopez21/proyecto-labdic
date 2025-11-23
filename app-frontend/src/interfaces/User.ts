// src/interfaces/User.ts

export interface UserBase {
  id: number
  username: string
  isAdmin: boolean
}

export interface User extends UserBase {
  rut: string
  name: string
  email: string
  phone: string
  address: string
  createdAt: Date
  isActive: boolean
}


