// lib/audit.ts - Comprehensive audit logging system
export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userEmail: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}

export type AuditAction = 
  // Authentication
  | 'auth.login' 
  | 'auth.logout' 
  | 'auth.2fa_request' 
  | 'auth.2fa_verify' 
  | 'auth.failed_login'
  // Tool Management
  | 'tool.create' 
  | 'tool.update' 
  | 'tool.delete' 
  | 'tool.approve' 
  | 'tool.reject'
  | 'tool.view'
  // Admin Actions
  | 'admin.user_role_change'
  | 'admin.settings_update'
  | 'admin.bulk_action'
  | 'admin.export_data'
  | 'admin.view_stats'
  | 'admin.unauthorized_access'
  // System
  | 'system.cache_clear'
  | 'system.maintenance'
  | 'system.backup';

// In-memory audit log storage (in production use database)
const auditLogs: AuditLog[] = [];

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Audit logger class
export class AuditLogger {
  
  // Log an action
  static async log(params: {
    userId: string;
    userEmail: string;
    userRole: string;
    action: AuditAction;
    resource: string;
    resourceId: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    success?: boolean;
    errorMessage?: string;
  }): Promise<void> {
    
    const auditLog: AuditLog = {
      id: generateId(),
      timestamp: new Date(),
      userId: params.userId,
      userEmail: params.userEmail,
      userRole: params.userRole,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      details: params.details || {},
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      success: params.success !== false, // Default to true unless explicitly false
      errorMessage: params.errorMessage
    };

    // Store the log
    auditLogs.unshift(auditLog); // Add to beginning for recent-first order

    // Keep only last 1000 logs in memory
    if (auditLogs.length > 1000) {
      auditLogs.splice(1000);
    }

    // Log to console for debugging
    console.log(`📋 AUDIT LOG:`, {
      action: auditLog.action,
      user: `${auditLog.userEmail} (${auditLog.userRole})`,
      resource: `${auditLog.resource}:${auditLog.resourceId}`,
      success: auditLog.success,
      timestamp: auditLog.timestamp.toISOString()
    });

    // In production, also save to database
    // await saveToDatabase(auditLog);
  }

  // Get audit logs with filtering
  static async getLogs(filters: {
    userId?: string;
    action?: AuditAction;
    resource?: string;
    success?: boolean;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ logs: AuditLog[]; total: number }> {
    
    let filteredLogs = [...auditLogs];

    // Apply filters
    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }

    if (filters.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action);
    }

    if (filters.resource) {
      filteredLogs = filteredLogs.filter(log => log.resource === filters.resource);
    }

    if (filters.success !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.success === filters.success);
    }

    if (filters.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
    }

    if (filters.endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
    }

    const total = filteredLogs.length;
    
    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    
    const paginatedLogs = filteredLogs.slice(offset, offset + limit);

    return { logs: paginatedLogs, total };
  }

  // Get activity summary
  static async getActivitySummary(timeRange: 'today' | 'week' | 'month' = 'today'): Promise<{
    totalActions: number;
    successfulActions: number;
    failedActions: number;
    topUsers: Array<{ email: string; count: number }>;
    topActions: Array<{ action: string; count: number }>;
    recentActivity: AuditLog[];
  }> {
    
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const { logs } = await this.getLogs({ startDate, limit: 1000 });

    // Calculate summary stats
    const totalActions = logs.length;
    const successfulActions = logs.filter(log => log.success).length;
    const failedActions = totalActions - successfulActions;

    // Top users by activity
    const userCounts = logs.reduce((acc, log) => {
      acc[log.userEmail] = (acc[log.userEmail] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topUsers = Object.entries(userCounts)
      .map(([email, count]) => ({ email, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top actions
    const actionCounts = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent activity (last 10 actions)
    const recentActivity = logs.slice(0, 10);

    return {
      totalActions,
      successfulActions,
      failedActions,
      topUsers,
      topActions,
      recentActivity
    };
  }

  // Helper function to extract user info from request
  static extractUserFromRequest(request: Request): {
    userId: string;
    userEmail: string;
    userRole: string;
    ipAddress?: string;
    userAgent?: string;
  } {
    // Extract from headers (set by middleware)
    const userEmail = request.headers.get('x-user-email') || 'unknown@example.com';
    const userRole = request.headers.get('x-user-role') || 'unknown';
    const userId = userEmail; // Using email as ID for simplicity
    
    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    return { userId, userEmail, userRole, ipAddress, userAgent };
  }

  // Clear old logs (retention policy)
  static async clearOldLogs(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    const initialCount = auditLogs.length;
    
    // Remove logs older than cutoff
    for (let i = auditLogs.length - 1; i >= 0; i--) {
      if (auditLogs[i].timestamp < cutoffDate) {
        auditLogs.splice(i, 1);
      }
    }

    const removedCount = initialCount - auditLogs.length;
    console.log(`🧹 Cleaned up ${removedCount} old audit logs (keeping ${daysToKeep} days)`);
    
    return removedCount;
  }
}

// Audit decorator for functions
export function withAudit(
  action: AuditAction,
  resource: string,
  getResourceId: (args: any[]) => string = () => 'unknown'
) {
  return function auditDecorator(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      let success = true;
      let errorMessage: string | undefined;

      try {
        const result = await method.apply(this, args);
        return result;
      } catch (error) {
        success = false;
        errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      } finally {
        // Log the action (would need request context in real implementation)
        console.log(`🔍 Method ${propertyName} executed:`, {
          action,
          resource,
          success,
          duration: Date.now() - startTime + 'ms',
          error: errorMessage
        });
      }
    };

    return descriptor;
  };
}

export { auditLogs };