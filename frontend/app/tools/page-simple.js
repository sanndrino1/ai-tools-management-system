'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SimpleToolsPage() {
  const [tools] = useState([
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
      category: 'Development',
      url: 'https://github.com/features/copilot',
      creator: 'GitHub',
      icon: '🚀'
    },
    {
      id: 3,
      name: 'Midjourney',
      description: 'AI image generation and artistic creation platform',
      category: 'Image Generation',
      url: 'https://midjourney.com',
      creator: 'Midjourney Inc.',
      icon: '🎨'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🛠 AI Tools Collection
          </h1>
          <p className="text-gray-600 mb-6">
            Discover and manage powerful AI tools for your projects
          </p>
          
          {/* Navigation */}
          <div className="flex space-x-4 mb-6">
            <Link href="/admin/tools" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              🔧 Admin Panel (Full CRUD)
            </Link>
            <Link href="/login" 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              🔑 Login
            </Link>
            <Link href="/dashboard" 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
              📊 Dashboard
            </Link>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div key={tool.id} 
                 className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{tool.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-500">{tool.creator}</p>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                {tool.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {tool.category}
                </span>
                
                <a href={tool.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Visit →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to manage AI tools professionally?
            </h2>
            <p className="text-gray-600 mb-6">
              Use our full CRUD admin panel to create, edit, and organize your AI tools collection.
            </p>
            <Link href="/admin/tools" 
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all transform hover:scale-105">
              🚀 Open Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}