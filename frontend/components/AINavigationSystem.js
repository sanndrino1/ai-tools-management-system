'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  CpuChipIcon,
  UserIcon,
  Cog6ToothIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/react/24/outline';

// AI-Enhanced Navigation Configuration by Role
const getNavigationConfig = (userRole) => {
  const baseNav = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, emoji: '📊', description: 'Overview and statistics' },
    { name: 'AI Tools', href: '/tools', icon: CpuChipIcon, emoji: '🛠️', description: 'Browse and manage tools' },
    { name: 'Profile', href: '/profile', icon: UserIcon, emoji: '👤', description: 'Manage your account' },
  ];

  const roleSpecificNav = {
    owner: [
      { name: 'Admin Panel', href: '/admin', icon: Cog6ToothIcon, emoji: '⚙️', description: 'System administration' },
      { name: 'User Management', href: '/admin/users', icon: UsersIcon, emoji: '👥', description: 'Manage all users' },
      { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, emoji: '�', description: 'System analytics' },
      { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, emoji: '�', description: 'Global settings' },
    ],
    pm: [
      { name: 'Projects', href: '/pm/projects', icon: DocumentTextIcon, emoji: '📋', description: 'Manage projects' },
      { name: 'Team', href: '/pm/team', icon: UsersIcon, emoji: '👥', description: 'Team coordination' },
      { name: 'Reports', href: '/pm/reports', icon: ChartBarIcon, emoji: '📊', description: 'Project reports' },
    ],
    backend: [
      { name: 'API Docs', href: '/dev/api', icon: DocumentTextIcon, emoji: '🔗', description: 'API documentation' },
      { name: 'Database', href: '/dev/database', icon: ChartBarIcon, emoji: '🗄️', description: 'Database management' },
      { name: 'Monitoring', href: '/dev/monitoring', icon: ChartBarIcon, emoji: '�', description: 'System monitoring' },
    ],
    frontend: [
      { name: 'Components', href: '/frontend/components', icon: CpuChipIcon, emoji: '🧩', description: 'UI components' },
      { name: 'Design System', href: '/frontend/design', icon: Cog6ToothIcon, emoji: '🎨', description: 'Design guidelines' },
      { name: 'Testing', href: '/frontend/testing', icon: DocumentTextIcon, emoji: '🧪', description: 'UI testing' },
    ],
    qa: [
      { name: 'Test Suites', href: '/qa/tests', icon: DocumentTextIcon, emoji: '🧪', description: 'Automated tests' },
      { name: 'Bug Reports', href: '/qa/bugs', icon: ChartBarIcon, emoji: '🐛', description: 'Bug tracking' },
      { name: 'Coverage', href: '/qa/coverage', icon: ChartBarIcon, emoji: '�', description: 'Code coverage' },
    ],
    designer: [
      { name: 'Design Assets', href: '/design/assets', icon: CpuChipIcon, emoji: '🎨', description: 'Design files' },
      { name: 'Style Guide', href: '/design/styleguide', icon: DocumentTextIcon, emoji: '📐', description: 'Style guidelines' },
      { name: 'Prototypes', href: '/design/prototypes', icon: CpuChipIcon, emoji: '🖼️', description: 'Interactive prototypes' },
    ],
  };

  return {
    main: baseNav,
    role: roleSpecificNav[userRole] || [],
  };
};

// AI-Generated Mobile Navigation Component
const MobileNavigation = ({ isOpen, setIsOpen, navigation, userRole, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <span className="sr-only">Close menu</span>
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Main Navigation */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Main
              </h3>
              {navigation.main.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Role-specific Navigation */}
            {navigation.role.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {userRole?.display_name || 'Role'} Tools
                </h3>
                {navigation.role.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-700 rounded-md hover:bg-red-50 transition-colors"
            >
              <span className="mr-3 text-lg">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI-Generated Main Navigation Component
export const AINavigationSystem = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userRole = user?.role?.name || 'owner';
  const navigation = getNavigationConfig(userRole);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AI Tools</h1>
                  <p className="text-xs text-gray-500">Management System</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.main.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Role-specific dropdown */}
              {navigation.role.length > 0 && (
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    <span className="text-lg">{user?.role?.name === 'owner' ? '👑' : 
                                                   user?.role?.name === 'pm' ? '📋' :
                                                   user?.role?.name === 'backend' ? '⚙️' :
                                                   user?.role?.name === 'frontend' ? '🎨' :
                                                   user?.role?.name === 'qa' ? '🧪' : '🎨'}</span>
                    <span>{user?.role?.display_name || 'Role'}</span>
                    <span className="text-xs">▼</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {navigation.role.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <span className="mr-3 text-lg">{item.icon}</span>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role?.display_name}</p>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:text-red-900 hover:bg-red-50 transition-colors"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Open menu</span>
                <span className="text-xl">☰</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        navigation={navigation}
        userRole={user?.role}
        onLogout={handleLogout}
      />
    </>
  );
};