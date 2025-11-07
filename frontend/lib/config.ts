// Configuration for environment variables and API endpoints

export const config = {
    // API Configuration
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
        timeout: 30000,
        retryAttempts: 3,
    },

    // Authentication Configuration
    auth: {
        tokenKey: 'auth_token',
        userKey: 'auth_user',
        refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
        loginPath: '/auth/login',
        dashboardPath: '/dashboard',
    },

    // Laravel Backend Configuration
    laravel: {
        sanctumStateful: ['localhost', '127.0.0.1', 'localhost:3000'],
        withCredentials: true,
    },

    // App Configuration
    app: {
        name: 'AI Tools Admin Panel',
        version: '1.0.0',
        description: 'Administrative panel for AI tools management',
    },

    // Role and Permission Configuration
    roles: {
        admin: {
            name: 'Administrator',
            description: 'Full system access',
            color: 'red',
        },
        manager: {
            name: 'Manager',
            description: 'Management access to tools and users',
            color: 'blue',
        },
        editor: {
            name: 'Editor',
            description: 'Content editing and tool management',
            color: 'green',
        },
        user: {
            name: 'User',
            description: 'Basic user access',
            color: 'gray',
        },
    },

    permissions: [
        {
            key: 'manage_tools',
            name: 'Manage Tools',
            description: 'Create, edit, and delete AI tools',
        },
        {
            key: 'manage_users',
            name: 'Manage Users',
            description: 'Manage user accounts and permissions',
        },
        {
            key: 'manage_system',
            name: 'Manage System',
            description: 'System configuration and settings',
        },
        {
            key: 'view_analytics',
            name: 'View Analytics',
            description: 'Access to analytics and reports',
        },
        {
            key: 'manage_content',
            name: 'Manage Content',
            description: 'Edit and publish content',
        },
        {
            key: 'view_logs',
            name: 'View Logs',
            description: 'Access to system logs',
        },
    ],

    // UI Configuration
    ui: {
        theme: {
            primary: 'blue',
            secondary: 'gray',
            success: 'green',
            warning: 'yellow',
            error: 'red',
        },
        pagination: {
            defaultLimit: 10,
            limits: [10, 25, 50, 100],
        },
    },

    // Development Configuration
    development: {
        enableDebugLogs: process.env.NODE_ENV === 'development',
        enableMockData: false,
        apiDelay: 0, // Artificial delay for testing
    },
};

// Environment-specific configuration
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

// Helper functions
export const getApiUrl = (endpoint: string) => {
    return `${config.api.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export const getRoleColor = (role: string) => {
    return config.roles[role as keyof typeof config.roles]?.color || 'gray';
};

export const getPermissionByKey = (key: string) => {
    return config.permissions.find(permission => permission.key === key);
};

export default config;