// Axios instance — tự động đính kèm JWT token vào mọi request
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

// Interceptor: gắn token vào header trước khi gửi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')

// Tutors
export const getTutors = (params) => api.get('/tutors', { params })
export const getTutorById = (id) => api.get(`/tutors/${id}`)
export const registerTutor = (data) => api.post('/tutors/register', data)
export const updateTutor = (id, data) => api.put(`/tutors/${id}`, data)

// Students
export const getStudents = (params) => api.get('/students', { params })
export const getStudentById = (id) => api.get(`/students/${id}`)
export const createStudent = (data) => api.post('/students', data)

export default api
