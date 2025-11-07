<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, LogsActivity;

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
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'user_role_id'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
