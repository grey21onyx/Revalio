import React, { useState, useEffect } from 'react';
import wasteTypeService from '../services/wasteTypeService';
import axios from 'axios';

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
  if (!data || data.length === 0) return <p>Tidak ada data tren harga.</p>;

  // Calculate chart dimensions
  const width = 400;
  const height = 150;
  const padding = 40;

  // Extract prices and dates
  const prices = data.map(d => d.harga || d.max);
  const dates = data.map(d => d.tanggal || d.date);

  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  // Scale functions
  const xScale = (index) => padding + (index * (width - 2 * padding)) / (data.length - 1);
  const yScale = (price) => height - padding - ((price - minPrice) * (height - 2 * padding)) / (maxPrice - minPrice);

  // Build path
  const pathD = data
    .map((point, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)} ${yScale(point.harga || point.max)}`)
    .join(' ');

  return (
    <svg width={width} height={height} className="mx-auto">
      {/* Axes */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" />

      {/* Price trend path */}
      <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2" />

      {/* Price points */}
      {data.map((point, i) => (
        <circle key={i} cx={xScale(i)} cy={yScale(point.harga || point.max)} r="4" fill="#10b981" />
      ))}

      {/* Labels */}
      {dates.map((date, i) => (
        <text key={i} x={xScale(i)} y={height - padding + 15} fontSize="10" fill="#666" textAnchor="middle">
          {typeof date === 'string' ? date.slice(5) : ''}
        </text>
      ))}

      {[minPrice, maxPrice].map((price, i) => (
        <text key={i} x={padding - 10} y={yScale(price) + 4} fontSize="10" fill="#666" textAnchor="end">
          {price}
        </text>
      ))}
    </svg>
  );
};

const DetailSampah = ({ wasteId = 1 }) => {
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
        const wasteDetail = await wasteTypeService.getPublicWasteTypeDetail(wasteId);
        setWaste(wasteDetail.waste_type);
        
        // Extract value data from response - dengan validasi yang lebih baik
        const valueData = {
          harga_minimum: wasteDetail.waste_type.nilai_terkini?.min || 0,
          harga_maksimum: wasteDetail.waste_type.nilai_terkini?.max || 0,
          satuan: wasteDetail.waste_type.nilai_terkini?.satuan || 'kg',
          harga_trend: formatPriceHistory(wasteDetail.price_history || {})
        };
        setValues(valueData);

        // Fetch potential buyers
        const buyersResponse = await wasteTypeService.getPotentialBuyers(wasteId);
        setBuyers(buyersResponse.buyers || []);

        // Fetch related tutorials
        const tutorialsResponse = await wasteTypeService.getRelatedTutorials(wasteId);
        setTutorials(tutorialsResponse.tutorials || []);

        // Fetch related articles
        try {
          const articlesResponse = await axios.get(`/api/v1/public/articles?related_to_waste=${wasteId}`);
          setArticles(articlesResponse.data.data || []);
        } catch (error) {
          console.error("Error fetching related articles:", error);
          setArticles([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading waste data:", error);
        setError("Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.");
        setLoading(false);
      }
    };
    
    loadData();
  }, [wasteId]);

  // Helper function to format price history data
  const formatPriceHistory = (priceHistory) => {
    if (!priceHistory || Object.keys(priceHistory).length === 0) return [];
    
    return Object.entries(priceHistory).map(([date, values]) => ({
      tanggal: date,
      harga: values?.max || 0
    }));
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
  const images = waste.gambar ? (Array.isArray(waste.gambar) ? waste.gambar : [waste.gambar]) : [];

  const tabs = [
    {
      label: 'Panduan Pengumpulan & Penyimpanan',
      content: (
        <div>
          <h3 className="font-semibold mb-2">Cara Sortir</h3>
          <p className="mb-4 whitespace-pre-line">{waste.cara_sortir}</p>
          <h3 className="font-semibold mb-2">Cara Penyimpanan</h3>
          <p className="mb-4 whitespace-pre-line">{waste.cara_penyimpanan}</p>
        </div>
      ),
    },
    {
      label: 'Cara Pengolahan',
      content: (
        <div>
          {tutorials.length === 0 ? (
            <p>Tidak ada tutorial terkait.</p>
          ) : (
            <ul className="list-disc list-inside">
              {tutorials.map((t) => (
                <li key={t.id}>
                  <a href={`/tutorials/${t.id}`} className="text-green-600 hover:underline">
                    {t.judul}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ),
    },
    {
      label: 'Pembeli Potensial',
      content: (
        <div>
          {buyers.length === 0 ? (
            <p>Tidak ada pembeli potensial.</p>
          ) : (
            <table className="w-full text-left border border-gray-300 rounded">
              <thead className="bg-green-100">
                <tr>
                  <th className="p-2 border border-gray-300">Nama Pembeli</th>
                  <th className="p-2 border border-gray-300">Kontak</th>
                  <th className="p-2 border border-gray-300">Alamat</th>
                  <th className="p-2 border border-gray-300">Harga Beli</th>
                  <th className="p-2 border border-gray-300">Syarat Minimum</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((b) => (
                  <tr key={b.id} className="border-t border-gray-300">
                    <td className="p-2 border border-gray-300">{b.nama_pembeli}</td>
                    <td className="p-2 border border-gray-300">{b.kontak}</td>
                    <td className="p-2 border border-gray-300">{b.alamat}</td>
                    <td className="p-2 border border-gray-300">
                      {b.waste_types && b.waste_types.length > 0 
                        ? b.waste_types[0].harga_beli 
                        : 'Tidak tersedia'}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {b.waste_types && b.waste_types.length > 0 
                        ? b.waste_types[0].syarat_minimum 
                        : 'Tidak tersedia'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ),
    },
    {
      label: 'Dampak Lingkungan',
      content: (
        <div>
          <p>
            Pengelolaan sampah jenis ini dapat mengurangi pencemaran lingkungan dan meningkatkan
            daur ulang. Dampak positif meliputi pengurangan emisi gas rumah kaca dan penghematan
            sumber daya alam.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb
        items={[
          { label: 'Beranda', link: '/' },
          { label: 'Katalog Sampah', link: '/katalog' },
          { label: waste.nama },
        ]}
      />

      <h1 className="text-3xl font-bold mb-4">{waste.nama}</h1>

      <ImageCarousel images={images} />

      <div className="mt-6 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Informasi Umum</h2>
        <p className="mb-2 whitespace-pre-line">{waste.deskripsi}</p>
        <p className="mb-2">
          <strong>Kategori:</strong> {waste.kategori?.nama}
        </p>
        <p className="mb-2">
          <strong>Nilai Ekonomis:</strong> Rp {values.harga_minimum.toLocaleString()} - Rp{' '}
          {values.harga_maksimum.toLocaleString()} / {values.satuan}
        </p>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Grafik Tren Harga</h3>
          <PriceTrendChart data={values.harga_trend} />
        </div>
      </div>

      <div className="mt-8">
        <Tabs tabs={tabs} currentTab={currentTab} onChange={setCurrentTab} />
      </div>

      <div className="mt-8 flex space-x-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          onClick={() => alert('Fungsi Tambah ke Tracking belum diimplementasikan')}
        >
          Tambahkan ke Tracking
        </button>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
          onClick={() => alert('Fungsi Simpan ke Favorit belum diimplementasikan')}
        >
          Simpan ke Favorit
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          onClick={() => alert('Fungsi Bagikan belum diimplementasikan')}
        >
          Bagikan
        </button>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Konten Terkait</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Tutorial Terkait</h3>
            {tutorials.length === 0 ? (
              <p>Tidak ada tutorial terkait.</p>
            ) : (
              <ul className="list-disc list-inside">
                {tutorials.map((t) => (
                  <li key={t.id}>
                    <a href={`/tutorials/${t.id}`} className="text-green-600 hover:underline">
                      {t.judul}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Artikel Terkait</h3>
            {articles.length === 0 ? (
              <p>Tidak ada artikel terkait.</p>
            ) : (
              <ul className="list-disc list-inside">
              {articles.map((a) => (
                <li key={a.id}>
                  <a href={`/articles/${a.id}`} className="text-green-600 hover:underline">
                    {a.judul}
                  </a>
                </li>
              ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailSampah;
