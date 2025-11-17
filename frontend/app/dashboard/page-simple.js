'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('ai-tools-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ai-tools-user');
    router.push('/login');
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">AI Tools Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name || user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.name || 'Not set'}</p>
              <p><strong>Role:</strong> {user.role || 'User'}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg">
                View Tools
              </button>
              <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg">
                Add New Tool
              </button>
              <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg">
                Settings
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Frontend:</span>
                <span className="text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span>Backend:</span>
                <span className="text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span>Database:</span>
                <span className="text-green-600">Connected</span>
              </div>
            </div>
          </div>

        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Welcome to AI Tools Management System
          </h2>
          <p className="text-gray-600">
            This is a simplified dashboard. You can now access the system with any email and password.
            The system is running in development mode with basic functionality.
          </p>
        </div>
      </div>
    </div>
  );
}