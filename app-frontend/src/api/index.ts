// src/api/index.ts

import { useAuthStore } from '@/stores/auth'
export const BASE_URL = 'http://localhost:8000'

/**
 * Generic API fetch function that automatically sets the Authorization header
 * using the current token from the auth store. It also handles JSON parsing
 * and basic error handling.
 *
 * @template T The expected return type of the response
 * @param url The relative URL for the API endpoint
 * @param options Additional fetch options such as method, headers or body
 * @returns The parsed JSON response
 */
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const auth = useAuthStore()
  const token = auth.token

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}), // Excepción a la regla.
    /* Debido a que O2auth mantiene el formato clasico,
     * para el caso de api/auth.ts vamos a usar encodedURL
     * pero para el resto de las API mantendremos application/json.
     */
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    // If unauthorised, clear the token so the user is prompted to re-login
    if (response.status === 401) {
      auth.clearToken()
    }
    const errorBody = await response.text().catch(() => '')
    throw new Error(
      /* Arrojamos un error con el estado y cuerpo para intentar ser más específico. */
      `API request failed with status ${response.status}: ${errorBody}`
    )
  }

  // No content to parse
  if (response.status === 204) {
    return null as unknown as T
  }

  const data = (await response.json().catch(() => null)) as T
  return data
}
