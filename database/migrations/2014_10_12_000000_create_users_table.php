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
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('nama_lengkap', 100);
            $table->string('email', 100)->unique();
            $table->string('password', 255);
            $table->string('no_telepon', 20)->nullable();
            $table->text('alamat')->nullable();
            $table->string('foto_profil', 255)->nullable();
            $table->datetime('tanggal_registrasi')->default(now());
            $table->enum('status_akun', ['AKTIF', 'NONAKTIF', 'BLOKIR'])->default('AKTIF');
            $table->enum('role', ['admin', 'user', 'moderator'])->default('user');
            $table->text('preferensi_sampah')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->rememberToken();
            $table->index('email', 'idx_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
