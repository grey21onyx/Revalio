SPESIFIKASI KEBUTUHAN DAN PERANCANGAN
 PERANGKAT LUNAK




Aplikasi Edukasi Digital untuk Memberdayakan Sampah Menjadi Sumber Penghasilan (Revalio)




Dipersiapkan oleh:
4342401070 - Muhamad Ariffadhlullah
43424001072 - Diva Satria
4342401085 - Berkat Tua Siallagan









Program Studi Teknologi Rekayasa Perangkat Lunak
Politeknik Negeri Batam
Jl. Ahmad Yani, Batam 29461
2025
 
<!-- Daftar isi ini sudah menggunakan anchor link. Klik untuk shortcut ke bagian terkait. -->
1 [PENDAHULUAN](#1-pendahuluan)<br>
  1.1 [TUJUAN](#11-tujuan)<br>
  1.2 [LINGKUP MASALAH](#12-lingkup-masalah)<br>
  1.3 [DEFINISI, AKRONIM DAN SINGKATAN](#13-definisi-akronim-dan-singkatan)<br>
  1.4 [ATURAN PENAMAAN DAN PENOMORAN](#14-aturan-penamaan-dan-penomoran)<br>
  1.5 [REFERENSI](#15-referensi)<br>
  1.6 [IKHTISAR DOKUMEN](#16-ikhtisar-dokumen)<br>
2 [DESKRIPSI UMUM PERANGKAT LUNAK](#2-deskripsi-umum-perangkat-lunak)<br>
  2.1 [DESKRIPSI UMUM SISTEM](#21-deskripsi-umum-sistem)<br>
  2.2 [PROSES BISNIS SISTEM](#22-proses-bisnis-sistem)<br>
  2.3 [KARAKTERISTIK PENGGUNA](#23-karakteristik-pengguna)<br>
  2.4 [BATASAN](#24-batasan)<br>
  2.5 [RANCANGAN LINGKUNGAN IMPLEMENTASI](#25-rancangan-lingkungan-implementasi)<br>
3 [DESKRIPSI RINCI KEBUTUHAN](#3-deskripsi-rinci-kebutuhan)<br>
  3.1 [DESKRIPSI FUNGSIONAL](#31-deskripsi-fungsional)<br>
    3.1.1 [Use Case Diagram](#311-use-case-diagram)<br>
    3.1.2 [Use Case Mempelajari Jenis Sampah dan Nilainya](#312-use-case-mempelajari-jenis-sampah-dan-nilainya)<br>
      3.1.2.1 [Skenario](#3121-skenario)<br>
      3.1.2.2 [Interaksi Objek](#3122-interaksi-objek)<br>
    3.1.3 [Use Case Tracking Volume Sampah](#313-use-case-tracking-volume-sampah)<br>
      3.1.3.1 [Skenario](#3131-skenario)<br>
      3.1.3.2 [Interaksi Objek](#3132-interaksi-objek)<br>
    3.1.4 [Use Case Mempelajari Panduan Daur Ulang & Reuse](#314-use-case-mempelajari-panduan-daur-ulang--reuse)<br>
      3.1.4.1 [Skenario](#3141-skenario)<br>
      3.1.4.2 [Interaksi Objek](#3142-interaksi-objek)<br>
    3.1.5 [Use Case Mendapatkan Tips Monetisasi Limbah](#315-use-case-mendapatkan-tips-monetisasi-limbah)<br>
      3.1.5.1 [Skenario](#3151-skenario)<br>
      3.1.5.2 [Interaksi Objek](#3152-interaksi-objek)<br>
  3.2 [DESKRIPSI KEBUTUHAN NON FUNGSIONAL](#32-deskripsi-kebutuhan-non-fungsional)<br>
4 [DESKRIPSI KELAS-KELAS](#4-deskripsi-kelas-kelas)<br>
  4.1 [CLASS DIAGRAM](#41-class-diagram)<br>
  4.2 [CLASS USER](#42-class-user)<br>
  4.3 [CLASS WASTEITEM](#43-class-wasteitem)<br>
  4.4 [CLASS WASTERECORD](#44-class-wasterecord)<br>
  4.5 [CLASS EDUCATIONALCONTENT](#45-class-educationalcontent)<br>
  4.6 [STATE MACHINE DIAGRAM](#46-state-machine-diagram)<br>
5 [DESKRIPSI DATA](#5-deskripsi-data)<br>
  5.1 [ENTITY-RELATIONSHIP DIAGRAM](#51-entity-relationship-diagram)<br>
  5.2 [DAFTAR TABEL](#52-daftar-tabel)<br>
  5.3 [STRUKTUR TABEL USERS](#53-struktur-tabel-users)<br>
  5.4 [STRUKTUR TABEL WASTE_TYPES](#54-struktur-tabel-waste_types)<br>
  5.5 [STRUKTUR TABEL WASTE_CATEGORIES](#55-struktur-tabel-waste_categories)<br>
  5.6 [STRUKTUR TABEL WASTE_VALUES](#56-struktur-tabel-waste_values)<br>
  5.7 [STRUKTUR TABEL TUTORIALS](#57-struktur-tabel-tutorials)<br>
  5.8 [STRUKTUR TABEL ARTICLES](#58-struktur-tabel-articles)<br>
  5.9 [STRUKTUR TABEL WASTE_BUYERS](#59-struktur-tabel-waste_buyers)<br>
  5.10 [STRUKTUR TABEL WASTE_BUYER_TYPES](#510-struktur-tabel-waste_buyer_types)<br>
  5.11 [STRUKTUR TABEL USER_WASTE_TRACKING](#511-struktur-tabel-user_waste_tracking)<br>
  5.12 [STRUKTUR TABEL FORUM_THREADS](#512-struktur-tabel-forum_threads)<br>
  5.13 [STRUKTUR TABEL FORUM_COMMENTS](#513-struktur-tabel-forum_comments)<br>
  5.14 [STRUKTUR TABEL BUSINESS_OPPORTUNITIES](#514-struktur-tabel-business_opportunities)<br>
  5.15 [STRUKTUR TABEL DELETED_RECORDS](#515-struktur-tabel-deleted_records)<br>
  5.16 [SKEMA RELASI ANTAR TABEL](#516-skema-relasi-antar-tabel)<br>
6 [PERANCANGAN ANTARMUKA](#6-perancangan-antarmuka)<br>
  6.1 [ANTARMUKA BERANDA](#61-antarmuka-beranda)<br>
  6.2 [ANTARMUKA KATALOG SAMPAH BERNILAI](#62-antarmuka-katalog-sampah-bernilai)<br>
  6.3 [ANTARMUKA DETAIL SAMPAH](#63-antarmuka-detail-sampah)<br>
  6.4 [ANTARMUKA TRACKING SAMPAH](#64-antarmuka-tracking-sampah)<br>
  6.5 [ANTARMUKA PANDUAN DAUR ULANG & REUSE](#65-antarmuka-panduan-daur-ulang--reuse)<br>
  6.6 [ANTARMUKA DETAIL PANDUAN](#66-antarmuka-detail-panduan)<br>
  6.7 [ANTARMUKA FORUM DISKUSI](#67-antarmuka-forum-diskusi)<br>
  6.8 [ANTARMUKA PELUANG USAHA](#68-antarmuka-peluang-usaha)<br>
7 [MATRIKS KETERUNUTAN](#7-matriks-keterunutan)<br>

 
1	Pendahuluan 

1.1	Tujuan

Dokumen Spesifikasi Kebutuhan dan Perancangan Perangkat Lunak (SKPPL) ini bertujuan untuk menjelaskan kebutuhan dan rancangan dari Revalio, sebuah platform edukasi digital yang membantu masyarakat memahami cara mengelola sampah rumah tangga dan industri ringan agar bisa memiliki nilai ekonomis. Dokumen ini akan menjadi acuan bagi pengembang dalam membangun sistem dan bagi pengguna untuk memahami fungsionalitas yang akan tersedia.

1.2	Lingkup Masalah

Revalio berfokus pada pemberdayaan masyarakat untuk mengelola sampah dengan lebih baik dan mendapatkan nilai ekonomis dari sampah. Lingkup dari aplikasi Revalio meliputi:

- Edukasi mengenai jenis-jenis sampah yang bisa diolah dan dijual, termasuk sampah rumah tangga dan industri ringan seperti besi tua, kardus, kaleng, botol plastik, dan limbah lainnya
- Panduan klasifikasi dan sortir sampah yang interaktif
- Informasi tentang nilai ekonomis dari berbagai jenis sampah
- Panduan daur ulang dan reuse untuk berbagai jenis sampah
- Tips monetisasi limbah, termasuk informasi tentang cara menjual dan siapa yang membeli
- Sistem tracking volume sampah yang dikelola pengguna
- Edukasi tentang dampak lingkungan dari pengelolaan sampah dan peluang usaha yang bisa dihasilkan

Aplikasi ini TIDAK berfungsi sebagai tempat jual beli langsung, melainkan sebagai panduan interaktif, tool manajemen, dan sumber informasi terpercaya dalam proses pengelolaan sampah.

1.3	Definisi, Akronim dan Singkatan

| Istilah/Akronim | Definisi |
|-----------------|----------|
| SKPPL | Spesifikasi Kebutuhan dan Perancangan Perangkat Lunak |
| Revalio | Aplikasi Edukasi Digital untuk Memberdayakan Sampah Menjadi Sumber Penghasilan |
| UI | User Interface (Antarmuka Pengguna) |
| UX | User Experience (Pengalaman Pengguna) |
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| MVP | Minimum Viable Product |
| Daur Ulang | Proses mengolah sampah menjadi produk baru |
| Reuse | Penggunaan kembali sampah untuk fungsi yang sama atau berbeda |
| Monetisasi | Proses menghasilkan uang dari suatu aset, dalam konteks ini adalah sampah |

1.4	Aturan Penamaan dan Penomoran

- Penomoran bab dimulai dari angka 1 dengan format angka Arab
- Penomoran sub-bab menggunakan format [nomor bab].[nomor sub-bab]
- Penamaan use case menggunakan format [UC-nomor]
- Penamaan kelas menggunakan format PascalCase
- Penamaan tabel database menggunakan format snake_case
- Penamaan atribut dan method menggunakan format camelCase

1.5	Referensi

1. IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications
2. UML 2.5 Specification
3. Undang-Undang Nomor 18 Tahun 2008 tentang Pengelolaan Sampah
4. Peraturan Pemerintah Nomor 81 Tahun 2012 tentang Pengelolaan Sampah Rumah Tangga dan Sampah Sejenis Sampah Rumah Tangga

1.6	Ikhtisar Dokumen

Dokumen SKPPL ini terdiri dari tujuh bagian utama:
1. Pendahuluan: menjelaskan tujuan, lingkup, dan konvensi dokumen
2. Deskripsi Umum Perangkat Lunak: memberikan gambaran umum tentang sistem dan lingkungannya
3. Deskripsi Rinci Kebutuhan: menjelaskan kebutuhan fungsional dan non-fungsional secara detail
4. Deskripsi Kelas-Kelas: menjelaskan struktur dan relasi antar kelas dalam sistem
5. Deskripsi Data: menjelaskan struktur data dan skema database
6. Perancangan Antarmuka: menampilkan rancangan antarmuka pengguna
7. Matriks Keterunutan: menunjukkan hubungan antara kebutuhan dan implementasinya

2	Deskripsi Umum Perangkat Lunak

2.1	Deskripsi Umum Sistem

Revalio adalah platform edukasi digital yang bertujuan untuk memberdayakan masyarakat dalam mengelola sampah rumah tangga dan industri ringan menjadi sumber penghasilan. Aplikasi ini menyediakan informasi komprehensif tentang jenis-jenis sampah yang memiliki nilai ekonomis (seperti besi tua, kardus, kaleng, botol plastik), cara pengelolaannya, dan potensi nilainya di pasaran.

Sistem ini dibangun sebagai panduan interaktif yang memungkinkan pengguna untuk:
- Mempelajari klasifikasi dan cara sortir berbagai jenis sampah
- Memahami proses daur ulang dan reuse untuk setiap jenis sampah
- Mendapatkan tips monetisasi limbah, termasuk informasi tentang cara menjual dan target pembeli
- Melacak volume sampah yang telah dikelola
- Mendapatkan edukasi tentang dampak lingkungan dan peluang usaha terkait pengelolaan sampah

Aplikasi ini tidak berfungsi sebagai marketplace untuk jual beli sampah, melainkan sebagai sumber informasi terpercaya dan alat manajemen yang memberdayakan pengguna untuk mengoptimalkan nilai dari sampah yang mereka hasilkan.

Sistem ini dibangun dengan arsitektur client-server, dengan aplikasi web responsif yang dapat diakses melalui browser di berbagai perangkat.

2.2	Proses Bisnis Sistem

Proses bisnis dari aplikasi Revalio meliputi:

1. **Pendaftaran dan Otentikasi**
   - Pengguna mendaftar dengan email atau media sosial
   - Pengguna melengkapi profil dan preferensi jenis sampah yang ingin dikelola

2. **Edukasi Pengelolaan Sampah**
   - Pengguna mengakses materi edukasi tentang berbagai jenis sampah yang memiliki nilai ekonomis
   - Pengguna mempelajari cara klasifikasi dan sortir sampah yang benar
   - Pengguna mempelajari proses daur ulang dan reuse untuk setiap jenis sampah
   - Pengguna menyelesaikan kuis untuk menguji pemahaman

3. **Eksplorasi Nilai Ekonomis Sampah**
   - Pengguna mengakses informasi tentang nilai ekonomis berbagai jenis sampah
   - Sistem memberikan perkiraan harga pasar terkini
   - Pengguna mendapatkan tips untuk memaksimalkan nilai jual sampah

4. **Panduan Monetisasi Sampah**
   - Pengguna mempelajari cara mengemas, menyimpan, dan memasarkan sampah dengan benar
   - Pengguna mendapatkan informasi tentang siapa yang membeli jenis sampah tertentu
   - Pengguna mendapatkan tips negosiasi dan standar harga pasar

5. **Tracking Volume Sampah**
   - Pengguna mencatat jenis dan volume sampah yang dikelola
   - Sistem menghitung estimasi dampak lingkungan positif yang dihasilkan
   - Sistem menghitung estimasi nilai ekonomi yang berpotensi diperoleh

6. **Edukasi Dampak Lingkungan & Peluang Usaha**
   - Pengguna mengakses informasi tentang dampak positif dari pengelolaan sampah
   - Pengguna mempelajari peluang usaha terkait daur ulang dan pengelolaan sampah
   - Pengguna mendapatkan inspirasi sukses story dari pelaku usaha pengelolaan sampah

7. **Komunitas dan Pembelajaran**
   - Pengguna dapat berbagi pengalaman dan tips pengelolaan sampah
   - Pengguna berpartisipasi dalam tantangan atau kampanye pengelolaan sampah
   - Pengguna mendapatkan update informasi terbaru tentang inovasi pengelolaan sampah

8. **Administrasi Sistem**
   - Manajemen konten edukasi
   - Moderasi komunitas
   - Analisis dan pelaporan aktivitas pengguna
   - Konfigurasi sistem

2.3	Karakteristik Pengguna

Aplikasi Revalio akan digunakan oleh beberapa jenis pengguna, antara lain:

1. **Masyarakat Umum**
   - Memiliki pengetahuan dasar tentang teknologi
   - Tertarik untuk mengelola sampah dengan lebih baik
   - Ingin mendapatkan penghasilan tambahan dari sampah rumah tangga
   - Membutuhkan panduan praktis dan terstruktur tentang pengelolaan sampah

2. **Pelaku UMKM**
   - Menghasilkan sampah industri ringan yang ingin dikelola dengan lebih baik
   - Mencari cara untuk meminimalisir biaya pengelolaan limbah
   - Tertarik untuk mengimplementasikan praktik ramah lingkungan dalam bisnis

3. **Komunitas Peduli Lingkungan**
   - Aktif dalam kegiatan pelestarian lingkungan
   - Mencari informasi dan alat untuk mengedukasi masyarakat tentang pengelolaan sampah
   - Ingin mempromosikan praktik daur ulang dan reuse di komunitas

4. **Pendidik dan Peneliti**
   - Membutuhkan materi edukasi tentang pengelolaan sampah
   - Mencari data dan informasi terkini tentang nilai ekonomis sampah
   - Ingin menggunakan platform sebagai alat bantu mengajar

5. **Administrator Sistem**
   - Mengelola konten edukasi
   - Memantau aktivitas pengguna
   - Mengelola data master dan referensi

2.4	Batasan

Beberapa batasan dalam pengembangan aplikasi Revalio:

1. **Batasan Teknis**
   - Aplikasi web harus kompatibel dengan browser modern (Chrome, Firefox, Safari, Edge)
   - Responsif untuk berbagai ukuran layar (desktop, tablet, mobile)
   - Menggunakan teknologi web standar (HTML5, CSS3, JavaScript)

2. **Batasan Operasional**
   - Aplikasi membutuhkan koneksi internet untuk sebagian besar fitur
   - Fitur penjemputan sampah bergantung pada ketersediaan bank sampah/pengepul di lokasi pengguna
   - Harga sampah dapat berubah-ubah sesuai kondisi pasar

3. **Batasan Keamanan**
   - Data pengguna harus dilindungi sesuai regulasi privasi data
   - Transaksi finansial harus mengikuti standar keamanan yang berlaku
   - Verifikasi identitas diperlukan untuk fitur tertentu

2.5	Rancangan Lingkungan Implementasi

Aplikasi Revalio akan diimplementasikan dengan lingkungan sebagai berikut:

1. **Frontend**
   - Framework: React.js
   - UI Library: Material-UI
   - State Management: Redux
   - Styling: Tailwind CSS
   - Animation: GSAP (GreenSock Animation Platform)

2. **Backend**
   - Framework: Laravel
   - Database: MySQL
   - Authentication: Laravel Sanctum
   - ORM: Eloquent

3. **Deployment**
   - Cloud Platform: AWS / Google Cloud
   - CI/CD: GitHub Actions
   - Monitoring: Sentry

4. **Persyaratan Perangkat Pengguna**
   - Browser versi terbaru (Chrome, Firefox, Safari, Edge)
   - Koneksi internet minimal 3G
   - Kamera (opsional, untuk fitur identifikasi sampah)
   - GPS (untuk fitur lokasi)

3	DESKRIPSI RINCI KEBUTUHAN

3.1	DESKRIPSI FUNGSIONAL

Aplikasi Revalio memiliki kebutuhan fungsional sebagai berikut:

1. **Manajemen Pengguna**
   - UC-01: Registrasi pengguna baru
   - UC-02: Login dan autentikasi
   - UC-03: Melihat dan mengedit profil
   - UC-04: Reset password
   - UC-05: Mengatur preferensi jenis sampah yang diminati

2. **Edukasi Pengelolaan Sampah**
   - UC-06: Menjelajahi katalog jenis sampah
   - UC-07: Mempelajari cara klasifikasi dan sortir sampah
   - UC-08: Mengakses panduan interaktif daur ulang dan reuse

3. **Eksplorasi Nilai Ekonomis Sampah**
   - UC-11: Melihat informasi nilai ekonomis berbagai jenis sampah
   - UC-12: Mencari sampah berdasarkan nilai ekonomis
   - UC-13: Menggunakan kalkulator estimasi nilai sampah
   - UC-14: Melihat update tren harga pasar

4. **Panduan Monetisasi Sampah**
   - UC-15: Mempelajari cara mengemas dan menyimpan sampah
   - UC-16: Mengakses informasi tentang pembeli potensial
   - UC-17: Mempelajari tips negosiasi dan standar harga
   - UC-18: Mengakses praktik terbaik pemasaran sampah

5. **Tracking Volume Sampah**
   - UC-19: Mencatat jenis dan volume sampah yang dikelola
   - UC-20: Melihat statistik dan visualisasi pengelolaan sampah
   - UC-21: Melihat estimasi dampak lingkungan positif
   - UC-22: Melihat estimasi nilai ekonomi potensial

6. **Edukasi Dampak Lingkungan & Peluang Usaha**
   - UC-23: Mempelajari dampak positif pengelolaan sampah
   - UC-24: Mengeksplorasi peluang usaha terkait pengelolaan sampah
   - UC-25: Mengakses studi kasus dan kisah sukses
   - UC-26: Mempelajari panduan memulai usaha pengelolaan sampah

7. **Komunitas dan Pembelajaran**
   - UC-27: Berpartisipasi dalam forum diskusi
   - UC-28: Berbagi tips dan pengalaman
   - UC-29: Mengikuti tantangan dan kampanye pengelolaan sampah
   - UC-30: Menerima notifikasi dan update informasi terbaru

8. **Administrasi Sistem**
   - UC-31: Mengelola konten edukasi
   - UC-32: Moderasi komunitas dan forum
   - UC-33: Menganalisis dan membuat laporan aktivitas pengguna
   - UC-34: Mengkonfigurasi parameter sistem

3.1.1	Use Case Diagram

![Use Case Diagram](https://via.placeholder.com/800x600?text=Use+Case+Diagram+Revalio)

**Use Case Diagram Revalio mencakup:**
1. **Aktor**:
   - Pengguna (Masyarakat Umum)
   - Pelaku UMKM
   - Administrator
   - Komunitas Peduli Lingkungan
   - Pendidik/Peneliti

2. **Use Case Utama**:
   - UC-01: Registrasi pengguna baru
   - UC-02: Login dan autentikasi
   - UC-03: Melihat dan mengedit profil
   - UC-04: Reset password
   - UC-05: Mengatur preferensi jenis sampah
   - UC-06: Menjelajahi katalog jenis sampah
   - UC-07: Mempelajari cara klasifikasi dan sortir sampah
   - UC-08: Mengakses panduan interaktif daur ulang dan reuse
   - UC-11: Melihat informasi nilai ekonomis sampah
   - UC-12: Mencari sampah berdasarkan nilai ekonomis
   - UC-13: Menggunakan kalkulator estimasi nilai sampah
   - UC-14: Melihat update tren harga pasar
   - UC-15 sampai UC-34: (sesuai deskripsi fungsional)

3.1.2	Use Case Mempelajari Jenis Sampah dan Nilainya

3.1.2.1	Skenario

**Nama Use Case:** UC-06: Menjelajahi Katalog Jenis Sampah

**Aktor:** Pengguna (Masyarakat Umum, Pelaku UMKM)

**Deskripsi:** Use case ini menggambarkan proses pengguna mempelajari berbagai jenis sampah yang memiliki nilai ekonomis dan memahami nilai potensialnya di pasaran.

**Kondisi Awal:** Pengguna telah masuk ke aplikasi Revalio.

**Alur Utama:**
1. Pengguna memilih menu "Katalog Sampah Bernilai".
2. Sistem menampilkan daftar kategori sampah (plastik, kertas, logam, elektronik, dll).
3. Pengguna memilih salah satu kategori sampah.
4. Sistem menampilkan daftar jenis sampah dalam kategori tersebut.
5. Pengguna memilih salah satu jenis sampah.
6. Sistem menampilkan detail informasi tentang sampah tersebut, meliputi:
   - Deskripsi dan karakteristik
   - Foto/gambar contoh
   - Perkiraan nilai ekonomis per satuan berat
   - Cara sortir dan penyimpanan
   - Tips pengelolaan
7. Pengguna dapat melihat grafik perubahan nilai sampah tersebut dalam beberapa periode waktu.
8. Pengguna dapat menambahkan jenis sampah tersebut ke daftar favorit untuk akses cepat di masa mendatang.

**Kondisi Akhir:** Pengguna mendapatkan informasi lengkap tentang jenis sampah tertentu dan nilai ekonomisnya.

**Alur Alternatif:**
- Pada langkah 5, pengguna dapat menggunakan fitur pencarian untuk mencari jenis sampah tertentu.
- Pada langkah 6, jika informasi detail tidak tersedia, sistem akan menampilkan pesan dan menyarankan jenis sampah serupa.

3.1.2.2	Interaksi Objek

![Sequence Diagram UC-06](https://via.placeholder.com/800x400?text=Sequence+Diagram+UC-06)

3.1.3	Use Case Tracking Volume Sampah

3.1.3.1	Skenario

**Nama Use Case:** UC-19: Mencatat Jenis dan Volume Sampah yang Dikelola

**Aktor:** Pengguna (Masyarakat Umum, Pelaku UMKM)

**Deskripsi:** Use case ini menggambarkan proses pengguna mencatat dan melacak volume sampah yang telah dikelola serta melihat estimasi nilai ekonomis dan dampak lingkungan.

**Kondisi Awal:** Pengguna telah login ke aplikasi Revalio.

**Alur Utama:**
1. Pengguna memilih menu "Tracking Sampah".
2. Sistem menampilkan form pencatatan sampah baru dan riwayat pencatatan sebelumnya.
3. Pengguna memilih opsi "Catat Sampah Baru".
4. Sistem menampilkan form dengan field:
   - Jenis sampah (dropdown atau pencarian)
   - Jumlah (dengan pilihan satuan: kg, gram, liter)
   - Tanggal pencatatan
   - Status pengelolaan (dropdown: disimpan, dijual, didaur ulang)
   - Catatan tambahan (opsional)
   - Upload foto (opsional)
5. Pengguna mengisi formulir dan memilih "Simpan".
6. Sistem memproses data dan menampilkan:
   - Konfirmasi penyimpanan berhasil
   - Estimasi nilai ekonomis dari sampah yang dicatat
   - Estimasi dampak lingkungan positif (pengurangan emisi CO2, penghematan energi, dll)
7. Sistem memperbarui dashboard pengguna dengan total volume sampah yang telah dikelola dan estimasi nilai ekonomisnya.

**Kondisi Akhir:** Data sampah tercatat dalam sistem dan dashboard pengguna terupdate.

**Alur Alternatif:**
- Pada langkah 5, jika pengguna tidak mengisi field wajib, sistem akan menampilkan pesan error.
- Pada langkah 2, pengguna dapat memilih untuk melihat statistik dan grafik dari data yang sudah direkam sebelumnya.
- Pengguna dapat mengedit atau menghapus catatan sampah yang sudah diinput sebelumnya.

3.1.3.2	Interaksi Objek

![Sequence Diagram UC-19](https://via.placeholder.com/800x400?text=Sequence+Diagram+UC-19)

3.1.4	Use Case Mempelajari Panduan Daur Ulang & Reuse

3.1.4.1	Skenario

**Nama Use Case:** UC-08: Mengakses Panduan Interaktif Daur Ulang dan Reuse

**Aktor:** Pengguna (Masyarakat Umum, Komunitas Peduli Lingkungan, Pendidik)

**Deskripsi:** Use case ini menggambarkan proses pengguna mempelajari cara mendaur ulang atau menggunakan kembali berbagai jenis sampah.

**Kondisi Awal:** Pengguna telah masuk ke aplikasi Revalio.

**Alur Utama:**
1. Pengguna memilih menu "Panduan Daur Ulang & Reuse".
2. Sistem menampilkan daftar kategori panduan (daur ulang plastik, daur ulang kertas, kerajinan dari sampah, dll).
3. Pengguna memilih salah satu kategori.
4. Sistem menampilkan daftar tutorial dalam kategori tersebut.
5. Pengguna memilih salah satu tutorial.
6. Sistem menampilkan detail tutorial yang berisi:
   - Judul dan deskripsi
   - Tingkat kesulitan
   - Estimasi waktu pengerjaan
   - Bahan-bahan yang dibutuhkan
   - Alat-alat yang dibutuhkan
   - Langkah-langkah dengan gambar/video
   - Hasil akhir
   - Tips dan saran
7. Pengguna dapat menandai tutorial sebagai "Favorit" atau "Selesai Dicoba".
8. Pengguna dapat memberikan komentar pada tutorial.

**Kondisi Akhir:** Pengguna mendapatkan informasi detail tentang cara mendaur ulang atau menggunakan kembali jenis sampah tertentu.

**Alur Alternatif:**
- Pada langkah 2, pengguna dapat menggunakan fitur pencarian untuk mencari tutorial spesifik.
- Pada langkah 6, pengguna dapat mengunduh tutorial dalam format PDF untuk dibaca offline.
- Pengguna dapat membagikan tutorial ke media sosial atau mengirimkan kepada teman.

3.1.4.2	Interaksi Objek

![Sequence Diagram UC-08](https://via.placeholder.com/800x400?text=Sequence+Diagram+UC-08)

3.1.5	Use Case Mendapatkan Tips Monetisasi Limbah

3.1.5.1	Skenario

**Nama Use Case:** UC-16: Mengakses Informasi tentang Pembeli Potensial

**Aktor:** Pengguna (Masyarakat Umum, Pelaku UMKM)

**Deskripsi:** Use case ini menggambarkan proses pengguna mendapatkan tips dan informasi tentang cara memonetisasi limbah, termasuk cara menjual dan informasi pembeli potensial.

**Kondisi Awal:** Pengguna telah masuk ke aplikasi Revalio.

**Alur Utama:**
1. Pengguna memilih menu "Tips Monetisasi".
2. Sistem menampilkan daftar kategori tips (cara menjual, pembeli potensial, teknik negosiasi, dll).
3. Pengguna memilih kategori "Pembeli Potensial".
4. Sistem menampilkan form filter:
   - Jenis sampah (dropdown: plastik, kertas, logam, elektronik, dll)
   - Lokasi (input text dengan auto-complete atau pilih dari peta)
   - Jumlah minimum (opsional)
5. Pengguna mengisi filter dan memilih "Cari".
6. Sistem menampilkan daftar pembeli potensial yang sesuai dengan kriteria pencarian, meliputi:
   - Nama pembeli (bank sampah, pengepul, perusahaan daur ulang)
   - Jenis sampah yang dibeli
   - Kisaran harga
   - Persyaratan (kondisi, jumlah minimum, dll)
   - Lokasi dan kontak
   - Jam operasional
7. Pengguna dapat menyimpan hasil pencarian atau membagikannya.

**Kondisi Akhir:** Pengguna mendapatkan informasi tentang pembeli potensial untuk jenis sampah tertentu di lokasi yang diinginkan.

**Alur Alternatif:**
- Pada langkah 3, pengguna dapat memilih kategori lain seperti "Cara Menjual" atau "Teknik Negosiasi".
- Pada langkah 6, jika tidak ada hasil yang sesuai, sistem akan menyarankan untuk memperluas area pencarian atau mengubah filter.
- Pengguna dapat menambahkan pembeli ke daftar favorit untuk akses cepat di kemudian hari.

3.1.5.2	Interaksi Objek

![Sequence Diagram UC-16](https://via.placeholder.com/800x400?text=Sequence+Diagram+UC-16)

3.2	DESKRIPSI KEBUTUHAN NON FUNGSIONAL

1. **Keamanan**
   - Sistem harus mengimplementasikan autentikasi yang kuat
   - Data sensitif harus dienkripsi
   - Sistem harus terlindungi dari serangan umum (CSRF, XSS, SQL Injection)

2. **Kinerja**
   - Waktu respons halaman tidak lebih dari 3 detik
   - Sistem harus dapat menangani minimal 1000 pengguna konkuren
   - Ketersediaan sistem 99.9% (downtime maksimal 8.76 jam/tahun)

3. **Usabilitas**
   - Antarmuka intuitif dan mudah digunakan
   - Waktu pembelajaran pengguna baru tidak lebih dari 30 menit
   - Mendukung aksesibilitas sesuai standar WCAG 2.1

4. **Skalabilitas**
   - Sistem harus dapat diskalakan secara horizontal
   - Database harus mendukung sharding untuk pertumbuhan data

5. **Kompatibilitas**
   - Kompatibel dengan browser modern (Chrome, Firefox, Safari, Edge)
   - Responsif untuk perangkat dengan ukuran layar berbeda

4	DESKRIPSI KELAS-KELAS

4.1	CLASS DIAGRAM

![Class Diagram](https://via.placeholder.com/800x600?text=Class+Diagram+Revalio)

4.2	CLASS USER

```java
/**
 * Class User merepresentasikan pengguna aplikasi Revalio
 */
public class User {
    // Attributes
    private int userId;
    private String namaLengkap;
    private String email;
    private String password;
    private String noTelepon;
    private String alamat;
    private String fotoProfil;
    private Date tanggalRegistrasi;
    private StatusAkun statusAkun;
    private String preferensiSampah;
    
    // Methods
    public boolean register(String namaLengkap, String email, String password);
    public boolean login(String email, String password);
    public boolean updateProfile(UserProfileDTO profileData);
    public boolean changePassword(String oldPassword, String newPassword);
    public List<UserWasteTracking> getWasteRecords();
    public Dashboard getDashboard();
    public List<Tutorial> getFavoriteTutorials();
    public void addToFavorites(Tutorial tutorial);
    public void removeFromFavorites(Tutorial tutorial);
    public List<WasteType> getFavoriteWasteTypes();
    public void addToFavorites(WasteType wasteType);
    public void removeFromFavorites(WasteType wasteType);
    public List<Thread> getForumThreads();
    public Thread createForumThread(ThreadDTO threadData);
    public Comment postComment(int threadId, String content);
}

public enum StatusAkun {
    AKTIF,
    NONAKTIF,
    SUSPENDED,
    DELETED
}
```

4.3	CLASS WASTEITEM

```java
/**
 * Class WasteItem merepresentasikan jenis sampah yang dapat dikelola
 */
public class WasteItem {
    // Attributes
    private int wasteItemId;
    private String name;
    private String description;
    private WasteCategory category;
    private List<String> imageUrls;
    private String handlingInstructions;
    private String storageGuidelines;
    private DifficultyLevel collectionDifficulty;
    private DifficultyLevel processingDifficulty;
    private boolean isRecyclable;
    private boolean isReusable;
    
    // Methods
    public double getEstimatedValue(Date asOfDate);
    public List<PriceHistory> getPriceHistory(Date startDate, Date endDate);
    public List<Buyer> getPotentialBuyers(String location);
    public List<RecyclingGuide> getRecyclingGuides();
    public List<ReuseIdea> getReuseIdeas();
    public EnvironmentalImpact getEnvironmentalImpact(double weight);
}

public enum WasteCategory {
    PLASTIC,
    PAPER,
    METAL,
    GLASS,
    ELECTRONIC,
    TEXTILE,
    ORGANIC,
    HAZARDOUS,
    OTHER
}

public enum DifficultyLevel {
    VERY_EASY,
    EASY,
    MODERATE,
    DIFFICULT,
    VERY_DIFFICULT
}
```

4.4	CLASS WASTERECORD

```java
/**
 * Class WasteRecord merepresentasikan catatan sampah yang dikelola pengguna
 */
public class WasteRecord {
    // Attributes
    private int recordId;
    private User user;
    private WasteItem wasteItem;
    private double quantity;
    private UnitOfMeasure unitOfMeasure;
    private Date collectionDate;
    private ItemCondition condition;
    private String notes;
    private List<String> photoUrls;
    private Date recordDate;
    
    // Methods
    public double getEstimatedValue();
    public EnvironmentalImpact getEnvironmentalImpact();
    public boolean update(WasteRecordDTO recordData);
    public boolean delete();
}

public enum UnitOfMeasure {
    KILOGRAM,
    GRAM,
    LITER,
    PIECE,
    CUBIC_METER
}

public enum ItemCondition {
    EXCELLENT,
    GOOD,
    FAIR,
    POOR
}
```

4.5	CLASS EDUCATIONALCONTENT

```java
/**
 * Class EducationalContent merepresentasikan konten edukasi dalam aplikasi
 */
public class EducationalContent {
    // Attributes
    private int contentId;
    private String title;
    private String description;
    private ContentType type;
    private ContentCategory category;
    private String author;
    private Date publishDate;
    private Date lastUpdateDate;
    private int viewCount;
    private double averageRating;
    private List<String> tags;
    private String content;
    private List<String> mediaUrls;
    
    // Methods
    public List<Comment> getComments();
    public boolean addComment(User user, String commentText);
    public boolean rateContent(User user, int rating);
    public List<EducationalContent> getRelatedContent();
    public boolean markAsCompleted(User user);
    public boolean isCompletedBy(User user);
}

public enum ContentType {
    ARTICLE,
    VIDEO,
    INFOGRAPHIC,
    QUIZ,
    TUTORIAL,
    CASE_STUDY
}

public enum ContentCategory {
    WASTE_CLASSIFICATION,
    RECYCLING_GUIDE,
    REUSE_IDEA,
    MONETIZATION_TIP,
    ENVIRONMENTAL_IMPACT,
    BUSINESS_OPPORTUNITY
}
```

4.6	STATE MACHINE DIAGRAM

![State Machine Diagram](https://via.placeholder.com/800x400?text=State+Machine+Diagram+for+WasteRecord)

5	DESKRIPSI DATA

5.1	ENTITY-RELATIONSHIP DIAGRAM

![Entity-Relationship Diagram](https://via.placeholder.com/800x600?text=ERD+Revalio)

5.2	DAFTAR TABEL

Aplikasi Revalio menggunakan basis data berikut:

1. users - Menyimpan data pengguna
2. waste_types - Menyimpan informasi jenis-jenis sampah
3. waste_categories - Menyimpan kategori sampah
4. waste_values - Menyimpan nilai ekonomis sampah
5. tutorials - Menyimpan panduan pengelolaan sampah
6. articles - Menyimpan artikel edukasi
7. waste_buyers - Menyimpan informasi pembeli sampah
8. waste_buyer_types - Menyimpan relasi pembeli-sampah
9. user_waste_tracking - Menyimpan catatan sampah yang dikelola pengguna
10. forum_threads - Menyimpan thread forum diskusi
11. forum_comments - Menyimpan komentar forum
12. business_opportunities - Menyimpan informasi peluang usaha
13. deleted_records - Menyimpan catatan yang telah dihapus (recycle bin)

5.3	STRUKTUR TABEL USERS

| Field | Tipe Data | Keterangan | Konstrain |
|-------|-----------|------------|-----------|
| user_id | INT | ID unik pengguna | PK, AUTO_INCREMENT |
| nama_lengkap | VARCHAR(100) | Nama lengkap | NOT NULL |
| email | VARCHAR(100) | Alamat email | UNIQUE, NOT NULL |
| password | VARCHAR(255) | Password terenkripsi | NOT NULL |
| no_telepon | VARCHAR(20) | Nomor telepon | |
| alamat | TEXT | Alamat lengkap | |
| foto_profil | VARCHAR(255) | URL foto profil | |
| tanggal_registrasi | DATETIME | Tanggal pendaftaran | DEFAULT CURRENT_TIMESTAMP |
| status_akun | ENUM | Status akun (aktif/nonaktif) | DEFAULT 'AKTIF' |
| preferensi_sampah | TEXT | Preferensi jenis sampah | |

5.4	STRUKTUR TABEL WASTE_TYPES

| Field | Tipe Data | Keterangan | Konstrain |
|-------|-----------|------------|-----------|
| waste_id | INT | ID unik jenis sampah | PK, AUTO_INCREMENT |
| nama_sampah | VARCHAR(100) | Nama jenis sampah | NOT NULL |
| kategori_id | INT | ID kategori sampah | FK, NOT NULL |
| deskripsi | TEXT | Deskripsi | NOT NULL |
| cara_sortir | TEXT | Cara sortir sampah | |
| cara_penyimpanan | TEXT | Cara penyimpanan sampah | |
| gambar | VARCHAR(255) | URL gambar sampah | |
| status_aktif | BOOLEAN | Status aktif | DEFAULT TRUE |

5.5	STRUKTUR TABEL WASTE_CATEGORIES

| Field | Tipe Data | Keterangan | Konstrain |
|-------|-----------|------------|-----------|
| kategori_id | INT | ID unik kategori | PK, AUTO_INCREMENT |
| nama_kategori | VARCHAR(50) | Nama kategori | NOT NULL, UNIQUE |
| deskripsi | TEXT | Deskripsi kategori | |
| ikon | VARCHAR(255) | URL ikon kategori | |

5.6	STRUKTUR TABEL WASTE_VALUES

| Field | Tipe Data | Keterangan | Konstrain |
|-------|-----------|------------|-----------|
| nilai_id | INT | ID unik nilai | PK, AUTO_INCREMENT |
| waste_id | INT | ID jenis sampah | FK, NOT NULL |
| harga_minimum | DECIMAL(10,2) | Harga minimum | NOT NULL |
| harga_maksimum | DECIMAL(10,2) | Harga maksimum | NOT NULL |
| satuan | VARCHAR(20) | Satuan harga (per kg, per pcs, dll) | NOT NULL |
| tanggal_update | DATETIME | Tanggal update | DEFAULT CURRENT_TIMESTAMP |
| sumber_data | VARCHAR(100) | Sumber data harga | |

5.7	STRUKTUR TABEL TUTORIALS

| Field | Tipe Data | Keterangan | Konstrain |
|-------|-----------|------------|-----------|
| tutorial_id | INT | ID unik tutorial | PK, AUTO_INCREMENT |
| waste_id | INT | ID jenis sampah | FK |
| judul | VARCHAR(100) | Judul tutorial | NOT NULL |
| deskripsi | TEXT | Deskripsi tutorial | NOT NULL |
| jenis_tutorial | ENUM | Jenis tutorial (daur ulang/reuse) | NOT NULL |
| konten | TEXT | Konten tutorial | NOT NULL |
| media | TEXT | URL media (gambar/video) | |
| tingkat_kesulitan | ENUM | Tingkat kesulitan | NOT NULL |
| estimasi_waktu | INT | Estimasi waktu (menit) | NOT NULL |

5.8	STRUKTUR TABEL ARTICLES

| Field | Tipe Data | Keterangan | Konstrain |
|-------|-----------|------------|-----------|
| artikel_id | INT | ID unik artikel | PK, AUTO_INCREMENT |
| judul | VARCHAR(100) | Judul artikel | NOT NULL |
| deskripsi_singkat | TEXT | Deskripsi singkat | NOT NULL |
| konten | TEXT | Konten artikel | NOT NULL |
| kategori | VARCHAR(50) | Kategori artikel | NOT NULL |
| penulis_id | INT | ID penulis | FK, NOT NULL |
| tanggal_publikasi | DATETIME | Tanggal publikasi | NOT NULL |
| status | ENUM | Status artikel | DEFAULT 'PUBLISHED' |
| gambar_utama | VARCHAR(255) | URL gambar utama | |
| tags | TEXT | Tag artikel | |

5.9	STRUKTUR TABEL WASTE_BUYERS

| Field | Tipe Data | Keterangan | Konstrain |
|-------|-----------|------------|-----------|
| pembeli_id | INT | ID unik pembeli | PK, AUTO_INCREMENT |
| nama_pembeli | VARCHAR(100) | Nama pembeli | NOT NULL |
| jenis_pembeli | ENUM | Tipe pembeli (bank sampah/pengepul/pabrik) | NOT NULL |
| alamat | TEXT | Alamat pembeli | NOT NULL |
| kontak | VARCHAR(20) | Kontak pembeli | NOT NULL |
| email | VARCHAR(100) | Email pembeli | |
| website | VARCHAR(255) | Website pembeli | |
| jam_operasional | TEXT | Jam operasional | |

5.10	STRUKTUR TABEL WASTE_BUYER_TYPES

| Field | Tipe Data | Keterangan | Konstrain |
|-------|-----------|------------|-----------|
| id | INT | ID unik relasi | PK, AUTO_INCREMENT |
| pembeli_id | INT | ID pembeli | FK, NOT NULL |
| waste_id | INT | ID jenis sampah | FK, NOT NULL |
| harga_beli | DECIMAL(10,2) | Harga beli | |
| syarat_minimum | TEXT | Syarat minimum pembelian | |
| catatan | TEXT | Catatan tambahan | |

5.11	STRUKTUR TABEL USER_WASTE_TRACKING

| Field | Tipe Data | Keterangan | Konstrain |
|-------|-----------|------------|-----------|
| tracking_id | INT | ID unik tracking | PK, AUTO_INCREMENT |
| user_id | INT | ID pengguna | FK, NOT NULL |
| waste_id | INT | ID jenis sampah | FK, NOT NULL |
| jumlah | DECIMAL(10,2) | Jumlah | NOT NULL |
| satuan | VARCHAR(20) | Satuan ukuran | NOT NULL |
| tanggal_pencatatan | DATETIME | Tanggal pencatatan | DEFAULT CURRENT_TIMESTAMP |
| status_pengelolaan | ENUM | Status pengelolaan | NOT NULL |
| nilai_estimasi | DECIMAL(10,2) | Estimasi nilai | |

5.12	STRUKTUR TABEL FORUM_THREADS

| Field | Tipe Data | Keterangan | Konstrain |
|-------|-----------|------------|-----------|
| thread_id | INT | ID unik thread | PK, AUTO_INCREMENT |
| user_id | INT | ID pengguna | FK, NOT NULL |
| judul | VARCHAR(100) | Judul thread | NOT NULL |
| konten | TEXT | Konten thread | NOT NULL |
| tanggal_posting | DATETIME | Tanggal posting | DEFAULT CURRENT_TIMESTAMP |
| status | ENUM | Status thread | DEFAULT 'AKTIF' |
| tags | TEXT | Tag thread | |

5.13	STRUKTUR TABEL FORUM_COMMENTS

| Field | Tipe Data | Keterangan | Konstrain |
|-------|-----------|------------|-----------|
| komentar_id | INT | ID unik komentar | PK, AUTO_INCREMENT |
| thread_id | INT | ID thread | FK, NOT NULL |
| user_id | INT | ID pengguna | FK, NOT NULL |
| konten | TEXT | Konten komentar | NOT NULL |
| tanggal_komentar | DATETIME | Tanggal komentar | DEFAULT CURRENT_TIMESTAMP |
| parent_komentar_id | INT | ID komentar induk | FK |

5.14	STRUKTUR TABEL BUSINESS_OPPORTUNITIES

| Field | Tipe Data | Keterangan | Konstrain |
|-------|-----------|------------|-----------|
| peluang_id | INT | ID unik peluang | PK, AUTO_INCREMENT |
| judul | VARCHAR(100) | Judul peluang | NOT NULL |
| deskripsi | TEXT | Deskripsi peluang | NOT NULL |
| kategori | VARCHAR(50) | Kategori peluang | NOT NULL |
| investasi_awal | DECIMAL(12,2) | Investasi awal | |
| potensi_pendapatan | TEXT | Potensi pendapatan | |
| tantangan | TEXT | Tantangan implementasi | |
| saran_implementasi | TEXT | Saran implementasi | |

5.15	STRUKTUR TABEL DELETED_RECORDS

| Field | Tipe Data | Keterangan | Konstrain |
|-------|-----------|------------|-----------|
| deletion_id | INT | ID unik deletion | PK, AUTO_INCREMENT |
| table_name | VARCHAR(50) | Nama tabel | NOT NULL |
| record_id | INT | ID record | NOT NULL |
| record_data | JSON | Data record (JSON) | NOT NULL |
| deletion_date | DATETIME | Tanggal penghapusan | DEFAULT CURRENT_TIMESTAMP |
| user_id | INT | ID pengguna yang menghapus | FK |
| restoration_status | ENUM | Status restorasi | DEFAULT 'NOT_RESTORED' |

5.16	SKEMA RELASI ANTAR TABEL

![Skema Relasi](https://via.placeholder.com/800x600?text=Skema+Relasi+Antar+Tabel)

6	PERANCANGAN ANTARMUKA

6.1	ANTARMUKA BERANDA

Halaman beranda merupakan halaman utama yang ditampilkan setelah pengguna login. Antarmuka ini menampilkan ringkasan informasi penting dan akses cepat ke fitur-fitur utama.

![Mockup Beranda](https://via.placeholder.com/800x600?text=Mockup+Beranda+Revalio)

**Komponen Utama:**
1. Header dengan logo Revalio dan menu navigasi utama
2. Profil singkat pengguna dan notifikasi
3. Dashboard statistik personal yang menampilkan:
   - Total sampah yang telah dikelola
   - Estimasi nilai ekonomis
   - Dampak lingkungan positif (pengurangan emisi CO2)
4. Kartu akses cepat ke fitur utama:
   - Katalog Sampah Bernilai
   - Panduan Daur Ulang & Reuse
   - Tracking Sampah
   - Tips Monetisasi
5. Konten edukasi terbaru
6. Aktivitas komunitas terkini
7. Footer dengan tautan tambahan dan informasi kontak

**Interaksi:**
- Pengguna dapat mengklik kartu fitur untuk navigasi cepat
- Dashboard statistik dapat diexpand untuk melihat detail lebih lengkap
- Konten edukasi terbaru dapat di-scroll horizontal
- Pengguna dapat menyesuaikan widget yang ditampilkan di beranda

6.2	ANTARMUKA KATALOG SAMPAH BERNILAI

Halaman ini menampilkan berbagai jenis sampah yang memiliki nilai ekonomis, dikategorikan untuk memudahkan pencarian.

![Mockup Katalog Sampah](https://via.placeholder.com/800x600?text=Mockup+Katalog+Sampah+Bernilai)

**Komponen Utama:**
1. Header dengan judul halaman dan breadcrumb navigation
2. Panel filter dan pencarian:
   - Dropdown kategori sampah
   - Sorting options (nilai tertinggi, terpopuler, terbaru)
   - Field pencarian
3. Grid view/list view jenis sampah dengan:
   - Gambar representatif
   - Nama sampah
   - Kategori
   - Kisaran nilai ekonomis
   - Indikator tingkat kesulitan pengumpulan/pengolahan
4. Pagination atau infinite scroll
5. Tombol favorit pada setiap item

**Interaksi:**
- Pengguna dapat memfilter dan mencari jenis sampah
- Toggle antara tampilan grid dan list
- Mengklik item untuk melihat detail lengkap
- Menambahkan item ke favorit dengan tombol berbentuk hati
- Sorting dan filtering diproses secara real-time

6.3	ANTARMUKA DETAIL SAMPAH

Halaman ini menampilkan informasi detail tentang jenis sampah tertentu.

![Mockup Detail Sampah](https://via.placeholder.com/800x600?text=Mockup+Detail+Sampah)

**Komponen Utama:**
1. Header dengan nama sampah dan breadcrumb navigation
2. Galeri foto/gambar sampah dengan carousel
3. Informasi umum:
   - Deskripsi lengkap
   - Kategori dan karakteristik
   - Kisaran nilai ekonomis (dengan grafik trend harga)
4. Tab informasi tambahan:
   - Panduan Pengumpulan & Penyimpanan
   - Cara Pengolahan
   - Pembeli Potensial
   - Dampak Lingkungan
5. Tombol aksi:
   - Tambahkan ke Tracking
   - Simpan ke Favorit
   - Bagikan
6. Konten terkait yang mungkin diminati pengguna

**Interaksi:**
- Pengguna dapat menggeser carousel untuk melihat foto/gambar tambahan
- Tab informasi dapat dipilih untuk melihat detail berbeda
- Grafik trend harga dapat diinteraksi untuk melihat nilai pada periode tertentu
- Tombol aksi memberikan feedback visual saat diklik

6.4	ANTARMUKA TRACKING SAMPAH

Halaman ini memungkinkan pengguna mencatat dan melacak sampah yang telah mereka kumpulkan.

![Mockup Tracking Sampah](https://via.placeholder.com/800x600?text=Mockup+Tracking+Sampah)

**Komponen Utama:**
1. Header dengan judul halaman
2. Dashboard dengan grafik dan statistik:
   - Total sampah per kategori (chart pie)
   - Trend pengumpulan sampah (chart line)
   - Estimasi total nilai ekonomis
3. Form pencatatan sampah baru:
   - Dropdown jenis sampah
   - Input jumlah dan satuan
   - Datepicker tanggal pengumpulan
   - Dropdown kondisi
   - Field catatan
   - Upload foto
4. Tabel riwayat pencatatan dengan:
   - Tanggal
   - Jenis sampah
   - Jumlah
   - Nilai estimasi
   - Tombol edit/hapus
5. Filter dan sorting untuk tabel riwayat

**Interaksi:**
- Form pencatatan sampah dapat diexpand/collapse
- Dashboard statistik interaktif dengan hover tooltips
- Tabel riwayat dapat difilter dan disorting
- Edit dan hapus entri dengan konfirmasi
- Upload foto dengan preview

6.5	ANTARMUKA PANDUAN DAUR ULANG & REUSE

Halaman ini menyajikan berbagai tutorial dan panduan tentang cara mendaur ulang atau menggunakan kembali sampah.

![Mockup Panduan Daur Ulang](https://via.placeholder.com/800x600?text=Mockup+Panduan+Daur+Ulang+%26+Reuse)

**Komponen Utama:**
1. Header dengan judul halaman dan breadcrumb navigation
2. Panel filter:
   - Dropdown kategori
   - Filter tingkat kesulitan
   - Filter waktu pengerjaan
   - Checkbox "hanya tampilkan yang belum dicoba"
3. Grid panduan dengan card:
   - Thumbnail hasil akhir
   - Judul
   - Rating pengguna (bintang)
   - Tingkat kesulitan
   - Estimasi waktu
   - Indikator sudah dicoba/belum
4. Pagination
5. Tombol "Unggah Panduan Baru" (untuk pengguna tertentu)

**Interaksi:**
- Pengguna dapat memfilter panduan berdasarkan berbagai kriteria
- Mengklik card untuk melihat detail panduan
- Rating dengan hover effect
- Bookmark panduan favorit

6.6	ANTARMUKA DETAIL PANDUAN

Halaman ini menampilkan langkah-langkah detail dari panduan daur ulang atau reuse.

![Mockup Detail Panduan](https://via.placeholder.com/800x600?text=Mockup+Detail+Panduan)

**Komponen Utama:**
1. Header dengan judul panduan dan breadcrumb
2. Informasi umum:
   - Thumbnail hasil akhir
   - Penulis/kontributor
   - Rating dan jumlah ulasan
   - Tingkat kesulitan
   - Estimasi waktu
3. Bagian "Yang Anda Butuhkan":
   - Daftar bahan dengan gambar
   - Daftar alat dengan gambar
4. Langkah-langkah:
   - Penomoran jelas
   - Deskripsi tekstual
   - Foto/ilustrasi/video untuk setiap langkah
5. Tips dan saran tambahan
6. Bagian komentar dan ulasan
7. Tombol aksi:
   - Tandai sebagai Selesai Dicoba
   - Simpan ke Favorit
   - Bagikan
   - Unduh PDF

**Interaksi:**
- Navigasi langkah-langkah dengan tombol next/prev
- Video tutorial dapat diputar inline
- Gambar dapat diperbesar dengan klik
- Pengguna dapat menandai panduan selesai dicoba dan memberikan rating

6.7	ANTARMUKA FORUM DISKUSI

Halaman ini menyediakan forum diskusi untuk pengguna berinteraksi dan berbagi pengalaman.

![Mockup Forum Diskusi](https://via.placeholder.com/800x600?text=Mockup+Forum+Diskusi)

**Komponen Utama:**
1. Header dengan judul forum
2. Panel filter dan pencarian:
   - Dropdown kategori diskusi
   - Filter berdasarkan popularitas/terbaru
   - Field pencarian
3. Daftar topik diskusi dengan:
   - Judul topik
   - Penulis
   - Jumlah balasan
   - Waktu posting terakhir
   - Tag kategori
4. Tombol "Buat Topik Baru"
5. Sidebar dengan topik populer dan statistik forum

**Interaksi:**
- Pengguna dapat membuat topik baru
- Mengklik topik untuk melihat diskusi lengkap
- Filter dan pencarian untuk menemukan topik spesifik
- Notifikasi untuk balasan baru pada topik yang diikuti

6.8	ANTARMUKA PELUANG USAHA

Halaman ini menampilkan informasi tentang peluang usaha dari pengelolaan sampah.

![Mockup Peluang Usaha](https://via.placeholder.com/800x600?text=Mockup+Peluang+Usaha)

**Komponen Utama:**
1. Header dengan judul halaman
2. Panel filter:
   - Kategori peluang usaha
   - Range investasi awal
   - Tingkat kesulitan
3. Grid peluang usaha dengan card:
   - Judul peluang
   - Gambar ilustrasi
   - Estimasi investasi awal
   - Potensi pendapatan
   - Kategori usaha
4. Pagination

**Interaksi:**
- Filter berdasarkan berbagai kriteria
- Mengklik card untuk melihat detail peluang usaha
- Bookmark peluang yang diminati

7	MATRIKS KETERUNUTAN

Matriks keterunutan menunjukkan hubungan antara kebutuhan fungsional, use case, class, dan antarmuka dalam aplikasi Revalio.

| ID | Kebutuhan Fungsional | Use Case | Tabel Database | Antarmuka |
|----|---------------------|----------|---------------|-----------|
| F1 | Pendaftaran dan otentikasi pengguna | UC-01, UC-02, UC-03, UC-04, UC-05 | users | Halaman Login, Register, Profil |
| F2 | Mempelajari jenis sampah dan nilai ekonomisnya | UC-06, UC-07, UC-11, UC-12, UC-13, UC-14 | waste_types, waste_categories, waste_values | Katalog Sampah Bernilai, Detail Sampah |
| F3 | Tracking volume sampah yang dikelola | UC-19, UC-20, UC-21, UC-22 | user_waste_tracking | Tracking Sampah |
| F4 | Mempelajari panduan daur ulang dan reuse | UC-08 | tutorials, articles | Panduan Daur Ulang & Reuse, Detail Panduan |
| F5 | Mendapatkan tips monetisasi limbah | UC-15, UC-16, UC-17, UC-18 | waste_buyers, waste_buyer_types | Tips Monetisasi |
| F6 | Edukasi dampak lingkungan & peluang usaha | UC-23, UC-24, UC-25, UC-26 | articles, business_opportunities | Peluang Usaha |
| F7 | Berpartisipasi dalam komunitas | UC-27, UC-28, UC-29 | forum_threads, forum_comments | Forum Diskusi |
| F8 | Menerima notifikasi dan update | UC-30 | - | Notifikasi |
| F9 | Administrasi sistem | UC-31, UC-32, UC-33, UC-34 | deleted_records | Admin Dashboard |

### Diagram Keterunutan

![Diagram Keterunutan](https://via.placeholder.com/800x600?text=Diagram+Keterunutan+Revalio)

Matriks keterunutan ini membantu memastikan bahwa semua kebutuhan fungsional terpenuhi oleh use case, tabel database, dan antarmuka yang dirancang, serta mengidentifikasi ketergantungan dan relasi antar komponen sistem.
