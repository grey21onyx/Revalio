# Rencana Pengembangan Proyek (RPP) Revalio

## Informasi Proyek

| Informasi | Detail |
|-----------|--------|
| Nomor ID | - |
| Pengusul Proyek | Olivia |
| Manajer proyek | Supardianto |
| Judul Proyek | Revalio - Platform Edukasi Pengelolaan Sampah Bernilai Ekonomis |
| Luaran | Website  |
| Sponsor |  (Potensial) |
| Biaya | (estimasi) |
| Klien/Pelanggan | Masyarakat Umum dan Pelaku UMKM |
| Waktu | - |

## Deskripsi Proyek

Revalio adalah platform edukasi digital yang membantu masyarakat memahami cara mengelola sampah rumah tangga dan industri ringan—seperti besi tua, kardus, kaleng, botol plastik, dan limbah lainnya—agar bisa memiliki nilai ekonomis.

Aplikasi ini tidak berfungsi sebagai tempat jual beli, melainkan sebagai panduan interaktif, tool manajemen, dan sumber informasi terpercaya dalam proses:
- Klasifikasi dan Sortir Sampah
- Panduan Daur Ulang & Reuse
- Tips Monetisasi Limbah (cara menjual, siapa yang beli, dll.)
- Tracking Volume Sampah
- Edukasi tentang Dampak Lingkungan & Peluang Usaha

Dengan Revalio, pengguna akan dibimbing secara digital untuk:
- Mengetahui jenis-jenis sampah yang bisa diolah dan dijual
- Memahami nilai dari setiap limbah
- Mencari tahu bagaimana mengemas, menyimpan, dan memasarkan limbah tersebut dengan benar

## Ruang lingkup

Pengembangan aplikasi website Revalio difokuskan pada penyediaan fitur-fitur edukatif dan fungsional yang mendukung pengelolaan sampah secara mandiri oleh masyarakat. Aplikasi ini menampilkan informasi klasifikasi sampah, meliputi sampah organik, sampah anorganik, dan bahan berbahaya beracun (B3), serta menyajikan nilai ekonomis dari setiap jenis sampah. Tujuannya adalah memberikan pemahaman menyeluruh mengenai potensi daur ulang dan nilai jual dari masing-masing kategori sampah.

Revalio dilengkapi dengan fitur peta lokasi pengepul besi tua dan bank sampah yang terhubung dengan sistem GPS browser dan dukungan pencarian manual. Pengguna dapat menyimpan lokasi pengepul sebagai favorit untuk kemudahan akses di masa mendatang. Selain itu, pengguna dapat mencatat aktivitas pengumpulan sampah secara pribadi melalui fitur tracker yang menyimpan data jenis, berat, dan waktu pengumpulan. Statistik disajikan secara visual dalam bentuk grafik harian, mingguan, dan bulanan.

Pada aspek edukasi, Revalio menyajikan artikel, tips praktis, infografis, dan konten multimedia yang membahas isu lingkungan dan penerapan gaya hidup berkelanjutan. Fitur kalkulator sampah disediakan untuk menghitung nilai ekonomis dari sampah yang dikumpulkan berdasarkan berat dan jenisnya secara real-time. Sistem ini membantu pengguna memahami dampak konkret dari aktivitas daur ulang mereka.

Setiap pengguna memiliki halaman profil yang menampilkan data pribadi, riwayat pengumpulan sampah, pencapaian, dan sertifikat digital sebagai bentuk penghargaan atas kontribusi lingkungan. Revalio dirancang sepenuhnya sebagai aplikasi website yang dapat diakses melalui perangkat desktop dan mobile, serta memiliki antarmuka yang responsif.

Dengan cakupan pengembangan ini, Revalio hadir sebagai platform digital yang menggabungkan edukasi, pelacakan aksi nyata, dan partisipasi masyarakat dalam satu sistem terintegrasi untuk mendukung gerakan pengelolaan sampah yang berkelanjutan.

## Tujuan dan Sasaran

### Tujuan Utama
- Meningkatkan kesadaran dan pengetahuan masyarakat tentang pengelolaan sampah bernilai ekonomis
- Memfasilitasi perubahan perilaku dalam pengelolaan sampah rumah tangga dan industri ringan
- Memberikan akses mudah ke informasi tentang pengolahan sampah dan lokasi pengepul

## Desain Umum

**Gambar 1. Gambaran Umum Sistem** (Gambar belum tersedia)

Aplikasi yang akan dibangun adalah aplikasi berbasis website, yang dimana aplikasi tersebut tersedia dengan tampilan responsif untuk berbagai device termasuk desktop dan smartphone. Adapun fitur yang akan dibangun, yaitu:

- Register dan Login dengan verifikasi email
- Panduan Jenis Sampah (kategorisasi, nilai ekonomis, cara pengolahan)
- Peta Lokasi Penjual / Pengepul Besi Tua Terdekat dengan sistem GPS
- Manajemen Pengumpulan Sampah (tracker volume, jenis, dan waktu)
- Tips & Artikel Edukatif tentang pengelolaan sampah dan peluang usaha
- Kalkulator Nilai Ekonomis Sampah berdasarkan jenis dan berat
- Bookmark Pengepul Favorit
- Dashboard statistik pribadi dengan visualisasi data
- Sistem Pencapaian (achievement) dan sertifikat digital
- Pusat Bantuan (Help Center)

## Teknologi yang Digunakan

### Front-End
- HTML5, CSS3, JavaScript
- Framework: React.js
- Library UI: Bootstrap 5
- Maps API: Google Maps API

### Back-End
- PHP dengan Framework Laravel
- RESTful API untuk komunikasi dengan front-end
- NodeJS untuk fitur realtime (opsional)

### Database
- MySQL 

### Deployment & Hosting
- GitHub untuk version control

## Konstruksi Produk

**Gambar 2. Metode Waterfall** (Gambar belum tersedia)

Produk akan dikembangkan dengan pendekatan metode waterfall. Urutan dalam metode waterfall bersifat serial yang dimulai dari proses requirement analysis, system design, implementation, testing, deployment dan maintenance.

### Detail Proses Pengembangan
1. **Requirement Analysis (3 minggu)**
   - Wawancara dengan stakeholder
   - Pengumpulan data jenis sampah dan nilainya
   - Pemetaan awal pengepul sampah potensial
   - Finalisasi spesifikasi kebutuhan

2. **System Design (3 minggu)**
   - Perancangan arsitektur aplikasi
   - Desain database dan relasi
   - Wireframing dan mockup UI/UX
   - Desain API dan integrasi sistem

3. **Implementation (6 minggu)**
   - Pengembangan front-end (3 minggu)
   - Pengembangan back-end (4 minggu)
   - Integrasi sistem (2 minggu)
   - Pengembangan berlangsung paralel dengan overlap

4. **Testing (1 minggu)**
   - Unit testing
   - Integration testing
   - User acceptance testing
   - Performance testing

5. **Deployment (1 minggu)**
   - Setup server dan konfigurasi
   - Deployment aplikasi
   - Monitoring awal

## Kebutuhan Peralatan/Perangkat dan Bahan/Komponen

| Fase/Proses | Peralatan/Perangkat (SW/HW) |  |  | Bahan/Komponen |  |  |
|-------------|------------------------------|---------|---------|-----------------|---------|---------|
|  | Nama | Jumlah | Catatan | Nama | Jumlah | Catatan |
| Requirement Analysis | PC Windows 11 | 1 | HW |  |  |  |
|  | Microsoft Word | 1 | SW |  |  |  |
|  | Microsoft Powerpoint |  |  |  |  |  |
|  | Zoom / Google Meet | 1 | SW |  |  |  |
|  | Akses Internet | 1 | HW/SW |  |  |  |
| System Design | PC Windows 10 | 1 | HW |  |  |  |
|  | Microsoft Word | 1 | SW |  |  |  |
|  | Microsoft Powerpoint | 1 | SW |  |  |  |
|  | Figma, draw.io | 1 | SW |  |  |  |
|  | Zoom / Google meet | 1 | SW |  |  |  |
|  | Akses Internet | 1 | HW/SW |  |  |  |
| Implementation | PC Windows 10 | 1 | HW |  |  |  |
|  | XAMPP | 1 | SW |  |  |  |
|  | Visual Studio Code / Sublime Text / Code editor lainnya | 1 | SW |  |  |  |
|  | Node.js dan npm | 1 | SW |  |  |  |
|  | Composer | 1 | SW |  |  |  |
|  | Git | 1 | SW |  |  |  |
|  | Akses Internet | 1 | HW/SW |  |  |  |
|  | MySQL Server | 1 | SW |  |  |  |
| Testing | PC Windows 10 | 1 | HW |  |  |  |
|  | XAMPP | 1 | SW |  |  |  |
|  | Chrome / Firefox / Edge / Web browser lainnya | 1 | SW |  |  |  |
|  | Postman | 1 | SW |  |  |  |
|  | JMeter | 1 | SW |  |  |  |
|  | Akses internet | 1 | HW/SW |  |  |  |
| Deployment | PC Windows 10 | 1 | HW |  |  |  |
|  | Akun AWS/DigitalOcean | 1 | SW |  |  |  |
|  | Akun domain | 1 | SW |  |  |  |
|  | SSL Certificate | 1 | SW |  |  |  |
|  | Akses Internet | 1 | HW/SW |  |  |  |
| Maintenance | PC Windows 10 | 1 | HW |  |  |  |
|  | Monitoring tools (Sentry) | 1 | SW |  |  |  |
|  | Akses Internet | 1 | HW/SW |  |  |  |

## Tantangan dan Isu

| No | Proses/Fase/Peralatan/Bahan | Tantangan/Isu | Level Risiko* | Rencana Tindakan | Catatan |
|----|------------------------------|---------------|--------------|-----------------|---------|
| 1 | Requirement Analysis | Pemahaman permasalahan pengelolaan sampah yang kompleks | L | Berdiskusi dengan pakar lingkungan dan pelaku daur ulang sampah | Melibatkan minimal 1 pakar lingkungan |
| 2 | System Design | Tidak dapat melakukan pemodelan dengan benar | M | Mahasiswa diharuskan mempelajari pemodelan yang benar dan benchmark aplikasi serupa | Review desain oleh dosen pembimbing |
| 3 | Implementation | - Pemahaman Teknologi<br>- Waktu yang minim<br>- Fitur yang tidak sesuai dengan rancangan aplikasi | H | - Mempelajari teknologi/Bahasa yang akan digunakan<br>- Memaksimalkan waktu yang diberikan<br>- Memaksimalkan fitur yang sesuai direncanakan | Prioritaskan MVP (Minimum Viable Product) |
| 4 | Testing | Aplikasi tidak berjalan sempurna | H | Melakukan troubleshooting dan regression testing | Membuat test case yang komprehensif |
| 5 | Deployment | - Konfigurasi server yang kompleks<br>- Masalah performa | M | - Dokumentasi deployment yang jelas<br>- Monitoring performa sejak awal | Gunakan CI/CD untuk otomatisasi |
| 6 | Data | Akurasi data lokasi pengepul | M | Verifikasi data melalui kontak langsung | Kerjasama dengan komunitas peduli lingkungan |
| 7 | Adopsi | Rendahnya minat pengguna | H | Strategi marketing digital dan edukasi | Kolaborasi dengan komunitas peduli lingkungan |

*H: High; M: Medium; L: Low

## Estimasi Waktu Pekerjaan

| Fase/Proses | Uraian Pekerjaan | Estimasi Waktu | Catatan |
|-------------|------------------|----------------|---------|
| Requirement Analysis | Bersama mitra mengidentifikasi kebutuhan.<br>Menentukan fitur utama, sistem, proses atau layanan.<br>Mempersiapkan konsep dan rencana awal.<br>Pengumpulan data sampah dan nilainya. | 3 minggu | Output: SRS Document |
| System Design | Membuat diagram<br>Merancang antarmuka (UI)<br>Desain database<br>Desain API | 3 minggu | Output: Design Document & Mockups |
| Implementation | Membangun prototype<br>Mengintegrasikan sistem<br>Pengembangan front-end & back-end<br>Integrasi APIs | 6 minggu | Output: Beta Version |
| Testing | Pengujian aplikasi<br>Unit & Integration testing<br>UAT<br>Performance testing | 1 minggu | Output: Test Report |
| Deployment | Penyebaran perangkat lunak<br>Setup server<br>Konfigurasi domain & SSL | 1 minggu | Output: Live Application |
| Maintenance | Monitoring<br>Bug fixes<br>Updates | Ongoing | Bi-weekly report |

## Milestones & Deliverables

| Minggu | Milestone | Deliverable | Status |
|--------|-----------|-------------|--------|
| Week 3 | Requirement Gathering Complete | SRS Document | Pending |
| Week 6 | Design Phase Complete | UI/UX Designs, Database Schema | Pending |
| Week 10 | Alpha Version | Working Prototype | Pending |
| Week 12 | Beta Version | Testable Application | Pending |
| Week 13 | Testing Complete | Test Report, Bug Fixes | Pending |
| Week 14 | Launch | Live Application | Pending |

## Biaya Proyek (Biaya Bahan dan Peralatan)

| Fase/Proses | Uraian Pekerjaan | Perkiraan Biaya | Catatan |
|-------------|------------------|-----------------|---------|
| Requirement Analysis | Riset data & wawancara | - | Transport & honorarium narasumber |
| System Design | Perancangan UI/UX | - | Termasuk tools design profesional |
| Implementation | Pengembangan aplikasi | - | Honorarium developer & biaya tools |
| Testing | Pengujian aplikasi | - | Tools testing & honorarium tester |
| Deployment | Server setup & domain | - | 1 tahun hosting premium & domain |
| Total | | - | |

## Tim proyek (Dosen, Laboran dan/atau Mahasiswa)

| No | Nama | NIK/NIM | Program Studi | Peran |
|----|------|---------|--------------|------|
| 1 | Gilang Bagus Ramadhan, A.Md.Kom | 222331 | Teknik Informatika | Technical Lead |
| 2 | Swono Sibagariang, S.Kom., M.Kom | 119224 | Teknik Informatika | Database Engineer |
| 3 | Yeni Rokhayati, S.Si., M.Sc | 112093 | Teknik Multimedia & Jaringan | UI/UX Designer |
| 4 | Metta Santiputri, S.T., M.Sc, Ph.D | 100017 | Teknik Informatika | Quality Assurance |

## Ruang Kerja (Workspace)/Laboratorium/Workshop

Sesuai dengan alokasi pemborangan ruangan workspace dari arahan Manajer Projek Lab swd (704)

## Mata Kuliah, Capaian Pembelajaran dan Capaian Pembelajaran Mata Kuliah yang terlibat

| No | Nama Mata Kuliah | Capaian Pembelajaran Lulusan | Capaian Pembelajaran Mata Kuliah |
|----|------------------|-------------------------------|----------------------------------|
| 1 | Interaski Manusia Komputer | Mampu merancang dan mengevaluasi interaksi manusia dengan sistem komputer | Menerapkan prinsip User Experience (UX) dan User Interface (UI) dalam perancangan aplikasi web |
| 2 | Jaringan Komputer | Mampu merancang, mengimplementasi, dan mengelola jaringan komputer | Mengimplementasikan koneksi client-server dalam pengembangan web |
| 3 | Proyek Inovasi Agile | Mampu menerapkan metodologi pengembangan perangkat lunak agile | Mengelola proyek menggunakan metode iteratif dan manajemen backlog |
| 4 | Bahasa Inggris Untuk Komunikasi | Mampu berkomunikasi efektif dalam Bahasa Inggris | Mengembangkan dokumentasi sistem dalam Bahasa Inggris standar |
| 5 | Mata Kuliah Pilihan Web | Mampu mengembangkan aplikasi berbasis web dengan framework modern | Implementasi front-end dan back-end dengan teknologi web terkini |
| 6 | Rekayasa Perangkat Lunak Lanjut | Mampu menerapkan prinsip rekayasa perangkat lunak untuk sistem kompleks | Menerapkan design pattern dan prinsip SOLID dalam pengembangan sistem |
| 7 | Pendidikan Kewarganegaraan | Menerapkan nilai-nilai kewarganegaraan dalam pengembangan solusi | Pengembangan sistem yang memperhatikan aspek tanggung jawab sosial |

## Sistem Monitoring dan Evaluasi

### Indikator Keberhasilan (KPI)
1. **Teknis**:
   - 100% fitur core berfungsi tanpa error
   - Waktu loading halaman < 3 detik
   - Responsif pada 95% perangkat
   
2. **Pengguna**:
   - Minimal 1000 pengguna terdaftar dalam 6 bulan
   - Rata-rata penggunaan 2x seminggu per user
   - Rating kepuasan > 4/5

### Metode Evaluasi
- Weekly sprint review
- User testing dengan metode think-aloud
- A/B testing untuk fitur utama
- Analytics untuk user behavior

**Gambar 3 Gambar Pelaksanan Monitoring** (Gambar belum tersedia)

**Gambar 4 Gambar Pelaksaan Evaluasi** (Gambar belum tersedia)

Monitoring akan dilakukan tiap minggu dan dilakukan pengecekan progres yang sudah dikerjakan di minggu sebelumnya menggunakan metode agile standup meeting dan dokumentasi kemajuan di Trello/Jira.

## Komunikasi antara Manajer Proyek dan Klien

**Driving question**

| Fase/Proses | Pertanyaan/Komentar | Jawaban | Catatan |
|-------------|---------------------|---------|---------|
| Wawancara | Kesulitan yang dihadapi masyarakat terkait pengelolaan sampah? | Kurangnya pemahaman tentang nilai ekonomis dari sampah dan akses ke pengepul | Menjadi fokus feature panduan |
| | Database yang digunakan? | Database MySQL dengan pendekatan ORM Laravel | Disesuaikan dengan kebutuhan performa |
| | Bahasa pemrograman yang digunakan? | PHP (Laravel) untuk backend dan React.js untuk frontend | MVC pattern akan diterapkan |
| | Integrasi dengan data pengepul? | Akan menggunakan kombinasi input manual dan scraping data | Perlu kerja sama dengan beberapa pengepul besar |
| | Perencanaan monetisasi aplikasi? | Fokus awal pada edukasi, monetisasi bisa dari sponsored content | Evaluasi model bisnis setelah 6 bulan |

## Riwayat Perubahan Proyek yang akan ditangani

| No. Revisi/tanggal | Deskripsi Perubahan | Originator |
|--------------------|---------------------|------------|
| Rev 1.0 / 23-03-2023 | Dokumen inisial | Tim Proyek |
| Rev 1.1 / 30-03-2023 | Penambahan detail teknologi | Technical Lead |
| Rev 1.2 / 15-04-2023 | Penyesuaian ruang lingkup dan milestone | Project Manager |
|  |  |  |
| … | … | … |

## Tanda Tangan Persetujuan

Batam, 23/03/2023

| Rezky Nova S. |  |  |  |  |  | Gilang Bagus R. |
|---------------|--|--|--|--|--|----------------|
| Klien |  | P3M |  | SHILAU |  | Manajer Proyek |
|  |  |  |  |  |  |  |
|  |  | Kajur IF |  | KPS IF |  |  |
