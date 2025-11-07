'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AINavigationSystem } from '../../components/AINavigationSystem';
import { 
  AICard, 
  AIToolCard, 
  AIButton, 
  AIInput, 
  AISelect, 
  AIBadge, 
  AIModal, 
  AILoading, 
  AIEmptyState,
  AIToast 
} from '../../components/UIComponents';

export default function ToolsPage() {
  const { user, isAuthenticated } = useAuth();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  // AI-Generated Categories
  const categories = [
    { value: 'ai-writing', label: '✍️ AI Writing' },
    { value: 'ai-coding', label: '💻 AI Coding' },
    { value: 'ai-design', label: '🎨 AI Design' },
    { value: 'ai-analysis', label: '📊 AI Analysis' },
    { value: 'ai-automation', label: '🤖 AI Automation' },
    { value: 'ai-media', label: '🎬 AI Media' },
    { value: 'ai-business', label: '💼 AI Business' },
    { value: 'ai-education', label: '📚 AI Education' },
  ];

  const statusOptions = [
    { value: 'active', label: '✅ Active' },
    { value: 'inactive', label: '⏸️ Inactive' },
    { value: 'beta', label: '🧪 Beta' },
    { value: 'deprecated', label: '⚠️ Deprecated' },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchTools();
    }
  }, [isAuthenticated]);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools`);
      if (response.ok) {
        const data = await response.json();
        setTools(data);
      } else {
        // Use demo data if backend fails
        loadDemoTools();
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
      // Use demo data if backend is not available
      loadDemoTools();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoTools = () => {
    const demoTools = [
      {
        id: 1,
        name: 'ChatGPT',
        description: 'Advanced conversational AI for writing, coding, and problem-solving',
        category: 'ai-writing',
        url: 'https://chat.openai.com',
        is_active: true,
        creator: 'OpenAI',
        tags: ['conversation', 'writing', 'coding']
      },
      {
        id: 2,
        name: 'GitHub Copilot',
        description: 'AI-powered code completion and programming assistant',
        category: 'ai-coding',
        url: 'https://github.com/features/copilot',
        is_active: true,
        creator: 'GitHub',
        tags: ['coding', 'autocomplete', 'development']
      },
      {
        id: 3,
        name: 'Midjourney',
        description: 'AI art generator for creating stunning visual content',
        category: 'ai-design',
        url: 'https://midjourney.com',
        is_active: true,
        creator: 'Midjourney Inc.',
        tags: ['art', 'design', 'creativity']
      },
      {
        id: 4,
        name: 'Claude',
        description: 'Helpful AI assistant for analysis, writing, and reasoning',
        category: 'ai-analysis',
        url: 'https://claude.ai',
        is_active: true,
        creator: 'Anthropic',
        tags: ['analysis', 'reasoning', 'writing']
      },
      {
        id: 5,
        name: 'Zapier AI',
        description: 'Intelligent automation for connecting apps and workflows',
        category: 'ai-automation',
        url: 'https://zapier.com/ai',
        is_active: true,
        creator: 'Zapier',
        tags: ['automation', 'workflows', 'integration']
      },
      {
        id: 6,
        name: 'RunwayML',
        description: 'AI-powered video editing and generation platform',
        category: 'ai-media',
        url: 'https://runwayml.com',
        is_active: true,
        creator: 'Runway',
        tags: ['video', 'media', 'editing']
      }
    ];
    setTools(demoTools);
    showToast('Demo mode: Showing sample AI tools', 'info');
  };

  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
  };

  const handleAddTool = () => {
    setIsAddModalOpen(true);
  };

  const handleEditTool = (tool) => {
    showToast(`Edit functionality for "${tool.name}" coming soon!`, 'info');
  };

  const handleDeleteTool = (tool) => {
    if (confirm(`Are you sure you want to delete "${tool.name}"?`)) {
      showToast(`"${tool.name}" deleted successfully!`, 'success');
      // In real implementation, make API call to delete
    }
  };

  // Filter tools based on search and filters
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    const matchesStatus = !selectedStatus || 
                         (selectedStatus === 'active' && tool.is_active) ||
                         (selectedStatus === 'inactive' && !tool.is_active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const canAddTools = ['owner', 'pm', 'backend', 'frontend'].includes(user?.role?.name);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view AI tools.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AINavigationSystem />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Tools Directory</h1>
                <p className="text-gray-600">
                  Discover and manage AI-powered tools for your workflow
                </p>
              </div>
              
              {canAddTools && (
                <div className="mt-4 sm:mt-0">
                  <AIButton onClick={handleAddTool} className="w-full sm:w-auto">
                    ➕ Add New Tool
                  </AIButton>
                </div>
              )}
            </div>
          </div>

          {/* Filters Section */}
          <AICard className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <AIInput
                  placeholder="🔍 Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon="🔍"
                />
              </div>
              
              <AISelect
                placeholder="All Categories"
                options={categories}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
              
              <AISelect
                placeholder="All Status"
                options={statusOptions}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              />
            </div>
            
            {/* Active Filters */}
            {(searchTerm || selectedCategory || selectedStatus) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">Active filters:</span>
                
                {searchTerm && (
                  <AIBadge variant="info" className="cursor-pointer" onClick={() => setSearchTerm('')}>
                    Search: "{searchTerm}" ✕
                  </AIBadge>
                )}
                
                {selectedCategory && (
                  <AIBadge variant="info" className="cursor-pointer" onClick={() => setSelectedCategory('')}>
                    Category: {categories.find(c => c.value === selectedCategory)?.label} ✕
                  </AIBadge>
                )}
                
                {selectedStatus && (
                  <AIBadge variant="info" className="cursor-pointer" onClick={() => setSelectedStatus('')}>
                    Status: {statusOptions.find(s => s.value === selectedStatus)?.label} ✕
                  </AIBadge>
                )}
                
                <AIButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedStatus('');
                  }}
                >
                  Clear All
                </AIButton>
              </div>
            )}
          </AICard>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <AICard className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{tools.length}</p>
                <p className="text-sm text-gray-600">Total Tools</p>
              </div>
            </AICard>
            
            <AICard className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {tools.filter(t => t.is_active).length}
                </p>
                <p className="text-sm text-gray-600">Active Tools</p>
              </div>
            </AICard>
            
            <AICard className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(tools.map(t => t.category)).size}
                </p>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
            </AICard>
            
            <AICard className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{filteredTools.length}</p>
                <p className="text-sm text-gray-600">Filtered Results</p>
              </div>
            </AICard>
          </div>

          {/* Tools Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <AILoading size="lg" message="Loading AI tools..." />
            </div>
          ) : filteredTools.length === 0 ? (
            <AIEmptyState
              icon="🔍"
              title="No tools found"
              description={
                searchTerm || selectedCategory || selectedStatus
                  ? "Try adjusting your filters to see more results."
                  : "No AI tools have been added yet."
              }
              action={
                canAddTools && !searchTerm && !selectedCategory && !selectedStatus && (
                  <AIButton onClick={handleAddTool}>
                    ➕ Add First Tool
                  </AIButton>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <AIToolCard
                  key={tool.id}
                  tool={tool}
                  userRole={user?.role?.name}
                  onEdit={handleEditTool}
                  onDelete={handleDeleteTool}
                />
              ))}
            </div>
          )}

          {/* Pagination (for future implementation) */}
          {filteredTools.length > 0 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <AIButton variant="secondary" size="sm" disabled>
                  ← Previous
                </AIButton>
                <AIBadge variant="primary">Page 1 of 1</AIBadge>
                <AIButton variant="secondary" size="sm" disabled>
                  Next →
                </AIButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Tool Modal */}
      <AIModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New AI Tool"
        size="lg"
      >
        <div className="space-y-6">
          <p className="text-gray-600">
            Tool creation functionality will be implemented in the next phase. 
            This modal demonstrates the UI structure.
          </p>
          
          <div className="flex justify-end space-x-4">
            <AIButton variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </AIButton>
            <AIButton onClick={() => {
              setIsAddModalOpen(false);
              showToast('Tool creation feature coming soon!', 'info');
            }}>
              Create Tool
            </AIButton>
          </div>
        </div>
      </AIModal>

      {/* Toast Notifications */}
      <AIToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </>
  );
}