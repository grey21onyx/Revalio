  import React, { useState } from 'react';
  import axios from 'axios';

  const Monetisasi = () => {
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
                                setActiveTab('buyerFilter');
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

      const renderBuyerFilter = () => (
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
              
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Cari Pembeli Potensial</h2>
              
              <form onSubmit={handleSearchBuyers} className="space-y-4">
                  <div>
                      <label htmlFor="wasteType" className="block text-sm font-medium text-gray-700 mb-1">Jenis Sampah</label>
                      <select
                          id="wasteType"
                          value={wasteType}
                          onChange={(e) => setWasteType(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          required
                      >
                          <option value="">Pilih Jenis Sampah</option>
                          {wasteTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                          ))}
                      </select>
                  </div>
                  
                  <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                      <input
                          type="text"
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Masukkan kota/kecamatan"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          required
                      />
                      <p className="text-xs text-gray-500 mt-1">Gunakan peta untuk memilih lokasi (fitur akan datang)</p>
                  </div>
                  
                  <div>
                      <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700 mb-1">Jumlah Minimum (opsional)</label>
                      <input
                          type="number"
                          id="minQuantity"
                          value={minQuantity}
                          onChange={(e) => setMinQuantity(e.target.value)}
                          placeholder="Dalam kg"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                  </div>
                  
                  <div className="pt-2">
                      <button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition duration-200 flex items-center"
                          disabled={loading}
                      >
                          {loading ? (
                              <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Mencari...
                              </>
                          ) : 'Cari Pembeli'}
                      </button>
                  </div>
              </form>
          </div>
      );

      const renderResults = () => (
          <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                  <button 
                      onClick={() => setActiveTab('buyerFilter')}
                      className="flex items-center text-green-600"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Ubah Pencarian
                  </button>
                  
                  <div className="flex space-x-2">
                      <button
                          onClick={shareResults}
                          className="flex items-center bg-green-100 hover:bg-green-200 text-green-800 py-2 px-4 rounded-md transition duration-200"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>
                          Bagikan
                      </button>
                  </div>
              </div>
              
              {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                      <p>{error}</p>
                  </div>
              )}
              
              {buyers.length === 0 ? (
                  <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ditemukan pembeli</h3>
                      <p className="mt-1 text-gray-500">Coba perlebar area pencarian atau ubah kriteria filter.</p>
                      <button
                          onClick={() => setActiveTab('buyerFilter')}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                          Ubah Pencarian
                      </button>
                  </div>
              ) : (
                  <>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Hasil Pencarian Pembeli</h2>
                      <p className="text-gray-600 mb-6">Menampilkan pembeli untuk {wasteType} di {location}</p>
              
                      <div className="space-y-6">
                          {buyers.map((buyer) => (
                              <div key={buyer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                                  <div className="flex justify-between items-start">
                                      <div>
                                          <h3 className="text-lg font-semibold text-green-800">{buyer.name}</h3>
                                          <p className="text-gray-600">{buyer.type}</p>
                                      </div>
                                      <button
                                          onClick={() => saveToFavorites(buyer.id)}
                                          className="text-green-500 hover:text-green-600"
                                          title="Simpan ke favorit"
                                      >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                          </svg>
                                      </button>
                                  </div>
                                  
                                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div>
                                          <h4 className="text-sm font-medium text-gray-500">Kisaran Harga</h4>
                                          <p className="font-medium">{buyer.priceRange}</p>
                                      </div>
                                      <div>
                                          <h4 className="text-sm font-medium text-gray-500">Persyaratan</h4>
                                          <p>{buyer.requirements}</p>
                                      </div>
                                      <div>
                                          <h4 className="text-sm font-medium text-gray-500">Lokasi</h4>
                                          <p>{buyer.location}</p>
                                      </div>
                                  </div>
                                  
                                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                          <h4 className="text-sm font-medium text-gray-500">Kontak</h4>
                                          <p>{buyer.contact}</p>
                                      </div>
                                      <div>
                                          <h4 className="text-sm font-medium text-gray-500">Jam Operasional</h4>
                                          <p>{buyer.operationalHours}</p>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </>
              )}
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
            <div className="container mx-auto py-8 px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-green-800 mb-6">Tips Monetisasi Sampah</h1>
                
                {activeTab === 'categories' && renderCategories()}
                {activeTab === 'buyerFilter' && renderBuyerFilter()}
                {activeTab === 'results' && renderResults()}
                {activeTab === 'selling' && renderSellingTips()}
                {activeTab === 'negotiation' && renderNegotiationTips()}
                {activeTab === 'pricing' && renderPricingTips()}
            </div>
        );
  };

  export default Monetisasi;