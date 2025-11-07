'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { AIRoleBasedDashboard } from '../../components/AIRoleBasedDashboard';

export default function DashboardPage() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    tools: 0,
    users: 0,
    roles: 0,
    activeTools: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    fetchDashboardStats();
  }, [isAuthenticated, router]);

  const fetchDashboardStats = async () => {
    try {
      const [toolsRes, usersRes, rolesRes] = await Promise.all([
        fetch('http://localhost:8001/api/tools'),
        fetch('http://localhost:8001/api/users'),
        fetch('http://localhost:8001/api/roles')
      ]);

      const [tools, users, roles] = await Promise.all([
        toolsRes.ok ? toolsRes.json() : [],
        usersRes.ok ? usersRes.json() : [],
        rolesRes.ok ? rolesRes.json() : []
      ]);

      setStats({
        tools: tools.length,
        users: users.length,
        roles: roles.length,
        activeTools: tools.filter(t => t.is_active).length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use the new AI-Enhanced Role-Based Dashboard
  return <AIRoleBasedDashboard user={user} stats={stats} loading={loading} />;
}
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Redirecting to login...</div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>
            {loading ? '...' : value}
          </p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, description, href, icon, color = 'blue' }) => (
    <a
      href={href}
      className="block bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </a>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your AI Tools Management dashboard
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-blue-600 text-lg">👤</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  Logged in as: {user?.email}
                </p>
                <p className="text-sm text-blue-600">
                  Role: {user?.role?.display_name || 'No Role'} | User ID: {user?.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total AI Tools"
            value={stats.tools}
            icon="🛠️"
            color="blue"
          />
          <StatCard
            title="Active Tools"
            value={stats.activeTools}
            icon="✅"
            color="green"
          />
          <StatCard
            title="System Users"
            value={stats.users}
            icon="👥"
            color="purple"
          />
          <StatCard
            title="User Roles"
            value={stats.roles}
            icon="🎭"
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickAction
              title="Browse AI Tools"
              description="Explore available AI tools and their features"
              href="/"
              icon="🔍"
              color="blue"
            />
            <QuickAction
              title="Admin Panel"
              description="Manage users, roles, and system settings"
              href="/admin"
              icon="⚙️"
              color="purple"
            />
            <QuickAction
              title="API Documentation"
              description="View API endpoints and integration guides"
              href="/api/docs"
              icon="📚"
              color="green"
            />
          </div>
        </div>

        {/* Recent Activity (Mock) */}
        <div className="bg-white rounded-lg shadow-md border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-blue-600">🔄</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">System Updated</p>
                  <p className="text-xs text-gray-500">Laravel backend with user roles deployed</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600">✅</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Database Seeded</p>
                  <p className="text-xs text-gray-500">Demo users and AI tools added</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-purple-600">🎨</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Frontend Enhanced</p>
                  <p className="text-xs text-gray-500">New dashboard and authentication system</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            🏠 Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}