// Authentication Service for Next.js Frontend
// Connects to Laravel backend API

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    role_display_name: string;
    avatar_url: string;
    permissions: string[];
    phone?: string;
    department?: string;
    bio?: string;
    is_active: boolean;
    last_login_at?: string;
    created_at: string;
    updated_at: string;
}

interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user: User;
        token: string;
        token_type: string;
        expires_at: string;
    };
    error?: string;
    errors?: Record<string, string[]>;
    timestamp: string;
    requestId: string;
}

interface LoginCredentials {
    email: string;
    password: string;
    remember?: boolean;
    device_name?: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: string;
    phone?: string;
    department?: string;
    bio?: string;
}

class AuthService {
    private baseUrl: string;
    private token: string | null = null;
    private user: User | null = null;
    private refreshPromise: Promise<boolean> | null = null;

    constructor(baseUrl: string = 'http://localhost:8080/api') {
        this.baseUrl = baseUrl;
        this.initializeAuth();
    }

    /**
     * Initialize authentication state from localStorage
     */
    private initializeAuth(): void {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
            const userData = localStorage.getItem('auth_user');
            if (userData) {
                try {
                    this.user = JSON.parse(userData);
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                    this.clearAuthData();
                }
            }
        }
    }

    /**
     * Make authenticated API request
     */
    private async apiRequest<T>(
        endpoint: string, 
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers as Record<string, string>)
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config: RequestInit = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            
            if (response.status === 401 && this.token) {
                // Token expired, try to refresh
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Retry the original request with new token
                    headers['Authorization'] = `Bearer ${this.token}`;
                    const retryResponse = await fetch(url, { ...config, headers });
                    return await retryResponse.json();
                } else {
                    // Refresh failed, logout user
                    this.logout();
                    throw new Error('Authentication expired');
                }
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    /**
     * Store authentication data
     */
    private storeAuthData(user: User, token: string): void {
        this.user = user;
        this.token = token;
        
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_user', JSON.stringify(user));
        }
    }

    /**
     * Clear authentication data
     */
    private clearAuthData(): void {
        this.user = null;
        this.token = null;
        
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }
    }

    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await this.apiRequest<AuthResponse>('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            if (response.success && response.data) {
                this.storeAuthData(response.data.user, response.data.token);
                
                // Trigger auth state change event
                this.triggerAuthEvent('login', response.data.user);
            }

            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    /**
     * Register new user
     */
    async register(userData: RegisterData): Promise<AuthResponse> {
        try {
            const response = await this.apiRequest<AuthResponse>('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            if (response.success && response.data) {
                this.storeAuthData(response.data.user, response.data.token);
                
                // Trigger auth state change event
                this.triggerAuthEvent('register', response.data.user);
            }

            return response;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            if (this.token) {
                await this.apiRequest('/auth/logout', {
                    method: 'POST'
                });
            }
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            const currentUser = this.user;
            this.clearAuthData();
            
            // Trigger auth state change event
            this.triggerAuthEvent('logout', currentUser);
        }
    }

    /**
     * Logout from all devices
     */
    async logoutAll(): Promise<void> {
        try {
            if (this.token) {
                await this.apiRequest('/auth/logout-all', {
                    method: 'POST'
                });
            }
        } catch (error) {
            console.error('Logout all API call failed:', error);
        } finally {
            const currentUser = this.user;
            this.clearAuthData();
            
            // Trigger auth state change event
            this.triggerAuthEvent('logout', currentUser);
        }
    }

    /**
     * Refresh authentication token
     */
    async refreshToken(): Promise<boolean> {
        if (!this.token) {
            return false;
        }

        // Prevent multiple concurrent refresh attempts
        if (this.refreshPromise) {
            return await this.refreshPromise;
        }

        this.refreshPromise = this.performRefresh();
        const result = await this.refreshPromise;
        this.refreshPromise = null;
        
        return result;
    }

    /**
     * Perform token refresh
     */
    private async performRefresh(): Promise<boolean> {
        try {
            const response = await this.apiRequest<AuthResponse>('/auth/refresh', {
                method: 'POST'
            });

            if (response.success && response.data) {
                this.storeAuthData(response.data.user, response.data.token);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    /**
     * Get current user data from server
     */
    async getCurrentUser(): Promise<User | null> {
        if (!this.token) {
            return null;
        }

        try {
            const response = await this.apiRequest<AuthResponse>('/auth/me');
            
            if (response.success && response.data) {
                this.user = response.data.user;
                
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_user', JSON.stringify(this.user));
                }
                
                return this.user;
            }

            return null;
        } catch (error) {
            console.error('Failed to get current user:', error);
            return null;
        }
    }

    /**
     * Verify token validity
     */
    async verifyToken(): Promise<boolean> {
        if (!this.token) {
            return false;
        }

        try {
            const response = await this.apiRequest<AuthResponse>('/auth/verify', {
                method: 'POST'
            });

            return response.success;
        } catch (error) {
            console.error('Token verification failed:', error);
            return false;
        }
    }

    /**
     * Check if user has specific permission
     */
    async checkPermission(permission: string): Promise<boolean> {
        if (!this.token) {
            return false;
        }

        try {
            const response = await this.apiRequest<{
                success: boolean;
                data: {
                    permission: string;
                    granted: boolean;
                    user_role: string;
                    all_permissions: string[];
                };
            }>('/auth/check-permission', {
                method: 'POST',
                body: JSON.stringify({ permission })
            });

            return response.success && response.data.granted;
        } catch (error) {
            console.error('Permission check failed:', error);
            return false;
        }
    }

    /**
     * Get current user (cached)
     */
    getUser(): User | null {
        return this.user;
    }

    /**
     * Get current token
     */
    getToken(): string | null {
        return this.token;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!(this.token && this.user);
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: string): boolean {
        return this.user?.role === role;
    }

    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole(roles: string[]): boolean {
        return this.user ? roles.includes(this.user.role) : false;
    }

    /**
     * Check if user has specific permission (cached)
     */
    hasPermission(permission: string): boolean {
        if (!this.user) return false;
        
        // Admin has all permissions
        if (this.user.role === 'admin') return true;
        
        // Check explicit permissions
        return this.user.permissions.includes(permission);
    }

    /**
     * Check if user has any of the specified permissions
     */
    hasAnyPermission(permissions: string[]): boolean {
        return permissions.some(permission => this.hasPermission(permission));
    }

    /**
     * Get user's effective permissions
     */
    getPermissions(): string[] {
        return this.user?.permissions || [];
    }

    /**
     * Check if user account is active
     */
    isActive(): boolean {
        return this.user?.is_active || false;
    }

    /**
     * Trigger authentication events
     */
    private triggerAuthEvent(type: string, user: User | null): void {
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('authStateChange', {
                detail: { type, user }
            });
            window.dispatchEvent(event);
        }
    }

    /**
     * Listen for authentication state changes
     */
    onAuthStateChange(callback: (type: string, user: User | null) => void): () => void {
        if (typeof window === 'undefined') {
            return () => {};
        }

        const handler = (event: CustomEvent) => {
            callback(event.detail.type, event.detail.user);
        };

        window.addEventListener('authStateChange', handler as EventListener);

        return () => {
            window.removeEventListener('authStateChange', handler as EventListener);
        };
    }

    /**
     * Update user profile
     */
    async updateProfile(data: Partial<User>): Promise<User | null> {
        try {
            const response = await this.apiRequest<{
                success: boolean;
                data: { user: User };
            }>('/profile', {
                method: 'PUT',
                body: JSON.stringify(data)
            });

            if (response.success && response.data) {
                this.user = response.data.user;
                
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_user', JSON.stringify(this.user));
                }
                
                return this.user;
            }

            return null;
        } catch (error) {
            console.error('Profile update failed:', error);
            throw error;
        }
    }

    /**
     * Change password
     */
    async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
        try {
            const response = await this.apiRequest<{ success: boolean }>('/profile/password', {
                method: 'PUT',
                body: JSON.stringify({
                    current_password: currentPassword,
                    password: newPassword,
                    password_confirmation: newPassword
                })
            });

            return response.success;
        } catch (error) {
            console.error('Password change failed:', error);
            throw error;
        }
    }

    /**
     * Upload avatar
     */
    async uploadAvatar(file: File): Promise<string | null> {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`${this.baseUrl}/profile/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success && data.data) {
                // Update user avatar in local storage
                if (this.user) {
                    this.user.avatar_url = data.data.avatar_url;
                    localStorage.setItem('auth_user', JSON.stringify(this.user));
                }
                
                return data.data.avatar_url;
            }

            return null;
        } catch (error) {
            console.error('Avatar upload failed:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;

// Export types
export type { User, AuthResponse, LoginCredentials, RegisterData };