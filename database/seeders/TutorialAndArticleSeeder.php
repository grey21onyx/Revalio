<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Tutorial;
use App\Models\User;
use App\Models\WasteType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TutorialAndArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat tutorial sampel
        $tutorials = [
            [
                'waste_id' => WasteType::where('nama_sampah', 'Botol PET')->first()->waste_id ?? 1,
                'judul' => 'Membuat Pot Tanaman dari Botol Plastik',
                'deskripsi' => 'Tutorial untuk membuat pot tanaman dari botol plastik bekas.',
                'jenis_tutorial' => 'reuse',
                'konten' => "<p>Berikut adalah langkah-langkah untuk membuat pot tanaman dari botol plastik bekas:</p>
                            <ol>
                                <li>Siapkan botol plastik bekas yang sudah dibersihkan</li>
                                <li>Potong botol menjadi dua bagian</li>
                                <li>Buat lubang kecil di bagian bawah untuk drainase</li>
                                <li>Dekorasi pot sesuai selera menggunakan cat atau kain</li>
                                <li>Isi dengan tanah dan tanaman pilihan Anda</li>
                            </ol>
                            <p>Pot tanaman dari botol plastik ini sangat ramah lingkungan dan ekonomis!</p>",
                'media' => json_encode(['video' => 'https://www.youtube.com/watch?v=pot_tanaman_botol']),
                'tingkat_kesulitan' => 'EASY',
                'estimasi_waktu' => 30,
            ],
            [
                'waste_id' => WasteType::where('nama_sampah', 'Kardus')->first()->waste_id ?? 4,
                'judul' => 'Membuat Tempat Pensil dari Kardus Bekas',
                'deskripsi' => 'Tutorial kreatif untuk membuat tempat pensil dari kardus bekas.',
                'jenis_tutorial' => 'reuse',
                'konten' => "<p>Bahan-bahan:</p>
                            <ul>
                                <li>Kardus bekas</li>
                                <li>Gunting atau cutter</li>
                                <li>Lem</li>
                                <li>Kertas kado atau kertas hias</li>
                                <li>Penggaris</li>
                            </ul>
                            <p>Langkah-langkah:</p>
                            <ol>
                                <li>Potong kardus sesuai pola yang telah diukur</li>
                                <li>Lipat dan rekatkan dengan lem</li>
                                <li>Lapisi dengan kertas kado atau kertas hias</li>
                                <li>Biarkan kering selama beberapa jam</li>
                            </ol>",
                'media' => json_encode(['gambar' => 'tutorials/tempat_pensil.jpg']),
                'tingkat_kesulitan' => 'EASY',
                'estimasi_waktu' => 45,
            ],
            [
                'waste_id' => WasteType::where('nama_sampah', 'Kaleng Aluminium')->first()->waste_id ?? 7,
                'judul' => 'Membuat Lampu Hias dari Kaleng Bekas',
                'deskripsi' => 'Tutorial untuk membuat lampu hias indah dari kaleng aluminium bekas.',
                'jenis_tutorial' => 'reuse',
                'konten' => "<p>Bahan-bahan:</p>
                            <ul>
                                <li>Kaleng aluminium bekas</li>
                                <li>Bor atau paku dan palu</li>
                                <li>Cat semprot</li>
                                <li>Lampu LED kecil atau lilin</li>
                                <li>Kawat atau tali</li>
                            </ul>
                            <p>Langkah-langkah:</p>
                            <ol>
                                <li>Bersihkan kaleng dan pastikan tidak ada tepi yang tajam</li>
                                <li>Buat pola lubang pada kaleng menggunakan spidol</li>
                                <li>Lubangi kaleng sesuai pola menggunakan bor atau paku</li>
                                <li>Cat kaleng sesuai selera dan biarkan kering</li>
                                <li>Pasang lampu LED atau lilin di dalam kaleng</li>
                                <li>Pasang kawat atau tali untuk menggantung lampu</li>
                            </ol>",
                'media' => json_encode(['video' => 'https://www.youtube.com/watch?v=lampu_kaleng']),
                'tingkat_kesulitan' => 'MODERATE',
                'estimasi_waktu' => 90,
            ],
        ];
        
        foreach ($tutorials as $tutorial) {
            Tutorial::create($tutorial);
        }
        
        // Buat tutorial tambahan secara acak
        Tutorial::factory(10)->create();
        
        // Buat artikel sampel
        $admin = User::where('role', 'ADMIN')->first();
        $articles = [
            [
                'judul' => 'Mengenal Jenis-jenis Plastik dan Cara Pengolahannya',
                'deskripsi_singkat' => 'Panduan lengkap tentang berbagai jenis plastik dan cara tepat untuk mendaur ulang atau mengelolanya.',
                'konten' => "<h2>Jenis-jenis Plastik</h2>
                            <p>Ada beberapa jenis plastik yang umum ditemukan dalam kehidupan sehari-hari:</p>
                            <ol>
                                <li><strong>PET (Polyethylene Terephthalate)</strong> - Biasa digunakan untuk botol minuman.</li>
                                <li><strong>HDPE (High-Density Polyethylene)</strong> - Digunakan untuk botol susu, deterjen, dll.</li>
                                <li><strong>PVC (Polyvinyl Chloride)</strong> - Digunakan untuk pipa, mainan, furnitur, dll.</li>
                                <li><strong>LDPE (Low-Density Polyethylene)</strong> - Digunakan untuk kantong plastik, pembungkus, dll.</li>
                                <li><strong>PP (Polypropylene)</strong> - Digunakan untuk wadah makanan, sedotan, dll.</li>
                                <li><strong>PS (Polystyrene)</strong> - Digunakan untuk wadah styrofoam, kemasan elektronik, dll.</li>
                                <li><strong>Other</strong> - Berbagai jenis plastik lainnya.</li>
                            </ol>
                            <h2>Cara Pengolahan</h2>
                            <p>Setiap jenis plastik memerlukan pendekatan daur ulang yang berbeda. PET dan HDPE adalah yang paling mudah didaur ulang dan paling banyak diterima oleh fasilitas daur ulang.</p>
                            <p>PVC dan PS lebih sulit didaur ulang dan sering harus dibuang. LDPE dan PP mendapat perhatian lebih besar dalam upaya daur ulang belakangan ini.</p>
                            <p>Selalu periksa kode daur ulang (nomor di dalam simbol segitiga) untuk menentukan jenis plastik dan cara penanganannya yang tepat.</p>",
                'kategori' => 'Edukasi',
                'penulis_id' => $admin->user_id ?? 1,
                'tanggal_publikasi' => now()->subDays(15),
                'status' => 'PUBLISHED',
                'gambar_utama' => 'articles/jenis_plastik.jpg',
                'tags' => '#plastik, #daurulang, #edukasi, #lingkungan',
            ],
            [
                'judul' => '5 Cara Mudah Menerapkan Gaya Hidup Zero Waste',
                'deskripsi_singkat' => 'Tips praktis untuk mengurangi sampah dalam kehidupan sehari-hari dan menjalani gaya hidup yang lebih ramah lingkungan.',
                'konten' => "<h2>Apa itu Zero Waste?</h2>
                            <p>Gaya hidup zero waste adalah pendekatan untuk mengurangi jumlah sampah yang kita hasilkan dengan fokus pada prinsip 5R: Refuse (Menolak), Reduce (Mengurangi), Reuse (Menggunakan kembali), Recycle (Mendaur ulang), dan Rot (Mengompos).</p>
                            <h2>5 Cara Mudah Menerapkan Zero Waste</h2>
                            <ol>
                                <li><strong>Gunakan Tas Belanja Sendiri</strong> - Hindari kantong plastik sekali pakai dengan membawa tas belanja sendiri.</li>
                                <li><strong>Pakai Botol Minum Isi Ulang</strong> - Kurangi botol plastik sekali pakai dengan menggunakan botol minum yang bisa diisi ulang.</li>
                                <li><strong>Pilih Produk Tanpa Kemasan</strong> - Belilah buah, sayur, dan makanan lain tanpa kemasan jika memungkinkan.</li>
                                <li><strong>Kompos Sampah Organik</strong> - Sampah dapur seperti sisa makanan dan kulit buah bisa dikompos di rumah.</li>
                                <li><strong>Perbaiki Daripada Membuang</strong> - Jangan langsung membuang barang yang rusak, coba perbaiki terlebih dahulu.</li>
                            </ol>
                            <p>Menerapkan gaya hidup zero waste tidak perlu dilakukan sekaligus. Mulailah dengan langkah kecil dan tingkatkan secara bertahap sesuai kemampuan.</p>",
                'kategori' => 'Gaya Hidup',
                'penulis_id' => $admin->user_id ?? 1,
                'tanggal_publikasi' => now()->subDays(7),
                'status' => 'PUBLISHED',
                'gambar_utama' => 'articles/zero_waste.jpg',
                'tags' => '#zerowaste, #lingkungan, #gayahidup, #reduce',
            ],
        ];
        
        foreach ($articles as $article) {
            Article::create($article);
        }
        
        // Buat artikel tambahan secara acak
        Article::factory(8)->create();
    }
} 