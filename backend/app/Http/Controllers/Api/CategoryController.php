<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index(Request $request): JsonResponse
    {
        $query = Category::query();
        
        // Filter active categories by default
        if (!$request->has('include_inactive')) {
            $query->active();
        }
        
        // Include tools count
        if ($request->boolean('with_tools_count')) {
            $query->withCount('tools');
        }
        
        // Order by sort_order and name
        $query->ordered();
        
        $categories = $query->get();
        
        return response()->json([
            'data' => $categories
        ]);
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:10',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'sort_order' => 'nullable|integer|min:1',
            'metadata' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $category = Category::create($request->all());
        
        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }

    /**
     * Display the specified category
     */
    public function show(Category $category): JsonResponse
    {
        // Load tools with pagination
        $category->load(['tools' => function($query) {
            $query->active()->approved()->with(['tags', 'creator']);
        }]);
        
        return response()->json([
            'data' => $category
        ]);
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:10',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'sort_order' => 'nullable|integer|min:1',
            'metadata' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $category->update($request->all());
        
        return response()->json([
            'message' => 'Category updated successfully',
            'data' => $category->fresh()
        ]);
    }

    /**
     * Remove the specified category
     */
    public function destroy(Category $category): JsonResponse
    {
        // Check if category has tools
        if ($category->tools()->exists()) {
            return response()->json([
                'message' => 'Cannot delete category with associated tools'
            ], 422);
        }

        $category->delete();
        
        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }
}
