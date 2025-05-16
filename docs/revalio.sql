-- =====================================================
-- Revalio Database Schema
-- Generated from SKPPL_Revalio.md
-- Version 2.0: Added CHARSET, COLLATE, ENGINE, INDEXes, and ON DELETE/UPDATE actions
-- =====================================================

-- Tabel: users
-- Menyimpan data pengguna
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','MODERATOR','USER') DEFAULT 'USER',
    no_telepon VARCHAR(20),
    alamat TEXT,
    foto_profil VARCHAR(255),
    tanggal_registrasi DATETIME DEFAULT CURRENT_TIMESTAMP,
    status_akun ENUM('AKTIF','NONAKTIF') DEFAULT 'AKTIF',
    preferensi_sampah TEXT,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email) -- Index for login
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: waste_categories
-- Menyimpan kategori sampah
CREATE TABLE waste_categories (
    kategori_id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(50) NOT NULL UNIQUE,
    deskripsi TEXT,
    ikon VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: waste_types
-- Menyimpan informasi jenis-jenis sampah
CREATE TABLE waste_types (
    waste_id INT AUTO_INCREMENT PRIMARY KEY,
    nama_sampah VARCHAR(100) NOT NULL,
    kategori_id INT NOT NULL,
    deskripsi TEXT NOT NULL,
    cara_sortir TEXT,
    cara_penyimpanan TEXT,
    gambar VARCHAR(255),
    status_aktif BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_kategori_id (kategori_id),
    FOREIGN KEY (kategori_id) REFERENCES waste_categories(kategori_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: waste_values
-- Menyimpan nilai ekonomis sampah
CREATE TABLE waste_values (
    nilai_id INT AUTO_INCREMENT PRIMARY KEY,
    waste_id INT NOT NULL,
    harga_minimum DECIMAL(10,2) NOT NULL,
    harga_maksimum DECIMAL(10,2) NOT NULL,
    satuan VARCHAR(20) NOT NULL,
    tanggal_update DATETIME DEFAULT CURRENT_TIMESTAMP,
    sumber_data VARCHAR(100),
    INDEX idx_waste_id (waste_id),
    FOREIGN KEY (waste_id) REFERENCES waste_types(waste_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: tutorials
-- Menyimpan panduan pengelolaan sampah
CREATE TABLE tutorials (
    tutorial_id INT AUTO_INCREMENT PRIMARY KEY,
    waste_id INT,
    judul VARCHAR(100) NOT NULL,
    deskripsi TEXT NOT NULL,
    jenis_tutorial ENUM('daur ulang','reuse') NOT NULL,
    konten TEXT NOT NULL,
    media TEXT,
    tingkat_kesulitan ENUM('VERY_EASY','EASY','MODERATE','DIFFICULT','VERY_DIFFICULT') NOT NULL,
    estimasi_waktu INT NOT NULL, -- dalam menit
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_waste_id (waste_id),
    FOREIGN KEY (waste_id) REFERENCES waste_types(waste_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: articles
-- Menyimpan artikel edukasi
CREATE TABLE articles (
    artikel_id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(100) NOT NULL,
    deskripsi_singkat TEXT NOT NULL,
    konten TEXT NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    penulis_id INT NOT NULL,
    tanggal_publikasi DATETIME NOT NULL,
    status ENUM('PUBLISHED','DRAFT') DEFAULT 'PUBLISHED',
    gambar_utama VARCHAR(255),
    tags TEXT,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_penulis_id (penulis_id),
    INDEX idx_kategori (kategori),
    INDEX idx_tanggal_publikasi (tanggal_publikasi),
    FULLTEXT INDEX ft_article_content (judul, deskripsi_singkat, konten),
    FOREIGN KEY (penulis_id) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: waste_buyers
-- Menyimpan informasi pembeli sampah
CREATE TABLE waste_buyers (
    pembeli_id INT AUTO_INCREMENT PRIMARY KEY,
    nama_pembeli VARCHAR(100) NOT NULL,
    jenis_pembeli ENUM('bank sampah','pengepul','pabrik') NOT NULL,
    alamat TEXT NOT NULL,
    kontak VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    website VARCHAR(255),
    jam_operasional TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: waste_buyer_types
-- Menyimpan relasi pembeli-sampah (jenis sampah apa yang dibeli oleh siapa)
CREATE TABLE waste_buyer_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pembeli_id INT NOT NULL,
    waste_id INT NOT NULL,
    harga_beli DECIMAL(10,2),
    syarat_minimum TEXT,
    catatan TEXT,
    INDEX idx_pembeli_id (pembeli_id),
    INDEX idx_waste_id (waste_id),
    FOREIGN KEY (pembeli_id) REFERENCES waste_buyers(pembeli_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (waste_id) REFERENCES waste_types(waste_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: user_waste_tracking
-- Menyimpan catatan sampah yang dikelola pengguna
CREATE TABLE user_waste_tracking (
    tracking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    waste_id INT NOT NULL,
    jumlah DECIMAL(10,2) NOT NULL,
    satuan VARCHAR(20) NOT NULL,
    tanggal_pencatatan DATETIME DEFAULT CURRENT_TIMESTAMP,
    status_pengelolaan ENUM('disimpan','dijual','didaur ulang') NOT NULL,
    nilai_estimasi DECIMAL(10,2),
    catatan TEXT,
    foto VARCHAR(255),
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_waste_id (waste_id),
    INDEX idx_tanggal_pencatatan (tanggal_pencatatan),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (waste_id) REFERENCES waste_types(waste_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: forum_threads
-- Menyimpan thread forum diskusi
CREATE TABLE forum_threads (
    thread_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    judul VARCHAR(100) NOT NULL,
    konten TEXT NOT NULL,
    tanggal_posting DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('AKTIF','NONAKTIF') DEFAULT 'AKTIF',
    tags TEXT,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FULLTEXT INDEX ft_thread_content (judul, konten),
    INDEX idx_user_id (user_id),
    INDEX idx_tanggal_posting (tanggal_posting),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: forum_comments
-- Menyimpan komentar forum
CREATE TABLE forum_comments (
    komentar_id INT AUTO_INCREMENT PRIMARY KEY,
    thread_id INT NOT NULL,
    user_id INT NOT NULL,
    konten TEXT NOT NULL,
    tanggal_komentar DATETIME DEFAULT CURRENT_TIMESTAMP,
    parent_komentar_id INT,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_thread_id (thread_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_komentar_id (parent_komentar_id),
    FOREIGN KEY (thread_id) REFERENCES forum_threads(thread_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (parent_komentar_id) REFERENCES forum_comments(komentar_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: business_opportunities
-- Menyimpan informasi peluang usaha
CREATE TABLE business_opportunities (
    peluang_id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(100) NOT NULL,
    deskripsi TEXT NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    investasi_awal DECIMAL(12,2),
    potensi_pendapatan TEXT,
    tantangan TEXT,
    saran_implementasi TEXT,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_kategori (kategori)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: deleted_records
-- Menyimpan catatan yang telah dihapus (recycle bin)
CREATE TABLE deleted_records (
    deletion_id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL, -- ID dari record yang dihapus di tabel aslinya
    record_data JSON NOT NULL,
    deletion_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT, -- User yang melakukan penghapusan
    restoration_status ENUM('NOT_RESTORED','RESTORED') DEFAULT 'NOT_RESTORED',
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_table_record (table_name, record_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
