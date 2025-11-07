<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TwoFactorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TwoFactorController extends Controller
{
    protected $twoFactorService;

    public function __construct(TwoFactorService $twoFactorService)
    {
        $this->twoFactorService = $twoFactorService;
    }

    public function status()
    {
        $user = Auth::user();
        $status = $this->twoFactorService->getTwoFactorStatus($user);

        return response()->json([
            'success' => true,
            'data' => $status
        ]);
    }

    public function setupEmail(Request $request)
    {
        $user = Auth::user();
        
        try {
            $result = $this->twoFactorService->setupEmailTwoFactor($user);
            
            return response()->json([
                'success' => true,
                'message' => '2FA via email has been enabled successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to setup email 2FA: ' . $e->getMessage()
            ], 500);
        }
    }

    public function setupTelegram(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chat_id' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        
        try {
            $result = $this->twoFactorService->setupTelegramTwoFactor($user, $request->chat_id);
            
            return response()->json([
                'success' => true,
                'message' => '2FA via Telegram has been enabled successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to setup Telegram 2FA: ' . $e->getMessage()
            ], 500);
        }
    }

    public function setupGoogleAuthenticator(Request $request)
    {
        $user = Auth::user();
        
        try {
            $result = $this->twoFactorService->setupGoogleAuthenticatorTwoFactor($user);
            
            return response()->json([
                'success' => true,
                'message' => '2FA via Google Authenticator has been enabled successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to setup Google Authenticator 2FA: ' . $e->getMessage()
            ], 500);
        }
    }

    public function sendCode(Request $request)
    {
        $user = Auth::user();
        
        try {
            $result = $this->twoFactorService->sendTwoFactorCode($user);
            
            return response()->json([
                'success' => true,
                'message' => '2FA code sent successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send 2FA code: ' . $e->getMessage()
            ], 500);
        }
    }

    public function verifyCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|min:6|max:8'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid code format',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        
        try {
            $isValid = $this->twoFactorService->verifyTwoFactorCode($user, $request->code);
            
            if ($isValid) {
                // Mark session as 2FA verified
                session(['2fa_verified' => true, '2fa_user_id' => $user->id]);
                
                return response()->json([
                    'success' => true,
                    'message' => '2FA code verified successfully'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired 2FA code'
                ], 422);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify 2FA code: ' . $e->getMessage()
            ], 500);
        }
    }

    public function disable(Request $request)
    {
        $user = Auth::user();
        
        try {
            $this->twoFactorService->disableTwoFactor($user);
            
            return response()->json([
                'success' => true,
                'message' => '2FA has been disabled successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to disable 2FA: ' . $e->getMessage()
            ], 500);
        }
    }

    public function regenerateBackupCodes(Request $request)
    {
        $user = Auth::user();
        $twoFactor = $user->twoFactorAuthentication;

        if (!$twoFactor || !$twoFactor->is_enabled) {
            return response()->json([
                'success' => false,
                'message' => '2FA is not enabled'
            ], 422);
        }

        $backupCodes = $twoFactor->generateBackupCodes();

        return response()->json([
            'success' => true,
            'message' => 'Backup codes regenerated successfully',
            'data' => ['backup_codes' => $backupCodes]
        ]);
    }
}