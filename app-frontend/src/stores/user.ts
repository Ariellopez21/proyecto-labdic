import type { User } from "../interfaces/index";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('user', () => {
  const name = ref<string | null>(null)
  const isAdmin = ref<boolean>(false)

  function setUser(user: User) {
    name.value = user.username
    isAdmin.value = user.isAdmin || false
  }

  function clearUser() {
    name.value = null
    isAdmin.value = false
    localStorage.removeItem('name')
    localStorage.removeItem('isAdmin')
  }

  return { name, isAdmin, setUser, clearUser }
})
