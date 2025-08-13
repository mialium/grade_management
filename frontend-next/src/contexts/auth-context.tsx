'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginRequest, LoginResponse } from '@/types/api'
import { apiService } from '@/lib/api'

interface AuthContextType {
  user: User | null
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        clearAuthData()
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiService.login(credentials)
      
      if (response.success && response.data) {
        const { token, username, realName, role, userId } = response.data
        
        localStorage.setItem('token', token)
        localStorage.setItem('username', username)
        localStorage.setItem('realName', realName)
        localStorage.setItem('role', role)
        localStorage.setItem('userId', userId.toString())
        
        const userData: User = {
          id: userId,
          username,
          realName,
          role
        }
        
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      return { success: false, error: '网络错误，请稍后重试' }
    }
  }

  const logout = () => {
    clearAuthData()
    setUser(null)
  }

  const clearAuthData = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('realName')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    localStorage.removeItem('user')
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
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