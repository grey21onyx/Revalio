resources/
├── css/
│   └── app.css                    # Styles global dan overrides
├── js/
│   ├── components/                # Komponen reusable umum
│   │   ├── common/                # Komponen dasar UI
│   │   ├── layout/                # Komponen layout (header, footer)
│   │   └── ui/                    # Komponen UI khusus aplikasi
│   ├── hooks/                     # Custom hooks global
│   ├── pages/                     # Halaman-halaman utama
│   ├── routes/                    # Konfigurasi routing
│   ├── store/                     # Redux store & slices
│   ├── theme/                     # Konfigurasi tema Material-UI
│   ├── utils/                     # Fungsi-fungsi helper
│   ├── config/                    # Konfigurasi aplikasi
│   ├── App.jsx                    # Komponen root
│   └── index.js                   # Entry point
└── views/                         # Blade templates (jika menggunakan Laravel)

# Struktur Aplikasi Daur Ulang Sampah

## Halaman yang Perlu Dibuat
- **Halaman Autentikasi**
  - Login
  - Register
- **Beranda/Dashboard**
- **Katalog Sampah Bernilai**
  - Detail Sampah
- **Tracking Sampah**
- **Panduan Daur Ulang & Reuse**
  - Detail Panduan
- **Forum Diskusi**
  - Detail Thread Forum
- **Profil Pengguna**

## Alur Pengembangan

### 1. Setup Awal & Infrastruktur:
- Setup project dengan React, Material-UI, Redux, Tailwind CSS, GSAP
- Konfigurasi routing, Redux store, dan tema

### 2. Komponen Dasar:
- Buat komponen-komponen dasar UI (Button, Card, Input)
- Buat layout aplikasi (Header, Footer, Sidebar)

### 3. Halaman Autentikasi:
- Login dan Register Page

### 4. Beranda & Layout Utama:
- Dashboard dengan navigasi dan statistik
- Komponen shared (SearchBar, NotificationBar)

### 5. Katalog & Detail Sampah:
- Halaman katalog dengan filter dan search
- Halaman detail sampah dengan informasi dan nilai ekonomis

### 6. Tracking Sampah:
- Form pencatatan dan visualisasi statistik

### 7. Panduan Daur Ulang:
- Daftar tutorial dan detail panduan

### 8. Forum Diskusi:
- Daftar thread dan halaman detail diskusi



### 10. Profil Pengguna:
- Halaman profil dan pengaturan

### 11. Optimasi & Pengujian:
- Performance dan responsive design

## Prinsip-prinsip Pengembangan
- **Kesederhanaan**: Hindari folder terlalu dalam (max 2-3 levels)
- **Reusabilitas**: Komponen umum di components/, spesifik di features/[fitur]/components/
- **Pemisahan Logika**: Pisahkan logika bisnis dari UI dengan hooks dan Redux
- **Vertical Development**: Selesaikan satu fitur sebelum pindah ke fitur berikutnya
- **Absolute Imports**: Hindari import paths yang rumit
