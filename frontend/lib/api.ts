// API Configuration for Mock Backend Server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// API Client with authentication support
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  // Get authentication headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic API request method
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication Methods
  async login(email: string, password: string) {
    const response = await this.request<{
      access_token: string;
      token_type: string;
      user: any;
    }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.access_token) {
      this.setToken(response.access_token);
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    return this.request<any>('/user');
  }

  async getUserPermissions() {
    return this.request<string[]>('/permissions');
  }

  // Team and Role Methods
  async getTeamMembers() {
    return this.request<any[]>('/team');
  }

  async getUserRole() {
    return this.request<{
      role: string;
      role_display_name: string;
      permissions: string[];
    }>('/user/role');
  }

  // Profile Methods
  async updateProfile(data: any) {
    return this.request<any>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Generic GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // Generic POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Generic PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export the singleton and class for flexibility
export default apiClient;
export { ApiClient };

// Convenience exports for common operations
export const authApi = {
  login: (email: string, password: string) => apiClient.login(email, password),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  getUserPermissions: () => apiClient.getUserPermissions(),
};

export const teamApi = {
  getMembers: () => apiClient.getTeamMembers(),
  getUserRole: () => apiClient.getUserRole(),
};

export const profileApi = {
  update: (data: any) => apiClient.updateProfile(data),
};