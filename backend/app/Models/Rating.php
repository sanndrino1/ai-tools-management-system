<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Rating extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'user_id',
        'tool_id',
        'rating',
        'review'
    ];

    protected $casts = [
        'rating' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the user that owns the rating
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the tool that was rated
     */
    public function tool(): BelongsTo
    {
        return $this->belongsTo(Tool::class);
    }

    /**
     * Scope to filter by rating value
     */
    public function scopeByRating($query, int $rating)
    {
        return $query->where('rating', $rating);
    }

    /**
     * Scope to get recent ratings
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Get activity log options
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['rating', 'review'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        // Update tool rating statistics when rating is created/updated/deleted
        static::created(function ($rating) {
            $rating->tool->updateRatingStatistics();
        });

        static::updated(function ($rating) {
            $rating->tool->updateRatingStatistics();
        });

        static::deleted(function ($rating) {
            $rating->tool->updateRatingStatistics();
        });
    }
}