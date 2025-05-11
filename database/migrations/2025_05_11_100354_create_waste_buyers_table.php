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
