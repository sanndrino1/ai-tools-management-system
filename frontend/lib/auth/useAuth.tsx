// Authentication Hook for React Components
// Provides easy access to authentication state and functions

'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import type { ReactNode } from 'react';
import { authService, User, LoginCredentials, RegisterData } from './authService';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    register: (userData: RegisterData) => Promise<boolean>;
    logout: () => Promise<void>;
    logoutAll: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
    getCurrentUser: () => Promise<User | null>;
    checkPermission: (permission: string) => Promise<boolean>;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    getPermissions: () => string[];
    isActive: () => boolean;
    updateProfile: (data: Partial<User>) => Promise<User | null>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
    uploadAvatar: (file: File) => Promise<string | null>;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            
            const currentUser = authService.getUser();
            const currentToken = authService.getToken();
            
            setUser(currentUser);
            setToken(currentToken);

            // Verify token if exists
            if (currentToken) {
                try {
                    const isValid = await authService.verifyToken();
                    if (!isValid) {
                        // Token invalid, clear auth data
                        await authService.logout();
                        setUser(null);
                        setToken(null);
                    } else {
                        // Token valid, refresh user data
                        const freshUser = await authService.getCurrentUser();
                        setUser(freshUser);
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    await authService.logout();
                    setUser(null);
                    setToken(null);
                }
            }
            
            setLoading(false);
        };

        initAuth();
    }, []);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = authService.onAuthStateChange((type, user) => {
            console.log(`Auth state changed: ${type}`, user);
            
            setUser(user);
            setToken(authService.getToken());
            
            if (type === 'logout') {
                setUser(null);
                setToken(null);
            }
        });

        return unsubscribe;
    }, []);

    // Login function
    const login = async (credentials: LoginCredentials): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await authService.login(credentials);
            
            if (response.success && response.data) {
                setUser(response.data.user);
                setToken(response.data.token);
                return true;
            } else {
                throw new Error(response.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData: RegisterData): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await authService.register(userData);
            
            if (response.success && response.data) {
                setUser(response.data.user);
                setToken(response.data.token);
                return true;
            } else {
                throw new Error(response.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async (): Promise<void> => {
        try {
            setLoading(true);
            await authService.logout();
            setUser(null);
            setToken(null);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Logout from all devices
    const logoutAll = async (): Promise<void> => {
        try {
            setLoading(true);
            await authService.logoutAll();
            setUser(null);
            setToken(null);
        } catch (error) {
            console.error('Logout all error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh token
    const refreshToken = async (): Promise<boolean> => {
        try {
            const success = await authService.refreshToken();
            if (success) {
                setUser(authService.getUser());
                setToken(authService.getToken());
            }
            return success;
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    };

    // Get current user
    const getCurrentUser = async (): Promise<User | null> => {
        try {
            const user = await authService.getCurrentUser();
            setUser(user);
            return user;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    };

    // Check permission (async)
    const checkPermission = async (permission: string): Promise<boolean> => {
        try {
            return await authService.checkPermission(permission);
        } catch (error) {
            console.error('Permission check error:', error);
            return false;
        }
    };

    // Update profile
    const updateProfile = async (data: Partial<User>): Promise<User | null> => {
        try {
            const updatedUser = await authService.updateProfile(data);
            if (updatedUser) {
                setUser(updatedUser);
            }
            return updatedUser;
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    };

    // Change password
    const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
        try {
            return await authService.changePassword(currentPassword, newPassword);
        } catch (error) {
            console.error('Password change error:', error);
            throw error;
        }
    };

    // Upload avatar
    const uploadAvatar = async (file: File): Promise<string | null> => {
        try {
            const avatarUrl = await authService.uploadAvatar(file);
            if (avatarUrl && user) {
                setUser({ ...user, avatar_url: avatarUrl });
            }
            return avatarUrl;
        } catch (error) {
            console.error('Avatar upload error:', error);
            throw error;
        }
    };

    // Cached permission and role checks
    const hasRole = (role: string): boolean => {
        return authService.hasRole(role);
    };

    const hasAnyRole = (roles: string[]): boolean => {
        return authService.hasAnyRole(roles);
    };

    const hasPermission = (permission: string): boolean => {
        return authService.hasPermission(permission);
    };

    const hasAnyPermission = (permissions: string[]): boolean => {
        return authService.hasAnyPermission(permissions);
    };

    const getPermissions = (): string[] => {
        return authService.getPermissions();
    };

    const isActive = (): boolean => {
        return authService.isActive();
    };

    const isAuthenticated = !!(token && user && isActive());

    const contextValue: AuthContextType = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        logoutAll,
        refreshToken,
        getCurrentUser,
        checkPermission,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission,
        getPermissions,
        isActive,
        updateProfile,
        changePassword,
        uploadAvatar
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Hook for role-based rendering
export function useRole(requiredRole: string | string[]) {
    const { hasRole, hasAnyRole, loading } = useAuth();
    
    const hasRequiredRole = Array.isArray(requiredRole) 
        ? hasAnyRole(requiredRole)
        : hasRole(requiredRole);
    
    return { hasRequiredRole, loading };
}

// Hook for permission-based rendering
export function usePermission(requiredPermission: string | string[]) {
    const { hasPermission, hasAnyPermission, loading } = useAuth();
    
    const hasRequiredPermission = Array.isArray(requiredPermission)
        ? hasAnyPermission(requiredPermission)
        : hasPermission(requiredPermission);
    
    return { hasRequiredPermission, loading };
}

// Higher-order component for route protection
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    options: {
        requiredRole?: string | string[];
        requiredPermission?: string | string[];
        redirectTo?: string;
        fallback?: React.ComponentType;
    } = {}
) {
    return function AuthGuardedComponent(props: P) {
        const { 
            isAuthenticated, 
            hasRole, 
            hasAnyRole, 
            hasPermission, 
            hasAnyPermission, 
            loading 
        } = useAuth();

        // Show loading state
        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        // Check authentication
        if (!isAuthenticated) {
            if (options.redirectTo) {
                if (typeof window !== 'undefined') {
                    window.location.href = options.redirectTo;
                }
                return null;
            }
            
            if (options.fallback) {
                const Fallback = options.fallback;
                return <Fallback />;
            }
            
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Authentication Required
                        </h2>
                        <p className="text-gray-600 mb-4">
                            You need to sign in to access this page.
                        </p>
                        <button
                            onClick={() => window.location.href = '/auth/login'}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            );
        }

        // Check role requirements
        if (options.requiredRole) {
            const hasRequiredRole = Array.isArray(options.requiredRole)
                ? hasAnyRole(options.requiredRole)
                : hasRole(options.requiredRole);
            
            if (!hasRequiredRole) {
                return (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Access Denied
                            </h2>
                            <p className="text-gray-600">
                                You don't have the required role to access this page.
                            </p>
                        </div>
                    </div>
                );
            }
        }

        // Check permission requirements
        if (options.requiredPermission) {
            const hasRequiredPermission = Array.isArray(options.requiredPermission)
                ? hasAnyPermission(options.requiredPermission)
                : hasPermission(options.requiredPermission);
            
            if (!hasRequiredPermission) {
                return (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Access Denied
                            </h2>
                            <p className="text-gray-600">
                                You don't have the required permission to access this page.
                            </p>
                        </div>
                    </div>
                );
            }
        }

        return <Component {...props} />;
    };
}

export default AuthProvider;