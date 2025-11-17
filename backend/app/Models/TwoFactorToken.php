<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class TwoFactorToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'token',
        'type',
        'expires_at',
        'used',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used' => 'boolean',
    ];

    /**
     * Get the user that owns the token.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if the token is valid (not expired and not used).
     */
    public function isValid(): bool
    {
        return !$this->used && $this->expires_at->isFuture();
    }

    /**
     * Mark the token as used.
     */
    public function markAsUsed(): void
    {
        $this->update(['used' => true]);
    }

    /**
     * Generate a 6-digit token.
     */
    public static function generateToken(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Create a new 2FA token for a user.
     */
    public static function createForUser(User $user, string $type = 'email'): self
    {
        // Invalidate any existing tokens for this user and type
        self::where('user_id', $user->id)
            ->where('type', $type)
            ->where('used', false)
            ->update(['used' => true]);

        return self::create([
            'user_id' => $user->id,
            'token' => self::generateToken(),
            'type' => $type,
            'expires_at' => Carbon::now()->addMinutes(10), // 10 minutes expiry
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Verify a token for a user.
     */
    public static function verify(User $user, string $token, string $type = 'email'): bool
    {
        $tokenRecord = self::where('user_id', $user->id)
            ->where('token', $token)
            ->where('type', $type)
            ->where('used', false)
            ->first();

        if (!$tokenRecord || !$tokenRecord->isValid()) {
            return false;
        }

        $tokenRecord->markAsUsed();
        return true;
    }
}