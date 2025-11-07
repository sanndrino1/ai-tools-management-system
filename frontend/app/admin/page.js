'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPanel from '../../components/AdminPanel';
import TwoFactorSetup from '../../components/TwoFactorSetup';
import { useToast } from '../../contexts/ToastContext';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function AdminPage() {
  const router = useRouter();
  const { showError } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('panel');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);

        // Check if user has admin role
        const adminRoles = ['owner', 'project_manager'];
        if (!adminRoles.includes(userData.role)) {
          showError('Access Denied', 'You do not have permission to access the admin panel');
          router.push('/');
          return;
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      showError('Error', 'Failed to verify admin access');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShieldExclamationIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('panel')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'panel'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Admin Panel
            </button>
            <button
              onClick={() => setActiveTab('2fa')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === '2fa'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              2FA Security
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'panel' && <AdminPanel />}
        {activeTab === '2fa' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TwoFactorSetup />
          </div>
        )}
      </div>
    </div>
  );
}