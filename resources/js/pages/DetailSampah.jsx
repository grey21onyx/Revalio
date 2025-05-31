import React, { useState, useEffect } from 'react';
import wasteTypeService from '../services/wasteTypeService';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Simple breadcrumb component
const Breadcrumb = ({ items }) => (
<nav className="text-sm mb-4" aria-label="Breadcrumb">
    <ol className="list-reset flex text-green-600">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
{item.link ? (
            <a href={item.link} className="text-green-600 hover:underline">{item.label}</a>
          ) : (
            <span className="font-semibold text-green-700">{item.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

// Simple image carousel
const ImageCarousel = ({ images }) => {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;

  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  const next = () => setCurrent((current + 1) % images.length);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <img
        src={images[current]}
        alt={`Gambar sampah ${current + 1}`}
        className="w-full h-64 object-cover rounded"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-r"
            aria-label="Previous image"
          >
            &#10094;
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-l"
            aria-label="Next image"
          >
            &#10095;
          </button>
        </>
      )}
    </div>
  );
};

// Simple tabs component
const Tabs = ({ tabs, currentTab, onChange }) => (
  <div>
    <div className="border-b border-gray-300 mb-4 flex space-x-4">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`py-2 px-4 -mb-px border-b-2 font-medium ${
            currentTab === index ? 'border-green-500 text-green-600' : 'border-transparent text-gray-600 hover:text-green-500'
          }`}
          onClick={() => onChange(index)}
        >
          {tab.label}
        </button>
      ))}
    </div>
    <div>{tabs[currentTab].content}</div>
  </div>
);

// Simple price trend chart using SVG
const PriceTrendChart = ({ data }) => {
  console.log('Chart data received:', data);
  
  if (!data || data.length === 0) return <p>Tidak ada data tren harga.</p>;

  // Calculate chart dimensions
  const width = 400;
  const height = 150;
  const padding = 40;

  // Extract prices and dates dengan pendekatan defensif
  const prices = data.map(d => Number(d.max) || 0);
  const dates = data.map(d => {
    // Pastikan tanggal adalah string dan diformat dengan benar
    if (typeof d.tanggal !== 'string') {
      console.warn('Tanggal bukan string:', d.tanggal);
      return 'N/A';
    }
    return d.tanggal;
  });
  
  console.log('Prices for chart:', prices);
  console.log('Dates for chart:', dates);

  // Hitung min dan max price dengan pendekatan defensif
  const validPrices = prices.filter(p => !isNaN(p) && p > 0);
  const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : 1000;
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  
  console.log('Min price:', minPrice, 'Max price:', maxPrice);

  // Scale functions dengan validasi
  const xScale = (index) => {
    if (isNaN(index)) {
      console.error("Invalid index for xScale:", index);
      return padding;
    }
    return padding + (index * (width - 2 * padding)) / Math.max(1, data.length - 1);
  };
  
  const yScale = (price) => {
    if (isNaN(price) || maxPrice === minPrice) {
      console.error("Invalid price for yScale:", price, "Min:", minPrice, "Max:", maxPrice);
      return height - padding;
    }
    return height - padding - ((price - minPrice) * (height - 2 * padding)) / Math.max(0.01, maxPrice - minPrice);
  };

  // Build path
  const pathD = data
    .map((point, i) => {
      const x = xScale(i);
      const y = yScale(point.max);
      if (isNaN(x) || isNaN(y)) {
        console.error(`Invalid point at index ${i}: x=${x}, y=${y}, value=${point.max}`);
        return '';
      }
      return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
    })
    .filter(Boolean) // Filter out empty strings
    .join(' ');
    
  // Jika pathD kosong, tampilkan pesan
  if (!pathD) {
    return <p>Data tren harga tidak dapat divisualisasikan.</p>;
  }

  return (
    <svg width={width} height={height} className="mx-auto">
      {/* Axes */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" />

      {/* Price trend path */}
      <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2" />

      {/* Price points */}
      {data.map((point, i) => {
        const cx = xScale(i);
        const cy = yScale(point.max);
        // Validasi koordinat titik
        if (isNaN(cx) || isNaN(cy)) return null;
        return <circle key={i} cx={cx} cy={cy} r="4" fill="#10b981" />;
      })}

      {/* Labels */}
      {dates.map((date, i) => {
        const x = xScale(i);
        // Validasi koordinat label
        if (isNaN(x)) return null;
        return (
          <text key={i} x={x} y={height - padding + 15} fontSize="10" fill="#666" textAnchor="middle">
            {typeof date === 'string' ? date.slice(5) : ''}
          </text>
        );
      })}

      {/* Hanya tampilkan label harga jika valid */}
      {[minPrice, maxPrice].map((price, i) => {
        const y = yScale(price);
        // Validasi koordinat label
        if (isNaN(y)) return null;
        return (
          <text key={i} x={padding - 10} y={y + 4} fontSize="10" fill="#666" textAnchor="end">
            {price}
          </text>
        );
      })}
    </svg>
  );
};

const DetailSampah = () => {
  const { id } = useParams(); // Mengambil ID dari URL parameter
  const wasteId = parseInt(id) || 1; // Konversi ke integer dengan fallback ke 1
  const [waste, setWaste] = useState(null);
  const [values, setValues] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [articles, setArticles] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch waste detail
        const response = await wasteTypeService.getPublicWasteTypeDetail(wasteId);
        console.log('API response for detail:', response);
        
        if (!response || !response.waste_type) {
          throw new Error('Invalid response format or waste type not found');
        }
        
        setWaste(response.waste_type);
        
        // Extract value data from response - dengan pendekatan defensif
        const nilaiTerkini = getCurrentWasteValue(response.waste_type.wasteValues || []);
        const valueData = {
          harga_minimum: nilaiTerkini?.harga_minimum || 0,
          harga_maksimum: nilaiTerkini?.harga_maksimum || 0,
          satuan: nilaiTerkini?.satuan || 'kg',
          harga_trend: formatPriceHistory(response.price_history || {})
        };
        setValues(valueData);

        // Fetch potential buyers dengan pendekatan defensif
        try {
          const buyersResponse = await wasteTypeService.getPotentialBuyers(wasteId);
          setBuyers(buyersResponse?.buyers || []);
        } catch (buyerError) {
          console.warn("Error fetching buyers:", buyerError);
          setBuyers([]);
        }

        // Fetch related tutorials dengan pendekatan defensif
        try {
          const tutorialsResponse = await wasteTypeService.getRelatedTutorials(wasteId);
          setTutorials(tutorialsResponse?.tutorials || []);
        } catch (tutorialError) {
          console.warn("Error fetching tutorials:", tutorialError);
          setTutorials([]);
        }

        // Fetch related articles dengan pendekatan defensif
        try {
          const articlesResponse = await axios.get(`/api/v1/public/articles?related_to_waste=${wasteId}`);
          setArticles(articlesResponse?.data?.data || []);
        } catch (articleError) {
          console.warn("Error fetching related articles:", articleError);
          setArticles([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading waste data:", error);
        setError("Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.");
        setLoading(false);
      }
      
      // Pastikan loading state tidak terjebak terlalu lama
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    };
    
    loadData();
  }, [wasteId]);

  // Helper function to get current waste value from all values
  const getCurrentWasteValue = (wasteValues) => {
    if (!wasteValues || wasteValues.length === 0) return null;
    
    // Sort by tanggal_update in descending order and take the most recent
    return wasteValues.sort((a, b) => 
      new Date(b.tanggal_update) - new Date(a.tanggal_update)
    )[0];
  };

  // Helper function to format price history data
  const formatPriceHistory = (priceHistory) => {
    if (!priceHistory || typeof priceHistory !== 'object' || Object.keys(priceHistory).length === 0) {
      console.log('Price history empty or invalid format:', priceHistory);
      return [];
    }
    
    console.log('Price history raw data:', priceHistory);
    
    try {
      // Coba deteksi format data (array atau objek)
      if (Array.isArray(priceHistory)) {
        // Jika sudah dalam format array
        return priceHistory.map(item => ({
          tanggal: item.tanggal || item.date || 'N/A',
          max: parseFloat(item.max || item.harga_maksimum || 0),
          min: parseFloat(item.min || item.harga_minimum || 0)
        }));
      } else {
        // Jika dalam format objek (tanggal: {max, min})
        const result = Object.entries(priceHistory).map(([tanggal, values]) => ({
          tanggal,
          max: parseFloat(values.max || values.harga_maksimum || 0),
          min: parseFloat(values.min || values.harga_minimum || 0)
        }));
        
        console.log('Formatted price history:', result);
        return result;
      }
    } catch (error) {
      console.error('Error formatting price history:', error);
      return [];
    }
  };

  // Helper function to format price as Rupiah
  const formatRupiah = (amount) => {
    if (!amount) return '0';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (loading) {
    return <div className="container mx-auto py-8 px-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 px-4 text-red-600">{error}</div>;
  }

  if (!waste || !values) {
    return <div className="container mx-auto py-8 px-4">Data tidak ditemukan.</div>;
  }

  // Process image URLs if needed
  const baseUrl = '/storage/';
  const gambar = waste.gambar || null;
  const images = gambar 
    ? (gambar.startsWith('http') ? [gambar] : [`${baseUrl}${gambar}`]) 
    : [];

  // Define tabs content
  const tabs = [
    {
      label: 'Cara Sortir',
      content: (
        <div>
          <p className="whitespace-pre-line">
            {waste.cara_sortir || 
              'Belum ada informasi cara sortir untuk jenis sampah ini.'}
          </p>
        </div>
      ),
    },
    {
      label: 'Cara Penyimpanan',
      content: (
        <div>
          <p className="whitespace-pre-line">
            {waste.cara_penyimpanan || 
              'Belum ada informasi cara penyimpanan untuk jenis sampah ini.'}
          </p>
        </div>
      ),
    },
    {
      label: 'Dampak Lingkungan',
      content: (
        <div>
          <p className="whitespace-pre-line">
            {waste.dampak_lingkungan || 
              'Pengelolaan sampah jenis ini dapat mengurangi pencemaran lingkungan dan meningkatkan daur ulang. Dampak positif meliputi pengurangan emisi gas rumah kaca dan penghematan sumber daya alam.'}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          <p className="text-xl">{error}</p>
        </div>
      ) : !waste ? (
        <div className="text-center py-12 text-red-600">
          <p className="text-xl">Data sampah tidak ditemukan</p>
        </div>
      ) : (
        <>
          <Breadcrumb
            items={[
              { label: 'Beranda', link: '/' },
              { label: 'Katalog Sampah', link: '/katalog' },
              { label: waste.nama || 'Detail Sampah' },
            ]}
          />

          <h1 className="text-3xl font-bold mb-4">{waste.nama || 'Detail Sampah'}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <img 
                  src={waste.gambar || '/assets/images/waste/default-waste.jpg'} 
                  alt={waste.nama || 'Detail Sampah'}
                  className="w-full h-64 object-cover object-center" 
                  onError={(e) => {
                    e.target.src = '/assets/images/waste/default-waste.jpg';
                  }}
                />
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {waste.category?.nama || 'Uncategorized'}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {waste.tingkat_kesulitan || 'Medium'}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-2">Deskripsi</h2>
                  <p className="text-gray-700 mb-4">{waste.deskripsi || 'Tidak ada deskripsi'}</p>
                  
                  <h2 className="text-xl font-semibold mb-2">Cara Sortir</h2>
                  <p className="text-gray-700 mb-4 whitespace-pre-line">{waste.cara_sortir || 'Tidak ada informasi cara sortir'}</p>
                  
                  <h2 className="text-xl font-semibold mb-2">Cara Penyimpanan</h2>
                  <p className="text-gray-700 mb-4 whitespace-pre-line">{waste.cara_penyimpanan || 'Tidak ada informasi cara penyimpanan'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Nilai Ekonomis</h2>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Harga Minimum:</span>
                  <span className="font-medium">Rp {formatRupiah(values.harga_minimum || 0)}/{values.satuan}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Harga Maksimum:</span>
                  <span className="font-medium">Rp {formatRupiah(values.harga_maksimum || 0)}/{values.satuan}</span>
                </div>
                
                <h3 className="font-semibold text-lg mt-6 mb-3">Tren Harga</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <PriceTrendChart data={values.harga_trend || []} />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Pengepul Potensial</h2>
                {buyers && buyers.length > 0 ? (
                  <ul className="space-y-3">
                    {buyers.map((buyer, index) => (
                      <li key={index} className="border-b pb-2 last:border-0">
                        <p className="font-medium">{buyer.nama || 'Nama Pengepul'}</p>
                        <p className="text-sm text-gray-600">{buyer.lokasi || 'Lokasi tidak tersedia'}</p>
                        {buyer.kontak && <p className="text-sm">Kontak: {buyer.kontak}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Tidak ada data pengepul untuk jenis sampah ini</p>
                )}
              </div>
            </div>
          </div>

          {tutorials && tutorials.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Tutorial Daur Ulang Terkait</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tutorials.slice(0, 3).map((tutorial, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                    <img 
                      src={tutorial.gambar || '/assets/images/tutorials/default-tutorial.jpg'} 
                      alt={tutorial.judul || 'Tutorial'}
                      className="w-full h-40 object-cover" 
                      onError={(e) => {
                        e.target.src = '/assets/images/tutorials/default-tutorial.jpg';
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{tutorial.judul || 'Judul Tutorial'}</h3>
                      <p className="text-gray-600 text-sm mb-3">{tutorial.deskripsi?.substring(0, 100) || 'Tidak ada deskripsi'}...</p>
                      <button className="text-green-600 font-medium hover:underline">
                        Baca Selengkapnya
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {articles && articles.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {articles.slice(0, 4).map((article, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img 
                      src={article.gambar || '/assets/images/articles/default-article.jpg'} 
                      alt={article.judul || 'Artikel'}
                      className="w-full h-40 object-cover" 
                      onError={(e) => {
                        e.target.src = '/assets/images/articles/default-article.jpg';
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{article.judul || 'Judul Artikel'}</h3>
                      <p className="text-gray-600 text-sm mb-3">{article.ringkasan?.substring(0, 80) || 'Tidak ada ringkasan'}...</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{article.tanggal_publikasi || 'Tanggal tidak tersedia'}</span>
                        <button className="text-green-600 text-sm font-medium hover:underline">
                          Baca
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DetailSampah;
