import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const adminClient = axios.create({
  baseURL: API_URL,
})

adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('agri_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default adminClient
