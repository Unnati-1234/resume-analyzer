import { api } from './api'

export const registerUser = async (userData) => {
  return api.post('/api/auth/register', userData)
}

export const loginUser = async (credentials) => {
  const data = await api.post('/api/auth/login', credentials)

  if (data.token) {
    localStorage.setItem('token', data.token)
  }

  return data
}

export const logoutUser = () => {
  localStorage.removeItem('token')
}

export const getStoredToken = () => {
  return localStorage.getItem('token')
}