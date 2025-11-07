// lib/ratings.ts - Rating and comment system
export interface ToolRating {
  id: string;
  toolId: string;
  userId: string;
  userEmail: string;
  userRole: string;
  rating: number; // 1-5 stars
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  helpful: number; // helpful votes
  reported: boolean;
}

export interface ToolComment {
  id: string;
  toolId: string;
  userId: string;
  userEmail: string;
  userRole: string;
  comment: string;
  parentId?: string; // for replies
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  replies: ToolComment[];
  isEdited: boolean;
}

export interface RatingAggregation {
  toolId: string;
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  lastUpdated: Date;
}

// Mock storage
const toolRatings: ToolRating[] = [
  {
    id: 'r1',
    toolId: '1',
    userId: 'user1',
    userEmail: 'dev@company.com',
    userRole: 'backend',
    rating: 5,
    comment: 'Отличен инструмент за AI асистенция! Много ми помага с кода.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    helpful: 12,
    reported: false
  },
  {
    id: 'r2',
    toolId: '1',
    userId: 'user2',
    userEmail: 'designer@company.com',
    userRole: 'designer',
    rating: 4,
    comment: 'Добър за текст генериране, но не толкова за дизайн задачи.',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    helpful: 8,
    reported: false
  },
  {
    id: 'r3',
    toolId: '2',
    userId: 'user3',
    userEmail: 'pm@company.com',
    userRole: 'pm',
    rating: 5,
    comment: 'Незаменим за колаборативен дизайн. Много интуитивен интерфейс.',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    helpful: 15,
    reported: false
  }
];

const toolComments: ToolComment[] = [
  {
    id: 'c1',
    toolId: '1',
    userId: 'user1',
    userEmail: 'qa@company.com',
    userRole: 'qa',
    comment: 'Използвам го ежедневно за автоматизиране на тестове. Препоръчвам!',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    likes: 6,
    replies: [],
    isEdited: false
  },
  {
    id: 'c2',
    toolId: '1',
    userId: 'user2',
    userEmail: 'frontend@company.com',
    userRole: 'frontend',
    comment: 'Има ли някой опит с React hooks генерирането?',
    parentId: 'c1',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
    likes: 3,
    replies: [],
    isEdited: false
  }
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export class RatingService {
  
  // Add or update rating
  static async addRating(params: {
    toolId: string;
    userId: string;
    userEmail: string;
    userRole: string;
    rating: number;
    comment?: string;
  }): Promise<ToolRating> {
    
    // Check if user already rated this tool
    const existingRatingIndex = toolRatings.findIndex(
      r => r.toolId === params.toolId && r.userId === params.userId
    );

    const ratingData: ToolRating = {
      id: existingRatingIndex >= 0 ? toolRatings[existingRatingIndex].id : generateId(),
      toolId: params.toolId,
      userId: params.userId,
      userEmail: params.userEmail,
      userRole: params.userRole,
      rating: params.rating,
      comment: params.comment,
      createdAt: existingRatingIndex >= 0 ? toolRatings[existingRatingIndex].createdAt : new Date(),
      updatedAt: new Date(),
      helpful: existingRatingIndex >= 0 ? toolRatings[existingRatingIndex].helpful : 0,
      reported: false
    };

    if (existingRatingIndex >= 0) {
      // Update existing rating
      toolRatings[existingRatingIndex] = ratingData;
    } else {
      // Add new rating
      toolRatings.unshift(ratingData);
    }

    console.log(`⭐ Rating ${existingRatingIndex >= 0 ? 'updated' : 'added'}: ${params.rating}/5 for tool ${params.toolId}`);
    
    return ratingData;
  }

  // Get ratings for a tool
  static async getToolRatings(toolId: string, options: {
    limit?: number;
    offset?: number;
    sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
  } = {}): Promise<{ ratings: ToolRating[]; total: number; aggregation: RatingAggregation }> {
    
    let filteredRatings = toolRatings.filter(r => r.toolId === toolId && !r.reported);

    // Sort ratings
    switch (options.sortBy || 'newest') {
      case 'newest':
        filteredRatings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        filteredRatings.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'highest':
        filteredRatings.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filteredRatings.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filteredRatings.sort((a, b) => b.helpful - a.helpful);
        break;
    }

    const total = filteredRatings.length;
    
    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 10;
    const paginatedRatings = filteredRatings.slice(offset, offset + limit);

    // Calculate aggregation
    const aggregation = this.calculateAggregation(toolId);

    return { ratings: paginatedRatings, total, aggregation };
  }

  // Calculate rating aggregation
  static calculateAggregation(toolId: string): RatingAggregation {
    const ratings = toolRatings.filter(r => r.toolId === toolId && !r.reported);
    
    if (ratings.length === 0) {
      return {
        toolId,
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        lastUpdated: new Date()
      };
    }

    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Math.round((sumRatings / totalRatings) * 10) / 10; // Round to 1 decimal

    const ratingDistribution = ratings.reduce((acc, r) => {
      acc[r.rating as keyof typeof acc]++;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    return {
      toolId,
      averageRating,
      totalRatings,
      ratingDistribution,
      lastUpdated: new Date()
    };
  }

  // Mark rating as helpful
  static async markHelpful(ratingId: string, userId: string): Promise<boolean> {
    const ratingIndex = toolRatings.findIndex(r => r.id === ratingId);
    
    if (ratingIndex >= 0) {
      toolRatings[ratingIndex].helpful++;
      console.log(`👍 Rating ${ratingId} marked as helpful by ${userId}`);
      return true;
    }
    
    return false;
  }

  // Report rating
  static async reportRating(ratingId: string, userId: string, reason: string): Promise<boolean> {
    const ratingIndex = toolRatings.findIndex(r => r.id === ratingId);
    
    if (ratingIndex >= 0) {
      toolRatings[ratingIndex].reported = true;
      console.log(`🚨 Rating ${ratingId} reported by ${userId}: ${reason}`);
      return true;
    }
    
    return false;
  }

  // Get user's rating for a tool
  static async getUserRating(toolId: string, userId: string): Promise<ToolRating | null> {
    return toolRatings.find(r => r.toolId === toolId && r.userId === userId) || null;
  }
}

export class CommentService {
  
  // Add comment
  static async addComment(params: {
    toolId: string;
    userId: string;
    userEmail: string;
    userRole: string;
    comment: string;
    parentId?: string;
  }): Promise<ToolComment> {
    
    const commentData: ToolComment = {
      id: generateId(),
      toolId: params.toolId,
      userId: params.userId,
      userEmail: params.userEmail,
      userRole: params.userRole,
      comment: params.comment,
      parentId: params.parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      replies: [],
      isEdited: false
    };

    toolComments.unshift(commentData);
    
    console.log(`💬 Comment added for tool ${params.toolId} by ${params.userEmail}`);
    
    return commentData;
  }

  // Get comments for a tool
  static async getToolComments(toolId: string, options: {
    limit?: number;
    offset?: number;
    sortBy?: 'newest' | 'oldest' | 'likes';
  } = {}): Promise<{ comments: ToolComment[]; total: number }> {
    
    // Get top-level comments (no parentId)
    let filteredComments = toolComments.filter(c => c.toolId === toolId && !c.parentId);

    // Sort comments
    switch (options.sortBy || 'newest') {
      case 'newest':
        filteredComments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        filteredComments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'likes':
        filteredComments.sort((a, b) => b.likes - a.likes);
        break;
    }

    // Add replies to each comment
    filteredComments = filteredComments.map(comment => ({
      ...comment,
      replies: toolComments
        .filter(c => c.parentId === comment.id)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) // Replies always oldest first
    }));

    const total = filteredComments.length;
    
    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 10;
    const paginatedComments = filteredComments.slice(offset, offset + limit);

    return { comments: paginatedComments, total };
  }

  // Like comment
  static async likeComment(commentId: string, userId: string): Promise<boolean> {
    const commentIndex = toolComments.findIndex(c => c.id === commentId);
    
    if (commentIndex >= 0) {
      toolComments[commentIndex].likes++;
      console.log(`👍 Comment ${commentId} liked by ${userId}`);
      return true;
    }
    
    return false;
  }

  // Edit comment
  static async editComment(commentId: string, userId: string, newComment: string): Promise<boolean> {
    const commentIndex = toolComments.findIndex(c => c.id === commentId && c.userId === userId);
    
    if (commentIndex >= 0) {
      toolComments[commentIndex].comment = newComment;
      toolComments[commentIndex].updatedAt = new Date();
      toolComments[commentIndex].isEdited = true;
      console.log(`✏️ Comment ${commentId} edited by ${userId}`);
      return true;
    }
    
    return false;
  }

  // Delete comment
  static async deleteComment(commentId: string, userId: string): Promise<boolean> {
    const commentIndex = toolComments.findIndex(c => c.id === commentId && c.userId === userId);
    
    if (commentIndex >= 0) {
      // Also delete replies
      const repliesToDelete = toolComments.filter(c => c.parentId === commentId);
      repliesToDelete.forEach(reply => {
        const replyIndex = toolComments.findIndex(c => c.id === reply.id);
        if (replyIndex >= 0) {
          toolComments.splice(replyIndex, 1);
        }
      });
      
      toolComments.splice(commentIndex, 1);
      console.log(`🗑️ Comment ${commentId} deleted by ${userId}`);
      return true;
    }
    
    return false;
  }
}

export { toolRatings, toolComments };