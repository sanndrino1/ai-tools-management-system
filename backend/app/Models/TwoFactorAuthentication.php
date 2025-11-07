<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TwoFactorAuthentication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'method',
        'is_enabled',
        'secret_key',
        'telegram_chat_id',
        'backup_codes'
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'backup_codes' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function generateBackupCodes()
    {
        $codes = [];
        for ($i = 0; $i < 10; $i++) {
            $codes[] = strtoupper(substr(md5(random_bytes(10)), 0, 8));
        }
        
        $this->backup_codes = $codes;
        $this->save();
        
        return $codes;
    }

    public function useBackupCode($code)
    {
        if (!$this->backup_codes || !in_array($code, $this->backup_codes)) {
            return false;
        }

        $codes = $this->backup_codes;
        $key = array_search($code, $codes);
        
        if ($key !== false) {
            unset($codes[$key]);
            $this->backup_codes = array_values($codes);
            $this->save();
            return true;
        }

        return false;
    }
}