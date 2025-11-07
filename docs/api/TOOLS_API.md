# AI Tools Management API Documentation

## Overview
Complete CRUD API for AI Tools Management System with extensible architecture for future enhancements.

## Base URL
```
Development: http://localhost:8000/api
Production: https://your-domain.com/api
```

## Authentication
All API requests require authentication via Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

---

## 📋 CRUD Operations

### 🔍 GET /api/tools
Retrieve all tools with optional filtering and pagination.

**Query Parameters:**
```
?page=1                    # Pagination (default: 1)
?per_page=20              # Items per page (default: 15, max: 100)
?category=ai-writing      # Filter by category slug
?categories[]=1&categories[]=2  # Filter by multiple category IDs
?tags[]=machine-learning&tags[]=nlp  # Filter by tags
?ai_type=text             # Filter by AI type
?difficulty_level=beginner # Filter by difficulty
?pricing_type=free        # Filter by pricing model
?featured=true            # Get only featured tools
?search=chatgpt           # Full text search
?sort_by=name            # Sort by: name, created_at, rating, usage_count
?sort_direction=asc      # Sort direction: asc, desc
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "ChatGPT",
      "slug": "chatgpt",
      "description": "Advanced conversational AI...",
      "short_description": "AI chatbot for conversations",
      "category": "AI Writing",
      "url": "https://chat.openai.com",
      "website_url": "https://openai.com",
      "documentation_url": "https://platform.openai.com/docs",
      "video_url": "https://youtube.com/watch?v=example",
      "github_url": null,
      "logo_url": "https://example.com/logo.png",
      "screenshots": [
        "https://example.com/screenshot1.png",
        "https://example.com/screenshot2.png"
      ],
      "ai_type": "text",
      "difficulty_level": "beginner",
      "pricing_type": "freemium",
      "price_per_month": 20.00,
      "features": [
        "Text Generation",
        "Code Assistance",
        "Translations"
      ],
      "supported_formats": ["text", "code", "markdown"],
      "integrations": ["api", "plugins", "third-party"],
      "target_roles": ["developer", "content-creator", "student"],
      "view_count": 15420,
      "usage_count": 8934,
      "average_rating": 4.8,
      "total_ratings": 1250,
      "status": "approved",
      "is_featured": true,
      "featured_until": "2024-12-31T23:59:59.000000Z",
      "is_active": true,
      "metadata": {
        "api_version": "v1",
        "last_updated": "2024-11-07"
      },
      "categories": [
        {
          "id": 1,
          "name": "AI Writing",
          "slug": "ai-writing",
          "description": "Tools for content creation"
        }
      ],
      "tags": [
        {
          "id": 1,
          "name": "Natural Language Processing",
          "slug": "nlp"
        }
      ],
      "creator": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "created_at": "2024-01-15T10:00:00.000000Z",
      "updated_at": "2024-11-07T14:30:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 45,
    "last_page": 3
  },
  "links": {
    "first": "http://localhost:8000/api/tools?page=1",
    "last": "http://localhost:8000/api/tools?page=3",
    "next": "http://localhost:8000/api/tools?page=2",
    "prev": null
  }
}
```

### 🔍 GET /api/tools/{id}
Retrieve a specific tool by ID.

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "ChatGPT",
    // ... same structure as above
    "related_tools": [
      {
        "id": 2,
        "name": "Claude",
        "similarity_score": 0.85
      }
    ]
  }
}
```

### ➕ POST /api/tools
Create a new tool.

**Request Body:**
```json
{
  "name": "New AI Tool",
  "description": "Detailed description of the AI tool",
  "short_description": "Brief description",
  "category_id": 1,
  "url": "https://example.com",
  "website_url": "https://example.com",
  "documentation_url": "https://docs.example.com",
  "video_url": "https://youtube.com/watch?v=example",
  "github_url": "https://github.com/example/repo",
  "logo_url": "https://example.com/logo.png",
  "screenshots": ["url1", "url2"],
  "ai_type": "text",
  "difficulty_level": "beginner",
  "pricing_type": "free",
  "price_per_month": 0,
  "features": ["Feature 1", "Feature 2"],
  "supported_formats": ["text", "json"],
  "integrations": ["api", "webhook"],
  "target_roles": ["developer", "designer"],
  "metadata": {
    "custom_field": "value"
  },
  "tag_ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "message": "Tool created successfully",
  "data": {
    // Created tool object
  }
}
```

### ✏️ PUT /api/tools/{id}
Update an existing tool (full update).

**Request Body:** Same as POST

### ✏️ PATCH /api/tools/{id}
Partially update a tool.

**Request Body:**
```json
{
  "name": "Updated Tool Name",
  "price_per_month": 25.00
}
```

### 🗑️ DELETE /api/tools/{id}
Delete a tool.

**Response:**
```json
{
  "message": "Tool deleted successfully"
}
```

---

## 📊 Analytics & Statistics

### 📈 GET /api/tools/{id}/statistics
Get detailed statistics for a specific tool.

**Response:**
```json
{
  "data": {
    "tool_id": 1,
    "view_count": 15420,
    "usage_count": 8934,
    "average_rating": 4.8,
    "total_ratings": 1250,
    "rating_distribution": {
      "5": 800,
      "4": 300,
      "3": 100,
      "2": 30,
      "1": 20
    },
    "monthly_views": {
      "2024-10": 2340,
      "2024-11": 1876
    },
    "top_referrers": [
      {"source": "google.com", "count": 500},
      {"source": "github.com", "count": 300}
    ]
  }
}
```

### 📊 POST /api/tools/{id}/track-usage
Track tool usage (increment usage counter).

### ⭐ POST /api/tools/{id}/rate
Rate a tool.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent tool!"
}
```

---

## 🔄 Bulk Operations

### 📋 GET /api/tools/bulk/export
Export tools data.

**Query Parameters:**
```
?format=json|csv|xlsx
?category_ids[]=1&category_ids[]=2
?include_ratings=true
```

### 📥 POST /api/tools/bulk/import
Import tools data.

**Request Body:** Multipart form with file upload

### 🗑️ DELETE /api/tools/bulk
Bulk delete tools.

**Request Body:**
```json
{
  "tool_ids": [1, 2, 3, 4]
}
```

### ✏️ PATCH /api/tools/bulk/update
Bulk update tools.

**Request Body:**
```json
{
  "tool_ids": [1, 2, 3],
  "updates": {
    "category_id": 2,
    "is_featured": true
  }
}
```

---

## 🏷️ Categories Management

### 📋 GET /api/categories
Get all categories.

### ➕ POST /api/categories
Create new category.

**Request Body:**
```json
{
  "name": "AI Research",
  "slug": "ai-research",
  "description": "Research-focused AI tools",
  "parent_id": null,
  "metadata": {
    "icon": "🔬",
    "color": "#3B82F6"
  }
}
```

### ✏️ PUT /api/categories/{id}
Update category.

### 🗑️ DELETE /api/categories/{id}
Delete category.

---

## 🏷️ Tags Management

### 📋 GET /api/tags
Get all tags.

### ➕ POST /api/tags
Create new tag.

### ✏️ PUT /api/tags/{id}
Update tag.

### 🗑️ DELETE /api/tags/{id}
Delete tag.

---

## 🔍 Advanced Search

### 🔎 POST /api/tools/search
Advanced search with complex queries.

**Request Body:**
```json
{
  "query": "AI writing assistant",
  "filters": {
    "category_ids": [1, 2],
    "pricing_types": ["free", "freemium"],
    "difficulty_levels": ["beginner", "intermediate"],
    "ai_types": ["text"],
    "min_rating": 4.0,
    "max_price": 50,
    "has_free_tier": true,
    "supports_api": true
  },
  "sort": {
    "field": "average_rating",
    "direction": "desc"
  },
  "facets": ["categories", "tags", "pricing_types"],
  "highlight": true
}
```

---

## 🤖 AI Integration Endpoints (Future)

### 🧠 POST /api/tools/{id}/ai-analyze
Analyze tool using AI.

### 📝 POST /api/tools/ai-generate-description
Generate tool description using AI.

### 🏷️ POST /api/tools/ai-suggest-categories
Suggest categories for a tool using AI.

### 📊 GET /api/tools/ai-recommendations/{user_id}
Get AI-powered tool recommendations.

---

## 🔗 Integration Endpoints (Future)

### 📡 POST /api/tools/{id}/webhooks
Configure webhooks for tool events.

### 🔄 GET /api/tools/{id}/integrations
Get available integrations for a tool.

### 📊 POST /api/tools/{id}/sync-data
Sync tool data from external sources.

---

## 📈 Analytics Dashboard (Future)

### 📊 GET /api/analytics/dashboard
Get dashboard analytics data.

### 📈 GET /api/analytics/trends
Get market trends and insights.

### 👥 GET /api/analytics/user-behavior
Get user behavior analytics.

---

## 🔒 Admin Endpoints

### 👑 POST /api/admin/tools/{id}/feature
Feature/unfeature a tool.

### ✅ POST /api/admin/tools/{id}/approve
Approve a pending tool.

### ❌ POST /api/admin/tools/{id}/reject
Reject a pending tool.

**Request Body:**
```json
{
  "rejection_reason": "Does not meet quality standards"
}
```

---

## 📄 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  },
  "error_code": "VALIDATION_ERROR"
}
```

### Validation Errors
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["The name field is required."],
    "url": ["The url must be a valid URL."]
  }
}
```

---

## 🔧 Configuration

### Environment Variables
```env
API_RATE_LIMIT=60          # Requests per minute
API_CACHE_TTL=300         # Cache TTL in seconds
ENABLE_AI_FEATURES=true   # Enable AI-powered features
ENABLE_ANALYTICS=true     # Enable analytics tracking
MAX_FILE_SIZE=10MB        # Maximum upload file size
ALLOWED_FILE_TYPES=jpg,png,pdf  # Allowed file extensions
```

### Rate Limiting
- **Public endpoints**: 60 requests per minute
- **Authenticated endpoints**: 120 requests per minute
- **Admin endpoints**: 300 requests per minute

### Caching
- **Tools list**: 5 minutes
- **Tool details**: 10 minutes
- **Categories**: 1 hour
- **Statistics**: 15 minutes

---

## 🚀 Future Expansion Roadmap

### Phase 1: Core Enhancements
- [ ] AI-powered tool categorization
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications
- [ ] Tool comparison features

### Phase 2: Integrations
- [ ] Slack/Discord bot integration
- [ ] GitHub marketplace sync
- [ ] Third-party API connectors
- [ ] Webhook system

### Phase 3: Advanced Features
- [ ] Machine learning recommendations
- [ ] Automated tool discovery
- [ ] Performance benchmarking
- [ ] Community features (reviews, discussions)

### Phase 4: Enterprise Features
- [ ] Multi-tenant support
- [ ] Advanced permissions
- [ ] Custom fields framework
- [ ] Enterprise SSO integration

This API is designed to be backward-compatible as new features are added.