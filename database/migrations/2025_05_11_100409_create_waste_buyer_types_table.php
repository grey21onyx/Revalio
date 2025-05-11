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
        Schema::create('waste_buyer_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pembeli_id')->constrained('waste_buyers', 'pembeli_id')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('waste_id')->constrained('waste_types', 'waste_id')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->decimal('harga_beli', 10, 2)->nullable();
            $table->text('syarat_minimum')->nullable();
            $table->text('catatan')->nullable();
            
            $table->index('pembeli_id', 'idx_pembeli_id');
            $table->index('waste_id', 'idx_waste_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waste_buyer_types');
    }
};
