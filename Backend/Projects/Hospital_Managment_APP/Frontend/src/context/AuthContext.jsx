import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hospital_app_user') || 'null')
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem('hospital_app_user', JSON.stringify(user))
  }, [user])

  async function login(username, password) {
    setLoading(true)
    try {
      const data = await api.login({ username, password })
      setUser(data.user)
      return data
    } finally {
      setLoading(false)
    }
  }

  async function register(payload) {
    setLoading(true)
    try {
      return await api.register(payload)
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await api.logout()
    } catch {
      // ignore network errors on logout
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
