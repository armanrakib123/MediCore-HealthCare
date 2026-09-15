import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token if present
api.interceptors.request.use((cfg) => {
  try {
    const token = localStorage.getItem('token')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
  } catch (e) {}
  return cfg
})

// Auth helpers
export const register = (payload) => api.post('/api/auth/register', payload)
export const registerDoctor = (payload) => api.post('/api/auth/register-doctor', payload)
export const registerPharmacist = (payload) => api.post('/api/auth/register-pharmacist', payload)
export const registerPatient = (payload) => api.post('/api/auth/register-patient', payload)
export const login = (payload) => api.post('/api/auth/login', payload)
export const loginDoctor = (payload) => api.post('/api/auth/login-doctor', payload)
export const loginPharmacist = (payload) => api.post('/api/auth/login-pharmacist', payload)
export const loginPatient = (payload) => api.post('/api/auth/login-patient', payload)
export const loginGoogle = (payload) => api.post('/api/auth/login-google', payload)
export const loginFacebook = (payload) => api.post('/api/auth/login-facebook', payload)
export const loginAppleId = (payload) => api.post('/api/auth/login-apple', payload)
export const forgotPassword = (payload) => api.post('/api/auth/forgot-password', payload)
export const resetPassword = (payload) => api.post('/api/auth/reset-password', payload)

export default api
