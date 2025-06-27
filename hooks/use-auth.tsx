"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("hypostat_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual authentication
    const mockUser = { id: "1", email, name: "Test User" }
    setUser(mockUser)
    localStorage.setItem("hypostat_user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hypostat_user")
  }

  const signup = async (email: string, password: string, name: string) => {
    // Mock signup - replace with actual authentication
    const mockUser = { id: "1", email, name }
    setUser(mockUser)
    localStorage.setItem("hypostat_user", JSON.stringify(mockUser))
  }

  return <AuthContext.Provider value={{ user, login, logout, signup }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
