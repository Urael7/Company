<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Registered;
use App\Models\Auditlog;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        Event::listen(Login::class, function ($event) {
            Auditlog::create([
                'user_id' => $event->user?->id,
                'action' => 'login',
                'ip_address' => request()->ip(),
                'user_agent' => (string) request()->header('User-Agent'),
                'route_name' => request()->route()?->getName(),
                'http_method' => request()->method(),
                'url' => request()->fullUrl(),
                'occurred_at' => now(),
                'meta' => [],
            ]);
        });

        Event::listen(Logout::class, function ($event) {
            Auditlog::create([
                'user_id' => $event->user?->id,
                'action' => 'logout',
                'ip_address' => request()->ip(),
                'user_agent' => (string) request()->header('User-Agent'),
                'route_name' => request()->route()?->getName(),
                'http_method' => request()->method(),
                'url' => request()->fullUrl(),
                'occurred_at' => now(),
                'meta' => [],
            ]);
        });

        Event::listen(Failed::class, function ($event) {
            Auditlog::create([
                'user_id' => null,
                'action' => 'login_failed',
                'ip_address' => request()->ip(),
                'user_agent' => (string) request()->header('User-Agent'),
                'route_name' => request()->route()?->getName(),
                'http_method' => request()->method(),
                'url' => request()->fullUrl(),
                'occurred_at' => now(),
                'meta' => [
                    'email' => $event->credentials['email'] ?? null,
                ],
            ]);
        });

        Event::listen(Registered::class, function ($event) {
            Auditlog::create([
                'user_id' => $event->user?->id,
                'action' => 'registered',
                'ip_address' => request()->ip(),
                'user_agent' => (string) request()->header('User-Agent'),
                'route_name' => request()->route()?->getName(),
                'http_method' => request()->method(),
                'url' => request()->fullUrl(),
                'occurred_at' => now(),
                'meta' => [],
            ]);
        });
    }
}
