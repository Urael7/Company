<?php

namespace App\Http\Middleware;

use App\Models\Auditlog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditLogMiddleware
{
    /**
     * Handle an incoming request.
     * Logs after response is generated to capture status code.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Skip telemetry for asset requests
        if ($request->is('storage/*') || $request->is('vendor/*')) {
            return $response;
        }

        $methodsToLog = ['POST', 'PUT', 'PATCH', 'DELETE'];
        $shouldLog = in_array($request->method(), $methodsToLog, true) || $response->getStatusCode() >= 400;

        if ($shouldLog) {
            try {
                Auditlog::create([
                    'user_id' => optional($request->user())->id,
                    'action' => strtolower($request->method()),
                    'ip_address' => $request->ip(),
                    'user_agent' => (string) $request->header('User-Agent'),
                    'route_name' => optional($request->route())->getName(),
                    'http_method' => $request->method(),
                    'url' => $request->fullUrl(),
                    'status_code' => $response->getStatusCode(),
                    'message' => null,
                    'meta' => [],
                    'context' => [
                        'inputs' => $request->except(['password', 'password_confirmation', '_token']),
                    ],
                    'occurred_at' => now(),
                ]);
            } catch (\Throwable $e) {
                // Never break the request due to audit logging
            }
        }

        return $response;
    }
}


