<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\User;
use App\Models\UserRole;
use App\Services\CategoryCacheService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    protected $categoryCache;

    public function __construct(CategoryCacheService $categoryCache)
    {
        $this->categoryCache = $categoryCache;
    }

    /**
     * Get admin statistics
     */
    public function getStats(): JsonResponse
    {
        try {
            $stats = Cache::remember('admin_stats', 300, function () {
                return [
                    'total_users' => User::count(),
                    'total_tools' => Tool::count(),
                    'pending_tools' => Tool::where('status', 'pending')->count(),
                    'approved_tools' => Tool::where('status', 'approved')->count(),
                    'rejected_tools' => Tool::where('status', 'rejected')->count(),
                    'total_categories' => Tool::distinct('category')->count('category'),
                    'tools_by_category' => Tool::select('category', DB::raw('count(*) as total'))
                        ->groupBy('category')
                        ->pluck('total', 'category'),
                    'users_by_role' => UserRole::with('users')
                        ->get()
                        ->mapWithKeys(function ($role) {
                            return [$role->name => $role->users->count()];
                        }),
                    'recent_activity' => [
                        'new_users_today' => User::whereDate('created_at', today())->count(),
                        'new_tools_today' => Tool::whereDate('created_at', today())->count(),
                        'pending_approvals' => Tool::where('status', 'pending')->count(),
                    ]
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics'
            ], 500);
        }
    }

    /**
     * Get paginated list of tools with filters
     */
    public function getTools(Request $request): JsonResponse
    {
        try {
            $query = Tool::with(['user', 'category']);

            // Apply filters
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->has('category') && $request->category !== 'all') {
                $query->where('category', $request->category);
            }

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('url', 'like', "%{$search}%");
                });
            }

            // Sort by creation date (newest first)
            $query->orderBy('created_at', 'desc');

            // Paginate results
            $perPage = min($request->get('per_page', 10), 50); // Max 50 items per page
            $tools = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $tools
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch tools'
            ], 500);
        }
    }

    /**
     * Get paginated list of users with filters
     */
    public function getUsers(Request $request): JsonResponse
    {
        try {
            $query = User::with(['userRole']);

            // Apply role filter
            if ($request->has('role') && $request->role !== 'all') {
                $query->whereHas('userRole', function ($q) use ($request) {
                    $q->where('name', $request->role);
                });
            }

            // Apply search filter
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Sort by creation date (newest first)
            $query->orderBy('created_at', 'desc');

            // Paginate results
            $perPage = min($request->get('per_page', 10), 50); // Max 50 items per page
            $users = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users'
            ], 500);
        }
    }

    /**
     * Approve a tool
     */
    public function approveTool(Tool $tool): JsonResponse
    {
        try {
            $tool->update(['status' => 'approved']);

            // Clear relevant caches
            Cache::forget('admin_stats');
            Cache::forget('tools_list');
            $this->categoryCache->clearCaches();

            // Log the approval
            activity()
                ->performedOn($tool)
                ->causedBy(auth()->user())
                ->log('Tool approved by admin');

            return response()->json([
                'success' => true,
                'message' => 'Tool approved successfully',
                'data' => $tool->load(['user', 'category'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve tool'
            ], 500);
        }
    }

    /**
     * Reject a tool
     */
    public function rejectTool(Request $request, Tool $tool): JsonResponse
    {
        try {
            $request->validate([
                'reason' => 'nullable|string|max:1000'
            ]);

            $tool->update([
                'status' => 'rejected',
                'rejection_reason' => $request->reason
            ]);

            // Clear relevant caches
            Cache::forget('admin_stats');
            Cache::forget('tools_list');
            $this->categoryCache->clearCaches();

            // Log the rejection
            activity()
                ->performedOn($tool)
                ->causedBy(auth()->user())
                ->withProperties(['reason' => $request->reason])
                ->log('Tool rejected by admin');

            return response()->json([
                'success' => true,
                'message' => 'Tool rejected successfully',
                'data' => $tool->load(['user', 'category'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject tool'
            ], 500);
        }
    }

    /**
     * Delete a tool (soft delete)
     */
    public function deleteTool(Tool $tool): JsonResponse
    {
        try {
            $tool->delete();

            // Clear relevant caches
            Cache::forget('admin_stats');
            Cache::forget('tools_list');
            $this->categoryCache->clearCaches();

            // Log the deletion
            activity()
                ->performedOn($tool)
                ->causedBy(auth()->user())
                ->log('Tool deleted by admin');

            return response()->json([
                'success' => true,
                'message' => 'Tool deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete tool'
            ], 500);
        }
    }

    /**
     * Update user role
     */
    public function updateUserRole(Request $request, User $user): JsonResponse
    {
        try {
            $request->validate([
                'role' => 'required|string|exists:user_roles,name'
            ]);

            $role = UserRole::where('name', $request->role)->first();
            
            if (!$role) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid role specified'
                ], 400);
            }

            $oldRole = $user->userRole ? $user->userRole->name : null;
            $user->update(['user_role_id' => $role->id]);

            // Clear relevant caches
            Cache::forget('admin_stats');

            // Log the role change
            activity()
                ->performedOn($user)
                ->causedBy(auth()->user())
                ->withProperties([
                    'old_role' => $oldRole,
                    'new_role' => $role->name
                ])
                ->log('User role updated by admin');

            return response()->json([
                'success' => true,
                'message' => 'User role updated successfully',
                'data' => $user->load(['userRole'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user role'
            ], 500);
        }
    }

    /**
     * Get activity logs with pagination
     */
    public function getActivityLogs(Request $request): JsonResponse
    {
        try {
            $perPage = min($request->get('per_page', 20), 100);
            
            $logs = DB::table('activity_log')
                ->join('users', 'activity_log.causer_id', '=', 'users.id')
                ->select([
                    'activity_log.*',
                    'users.name as user_name',
                    'users.email as user_email'
                ])
                ->orderBy('activity_log.created_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $logs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch activity logs'
            ], 500);
        }
    }
}