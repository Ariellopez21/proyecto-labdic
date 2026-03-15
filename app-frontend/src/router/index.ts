// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Layouts
import AppLayout  from '@/components/layout/AppLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'

// Auth
import LoginView from '@/modules/auth/views/LoginView.vue'

// App — todos los usuarios
import HomeView            from '@/modules/HomeView.vue'
import MyUserView          from '@/modules/users/views/MyUserView.vue'
import DeviceCatalogView   from '@/modules/devices/views/DeviceCatalogView.vue'

// Admin — Usuarios
import UsersListView  from '@/modules/users/views/UsersListView.vue'
import AdminRolesView from '@/modules/users/views/AdminRolesView.vue'

// Admin — Catálogo
import CatalogView from '@/modules/catalog/views/CatalogView.vue'

// Admin — Productos
import ProductsListView  from '@/modules/products/views/ProductsListView.vue'
import ProductDetailView from '@/modules/products/views/ProductDetailsView.vue'

// Admin — Dispositivos
import DevicesListView from '@/modules/devices/views/DevicesListView.vue'

import { useAuthStore } from '@/stores/auth.store'
import { useUserStore } from '@/stores/user.store'

const routes: RouteRecordRaw[] = [

  // ── Rutas públicas ────────────────────────────────────────────────
  {
    path: '/login',
    component: AuthLayout,
    children: [
      { path: '', name: 'login', component: LoginView },
    ],
  },

  // ── Rutas privadas ────────────────────────────────────────────────
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '',        name: 'home',       component: HomeView },
      { path: 'me',      name: 'my-profile', component: MyUserView },

      // Todos los usuarios
      { path: 'catalog', name: 'catalog',    component: DeviceCatalogView },

      // Admin — Usuarios
      { path: 'admin/users',  name: 'admin-users',  component: UsersListView,  meta: { requiresAdmin: true } },
      { path: 'admin/roles',  name: 'admin-roles',  component: AdminRolesView, meta: { requiresAdmin: true } },

      // Admin — Catálogo
      { path: 'admin/catalog', name: 'admin-catalog', component: CatalogView, meta: { requiresAdmin: true } },

      // Admin — Productos
      { path: 'admin/products',     name: 'admin-products',       component: ProductsListView,  meta: { requiresAdmin: true } },
      { path: 'admin/products/:id', name: 'admin-product-detail', component: ProductDetailView, meta: { requiresAdmin: true } },

      // Admin — Dispositivos
      { path: 'admin/devices', name: 'admin-devices', component: DevicesListView, meta: { requiresAdmin: true } },

      // Fase 5:
      // { path: 'my-loans',    name: 'my-loans',    component: MyLoansView }
      // { path: 'admin/loans', name: 'admin-loans', component: AdminLoansView, meta: { requiresAdmin: true } }
    ],
  },

  // ── Catch-all ─────────────────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    redirect: (to) => ({ name: 'home', query: { nf: '1', from: to.fullPath } }),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const auth      = useAuthStore()
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated)
    return { name: 'login', query: { redirect: to.fullPath } }

  if (to.meta.requiresAdmin && !userStore.isAdmin)
    return { name: 'home', query: { denied: 'admin' } }

  return true
})

export default router
