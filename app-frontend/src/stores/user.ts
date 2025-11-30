// src/stores/user.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@/interfaces/User";
import type { Role } from "@/interfaces/Role";

/**
 * Stores information about the currently authenticated user.
 * This includes the full user object and derived properties such as isAdmin.
 *
 * The user is persisted in localStorage to survive page reloads.
 */
export const useUserStore = defineStore('user', () => {
  // Internal reactive reference to the current user
  const currentUser = ref<User | null>(loadFromStorage())

  const roles = computed<Role[]>(() => currentUser.value?.roles ?? [])

  // helpers genéricos
  function hasRole(name: string): boolean {
    return roles.value.some((r) => r.name === name)
  }

  function hasAnyRole(names: string[]): boolean {
    return roles.value.some((r) => names.includes(r.name))
  }

  /**
   * Computed property exposing the user's username (or null if not logged in).
   */
  const name = computed(() => currentUser.value?.username ?? null)

  /**
   * Whether the current user has admin privileges.
   */
  const isAdmin = computed(() => {
    // mientras convive isAdmin, lo respetamos como "super rol"
    if (currentUser.value?.isAdmin) return true // Dsp esta linea se puede borrar
    return hasRole('Administrador')
  })

  const isUser = computed(() => {
    if (!currentUser.value) return false
    if (isAdmin.value) return false // si es admin, lo tratamos distinto
    return hasRole('Usuario') || roles.value.length === 0
  })

  const canListUsers = computed(() => isAdmin.value) //|| isTeacher.value)
  const canManageUsers = computed(() => isAdmin.value)

  /**
   * Persist the current user to localStorage and update the reactive reference.
   * @param user The user object returned from the API
   */
  function setUser(user: User) {
    currentUser.value = user
    try {
      localStorage.setItem('currentUser', JSON.stringify(user))
    } catch {
      // Ignore localStorage errors (e.g. quota exceeded)
    }
  }

  /**
   * Clears the current user from both the reactive state and localStorage.
   */
  function clearUser() {
    currentUser.value = null
    try {
      localStorage.removeItem('currentUser')
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Attempt to read the user from localStorage.
   */
  function loadFromStorage(): User | null {
    const raw = localStorage.getItem('currentUser')
    if (!raw) return null
    try {
      return JSON.parse(raw) as User
    } catch {
      localStorage.removeItem('currentUser')
      return null
    }
  }

  return {
    currentUser, name,
    isAdmin, isUser,
    canListUsers, canManageUsers,
    hasRole, hasAnyRole,
    setUser, clearUser }
})
