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

export interface UserCreate extends UserBase {
  password: string
}

export interface Token {
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken: string
}

export interface UserUpdate extends UserBase {
  rut?: string
  name?: string
  email?: string
  phone?: string
  address?: string
}

export interface UserPrivate extends UserBase {
  password: string
}
