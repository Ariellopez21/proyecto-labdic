// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Layouts
import AppLayout  from '@/components/layout/AppLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'

// Vistas — Auth
import LoginView from '@/modules/auth/views/LoginView.vue'

// Vistas — App (todos los usuarios)
import HomeView   from '@/modules/HomeView.vue'
import MyUserView from '@/modules/users/views/MyUserView.vue'

// Vistas — Admin
import UsersListView  from '@/modules/users/views/UsersListView.vue'
import AdminRolesView from '@/modules/users/views/AdminRolesView.vue'

import { useAuthStore } from '@/stores/auth.store'
import { useUserStore } from '@/stores/user.store'

const routes: RouteRecordRaw[] = [

  // ── Rutas públicas (sin sidebar) ──────────────────────────────────
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginView,
      },
    ],
  },

  // ── Rutas privadas (con AppLayout: sidebar + topbar) ──────────────
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: 'me',
        name: 'my-profile',
        component: MyUserView,
      },

      // Admin — Usuarios
      {
        path: 'admin/users',
        name: 'admin-users',
        component: UsersListView,
        meta: { requiresAdmin: true },
      },
      {
        path: 'admin/roles',
        name: 'admin-roles',
        component: AdminRolesView,
        meta: { requiresAdmin: true },
      },

      // Fases futuras — se agregan aquí:
      // { path: 'catalog',           name: 'catalog',          component: ... }
      // { path: 'my-loans',          name: 'my-loans',         component: ... }
      // { path: 'admin/products',    name: 'admin-products',   component: ... }
      // { path: 'admin/devices',     name: 'admin-devices',    component: ... }
      // { path: 'admin/loans',       name: 'admin-loans',      component: ... }
      // { path: 'admin/catalog',     name: 'admin-catalog',    component: ... }
    ],
  },

  // ── Catch-all ─────────────────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: (to) => ({
      name: 'home',
      query: { nf: '1', from: to.fullPath },
    }),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guard global de autenticación y autorización
router.beforeEach((to) => {
  const auth      = useAuthStore()
  const userStore = useUserStore()

  // Redirige al login si la ruta requiere auth y no hay token
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  // Redirige al home si la ruta requiere admin y el usuario no lo es
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return {
      name: 'home',
      query: { denied: 'admin' },
    }
  }

  return true
})

export default router
