-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 15 Bulan Mei 2025 pada 23.46
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `revalio`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `articles`
--

CREATE TABLE `articles` (
  `artikel_id` int(11) NOT NULL,
  `judul` varchar(100) NOT NULL,
  `deskripsi_singkat` text NOT NULL,
  `konten` text NOT NULL,
  `kategori` varchar(50) NOT NULL,
  `penulis_id` int(11) NOT NULL,
  `tanggal_publikasi` datetime NOT NULL,
  `status` enum('PUBLISHED','DRAFT') DEFAULT 'PUBLISHED',
  `gambar_utama` varchar(255) DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `business_opportunities`
--

CREATE TABLE `business_opportunities` (
  `peluang_id` int(11) NOT NULL,
  `judul` varchar(100) NOT NULL,
  `deskripsi` text NOT NULL,
  `kategori` varchar(50) NOT NULL,
  `investasi_awal` decimal(12,2) DEFAULT NULL,
  `potensi_pendapatan` text DEFAULT NULL,
  `tantangan` text DEFAULT NULL,
  `saran_implementasi` text DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `deleted_records`
--

CREATE TABLE `deleted_records` (
  `deletion_id` int(11) NOT NULL,
  `table_name` varchar(50) NOT NULL,
  `record_id` int(11) NOT NULL,
  `record_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`record_data`)),
  `deletion_date` datetime DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  `restoration_status` enum('NOT_RESTORED','RESTORED') DEFAULT 'NOT_RESTORED',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `forum_comments`
--

CREATE TABLE `forum_comments` (
  `komentar_id` int(11) NOT NULL,
  `thread_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `konten` text NOT NULL,
  `tanggal_komentar` datetime DEFAULT current_timestamp(),
  `parent_komentar_id` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `forum_threads`
--

CREATE TABLE `forum_threads` (
  `thread_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `judul` varchar(100) NOT NULL,
  `konten` text NOT NULL,
  `tanggal_posting` datetime DEFAULT current_timestamp(),
  `status` enum('AKTIF','NONAKTIF') DEFAULT 'AKTIF',
  `tags` text DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tutorials`
--

CREATE TABLE `tutorials` (
  `tutorial_id` int(11) NOT NULL,
  `waste_id` int(11) DEFAULT NULL,
  `judul` varchar(100) NOT NULL,
  `deskripsi` text NOT NULL,
  `jenis_tutorial` enum('daur ulang','reuse') NOT NULL,
  `konten` text NOT NULL,
  `media` text DEFAULT NULL,
  `tingkat_kesulitan` enum('VERY_EASY','EASY','MODERATE','DIFFICULT','VERY_DIFFICULT') NOT NULL,
  `estimasi_waktu` int(11) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','MODERATOR','USER') DEFAULT 'USER',
  `no_telepon` varchar(20) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `foto_profil` varchar(255) DEFAULT NULL,
  `tanggal_registrasi` datetime DEFAULT current_timestamp(),
  `status_akun` enum('AKTIF','NONAKTIF') DEFAULT 'AKTIF',
  `preferensi_sampah` text DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_waste_tracking`
--

CREATE TABLE `user_waste_tracking` (
  `tracking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `waste_id` int(11) NOT NULL,
  `jumlah` decimal(10,2) NOT NULL,
  `satuan` varchar(20) NOT NULL,
  `tanggal_pencatatan` datetime DEFAULT current_timestamp(),
  `status_pengelolaan` enum('disimpan','dijual','didaur ulang') NOT NULL,
  `nilai_estimasi` decimal(10,2) DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `waste_buyers`
--

CREATE TABLE `waste_buyers` (
  `pembeli_id` int(11) NOT NULL,
  `nama_pembeli` varchar(100) NOT NULL,
  `jenis_pembeli` enum('bank sampah','pengepul','pabrik') NOT NULL,
  `alamat` text NOT NULL,
  `kontak` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `jam_operasional` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `waste_buyer_types`
--

CREATE TABLE `waste_buyer_types` (
  `id` int(11) NOT NULL,
  `pembeli_id` int(11) NOT NULL,
  `waste_id` int(11) NOT NULL,
  `harga_beli` decimal(10,2) DEFAULT NULL,
  `syarat_minimum` text DEFAULT NULL,
  `catatan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `waste_categories`
--

CREATE TABLE `waste_categories` (
  `kategori_id` int(11) NOT NULL,
  `nama_kategori` varchar(50) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `ikon` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `waste_categories`
--

INSERT INTO `waste_categories` (`kategori_id`, `nama_kategori`, `deskripsi`, `ikon`) VALUES
(1, 'Plastik', 'Plastik adalah sampah yang paling umum dan sulit terurai, bisa bertahan ratusan tahun di alam. Jenisnya beragam seperti PET dan HDPE, ditemukan pada botol, kantong, dan kemasan. Plastik dapat didaur ulang menjadi biji plastik atau kerajinan, namun tidak semua jenis bisa diproses ulang. Pemilahan yang benar penting untuk mencegah pencemaran dan dampak berbahaya dari pembakaran.', '🥤'),
(2, 'Kertas', 'Kertas merupakan salah satu jenis sampah yang mudah didaur ulang, seperti koran, majalah, kardus, dan buku bekas. Sampah kertas dapat diolah kembali menjadi produk baru seperti tisu, karton, atau kertas daur ulang, sehingga membantu mengurangi penebangan pohon dan limbah di lingkungan.', '📄'),
(3, 'Besi', 'Besi adalah logam yang kuat dan berat, sering digunakan untuk konstruksi bangunan, alat berat, pipa, dan berbagai peralatan rumah tangga. Besi mudah berkarat jika terkena air dan udara, sehingga biasanya dilapisi agar lebih tahan lama. Besi juga dapat didaur ulang dan menjadi salah satu bahan utama dalam industri daur ulang logam.', '🔧'),
(4, 'Aluminium', 'Aluminium adalah logam ringan yang mudah didaur ulang dan banyak digunakan untuk kaleng minuman, aluminium foil, peralatan dapur, dan bingkai jendela. Karena sifatnya yang tahan karat dan kuat, aluminium sering dipakai dalam berbagai produk sehari-hari dan dapat didaur ulang berulang kali tanpa mengurangi kualitasnya.', '💿'),
(5, 'Elektronik', 'Sampah elektronik meliputi perangkat seperti komputer, ponsel, dan peralatan elektronik rumah tangga yang sudah tidak terpakai. Karena mengandung bahan berbahaya dan komponen berharga seperti logam langka, sampah ini harus diproses dengan hati-hati agar tidak mencemari lingkungan dan bisa didaur ulang kembali.', '💻');

-- --------------------------------------------------------

--
-- Struktur dari tabel `waste_types`
--

CREATE TABLE `waste_types` (
  `waste_id` int(11) NOT NULL,
  `nama_sampah` varchar(100) NOT NULL,
  `kategori_id` int(11) NOT NULL,
  `deskripsi` text NOT NULL,
  `cara_sortir` text DEFAULT NULL,
  `cara_penyimpanan` text DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `status_aktif` tinyint(1) DEFAULT 1,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `waste_types`
--

INSERT INTO `waste_types` (`waste_id`, `nama_sampah`, `kategori_id`, `deskripsi`, `cara_sortir`, `cara_penyimpanan`, `gambar`, `status_aktif`, `updated_at`) VALUES
(1, 'Botol Plastik', 1, 'Botol plastik adalah wadah yang terbuat dari bahan plastik ringan dan tahan lama, biasa digunakan untuk menyimpan minuman atau cairan lainnya. Botol ini mudah didaur ulang jika dipisahkan dengan benar, namun jika dibuang sembarangan, dapat mencemari lingkungan karena butuh waktu lama untuk terurai secara alami.', 'Buka tutup, lepaskan cincin pada leher botol, lepas label plastik pada botol, remas botol.', 'botol yang sudah diremas disusun kedalam karung hingga padat lalu diikat', 'botol-plastik.jpeg', 1, NULL),
(2, 'Kardus / Karton', 2, 'Kardus atau karton merupakan jenis sampah kering yang terbuat dari serat kayu atau kertas berlapis. Umumnya digunakan sebagai kemasan barang atau kotak pengiriman. Kardus dapat didaur ulang dengan mudah dan memiliki nilai ekonomis yang cukup baik jika dalam kondisi bersih dan kering.', 'lepas lakban/isolasi pada kardus, lalu buka semua bagian kardus hingga bisa dilipat menjadi 1 lapisan', 'ukuran kardus disamaain atau juga bisa tanpa memandang ukuran lalu ditumpuk hingga batas maximal bisa dibawa lalu diikat menggunakan tali', 'kardus.jpg', 1, NULL),
(3, 'Kaleng Minuman', 4, 'Kaleng minuman adalah jenis sampah anorganik yang umumnya terbuat dari aluminium atau baja tipis, mudah didaur ulang, dan memiliki nilai ekonomis tinggi. Dalam pengolahan sampah, kaleng minuman dikumpulkan, dibersihkan, lalu dilebur untuk dijadikan bahan baku produk baru seperti kaleng baru, peralatan dapur, atau komponen industri lainnya.', 'Kaleng ditegakkan/didirikan, lalu diinjak sampai gepeng.', 'kaleng yang sudah gepeng dimasukkan dalam karung/plastik lalu diikat.', 'kaleng.jpeg', 1, NULL),
(4, 'Besi Ringan / Besi Campur', 3, 'Besi ringan adalah jenis logam yang memiliki bobot lebih ringan dibanding besi biasa, biasanya terbuat dari campuran bahan yang kuat namun ringan.', 'Pastikan hanya besi yang tersisa.Jika besi panjang, maka susun besi nya lalu ikat bagian ujung atas dan bawah. jika besi nya kecil, maka masukkan dalam karung lalu diikat.', 'ikatan besi dan karung besi disimpan digudang dan tidak terkena air karena dapat menimbulkan bau', 'besi-campur.jpg', 1, NULL),
(5, 'Besi', 3, 'Besi adalah jenis limbah logam yang bisa dikumpulkan, dipilah, dan didaur ulang menjadi bahan baku baru. Besi biasanya berasal dari barang bekas seperti pipa, jeruji, peralatan rumah tangga, atau sisa konstruksi. Karena sifatnya yang kuat dan tahan lama, besi memiliki nilai jual yang cukup tinggi setelah proses pemilahan dan pengolahan, sehingga membantu mengurangi penumpukan limbah logam di lingkungan.', 'Pastikan besi. jika besi panjang, maka disusun lalu diikat bagian atas dan bawahnya. jika besi pendek dan berat, masukkan ke karung dengan berat yang wajar.', 'ikatan besi dan karung disimpan ditempat yang aman dan terhindar dari hujan atau air', 'besi.jpg', 1, NULL),
(6, 'Kertas HVS', 2, 'Buku / kertas adalah limbah organik yang berasal dari bahan serat kayu atau pulp yang digunakan untuk mencetak, menulis,', 'Buku berwarna putih. lepaskan sampul dari kertas buku dan tersisa bagian putihnya saja, lalu kertas putih ditumpuk lalu diikat. Bisa juga langsung dimasukkan ke karung lalu diikat.', 'Simpan diarea yang aman dan terhindar dari hewan seperti tikus dan kucing. Buku juga diharapkan tidak basah', NULL, 1, NULL),
(7, 'Kertas Koran', 2, 'Kertas koran adalah kertas yang berwarna hitam-coklat dan coklat atau mendekati keduanya. biasanya kertas ini adalah koran, buku LKS, dan buku yang kertasnya berwarna coklat lainnya. ', 'untuk buku, lepaskan sampul dari kertas buku dan tersisa bagian isinya saja, lalu kertas koran ditumpuk lalu diikat. Bisa juga langsung dimasukkan ke karung lalu diikat.', 'Simpan diarea yang aman dan terhindar dari hewan seperti tikus dan kucing. Buku juga diharapkan tidak basah', 'kertas-koran.jpg', 1, NULL),
(8, 'Kertas Warna', 2, 'Kertas warna adalah kertas yang berwarna-warni diluar putih dan coklat biasanya kertas ini adalah brosur, buku paket, dan buku yang kertasnya berwarna warni lainnya. ', 'untuk buku, lepaskan sampul dari kertas buku dan tersisa bagian isinya saja, lalu kertas warna ditumpuk lalu diikat. Bisa juga langsung dimasukkan ke karung lalu diikat.', 'Simpan diarea yang aman dan terhindar dari hewan seperti tikus dan kucing. Buku juga diharapkan tidak basah', 'buku.jpeg', 1, NULL),
(9, 'Sampul Buku / Padat', 2, 'Sampul sampul buku dan karton yang sangat tipis seperti kotak jajanan', 'dilipat atau dimasukkan langsung ke karung lalu diikat.', 'Simpan diarea yang aman dan terhindar dari hewan seperti tikus dan kucing. Buku juga diharapkan tidak basah', 'sampul-buku.jpg', 1, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `waste_values`
--

CREATE TABLE `waste_values` (
  `nilai_id` int(11) NOT NULL,
  `waste_id` int(11) NOT NULL,
  `harga_minimum` decimal(10,2) NOT NULL,
  `harga_maksimum` decimal(10,2) NOT NULL,
  `satuan` varchar(20) NOT NULL,
  `tanggal_update` datetime DEFAULT current_timestamp(),
  `sumber_data` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `waste_values`
--

INSERT INTO `waste_values` (`nilai_id`, `waste_id`, `harga_minimum`, `harga_maksimum`, `satuan`, `tanggal_update`, `sumber_data`) VALUES
(1, 1, 1000.00, 4000.00, 'kg', '2025-05-16 03:48:55', NULL),
(2, 2, 800.00, 2000.00, 'kg', '2025-05-16 04:01:13', NULL),
(3, 3, 12000.00, 18000.00, 'kg', '2025-05-16 04:01:13', NULL),
(4, 4, 1500.00, 2500.00, 'kg', '2025-05-16 04:45:28', NULL),
(5, 5, 2000.00, 5000.00, 'kg', '2025-05-16 04:45:28', NULL),
(6, 6, 1000.00, 2500.00, 'kg', '2025-05-16 04:45:28', NULL),
(7, 7, 800.00, 2000.00, 'kg', '2025-05-16 04:45:28', NULL),
(8, 8, 800.00, 1500.00, 'kg', '2025-05-16 04:45:28', NULL),
(9, 9, 300.00, 1000.00, 'kg', '2025-05-16 04:45:28', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`artikel_id`),
  ADD KEY `idx_penulis_id` (`penulis_id`),
  ADD KEY `idx_kategori` (`kategori`),
  ADD KEY `idx_tanggal_publikasi` (`tanggal_publikasi`);
ALTER TABLE `articles` ADD FULLTEXT KEY `ft_article_content` (`judul`,`deskripsi_singkat`,`konten`);

--
-- Indeks untuk tabel `business_opportunities`
--
ALTER TABLE `business_opportunities`
  ADD PRIMARY KEY (`peluang_id`),
  ADD KEY `idx_kategori` (`kategori`);

--
-- Indeks untuk tabel `deleted_records`
--
ALTER TABLE `deleted_records`
  ADD PRIMARY KEY (`deletion_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_table_record` (`table_name`,`record_id`);

--
-- Indeks untuk tabel `forum_comments`
--
ALTER TABLE `forum_comments`
  ADD PRIMARY KEY (`komentar_id`),
  ADD KEY `idx_thread_id` (`thread_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_parent_komentar_id` (`parent_komentar_id`);

--
-- Indeks untuk tabel `forum_threads`
--
ALTER TABLE `forum_threads`
  ADD PRIMARY KEY (`thread_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_tanggal_posting` (`tanggal_posting`);
ALTER TABLE `forum_threads` ADD FULLTEXT KEY `ft_thread_content` (`judul`,`konten`);

--
-- Indeks untuk tabel `tutorials`
--
ALTER TABLE `tutorials`
  ADD PRIMARY KEY (`tutorial_id`),
  ADD KEY `idx_waste_id` (`waste_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- Indeks untuk tabel `user_waste_tracking`
--
ALTER TABLE `user_waste_tracking`
  ADD PRIMARY KEY (`tracking_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_waste_id` (`waste_id`),
  ADD KEY `idx_tanggal_pencatatan` (`tanggal_pencatatan`);

--
-- Indeks untuk tabel `waste_buyers`
--
ALTER TABLE `waste_buyers`
  ADD PRIMARY KEY (`pembeli_id`);

--
-- Indeks untuk tabel `waste_buyer_types`
--
ALTER TABLE `waste_buyer_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pembeli_id` (`pembeli_id`),
  ADD KEY `idx_waste_id` (`waste_id`);

--
-- Indeks untuk tabel `waste_categories`
--
ALTER TABLE `waste_categories`
  ADD PRIMARY KEY (`kategori_id`),
  ADD UNIQUE KEY `nama_kategori` (`nama_kategori`);

--
-- Indeks untuk tabel `waste_types`
--
ALTER TABLE `waste_types`
  ADD PRIMARY KEY (`waste_id`),
  ADD KEY `idx_kategori_id` (`kategori_id`);

--
-- Indeks untuk tabel `waste_values`
--
ALTER TABLE `waste_values`
  ADD PRIMARY KEY (`nilai_id`),
  ADD KEY `idx_waste_id` (`waste_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `articles`
--
ALTER TABLE `articles`
  MODIFY `artikel_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `business_opportunities`
--
ALTER TABLE `business_opportunities`
  MODIFY `peluang_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `deleted_records`
--
ALTER TABLE `deleted_records`
  MODIFY `deletion_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `forum_comments`
--
ALTER TABLE `forum_comments`
  MODIFY `komentar_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `forum_threads`
--
ALTER TABLE `forum_threads`
  MODIFY `thread_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tutorials`
--
ALTER TABLE `tutorials`
  MODIFY `tutorial_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `user_waste_tracking`
--
ALTER TABLE `user_waste_tracking`
  MODIFY `tracking_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `waste_buyers`
--
ALTER TABLE `waste_buyers`
  MODIFY `pembeli_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `waste_buyer_types`
--
ALTER TABLE `waste_buyer_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `waste_categories`
--
ALTER TABLE `waste_categories`
  MODIFY `kategori_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `waste_types`
--
ALTER TABLE `waste_types`
  MODIFY `waste_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `waste_values`
--
ALTER TABLE `waste_values`
  MODIFY `nilai_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`penulis_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `deleted_records`
--
ALTER TABLE `deleted_records`
  ADD CONSTRAINT `deleted_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `forum_comments`
--
ALTER TABLE `forum_comments`
  ADD CONSTRAINT `forum_comments_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `forum_threads` (`thread_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `forum_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `forum_comments_ibfk_3` FOREIGN KEY (`parent_komentar_id`) REFERENCES `forum_comments` (`komentar_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `forum_threads`
--
ALTER TABLE `forum_threads`
  ADD CONSTRAINT `forum_threads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `tutorials`
--
ALTER TABLE `tutorials`
  ADD CONSTRAINT `tutorials_ibfk_1` FOREIGN KEY (`waste_id`) REFERENCES `waste_types` (`waste_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user_waste_tracking`
--
ALTER TABLE `user_waste_tracking`
  ADD CONSTRAINT `user_waste_tracking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_waste_tracking_ibfk_2` FOREIGN KEY (`waste_id`) REFERENCES `waste_types` (`waste_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `waste_buyer_types`
--
ALTER TABLE `waste_buyer_types`
  ADD CONSTRAINT `waste_buyer_types_ibfk_1` FOREIGN KEY (`pembeli_id`) REFERENCES `waste_buyers` (`pembeli_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `waste_buyer_types_ibfk_2` FOREIGN KEY (`waste_id`) REFERENCES `waste_types` (`waste_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `waste_types`
--
ALTER TABLE `waste_types`
  ADD CONSTRAINT `waste_types_ibfk_1` FOREIGN KEY (`kategori_id`) REFERENCES `waste_categories` (`kategori_id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `waste_values`
--
ALTER TABLE `waste_values`
  ADD CONSTRAINT `waste_values_ibfk_1` FOREIGN KEY (`waste_id`) REFERENCES `waste_types` (`waste_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
