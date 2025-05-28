import React from 'react';
import { FaRecycle, FaLightbulb, FaUsers, FaChartLine, FaHandsHelping, FaLeaf, FaMoneyBillWave, FaBook, FaChartPie, FaMapMarkerAlt } from 'react-icons/fa';

const About = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Hero Section */}
      <div className="bg-green-50 rounded-lg p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Tentang Revalio</h1>
        <p className="text-xl text-gray-700 mb-6">
          Memberdayakan masyarakat untuk mengubah sampah menjadi sumber penghasilan melalui edukasi digital
        </p>
        {/* <div className="w-full h-64 bg-green-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Gambar Ilustrasi Tim Revalio</span>
        </div> */}
      </div>

      {/* Our Mission */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Misi Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
              <FaRecycle className="mr-2" /> Solusi Pengelolaan Sampah
            </h3>
            <p className="text-gray-700 text-justify">
              Revalio hadir sebagai solusi inovatif untuk mengatasi masalah pengelolaan sampah di Indonesia. 
              Kami percaya setiap sampah memiliki nilai jika dikelola dengan benar. Sistem kami membantu 
              klasifikasi dan sortir sampah rumah tangga dan industri ringan seperti besi tua, kardus, 
              kaleng, botol plastik, dan limbah lainnya.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
              <FaLightbulb className="mr-2" /> Edukasi & Pemberdayaan
            </h3>
            <p className="text-gray-700 text-justify">
              Kami memberikan pengetahuan praktis tentang cara mengelola sampah sehingga dapat menjadi 
              sumber penghasilan tambahan. Platform kami menyediakan panduan interaktif daur ulang dan 
              reuse, informasi nilai ekonomis sampah, serta tips monetisasi limbah termasuk cara menjual 
              dan siapa yang membeli.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Fitur Utama Revalio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaBook className="text-green-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-center">Katalog Sampah Bernilai</h3>
            <p className="text-gray-600 text-sm text-justify">
              Database lengkap jenis sampah dengan informasi nilai ekonomis, cara sortir, dan penyimpanan. 
              Dilengkapi dengan grafik trend harga dan perkiraan nilai pasar terkini.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaChartPie className="text-green-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-center">Tracking Volume Sampah</h3>
            <p className="text-gray-600 text-sm text-justify">
              Sistem pencatatan untuk melacak jenis dan volume sampah yang dikelola. Menghitung estimasi 
              nilai ekonomi dan dampak lingkungan positif yang dihasilkan.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaMoneyBillWave className="text-green-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-center">Panduan Monetisasi</h3>
            <p className="text-gray-600 text-sm text-justify">
              Informasi pembeli potensial berdasarkan lokasi, tips negosiasi, standar harga pasar, dan 
              praktik terbaik untuk mengemas dan memasarkan sampah.
            </p>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Nilai-Nilai Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm text-center">
            <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaUsers className="text-green-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Pemberdayaan Masyarakat</h3>
            <p className="text-gray-600 text-sm text-justify">
              Membantu masyarakat memahami nilai ekonomis dari sampah yang mereka hasilkan dan memberikan 
              alat untuk mengubahnya menjadi sumber penghasilan.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm text-center">
            <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaChartLine className="text-green-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Ekonomi Sirkular</h3>
            <p className="text-gray-600 text-sm text-justify">
              Mendorong praktik ekonomi sirkular melalui daur ulang dan penggunaan kembali, mengurangi 
              limbah yang berakhir di TPA dan menciptakan nilai tambah.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm text-center">
            <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaHandsHelping className="text-green-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Kolaborasi</h3>
            <p className="text-gray-600 text-sm text-justify">
              Bekerja sama dengan berbagai pihak termasuk bank sampah, pengepul, perusahaan daur ulang, 
              dan komunitas untuk menciptakan dampak yang lebih besar.
            </p>
          </div>
        </div>
      </div>

      {/* Target Users */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Untuk Siapa Revalio?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2 flex items-center">
              <FaUsers className="mr-2 text-green-600" /> Masyarakat Umum
            </h3>
            <p className="text-gray-600 text-sm text-justify">
              Yang ingin mengelola sampah rumah tangga dengan lebih baik dan mendapatkan penghasilan tambahan.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2 flex items-center">
              <FaChartLine className="mr-2 text-green-600" /> Pelaku UMKM
            </h3>
            <p className="text-gray-600 text-sm text-justify">
              Yang menghasilkan sampah industri ringan dan ingin meminimalisir pengelolaan biaya limbah.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2 flex items-center">
              <FaLeaf className="mr-2 text-green-600" /> Komunitas Lingkungan
            </h3>
            <p className="text-gray-600 text-sm text-justify">
              Yang membutuhkan alat untuk mengedukasi masyarakat tentang pengelolaan sampah yang bertanggung jawab.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2 flex items-center">
              <FaBook className="mr-2 text-green-600" /> Pendidik & Peneliti
            </h3>
            <p className="text-gray-600 text-sm text-justify">
              Yang mencari materi edukasi dan data tentang nilai ekonomis sampah untuk kegiatan pengajaran.
            </p>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Tim Kami</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                src="../assets/images/arif.jpg" 
                alt="Muhamad Ariffadhlullah"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-xl">Muhamad Ariffadhlullah</h3>
              <p className="text-green-600 mb-2">Ketua Tim</p>
              <p className="text-gray-600 text-sm text-justify">
                Bertanggung jawab atas pengembangan konsep dan strategi bisnis Revalio. Memastikan platform 
                sesuai dengan kebutuhan pengguna dan memberikan dampak nyata bagi masyarakat.
              </p>
            </div>
          </div>
          
          {/* Team Member 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                src="../assets/images/Diva.jpeg" 
                alt="Diva Satria"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-xl">Diva Satria</h3>
              <p className="text-green-600 mb-2">Pengembang Utama</p>
              <p className="text-gray-600 text-sm text-justify">
                Mengembangkan platform teknologi untuk mendukung visi Revalio. Memastikan aplikasi berjalan 
                dengan lancar, aman, dan memberikan pengalaman pengguna yang optimal.
              </p>
            </div>
          </div>
          
          {/* Team Member 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                src="https://berkat.my.id/assets/img/profile/berkat-tua-siallagan.jpg" 
                alt="Berkat Tua Siallagan"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-xl">Berkat Tua Siallagan</h3>
              <p className="text-green-600 mb-2">Ahli Konten</p>
              <p className="text-gray-600 text-sm text-justify">
                Menyusun materi edukasi dan panduan pengelolaan sampah yang akurat dan mudah dipahami. 
                Bertanggung jawab atas kualitas konten dan relevansi informasi yang disajikan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-3xl font-bold text-green-800 mb-6">Cerita Kami</h2>
        <div className="space-y-6">
          <p className="text-gray-700 text-justify">
            Revalio bermula dari keprihatinan kami terhadap masalah sampah di Indonesia yang belum terkelola dengan optimal. 
            Banyak sampah yang sebenarnya memiliki nilai ekonomis justru berakhir di tempat pembuangan akhir. Berdasarkan data, 
            Indonesia menghasilkan sekitar 67,8 juta ton sampah per tahun, dengan hanya sekitar 7,5% yang didaur ulang.
          </p>
          <p className="text-gray-700 text-justify">
            Sebagai mahasiswa Program Studi Teknologi Rekayasa Perangkat Lunak di Politeknik Negeri Batam, 
            kami menggabungkan pengetahuan teknologi dengan kepedulian lingkungan untuk menciptakan solusi digital 
            yang dapat memberdayakan masyarakat dalam mengelola sampah.
          </p>
          <p className="text-gray-700 text-justify">
            Pada tahun 2025, Revalio resmi diluncurkan sebagai platform edukasi digital yang membantu masyarakat 
            memahami cara mengelola sampah rumah tangga dan industri ringan agar bisa memiliki nilai ekonomis. 
            Platform kami telah membantu ribuan pengguna mengubah persepsi tentang sampah dari beban menjadi sumber daya.
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Visi Kami</h3>
            <p className="text-gray-700 text-justify">
              Menjadi platform edukasi pengelolaan sampah terdepan di Indonesia yang memberdayakan masyarakat 
              untuk berpartisipasi aktif dalam ekonomi sirkular dan menciptakan dampak lingkungan yang positif.
            </p>
          </div>
        </div>
      </div>

      {/* Partners and Support */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Didukung Oleh</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {/* Logo Politeknik Negeri Batam */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-44 w-68">
            <img 
              src="../assets/images/Poltek.png" 
              alt="Logo Politeknik Negeri Batam"
              className="h-full object-contain"
            />
          </div>
          
          {/* Logo Kementerian Lingkungan Hidup */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-44 w-68">
            <img 
              src="../assets/images/Kemendikbutristek.png" 
              alt="Logo Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi"
              className="h-full object-contain"
            />
          </div>
          
          {/* Logo Bank Sampah Nasional */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-44 w-68">
            <img 
              src="../assets/images/Logo-Olivia-X-2025.jpg" 
              alt="Logo OLIVIA 2025"
              className="h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;