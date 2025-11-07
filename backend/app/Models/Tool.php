<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Tool extends Model
{
    use HasFactory, LogsActivity;
    
    protected $fillable = [
        'name',
        'slug',
        'description', 
        'short_description',
        'category',
        'url',
        'website_url',
        'documentation_url',
        'video_url',
        'github_url',
        'logo_url',
        'screenshots',
        'ai_type',
        'difficulty_level',
        'pricing_type',
        'price_per_month',
        'features',
        'supported_formats',
        'integrations',
        'view_count',
        'usage_count',
        'average_rating',
        'total_ratings',
        'target_roles',
        'status',
        'rejection_reason',
        'is_featured',
        'featured_until',
        'metadata',
        'admin_notes',
        'rating',
        'is_active',
        'created_by',
        'updated_by'
    ];
    
    protected $casts = [
        'rating' => 'decimal:1',
        'average_rating' => 'decimal:2',
        'price_per_month' => 'decimal:2',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'screenshots' => 'array',
        'features' => 'array',
        'supported_formats' => 'array',
        'integrations' => 'array',
        'target_roles' => 'array',
        'metadata' => 'array',
        'featured_until' => 'datetime',
        'view_count' => 'integer',
        'usage_count' => 'integer',
        'total_ratings' => 'integer'
    ];
    
    protected $dates = [
        'featured_until'
    ];
    
    // Relationships
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'tool_category')
                    ->withPivot('is_primary')
                    ->withTimestamps();
    }
    
    public function primaryCategory(): BelongsToMany
    {
        return $this->categories()->wherePivot('is_primary', true);
    }
    
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'tool_tag')
                    ->withTimestamps();
    }
    
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    
    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }
    
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true)
                    ->where(function ($q) {
                        $q->whereNull('featured_until')
                          ->orWhere('featured_until', '>', now());
                    });
    }
    
    public function scopeByAiType($query, $type)
    {
        return $query->where('ai_type', $type);
    }
    
    public function scopeByDifficulty($query, $level)
    {
        return $query->where('difficulty_level', $level);
    }
    
    public function scopeByPricingType($query, $type)
    {
        return $query->where('pricing_type', $type);
    }
    
    // Accessors & Mutators
    public function getRouteKeyName()
    {
        return 'slug';
    }
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($tool) {
            if (empty($tool->slug)) {
                $tool->slug = \Str::slug($tool->name);
            }
        });
        
        static::updating(function ($tool) {
            if ($tool->isDirty('name') && empty($tool->slug)) {
                $tool->slug = \Str::slug($tool->name);
            }
        });
    }

    /**
     * Get all ratings for this tool
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    /**
     * Get all comments for this tool
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)
            ->approved()
            ->topLevel()
            ->with(['user', 'replies'])
            ->orderBy('created_at', 'desc');
    }

    /**
     * Get user's rating for this tool
     */
    public function userRating($userId)
    {
        return $this->ratings()->where('user_id', $userId)->first();
    }

    /**
     * Update rating statistics
     */
    public function updateRatingStatistics()
    {
        $ratings = $this->ratings();
        
        $this->update([
            'average_rating' => $ratings->avg('rating') ?: 0,
            'total_ratings' => $ratings->count()
        ]);
    }

    /**
     * Get rating breakdown
     */
    public function getRatingBreakdown()
    {
        return [
            1 => $this->ratings()->byRating(1)->count(),
            2 => $this->ratings()->byRating(2)->count(),
            3 => $this->ratings()->byRating(3)->count(),
            4 => $this->ratings()->byRating(4)->count(),
            5 => $this->ratings()->byRating(5)->count(),
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'status', 'category', 'description', 'url'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
