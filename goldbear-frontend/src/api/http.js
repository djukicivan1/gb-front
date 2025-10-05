import axios from 'axios'
import { getToken, clearAuth } from '../auth'
import router from '../router'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

http.interceptors.request.use(cfg => {
  const token = getToken()
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

http.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401) {
      clearAuth()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default http
