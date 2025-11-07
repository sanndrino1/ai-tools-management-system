<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    /**
     * Get comments for a tool
     */
    public function index(Tool $tool): JsonResponse
    {
        try {
            $comments = $tool->comments()->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $comments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve comments'
            ], 500);
        }
    }

    /**
     * Store a new comment
     */
    public function store(Request $request, Tool $tool): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'content' => 'required|string|max:2000|min:10',
                'parent_id' => 'nullable|integer|exists:comments,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            // If replying to a comment, ensure parent belongs to same tool
            if ($request->parent_id) {
                $parentComment = Comment::find($request->parent_id);
                if ($parentComment->tool_id !== $tool->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Parent comment does not belong to this tool'
                    ], 400);
                }
            }

            $comment = Comment::create([
                'user_id' => auth()->id(),
                'tool_id' => $tool->id,
                'parent_id' => $request->parent_id,
                'content' => $request->content,
                'is_approved' => true // Auto-approve for now
            ]);

            activity()
                ->performedOn($tool)
                ->causedBy(auth()->user())
                ->withProperties(['comment_type' => $request->parent_id ? 'reply' : 'comment'])
                ->log('User commented on tool');

            return response()->json([
                'success' => true,
                'data' => $comment->load(['user:id,name', 'replies.user:id,name']),
                'message' => 'Comment added successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add comment'
            ], 500);
        }
    }

    /**
     * Update a comment
     */
    public function update(Request $request, Comment $comment): JsonResponse
    {
        try {
            // Check if user owns the comment
            if ($comment->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only edit your own comments'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'content' => 'required|string|max:2000|min:10'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $oldContent = $comment->content;
            $comment->update(['content' => $request->content]);

            activity()
                ->performedOn($comment->tool)
                ->causedBy(auth()->user())
                ->withProperties([
                    'comment_id' => $comment->id,
                    'old_content' => $oldContent,
                    'new_content' => $request->content
                ])
                ->log('User edited comment');

            return response()->json([
                'success' => true,
                'data' => $comment->load(['user:id,name', 'replies.user:id,name']),
                'message' => 'Comment updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update comment'
            ], 500);
        }
    }

    /**
     * Delete a comment
     */
    public function destroy(Comment $comment): JsonResponse
    {
        try {
            // Check permissions (user owns comment or admin)
            if ($comment->user_id !== auth()->id() && !auth()->user()->hasRole(['owner', 'project_manager'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only delete your own comments'
                ], 403);
            }

            activity()
                ->performedOn($comment->tool)
                ->causedBy(auth()->user())
                ->withProperties(['comment_id' => $comment->id, 'content' => $comment->content])
                ->log('Comment deleted');

            $comment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Comment deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete comment'
            ], 500);
        }
    }

    /**
     * Moderate comment (Admin only)
     */
    public function moderate(Request $request, Comment $comment): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'is_approved' => 'required|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $comment->update(['is_approved' => $request->is_approved]);

            activity()
                ->performedOn($comment->tool)
                ->causedBy(auth()->user())
                ->withProperties([
                    'comment_id' => $comment->id,
                    'action' => $request->is_approved ? 'approved' : 'rejected'
                ])
                ->log('Admin moderated comment');

            return response()->json([
                'success' => true,
                'data' => $comment->load(['user:id,name']),
                'message' => 'Comment moderation updated'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to moderate comment'
            ], 500);
        }
    }
}