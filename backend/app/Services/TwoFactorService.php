<?php

namespace App\Services;

use App\Models\User;
use App\Models\TwoFactorAuthentication;
use App\Models\TwoFactorCode;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorService
{
    protected $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    public function setupEmailTwoFactor(User $user)
    {
        $twoFactor = TwoFactorAuthentication::updateOrCreate(
            ['user_id' => $user->id],
            [
                'method' => 'email',
                'is_enabled' => true,
                'secret_key' => null,
                'telegram_chat_id' => null
            ]
        );

        $backupCodes = $twoFactor->generateBackupCodes();

        return [
            'method' => 'email',
            'backup_codes' => $backupCodes,
            'enabled' => true
        ];
    }

    public function setupTelegramTwoFactor(User $user, $chatId)
    {
        $twoFactor = TwoFactorAuthentication::updateOrCreate(
            ['user_id' => $user->id],
            [
                'method' => 'telegram',
                'is_enabled' => true,
                'secret_key' => null,
                'telegram_chat_id' => $chatId
            ]
        );

        $backupCodes = $twoFactor->generateBackupCodes();

        return [
            'method' => 'telegram',
            'telegram_chat_id' => $chatId,
            'backup_codes' => $backupCodes,
            'enabled' => true
        ];
    }

    public function setupGoogleAuthenticatorTwoFactor(User $user)
    {
        $secretKey = $this->google2fa->generateSecretKey();
        
        $twoFactor = TwoFactorAuthentication::updateOrCreate(
            ['user_id' => $user->id],
            [
                'method' => 'google_authenticator',
                'is_enabled' => true,
                'secret_key' => $secretKey,
                'telegram_chat_id' => null
            ]
        );

        $backupCodes = $twoFactor->generateBackupCodes();

        $qrCodeUrl = $this->google2fa->getQRCodeUrl(
            'AI Tools Management',
            $user->email,
            $secretKey
        );

        return [
            'method' => 'google_authenticator',
            'secret_key' => $secretKey,
            'qr_code_url' => $qrCodeUrl,
            'backup_codes' => $backupCodes,
            'enabled' => true
        ];
    }

    public function sendTwoFactorCode(User $user)
    {
        $twoFactor = $user->twoFactorAuthentication;

        if (!$twoFactor || !$twoFactor->is_enabled) {
            throw new \Exception('2FA is not enabled for this user');
        }

        switch ($twoFactor->method) {
            case 'email':
                return $this->sendEmailCode($user);
            
            case 'telegram':
                return $this->sendTelegramCode($user, $twoFactor->telegram_chat_id);
            
            case 'google_authenticator':
                // Google Authenticator doesn't need a sent code
                return ['method' => 'google_authenticator'];
            
            default:
                throw new \Exception('Unknown 2FA method');
        }
    }

    public function verifyTwoFactorCode(User $user, $code)
    {
        $twoFactor = $user->twoFactorAuthentication;

        if (!$twoFactor || !$twoFactor->is_enabled) {
            return false;
        }

        // Check backup codes first
        if ($twoFactor->useBackupCode($code)) {
            return true;
        }

        switch ($twoFactor->method) {
            case 'email':
            case 'telegram':
                return TwoFactorCode::verifyCode($user->id, $code, $twoFactor->method);
            
            case 'google_authenticator':
                return $this->google2fa->verifyKey($twoFactor->secret_key, $code);
            
            default:
                return false;
        }
    }

    protected function sendEmailCode(User $user)
    {
        $codeRecord = TwoFactorCode::generateCode($user->id, 'email');

        Mail::send('emails.two-factor-code', ['code' => $codeRecord->code], function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Your 2FA Code - AI Tools Management');
        });

        return ['method' => 'email', 'sent' => true];
    }

    protected function sendTelegramCode(User $user, $chatId)
    {
        $codeRecord = TwoFactorCode::generateCode($user->id, 'telegram');
        
        $botToken = config('services.telegram.bot_token');
        
        if ($botToken) {
            $message = "🔐 Your AI Tools Management 2FA code: {$codeRecord->code}\n\nThis code expires in 5 minutes.";
            
            Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message
            ]);
        }

        return ['method' => 'telegram', 'sent' => true];
    }

    public function disableTwoFactor(User $user)
    {
        $twoFactor = $user->twoFactorAuthentication;
        
        if ($twoFactor) {
            $twoFactor->update(['is_enabled' => false]);
            
            // Invalidate all codes
            TwoFactorCode::where('user_id', $user->id)->update(['used' => true]);
        }

        return true;
    }

    public function getTwoFactorStatus(User $user)
    {
        $twoFactor = $user->twoFactorAuthentication;

        if (!$twoFactor) {
            return ['enabled' => false, 'method' => null];
        }

        return [
            'enabled' => $twoFactor->is_enabled,
            'method' => $twoFactor->method,
            'backup_codes_count' => count($twoFactor->backup_codes ?? [])
        ];
    }
}