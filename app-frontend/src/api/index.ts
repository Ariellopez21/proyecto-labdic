import * as changeKeys from 'change-case/keys'

import { useAuthStore } from "../stores/auth"
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

export const BASE_URL = 'http://localhost:8000'

interface RequestInitWithJson extends RequestInit {
  json?: object | null | undefined
}

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

  const jsonResponse = await response.json()
  return changeKeys.camelCase(jsonResponse, 5) as T
}
