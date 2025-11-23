// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
// Route components
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/UserLogin.vue'
import UserList from '@/views/UserList.vue'
//import UserCreate from '@/views/UserCreate.vue'
//import UserUpdate from '@/views/UserUpdate.vue'

import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/users',
    name: 'users-list',
    component: UserList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  /*{
    path: '/users/create',
    name: 'new-user',
    component: UserCreate,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/users/update/:id',
    name: 'update-user',
    component: UserUpdate,
    meta: { requiresAuth: true, requiresAdmin: true },
  },*/
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Global navigation guard enforcing authentication and authorization
router.beforeEach((to) => {
  const auth = useAuthStore()
  const userStore = useUserStore()

  // Redirect unauthenticated users to the login page
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  // Deny access to admin-only routes
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return {
      name: 'home',
      query: { denied: 'admin' },
    }
  }

  // Deny access to the users list for non-admins (adjust when roles are available)
  if (to.meta.requiresList && !userStore.isAdmin) {
    return {
      name: 'home',
      query: { denied: 'list' },
    }
  }

  return true
})

export default router
