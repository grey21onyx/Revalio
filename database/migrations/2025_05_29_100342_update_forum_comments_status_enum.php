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
        // Untuk MySQL, kita perlu mengubah kolom terlebih dahulu
        Schema::table('forum_comments', function (Blueprint $table) {
            // Ubah kolom status, gunakan Raw SQL karena Laravel tidak mendukung langsung modifikasi enum
            DB::statement("ALTER TABLE forum_comments MODIFY COLUMN status ENUM('AKTIF', 'TIDAK_AKTIF', 'DILAPORKAN') DEFAULT 'AKTIF'");
            
            // Update data yang ada dari NONAKTIF menjadi TIDAK_AKTIF
            DB::statement("UPDATE forum_comments SET status = 'TIDAK_AKTIF' WHERE status = 'NONAKTIF'");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('forum_comments', function (Blueprint $table) {
            // Kembalikan ke nilai enum semula jika perlu rollback
            DB::statement("ALTER TABLE forum_comments MODIFY COLUMN status ENUM('AKTIF', 'NONAKTIF', 'DILAPORKAN') DEFAULT 'AKTIF'");
            
            // Update data yang ada dari TIDAK_AKTIF menjadi NONAKTIF
            DB::statement("UPDATE forum_comments SET status = 'NONAKTIF' WHERE status = 'TIDAK_AKTIF'");
        });
    }
};
