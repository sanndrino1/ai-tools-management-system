'use client';

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('ai-tools-user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error loading saved user:', error)
        localStorage.removeItem('ai-tools-user')
      }
    }
  }, [])

  const login = async (userData) => {
    setIsLoading(true)
    
    try {
      // If userData is provided directly (for demo), use it
      if (userData && typeof userData === 'object') {
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem('ai-tools-user', JSON.stringify(userData))
        setIsLoading(false)
        return { success: true, user: userData }
      }

      // Otherwise try to authenticate with backend
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email || userData,
          password: userData.password || 'password123'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsAuthenticated(true)
        localStorage.setItem('ai-tools-user', JSON.stringify(data.user))
        localStorage.setItem('ai-tools-token', data.token)
        return { success: true, user: data.user }
      } else {
        // Fallback to demo mode
        const demoUser = {
          id: 1,
          name: 'Demo User',
          email: userData.email || 'demo@aitools.dev',
          role: { name: 'owner', display_name: 'Owner' }
        }
        setUser(demoUser)
        setIsAuthenticated(true)
        localStorage.setItem('ai-tools-user', JSON.stringify(demoUser))
        return { success: true, user: demoUser, demo: true }
      }
    } catch (error) {
      console.error('Login error:', error)
      // Fallback to demo mode on error
      const demoUser = {
        id: 1,
        name: 'Demo User',
        email: 'demo@aitools.dev',
        role: { name: 'owner', display_name: 'Owner' }
      }
      setUser(demoUser)
      setIsAuthenticated(true)
      localStorage.setItem('ai-tools-user', JSON.stringify(demoUser))
      return { success: true, user: demoUser, demo: true }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithEmail = async (email) => {
    setIsLoading(true)
    
    // Demo users data
    const demoUsers = {
      'owner@aitools.dev': { id: 1, name: 'Owner', email: 'owner@aitools.dev', role: 'owner' },
      'pm@aitools.dev': { id: 2, name: 'Project Manager', email: 'pm@aitools.dev', role: 'project_manager' },
      'backend@aitools.dev': { id: 3, name: 'Backend Developer', email: 'backend@aitools.dev', role: 'backend_developer' },
      'frontend@aitools.dev': { id: 4, name: 'Frontend Developer', email: 'frontend@aitools.dev', role: 'frontend_developer' },
      'qa@aitools.dev': { id: 5, name: 'QA Engineer', email: 'qa@aitools.dev', role: 'qa_engineer' },
      'designer@aitools.dev': { id: 6, name: 'Designer', email: 'designer@aitools.dev', role: 'designer' }
    }
    
    try {
      // Check if it's a demo user
      if (demoUsers[email]) {
        const demoUser = demoUsers[email]
        setUser(demoUser)
        setIsAuthenticated(true)
        localStorage.setItem('ai-tools-user', JSON.stringify(demoUser))
        setIsLoading(false)
        return { success: true, user: demoUser }
      }

      // Try to find user by email in backend
      const response = await fetch(`http://localhost:8000/api/users`)
      
      if (response.ok) {
        const users = await response.json()
        const foundUser = users.find(u => u.email === email)
        
        if (foundUser) {
          setUser(foundUser)
          setIsAuthenticated(true)
          localStorage.setItem('ai-tools-user', JSON.stringify(foundUser))
          return { success: true, user: foundUser }
        }
      }
      
      // Fallback to demo user
      const demoUser = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        role: { name: 'user', display_name: 'User' }
      }
      setUser(demoUser)
      setIsAuthenticated(true)
      localStorage.setItem('ai-tools-user', JSON.stringify(demoUser))
      return { success: true, user: demoUser, demo: true }
      
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('ai-tools-user')
    localStorage.removeItem('ai-tools-token')
  }

  const refreshUser = async () => {
    if (!user) return
    
    try {
      const response = await fetch(`http://localhost:8000/api/users/${user.id}`)
      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        localStorage.setItem('ai-tools-user', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithEmail,
      logout, 
      refreshUser,
      isLoading, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}