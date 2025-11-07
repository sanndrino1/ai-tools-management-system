<?php

namespace App\Services;

use App\Models\Tool;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CategoryCacheService
{
    const CACHE_TTL = 3600; // 1 hour
    const CATEGORIES_KEY = 'categories_with_counts';
    const STATS_KEY = 'category_stats';

    /**
     * Get categories with tool counts (cached)
     */
    public function getCategoriesWithCounts()
    {
        return Cache::remember(self::CATEGORIES_KEY, self::CACHE_TTL, function () {
            return Tool::select('category', DB::raw('count(*) as total'))
                ->where('status', 'approved')
                ->groupBy('category')
                ->orderBy('total', 'desc')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->category => $item->total];
                });
        });
    }

    /**
     * Get category statistics (cached)
     */
    public function getCategoryStats()
    {
        return Cache::remember(self::STATS_KEY, self::CACHE_TTL, function () {
            $totalTools = Tool::where('status', 'approved')->count();
            $categories = $this->getCategoriesWithCounts();

            return [
                'total_categories' => $categories->count(),
                'total_tools' => $totalTools,
                'most_popular_category' => $categories->keys()->first(),
                'categories' => $categories,
                'average_tools_per_category' => $categories->count() > 0 
                    ? round($totalTools / $categories->count(), 2) 
                    : 0
            ];
        });
    }

    /**
     * Get tools by category (cached)
     */
    public function getToolsByCategory($category, $limit = null)
    {
        $cacheKey = "category_{$category}_tools" . ($limit ? "_{$limit}" : '');
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($category, $limit) {
            $query = Tool::where('category', $category)
                ->where('status', 'approved')
                ->orderBy('average_rating', 'desc')
                ->orderBy('view_count', 'desc');

            if ($limit) {
                $query->limit($limit);
            }

            return $query->get();
        });
    }

    /**
     * Get popular categories (cached)
     */
    public function getPopularCategories($limit = 10)
    {
        $cacheKey = "popular_categories_{$limit}";
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($limit) {
            return Tool::select('category', DB::raw('count(*) as total'))
                ->where('status', 'approved')
                ->groupBy('category')
                ->orderBy('total', 'desc')
                ->limit($limit)
                ->get();
        });
    }

    /**
     * Clear all category-related caches
     */
    public function clearCaches()
    {
        $keysToForget = [
            self::CATEGORIES_KEY,
            self::STATS_KEY,
            'admin_stats'
        ];

        foreach ($keysToForget as $key) {
            Cache::forget($key);
        }

        // Clear category-specific caches
        $categories = Tool::distinct('category')->pluck('category');
        foreach ($categories as $category) {
            Cache::forget("category_{$category}_tools");
            Cache::forget("category_{$category}_tools_5");
            Cache::forget("category_{$category}_tools_10");
            Cache::forget("category_{$category}_tools_20");
        }

        // Clear popular categories caches
        for ($i = 5; $i <= 20; $i += 5) {
            Cache::forget("popular_categories_{$i}");
        }

        return true;
    }

    /**
     * Refresh all caches
     */
    public function refreshCaches()
    {
        $this->clearCaches();
        
        // Warm up the most important caches
        $this->getCategoriesWithCounts();
        $this->getCategoryStats();
        $this->getPopularCategories();

        return true;
    }
}