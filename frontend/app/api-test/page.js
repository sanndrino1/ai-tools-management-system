'use client';

import { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runApiTests = async () => {
    setLoading(true);
    setResults([]);
    
    const tests = [
      {
        name: 'Backend Health Check',
        url: 'http://localhost:8001',
        expected: 'Laravel welcome page'
      },
      {
        name: 'Tools API',
        url: 'http://localhost:8001/api/tools',
        expected: 'Array of AI tools'
      },
      {
        name: 'Users API',
        url: 'http://localhost:8001/api/users',
        expected: 'Array of users with roles'
      },
      {
        name: 'Roles API',
        url: 'http://localhost:8001/api/roles',
        expected: 'Array of roles with user counts'
      }
    ];

    for (const test of tests) {
      try {
        const startTime = Date.now();
        const response = await fetch(test.url);
        const endTime = Date.now();
        const duration = endTime - startTime;

        let result = {
          ...test,
          status: response.ok ? 'success' : 'error',
          statusCode: response.status,
          duration: `${duration}ms`,
          data: null,
          error: null
        };

        if (response.ok) {
          try {
            const data = await response.json();
            result.data = Array.isArray(data) ? 
              `Array with ${data.length} items` : 
              typeof data === 'object' ? 
                `Object with keys: ${Object.keys(data).join(', ')}` :
                data;
          } catch (e) {
            result.data = 'Non-JSON response (likely HTML)';
          }
        } else {
          result.error = `HTTP ${response.status} ${response.statusText}`;
        }

        setResults(prev => [...prev, result]);
      } catch (error) {
        setResults(prev => [...prev, {
          ...test,
          status: 'error',
          error: error.message,
          duration: 'Failed'
        }]);
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    runApiTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              🧪 API Integration Tests
            </h1>
            <p className="text-gray-600 mt-2">
              Testing connection between Next.js frontend and Laravel backend
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔗</span>
                <span className="font-medium">Backend URL: http://localhost:8001</span>
              </div>
              <button
                onClick={runApiTests}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? '🔄 Testing...' : '🔄 Retry Tests'}
              </button>
            </div>

            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    result.status === 'success' 
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <span className="mr-2">
                        {result.status === 'success' ? '✅' : '❌'}
                      </span>
                      {result.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {result.statusCode && (
                        <span className={`px-2 py-1 rounded ${
                          result.status === 'success' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {result.statusCode}
                        </span>
                      )}
                      <span>{result.duration}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>URL:</strong> {result.url}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Expected:</strong> {result.expected}
                  </p>
                  
                  {result.data && (
                    <p className="text-sm text-green-700">
                      <strong>Response:</strong> {result.data}
                    </p>
                  )}
                  
                  {result.error && (
                    <p className="text-sm text-red-700">
                      <strong>Error:</strong> {result.error}
                    </p>
                  )}
                </div>
              ))}

              {loading && results.length < 4 && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600">Running tests...</span>
                  </div>
                </div>
              )}
            </div>

            {results.length > 0 && !loading && (
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  📊 Test Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Total Tests:</span>
                    <span className="ml-2 font-medium">{results.length}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Passed:</span>
                    <span className="ml-2 font-medium">
                      {results.filter(r => r.status === 'success').length}
                    </span>
                  </div>
                  <div>
                    <span className="text-red-700">Failed:</span>
                    <span className="ml-2 font-medium">
                      {results.filter(r => r.status === 'error').length}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Success Rate:</span>
                    <span className="ml-2 font-medium">
                      {Math.round((results.filter(r => r.status === 'success').length / results.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                🏠 Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}