<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Log;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Resolve any permission request through the user's permissions
        Gate::before(function (User $user, $ability) {
            // admin has all permissions
            if ($user->isadmin()) {
                return true;
            }
            
            // Check if user has the permission
            if ($user->hasPermission($ability)) {
                return true;
            }
            
            return null; // Continue to next gate check
        });
        
        // Register a gate for each role
        Gate::define('role', function (User $user, $role) {
            return $user->hasRole($role);
        });

        // Add debug for Sanctum token retrieval
        Sanctum::authenticateAccessTokensUsing(
            function (PersonalAccessToken $accessToken, bool $isValid) {
                if ($isValid) {
                    Log::info('Sanctum token validated successfully', [
                        'token_id' => $accessToken->id,
                        'token_name' => $accessToken->name,
                        'user_id' => $accessToken->tokenable_id,
                        'tokenable_type' => $accessToken->tokenable_type
                    ]);
                } else {
                    Log::warning('Sanctum token validation failed', [
                        'token_id' => $accessToken->id,
                        'token_name' => $accessToken->name,
                        'user_id' => $accessToken->tokenable_id,
                    ]);
                }
                
                return $isValid && $accessToken->created_at->gt(now()->subDays(30));
            }
        );
    }
}
