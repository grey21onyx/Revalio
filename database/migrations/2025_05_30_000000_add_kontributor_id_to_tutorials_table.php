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
        Schema::table('tutorials', function (Blueprint $table) {
            // Tambahkan kolom kontributor_id jika belum ada
            if (!Schema::hasColumn('tutorials', 'kontributor_id')) {
                $table->foreignId('kontributor_id')->nullable()->after('waste_id')
                    ->constrained('users', 'user_id')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();
                
                $table->index('kontributor_id', 'idx_kontributor_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tutorials', function (Blueprint $table) {
            // Hapus foreign key dan index jika ada
            if (Schema::hasColumn('tutorials', 'kontributor_id')) {
                $table->dropForeign(['kontributor_id']);
                $table->dropIndex('idx_kontributor_id');
                $table->dropColumn('kontributor_id');
            }
        });
    }
}; 