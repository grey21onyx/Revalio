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
        Schema::create('waste_values', function (Blueprint $table) {
            $table->id('nilai_id');
            $table->foreignId('waste_id')->constrained('waste_types', 'waste_id')->cascadeOnDelete()->cascadeOnUpdate();
            $table->decimal('harga_minimum', 10, 2);
            $table->decimal('harga_maksimum', 10, 2);
            $table->string('satuan', 20);
            $table->dateTime('tanggal_update')->default(now());
            $table->string('sumber_data', 100)->nullable();
            
            $table->index('waste_id', 'idx_waste_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waste_values');
    }
};
