'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tools')
      if (response.ok) {
        const data = await response.json()
        setTools(data)
      }
    } catch (error) {
      console.log('Backend not available, using demo mode')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            🚀 <span className="text-blue-600">AI Tools Management</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover and manage AI tools for your projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  🏠 Dashboard
                </Link>
                <Link
                  href="/admin"
                  className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-lg font-medium border border-gray-300 transition-colors"
                >
                  ⚙️ Admin Panel
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  🔑 Login
                </Link>
                <Link
                  href="#tools"
                  className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-lg font-medium border border-gray-300 transition-colors"
                >
                  🛠️ Browse Tools
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* User Status Section */}
      {isAuthenticated && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <span className="text-white text-xl">👤</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Welcome, {user?.name}!
                  </h3>
                  <p className="text-sm text-gray-600">
                    {user?.email} • {user?.role?.display_name || 'No Role'} • ID: {user?.id}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin"
                  className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 transition-colors"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Available AI Tools</h2>
        
        {loading ? (
          <div className="text-center">Loading tools...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.length > 0 ? tools.map((tool) => (
              <div key={tool.id} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {tool.category}
                  </span>
                  <span className="text-yellow-500">⭐ {tool.rating}</span>
                </div>
                {tool.url && (
                  <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Visit Tool →
                  </a>
                )}
              </div>
            )) : (
              <div className="col-span-full text-center text-gray-500">
                No tools available. Make sure the backend is running!
              </div>
            )}
          </div>
        )}
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
            <p className="text-gray-600">Role-based access control with Supabase Auth</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-600">Live notifications and collaborative features</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Modern Stack</h3>
            <p className="text-gray-600">Next.js 14, Laravel 11, PostgreSQL</p>
          </div>
        </div>
      </div>
    </div>
  )
}