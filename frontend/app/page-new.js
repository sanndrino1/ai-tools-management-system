'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Tools System
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to the simplified AI Tools Management System
          </p>
          
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg mb-4"
          >
            Go to Login
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}