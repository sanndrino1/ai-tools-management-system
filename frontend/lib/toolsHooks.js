import { useState, useEffect } from 'react';
import toolsService from './toolsService';

/**
 * Custom hook for managing tools with CRUD operations
 */
export function useTools(initialFilters = {}) {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  // Load tools on mount and when filters change
  useEffect(() => {
    loadTools();
  }, [filters]);

  const loadTools = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await toolsService.getAllTools(filters);
      setTools(response.data || response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTool = async (toolData) => {
    try {
      const newTool = await toolsService.createTool(toolData);
      setTools(prevTools => [...prevTools, newTool]);
      return { success: true, data: newTool };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateTool = async (id, toolData) => {
    try {
      const updatedTool = await toolsService.updateTool(id, toolData);
      setTools(prevTools => 
        prevTools.map(tool => tool.id === id ? updatedTool : tool)
      );
      return { success: true, data: updatedTool };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteTool = async (id) => {
    try {
      await toolsService.deleteTool(id);
      setTools(prevTools => prevTools.filter(tool => tool.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const refreshTools = () => {
    loadTools();
  };

  return {
    tools,
    loading,
    error,
    filters,
    setFilters,
    createTool,
    updateTool,
    deleteTool,
    refreshTools
  };
}

/**
 * Hook for managing categories
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await toolsService.getAllCategories();
      setCategories(response.data || response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const newCategory = await toolsService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return { success: true, data: newCategory };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    refreshCategories: loadCategories
  };
}

/**
 * Hook for tool statistics and analytics
 */
export function useToolAnalytics(toolId = null) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadToolStats = async (id = toolId) => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await toolsService.getToolStatistics(id);
      setStats(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const trackUsage = async (id = toolId) => {
    if (!id) return;
    
    try {
      await toolsService.trackToolUsage(id);
      // Optionally refresh stats
      if (stats) {
        loadToolStats(id);
      }
    } catch (err) {
      console.error('Failed to track usage:', err);
    }
  };

  const rateTool = async (id = toolId, rating, comment = '') => {
    if (!id) return;
    
    try {
      const response = await toolsService.rateTool(id, rating, comment);
      // Refresh stats to get updated rating
      loadToolStats(id);
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    if (toolId) {
      loadToolStats(toolId);
    }
  }, [toolId]);

  return {
    stats,
    loading,
    error,
    loadToolStats,
    trackUsage,
    rateTool
  };
}

/**
 * Hook for search functionality
 */
export function useToolSearch() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  const search = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await toolsService.searchTools(searchQuery);
      setSearchResults(response.data || response);
      setQuery(searchQuery);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setQuery('');
    setError(null);
  };

  return {
    searchResults,
    loading,
    error,
    query,
    search,
    clearSearch
  };
}

/**
 * Hook for managing tool form state with validation
 */
export function useToolForm(initialData = {}) {
  const [formData, setFormData] = useState({
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
    metadata: {},
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = 'Tool name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    // URL validation for optional fields
    const urlFields = ['documentation_url', 'video_url', 'github_url'];
    urlFields.forEach(field => {
      if (formData[field] && !isValidUrl(formData[field])) {
        newErrors[field] = 'Please enter a valid URL';
      }
    });

    // Price validation
    if (formData.price_per_month < 0) {
      newErrors.price_per_month = 'Price cannot be negative';
    }

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);
    return valid;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

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
    setErrors({});
    setIsValid(false);
  };

  // Validate on form data change
  useEffect(() => {
    validateForm();
  }, [formData]);

  return {
    formData,
    errors,
    isValid,
    updateField,
    validateForm,
    resetForm,
    setFormData
  };
}

/**
 * Hook for managing bulk operations
 */
export function useBulkOperations() {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const selectItem = (id) => {
    setSelectedItems(prev => new Set([...prev, id]));
  };

  const deselectItem = (id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleItem = (id) => {
    if (selectedItems.has(id)) {
      deselectItem(id);
    } else {
      selectItem(id);
    }
  };

  const selectAll = (items) => {
    setSelectedItems(new Set(items.map(item => item.id)));
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  const bulkDelete = async (tools) => {
    setLoading(true);
    const results = [];

    for (const toolId of selectedItems) {
      try {
        await toolsService.deleteTool(toolId);
        results.push({ id: toolId, success: true });
      } catch (err) {
        results.push({ id: toolId, success: false, error: err.message });
      }
    }

    setLoading(false);
    setSelectedItems(new Set());
    return results;
  };

  const bulkUpdateCategory = async (newCategory) => {
    setLoading(true);
    const results = [];

    for (const toolId of selectedItems) {
      try {
        await toolsService.patchTool(toolId, { category: newCategory });
        results.push({ id: toolId, success: true });
      } catch (err) {
        results.push({ id: toolId, success: false, error: err.message });
      }
    }

    setLoading(false);
    setSelectedItems(new Set());
    return results;
  };

  return {
    selectedItems: Array.from(selectedItems),
    selectedCount: selectedItems.size,
    loading,
    selectItem,
    deselectItem,
    toggleItem,
    selectAll,
    deselectAll,
    bulkDelete,
    bulkUpdateCategory
  };
}