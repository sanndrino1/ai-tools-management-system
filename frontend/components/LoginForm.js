'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const { loginWithEmail, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [showDemoUsers, setShowDemoUsers] = useState(false);

  const demoUsers = [
    { email: 'owner@aitools.dev', role: 'Owner', description: 'Full system access' },
    { email: 'pm@aitools.dev', role: 'Project Manager', description: 'Project coordination' },
    { email: 'backend@aitools.dev', role: 'Backend Developer', description: 'Backend development' },
    { email: 'frontend@aitools.dev', role: 'Frontend Developer', description: 'Frontend development' },
    { email: 'qa@aitools.dev', role: 'QA Engineer', description: 'Quality assurance' },
    { email: 'designer@aitools.dev', role: 'Designer', description: 'UI/UX design' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      const result = await loginWithEmail(email.trim());
      if (result?.success) {
        router.push('/dashboard');
      }
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    const result = await loginWithEmail(demoEmail);
    if (result?.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">🚀</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to AI Tools
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to access the system
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-500">
                Or try demo accounts
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowDemoUsers(!showDemoUsers)}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              👥 Demo Users
              <span className="ml-2">{showDemoUsers ? '▲' : '▼'}</span>
            </button>

            {showDemoUsers && (
              <div className="mt-4 space-y-2">
                {demoUsers.map((user) => (
                  <button
                    key={user.email}
                    onClick={() => handleDemoLogin(user.email)}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <div className="font-medium text-gray-900">{user.role}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-xs text-gray-500">{user.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Demo system - all emails work</p>
          <p>Connected to Laravel backend at localhost:8000</p>
        </div>
      </div>
    </div>
  );
}