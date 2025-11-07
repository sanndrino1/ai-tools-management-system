import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

const ToolForm = ({ tool = null, onSubmit, onCancel }) => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    url: '',
    website_url: '',
    documentation_url: '',
    video_url: '',
    github_url: '',
    logo_url: '',
    screenshots: [],
    ai_type: 'nlp',
    difficulty_level: 'intermediate',
    pricing_type: 'free',
    price_per_month: '',
    features: [],
    supported_formats: [],
    integrations: [],
    target_roles: [],
    metadata: {},
    admin_notes: '',
    categories: [],
    primary_category: '',
    tags: [],
    status: 'draft',
    is_featured: false,
    featured_until: ''
  });

  useEffect(() => {
    fetchCategories();
    fetchTags();
    
    if (tool) {
      setFormData({
        ...tool,
        categories: tool.categories?.map(cat => cat.id) || [],
        primary_category: tool.categories?.find(cat => cat.pivot?.is_primary)?.id || '',
        tags: tool.tags?.map(tag => tag.id) || [],
      });
    }
  }, [tool]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`);
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tags`);
      const data = await response.json();
      setTags(data.data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to load tags');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'name' && !formData.slug) {
      // Auto-generate slug from name
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, [name]: value, slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayInputChange = (name, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [name]: arrayValue }));
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    const values = Array.from(selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate primary category is in selected categories
      if (formData.primary_category && !formData.categories.includes(formData.primary_category)) {
        toast.error('Primary category must be selected in categories');
        return;
      }

      await onSubmit(formData);
      toast.success(tool ? 'Tool updated successfully' : 'Tool created successfully');
      
      if (!tool) {
        // Reset form for new tool
        setFormData({
          name: '',
          slug: '',
          description: '',
          short_description: '',
          url: '',
          website_url: '',
          documentation_url: '',
          video_url: '',
          github_url: '',
          logo_url: '',
          screenshots: [],
          ai_type: 'nlp',
          difficulty_level: 'intermediate',
          pricing_type: 'free',
          price_per_month: '',
          features: [],
          supported_formats: [],
          integrations: [],
          target_roles: [],
          metadata: {},
          admin_notes: '',
          categories: [],
          primary_category: '',
          tags: [],
          status: 'draft',
          is_featured: false,
          featured_until: ''
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to save tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-form-container">
      <form onSubmit={handleSubmit} className="ai-tool-form">
        <div className="ai-form-header">
          <h2 className="ai-form-title">
            {tool ? 'Edit AI Tool' : 'Add New AI Tool'}
          </h2>
        </div>

        <div className="ai-form-grid">
          {/* Basic Information */}
          <div className="ai-form-section">
            <h3 className="ai-section-title">Basic Information</h3>
            
            <div className="ai-form-group">
              <label htmlFor="name" className="ai-label required">Tool Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="ai-input"
                placeholder="Enter tool name"
              />
            </div>

            <div className="ai-form-group">
              <label htmlFor="slug" className="ai-label">Slug</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="ai-input"
                placeholder="url-friendly-name"
              />
            </div>

            <div className="ai-form-group">
              <label htmlFor="short_description" className="ai-label">Short Description</label>
              <textarea
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                className="ai-textarea"
                rows={3}
                placeholder="Brief description of the tool"
              />
            </div>

            <div className="ai-form-group">
              <label htmlFor="description" className="ai-label required">Full Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="ai-textarea"
                rows={6}
                placeholder="Detailed description of the tool and its capabilities"
              />
            </div>
          </div>

          {/* URLs and Links */}
          <div className="ai-form-section">
            <h3 className="ai-section-title">URLs & Links</h3>
            
            <div className="ai-form-group">
              <label htmlFor="url" className="ai-label required">Main URL</label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                required
                className="ai-input"
                placeholder="https://example.com"
              />
            </div>

            <div className="ai-form-group">
              <label htmlFor="website_url" className="ai-label">Website URL</label>
              <input
                type="url"
                id="website_url"
                name="website_url"
                value={formData.website_url}
                onChange={handleInputChange}
                className="ai-input"
                placeholder="https://website.com"
              />
            </div>

            <div className="ai-form-group">
              <label htmlFor="documentation_url" className="ai-label">Documentation URL</label>
              <input
                type="url"
                id="documentation_url"
                name="documentation_url"
                value={formData.documentation_url}
                onChange={handleInputChange}
                className="ai-input"
                placeholder="https://docs.example.com"
              />
            </div>

            <div className="ai-form-group">
              <label htmlFor="github_url" className="ai-label">GitHub URL</label>
              <input
                type="url"
                id="github_url"
                name="github_url"
                value={formData.github_url}
                onChange={handleInputChange}
                className="ai-input"
                placeholder="https://github.com/user/repo"
              />
            </div>

            <div className="ai-form-group">
              <label htmlFor="video_url" className="ai-label">Video Demo URL</label>
              <input
                type="url"
                id="video_url"
                name="video_url"
                value={formData.video_url}
                onChange={handleInputChange}
                className="ai-input"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          {/* AI & Technical Details */}
          <div className="ai-form-section">
            <h3 className="ai-section-title">AI & Technical Details</h3>
            
            <div className="ai-form-group">
              <label htmlFor="ai_type" className="ai-label required">AI Type</label>
              <select
                id="ai_type"
                name="ai_type"
                value={formData.ai_type}
                onChange={handleInputChange}
                required
                className="ai-select"
              >
                <option value="nlp">Natural Language Processing</option>
                <option value="cv">Computer Vision</option>
                <option value="ml">Machine Learning</option>
                <option value="generative">Generative AI</option>
                <option value="automation">Automation</option>
                <option value="analysis">Data Analysis</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="ai-form-group">
              <label htmlFor="difficulty_level" className="ai-label required">Difficulty Level</label>
              <select
                id="difficulty_level"
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleInputChange}
                required
                className="ai-select"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="ai-form-group">
              <label htmlFor="features" className="ai-label">Key Features (comma-separated)</label>
              <textarea
                id="features"
                name="features"
                value={formData.features?.join(', ') || ''}
                onChange={(e) => handleArrayInputChange('features', e.target.value)}
                className="ai-textarea"
                rows={3}
                placeholder="Feature 1, Feature 2, Feature 3"
              />
            </div>

            <div className="ai-form-group">
              <label htmlFor="supported_formats" className="ai-label">Supported Formats (comma-separated)</label>
              <input
                type="text"
                id="supported_formats"
                name="supported_formats"
                value={formData.supported_formats?.join(', ') || ''}
                onChange={(e) => handleArrayInputChange('supported_formats', e.target.value)}
                className="ai-input"
                placeholder="JSON, CSV, PDF, PNG"
              />
            </div>

            <div className="ai-form-group">
              <label htmlFor="integrations" className="ai-label">Available Integrations (comma-separated)</label>
              <input
                type="text"
                id="integrations"
                name="integrations"
                value={formData.integrations?.join(', ') || ''}
                onChange={(e) => handleArrayInputChange('integrations', e.target.value)}
                className="ai-input"
                placeholder="Slack, Discord, Zapier, API"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="ai-form-section">
            <h3 className="ai-section-title">Pricing Information</h3>
            
            <div className="ai-form-group">
              <label htmlFor="pricing_type" className="ai-label required">Pricing Type</label>
              <select
                id="pricing_type"
                name="pricing_type"
                value={formData.pricing_type}
                onChange={handleInputChange}
                required
                className="ai-select"
              >
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            {formData.pricing_type !== 'free' && (
              <div className="ai-form-group">
                <label htmlFor="price_per_month" className="ai-label">Price per Month ($)</label>
                <input
                  type="number"
                  id="price_per_month"
                  name="price_per_month"
                  value={formData.price_per_month}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="ai-input"
                  placeholder="29.99"
                />
              </div>
            )}
          </div>

          {/* Categories & Tags */}
          <div className="ai-form-section">
            <h3 className="ai-section-title">Categories & Tags</h3>
            
            <div className="ai-form-group">
              <label htmlFor="categories" className="ai-label required">Categories</label>
              <select
                id="categories"
                name="categories"
                multiple
                value={formData.categories}
                onChange={(e) => handleMultiSelectChange('categories', e.target.selectedOptions)}
                required
                className="ai-select-multiple"
                size={5}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              <small className="ai-help-text">Hold Ctrl/Cmd to select multiple categories</small>
            </div>

            {formData.categories.length > 0 && (
              <div className="ai-form-group">
                <label htmlFor="primary_category" className="ai-label required">Primary Category</label>
                <select
                  id="primary_category"
                  name="primary_category"
                  value={formData.primary_category}
                  onChange={handleInputChange}
                  required
                  className="ai-select"
                >
                  <option value="">Select Primary Category</option>
                  {categories
                    .filter(cat => formData.categories.includes(cat.id))
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="ai-form-group">
              <label htmlFor="tags" className="ai-label">Tags</label>
              <select
                id="tags"
                name="tags"
                multiple
                value={formData.tags}
                onChange={(e) => handleMultiSelectChange('tags', e.target.selectedOptions)}
                className="ai-select-multiple"
                size={6}
              >
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
              <small className="ai-help-text">Hold Ctrl/Cmd to select multiple tags</small>
            </div>
          </div>

          {/* Target Roles */}
          <div className="ai-form-section">
            <h3 className="ai-section-title">Target Roles</h3>
            
            <div className="ai-checkbox-group">
              {[
                { value: 'owner', label: 'Business Owner' },
                { value: 'pm', label: 'Project Manager' },
                { value: 'backend', label: 'Backend Developer' },
                { value: 'frontend', label: 'Frontend Developer' },
                { value: 'qa', label: 'QA Engineer' },
                { value: 'designer', label: 'Designer' }
              ].map(role => (
                <label key={role.value} className="ai-checkbox-label">
                  <input
                    type="checkbox"
                    name="target_roles"
                    value={role.value}
                    checked={formData.target_roles?.includes(role.value) || false}
                    onChange={(e) => {
                      const roles = formData.target_roles || [];
                      if (e.target.checked) {
                        setFormData(prev => ({ 
                          ...prev, 
                          target_roles: [...roles, role.value] 
                        }));
                      } else {
                        setFormData(prev => ({ 
                          ...prev, 
                          target_roles: roles.filter(r => r !== role.value) 
                        }));
                      }
                    }}
                    className="ai-checkbox"
                  />
                  <span className="ai-checkbox-text">{role.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Admin Section */}
          <div className="ai-form-section">
            <h3 className="ai-section-title">Admin Settings</h3>
            
            <div className="ai-form-group">
              <label className="ai-checkbox-label">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured || false}
                  onChange={handleInputChange}
                  className="ai-checkbox"
                />
                <span className="ai-checkbox-text">Featured Tool</span>
              </label>
            </div>

            {formData.is_featured && (
              <div className="ai-form-group">
                <label htmlFor="featured_until" className="ai-label">Featured Until</label>
                <input
                  type="datetime-local"
                  id="featured_until"
                  name="featured_until"
                  value={formData.featured_until}
                  onChange={handleInputChange}
                  className="ai-input"
                />
              </div>
            )}

            <div className="ai-form-group">
              <label htmlFor="admin_notes" className="ai-label">Admin Notes</label>
              <textarea
                id="admin_notes"
                name="admin_notes"
                value={formData.admin_notes}
                onChange={handleInputChange}
                className="ai-textarea"
                rows={4}
                placeholder="Internal notes for admins"
              />
            </div>
          </div>
        </div>

        <div className="ai-form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="ai-btn ai-btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ai-btn ai-btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (tool ? 'Update Tool' : 'Create Tool')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ToolForm;