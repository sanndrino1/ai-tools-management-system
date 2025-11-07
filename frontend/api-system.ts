// Comprehensive API System for Future Extensions and Integrations

// API Configuration
export const API_CONFIG = {
    baseUrl: '/api/v1',
    version: '1.0.0',
    documentation: '/api/docs',
    playground: '/api/playground',
    rateLimits: {
        default: { requests: 1000, window: '1h' },
        authenticated: { requests: 5000, window: '1h' },
        premium: { requests: 10000, window: '1h' }
    }
};

// API Response Wrapper
export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    errors?: string[];
    message?: string;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
    links?: {
        self?: string;
        next?: string;
        prev?: string;
        first?: string;
        last?: string;
    };
    timestamp: string;
    requestId: string;
    version: string;
}

// Available API Endpoints
export const API_ENDPOINTS = {
    // Tools Management
    tools: {
        list: { method: 'GET', path: '/tools', description: 'List all tools with filtering and pagination' },
        create: { method: 'POST', path: '/tools', description: 'Create a new tool' },
        get: { method: 'GET', path: '/tools/:id', description: 'Get a specific tool by ID' },
        update: { method: 'PUT', path: '/tools/:id', description: 'Update a tool' },
        patch: { method: 'PATCH', path: '/tools/:id', description: 'Partially update a tool' },
        delete: { method: 'DELETE', path: '/tools/:id', description: 'Delete a tool' },
        bulkUpdate: { method: 'PATCH', path: '/tools/bulk', description: 'Bulk update multiple tools' },
        bulkDelete: { method: 'DELETE', path: '/tools/bulk', description: 'Bulk delete multiple tools' },
        approve: { method: 'POST', path: '/tools/:id/approve', description: 'Approve a pending tool' },
        reject: { method: 'POST', path: '/tools/:id/reject', description: 'Reject a pending tool' },
        duplicate: { method: 'POST', path: '/tools/:id/duplicate', description: 'Duplicate an existing tool' },
        export: { method: 'GET', path: '/tools/export', description: 'Export tools in various formats' },
        import: { method: 'POST', path: '/tools/import', description: 'Import tools from file' },
        search: { method: 'GET', path: '/tools/search', description: 'Advanced search for tools' },
        popular: { method: 'GET', path: '/tools/popular', description: 'Get popular tools' },
        trending: { method: 'GET', path: '/tools/trending', description: 'Get trending tools' },
        recommendations: { method: 'GET', path: '/tools/recommendations', description: 'Get tool recommendations' }
    },

    // Categories Management
    categories: {
        list: { method: 'GET', path: '/categories', description: 'List all categories' },
        create: { method: 'POST', path: '/categories', description: 'Create a new category' },
        get: { method: 'GET', path: '/categories/:id', description: 'Get a specific category' },
        update: { method: 'PUT', path: '/categories/:id', description: 'Update a category' },
        delete: { method: 'DELETE', path: '/categories/:id', description: 'Delete a category' },
        tree: { method: 'GET', path: '/categories/tree', description: 'Get category hierarchy tree' },
        tools: { method: 'GET', path: '/categories/:id/tools', description: 'Get tools in a category' }
    },

    // Dynamic Fields Management
    fields: {
        list: { method: 'GET', path: '/fields', description: 'List all field definitions' },
        create: { method: 'POST', path: '/fields', description: 'Create a new field definition' },
        get: { method: 'GET', path: '/fields/:id', description: 'Get a specific field definition' },
        update: { method: 'PUT', path: '/fields/:id', description: 'Update a field definition' },
        delete: { method: 'DELETE', path: '/fields/:id', description: 'Delete a field definition' },
        types: { method: 'GET', path: '/fields/types', description: 'Get available field types' },
        validate: { method: 'POST', path: '/fields/validate', description: 'Validate field configuration' }
    },

    // User & Role Management
    users: {
        list: { method: 'GET', path: '/users', description: 'List all users' },
        create: { method: 'POST', path: '/users', description: 'Create a new user' },
        get: { method: 'GET', path: '/users/:id', description: 'Get a specific user' },
        update: { method: 'PUT', path: '/users/:id', description: 'Update a user' },
        delete: { method: 'DELETE', path: '/users/:id', description: 'Delete a user' },
        roles: { method: 'GET', path: '/users/:id/roles', description: 'Get user roles' },
        permissions: { method: 'GET', path: '/users/:id/permissions', description: 'Get user permissions' }
    },

    // Authentication
    auth: {
        login: { method: 'POST', path: '/auth/login', description: 'User login' },
        logout: { method: 'POST', path: '/auth/logout', description: 'User logout' },
        register: { method: 'POST', path: '/auth/register', description: 'User registration' },
        refresh: { method: 'POST', path: '/auth/refresh', description: 'Refresh access token' },
        verify: { method: 'POST', path: '/auth/verify', description: 'Verify token validity' },
        reset: { method: 'POST', path: '/auth/reset', description: 'Reset password' },
        twoFactor: { method: 'POST', path: '/auth/2fa', description: 'Two-factor authentication' }
    },

    // Analytics & Statistics
    analytics: {
        overview: { method: 'GET', path: '/analytics/overview', description: 'Get overview statistics' },
        tools: { method: 'GET', path: '/analytics/tools', description: 'Get tool usage analytics' },
        users: { method: 'GET', path: '/analytics/users', description: 'Get user activity analytics' },
        categories: { method: 'GET', path: '/analytics/categories', description: 'Get category analytics' },
        reports: { method: 'GET', path: '/analytics/reports', description: 'Get predefined reports' },
        custom: { method: 'POST', path: '/analytics/custom', description: 'Create custom analytics query' }
    },

    // Webhooks
    webhooks: {
        list: { method: 'GET', path: '/webhooks', description: 'List all webhooks' },
        create: { method: 'POST', path: '/webhooks', description: 'Create a new webhook' },
        get: { method: 'GET', path: '/webhooks/:id', description: 'Get a specific webhook' },
        update: { method: 'PUT', path: '/webhooks/:id', description: 'Update a webhook' },
        delete: { method: 'DELETE', path: '/webhooks/:id', description: 'Delete a webhook' },
        test: { method: 'POST', path: '/webhooks/:id/test', description: 'Test webhook delivery' },
        logs: { method: 'GET', path: '/webhooks/:id/logs', description: 'Get webhook delivery logs' }
    },

    // File Management
    files: {
        upload: { method: 'POST', path: '/files/upload', description: 'Upload a file' },
        get: { method: 'GET', path: '/files/:id', description: 'Get file information' },
        download: { method: 'GET', path: '/files/:id/download', description: 'Download a file' },
        delete: { method: 'DELETE', path: '/files/:id', description: 'Delete a file' },
        list: { method: 'GET', path: '/files', description: 'List files with pagination' }
    },

    // System & Configuration
    system: {
        health: { method: 'GET', path: '/system/health', description: 'System health check' },
        info: { method: 'GET', path: '/system/info', description: 'System information' },
        config: { method: 'GET', path: '/system/config', description: 'Get system configuration' },
        updateConfig: { method: 'PUT', path: '/system/config', description: 'Update system configuration' },
        backup: { method: 'POST', path: '/system/backup', description: 'Create system backup' },
        restore: { method: 'POST', path: '/system/restore', description: 'Restore from backup' },
        migrations: { method: 'GET', path: '/system/migrations', description: 'Get migration status' },
        runMigration: { method: 'POST', path: '/system/migrations/run', description: 'Run pending migrations' }
    },

    // Integration APIs
    integrations: {
        list: { method: 'GET', path: '/integrations', description: 'List available integrations' },
        connect: { method: 'POST', path: '/integrations/:type/connect', description: 'Connect to external service' },
        disconnect: { method: 'DELETE', path: '/integrations/:type/disconnect', description: 'Disconnect from service' },
        sync: { method: 'POST', path: '/integrations/:type/sync', description: 'Sync data with external service' },
        status: { method: 'GET', path: '/integrations/:type/status', description: 'Get integration status' }
    }
};

// Query Parameters for API endpoints
export interface APIQueryParams {
    // Pagination
    page?: number;
    limit?: number;
    offset?: number;

    // Sorting
    sort?: string;
    order?: 'asc' | 'desc';

    // Filtering
    filter?: Record<string, any>;
    search?: string;
    category?: string;
    status?: string;
    featured?: boolean;
    
    // Date range
    dateFrom?: string;
    dateTo?: string;
    
    // Field selection
    fields?: string[];
    include?: string[];
    exclude?: string[];
    
    // Expansion
    expand?: string[];
    
    // Format
    format?: 'json' | 'csv' | 'xml' | 'xlsx';
    
    // Caching
    cache?: boolean;
    ttl?: number;
}

// Webhook payload structure
export interface WebhookPayload {
    event: string;
    timestamp: string;
    data: {
        object: any;
        previous?: any;
        changes?: string[];
    };
    metadata: {
        request_id: string;
        user_id?: string;
        ip_address?: string;
        user_agent?: string;
    };
}

// API Client Configuration
export interface APIClientConfig {
    baseURL: string;
    apiKey?: string;
    bearerToken?: string;
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    headers?: Record<string, string>;
    interceptors?: {
        request?: (config: any) => any;
        response?: (response: any) => any;
        error?: (error: any) => any;
    };
}

// Plugin System for Custom Fields
export interface FieldPlugin {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;
    
    // Field type definition
    fieldType: {
        type: string;
        label: string;
        icon?: string;
        category: string;
        
        // Default configuration
        defaultConfig: Record<string, any>;
        
        // Configuration schema for admin
        configSchema: any; // JSON Schema
        
        // Validation rules
        validation: {
            required?: boolean;
            custom?: (value: any, config: any) => boolean | string;
        };
        
        // Rendering functions
        render: {
            input: (value: any, config: any) => string; // HTML for form input
            display: (value: any, config: any) => string; // HTML for display
            export: (value: any, config: any) => any; // For exports
        };
    };
    
    // Lifecycle hooks
    hooks?: {
        onCreate?: (value: any, config: any) => any;
        onUpdate?: (value: any, config: any, oldValue: any) => any;
        onDelete?: (value: any, config: any) => void;
        onValidate?: (value: any, config: any) => boolean | string;
    };
    
    // Dependencies
    dependencies?: string[];
    
    // Installation info
    installedAt?: string;
    enabled: boolean;
}

// API Documentation Schema
export interface APIDocumentation {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
        contact?: {
            name: string;
            email: string;
            url: string;
        };
        license?: {
            name: string;
            url: string;
        };
    };
    servers: Array<{
        url: string;
        description: string;
    }>;
    paths: Record<string, any>;
    components: {
        schemas: Record<string, any>;
        securitySchemes: Record<string, any>;
        parameters: Record<string, any>;
        responses: Record<string, any>;
    };
    security: Array<Record<string, any>>;
    tags: Array<{
        name: string;
        description: string;
    }>;
}

// Migration System
export interface Migration {
    id: string;
    name: string;
    version: string;
    description: string;
    up: () => Promise<void>;
    down: () => Promise<void>;
    dependencies?: string[];
    createdAt: string;
    executedAt?: string;
    rollbackAt?: string;
}

// Event System for Internal Communication
export interface SystemEvent {
    id: string;
    type: string;
    source: string;
    data: any;
    timestamp: string;
    correlationId?: string;
    metadata?: Record<string, any>;
}

// Configuration Schema
export interface SystemConfiguration {
    // Database settings
    database: {
        host: string;
        port: number;
        name: string;
        ssl: boolean;
        pool_size: number;
        timeout: number;
    };
    
    // Cache settings
    cache: {
        enabled: boolean;
        type: 'memory' | 'redis' | 'memcached';
        ttl: number;
        max_size: number;
    };
    
    // Security settings
    security: {
        encryption_key: string;
        jwt_secret: string;
        session_timeout: number;
        password_policy: {
            min_length: number;
            require_uppercase: boolean;
            require_lowercase: boolean;
            require_numbers: boolean;
            require_special: boolean;
        };
        rate_limiting: {
            enabled: boolean;
            window_size: number;
            max_requests: number;
        };
    };
    
    // File storage settings
    storage: {
        type: 'local' | 's3' | 'gcs' | 'azure';
        config: Record<string, any>;
        max_file_size: number;
        allowed_types: string[];
    };
    
    // Email settings
    email: {
        provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
        config: Record<string, any>;
        templates_path: string;
    };
    
    // Feature flags
    features: {
        webhooks_enabled: boolean;
        analytics_enabled: boolean;
        file_uploads_enabled: boolean;
        two_factor_auth: boolean;
        custom_fields: boolean;
        plugins: boolean;
        ai_recommendations: boolean;
    };
    
    // Integration settings
    integrations: {
        slack: { enabled: boolean; webhook_url?: string };
        discord: { enabled: boolean; webhook_url?: string };
        github: { enabled: boolean; token?: string };
        jira: { enabled: boolean; config?: any };
        zendesk: { enabled: boolean; config?: any };
    };
}

// Export all endpoints as a type for type safety
export type APIEndpointKey = keyof typeof API_ENDPOINTS;
export type ToolsEndpointKey = keyof typeof API_ENDPOINTS.tools;
export type CategoriesEndpointKey = keyof typeof API_ENDPOINTS.categories;