<?php

namespace App\Providers;

use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

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
        // Query logging untuk development
        if (config('app.debug')) {
            DB::listen(function (QueryExecuted $query) {
                $sqlWithPlaceholders = str_replace(['%', '?'], ['%%', '%s'], $query->sql);
                $bindings = $query->connection->prepareBindings($query->bindings);
                $pdo = $query->connection->getPdo();
                $realSql = $sqlWithPlaceholders;
                $duration = $query->time / 1000;
                
                // Format bindings properly
                if (count($bindings) > 0) {
                    $realSql = vsprintf($sqlWithPlaceholders, array_map(function ($binding) use ($pdo) {
                        if ($binding === null) {
                            return 'NULL';
                        }
                        
                        if (is_string($binding)) {
                            return $pdo->quote($binding);
                        }
                        
                        return $binding;
                    }, $bindings));
                }
                
                // Log slow queries (> 1 second)
                if ($duration > 1) {
                    Log::channel('daily')->warning('SLOW QUERY: ' . $realSql . ' | Duration: ' . $duration . 's');
                }
                
                // Log all queries in debug level
                Log::channel('daily')->debug('SQL: ' . $realSql . ' | Duration: ' . $duration . 's');
            });
        }
    }
}
