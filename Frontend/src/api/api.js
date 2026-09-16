import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
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

// Doctors helpers
export const getDoctors = (params) => api.get('/api/doctors', { params })
export const getDoctorById = (id) => api.get(`/api/doctors/${id}`)
export const getDoctorDashboard = () => api.get('/api/doctors/dashboard')
export const getDoctorAppointments = () => api.get('/api/appointments/doctor')
export const getDoctorPrescriptions = () => api.get('/api/doctors/prescriptions')
export const createPrescription = (payload) => api.post('/api/doctors/prescriptions', payload)
export const getDrugDatabase = (search) => api.get('/api/doctors/drug-database', { params: { search } })

// Pharmacies helpers
export const getPharmacies = () => api.get('/api/pharmacists')
export const getActivePharmacies = () => api.get('/api/pharmacists/active')
export const getPharmacyById = (id) => api.get(`/api/pharmacists/${id}`)
export const getPharmacyDashboard = () => api.get('/api/pharmacists/dashboard')
export const getPharmacyPrescriptions = () => api.get('/api/pharmacists/prescriptions')

// Patient helpers
export const getPatientDashboard = () => api.get('/api/patients/dashboard')
export const getPatientPrescriptions = () => api.get('/api/patients/prescriptions')
export const getPatientAppointments = () => api.get('/api/appointments/patient')
export const createAppointment = (payload) => api.post('/api/appointments', payload)
export const uploadPrescription = (payload) => api.post('/api/patients/prescriptions/upload', payload)

// Admin helpers
export const getAdminStats = () => api.get('/api/admin/stats')
export const getAdminUsers = () => api.get('/api/admin/users')
export const getAdminHealth = () => api.get('/api/admin/system-health')

export default api
