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
        Schema::create('forum_ratings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('thread_id');
            $table->tinyInteger('rating')->comment('Rating 1-5');
            
            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');
                
            $table->foreign('thread_id')
                ->references('thread_id')
                ->on('forum_threads')
                ->onDelete('cascade');
                
            // Satu user hanya bisa memberikan satu rating per thread
            $table->unique(['user_id', 'thread_id']);
            $table->timestamps();
        });
        
        // Tambahkan kolom average_rating pada tabel forum_threads
        Schema::table('forum_threads', function (Blueprint $table) {
            if (!Schema::hasColumn('forum_threads', 'average_rating')) {
                $table->decimal('average_rating', 3, 2)->nullable()->after('view_count');
                $table->unsignedInteger('rating_count')->default(0)->after('average_rating');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Hapus kolom dari forum_threads
        Schema::table('forum_threads', function (Blueprint $table) {
            if (Schema::hasColumn('forum_threads', 'average_rating')) {
                $table->dropColumn(['average_rating', 'rating_count']);
            }
        });
        
        // Hapus tabel forum_ratings
        Schema::dropIfExists('forum_ratings');
    }
};

