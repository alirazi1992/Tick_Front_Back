"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiRequest } from "./api"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  department?: string
  role: "client" | "engineer" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: string) => Promise<boolean>
  register: (userData: {
    name: string
    email: string
    phone: string
    department: string
    role: string
    password: string
  }) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session and token
    const storedUser = localStorage.getItem("user")
    const authToken = localStorage.getItem("authToken")
    
    if (storedUser && authToken) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      // Store user email for technician filtering
      localStorage.setItem("userEmail", userData.email)
      localStorage.setItem("userName", userData.name)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (response.success && response.data) {
        const { user: userData, token } = response.data
        
        // If role is specified, check if it matches
        if (role && role === "technician" && userData.role === "client") {
          setIsLoading(false)
          return false
        }
        if (role && role === "client" && (userData.role === "engineer" || userData.role === "admin")) {
          setIsLoading(false)
          return false
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("authToken", token)
        localStorage.setItem("userEmail", userData.email)
        localStorage.setItem("userName", userData.name)
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (userData: {
    name: string
    email: string
    phone: string
    department: string
    role: string
    password: string
  }): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      })

      if (response.success && response.data) {
        const { user: newUser, token } = response.data
        
        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
        localStorage.setItem("authToken", token)
        localStorage.setItem("userEmail", newUser.email)
        localStorage.setItem("userName", newUser.name)
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Registration error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
  }

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
