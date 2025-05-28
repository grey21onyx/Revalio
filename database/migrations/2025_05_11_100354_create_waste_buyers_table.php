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
        Schema::create('waste_buyers', function (Blueprint $table) {
            $table->id('pembeli_id');
            $table->string('nama_pembeli', 100);
            $table->enum('jenis_pembeli', ['bank sampah', 'pengepul', 'pabrik']);
            $table->text('alamat');
            $table->string('kontak', 20);
            $table->string('email', 100)->nullable();
            $table->string('website', 255)->nullable();
            $table->text('jam_operasional')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->enum('status', ['AKTIF', 'TIDAK_AKTIF'])->default('AKTIF');
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('jumlah_rating')->default(0);
            $table->string('kota', 100)->nullable();
            $table->string('provinsi', 100)->nullable();
            $table->string('foto')->nullable();
            $table->text('deskripsi')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waste_buyers');
    }
};
