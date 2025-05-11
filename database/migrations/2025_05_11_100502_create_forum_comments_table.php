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
        Schema::create('forum_comments', function (Blueprint $table) {
            $table->id('komentar_id');
            $table->foreignId('thread_id')->constrained('forum_threads', 'thread_id')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->text('konten');
            $table->dateTime('tanggal_komentar')->default(now());
            $table->unsignedBigInteger('parent_komentar_id')->nullable();
            $table->timestamp('updated_at')->nullable();
            
            $table->index('thread_id', 'idx_thread_id');
            $table->index('user_id', 'idx_user_id');
            $table->index('parent_komentar_id', 'idx_parent_komentar_id');
            
            $table->foreign('parent_komentar_id')
                ->references('komentar_id')
                ->on('forum_comments')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forum_comments');
    }
};
