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
        Schema::create('forum_threads', function (Blueprint $table) {
            $table->id('thread_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->string('judul', 100);
            $table->text('konten');
            $table->dateTime('tanggal_posting')->default(now());
            $table->enum('status', ['AKTIF', 'NONAKTIF'])->default('AKTIF');
            $table->text('tags')->nullable();
            $table->integer('view_count')->default(0);
            $table->integer('engagements')->default(0)->comment('Total interaksi (view, like, comment)');
            $table->decimal('average_rating', 3, 2)->nullable();
            $table->unsignedInteger('rating_count')->default(0);
            $table->timestamp('updated_at')->nullable();
            $table->softDeletes();
            
            $table->fullText(['judul', 'konten'], 'ft_thread_content');
            $table->index('user_id', 'idx_user_id');
            $table->index('tanggal_posting', 'idx_tanggal_posting');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forum_threads');
    }
};
