import api from './axios'

const TOKEN_KEY = 'token'
const USERNAME_KEY = 'username'

export const login = async (username, password) => {
  const res = await api.post('/auth/login', { username, password })

  localStorage.setItem(TOKEN_KEY, res.data.token)
  localStorage.setItem(USERNAME_KEY, res.data.username)

  return res.data
}

export const logout = () => {
  clearToken()
}

export const clearToken = () => {

  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USERNAME_KEY)
  
}

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const getUsername = () => localStorage.getItem(USERNAME_KEY)

export const isAuthenticated = () => Boolean(getToken())
