import { createRouter, createWebHistory } from 'vue-router'

/* ROUTER LINKS */
import HomeView from '../views/HomeView.vue'
import Login from '@/views/UserLogin.vue'
import UserManagement from '@/views/UserManagement.vue'

/* AUTH */
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/users',
      name: 'list-users',
      component: UserManagement,
    }
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  const user = useUserStore()
  const toast = useToast()

  if (to.name !== 'login' && !auth.isAuthenticated) {
    next({ name: 'login' })
  }
  if (to.meta.requiresAdmin && !user.isAdmin) {
    toast.add({
      severity: 'error',
      summary: 'Acceso Denegado',
      detail: 'No tienes permisos para acceder a esta página.',
      life: 3000,
    })
    next({ name: 'home' })
  }
  next()
})

export default router
