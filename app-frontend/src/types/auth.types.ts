// src/types/auth.types.ts

/**
 * Token devuelto por Litestar's OAuth2PasswordBearerAuth.
 * Solo contiene access_token y token_type — Litestar NO envía
 * expiresIn ni refreshToken por defecto.
 */
export interface Token {
  accessToken: string
  tokenType: string
}
