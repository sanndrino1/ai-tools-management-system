'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';

export default function AdminToolsPage() {
  const { user, isAuthenticated } = useAuth();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTool, setNewTool] = useState({
    name: '',
    description: '',
    category: 'AI Writing',
    url: '',
    creator: '',
    icon: '🤖'
  });

  // Demo tools with extended structure
  const demoTools = [
    {
      id: 1,
      name: 'ChatGPT',
      description: 'Advanced conversational AI for writing, coding, and problem-solving',
      category: 'AI Writing',
      url: 'https://chat.openai.com',
      creator: 'OpenAI',
      icon: '🤖',
      difficulty_level: 'beginner',
      pricing_type: 'freemium',
      price_per_month: 20,
      features: ['Text Generation', 'Code Assistance', 'Translations'],
      average_rating: 4.8,
      total_ratings: 1250,
      view_count: 15420
    },
    {
      id: 2,
      name: 'GitHub Copilot',
      description: 'AI-powered code completion and programming assistant',
      category: 'AI Coding',
      url: 'https://github.com/features/copilot',
      creator: 'GitHub',
      icon: '💻',
      difficulty_level: 'intermediate',
      pricing_type: 'subscription',
      price_per_month: 10,
      features: ['Code Completion', 'Function Generation', 'Documentation'],
      average_rating: 4.6,
      total_ratings: 892,
      view_count: 12340
    },
    {
      id: 3,
      name: 'Midjourney',
      description: 'AI art generator for creating stunning visual content',
      category: 'AI Design',
      url: 'https://midjourney.com',
      creator: 'Midjourney Inc.',
      icon: '🎨',
      difficulty_level: 'beginner',
      pricing_type: 'subscription',
      price_per_month: 30,
      features: ['Image Generation', 'Art Styles', 'High Resolution'],
      average_rating: 4.7,
      total_ratings: 654,
      view_count: 18900
    }
  ];

  const categories = [
    'AI Writing', 'AI Coding', 'AI Design', 'AI Analysis', 
    'AI Automation', 'AI Media', 'AI Productivity', 'AI Business'
  ];

  useEffect(() => {
    if (isAuthenticated) {
      // Simulate loading
      setTimeout(() => {
        setTools(demoTools);
        setLoading(false);
      }, 1000);
    }
  }, [isAuthenticated]);

  const handleCreate = () => {
    if (!newTool.name || !newTool.description || !newTool.url) {
      alert('Please fill in all required fields');
      return;
    }

    const toolToAdd = {
      ...newTool,
      id: tools.length + 1,
      difficulty_level: 'beginner',
      pricing_type: 'unknown',
      price_per_month: 0,
      features: [],
      average_rating: 0,
      total_ratings: 0,
      view_count: 0
    };

    setTools([...tools, toolToAdd]);
    setShowAddModal(false);
    setNewTool({
      name: '',
      description: '',
      category: 'AI Writing',
      url: '',
      creator: '',
      icon: '🤖'
    });
    alert(`${newTool.name} has been added successfully!`);
  };

  const handleDelete = (toolId) => {
    if (confirm('Are you sure you want to delete this tool?')) {
      setTools(tools.filter(tool => tool.id !== toolId));
      alert('Tool deleted successfully');
    }
  };

  // Filter tools
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to manage AI tools.</p>
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
              <h1 className="text-3xl font-bold text-gray-900">🛠️ Enhanced AI Tools Manager</h1>
              <p className="text-gray-600 mt-1">Complete CRUD operations for AI tools</p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                ➕ Add New Tool
              </button>
              <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tools...</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tools..."
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                  />
                  
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="text-sm text-gray-600">
                  Showing {filteredTools.length} of {tools.length} tools
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <span className="text-blue-600 font-bold">🚀</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Total Tools</div>
                    <div className="text-2xl font-bold text-gray-900">{tools.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <span className="text-green-600 font-bold">📂</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Categories</div>
                    <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <span className="text-purple-600 font-bold">⭐</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Avg Rating</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {tools.length > 0 ? (tools.reduce((sum, tool) => sum + (tool.average_rating || 0), 0) / tools.length).toFixed(1) : '0'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                    <span className="text-orange-600 font-bold">👁️</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Total Views</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {tools.reduce((sum, tool) => sum + (tool.view_count || 0), 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <div key={tool.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow group">
                  {/* Tool Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{tool.icon}</div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => alert(`Editing ${tool.name} (Feature coming soon)`)}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          title="Edit tool"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(tool.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="Delete tool"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tool.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{tool.description}</p>
                  </div>

                  {/* Tool Card Body */}
                  <div className="px-6 pb-4">
                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-500">Difficulty</div>
                        <div className="font-medium capitalize">{tool.difficulty_level}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-500">Pricing</div>
                        <div className="font-medium capitalize">{tool.pricing_type}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-500">Rating</div>
                        <div className="font-medium">{tool.average_rating || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-500">Views</div>
                        <div className="font-medium">{tool.view_count?.toLocaleString() || 0}</div>
                      </div>
                    </div>

                    {tool.features && tool.features.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-2">Key Features:</div>
                        <div className="flex flex-wrap gap-1">
                          {tool.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                          {tool.features.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                              +{tool.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tool Card Footer */}
                  <div className="px-6 pb-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">by {tool.creator}</span>
                    <div className="flex space-x-2">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Visit
                      </a>
                      <button
                        onClick={() => alert(`Viewing details for ${tool.name}`)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedCategory 
                    ? 'Try adjusting your search or filters.'
                    : 'No tools available yet.'
                  }
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Tool Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl bg-white rounded-lg shadow-lg">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New AI Tool</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tool Name *
                  </label>
                  <input
                    type="text"
                    value={newTool.name}
                    onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., ChatGPT"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={newTool.description}
                    onChange={(e) => setNewTool({...newTool, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Brief description of what this tool does..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newTool.category}
                      onChange={(e) => setNewTool({...newTool, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon
                    </label>
                    <select
                      value={newTool.icon}
                      onChange={(e) => setNewTool({...newTool, icon: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {['🤖', '💻', '🎨', '🧠', '⚡', '🎬', '📝', '🖼️', '🔬', '💡'].map(icon => (
                        <option key={icon} value={icon}>{icon} {icon}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    value={newTool.url}
                    onChange={(e) => setNewTool({...newTool, url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Creator/Company
                  </label>
                  <input
                    type="text"
                    value={newTool.creator}
                    onChange={(e) => setNewTool({...newTool, creator: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., OpenAI"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewTool({
                      name: '',
                      description: '',
                      category: 'AI Writing',
                      url: '',
                      creator: '',
                      icon: '🤖'
                    });
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Add Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}