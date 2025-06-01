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
        Schema::table('forum_threads', function (Blueprint $table) {
            if (!Schema::hasColumn('forum_threads', 'view_count')) {
                $table->integer('view_count')->default(0)->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('forum_threads', function (Blueprint $table) {
            if (Schema::hasColumn('forum_threads', 'view_count')) {
                $table->dropColumn('view_count');
            }
        });
    }
};