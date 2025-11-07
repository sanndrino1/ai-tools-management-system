<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'color',
        'sort_order',
        'is_active',
        'metadata'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'metadata' => 'array'
    ];
    
    // Relationships
    public function tools(): BelongsToMany
    {
        return $this->belongsToMany(Tool::class, 'tool_category')
                    ->withPivot('is_primary')
                    ->withTimestamps();
    }
    
    public function primaryTools(): BelongsToMany
    {
        return $this->tools()->wherePivot('is_primary', true);
    }
    
    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
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
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = \Str::slug($category->name);
            }
            if (is_null($category->sort_order)) {
                $category->sort_order = static::max('sort_order') + 1 ?? 1;
            }
        });
        
        static::updating(function ($category) {
            if ($category->isDirty('name') && empty($category->slug)) {
                $category->slug = \Str::slug($category->name);
            }
        });
    }
}
