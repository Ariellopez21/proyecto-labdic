// src/interfaces/Auth.ts
export interface Token {
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken: string
}
