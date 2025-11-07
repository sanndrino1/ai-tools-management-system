// API service for AI Tools CRUD operations
class ToolsService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    this.endpoints = {
      tools: '/tools',
      categories: '/categories',
      tags: '/tags'
    };
  }

  // Helper method to handle API requests
  async apiRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // =================== CRUD Operations ===================

  /**
   * GET - Retrieve all tools with optional filtering
   */
  async getAllTools(filters = {}) {
    const queryParams = new URLSearchParams();
    
    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(`${key}[]`, item));
        } else {
          queryParams.append(key, value);
        }
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${this.endpoints.tools}?${queryString}` : this.endpoints.tools;
    
    return await this.apiRequest(endpoint);
  }

  /**
   * GET - Retrieve single tool by ID
   */
  async getToolById(id) {
    return await this.apiRequest(`${this.endpoints.tools}/${id}`);
  }

  /**
   * POST - Create new tool
   */
  async createTool(toolData) {
    return await this.apiRequest(this.endpoints.tools, {
      method: 'POST',
      body: JSON.stringify(this.validateToolData(toolData))
    });
  }

  /**
   * PUT - Update existing tool
   */
  async updateTool(id, toolData) {
    return await this.apiRequest(`${this.endpoints.tools}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(this.validateToolData(toolData))
    });
  }

  /**
   * PATCH - Partial update of tool
   */
  async patchTool(id, partialData) {
    return await this.apiRequest(`${this.endpoints.tools}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(partialData)
    });
  }

  /**
   * DELETE - Delete tool by ID
   */
  async deleteTool(id) {
    return await this.apiRequest(`${this.endpoints.tools}/${id}`, {
      method: 'DELETE'
    });
  }

  // =================== Extended Operations ===================

  /**
   * GET - Get tools by category
   */
  async getToolsByCategory(categorySlug) {
    return await this.getAllTools({ category: categorySlug });
  }

  /**
   * GET - Get featured tools
   */
  async getFeaturedTools() {
    return await this.getAllTools({ featured: true });
  }

  /**
   * GET - Search tools
   */
  async searchTools(query) {
    return await this.getAllTools({ search: query });
  }

  /**
   * POST - Rate a tool
   */
  async rateTool(toolId, rating, comment = '') {
    return await this.apiRequest(`${this.endpoints.tools}/${toolId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    });
  }

  /**
   * POST - Track tool usage
   */
  async trackToolUsage(toolId) {
    return await this.apiRequest(`${this.endpoints.tools}/${toolId}/track-usage`, {
      method: 'POST'
    });
  }

  /**
   * GET - Get tool statistics
   */
  async getToolStatistics(toolId) {
    return await this.apiRequest(`${this.endpoints.tools}/${toolId}/statistics`);
  }

  // =================== Categories Operations ===================

  async getAllCategories() {
    return await this.apiRequest(this.endpoints.categories);
  }

  async createCategory(categoryData) {
    return await this.apiRequest(this.endpoints.categories, {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  // =================== Tags Operations ===================

  async getAllTags() {
    return await this.apiRequest(this.endpoints.tags);
  }

  async createTag(tagData) {
    return await this.apiRequest(this.endpoints.tags, {
      method: 'POST',
      body: JSON.stringify(tagData)
    });
  }

  // =================== Data Validation ===================

  /**
   * Validate and prepare tool data for API submission
   */
  validateToolData(toolData) {
    const validatedData = { ...toolData };

    // Required fields validation
    const requiredFields = ['name', 'description', 'url'];
    const missingFields = requiredFields.filter(field => !validatedData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // URL validation
    if (validatedData.url && !this.isValidUrl(validatedData.url)) {
      throw new Error('Invalid URL format');
    }

    // Extended fields for future expansion
    const extendedFields = {
      documentation_url: validatedData.documentation_url || '',
      video_url: validatedData.video_url || '',
      github_url: validatedData.github_url || '',
      difficulty_level: validatedData.difficulty_level || 'beginner',
      pricing_type: validatedData.pricing_type || 'unknown',
      price_per_month: validatedData.price_per_month || 0,
      features: validatedData.features || [],
      supported_formats: validatedData.supported_formats || [],
      integrations: validatedData.integrations || [],
      target_roles: validatedData.target_roles || [],
      metadata: validatedData.metadata || {},
      tags: validatedData.tags || [],
      screenshots: validatedData.screenshots || []
    };

    return { ...validatedData, ...extendedFields };
  }

  /**
   * URL validation helper
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // =================== Future Extensions Structure ===================

  /**
   * Prepared structure for future API integrations
   */
  getFutureExtensions() {
    return {
      // AI Analysis endpoints
      aiAnalysis: {
        analyzeTool: (toolId) => `/tools/${toolId}/ai-analyze`,
        generateDescription: (toolData) => `/tools/ai-generate-description`,
        suggestCategories: (toolData) => `/tools/ai-suggest-categories`
      },

      // Integration endpoints
      integrations: {
        slack: `/tools/integrations/slack`,
        discord: `/tools/integrations/discord`,
        webhook: (toolId) => `/tools/${toolId}/webhook`
      },

      // Advanced analytics
      analytics: {
        toolPerformance: (toolId) => `/tools/${toolId}/performance`,
        userBehavior: (toolId) => `/tools/${toolId}/user-behavior`,
        marketTrends: () => `/tools/market-trends`
      },

      // Export/Import
      dataManagement: {
        exportTools: () => `/tools/export`,
        importTools: () => `/tools/import`,
        backup: () => `/tools/backup`,
        restore: () => `/tools/restore`
      }
    };
  }
}

// Export singleton instance
const toolsService = new ToolsService();
export default toolsService;

// Export class for testing/customization
export { ToolsService };