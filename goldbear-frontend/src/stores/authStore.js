import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)

  function setAuth(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('gb_auth', JSON.stringify({ token: newToken, user: newUser }))
  }

  function loadAuth() {
    const saved = JSON.parse(localStorage.getItem('gb_auth') || '{}')
    token.value = saved.token || null
    user.value = saved.user || null
  }

  function clearAuth() {
    token.value = null
    user.value = null
    localStorage.removeItem('gb_auth')
  }

  const isLoggedIn = () => !!token.value
  const isAdmin = () => (user.value?.role || '').toLowerCase() === 'admin'

  return { token, user, setAuth, loadAuth, clearAuth, isLoggedIn, isAdmin }
})
