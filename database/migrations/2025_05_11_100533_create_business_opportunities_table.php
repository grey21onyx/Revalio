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
            $table->string('judul', 255);
            $table->text('deskripsi');
            $table->string('jenis_sampah_terkait')->nullable();
            $table->decimal('investasi_minimal', 12, 2)->default(0);
            $table->decimal('investasi_maksimal', 12, 2)->default(0);
            $table->text('potensi_keuntungan')->nullable();
            $table->string('gambar')->nullable();
            $table->string('sumber_informasi')->nullable();
            $table->dateTime('tanggal_publikasi');
            $table->enum('status', ['AKTIF', 'TIDAK_AKTIF'])->default('AKTIF');
            $table->timestamps();
            
            $table->index('jenis_sampah_terkait');
            $table->index('status');
        });
        
        // Membuat tabel pivot untuk relasi many-to-many dengan waste_types
        Schema::create('business_opportunity_waste_types', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('peluang_id');
            $table->unsignedBigInteger('waste_id');
            $table->timestamps();
            
            $table->foreign('peluang_id')
                  ->references('peluang_id')
                  ->on('business_opportunities')
                  ->onDelete('cascade');
                  
            $table->foreign('waste_id')
                  ->references('waste_id')
                  ->on('waste_types')
                  ->onDelete('cascade');
                  
            $table->unique(['peluang_id', 'waste_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_opportunity_waste_types');
        Schema::dropIfExists('business_opportunities');
    }
};
