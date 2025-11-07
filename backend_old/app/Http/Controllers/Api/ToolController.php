<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ToolController extends Controller
{
    /**
     * Display a listing of tools
     */
    public function index(Request $request): JsonResponse
    {
        $query = Tool::with(['category', 'user', 'ratings']);
        
        // Filtering
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'ILIKE', '%' . $request->search . '%')
                  ->orWhere('description', 'ILIKE', '%' . $request->search . '%');
            });
        }
        
        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        
        // Pagination
        $perPage = $request->get('per_page', 15);
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
            'description' => 'required|string|max:1000',
            'category_id' => 'required|exists:categories,id',
            'url' => 'required|url',
            'pricing' => 'required|in:free,freemium,paid',
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

        $tool = Tool::create([
            'name' => $request->name,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'url' => $request->url,
            'pricing' => $request->pricing,
            'tags' => $request->tags ?? [],
            'target_roles' => $request->target_roles ?? [],
            'difficulty' => $request->difficulty,
            'status' => 'pending',
            'user_id' => auth()->id(),
        ]);

        // Log audit
        audit_log('tool.created', $tool->toArray(), $tool->id);

        return response()->json([
            'message' => 'Tool created successfully',
            'data' => $tool->load(['category', 'user'])
        ], 201);
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