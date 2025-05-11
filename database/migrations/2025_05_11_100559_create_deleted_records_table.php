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
        Schema::create('deleted_records', function (Blueprint $table) {
            $table->id('deletion_id');
            $table->string('table_name', 50);
            $table->unsignedBigInteger('record_id'); // ID asli record yang dihapus
            $table->json('record_data');
            $table->dateTime('deletion_date')->default(now());
            $table->foreignId('user_id')->nullable()->constrained('users', 'user_id')
                ->nullOnDelete()->cascadeOnUpdate();
            $table->enum('restoration_status', ['NOT_RESTORED', 'RESTORED'])->default('NOT_RESTORED');
            $table->timestamp('updated_at')->nullable();
            
            $table->index('user_id', 'idx_user_id');
            $table->index(['table_name', 'record_id'], 'idx_table_record');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deleted_records');
    }
};
