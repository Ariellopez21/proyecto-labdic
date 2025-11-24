<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const auth = useAuthStore()
const user = useUserStore()

// Ítems visibles para cualquiera que esté autenticado (o incluso público)
const baseItems = [
  {
    label: 'Inicio',
    icon: 'pi pi-home',
    command: () => router.push({ name: 'home' }),
  },
  // aquí puedes agregar otros ítems generales:
  // {
  //   label: 'Inventario',
  //   icon: 'pi pi-box',
  //   command: () => router.push({ name: 'inventory' }),
  // },
]

// Ítems que requieren permiso especial (admin / profesor)
const usersItem = {
  label: 'Usuarios',
  icon: 'pi pi-users',
  command: () => router.push({ name: 'users-list' }),
}

// Logout opcional desde el header
async function handleLogout() {
  auth.clearToken()
  user.clearUser()
  router.push({ name: 'login' })
}

// Menú final que usará la plantilla
// Por ahora: solo admin puede ver "Usuarios".
// Cuando tengas profesor, cambiaríamos la condición a algo como user.canListUsers.
const menuItems = computed(() => {
  const items = [...baseItems]

  if (auth.isAuthenticated && user.isAdmin) {
    items.push(usersItem)
  }


  if (auth.isAuthenticated){
    items.push({
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: handleLogout,
    })
  }

  return items
})
</script>


<template>
  <nav class="bg-white border-b border-gray-200 px-4 py-3">
    <div class="container mx-auto max-w-7xl flex items-center justify-between">
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i class="pi pi-check text-white font-bold" />
          </div>
          <h1 class="text-xl font-bold text-gray-900">
            LabDIC Inventory - Alpha Version
          </h1>
        </div>

        <nav class="hidden md:flex space-x-1">
          <a
            v-for="item in menuItems"
            :key="item.label"
            href="#"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            @click.prevent="item.command?.()"
          >
            <i :class="item.icon" class="mr-2" />
            {{ item.label }}
          </a>
        </nav>
      </div>
    </div>
  </nav>
</template>
