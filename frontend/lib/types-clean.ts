// lib/types-clean.ts - Clean type definitions
export enum ToolCategory {
  AI_ML = 'ai_ml',
  DEVELOPMENT = 'development',
  DESIGN = 'design',
  PRODUCTIVITY = 'productivity',
  MARKETING = 'marketing',
  ANALYTICS = 'analytics',
  AUTOMATION = 'automation',
  COMMUNICATION = 'communication',
  EDUCATION = 'education',
  BUSINESS = 'business',
  OTHER = 'other'
}

export enum ToolStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived'
}

export enum UserRole {
  OWNER = 'owner',
  PM = 'pm',
  BACKEND = 'backend',
  FRONTEND = 'frontend',
  QA = 'qa',
  DESIGNER = 'designer'
}

export type ApprovalAction = 'approve' | 'reject';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  status: ToolStatus;
  submittedBy: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  tags: string[];
  url: string;
  pricing: 'free' | 'freemium' | 'paid';
  targetRoles?: UserRole[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  metadata?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface FilterOptions {
  category?: ToolCategory | ToolCategory[];
  status?: ToolStatus | ToolStatus[];
  tags?: string[];
  submittedBy?: string;
  search?: string;
  pricing?: string[];
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'submittedAt' | 'approvedAt' | 'category';
  sortOrder?: 'asc' | 'desc';
}

export interface ToolsResponse {
  tools: Tool[];
  total: number;
  pages: number;
  currentPage: number;
  filters: FilterOptions;
}

export interface ToolFormData {
  name: string;
  description: string;
  category: ToolCategory | '';
  url: string;
  pricing: 'free' | 'freemium' | 'paid' | '';
  tags: string[];
  targetRoles: UserRole[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | '';
}

// 2FA Authentication types
export interface TwoFactorAuthRequest {
  email: string;
  code?: string;
  action?: 'send_code' | 'verify_code';
}

export interface TwoFactorAuthResponse {
  success: boolean;
  error?: string;
  token?: string;
  requiresCode?: boolean;
}

export interface TwoFactorSession {
  email: string;
  code: string;
  expiresAt: Date;
  attempts: number;
  verified?: boolean;
}

export interface AuthSession {
  token: string;
  userId: string;
  email: string;
  role: UserRole;
  expiresAt: Date;
}

// Admin Stats types
export interface AdminStats {
  totalTools: number;
  pendingApproval: number;
  approvedTools: number;
  rejectedTools: number;
  toolsByCategory: Array<{ category: string; count: number; }>;
  recentSubmissions: Tool[];
  topContributors: Array<{ user: string; count: number; }>;
}