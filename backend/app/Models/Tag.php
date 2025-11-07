<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'slug',
        'color',
        'description',
        'usage_count',
        'is_active'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'usage_count' => 'integer'
    ];
    
    // Relationships
    public function tools(): BelongsToMany
    {
        return $this->belongsToMany(Tool::class, 'tool_tag')
                    ->withTimestamps();
    }
    
    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    public function scopePopular($query, $limit = 10)
    {
        return $query->orderBy('usage_count', 'desc')
                    ->limit($limit);
    }
    
    public function scopeByColor($query, $color)
    {
        return $query->where('color', $color);
    }
    
    // Accessors
    public function getRouteKeyName()
    {
        return 'slug';
    }
    
    public function getToolsCountAttribute()
    {
        return $this->tools()->count();
    }
    
    // Methods
    public function incrementUsage()
    {
        $this->increment('usage_count');
        return $this;
    }
    
    public function decrementUsage()
    {
        if ($this->usage_count > 0) {
            $this->decrement('usage_count');
        }
        return $this;
    }
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($tag) {
            if (empty($tag->slug)) {
                $tag->slug = \Str::slug($tag->name);
            }
        });
        
        static::updating(function ($tag) {
            if ($tag->isDirty('name') && empty($tag->slug)) {
                $tag->slug = \Str::slug($tag->name);
            }
        });
        
        // Auto-update usage count when tools are attached/detached
        static::saved(function ($tag) {
            $tag->usage_count = $tag->tools()->count();
            if ($tag->wasChanged('usage_count') === false) {
                $tag->saveQuietly();
            }
        });
    }
}
