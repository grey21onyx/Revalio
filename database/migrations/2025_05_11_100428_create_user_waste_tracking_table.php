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
        Schema::create('user_waste_tracking', function (Blueprint $table) {
            $table->id('tracking_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('waste_id')->constrained('waste_types', 'waste_id')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->decimal('jumlah', 10, 2);
            $table->string('satuan', 20);
            $table->dateTime('tanggal_pencatatan')->default(now());
            $table->enum('status_pengelolaan', ['disimpan', 'dijual', 'didaur ulang']);
            $table->decimal('nilai_estimasi', 10, 2)->nullable();
            $table->text('catatan')->nullable();
            $table->string('foto', 255)->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->softDeletes();
            
            $table->index('user_id', 'idx_user_id');
            $table->index('waste_id', 'idx_waste_id');
            $table->index('tanggal_pencatatan', 'idx_tanggal_pencatatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_waste_tracking');
    }
};
