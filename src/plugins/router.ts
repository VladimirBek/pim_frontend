import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: (routes) => setupLayouts(routes)
})

router.beforeEach(async (to) => {

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const userRoles = localStorage.getItem('roles') || sessionStorage.getItem('roles');

  if (!token && to.path !== '/login') {
    return '/login'
  }
})

export default router
