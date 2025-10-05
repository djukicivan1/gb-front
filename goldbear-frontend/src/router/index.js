import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn, isAdmin } from '../auth'

const Login = () => import('../views/LoginView.vue')
const Layout = () => import('../views/Layout.vue')
const Tasks = () => import('../views/TaskView.vue')
const Users = () => import('../views/UsersView.vue')
const Vehicles = () => import('../views/VehiclesView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login, meta: { public: true } },
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', redirect: '/tasks' },
        { path: 'tasks', component: Tasks, meta: { requiresAuth: true } },
        { path: 'vehicles', component: Vehicles, meta: { requiresAuth: true } },
        { path: 'users', component: Users, meta: { requiresAuth: true, roles: ['admin'] } },
      ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach((to) => {
  if (to.meta.public) return true

  if (to.meta.requiresAuth && !isLoggedIn()) {
    return { path: '/login' }
  }

  const roles = to.meta.roles
  if (roles && roles.length && !roles.includes('admin') && !roles.includes('user')) {
    return true
  }

  if (roles && roles.length) {
    if (roles.includes('admin') && !isAdmin()) {
      return { path: '/tasks' }
    }
  }

  return true
})

export default router
