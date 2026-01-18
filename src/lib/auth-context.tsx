'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react'
import { getCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister, type AuthResponse, type LoginRequest, type RegisterRequest, type UserResponse } from './api/auth'
import { getAuthToken, removeAuthToken } from './api/config'

interface AuthContextType {
  user: UserResponse | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<AuthResponse>
  register: (data: RegisterRequest) => Promise<AuthResponse>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// In-memory cache for user data
let userCache: { data: UserResponse | null, timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const fetchingRef = useRef(false)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken()
      
      // Early exit if no token
      if (!token) {
        setIsLoading(false)
        return
      }
      
      // Check cache first
      if (userCache && Date.now() - userCache.timestamp < CACHE_DURATION) {
        setUser(userCache.data)
        setIsLoading(false)
        return
      }
      
      // Prevent duplicate fetches
      if (fetchingRef.current) {
        return
      }
      
      fetchingRef.current = true
      
      try {
        const userData = await getCurrentUser()
        setUser(userData)
        // Update cache
        userCache = { data: userData, timestamp: Date.now() }
      } catch (error) {
        console.error('Failed to get current user:', error)
        removeAuthToken()
        userCache = null
      } finally {
        setIsLoading(false)
        fetchingRef.current = false
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiLogin(data)
    const userData = await getCurrentUser()
    setUser(userData)
    // Update cache
    userCache = { data: userData, timestamp: Date.now() }
    return response
  }, [])

  const register = useCallback(async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiRegister(data)
    const userData = await getCurrentUser()
    setUser(userData)
    // Update cache
    userCache = { data: userData, timestamp: Date.now() }
    return response
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    await apiLogout()
    setUser(null)
    // Clear cache
    userCache = null
  }, [])

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const userData = await getCurrentUser()
      setUser(userData)
      // Update cache
      userCache = { data: userData, timestamp: Date.now() }
    } catch (error) {
      console.error('Failed to refresh user:', error)
      setUser(null)
      removeAuthToken()
      // Clear cache
      userCache = null
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
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

