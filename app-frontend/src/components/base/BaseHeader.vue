<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const auth = useAuthStore()
const user = useUserStore()
const mobileMenuOpen = ref(false)

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

const myUserItem = {
  label: 'Mi usuario',
  icon: 'pi pi-user',
  command: () => router.push({ name: 'my-user' }),
}

// Logout opcional desde el header
async function handleLogout() {
  auth.clearToken()
  user.clearUser()
  mobileMenuOpen.value = false
  router.push({ name: 'login' })
}

// Función para manejar click en items del menú móvil
function handleMenuItemClick(callback?: () => void) {
  mobileMenuOpen.value = false
  callback?.()
}

// Menú final que usará la plantilla
// Por ahora: solo admin puede ver "Usuarios".
// Cuando tengas profesor, cambiaríamos la condición a algo como user.canListUsers.
const menuItems = computed(() => {
  const items = [...baseItems]

  if (auth.isAuthenticated && user.isAdmin) {
    items.push(usersItem)
  }

  if (auth.isAuthenticated) {
    items.push(myUserItem)
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
      <div class="flex items-center space-x-6 flex-1">
        <div class="flex items-center space-x-2">
          <div class="logo">LD</div>
          <h1 class="text-lg md:text-xl font-bold text-gray-900">
            LabDIC Inventory
          </h1>
        </div>

        <!-- Menú desktop -->
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

      <!-- Botón hamburguesa móvil -->
      <button
        class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl" />
      </button>
    </div>

    <!-- Menú móvil desplegable -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 mt-3 pt-3">
        <a
          v-for="item in menuItems"
          :key="item.label"
          href="#"
          class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors block w-full text-left"
          @click.prevent="handleMenuItemClick(item.command)"
        >
          <i :class="item.icon" class="mr-3" />
          {{ item.label }}
        </a>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.logo{ width:32px; height:32px; border-radius:8px; background: linear-gradient(135deg,#4f46e5,#06b6d4); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; }
</style>
