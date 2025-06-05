<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Empty the waste_values_new table
        if (Schema::hasTable('waste_values_new')) {
            DB::table('waste_values_new')->truncate();
        }
        
        // Also remove any waste values from other waste tables
        if (Schema::hasTable('waste_values')) {
            DB::table('waste_values')->truncate();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to restore data in down method
        // If you need to reseed data, use seeders instead
    }
}; 