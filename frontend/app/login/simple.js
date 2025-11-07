'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SimpleLoginPage() {
  const { loginWithEmail, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting login with:', email);
    
    try {
      const result = await loginWithEmail(email);
      console.log('Login result:', result);
      
      if (result?.success) {
        console.log('Login successful, redirecting...');
        router.push('/dashboard');
      } else {
        console.log('Login failed');
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error: ' + error.message);
    }
  };

  const quickLogin = (demoEmail) => {
    setEmail(demoEmail);
    loginWithEmail(demoEmail).then(result => {
      if (result?.success) {
        router.push('/dashboard');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sign in to AI Tools
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Demo Login:</h3>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin('owner@aitools.dev')}
                className="w-full text-left px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Owner</div>
                <div className="text-sm text-gray-600">owner@aitools.dev</div>
              </button>
              <button
                onClick={() => quickLogin('pm@aitools.dev')}
                className="w-full text-left px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Project Manager</div>
                <div className="text-sm text-gray-600">pm@aitools.dev</div>
              </button>
              <button
                onClick={() => quickLogin('backend@aitools.dev')}
                className="w-full text-left px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Backend Developer</div>
                <div className="text-sm text-gray-600">backend@aitools.dev</div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Demo system - all emails work</p>
          <p>Check browser console for debug info</p>
        </div>
      </div>
    </div>
  );
}