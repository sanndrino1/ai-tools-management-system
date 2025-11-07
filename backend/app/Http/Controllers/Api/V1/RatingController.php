<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class RatingController extends Controller
{
    /**
     * Get ratings for a tool
     */
    public function index(Tool $tool): JsonResponse
    {
        try {
            $ratings = $tool->ratings()
                ->with('user:id,name')
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            $ratingBreakdown = $tool->getRatingBreakdown();

            return response()->json([
                'success' => true,
                'data' => [
                    'ratings' => $ratings,
                    'statistics' => [
                        'average_rating' => $tool->average_rating,
                        'total_ratings' => $tool->total_ratings,
                        'breakdown' => $ratingBreakdown
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve ratings'
            ], 500);
        }
    }

    /**
     * Store a new rating
     */
    public function store(Request $request, Tool $tool): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'rating' => 'required|integer|min:1|max:5',
                'review' => 'nullable|string|max:1000'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Check if user already rated this tool
            $existingRating = $tool->userRating(auth()->id());

            if ($existingRating) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already rated this tool. Use PUT to update your rating.'
                ], 400);
            }

            $rating = Rating::create([
                'user_id' => auth()->id(),
                'tool_id' => $tool->id,
                'rating' => $request->rating,
                'review' => $request->review
            ]);

            activity()
                ->performedOn($tool)
                ->causedBy(auth()->user())
                ->withProperties(['rating' => $request->rating])
                ->log('User rated tool');

            return response()->json([
                'success' => true,
                'data' => $rating->load('user:id,name'),
                'message' => 'Rating submitted successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit rating'
            ], 500);
        }
    }

    /**
     * Update an existing rating
     */
    public function update(Request $request, Tool $tool): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'rating' => 'required|integer|min:1|max:5',
                'review' => 'nullable|string|max:1000'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $rating = $tool->userRating(auth()->id());

            if (!$rating) {
                return response()->json([
                    'success' => false,
                    'message' => 'No existing rating found. Use POST to create a new rating.'
                ], 404);
            }

            $oldRating = $rating->rating;
            
            $rating->update([
                'rating' => $request->rating,
                'review' => $request->review
            ]);

            activity()
                ->performedOn($tool)
                ->causedBy(auth()->user())
                ->withProperties([
                    'old_rating' => $oldRating,
                    'new_rating' => $request->rating
                ])
                ->log('User updated tool rating');

            return response()->json([
                'success' => true,
                'data' => $rating->load('user:id,name'),
                'message' => 'Rating updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update rating'
            ], 500);
        }
    }

    /**
     * Delete a rating
     */
    public function destroy(Tool $tool): JsonResponse
    {
        try {
            $rating = $tool->userRating(auth()->id());

            if (!$rating) {
                return response()->json([
                    'success' => false,
                    'message' => 'No rating found to delete'
                ], 404);
            }

            $rating->delete();

            activity()
                ->performedOn($tool)
                ->causedBy(auth()->user())
                ->log('User deleted tool rating');

            return response()->json([
                'success' => true,
                'message' => 'Rating deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete rating'
            ], 500);
        }
    }

    /**
     * Get user's rating for a tool
     */
    public function show(Tool $tool): JsonResponse
    {
        try {
            $rating = $tool->userRating(auth()->id());

            return response()->json([
                'success' => true,
                'data' => $rating ? $rating->load('user:id,name') : null
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user rating'
            ], 500);
        }
    }
}