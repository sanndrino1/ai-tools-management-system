<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ToolController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\HealthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Health check endpoints (no authentication required)
Route::get('health', [HealthController::class, 'check'])->name('api.health');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public API routes (no authentication required)
Route::prefix('v1')->group(function () {
    // Public tools listing
    Route::get('tools', [ToolController::class, 'index'])->name('api.tools.index');
    Route::get('tools/{tool:slug}', [ToolController::class, 'show'])->name('api.tools.show');
    
    // Categories
    Route::get('categories', [CategoryController::class, 'index'])->name('api.categories.index');
    Route::get('categories/{category:slug}', [CategoryController::class, 'show'])->name('api.categories.show');
    
    // Tags
    Route::get('tags', [TagController::class, 'index'])->name('api.tags.index');
    Route::get('tags/{tag:slug}', [TagController::class, 'show'])->name('api.tags.show');
});

// Protected API routes (authentication required)
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    // User profile
    Route::get('/user', function (Request $request) {
        return $request->user()->load(['role']);
    });
    
    // Tools management
    Route::post('tools', [ToolController::class, 'store'])->name('api.tools.store');
    Route::put('tools/{tool}', [ToolController::class, 'update'])->name('api.tools.update');
    Route::delete('tools/{tool}', [ToolController::class, 'destroy'])->name('api.tools.destroy');
    
    // 2FA routes
    Route::prefix('2fa')->group(function () {
        Route::get('status', [App\Http\Controllers\Api\TwoFactorController::class, 'status'])->name('api.2fa.status');
        Route::post('setup/email', [App\Http\Controllers\Api\TwoFactorController::class, 'setupEmail'])->name('api.2fa.setup.email');
        Route::post('setup/telegram', [App\Http\Controllers\Api\TwoFactorController::class, 'setupTelegram'])->name('api.2fa.setup.telegram');
        Route::post('setup/google-authenticator', [App\Http\Controllers\Api\TwoFactorController::class, 'setupGoogleAuthenticator'])->name('api.2fa.setup.google');
        Route::post('send-code', [App\Http\Controllers\Api\TwoFactorController::class, 'sendCode'])->name('api.2fa.send-code');
        Route::post('verify-code', [App\Http\Controllers\Api\TwoFactorController::class, 'verifyCode'])->name('api.2fa.verify-code');
        Route::post('disable', [App\Http\Controllers\Api\TwoFactorController::class, 'disable'])->name('api.2fa.disable');
        Route::post('backup-codes/regenerate', [App\Http\Controllers\Api\TwoFactorController::class, 'regenerateBackupCodes'])->name('api.2fa.backup-codes.regenerate');
    });

    // Admin only routes
    Route::middleware('can:manage-tools')->group(function () {
        Route::post('categories', [CategoryController::class, 'store'])->name('api.categories.store');
        Route::put('categories/{category}', [CategoryController::class, 'update'])->name('api.categories.update');
        Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('api.categories.destroy');
        
        Route::post('tags', [TagController::class, 'store'])->name('api.tags.store');
        Route::put('tags/{tag}', [TagController::class, 'update'])->name('api.tags.update');
        Route::delete('tags/{tag}', [TagController::class, 'destroy'])->name('api.tags.destroy');
        
        // Ratings and Comments (require authentication)
        Route::prefix('tools/{tool}')->group(function () {
            // Ratings
            Route::get('ratings', [\App\Http\Controllers\Api\V1\RatingController::class, 'index']);
            Route::get('ratings/user', [\App\Http\Controllers\Api\V1\RatingController::class, 'show']);
            Route::post('ratings', [\App\Http\Controllers\Api\V1\RatingController::class, 'store']);
            Route::put('ratings', [\App\Http\Controllers\Api\V1\RatingController::class, 'update']);
            Route::delete('ratings', [\App\Http\Controllers\Api\V1\RatingController::class, 'destroy']);
            
            // Comments
            Route::get('comments', [\App\Http\Controllers\Api\V1\CommentController::class, 'index']);
            Route::post('comments', [\App\Http\Controllers\Api\V1\CommentController::class, 'store']);
        });
        
        // Comment management
        Route::put('comments/{comment}', [\App\Http\Controllers\Api\V1\CommentController::class, 'update']);
        Route::delete('comments/{comment}', [\App\Http\Controllers\Api\V1\CommentController::class, 'destroy']);
        Route::put('comments/{comment}/moderate', [\App\Http\Controllers\Api\V1\CommentController::class, 'moderate'])
            ->middleware('role:owner|project_manager');
        
        // Admin routes (require owner or project_manager roles)
        Route::middleware(['role:owner|project_manager'])->prefix('admin')->group(function () {
            Route::get('stats', [\App\Http\Controllers\Api\V1\AdminController::class, 'getStats']);
            Route::get('tools', [\App\Http\Controllers\Api\V1\AdminController::class, 'getTools']);
            Route::get('users', [\App\Http\Controllers\Api\V1\AdminController::class, 'getUsers']);
            Route::get('activity-logs', [\App\Http\Controllers\Api\V1\AdminController::class, 'getActivityLogs']);
            
            // Tool management
            Route::post('tools/{tool}/approve', [\App\Http\Controllers\Api\V1\AdminController::class, 'approveTool']);
            Route::post('tools/{tool}/reject', [\App\Http\Controllers\Api\V1\AdminController::class, 'rejectTool']);
            Route::delete('tools/{tool}', [\App\Http\Controllers\Api\V1\AdminController::class, 'deleteTool']);
            
            // User management
            Route::put('users/{user}/role', [\App\Http\Controllers\Api\V1\AdminController::class, 'updateUserRole']);
        });
    });
});

// Legacy routes (maintain backward compatibility)
Route::apiResource('users', UserController::class);
Route::apiResource('roles', RoleController::class);
