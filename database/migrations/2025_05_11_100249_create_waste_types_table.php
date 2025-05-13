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
        Schema::create('waste_types', function (Blueprint $table) {
            $table->id('waste_id');
            $table->string('nama_sampah', 100);
            $table->foreignId('kategori_id')->constrained('waste_categories', 'kategori_id');
            $table->text('deskripsi');
            $table->text('cara_sortir')->nullable();
            $table->text('cara_penyimpanan')->nullable();
            $table->string('gambar', 255)->nullable();
            $table->boolean('status_aktif')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('kategori_id', 'idx_kategori_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waste_types');
    }
};
