<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class TagController extends Controller
{
    /**
     * Display a listing of tags
     */
    public function index(Request $request): JsonResponse
    {
        $query = Tag::query();
        
        // Filter active tags by default
        if (!$request->has('include_inactive')) {
            $query->active();
        }
        
        // Include tools count
        if ($request->boolean('with_tools_count')) {
            $query->withCount('tools');
        }
        
        // Popular tags
        if ($request->boolean('popular')) {
            $query->popular($request->get('limit', 10));
        } else {
            $query->orderBy('name');
        }
        
        $tags = $query->get();
        
        return response()->json([
            'data' => $tags
        ]);
    }

    /**
     * Store a newly created tag
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:tags',
            'description' => 'nullable|string|max:500',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $tag = Tag::create($request->all());
        
        return response()->json([
            'message' => 'Tag created successfully',
            'data' => $tag
        ], 201);
    }

    /**
     * Display the specified tag
     */
    public function show(Tag $tag): JsonResponse
    {
        // Load tools with pagination
        $tag->load(['tools' => function($query) {
            $query->active()->approved()->with(['categories', 'creator']);
        }]);
        
        return response()->json([
            'data' => $tag
        ]);
    }

    /**
     * Update the specified tag
     */
    public function update(Request $request, Tag $tag): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255|unique:tags,name,' . $tag->id,
            'description' => 'nullable|string|max:500',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $tag->update($request->all());
        
        return response()->json([
            'message' => 'Tag updated successfully',
            'data' => $tag->fresh()
        ]);
    }

    /**
     * Remove the specified tag
     */
    public function destroy(Tag $tag): JsonResponse
    {
        // Check if tag has tools
        if ($tag->tools()->exists()) {
            return response()->json([
                'message' => 'Cannot delete tag with associated tools'
            ], 422);
        }

        $tag->delete();
        
        return response()->json([
            'message' => 'Tag deleted successfully'
        ]);
    }
}
