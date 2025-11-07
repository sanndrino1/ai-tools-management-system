<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Comment extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'user_id',
        'tool_id',
        'parent_id',
        'content',
        'is_approved',
        'edited_at'
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'edited_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $with = ['user'];

    /**
     * Get the user that wrote the comment
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the tool that was commented on
     */
    public function tool(): BelongsTo
    {
        return $this->belongsTo(Tool::class);
    }

    /**
     * Get the parent comment (for replies)
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    /**
     * Get the child comments (replies)
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id')
            ->with(['user', 'replies'])
            ->where('is_approved', true)
            ->orderBy('created_at', 'asc');
    }

    /**
     * Scope to get approved comments only
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope to get top-level comments (no parent)
     */
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope to get recent comments
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Check if comment is edited
     */
    public function getIsEditedAttribute(): bool
    {
        return $this->edited_at !== null;
    }

    /**
     * Get activity log options
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['content', 'is_approved'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::updating(function ($comment) {
            if ($comment->isDirty('content')) {
                $comment->edited_at = now();
            }
        });
    }
}