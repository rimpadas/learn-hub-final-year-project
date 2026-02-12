'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from './types'
import { users as initialUsers } from './data'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  signup: (name: string, email: string, password: string, role: 'student' | 'admin') => boolean
  logout: () => void
  forgotPassword: (email: string) => boolean
  resetPassword: (token: string, newPassword: string) => boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback((email: string, _password: string) => {
    const found = initialUsers.find((u) => u.email === email)
    if (found) {
      setUser(found)
      return true
    }
    // Allow any email/password combo for demo
    const newUser: User = {
      id: `u${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'student',
      enrolledCourses: [],
      createdAt: new Date().toISOString(),
    }
    setUser(newUser)
    return true
  }, [])

  const signup = useCallback(
    (name: string, email: string, _password: string, role: 'student' | 'admin') => {
      const newUser: User = {
        id: `u${Date.now()}`,
        name,
        email,
        role,
        enrolledCourses: [],
        createdAt: new Date().toISOString(),
      }
      setUser(newUser)
      return true
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const forgotPassword = useCallback((_email: string) => {
    // Demo: always succeed and simulate sending a reset email
    return true
  }, [])

  const resetPassword = useCallback((_token: string, _newPassword: string) => {
    // Demo: always succeed and simulate resetting the password
    return true
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
