'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
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
  BellIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';

const ModernNavigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = {
    main: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'AI Tools', href: '/tools', icon: CpuChipIcon },
    ],
    secondary: [
      { name: 'Browse Categories', href: '/categories', icon: Cog6ToothIcon },
      { name: 'Popular Tags', href: '/tags', icon: DocumentTextIcon },
    ]
  };

  const roleSpecificNav = {
    owner: [
      { name: 'Admin Panel', href: '/admin', icon: Cog6ToothIcon },
      { name: 'Users', href: '/admin/users', icon: UsersIcon },
      { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    ],
    pm: [
      { name: 'Projects', href: '/pm/projects', icon: DocumentTextIcon },
      { name: 'Team', href: '/pm/team', icon: UsersIcon },
    ]
  };

  const userRole = user?.role?.name || 'user';
  const roleNav = roleSpecificNav[userRole] || [];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isCurrentPath = (href) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and main nav */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <CpuChipIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">AI Tools</span>
              </Link>

              {/* Main Navigation */}
              {isAuthenticated && (
                <div className="hidden md:flex items-center space-x-1">
                  {navigation.main.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = isCurrentPath(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        } px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}

                  {/* Role-specific navigation */}
                  {roleNav.length > 0 && (
                    <Menu as="div" className="relative">
                      <Menu.Button className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors">
                        <span>{userRole === 'owner' ? 'Admin' : userRole.toUpperCase()}</span>
                        <ChevronDownIcon className="w-4 h-4" />
                      </Menu.Button>
                      
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            {roleNav.map((item) => {
                              const IconComponent = item.icon;
                              return (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <Link
                                      href={item.href}
                                      className={`${
                                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                      } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                                    >
                                      <IconComponent className="w-4 h-4 mr-3" />
                                      {item.name}
                                    </Link>
                                  )}
                                </Menu.Item>
                              );
                            })}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )}
                </div>
              )}
            </div>

            {/* Center - Search Bar */}
            {isAuthenticated && (
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search AI tools..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Right side - Actions and user menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Quick Add Button */}
                  <Link
                    href="/tools/create"
                    className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Tool
                  </Link>

                  {/* Notifications */}
                  <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 relative">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-900"></span>
                  </button>

                  {/* User Menu */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-3 text-sm">
                      {user?.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <span className="hidden md:block text-gray-700 dark:text-gray-300 font-medium">
                        {user?.name || 'User'}
                      </span>
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/profile"
                                className={`${
                                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                              >
                                <UserIcon className="w-4 h-4 mr-3" />
                                Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/settings"
                                className={`${
                                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                              >
                                <Cog6ToothIcon className="w-4 h-4 mr-3" />
                                Settings
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                } flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                              >
                                Sign Out
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  {/* Mobile menu button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {isMobileMenuOpen ? (
                      <XMarkIcon className="w-6 h-6" />
                    ) : (
                      <Bars3Icon className="w-6 h-6" />
                    )}
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search AI tools..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Mobile Navigation Links */}
              {navigation.main.map((item) => {
                const IconComponent = item.icon;
                const isActive = isCurrentPath(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    } flex items-center px-3 py-2 rounded-md text-base font-medium`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Role-specific mobile nav */}
              {roleNav.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile Quick Actions */}
              <Link
                href="/tools/create"
                className="bg-blue-600 text-white hover:bg-blue-700 flex items-center px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <PlusIcon className="w-5 h-5 mr-3" />
                Add Tool
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default ModernNavigation;