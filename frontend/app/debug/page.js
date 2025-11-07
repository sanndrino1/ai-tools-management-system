'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export default function DebugLoginPage() {
  const { user, isAuthenticated, loginWithEmail, isLoading } = useAuth();
  const [debugInfo, setDebugInfo] = useState('');

  const testLogin = async () => {
    setDebugInfo('Starting login test...');
    
    try {
      console.log('Testing login with owner@aitools.dev');
      const result = await loginWithEmail('owner@aitools.dev');
      console.log('Login result:', result);
      
      setDebugInfo(`Login result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error('Login error:', error);
      setDebugInfo(`Login error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Login Debug Page</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Current Auth State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Current Auth State</h2>
            <div className="space-y-2 text-sm">
              <p><strong>isAuthenticated:</strong> {String(isAuthenticated)}</p>
              <p><strong>isLoading:</strong> {String(isLoading)}</p>
              <p><strong>User:</strong></p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {user ? JSON.stringify(user, null, 2) : 'null'}
              </pre>
            </div>
          </div>

          {/* Test Login */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Test Login</h2>
            <button 
              onClick={testLogin}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Login with owner@aitools.dev'}
            </button>
            
            {debugInfo && (
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {debugInfo}
              </pre>
            )}
          </div>
        </div>

        {/* Demo Users */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Demo Users (Quick Login)</h2>
          <div className="grid gap-2 md:grid-cols-3">
            {[
              'owner@aitools.dev',
              'pm@aitools.dev', 
              'backend@aitools.dev',
              'frontend@aitools.dev',
              'qa@aitools.dev',
              'designer@aitools.dev'
            ].map(email => (
              <button
                key={email}
                onClick={() => loginWithEmail(email)}
                disabled={isLoading}
                className="text-left p-3 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                <div className="font-medium">{email.split('@')[0]}</div>
                <div className="text-sm text-gray-600">{email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center space-x-4">
          <a href="/login" className="text-blue-600 hover:text-blue-800 underline">
            Go to Real Login
          </a>
          <a href="/" className="text-blue-600 hover:text-blue-800 underline">
            Go to Home
          </a>
          <a href="/dashboard" className="text-blue-600 hover:text-blue-800 underline">
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}