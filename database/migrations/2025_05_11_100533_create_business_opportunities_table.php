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
        Schema::create('business_opportunities', function (Blueprint $table) {
            $table->id('peluang_id');
            $table->string('judul', 100);
            $table->text('deskripsi');
            $table->string('kategori', 50);
            $table->decimal('investasi_awal', 12, 2)->nullable();
            $table->text('potensi_pendapatan')->nullable();
            $table->text('tantangan')->nullable();
            $table->text('saran_implementasi')->nullable();
            $table->timestamp('updated_at')->nullable();
            
            $table->index('kategori', 'idx_kategori');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_opportunities');
    }
};
