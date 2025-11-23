// src/stores/user.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@/interfaces/User";

/**
 * Stores information about the currently authenticated user.
 * This includes the full user object and derived properties such as isAdmin.
 *
 * The user is persisted in localStorage to survive page reloads.
 */
export const useUserStore = defineStore('user', () => {
  // Internal reactive reference to the current user
  const currentUser = ref<User | null>(loadFromStorage())

  /**
   * Computed property exposing the user's username (or null if not logged in).
   */
  const name = computed(() => currentUser.value?.username ?? null)

  /**
   * Whether the current user has admin privileges.
   */
  const isAdmin = computed(() => currentUser.value?.isAdmin === true)

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

  return { currentUser, name, isAdmin, setUser, clearUser }
})
