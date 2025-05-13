<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;

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
        // Resolve any permission request through the user's permissions
        Gate::before(function (User $user, $ability) {
            // Admin has all permissions
            if ($user->isAdmin()) {
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
    }
}
