import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const ToolsList = () => {
  const router = useRouter();
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAiType, setSelectedAiType] = useState('');
  const [selectedPricingType, setSelectedPricingType] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTools();
    fetchCategories();
    fetchTags();
  }, [currentPage, searchTerm, selectedCategory, selectedTags, selectedAiType, selectedPricingType, sortBy, sortOrder]);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        sort_by: sortBy,
        sort_order: sortOrder
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedAiType) params.append('ai_type', selectedAiType);
      if (selectedPricingType) params.append('pricing_type', selectedPricingType);
      selectedTags.forEach(tag => params.append('tags[]', tag));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools?${params}`);
      const data = await response.json();
      
      setTools(data.data || []);
      setTotalPages(data.meta?.last_page || 1);
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast.error('Failed to load tools');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`);
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tags?popular=true&limit=20`);
      const data = await response.json();
      setTags(data.data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleDeleteTool = async (toolId) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools/${toolId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Tool deleted successfully');
        fetchTools(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete tool');
      }
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast.error('Failed to delete tool');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTags([]);
    setSelectedAiType('');
    setSelectedPricingType('');
    setCurrentPage(1);
  };

  const getDifficultyColor = (level) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getPricingColor = (type) => {
    const colors = {
      free: 'bg-green-100 text-green-800',
      freemium: 'bg-blue-100 text-blue-800',
      paid: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />);
      } else {
        stars.push(<StarIcon key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="ai-tools-list">
      {/* Header */}
      <div className="ai-page-header">
        <div className="ai-header-content">
          <div>
            <h1 className="ai-page-title">AI Tools</h1>
            <p className="ai-page-subtitle">Manage and organize your AI tools collection</p>
          </div>
          <Link href="/tools/create" className="ai-btn ai-btn-primary">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Tool
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="ai-filters-section">
        <div className="ai-search-bar">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ai-input pl-10 pr-4"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ai-btn ai-btn-secondary"
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="ai-filters-grid">
            <div className="ai-filter-group">
              <label className="ai-label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="ai-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="ai-filter-group">
              <label className="ai-label">AI Type</label>
              <select
                value={selectedAiType}
                onChange={(e) => setSelectedAiType(e.target.value)}
                className="ai-select"
              >
                <option value="">All Types</option>
                <option value="nlp">NLP</option>
                <option value="cv">Computer Vision</option>
                <option value="ml">Machine Learning</option>
                <option value="generative">Generative AI</option>
                <option value="automation">Automation</option>
                <option value="analysis">Analysis</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="ai-filter-group">
              <label className="ai-label">Pricing</label>
              <select
                value={selectedPricingType}
                onChange={(e) => setSelectedPricingType(e.target.value)}
                className="ai-select"
              >
                <option value="">All Pricing</option>
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div className="ai-filter-group">
              <label className="ai-label">Sort By</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="ai-select"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="popularity-desc">Most Popular</option>
              </select>
            </div>

            <div className="ai-filter-actions">
              <button onClick={clearFilters} className="ai-btn ai-btn-outline">
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tools Grid */}
      {loading ? (
        <div className="ai-loading-state">
          <div className="ai-spinner"></div>
          <p>Loading tools...</p>
        </div>
      ) : tools.length === 0 ? (
        <div className="ai-empty-state">
          <div className="ai-empty-icon">🤖</div>
          <h3 className="ai-empty-title">No tools found</h3>
          <p className="ai-empty-description">
            {searchTerm || selectedCategory || selectedTags.length > 0 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first AI tool'
            }
          </p>
          <Link href="/tools/create" className="ai-btn ai-btn-primary mt-4">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add First Tool
          </Link>
        </div>
      ) : (
        <div className="ai-tools-grid">
          {tools.map(tool => (
            <div key={tool.id} className="ai-tool-card">
              {/* Card Header */}
              <div className="ai-card-header">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {tool.logo_url && (
                      <img
                        src={tool.logo_url}
                        alt={tool.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="ai-card-title">{tool.name}</h3>
                      <p className="ai-card-subtitle">{tool.short_description}</p>
                    </div>
                  </div>
                  {tool.is_featured && (
                    <StarIconSolid className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="ai-card-content">
                <p className="ai-card-description">{tool.description}</p>
                
                {/* Badges */}
                <div className="ai-badges-row">
                  <span className={`ai-badge ${getDifficultyColor(tool.difficulty_level)}`}>
                    {tool.difficulty_level}
                  </span>
                  <span className={`ai-badge ${getPricingColor(tool.pricing_type)}`}>
                    {tool.pricing_type}
                  </span>
                  <span className="ai-badge bg-blue-100 text-blue-800">
                    {tool.ai_type?.toUpperCase()}
                  </span>
                </div>

                {/* Categories */}
                {tool.categories && tool.categories.length > 0 && (
                  <div className="ai-categories-row">
                    {tool.categories.slice(0, 3).map(category => (
                      <span key={category.id} className="ai-category-badge">
                        {category.icon} {category.name}
                      </span>
                    ))}
                    {tool.categories.length > 3 && (
                      <span className="ai-category-badge">
                        +{tool.categories.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Tags */}
                {tool.tags && tool.tags.length > 0 && (
                  <div className="ai-tags-row">
                    <TagIcon className="w-4 h-4 text-gray-400" />
                    <div className="ai-tags-list">
                      {tool.tags.slice(0, 4).map(tag => (
                        <span key={tag.id} className="ai-tag">
                          {tag.name}
                        </span>
                      ))}
                      {tool.tags.length > 4 && (
                        <span className="ai-tag">+{tool.tags.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Rating and Stats */}
                <div className="ai-stats-row">
                  <div className="flex items-center space-x-1">
                    {renderStars(tool.average_rating)}
                    <span className="text-sm text-gray-600">
                      ({tool.total_ratings})
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {tool.view_count} views
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="ai-card-actions">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ai-btn ai-btn-outline ai-btn-sm"
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Visit
                </a>
                <Link
                  href={`/tools/${tool.id}/edit`}
                  className="ai-btn ai-btn-outline ai-btn-sm"
                >
                  <PencilSquareIcon className="w-4 h-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteTool(tool.id)}
                  className="ai-btn ai-btn-danger ai-btn-sm"
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="ai-pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="ai-btn ai-btn-outline"
          >
            Previous
          </button>
          
          <div className="ai-pagination-info">
            Page {currentPage} of {totalPages}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="ai-btn ai-btn-outline"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ToolsList;