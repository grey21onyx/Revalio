import React, { useState, useEffect } from 'react';

// Dummy fetch functions to simulate API calls - replace with real API calls
const fetchWasteDetail = async (wasteId) => {
  // Simulate fetching waste detail including category and images
  return {
    waste_id: wasteId,
    nama_sampah: 'Plastik PET',
    deskripsi: 'Sampah plastik PET yang umum digunakan untuk botol minuman.',
    cara_sortir: 'Pisahkan dari sampah organik dan keringkan.',
    cara_penyimpanan: 'Simpan di tempat kering dan terlindung dari sinar matahari langsung.',
    gambar: ['plastik1.jpg', 'plastik2.jpg'],
    kategori: { kategori_id: 1, nama_kategori: 'Plastik' },
  };
};

const fetchWasteValues = async (wasteId) => {
  // Simulate fetching economic values and price history
  return {
    harga_minimum: 1000,
    harga_maksimum: 3000,
    satuan: 'kg',
    harga_trend: [
      { tanggal: '2023-01-01', harga: 1200 },
      { tanggal: '2023-02-01', harga: 1500 },
      { tanggal: '2023-03-01', harga: 1800 },
      { tanggal: '2023-04-01', harga: 2000 },
      { tanggal: '2023-05-01', harga: 2500 },
    ],
  };
};

const fetchWasteBuyers = async (wasteId) => {
  // Simulate fetching potential buyers
  return [
    {
      pembeli_id: 1,
      nama_pembeli: 'Bank Sampah Sejahtera',
      kontak: '08123456789',
      alamat: 'Jl. Kebersihan No. 10',
      harga_beli: 2800,
      syarat_minimum: 'Minimal 5 kg',
    },
    {
      pembeli_id: 2,
      nama_pembeli: 'Pengepul Plastik Makmur',
      kontak: '08234567890',
      alamat: 'Jl. Industri No. 5',
      harga_beli: 2900,
      syarat_minimum: 'Minimal 10 kg',
    },
  ];
};

const fetchTutorials = async (wasteId) => {
  // Simulate fetching related tutorials
  return [
    { tutorial_id: 1, judul: 'Cara Mendaur Ulang Plastik PET', link: '/tutorials/1' },
    { tutorial_id: 2, judul: 'Reuse Plastik untuk Kerajinan', link: '/tutorials/2' },
  ];
};

const fetchArticles = async () => {
  // Simulate fetching related articles
  return [
    { artikel_id: 1, judul: 'Manfaat Mendaur Ulang Sampah Plastik', link: '/articles/1' },
    { artikel_id: 2, judul: 'Dampak Positif Pengelolaan Sampah', link: '/articles/2' },
  ];
};

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
        src={`/assets/images/${images[current]}`}
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
  const prices = data.map(d => d.harga);
  const dates = data.map(d => d.tanggal);

  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  // Scale functions
  const xScale = (index) => padding + (index * (width - 2 * padding)) / (data.length - 1);
  const yScale = (price) => height - padding - ((price - minPrice) * (height - 2 * padding)) / (maxPrice - minPrice);

  // Build path
  const pathD = data
    .map((point, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)} ${yScale(point.harga)}`)
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
        <circle key={i} cx={xScale(i)} cy={yScale(point.harga)} r="4" fill="#10b981" />
      ))}

      {/* Labels */}
      {dates.map((date, i) => (
        <text key={i} x={xScale(i)} y={height - padding + 15} fontSize="10" fill="#666" textAnchor="middle">
          {date.slice(5)}
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

  useEffect(() => {
    const loadData = async () => {
      const wasteData = await fetchWasteDetail(wasteId);
      setWaste(wasteData);

      const valuesData = await fetchWasteValues(wasteId);
      setValues(valuesData);

      const buyersData = await fetchWasteBuyers(wasteId);
      setBuyers(buyersData);

      const tutorialsData = await fetchTutorials(wasteId);
      setTutorials(tutorialsData);

      const articlesData = await fetchArticles();
      setArticles(articlesData);
    };
    loadData();
  }, [wasteId]);

  if (!waste || !values) {
    return <div className="container mx-auto py-8 px-4">Loading...</div>;
  }

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
                <li key={t.tutorial_id}>
                  <a href={t.link} className="text-green-600 hover:underline">
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
                  <tr key={b.pembeli_id} className="border-t border-gray-300">
                    <td className="p-2 border border-gray-300">{b.nama_pembeli}</td>
                    <td className="p-2 border border-gray-300">{b.kontak}</td>
                    <td className="p-2 border border-gray-300">{b.alamat}</td>
                    <td className="p-2 border border-gray-300">{b.harga_beli}</td>
                    <td className="p-2 border border-gray-300">{b.syarat_minimum}</td>
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
          { label: waste.nama_sampah },
        ]}
      />

      <h1 className="text-3xl font-bold mb-4">{waste.nama_sampah}</h1>

      <ImageCarousel images={waste.gambar} />

      <div className="mt-6 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Informasi Umum</h2>
        <p className="mb-2 whitespace-pre-line">{waste.deskripsi}</p>
        <p className="mb-2">
          <strong>Kategori:</strong> {waste.kategori.nama_kategori}
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
                  <li key={t.tutorial_id}>
                    <a href={t.link} className="text-green-600 hover:underline">
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
                <li key={a.artikel_id}>
                  <a href={a.link} className="text-green-600 hover:underline">
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
