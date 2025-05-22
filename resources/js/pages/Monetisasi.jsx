import React, { useState } from 'react';
import axios from 'axios';
import { Box, Container, Typography, useTheme } from '@mui/material';

const Monetisasi = () => {
      const theme = useTheme();
      // State management
      const [activeTab, setActiveTab] = useState('categories');
      const [selectedCategory, setSelectedCategory] = useState(null);
      const [wasteType, setWasteType] = useState('');
      const [location, setLocation] = useState('');
      const [minQuantity, setMinQuantity] = useState('');
      const [buyers, setBuyers] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      // Data constants
      const categories = [
          { id: 'selling', name: 'Cara Menjual' },
          { id: 'buyers', name: 'Pembeli Potensial' },
          { id: 'negotiation', name: 'Teknik Negosiasi' },
          { id: 'pricing', name: 'Strategi Penentuan Harga' }
      ];

      const wasteTypes = [
          'Plastik', 'Kertas', 'Logam', 'Elektronik', 
          'Kaca', 'Organik', 'Baterai', 'Tekstil'
      ];

      // Mock buyer data
      const mockBuyers = [
          {
              id: 1,
              name: 'Bank Sampah Hijau Lestari',
              type: 'Bank Sampah',
              priceRange: 'Rp 2.000 - Rp 5.000 per kg',
              requirements: 'Bersih, tidak tercampur, minimal 5 kg',
              location: 'Jl. Merdeka No. 12',
              contact: '08123456789 (Budi)',
              operationalHours: 'Senin-Jumat: 08.00-16.00'
          },
          {
              id: 2,
              name: 'Pengepul Logam Jaya',
              type: 'Pengepul',
              priceRange: 'Rp 10.000 - Rp 15.000 per kg',
              requirements: 'Bebas material non-logam, minimal 10 kg',
              location: 'Jl. Industri No. 45',
              contact: '08234567890 (Sutrisno)',
              operationalHours: 'Setiap hari: 07.00-19.00'
          }
      ];

      // Handler functions
      const handleSearchBuyers = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          
          try {
              const filteredBuyers = wasteType 
                  ? mockBuyers.filter(buyer => 
                      buyer.requirements.toLowerCase().includes(wasteType.toLowerCase()))
                  : mockBuyers;
              
              const buyersWithLocation = filteredBuyers.map(buyer => ({
                  ...buyer,
                  location: `${buyer.location}, ${location}`
              }));
              
              setBuyers(buyersWithLocation);
              setActiveTab('results');
          } catch (err) {
              setError('Gagal memuat data pembeli. Silakan coba lagi.');
              console.error(err);
          } finally {
              setLoading(false);
          }
      };

      const saveToFavorites = (buyerId) => {
          console.log(`Menambahkan pembeli ${buyerId} ke favorit`);
      };

      const shareResults = () => {
          console.log('Berbagi hasil pencarian');
      };

      // Render functions
      const renderCategories = () => (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Pilih Kategori Tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map(category => (
                    <div 
                        key={category.id}
                        onClick={() => {
                            setSelectedCategory(category.id);
                            if (category.id === 'buyers') {
                                setActiveTab('buyers');
                            } else {
                                setActiveTab(category.id);
                            }
                        }}
                        className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="h-40 bg-green-100 flex items-center justify-center">
                            {category.id === 'selling' && (
                                <img 
                                    src="assets/images/tips/cara-menjual.jpg" 
                                    alt="Cara Menjual" 
                                    className="h-full w-full object-cover"
                                />
                            )}
                            {category.id === 'buyers' && (
                                <img 
                                    src="assets/images/tips/pembeli-potensial.jpg" 
                                    alt="Pembeli Potensial" 
                                    className="h-full w-full object-cover"
                                />
                            )}
                            {category.id === 'negotiation' && (
                                <img 
                                    src="assets/images/tips/teknik-negosiasi.jpg" 
                                    alt="Teknik Negosiasi" 
                                    className="h-full w-full object-cover"
                                />
                            )}
                            {category.id === 'pricing' && (
                                <img 
                                    src="assets/images/tips/penentuan-harga.jpg" 
                                    alt="Strategi Penentuan Harga" 
                                    className="h-full w-full object-cover"
                                />
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                                {category.name}
                            </h3>
                            <p className="text-sm text-gray-600 text-center">
                                {category.id === 'selling' && 'Tips untuk menjual sampah dengan harga terbaik'}
                                {category.id === 'buyers' && 'Temukan pembeli potensial di daerah Anda'}
                                {category.id === 'negotiation' && 'Teknik negosiasi untuk mendapatkan harga terbaik'}
                                {category.id === 'pricing' && 'Strategi menentukan harga yang kompetitif'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      );

      const renderBuyerTips = () => (
        <div className="bg-white rounded-lg shadow-md p-6">
            <button 
                onClick={() => setActiveTab('categories')}
                className="flex items-center text-green-600 mb-4"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Kembali ke Kategori
            </button>
            
            <h2 className="text-2xl font-bold text-green-800 mb-6">Strategi Mencari Pembeli Potensial</h2>
            
            <div className="space-y-6">
                {/* Section 1: Jenis Pembeli Potensial */}
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Jenis Pembeli Potensial</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                            <div className="flex items-center mb-2">
                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h4 className="font-medium text-green-700">Bank Sampah</h4>
                            </div>
                            <p className="text-sm text-gray-600">Sistem terorganisir dengan harga stabil, biasanya menerima berbagai jenis sampah dengan persyaratan tertentu.</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                            <div className="flex items-center mb-2">
                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h4 className="font-medium text-green-700">Pengepul Langsung</h4>
                            </div>
                            <p className="text-sm text-gray-600">Biasanya fokus pada jenis sampah tertentu, harga bervariasi tergantung musim dan permintaan.</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                            <div className="flex items-center mb-2">
                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h4 className="font-medium text-green-700">Industri Daur Ulang</h4>
                            </div>
                            <p className="text-sm text-gray-600">Membutuhkan jumlah besar dengan kualitas konsisten, harga biasanya lebih tinggi.</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                            <div className="flex items-center mb-2">
                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h4 className="font-medium text-green-700">Pengrajin Kreatif</h4>
                            </div>
                            <p className="text-sm text-gray-600">Membutuhkan sampah dengan karakteristik khusus untuk kerajinan, sering membayar premium.</p>
                        </div>
                    </div>
                </div>
                
                {/* Section 2: Cara Mencari Pembeli */}
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">5 Langkah Efektif Mencari Pembeli</h3>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1 mr-3">1</div>
                            <div>
                                <h4 className="font-medium text-green-700">Identifikasi Jenis Sampah Anda</h4>
                                <p className="text-sm text-gray-600">Ketahui dengan pasti jenis dan kualitas sampah yang Anda miliki. Pembeli berbeda membutuhkan jenis sampah yang berbeda.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start">
                            <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1 mr-3">2</div>
                            <div>
                                <h4 className="font-medium text-green-700">Gunakan Jaringan Lokal</h4>
                                <p className="text-sm text-gray-600">Tanyakan kepada tetangga, komunitas RT/RW, atau kelompok lingkungan tentang pembeli terpercaya di daerah Anda.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start">
                            <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1 mr-3">3</div>
                            <div>
                                <h4 className="font-medium text-green-700">Manfaatkan Teknologi</h4>
                                <p className="text-sm text-gray-600">Gunakan aplikasi dan platform online khusus daur ulang seperti Waste4Change, Gringgo, atau grup Facebook lokal.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start">
                            <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1 mr-3">4</div>
                            <div>
                                <h4 className="font-medium text-green-700">Kunjungi Tempat Pengumpulan</h4>
                                <p className="text-sm text-gray-600">Datangi langsung bank sampah atau tempat pengumpulan untuk mendapatkan informasi pembeli dan harga terkini.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start">
                            <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1 mr-3">5</div>
                            <div>
                                <h4 className="font-medium text-green-700">Buat Daftar Pembeli</h4>
                                <p className="text-sm text-gray-600">Catat kontak beberapa pembeli untuk setiap jenis sampah sehingga Anda bisa membandingkan harga dan persyaratan.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Section 3: Ciri Pembeli Terpercaya */}
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Ciri-ciri Pembeli Terpercaya</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg border border-green-100">
                            <div className="flex items-center mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <h4 className="font-medium">Transparan Tentang Harga</h4>
                            </div>
                            <p className="text-sm text-gray-600 pl-7">Memberikan informasi harga jelas tanpa hidden cost.</p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-green-100">
                            <div className="flex items-center mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <h4 className="font-medium">Pembayaran Tepat Waktu</h4>
                            </div>
                            <p className="text-sm text-gray-600 pl-7">Tidak menunda-nunda pembayaran setelah transaksi.</p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-green-100">
                            <div className="flex items-center mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <h4 className="font-medium">Legalitas Jelas</h4>
                            </div>
                            <p className="text-sm text-gray-600 pl-7">Memiliki izin usaha atau terdaftar di asosiasi resmi.</p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-green-100">
                            <div className="flex items-center mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <h4 className="font-medium">Komunikasi Baik</h4>
                            </div>
                            <p className="text-sm text-gray-600 pl-7">Responsif dan jelas dalam berkomunikasi.</p>
                        </div>
                    </div>
                </div>
                
                {/* Section 4: Platform Rekomendasi */}
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Platform Online untuk Mencari Pembeli</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                            <div className="flex items-center mb-2">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <h4 className="font-medium text-green-700">Waste4Change</h4>
                            </div>
                            <p className="text-sm text-gray-600">Platform profesional untuk pengelolaan sampah dengan jaringan pembeli luas.</p>
                            <a href="#" className="text-green-600 text-sm mt-2 inline-block">Kunjungi Situs →</a>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                            <div className="flex items-center mb-2">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h4 className="font-medium text-green-700">Grup WhatsApp/Facebook</h4>
                            </div>
                            <p className="text-sm text-gray-600">Cari grup "Jual Beli Sampah [Nama Kota]" untuk pembeli lokal.</p>
                            <a href="#" className="text-green-600 text-sm mt-2 inline-block">Cari Grup →</a>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                            <div className="flex items-center mb-2">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <h4 className="font-medium text-green-700">Aplikasi Lokal</h4>
                            </div>
                            <p className="text-sm text-gray-600">Cek aplikasi seperti "Bank Sampah Digital" dari pemerintah daerah Anda.</p>
                            <a href="#" className="text-green-600 text-sm mt-2 inline-block">Pelajari Lebih →</a>
                        </div>
                    </div>
                </div>
                
                {/* Section 5: Tips Tambahan */}
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Tips Tambahan untuk Hasil Maksimal</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Buat sampah Anda menarik</strong> - Semakin bersih dan terpilah, semakin tinggi harga yang bisa Anda dapatkan</li>
                        <li><strong>Jalin hubungan baik</strong> - Pembeli tetap sering memberikan harga lebih baik dan prioritas</li>
                        <li><strong>Pantau fluktuasi harga</strong> - Harga sampah bisa berubah tergantung musim dan permintaan industri</li>
                        <li><strong>Gabung dengan komunitas</strong> - Komunitas daur ulang sering memiliki daftar pembeli terpercaya</li>
                        <li><strong>Dokumentasikan transaksi</strong> - Catat harga dan pembeli untuk referensi di masa depan</li>
                    </ul>
                </div>
            </div>
        </div>
    );

      const renderSellingTips = () => (
          <div className="bg-white rounded-lg shadow-md p-6">
              <button 
                  onClick={() => setActiveTab('categories')}
                  className="flex items-center text-green-600 mb-4"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Kembali ke Kategori
              </button>
              
              <h2 className="text-2xl font-bold text-green-800 mb-6">Cara Menjual Sampah dengan Efektif</h2>
              
              <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Persiapan Sebelum Menjual</h3>
                      <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Pilah sampah dengan benar</strong>: Pisahkan berdasarkan jenis (plastik, kertas, logam, dll)</li>
                          <li><strong>Bersihkan sampah</strong>: Cuci sampah plastik/kaca dari sisa makanan/minuman</li>
                          <li><strong>Keringkan</strong>: Pastikan benar-benar kering sebelum dijual</li>
                          <li><strong>Kompres</strong>: Padatkan untuk menghemat ruang penyimpanan</li>
                      </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Tempat Penjualan</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded shadow">
                              <h4 className="font-medium text-green-700 mb-1">Bank Sampah</h4>
                              <p className="text-sm">Sistem tabungan sampah dengan pencatatan teratur, harga lebih stabil</p>
                          </div>
                          <div className="bg-white p-3 rounded shadow">
                              <h4 className="font-medium text-green-700 mb-1">Pengepul Keliling</h4>
                              <p className="text-sm">Praktis tapi harga biasanya lebih rendah</p>
                          </div>
                          <div className="bg-white p-3 rounded shadow">
                              <h4 className="font-medium text-green-700 mb-1">Tempat Pengumpulan</h4>
                              <p className="text-sm">Dropbox sampah di titik-titik tertentu</p>
                          </div>
                          <div className="bg-white p-3 rounded shadow">
                              <h4 className="font-medium text-green-700 mb-1">Online</h4>
                              <p className="text-sm">Aplikasi/website khusus jual beli sampah</p>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Tips Tambahan</h3>
                      <ul className="list-disc pl-5 space-y-2">
                          <li>Kumpulkan sampai mencapai jumlah minimum untuk harga lebih baik</li>
                          <li>Bangun hubungan baik dengan pembeli untuk harga lebih stabil</li>
                          <li>Manfaatkan program insentif dari pemerintah</li>
                          <li>Jaga kualitas sampah untuk mendapatkan harga premium</li>
                      </ul>
                  </div>
              </div>
          </div>
      );

      const renderNegotiationTips = () => (
          <div className="bg-white rounded-lg shadow-md p-6">
              <button 
                  onClick={() => setActiveTab('categories')}
                  className="flex items-center text-green-600 mb-4"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Kembali ke Kategori
              </button>
              
              <h2 className="text-2xl font-bold text-green-800 mb-6">Teknik Negosiasi Harga Sampah</h2>
              
              <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Strategi Negosiasi</h3>
                      <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Bandingkan harga</strong>: Survey harga dari beberapa pembeli sebelum menawarkan</li>
                          <li><strong>Kelompokkan penjualan</strong>: Jual dalam jumlah besar untuk mendapatkan harga lebih baik</li>
                          <li><strong>Bangun hubungan baik</strong>: Pembeli tetap sering memberikan harga lebih baik</li>
                          <li><strong>Waktu tepat</strong>: Harga bisa naik saat permintaan industri tinggi</li>
                      </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Teknik Komunikasi</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded shadow">
                              <h4 className="font-medium text-green-700 mb-1">Gunakan Data</h4>
                              <p className="text-sm">Bawa catatan harga pasar sebagai referensi negosiasi</p>
                          </div>
                          <div className="bg-white p-3 rounded shadow">
                              <h4 className="font-medium text-green-700 mb-1">Tunjukkan Kualitas</h4>
                              <p className="text-sm">Perlihatkan sampah yang sudah dipilah dan dibersihkan</p>
                          </div>
                          <div className="bg-white p-3 rounded shadow">
                              <h4 className="font-medium text-green-700 mb-1">Ajukan Pertanyaan</h4>
                              <p className="text-sm">Tanyakan alasan harga yang ditawarkan</p>
                          </div>
                          <div className="bg-white p-3 rounded shadow">
                              <h4 className="font-medium text-green-700 mb-1">Bersikap Fleksibel</h4>
                              <p className="text-sm">Siap untuk kompromi yang menguntungkan kedua belah pihak</p>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Yang Harus Dihindari</h3>
                      <ul className="list-disc pl-5 space-y-2">
                          <li>Jangan langsung menerima tawaran pertama</li>
                          <li>Hindari menjual saat pasar sedang sepi</li>
                          <li>Jangan menjual sampah yang belum dipilah</li>
                          <li>Hindari pembeli yang tidak transparan dengan harga</li>
                      </ul>
                  </div>
              </div>
          </div>
      );

      const renderPricingTips = () => (
        <div className="bg-white rounded-lg shadow-md p-6">
          <button 
            onClick={() => setActiveTab('categories')}
            className="flex items-center text-green-600 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Kategori
          </button>
          
          <h2 className="text-2xl font-bold text-green-800 mb-6">Strategi Penentuan Harga Sampah</h2>
          
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Faktor yang Mempengaruhi Harga</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Jenis sampah</strong>: Logam biasanya lebih mahal dari plastik</li>
                <li><strong>Kualitas</strong>: Sampah bersih dan terpilah rapi lebih tinggi harganya</li>
                <li><strong>Lokasi</strong>: Harga berbeda tiap daerah</li>
                <li><strong>Volume</strong>: Penjualan besar biasanya dapat harga lebih baik</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Daftar Harga Referensi (per kg)</h3>
              
              {/* Desktop Table (hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="py-2 px-4 border text-left">Jenis Sampah</th>
                      <th className="py-2 px-4 border text-left">Harga Minimum</th>
                      <th className="py-2 px-4 border text-left">Harga Maksimum</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border">Plastik PET</td>
                      <td className="py-2 px-4 border">Rp 3.000</td>
                      <td className="py-2 px-4 border">Rp 5.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-2 px-4 border">Kertas Koran</td>
                      <td className="py-2 px-4 border">Rp 2.000</td>
                      <td className="py-2 px-4 border">Rp 3.500</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border">Besi Tua</td>
                      <td className="py-2 px-4 border">Rp 5.000</td>
                      <td className="py-2 px-4 border">Rp 10.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-2 px-4 border">Aluminium</td>
                      <td className="py-2 px-4 border">Rp 15.000</td>
                      <td className="py-2 px-4 border">Rp 25.000</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border">Kaca Bening</td>
                      <td className="py-2 px-4 border">Rp 1.500</td>
                      <td className="py-2 px-4 border">Rp 3.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-2 px-4 border">Kardus</td>
                      <td className="py-2 px-4 border">Rp 2.500</td>
                      <td className="py-2 px-4 border">Rp 4.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Cards (shown on mobile) */}
              <div className="md:hidden space-y-3">
                <div className="bg-white p-3 rounded-lg shadow-sm border">
                  <h4 className="font-medium text-green-800">Plastik PET</h4>
                  <div className="flex justify-between mt-1">
                    <span>Min:</span>
                    <span>Rp 3.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max:</span>
                    <span>Rp 5.000</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg shadow-sm border">
                  <h4 className="font-medium text-green-800">Kertas Koran</h4>
                  <div className="flex justify-between mt-1">
                    <span>Min:</span>
                    <span>Rp 2.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max:</span>
                    <span>Rp 3.500</span>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg shadow-sm border">
                  <h4 className="font-medium text-green-800">Besi Tua</h4>
                  <div className="flex justify-between mt-1">
                    <span>Min:</span>
                    <span>Rp 5.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max:</span>
                    <span>Rp 10.000</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg shadow-sm border">
                  <h4 className="font-medium text-green-800">Aluminium</h4>
                  <div className="flex justify-between mt-1">
                    <span>Min:</span>
                    <span>Rp 15.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max:</span>
                    <span>Rp 25.000</span>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg shadow-sm border">
                  <h4 className="font-medium text-green-800">Kaca Bening</h4>
                  <div className="flex justify-between mt-1">
                    <span>Min:</span>
                    <span>Rp 1.500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max:</span>
                    <span>Rp 3.000</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg shadow-sm border">
                  <h4 className="font-medium text-green-800">Kardus</h4>
                  <div className="flex justify-between mt-1">
                    <span>Min:</span>
                    <span>Rp 2.500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max:</span>
                    <span>Rp 4.000</span>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">*Harga dapat berubah tergantung kondisi pasar</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Tips Meningkatkan Nilai Jual</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Kumpulkan sampai mencapai jumlah minimum</li>
                <li>Bersihkan dan pilah dengan baik</li>
                <li>Cari pembeli yang spesialis di jenis sampah Anda</li>
                <li>Manfaatkan fluktuasi harga musiman</li>
                <li>Jalin kerjasama dengan komunitas daur ulang</li>
              </ul>
            </div>
          </div>
        </div>
      );

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: { xs: 4, md: 5 } }}>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight={800} 
            gutterBottom 
            sx={{ 
              position: 'relative', 
              display: 'inline-block',
              mb: 3
            }}
          >
            Tips Monetisasi Sampah
            <Box 
              sx={{ 
                position: 'absolute',
                bottom: -5,
                left: 0,
                width: '50%',
                height: 4,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 2
              }}
            />
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mt: 2, 
              maxWidth: '800px',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Pelajari berbagai tips dan strategi untuk memaksimalkan nilai jual sampah Anda.
          </Typography>
        </Box>

        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'buyers' && renderBuyerTips()}
        {activeTab === 'selling' && renderSellingTips()}
        {activeTab === 'negotiation' && renderNegotiationTips()}
        {activeTab === 'pricing' && renderPricingTips()}
      </Container>
    </Box>
  );
  };

  export default Monetisasi;