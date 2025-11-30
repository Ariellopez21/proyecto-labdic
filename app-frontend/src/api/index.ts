// src/api/index.ts
import * as changeKeys from 'change-case/keys'

import { useAuthStore } from "../stores/auth"
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

export const BASE_URL = 'http://localhost:8000'

interface RequestInitWithJson extends RequestInit {
  json?: object | null | undefined
}


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
  endpoint: string,
  options: RequestInitWithJson = {},
): Promise<T> {
  const auth = useAuthStore()
  const user = useUserStore()
  const router = useRouter()

  let headers = options.headers || {}

  if (auth.isAuthenticated) {
    headers = {
      Authorization: `Bearer ${auth.token}`,
      ...headers
    }
  }

  if (options.json) {
    options.body = JSON.stringify(changeKeys.snakeCase(options.json, 5))
    options.json = undefined
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      auth.clearToken()
      user.clearUser()

      router.push({ name: 'login', query: { expiredToken: "true" } })
    }

    throw new Error(`HTTP error! status: ${response.status}`)
  }

  // 204 No Content by DELETE.
  if (response.status === 204) {
    return undefined as T
  }

  // También puede haber 200 con cuerpo vacío, así que leemos como texto
  const text = await response.text()

  if (!text) {
    // cuerpo vacío, nada que parsear
    return undefined as T
  }

  // Si hay texto, asumimos JSON
  const rawJson = JSON.parse(text)
  const jsonResponse = changeKeys.camelCase(rawJson, 5) as T
  console.log('apiFetch response:', jsonResponse)
  return jsonResponse
}
