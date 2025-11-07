<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class HealthController extends Controller
{
    /**
     * Health check endpoint for Docker and monitoring
     */
    public function check(): JsonResponse
    {
        $status = 'healthy';
        $checks = [];
        
        // Check database connection
        try {
            DB::connection()->getPdo();
            $checks['database'] = 'connected';
        } catch (\Exception $e) {
            $checks['database'] = 'disconnected';
            $status = 'unhealthy';
        }
        
        // Check cache connection
        try {
            Cache::put('health_check', true, 60);
            $checks['cache'] = Cache::get('health_check') ? 'connected' : 'disconnected';
        } catch (\Exception $e) {
            $checks['cache'] = 'disconnected';
        }
        
        // Check application status
        $checks['app'] = [
            'environment' => app()->environment(),
            'debug' => config('app.debug'),
            'version' => '1.0.0'
        ];
        
        return response()->json([
            'status' => $status,
            'timestamp' => now()->toISOString(),
            'checks' => $checks
        ], $status === 'healthy' ? 200 : 503);
    }

    /**
     * Simple health check for Docker healthcheck
     */
    public function simple(): string
    {
        return 'OK';
    }
}