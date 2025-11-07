'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ToolCard, Dropdown, Button, Modal, Input, EnhancedCard } from './EnhancedUI';
import { useTools, useCategories, useToolForm, useBulkOperations } from '../lib/toolsHooks';
import { useToast, ToastContainer } from './EnhancedToast';
import toolsService from '../lib/toolsService';

export default function EnhancedToolsManager() {
  const { user, isAuthenticated } = useAuth();
  const { toasts, success, error, warning, info, removeToast } = useToast();

  // State management
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);

  // Form state with extended fields for future expansion
  const [formData, setFormData] = useState({
    // Basic fields
    name: '',
    description: '',
    short_description: '',
    category: '',
    url: '',
    creator: '',
    icon: '🤖',
    
    // Extended fields for future
    documentation_url: '',
    video_url: '',
    github_url: '',
    difficulty_level: 'beginner',
    pricing_type: 'unknown',
    price_per_month: 0,
    features: [],
    supported_formats: [],
    integrations: [],
    target_roles: [],
    tags: [],
    screenshots: [],
    metadata: {}
  });

  // Extended categories and options for future expansion
  const extendedCategories = [
    'AI Writing', 'AI Coding', 'AI Design', 'AI Analysis', 
    'AI Automation', 'AI Media', 'AI Productivity', 'AI Business',
    'AI Research', 'AI Education', 'AI Healthcare', 'AI Finance'
  ];

  const difficultyLevels = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
    { label: 'Expert', value: 'expert' }
  ];

  const pricingTypes = [
    { label: 'Free', value: 'free' },
    { label: 'Freemium', value: 'freemium' },
    { label: 'Paid', value: 'paid' },
    { label: 'Subscription', value: 'subscription' },
    { label: 'Enterprise', value: 'enterprise' },
    { label: 'Unknown', value: 'unknown' }
  ];

  const targetRoles = [
    'Developer', 'Designer', 'Product Manager', 'Marketing', 
    'Sales', 'Content Creator', 'Analyst', 'Student', 'Researcher'
  ];

  // =================== Data Loading ===================

  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
    }
  }, [isAuthenticated]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // In production, these would be real API calls
      // For demo, using mock data with extended structure
      const mockTools = [
        {
          id: 1,
          name: 'ChatGPT',
          description: 'Advanced conversational AI for writing, coding, and problem-solving with extensive capabilities',
          short_description: 'Advanced conversational AI',
          category: 'AI Writing',
          url: 'https://chat.openai.com',
          creator: 'OpenAI',
          icon: '🤖',
          documentation_url: 'https://platform.openai.com/docs',
          video_url: 'https://youtube.com/watch?v=example',
          difficulty_level: 'beginner',
          pricing_type: 'freemium',
          price_per_month: 20,
          features: ['Text Generation', 'Code Assistance', 'Translations', 'Creative Writing'],
          supported_formats: ['Text', 'Code', 'Markdown'],
          integrations: ['API', 'Plugins', 'Third-party Apps'],
          target_roles: ['Developer', 'Content Creator', 'Student'],
          average_rating: 4.8,
          total_ratings: 1250,
          view_count: 15420,
          usage_count: 8934,
          is_featured: true,
          created_at: '2024-01-15',
          updated_at: '2024-11-07'
        },
        {
          id: 2,
          name: 'GitHub Copilot',
          description: 'AI-powered code completion and programming assistant that helps developers write code faster',
          short_description: 'AI code completion assistant',
          category: 'AI Coding',
          url: 'https://github.com/features/copilot',
          creator: 'GitHub',
          icon: '💻',
          documentation_url: 'https://docs.github.com/copilot',
          github_url: 'https://github.com/features/copilot',
          difficulty_level: 'intermediate',
          pricing_type: 'subscription',
          price_per_month: 10,
          features: ['Code Completion', 'Function Generation', 'Documentation', 'Test Writing'],
          supported_formats: ['JavaScript', 'Python', 'TypeScript', 'Go', 'Ruby'],
          integrations: ['VS Code', 'JetBrains', 'Neovim'],
          target_roles: ['Developer', 'Engineer'],
          average_rating: 4.6,
          total_ratings: 892,
          view_count: 12340,
          usage_count: 7821
        }
      ];

      setTools(mockTools);
      setCategories(extendedCategories);
      
      success('Tools loaded successfully', { title: 'Data Loaded' });
    } catch (err) {
      error('Failed to load tools', { title: 'Loading Error' });
    } finally {
      setLoading(false);
    }
  };

  // =================== CRUD Operations ===================

  const handleCreate = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.url) {
        error('Please fill in all required fields', { title: 'Validation Error' });
        return;
      }

      // In production: const newTool = await toolsService.createTool(formData);
      const newTool = {
        ...formData,
        id: tools.length + 1,
        average_rating: 0,
        total_ratings: 0,
        view_count: 0,
        usage_count: 0,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setTools([...tools, newTool]);
      setShowAddModal(false);
      resetForm();
      success(`${formData.name} has been added successfully!`, { title: 'Tool Added' });
      
    } catch (err) {
      error('Failed to create tool', { title: 'Creation Error' });
    }
  };

  const handleUpdate = async () => {
    try {
      if (!currentTool) return;

      // In production: const updatedTool = await toolsService.updateTool(currentTool.id, formData);
      const updatedTool = {
        ...currentTool,
        ...formData,
        updated_at: new Date().toISOString()
      };

      setTools(tools.map(tool => 
        tool.id === currentTool.id ? updatedTool : tool
      ));
      
      setShowEditModal(false);
      resetForm();
      setCurrentTool(null);
      success(`${formData.name} has been updated successfully!`, { title: 'Tool Updated' });
      
    } catch (err) {
      error('Failed to update tool', { title: 'Update Error' });
    }
  };

  const handleDelete = async () => {
    try {
      if (!currentTool) return;

      // In production: await toolsService.deleteTool(currentTool.id);
      setTools(tools.filter(tool => tool.id !== currentTool.id));
      
      setShowDeleteModal(false);
      setCurrentTool(null);
      warning(`${currentTool.name} has been deleted`, { title: 'Tool Deleted' });
      
    } catch (err) {
      error('Failed to delete tool', { title: 'Deletion Error' });
    }
  };

  // =================== Helper Functions ===================

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      short_description: '',
      category: '',
      url: '',
      creator: '',
      icon: '🤖',
      documentation_url: '',
      video_url: '',
      github_url: '',
      difficulty_level: 'beginner',
      pricing_type: 'unknown',
      price_per_month: 0,
      features: [],
      supported_formats: [],
      integrations: [],
      target_roles: [],
      tags: [],
      screenshots: [],
      metadata: {}
    });
  };

  const openEditModal = (tool) => {
    setCurrentTool(tool);
    setFormData({ ...tool });
    setShowEditModal(true);
  };

  const openDeleteModal = (tool) => {
    setCurrentTool(tool);
    setShowDeleteModal(true);
  };

  const openDetailsModal = (tool) => {
    setCurrentTool(tool);
    setShowDetailsModal(true);
  };

  // Filter tools based on search and category
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // =================== Render Functions ===================

  const renderToolForm = () => (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 border-b pb-2">Basic Information</h4>
        
        <Input
          label="Tool Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="e.g., ChatGPT"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Detailed description of the tool..."
            required
          />
        </div>

        <Input
          label="Short Description"
          value={formData.short_description}
          onChange={(e) => setFormData({...formData, short_description: e.target.value})}
          placeholder="Brief one-line description"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <Dropdown
            options={extendedCategories.map(cat => ({ label: cat, value: cat }))}
            value={formData.category}
            onChange={(value) => setFormData({...formData, category: value})}
            placeholder="Select category"
          />
        </div>

        <Input
          label="Website URL"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({...formData, url: e.target.value})}
          placeholder="https://example.com"
          required
        />

        <Input
          label="Creator/Company"
          value={formData.creator}
          onChange={(e) => setFormData({...formData, creator: e.target.value})}
          placeholder="e.g., OpenAI"
        />
      </div>

      {/* Extended Information for Future Expansion */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 border-b pb-2">Additional Information</h4>
        
        <Input
          label="Documentation URL"
          type="url"
          value={formData.documentation_url}
          onChange={(e) => setFormData({...formData, documentation_url: e.target.value})}
          placeholder="https://docs.example.com"
        />

        <Input
          label="Video Tutorial URL"
          type="url"
          value={formData.video_url}
          onChange={(e) => setFormData({...formData, video_url: e.target.value})}
          placeholder="https://youtube.com/..."
        />

        <Input
          label="GitHub Repository"
          type="url"
          value={formData.github_url}
          onChange={(e) => setFormData({...formData, github_url: e.target.value})}
          placeholder="https://github.com/..."
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
          <Dropdown
            options={difficultyLevels}
            value={formData.difficulty_level}
            onChange={(value) => setFormData({...formData, difficulty_level: value})}
            placeholder="Select difficulty"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Type</label>
          <Dropdown
            options={pricingTypes}
            value={formData.pricing_type}
            onChange={(value) => setFormData({...formData, pricing_type: value})}
            placeholder="Select pricing model"
          />
        </div>

        <Input
          label="Price per Month (USD)"
          type="number"
          value={formData.price_per_month}
          onChange={(e) => setFormData({...formData, price_per_month: parseFloat(e.target.value) || 0})}
          placeholder="0"
        />
      </div>
    </div>
  );

  const renderToolDetails = () => {
    if (!currentTool) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{currentTool.icon}</div>
          <div>
            <h3 className="text-xl font-semibold">{currentTool.name}</h3>
            <p className="text-gray-600">{currentTool.creator}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">Category</div>
            <div className="font-medium">{currentTool.category}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">Difficulty</div>
            <div className="font-medium capitalize">{currentTool.difficulty_level || 'Unknown'}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">Pricing</div>
            <div className="font-medium capitalize">{currentTool.pricing_type || 'Unknown'}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">Rating</div>
            <div className="font-medium">
              {currentTool.average_rating ? `${currentTool.average_rating}/5` : 'No ratings'}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-gray-700">{currentTool.description}</p>
        </div>

        {currentTool.features && currentTool.features.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Key Features</h4>
            <div className="flex flex-wrap gap-2">
              {currentTool.features.map((feature, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button 
            onClick={() => window.open(currentTool.url, '_blank')}
            variant="primary"
          >
            Visit Tool
          </Button>
          {currentTool.documentation_url && (
            <Button 
              onClick={() => window.open(currentTool.documentation_url, '_blank')}
              variant="outline"
            >
              Documentation
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EnhancedCard className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to manage AI tools.</p>
        </EnhancedCard>
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
              <h1 className="text-3xl font-bold text-gray-900">🚀 Enhanced AI Tools Manager</h1>
              <p className="text-gray-600 mt-1">Complete CRUD operations with future-ready extensions</p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={() => setShowAddModal(true)} variant="success">
                ➕ Add New Tool
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tools...</p>
          </div>
        ) : (
          <>
            {/* Filters and Search */}
            <EnhancedCard className="mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tools..."
                    className="w-64"
                  />
                  
                  <Dropdown
                    options={extendedCategories.map(cat => ({ label: cat, value: cat }))}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="All Categories"
                    className="w-48"
                  />
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">View:</span>
                    <Button
                      onClick={() => setViewMode('grid')}
                      variant={viewMode === 'grid' ? 'primary' : 'outline'}
                      size="sm"
                    >
                      Grid
                    </Button>
                    <Button
                      onClick={() => setViewMode('list')}
                      variant={viewMode === 'list' ? 'primary' : 'outline'}
                      size="sm"
                    >
                      List
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  Showing {filteredTools.length} of {tools.length} tools
                </div>
              </div>
            </EnhancedCard>

            {/* Tools Grid */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onView={openDetailsModal}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                />
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
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Tool Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New AI Tool"
        size="lg"
      >
        {renderToolForm()}
        <div className="flex space-x-3 mt-6">
          <Button
            onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="primary"
            className="flex-1"
          >
            Add Tool
          </Button>
        </div>
      </Modal>

      {/* Edit Tool Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
          setCurrentTool(null);
        }}
        title="Edit AI Tool"
        size="lg"
      >
        {renderToolForm()}
        <div className="flex space-x-3 mt-6">
          <Button
            onClick={() => {
              setShowEditModal(false);
              resetForm();
              setCurrentTool(null);
            }}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="primary"
            className="flex-1"
          >
            Update Tool
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentTool(null);
        }}
        title="Delete Tool"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Are you sure?</h3>
          <p className="text-gray-600 mb-6">
            This will permanently delete "{currentTool?.name}". This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <Button
              onClick={() => {
                setShowDeleteModal(false);
                setCurrentTool(null);
              }}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="danger"
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Tool Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setCurrentTool(null);
        }}
        title="Tool Details"
        size="lg"
      >
        {renderToolDetails()}
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}