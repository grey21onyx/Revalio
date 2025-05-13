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
        Schema::create('articles', function (Blueprint $table) {
            $table->id('artikel_id');
            $table->string('judul', 100);
            $table->text('deskripsi_singkat');
            $table->text('konten');
            $table->string('kategori', 50);
            $table->foreignId('penulis_id')->constrained('users', 'user_id');
            $table->dateTime('tanggal_publikasi');
            $table->enum('status', ['PUBLISHED', 'DRAFT'])->default('PUBLISHED');
            $table->string('gambar_utama', 255)->nullable();
            $table->text('tags')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('penulis_id', 'idx_penulis_id');
            $table->index('kategori', 'idx_kategori');
            $table->index('tanggal_publikasi', 'idx_tanggal_publikasi');
            $table->fullText(['judul', 'deskripsi_singkat', 'konten'], 'ft_article_content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
