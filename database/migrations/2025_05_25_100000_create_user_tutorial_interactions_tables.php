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
        // Tabel untuk tutorial yang sudah diselesaikan pengguna
        Schema::create('user_completed_tutorials', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('tutorial_id');
            
            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');
                
            $table->foreign('tutorial_id')
                ->references('tutorial_id')
                ->on('tutorials')
                ->onDelete('cascade');
                
            $table->timestamp('completed_at')->useCurrent();
            $table->primary(['user_id', 'tutorial_id']);
            $table->timestamps();
        });
        
        // Tabel untuk tutorial yang disimpan pengguna
        Schema::create('user_saved_tutorials', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('tutorial_id');
            
            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');
                
            $table->foreign('tutorial_id')
                ->references('tutorial_id')
                ->on('tutorials')
                ->onDelete('cascade');
                
            $table->primary(['user_id', 'tutorial_id']);
            $table->timestamps();
        });
        
        // Tabel untuk rating tutorial oleh pengguna
        Schema::create('tutorial_ratings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('tutorial_id');
            $table->tinyInteger('rating')->comment('Rating 1-5');
            
            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');
                
            $table->foreign('tutorial_id')
                ->references('tutorial_id')
                ->on('tutorials')
                ->onDelete('cascade');
                
            $table->unique(['user_id', 'tutorial_id']);
            $table->timestamps();
        });
        
        // Tabel untuk komentar tutorial
        Schema::create('tutorial_comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('tutorial_id');
            $table->text('content');
            $table->enum('status', ['AKTIF', 'NONAKTIF', 'DILAPORKAN'])->default('AKTIF');
            
            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');
                
            $table->foreign('tutorial_id')
                ->references('tutorial_id')
                ->on('tutorials')
                ->onDelete('cascade');
                
            $table->timestamps();
            $table->softDeletes();
        });
        
        // Tambahkan kolom average_rating pada tabel tutorials
        Schema::table('tutorials', function (Blueprint $table) {
            $table->decimal('average_rating', 3, 2)->nullable()->after('estimasi_waktu');
            $table->unsignedInteger('view_count')->default(0)->after('average_rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tutorials', function (Blueprint $table) {
            $table->dropColumn(['average_rating', 'view_count']);
        });
        
        Schema::dropIfExists('tutorial_comments');
        Schema::dropIfExists('tutorial_ratings');
        Schema::dropIfExists('user_saved_tutorials');
        Schema::dropIfExists('user_completed_tutorials');
    }
}; 