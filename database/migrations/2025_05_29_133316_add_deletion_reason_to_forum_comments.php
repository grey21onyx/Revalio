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
        // No longer needed as we are using hard delete
        // We'll drop any existing columns that were added
        if (Schema::hasColumns('forum_comments', ['deletion_reason', 'deletion_by_user_id'])) {
            Schema::table('forum_comments', function (Blueprint $table) {
                // Drop foreign key if it exists
                if (Schema::hasColumn('forum_comments', 'deletion_by_user_id')) {
                    $table->dropForeign('fk_forum_comments_deletion_by_user');
                    $table->dropIndex('idx_forum_comments_deletion_by');
                }
                
                // Drop columns
                $table->dropColumn(['deletion_reason', 'deletion_by_user_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to recreate the columns since we're moving away from this approach
    }
}; 