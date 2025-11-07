# 🤖 AI Agents Development Guide

> **Complete guide for using AI coding agents with the AI Tools Management System**

## 📋 Table of Contents

- [🎯 Quick Agent Setup](#-quick-agent-setup)  
- [🚀 Initial Development Prompts](#-initial-development-prompts)
- [🔧 Feature Development Templates](#-feature-development-templates)
- [🐛 Debugging Prompts](#-debugging-prompts)
- [📝 Code Quality Standards](#-code-quality-standards)
- [🧪 Testing Integration](#-testing-integration)
- [🔄 Common Workflows](#-common-workflows)

---

## 🎯 Quick Agent Setup

### **System Context Prompt** (Use this first!)
```
You are working on an enterprise AI Tools Management System:

📦 **TECH STACK:**
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS  
- Backend: Laravel 11, PHP 8.2, PostgreSQL
- Architecture: Full-stack with Supabase auth + Redis caching

🏗️ **PROJECT STRUCTURE:**
```
ai-tools-management-system/
├── frontend/          # Next.js App Router (NOT pages/)
│   ├── app/           # Pages and layouts
│   ├── components/    # React components  
│   ├── contexts/      # React contexts
│   └── lib/           # Utilities
├── backend/           # Laravel API
│   ├── app/Models/    # Eloquent models
│   ├── app/Http/      # Controllers & middleware
│   └── routes/api.php # API routes
└── docs/              # Documentation
```

🔐 **KEY SYSTEMS:**
- Role hierarchy: Owner → PM → Backend → Frontend → QA → Designer
- 2FA security: Email, Telegram, Google Authenticator  
- Admin panel: Tool approval workflow
- Caching: Redis for categories/stats
- Logging: Complete audit trail

📍 **CURRENT ENVIRONMENT:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000/api/v1
- Admin: http://localhost:3000/admin
- Database: PostgreSQL via Supabase

🎯 **CODING STANDARDS:**
- TypeScript strict mode
- Functional React components
- Laravel resource patterns
- Role-based access control
- Comprehensive error handling
```

---

## 🚀 Initial Development Prompts

### **🏁 Project Onboarding**
```
I'm starting work on the AI Tools Management System. Please help me:

1. **Understand the current state:**
   - What features are implemented?
   - What's the database schema?
   - How does authentication work?
   - What's the role system structure?

2. **Verify my environment:**
   - Check if both servers are running
   - Confirm database connections
   - Test API endpoints
   - Validate frontend routing

3. **Show me quick wins:**
   - What can I improve immediately?
   - Any obvious bugs or issues?
   - Performance bottlenecks?
   - Code quality improvements?

Please analyze the codebase and give me actionable next steps.
```

### **🔍 Feature Analysis Prompt**
```
I want to analyze the [FEATURE NAME] implementation:

**ANALYSIS REQUEST:**
- Current implementation status
- Database relationships involved  
- Frontend components structure
- API endpoints and logic
- Role permissions required
- Security considerations
- Performance implications

**SPECIFIC FOCUS:**
- Code quality and patterns
- Error handling completeness  
- TypeScript type safety
- User experience flow
- Mobile responsiveness

Please provide a detailed analysis with recommendations.
```

---

## 🔧 Feature Development Templates

### **🆕 New Feature Development**
```
I need to implement: [FEATURE DESCRIPTION]

**REQUIREMENTS:**
- Target user roles: [Owner/PM/Developer/etc.]
- Database changes needed: [Yes/No + details]
- API endpoints required: [List endpoints]
- Frontend pages/components: [Describe UI]
- Security requirements: [Permissions, validation]

**IMPLEMENTATION PLAN:**
1. Database migrations (if needed)
2. Laravel models and relationships
3. API controllers and routes  
4. Frontend components and pages
5. Role-based access control
6. Testing and validation

**CONSTRAINTS:**
- Must preserve existing functionality
- Follow established patterns
- Include proper error handling
- Add audit logging for admin actions
- Update relevant documentation

Please create a step-by-step implementation plan.
```

### **🔧 API Development Template**
```
Creating new API endpoint: [ENDPOINT DESCRIPTION]

**ENDPOINT DETAILS:**
- Method: GET/POST/PUT/DELETE
- URL: /api/v1/[route]
- Purpose: [What it does]
- Required role: [Permission level]
- Request payload: [JSON structure]
- Response format: [Expected output]

**IMPLEMENTATION REQUIREMENTS:**
- Laravel controller with proper validation
- Eloquent relationships and queries
- Role middleware protection  
- Error handling with proper HTTP codes
- Rate limiting considerations
- Cache invalidation (if applicable)
- Audit logging for sensitive operations

**SUCCESS CRITERIA:**
- API returns consistent response format
- Proper error messages
- Performance optimized queries
- Security validated
- Tests written and passing

Please implement following Laravel best practices.
```

### **🎨 Frontend Component Template**
```
Building new React component: [COMPONENT NAME]

**COMPONENT SPECS:**
- Purpose: [What it does]
- Props interface: [TypeScript definitions]
- State management: [Local/Context/External]
- User interactions: [Click, form, etc.]
- Role restrictions: [Who can see/use it]

**UI REQUIREMENTS:**
- Responsive design (mobile-first)
- Tailwind CSS styling
- Loading states and error handling
- Accessibility compliance
- Dark/light mode support
- Toast notifications integration

**INTEGRATION:**
- API endpoints used: [List APIs]
- Context dependencies: [Auth, Toast, etc.]
- Navigation/routing: [Where it fits]
- Parent/child relationships: [Component tree]

**QUALITY STANDARDS:**
- TypeScript strict compliance
- Proper error boundaries
- Performance optimized
- Reusable and maintainable
- Comprehensive prop validation

Please create the component following our established patterns.
```

---

## 🐛 Debugging Prompts

### **🔍 General Debugging**
```
I'm experiencing this issue: [DESCRIBE PROBLEM]

**SYMPTOM DETAILS:**
- Where it occurs: [Frontend/Backend/Both]
- When it happens: [Specific actions/conditions]
- Error messages: [Exact text/stack traces]
- Affected user roles: [All users/Specific roles]
- Browser/environment: [Chrome, Firefox, etc.]

**DEBUGGING CHECKLIST:**
□ Check browser console for JavaScript errors
□ Verify API responses in Network tab  
□ Check Laravel logs: `tail -f storage/logs/laravel.log`
□ Confirm database connectivity
□ Validate environment variables
□ Test with different user roles
□ Clear caches (both Redis and browser)

**SYSTEM STATUS:**
- Frontend server: [Running/Stopped]
- Backend server: [Running/Stopped]  
- Database: [Connected/Disconnected]
- Redis: [Available/Unavailable]

Please help diagnose and fix this issue systematically.
```

### **🚨 Performance Issues**
```
Performance problem detected: [SLOW LOADING/HIGH MEMORY/ETC.]

**PERFORMANCE METRICS:**
- Page load time: [Seconds]
- API response time: [Milliseconds]
- Database query count: [Number]
- Memory usage: [MB/GB]
- Affected pages: [List URLs]

**ANALYSIS NEEDED:**
- Database query optimization
- N+1 query detection
- Cache hit/miss ratios
- Frontend bundle size
- Network request waterfall
- Redis cache effectiveness

**OPTIMIZATION TARGETS:**
- Database: Eager loading, indexes, query optimization
- Backend: Response caching, pagination, background jobs
- Frontend: Code splitting, lazy loading, memoization
- Infrastructure: CDN, compression, image optimization

Please analyze and provide specific optimization recommendations.
```

---

## 📝 Code Quality Standards

### **🔧 Laravel Controller Pattern**
```php
<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Services\CategoryCacheService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ToolController extends Controller
{
    protected $categoryCache;

    public function __construct(CategoryCacheService $categoryCache)
    {
        $this->categoryCache = $categoryCache;
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'category' => 'sometimes|string|max:50',
                'per_page' => 'sometimes|integer|min:1|max:100'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $tools = Tool::with(['user', 'categories'])
                ->when($request->category, fn($q) => $q->whereHas('categories', fn($q) => $q->where('name', $request->category)))
                ->where('status', 'approved')
                ->paginate($request->get('per_page', 10));

            return response()->json([
                'success' => true,
                'data' => $tools,
                'message' => 'Tools retrieved successfully'
            ]);

        } catch (\Exception $e) {
            logger()->error('Tool retrieval failed', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve tools'
            ], 500);
        }
    }
}
```

### **⚛️ React Component Pattern**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Tool, ApiResponse } from '@/types';

interface ToolListProps {
  category?: string;
  userRole: string;
  onToolSelect?: (tool: Tool) => void;
}

export default function ToolList({ category, userRole, onToolSelect }: ToolListProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchTools();
  }, [category]);

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (category) params.set('category', category);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse<{ data: Tool[] }> = await response.json();
      
      if (data.success) {
        setTools(data.data.data);
        showSuccess('Tools loaded successfully');
      } else {
        throw new Error(data.message || 'Failed to load tools');
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      showError('Loading failed', message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading tools..." />;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <ToolCard 
          key={tool.id} 
          tool={tool} 
          userRole={userRole}
          onClick={() => onToolSelect?.(tool)}
        />
      ))}
    </div>
  );
}
```

---

## 🧪 Testing Integration

### **🧪 Test Development Prompt**
```
Create comprehensive tests for: [COMPONENT/FEATURE]

**TEST REQUIREMENTS:**
- Unit tests for business logic
- Integration tests for API endpoints  
- Component tests for React components
- E2E tests for user workflows
- Role-based access testing
- Error handling validation

**TEST CASES TO COVER:**
- Happy path scenarios
- Error conditions and edge cases
- Role permission boundaries
- Input validation
- Performance under load
- Security vulnerabilities

**TOOLS TO USE:**
- Frontend: Jest, React Testing Library, Cypress
- Backend: PHPUnit, Laravel Dusk, Pest
- API: Postman collections, Newman
- Performance: Apache Bench, K6

Please create a comprehensive test suite following TDD principles.
```

### **🔄 Test Execution Prompt**
```
Run and validate the test suite:

**FRONTEND TESTS:**
```bash
cd frontend
npm test                    # Unit tests
npm run test:integration   # Integration tests  
npm run cypress:run        # E2E tests
npm run test:coverage      # Coverage report
```

**BACKEND TESTS:**
```bash
cd backend
php artisan test           # All Laravel tests
php artisan test --filter=ToolTest  # Specific tests
php artisan test --coverage        # Coverage report
```

**QUALITY GATES:**
- Test coverage > 80%
- All tests passing
- No security vulnerabilities
- Performance benchmarks met
- Accessibility compliance

Please analyze test results and identify any issues.
```

---

## 🔄 Common Workflows

### **📝 Feature Request Workflow**
```
New feature request: [FEATURE NAME]

**WORKFLOW STEPS:**
1. **Requirements Analysis**
   - Business need validation
   - User story creation  
   - Acceptance criteria definition
   - Technical feasibility assessment

2. **Design Phase**
   - Database schema changes
   - API endpoint design
   - UI/UX mockups
   - Security considerations

3. **Implementation Planning**
   - Task breakdown
   - Timeline estimation
   - Resource allocation
   - Risk assessment

4. **Development Execution**
   - Backend implementation
   - Frontend development
   - Integration testing
   - Code review process

5. **Quality Assurance**
   - Functional testing
   - Security validation
   - Performance testing  
   - User acceptance testing

6. **Deployment & Monitoring**
   - Staging deployment
   - Production release
   - Monitoring setup
   - Documentation updates

Please guide me through this workflow for the requested feature.
```

### **🐛 Bug Fix Workflow**
```
Bug report: [BUG DESCRIPTION]

**TRIAGE PROCESS:**
1. **Severity Assessment**
   - Critical: System down, data loss
   - High: Major functionality broken
   - Medium: Minor functionality issues  
   - Low: UI/UX improvements

2. **Root Cause Analysis**
   - Reproduce the issue
   - Identify affected components
   - Trace through code execution
   - Check related systems

3. **Fix Development**
   - Minimal viable fix
   - Comprehensive solution
   - Test case creation
   - Regression prevention

4. **Validation Process**
   - Fix verification
   - Regression testing
   - Performance impact
   - Security review

5. **Deployment Strategy**
   - Hotfix vs regular release
   - Rollback plan
   - Monitoring alerts
   - User communication

Please help me work through this bug systematically.
```

---

## 🎯 Pro Tips for AI Development

### **💡 Efficiency Boosters**

1. **Context Management**
   - Always start with the system context prompt
   - Include relevant file contents in your queries
   - Reference existing patterns and conventions
   - Mention specific error messages or logs

2. **Incremental Development**
   - Break large features into small tasks
   - Test each component independently  
   - Commit working code frequently
   - Document decisions and assumptions

3. **Quality Assurance**
   - Request code review before implementation
   - Ask for testing strategies upfront
   - Validate security implications
   - Consider performance impact

4. **Communication**
   - Use clear, specific prompts
   - Provide complete context
   - Ask follow-up questions
   - Request explanations of complex logic

### **🚫 Common Pitfalls to Avoid**

- Don't modify authentication flows without thorough testing
- Avoid breaking changes to public APIs
- Never hardcode sensitive information
- Don't skip migration rollback procedures
- Avoid bypassing role-based access controls

---

<div align="center">

**🤖 Ready to build amazing features with AI assistance!**

[⬆ Back to Top](#-ai-agents-development-guide)

</div>