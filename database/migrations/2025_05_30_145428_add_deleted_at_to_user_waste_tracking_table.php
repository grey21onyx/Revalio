<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_waste_tracking', function (Blueprint $table) {
            // Tambahkan kolom deleted_at jika belum ada
            if (!Schema::hasColumn('user_waste_tracking', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_waste_tracking', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
