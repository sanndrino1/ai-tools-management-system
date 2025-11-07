'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import { ToolCard, Dropdown, Button, Modal, Input } from '../../components/EnhancedUI';
import { useToast, ToastContainer } from '../../components/EnhancedToast';

export default function ToolsPage() {
  const { user, isAuthenticated } = useAuth();
  const { toasts, success, error, warning, info, removeToast } = useToast();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [newTool, setNewTool] = useState({
    name: '',
    description: '',
    category: 'AI Writing',
    url: '',
    creator: '',
    icon: '🤖'
  });

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

  const categories = [
    'AI Writing', 'AI Coding', 'AI Design', 'AI Analysis', 
    'AI Automation', 'AI Media', 'AI Productivity', 'AI Business'
  ];

  const icons = ['🤖', '💻', '🎨', '🧠', '⚡', '🎬', '📝', '🖼️', '🔬', '💡', '🎯', '🚀'];

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

  const handleAddTool = () => {
    setShowAddModal(true);
  };

  const handleSaveTool = () => {
    if (!newTool.name || !newTool.description || !newTool.url) {
      error('Please fill in all required fields', {
        title: 'Validation Error'
      });
      return;
    }

    const toolToAdd = {
      ...newTool,
      id: tools.length + 1,
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
    success(`${newTool.name} has been added successfully!`, {
      title: 'Tool Added'
    });
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setNewTool({
      name: '',
      description: '',
      category: 'AI Writing', 
      url: '',
      creator: '',
      icon: '🤖'
    });
  };

  // Filter tools based on selected category
  const filteredTools = selectedCategory 
    ? tools.filter(tool => tool.category === selectedCategory)
    : tools;

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
              <button 
                onClick={handleAddTool}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                ➕ Add New Tool
              </button>
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

            {/* Filters and Controls */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4">
                  <Dropdown
                    options={categories.map(cat => ({ label: cat, value: cat }))}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="All Categories"
                    className="w-48"
                  />
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">View:</span>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded text-sm ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded text-sm ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      List
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  Showing {filteredTools.length} of {tools.length} tools
                </div>
              </div>
            </div>

            {/* Tools Grid */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onView={(tool) => info(`Viewing details for ${tool.name}`, {
                    title: 'Tool Details',
                    duration: 2000
                  })}
                />
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
                <p className="text-gray-600 mb-4">
                  {selectedCategory 
                    ? `No tools found in "${selectedCategory}" category.`
                    : 'No tools available yet.'
                  }
                </p>
                <Button onClick={() => setSelectedCategory('')} variant="outline">
                  Show All Tools
                </Button>
              </div>
            )}

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

      {/* Add New Tool Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCancelAdd}
        title="Add New AI Tool"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Tool Name"
            value={newTool.name}
            onChange={(e) => setNewTool({...newTool, name: e.target.value})}
            placeholder="e.g., ChatGPT"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newTool.description}
              onChange={(e) => setNewTool({...newTool, description: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of what this tool does..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <Dropdown
              options={categories.map(cat => ({ label: cat, value: cat }))}
              value={newTool.category}
              onChange={(value) => setNewTool({...newTool, category: value})}
              placeholder="Select category"
            />
          </div>

          <Input
            label="Website URL"
            type="url"
            value={newTool.url}
            onChange={(e) => setNewTool({...newTool, url: e.target.value})}
            placeholder="https://example.com"
            required
          />

          <Input
            label="Creator/Company"
            value={newTool.creator}
            onChange={(e) => setNewTool({...newTool, creator: e.target.value})}
            placeholder="e.g., OpenAI"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <Dropdown
              options={icons.map(icon => ({ label: `${icon} ${icon}`, value: icon }))}
              value={newTool.icon}
              onChange={(value) => setNewTool({...newTool, icon: value})}
              placeholder="Select icon"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            onClick={handleCancelAdd}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveTool}
            variant="primary"
            className="flex-1"
          >
            Add Tool
          </Button>
        </div>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}