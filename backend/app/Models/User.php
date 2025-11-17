<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
// use Spatie\Activitylog\Traits\LogsActivity;
// use Spatie\Activitylog\LogOptions;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'two_factor_enabled',
        'two_factor_method',
        'two_factor_enabled_at',
        'two_factor_backup_codes',
        'email_verified',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_backup_codes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'two_factor_enabled' => 'boolean',
        'two_factor_enabled_at' => 'datetime',
        'two_factor_backup_codes' => 'array',
        'email_verified' => 'boolean',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function twoFactorAuthentication()
    {
        return $this->hasOne(TwoFactorAuthentication::class);
    }

    public function twoFactorCodes()
    {
        return $this->hasMany(TwoFactorCode::class);
    }

    public function hasTwoFactorEnabled()
    {
        return $this->twoFactorAuthentication && $this->twoFactorAuthentication->is_enabled;
    }

    public function createdTools()
    {
        return $this->hasMany(Tool::class, 'created_by');
    }

    public function updatedTools()
    {
        return $this->hasMany(Tool::class, 'updated_by');
    }

    // Helper methods
    public function isAdmin()
    {
        return $this->role && in_array($this->role->name, ['admin', 'owner']);
    }

    public function canManageTools()
    {
        return $this->role && in_array($this->role->name, ['admin', 'owner', 'pm']);
    }

    public function getRoleNameAttribute()
    {
        return $this->role ? $this->role->name : 'guest';
    }

    public function hasRole($roleName)
    {
        return $this->role && $this->role->name === $roleName;
    }

    /**
     * 2FA Related Methods
     */
    public function twoFactorTokens()
    {
        return $this->hasMany(TwoFactorToken::class);
    }

    public function enableTwoFactor($method = 'email')
    {
        $this->update([
            'two_factor_enabled' => true,
            'two_factor_method' => $method,
            'two_factor_enabled_at' => now(),
        ]);
    }

    public function disableTwoFactor()
    {
        $this->update([
            'two_factor_enabled' => false,
            'two_factor_method' => null,
            'two_factor_enabled_at' => null,
            'two_factor_backup_codes' => null,
        ]);
        
        // Invalidate all existing tokens
        $this->twoFactorTokens()->update(['used' => true]);
    }

    public function generateBackupCodes()
    {
        $codes = [];
        for ($i = 0; $i < 8; $i++) {
            $codes[] = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 8));
        }
        
        $this->update(['two_factor_backup_codes' => $codes]);
        return $codes;
    }

    public function useBackupCode($code)
    {
        $codes = $this->two_factor_backup_codes ?? [];
        $index = array_search(strtoupper($code), $codes);
        
        if ($index !== false) {
            unset($codes[$index]);
            $this->update(['two_factor_backup_codes' => array_values($codes)]);
            return true;
        }
        
        return false;
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'user_role_id'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
