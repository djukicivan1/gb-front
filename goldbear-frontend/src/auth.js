const LS_KEY = 'gb_auth'

export function setAuth(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data || {}))
}

export function getAuth() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} }
}

export function getToken() {
  return getAuth().token || ''
}

export function getUser() {
  return getAuth().user || null
}

export function getRole() {
  const user = getUser()
  return (user && user.role) ? user.role : 'user'
}

export function clearAuth() {
  localStorage.removeItem(LS_KEY)
}

export function isLoggedIn() {
  return !!getToken()
}

export function isAdmin() {
  return getRole() === 'admin'
}
