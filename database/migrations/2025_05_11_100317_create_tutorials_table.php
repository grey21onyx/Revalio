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
        Schema::create('tutorials', function (Blueprint $table) {
            $table->id('tutorial_id');
            $table->foreignId('waste_id')->nullable()->constrained('waste_types', 'waste_id')
                ->nullOnDelete()->cascadeOnUpdate();
            $table->string('judul', 100);
            $table->text('deskripsi');
            $table->enum('jenis_tutorial', ['daur ulang', 'reuse']);
            $table->text('konten');
            $table->text('media')->nullable();
            $table->enum('tingkat_kesulitan', ['VERY_EASY', 'EASY', 'MODERATE', 'DIFFICULT', 'VERY_DIFFICULT']);
            $table->integer('estimasi_waktu'); // dalam menit
            $table->timestamp('updated_at')->nullable();
            
            $table->index('waste_id', 'idx_waste_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tutorials');
    }
};
