<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ToolController extends Controller
{
    /**
     * Display a listing of tools
     */
    public function index(Request $request): JsonResponse
    {
        $query = Tool::with(['categories', 'tags', 'creator', 'updater']);
        
        // Filtering by multiple categories
        if ($request->has('categories') && is_array($request->categories)) {
            $query->whereHas('categories', function($q) use ($request) {
                $q->whereIn('categories.id', $request->categories);
            });
        }
        
        // Filtering by single category
        if ($request->has('category')) {
            $query->whereHas('categories', function($q) use ($request) {
                $q->where('categories.slug', $request->category)
                  ->orWhere('categories.id', $request->category);
            });
        }
        
        // Filtering by tags
        if ($request->has('tags') && is_array($request->tags)) {
            $query->whereHas('tags', function($q) use ($request) {
                $q->whereIn('tags.slug', $request->tags)
                  ->orWhereIn('tags.id', $request->tags);
            });
        }
        
        // Filter by AI type
        if ($request->has('ai_type')) {
            $query->where('ai_type', $request->ai_type);
        }
        
        // Filter by difficulty
        if ($request->has('difficulty')) {
            $query->where('difficulty_level', $request->difficulty);
        }
        
        // Filter by pricing type
        if ($request->has('pricing_type')) {
            $query->where('pricing_type', $request->pricing_type);
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            // Default to approved and active tools for public API
            $query->approved()->active();
        }
        
        // Filter by featured
        if ($request->boolean('featured')) {
            $query->featured();
        }
        
        // Search functionality
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('description', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('short_description', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhereHas('categories', function($catQuery) use ($searchTerm) {
                      $catQuery->where('name', 'LIKE', '%' . $searchTerm . '%');
                  })
                  ->orWhereHas('tags', function($tagQuery) use ($searchTerm) {
                      $tagQuery->where('name', 'LIKE', '%' . $searchTerm . '%');
                  });
            });
        }
        
        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        switch ($sortBy) {
            case 'rating':
                $query->orderBy('average_rating', $sortOrder);
                break;
            case 'popularity':
                $query->orderBy('view_count', $sortOrder);
                break;
            case 'usage':
                $query->orderBy('usage_count', $sortOrder);
                break;
            case 'name':
                $query->orderBy('name', $sortOrder);
                break;
            default:
                $query->orderBy($sortBy, $sortOrder);
        }
        
        // Pagination
        $perPage = min($request->get('per_page', 15), 50); // Max 50 per page
        $tools = $query->paginate($perPage);
        
        return response()->json([
            'data' => $tools->items(),
            'meta' => [
                'current_page' => $tools->currentPage(),
                'last_page' => $tools->lastPage(),
                'per_page' => $tools->perPage(),
                'total' => $tools->total(),
            ]
        ]);
    }

    /**
     * Store a newly created tool
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:tools',
            'description' => 'required|string|max:5000',
            'short_description' => 'nullable|string|max:500',
            'url' => 'required|url',
            'website_url' => 'nullable|url',
            'documentation_url' => 'nullable|url',
            'video_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'logo_url' => 'nullable|url',
            'screenshots' => 'nullable|array',
            'screenshots.*' => 'url',
            'ai_type' => 'required|in:nlp,cv,ml,generative,automation,analysis,other',
            'difficulty_level' => 'required|in:beginner,intermediate,advanced,expert',
            'pricing_type' => 'required|in:free,freemium,paid,enterprise',
            'price_per_month' => 'nullable|numeric|min:0',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'supported_formats' => 'nullable|array',
            'integrations' => 'nullable|array',
            'target_roles' => 'nullable|array',
            'metadata' => 'nullable|array',
            'admin_notes' => 'nullable|string|max:2000',
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:categories,id',
            'primary_category' => 'required|exists:categories,id|in:categories.*',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Create the tool
            $tool = Tool::create([
                'name' => $request->name,
                'description' => $request->description,
                'short_description' => $request->short_description,
                'url' => $request->url,
                'website_url' => $request->website_url,
                'documentation_url' => $request->documentation_url,
                'video_url' => $request->video_url,
                'github_url' => $request->github_url,
                'logo_url' => $request->logo_url,
                'screenshots' => $request->screenshots,
                'ai_type' => $request->ai_type,
                'difficulty_level' => $request->difficulty_level,
                'pricing_type' => $request->pricing_type,
                'price_per_month' => $request->price_per_month,
                'features' => $request->features,
                'supported_formats' => $request->supported_formats,
                'integrations' => $request->integrations,
                'target_roles' => $request->target_roles,
                'metadata' => $request->metadata,
                'admin_notes' => $request->admin_notes,
                'status' => 'draft',
                'is_active' => true,
                'created_by' => auth()->id(),
            ]);

            // Attach categories with primary flag
            $categoryData = [];
            foreach ($request->categories as $categoryId) {
                $categoryData[$categoryId] = [
                    'is_primary' => $categoryId == $request->primary_category
                ];
            }
            $tool->categories()->attach($categoryData);

            // Attach tags
            if ($request->has('tags') && !empty($request->tags)) {
                $tool->tags()->attach($request->tags);
                
                // Update tag usage counts
                Tag::whereIn('id', $request->tags)->each(function($tag) {
                    $tag->incrementUsage();
                });
            }

            DB::commit();
            
            return response()->json([
                'message' => 'Tool created successfully',
                'data' => $tool->load(['categories', 'tags', 'creator'])
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error creating tool',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified tool
     */
    public function show(string $id): JsonResponse
    {
        $tool = Tool::with(['category', 'user', 'ratings.user', 'comments.user'])
                   ->findOrFail($id);

        // Increment view count
        $tool->increment('views_count');

        return response()->json([
            'data' => $tool
        ]);
    }

    /**
     * Update the specified tool
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $tool = Tool::findOrFail($id);
        
        // Authorization check
        if (!$this->canUpdateTool($tool)) {
            return response()->json([
                'message' => 'Unauthorized to update this tool'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255|unique:tools,name,' . $id,
            'description' => 'string|max:1000',
            'category_id' => 'exists:categories,id',
            'url' => 'url',
            'pricing' => 'in:free,freemium,paid',
            'tags' => 'array',
            'tags.*' => 'string|max:50',
            'target_roles' => 'array',
            'target_roles.*' => 'in:owner,pm,backend,frontend,qa,designer',
            'difficulty' => 'nullable|in:beginner,intermediate,advanced'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $oldData = $tool->toArray();
        $tool->update($request->only([
            'name', 'description', 'category_id', 'url', 'pricing',
            'tags', 'target_roles', 'difficulty'
        ]));

        // Log audit
        audit_log('tool.updated', [
            'old' => $oldData,
            'new' => $tool->fresh()->toArray()
        ], $tool->id);

        return response()->json([
            'message' => 'Tool updated successfully',
            'data' => $tool->load(['category', 'user'])
        ]);
    }

    /**
     * Remove the specified tool
     */
    public function destroy(string $id): JsonResponse
    {
        $tool = Tool::findOrFail($id);
        
        // Authorization check
        if (!$this->canDeleteTool($tool)) {
            return response()->json([
                'message' => 'Unauthorized to delete this tool'
            ], 403);
        }

        $toolData = $tool->toArray();
        $tool->delete();

        // Log audit
        audit_log('tool.deleted', $toolData, $id);

        return response()->json([
            'message' => 'Tool deleted successfully'
        ]);
    }

    /**
     * Approve or reject tool
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $tool = Tool::findOrFail($id);
        
        // Only admins can change status
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected,under_review',
            'reason' => 'required_if:status,rejected|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $oldStatus = $tool->status;
        $tool->update([
            'status' => $request->status,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'rejection_reason' => $request->status === 'rejected' ? $request->reason : null
        ]);

        // Log audit
        audit_log('tool.status_changed', [
            'old_status' => $oldStatus,
            'new_status' => $request->status,
            'reason' => $request->reason
        ], $tool->id);

        return response()->json([
            'message' => 'Tool status updated successfully',
            'data' => $tool->fresh()
        ]);
    }

    /**
     * Check if user can update tool
     */
    private function canUpdateTool(Tool $tool): bool
    {
        $user = auth()->user();
        
        // Tool owner or admin can update
        return $tool->user_id === $user->id || $user->isAdmin();
    }

    /**
     * Check if user can delete tool
     */
    private function canDeleteTool(Tool $tool): bool
    {
        $user = auth()->user();
        
        // Only admin or owner can delete
        return $tool->user_id === $user->id || $user->isAdmin();
    }
}