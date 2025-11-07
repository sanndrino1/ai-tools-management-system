'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('bg-BG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('bg-BG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogin = () => {
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white border-b-2 border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">🚀</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Tools</h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </Link>
          </div>

          {/* Time Display */}
          <div className="hidden md:block text-center">
            <div className="text-lg font-mono text-gray-900">
              ⏰ {formatTime(currentTime)}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* User Info & Navigation */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                🏠 Home
              </Link>
              <Link 
                href="/admin" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                ⚙️ Admin
              </Link>
            </div>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">
                    👤 {user.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {user.id} | {user.role?.display_name || 'No Role'}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                🔑 Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Time on Mobile */}
              <div className="text-center pb-4 border-b border-gray-100">
                <div className="text-lg font-mono text-gray-900">
                  ⏰ {formatTime(currentTime)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(currentTime)}
                </div>
              </div>

              {/* Navigation Links */}
              <Link 
                href="/" 
                className="block text-gray-700 hover:text-blue-600 py-2 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Home
              </Link>
              <Link 
                href="/admin" 
                className="block text-gray-700 hover:text-blue-600 py-2 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                ⚙️ Admin
              </Link>

              {/* User Info on Mobile */}
              {isAuthenticated && (
                <div className="text-center pt-4 border-t border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    👤 {user.name}
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    ID: {user.id} | {user.role?.display_name || 'No Role'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}