<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\TwoFactorToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class TwoFactorController extends Controller
{
    /**
     * Send 2FA code via email
     */
    public function sendCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->two_factor_enabled) {
            return response()->json([
                'message' => '2FA is not enabled for this account',
                'requires_2fa' => false,
            ]);
        }

        // Generate and send 2FA code
        $token = TwoFactorToken::createForUser($user);

        // Send email with code
        Mail::send('emails.two-factor-code', [
            'user' => $user,
            'code' => $token->token,
            'expires_in' => '10 minutes'
        ], function ($message) use ($user) {
            $message->to($user->email, $user->name)
                    ->subject('AI Tools - Security Code');
        });

        return response()->json([
            'message' => '2FA code sent to your email',
            'requires_2fa' => true,
            'expires_at' => $token->expires_at->toISOString(),
        ]);
    }

    /**
     * Verify 2FA code and complete login
     */
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['User not found.'],
            ]);
        }

        // Try regular 2FA token first
        $isValid = TwoFactorToken::verify($user, $request->code);

        // If regular token failed, try backup code
        if (!$isValid) {
            $isValid = $user->useBackupCode($request->code);
        }

        if (!$isValid) {
            throw ValidationException::withMessages([
                'code' => ['The provided code is invalid or has expired.'],
            ]);
        }

        // Create auth token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user->load('role'),
            'token' => $token,
        ]);
    }

    /**
     * Enable 2FA for authenticated user
     */
    public function enable(Request $request)
    {
        $request->validate([
            'method' => 'required|string|in:email',
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The provided password is incorrect.'],
            ]);
        }

        $user->enableTwoFactor($request->method);
        $backupCodes = $user->generateBackupCodes();

        return response()->json([
            'message' => '2FA has been enabled successfully',
            'backup_codes' => $backupCodes,
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Disable 2FA for authenticated user
     */
    public function disable(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The provided password is incorrect.'],
            ]);
        }

        $user->disableTwoFactor();

        return response()->json([
            'message' => '2FA has been disabled successfully',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Get 2FA status for authenticated user
     */
    public function status(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'enabled' => $user->two_factor_enabled,
            'method' => $user->two_factor_method,
            'enabled_at' => $user->two_factor_enabled_at,
            'backup_codes_count' => count($user->two_factor_backup_codes ?? []),
        ]);
    }

    /**
     * Regenerate backup codes
     */
    public function regenerateBackupCodes(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!$user->two_factor_enabled) {
            return response()->json([
                'error' => '2FA must be enabled first',
            ], 400);
        }

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The provided password is incorrect.'],
            ]);
        }

        $backupCodes = $user->generateBackupCodes();

        return response()->json([
            'message' => 'Backup codes regenerated successfully',
            'backup_codes' => $backupCodes,
        ]);
    }
}