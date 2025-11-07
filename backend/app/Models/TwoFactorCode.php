<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class TwoFactorCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'code',
        'method',
        'expires_at',
        'used'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired()
    {
        return $this->expires_at < Carbon::now();
    }

    public function isValid()
    {
        return !$this->used && !$this->isExpired();
    }

    public static function generateCode($userId, $method, $minutesToExpire = 5)
    {
        // Invalidate old codes
        self::where('user_id', $userId)
            ->where('method', $method)
            ->update(['used' => true]);

        // Generate new code
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        return self::create([
            'user_id' => $userId,
            'code' => $code,
            'method' => $method,
            'expires_at' => Carbon::now()->addMinutes($minutesToExpire)
        ]);
    }

    public static function verifyCode($userId, $code, $method)
    {
        $codeRecord = self::where('user_id', $userId)
            ->where('code', $code)
            ->where('method', $method)
            ->where('used', false)
            ->first();

        if ($codeRecord && $codeRecord->isValid()) {
            $codeRecord->update(['used' => true]);
            return true;
        }

        return false;
    }
}