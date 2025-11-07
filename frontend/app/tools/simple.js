'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

export default function SimpleToolsPage() {
  const { user, isAuthenticated } = useAuth();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  const demoTools = [
    {
      id: 1,
      name: 'ChatGPT',
      description: 'Advanced conversational AI for writing, coding, and problem-solving',
      category: 'AI Writing',
      url: 'https://chat.openai.com',
      creator: 'OpenAI',
      icon: '🤖'
    },
    {
      id: 2,
      name: 'GitHub Copilot',
      description: 'AI-powered code completion and programming assistant',
      category: 'AI Coding',
      url: 'https://github.com/features/copilot',
      creator: 'GitHub',
      icon: '💻'
    },
    {
      id: 3,
      name: 'Midjourney',
      description: 'AI art generator for creating stunning visual content',
      category: 'AI Design',
      url: 'https://midjourney.com',
      creator: 'Midjourney Inc.',
      icon: '🎨'
    },
    {
      id: 4,
      name: 'Claude',
      description: 'Helpful AI assistant for analysis, writing, and reasoning',
      category: 'AI Analysis',
      url: 'https://claude.ai',
      creator: 'Anthropic',
      icon: '🧠'
    },
    {
      id: 5,
      name: 'Zapier AI',
      description: 'Intelligent automation for connecting apps and workflows',
      category: 'AI Automation',
      url: 'https://zapier.com/ai',
      creator: 'Zapier',
      icon: '⚡'
    },
    {
      id: 6,
      name: 'RunwayML',
      description: 'AI-powered video editing and generation platform',
      category: 'AI Media',
      url: 'https://runwayml.com',
      creator: 'Runway',
      icon: '🎬'
    },
    {
      id: 7,
      name: 'Notion AI',
      description: 'AI-powered writing and productivity assistant',
      category: 'AI Productivity',
      url: 'https://notion.so/ai',
      creator: 'Notion',
      icon: '📝'
    },
    {
      id: 8,
      name: 'Stable Diffusion',
      description: 'Open-source AI image generation model',
      category: 'AI Design',
      url: 'https://stability.ai',
      creator: 'Stability AI',
      icon: '🖼️'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadTools = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTools(demoTools);
      setLoading(false);
    };

    if (isAuthenticated) {
      loadTools();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to view AI tools.</p>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚀 AI Tools Directory</h1>
              <p className="text-gray-600 mt-1">Discover and manage AI-powered tools</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Dashboard
              </Link>
              <Link href="/" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* User Info */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">Welcome, {user?.name}!</h2>
          <p className="opacity-90">Role: {user?.role} • Email: {user?.email}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading AI tools...</p>
          </div>
        ) : (
          <>
            {/* Tools Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-2xl font-bold text-blue-600">{tools.length}</div>
                <div className="text-gray-600">Total Tools</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(tools.map(t => t.category)).size}
                </div>
                <div className="text-gray-600">Categories</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(tools.map(t => t.creator)).size}
                </div>
                <div className="text-gray-600">Creators</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-2xl font-bold text-orange-600">100%</div>
                <div className="text-gray-600">Demo Mode</div>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <div key={tool.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{tool.icon}</div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tool.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{tool.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">by {tool.creator}</span>
                    <div className="flex space-x-2">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Visit
                      </a>
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm transition-colors">
                        Info
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Categories Summary */}
            <div className="mt-12 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...new Set(tools.map(t => t.category))].map((category) => (
                  <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{category}</div>
                    <div className="text-sm text-gray-600">
                      {tools.filter(t => t.category === category).length} tools
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}