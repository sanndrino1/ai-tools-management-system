'use client';

import { useState } from 'react';

export default function TestPage() {
  const [message, setMessage] = useState('Test page loaded successfully!');

  const testLogin = () => {
    setMessage('Testing login functionality...');
    
    // Simulate demo login
    const demoUser = {
      id: 1,
      name: 'Test User',
      email: 'test@aitools.dev',
      role: 'owner'
    };
    
    localStorage.setItem('ai-tools-user', JSON.stringify(demoUser));
    setMessage('Demo user saved to localStorage!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center">Test Login Page</h1>
        
        <div className="text-center">
          <p className="text-gray-600 mb-4">{message}</p>
          
          <button 
            onClick={testLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Test Demo Login
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-bold">Available demo emails:</h3>
          <ul className="text-gray-600">
            <li>• owner@aitools.dev</li>
            <li>• pm@aitools.dev</li>
            <li>• backend@aitools.dev</li>
            <li>• frontend@aitools.dev</li>
            <li>• qa@aitools.dev</li>
            <li>• designer@aitools.dev</li>
          </ul>
        </div>

        <div className="text-center">
          <a 
            href="/login" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Go to Real Login Page
          </a>
        </div>
      </div>
    </div>
  );
}