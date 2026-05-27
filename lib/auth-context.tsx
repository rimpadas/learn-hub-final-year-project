'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User } from './types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, role: 'student' | 'admin') => Promise<boolean>
  logout: () => void
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (token: string, newPassword: string) => Promise<boolean>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.user) setUser(parsed.user)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return false
      const token = data.token
      const returnedUser = data.user
      localStorage.setItem('auth', JSON.stringify({ token, user: returnedUser }))
      setUser(returnedUser)
      return true
    } catch (err) {
      return false
    }
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string, role: 'student' | 'admin') => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })
      const data = await res.json()
      if (!res.ok) return false
      // After signup, attempt login to obtain token and set client state
      const loggedIn = await login(email, password)
      return loggedIn
    } catch (err) {
      return false
    }
  }, [login])

  const logout = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem('auth')
    } catch (e) {}
  }, [])

  const forgotPassword = useCallback((_email: string) => {
    return fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: _email }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed')
        // In demo, API returns a reset link; log it for testing
        console.log('Reset link:', data.resetLink)
        return true
      })
      .catch(() => false)
  }, [])

  const resetPassword = useCallback(async (_token: string, _newPassword: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: _token, newPassword: _newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Reset failed')
      return true
    } catch (e) {
      return false
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, forgotPassword, resetPassword, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
