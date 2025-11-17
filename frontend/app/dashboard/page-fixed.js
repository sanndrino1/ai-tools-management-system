'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FixedDashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    try {
      // Check if user is logged in
      const savedUser = localStorage.getItem('ai-tools-user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } else {
        // No user found, redirect to login
        router.push('/login');
        return;
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Failed to load user data');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('ai-tools-user');
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Error during logout');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI Tools Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.name || 'User'}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            🎉 Welcome to AI Tools Management System!
          </h2>
          <p className="text-gray-600">
            You are successfully logged in as <strong>{user?.email}</strong>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">🔧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Tools</p>
                <p className="text-2xl font-bold text-gray-900">12+</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-2xl font-bold text-green-600">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/tools" className="block">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">🛠️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Tools</h3>
                <p className="text-gray-600 text-sm">Add, edit, and manage AI tools in the system</p>
              </div>
            </div>
          </Link>

          <Link href="/admin" className="block">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-2xl">⚙️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Panel</h3>
                <p className="text-gray-600 text-sm">System administration and user management</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">View system performance and usage statistics</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Frontend</span>
              <span className="text-green-600 font-medium">✅ Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Backend API</span>
              <span className="text-green-600 font-medium">✅ Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="text-green-600 font-medium">✅ Connected</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}