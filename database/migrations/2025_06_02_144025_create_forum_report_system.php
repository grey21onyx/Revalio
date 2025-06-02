<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First ensure the table doesn't exist
        Schema::dropIfExists('forum_reports');
        
        // Then create the table
        Schema::create('forum_reports', function (Blueprint $table) {
            $table->id();
            $table->string('reportable_type'); // 'thread' or 'comment'
            $table->unsignedBigInteger('reportable_id');
            $table->unsignedBigInteger('thread_id');
            $table->unsignedBigInteger('comment_id')->nullable();
            $table->unsignedBigInteger('user_id'); // User who created the content
            $table->unsignedBigInteger('reported_by_id');
            $table->string('report_reason');
            $table->text('description')->nullable();
            $table->string('status')->default('reported'); // reported, resolved, rejected
            $table->text('resolution_note')->nullable();
            $table->timestamp('reported_at')->useCurrent();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            
            // Foreign keys with the correct column names
            $table->foreign('thread_id')->references('thread_id')->on('forum_threads')->onDelete('cascade');
            $table->foreign('comment_id')->references('komentar_id')->on('forum_comments')->onDelete('cascade');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('reported_by_id')->references('user_id')->on('users')->onDelete('cascade');
            
            // Index for the polymorphic relationship
            $table->index(['reportable_type', 'reportable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forum_reports');
    }
};
