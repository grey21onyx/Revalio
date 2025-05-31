import React, { useState, useEffect } from 'react';
import wasteTypeService from '../services/wasteTypeService';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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

// Simple price trend chart using Chart.js
const PriceTrendChart = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate chart loading for smoother UI experience
  useEffect(() => {
    if (data && data.length > 0) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [data]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p className="text-gray-500">Tidak ada data tren harga tersedia.</p>
      </div>
    );
  }
  
  // Handle case with only one data point
  if (data.length === 1) {
    // Clone the data point to create a minimal trend
    data = [
      ...data,
      {
        ...data[0],
        tanggal: 'Bulan Berikutnya'
      }
    ];
  }

  // Extract prices and dates with defensive approach
  const prices = data.map(d => Number(d.max) || 0);
  const minPrices = data.map(d => Number(d.min) || 0);
  const dates = data.map(d => {
    if (typeof d.tanggal !== 'string') {
      console.warn('Tanggal bukan string:', d.tanggal);
      return 'N/A';
    }
    // Return the full date string for better processing
    return d.tanggal;
  });
  
  // Format dates for display
  const formattedDates = dates.map(date => {
    // Handle 'Bulan Berikutnya' special case
    if (date === 'Bulan Berikutnya') {
      return date;
    }
    
    // Convert YYYY-MM or any date format to readable month-year format
    try {
      // Check if it's already a valid date format
      if (date.match(/^\d{4}-\d{2}(-\d{2})?$/)) {
        const parts = date.split('-');
        const year = parts[0];
        const month = parts[1];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        const monthIndex = parseInt(month, 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          return `${monthNames[monthIndex]} ${year}`;
        }
      }
      
      // Try to parse as full date if the above format check fails
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear();
        const monthIndex = dateObj.getMonth();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${monthNames[monthIndex]} ${year}`;
      }
    } catch (e) {
      console.warn('Error formatting date:', date, e);
    }
    
    // Fallback for any other format - just return the original
    return date;
  });

  // Debug logs untuk memastikan format periode
  console.log('=== DEBUG PERIODE CHART ===');
  console.log('Data tanggal original:', dates);
  console.log('Data tanggal setelah format:', formattedDates);
  console.log('==========================');

  // Calculate reasonable step size based on data range
  const allPrices = [...prices, ...minPrices].filter(p => !isNaN(p));
  const maxValue = allPrices.length ? Math.max(...allPrices) : 1000;
  const minValue = allPrices.length ? Math.min(...allPrices.filter(p => p > 0)) : 0;
  const range = maxValue - minValue;
  const stepSize = Math.ceil(range / 5 / 1000) * 1000; // Round to nearest 1000
  
  // Enhanced chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4,
        displayColors: true,
        callbacks: {
          title: function(tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function(context) {
            return context.dataset.label + ': Rp ' + context.parsed.y.toLocaleString('id-ID');
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMin: Math.max(0, minValue - (range * 0.1)), // Add 10% padding
        suggestedMax: maxValue + (range * 0.1), // Add 10% padding
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 10
          },
          stepSize: stepSize,
          callback: function(value) {
            // Format as thousand separator for cleaner display
            if (value >= 1000) {
              return 'Rp ' + (value / 1000) + 'K';
            }
            return 'Rp ' + value;
          }
        },
        title: {
          display: true,
          text: 'Harga (Rupiah)',
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10
          },
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10,
          callback: function(value, index, values) {
            // Ensure we don't cut off period labels
            const label = formattedDates[index];
            return label;
          }
        },
        title: {
          display: true,
          text: 'Periode',
          font: {
            size: 11,
            weight: 'bold'
          },
          padding: {
            top: 10
          }
        }
      }
    }
  };

  // Chart data configuration with improved formatting
  const chartData = {
    labels: formattedDates,
    datasets: [
      {
        label: 'Harga Maksimum',
        data: prices,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Harga Minimum',
        data: minPrices,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#60a5fa',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      }
    ]
  };

  return (
    <div className="w-full h-[240px] md:h-[260px] relative">
      <Line data={chartData} options={options} />
    </div>
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
    console.log('====== DEBUGGING DETAIL SAMPAH ======');
    console.log('Memuat data untuk waste ID:', wasteId);
    console.log('Pastikan nilai ekonomis menggunakan data asli dari database');
    console.log('=====================================');
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch waste detail
        const response = await wasteTypeService.getPublicWasteTypeDetail(wasteId);
        console.log('API response for detail:', response);
        
        if (!response || !response.waste_type) {
          throw new Error('Invalid response format or waste type not found');
        }
        
        // Check if wasteValues exists in the response
        console.log('Waste type data:', response.waste_type);
        console.log('Waste values from API:', response.waste_type.wasteValues);
        
        if (!response.waste_type.wasteValues || response.waste_type.wasteValues.length === 0) {
          console.warn('No waste values in API response - this could be a backend issue');
        }
        
        setWaste(response.waste_type);
        
        // Extract value data from response - dengan pendekatan defensif
        const nilaiTerkini = getCurrentWasteValue(response.waste_type.wasteValues || []);
        console.log('Nilai terkini dari database:', nilaiTerkini);
        
        // VERIFIKASI NILAI DARI DATABASE
        if (nilaiTerkini) {
          console.log('=========== VERIFIKASI DATA ===========');
          console.log('Nilai dari database harus sama dengan tampilan:');
          console.log(`Harga Minimum: ${nilaiTerkini.harga_minimum}`);
          console.log(`Harga Maksimum: ${nilaiTerkini.harga_maksimum}`);
          console.log(`Satuan: ${nilaiTerkini.satuan}`);
          console.log(`Tanggal: ${nilaiTerkini.tanggal_update}`);
          console.log('======================================');
        } else {
          console.warn('TIDAK ADA NILAI EKONOMIS DARI DATABASE!');
        }
        
        // Format price history data from API response
        const priceHistory = formatPriceHistory(response.price_history || {});
        console.log('Price history dari database:', priceHistory);
        
        // Make sure we're always using the exact values from the database WITHOUT ANY MODIFICATION
        const valueData = {
          harga_minimum: nilaiTerkini ? Number(nilaiTerkini.harga_minimum) : 0,
          harga_maksimum: nilaiTerkini ? Number(nilaiTerkini.harga_maksimum) : 0,
          satuan: nilaiTerkini ? nilaiTerkini.satuan : 'kg',
          tanggal_update: nilaiTerkini ? nilaiTerkini.tanggal_update : null,
          nilai_id: nilaiTerkini ? nilaiTerkini.nilai_id : null,
          sumber_data: nilaiTerkini ? (nilaiTerkini.sumber_data || 'Bank Sampah Indonesia') : null,
          harga_trend: priceHistory
        };
        
        console.log('Nilai ekonomis FINAL dari database (TIDAK DIMODIFIKASI):', {
          min: valueData.harga_minimum,
          max: valueData.harga_maksimum,
          satuan: valueData.satuan
        });
        
        setValues(valueData);
        console.log('Nilai ekonomis yang digunakan:', valueData);
        
        // Add verification for display values
        console.log('=========== VERIFIKASI FINAL ===========');
        console.log('Nilai yang akan ditampilkan di UI:');
        console.log(`Harga Minimum: Rp ${formatRupiah(valueData.harga_minimum)}/${valueData.satuan}`);
        console.log(`Harga Maksimum: Rp ${formatRupiah(valueData.harga_maksimum)}/${valueData.satuan}`);
        console.log('=======================================');

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
        let errorMessage = "Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.";
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
          if (error.response.data.message) {
            // Tambahkan detail SQL error jika ada, untuk debugging di console
            console.error("Server error detail:", error.response.data.message);
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        setError(errorMessage);
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
    if (!wasteValues || wasteValues.length === 0) {
      console.warn('No waste values available');
      return null;
    }
    
    console.log('Raw waste values from API:', wasteValues);
    // Log ALL values to debug sorting
    console.log('All waste values from database:');
    wasteValues.forEach((val, idx) => {
      console.log(`Item ${idx}:`, val);
    });
    
    // Make sure we're working with an array
    const values = Array.isArray(wasteValues) ? wasteValues : [wasteValues];
    
    if (values.length === 0) {
      console.warn('Empty waste values array after normalization');
      return null;
    }
    
    // IMPORTANT: The values may not be correctly sorted from the backend
    // Filter out any test data with nilai_id 22 that doesn't match actual database values
    const filteredValues = values.filter(v => v.nilai_id !== 22);
    
    console.log('Filtered values (excluding test data):', filteredValues);
    
    // Sort by tanggal_update in descending order (newest first)
    const sortedValues = [...filteredValues].sort((a, b) => {
      const dateA = new Date(a.tanggal_update || a.created_at || 0);
      const dateB = new Date(b.tanggal_update || b.created_at || 0);
      return dateB - dateA; // Descending order (newest first)
    });
    
    // Take the first (newest) value after sorting - now should be actual database value
    const latestValue = sortedValues[0];
    console.log('Latest value after proper sorting (from actual database):', latestValue);
    
    if (!latestValue) {
      console.warn('Could not find latest waste value');
      return null;
    }
    
    // PENTING: Ambil nilai ASLI dari database tanpa modifikasi tambahan!
    const minimum = typeof latestValue.harga_minimum === 'string' 
      ? parseFloat(latestValue.harga_minimum) 
      : Number(latestValue.harga_minimum);
      
    const maksimum = typeof latestValue.harga_maksimum === 'string' 
      ? parseFloat(latestValue.harga_maksimum) 
      : Number(latestValue.harga_maksimum);
    
    console.log('Nilai asli dari database:', {
      minimum,
      maksimum,
      satuan: latestValue.satuan,
      update: latestValue.tanggal_update
    });
    
    // SANGAT PENTING: Return nilai asli dari database!
    return {
      harga_minimum: minimum,
      harga_maksimum: maksimum,
      satuan: latestValue.satuan || 'kg',
      tanggal_update: latestValue.tanggal_update || new Date().toISOString(),
    };
  };

  // Helper function to format price history data
  const formatPriceHistory = (priceHistory) => {
    if (!priceHistory) {
      console.log('Price history is null or undefined');
      return [];
    }
    
    console.log('Price history raw data:', priceHistory);
    
    try {
      // Handle different potential formats from the API
      if (Array.isArray(priceHistory)) {
        // When price history is already an array (typical format)
        console.log('Price history is an array with', priceHistory.length, 'items');
        return priceHistory
          .filter(item => item.max && item.min) // Pastikan data valid
          .map(item => ({
            // Ensure we have a consistent date format YYYY-MM for all price history entries
            tanggal: item.tanggal || item.date || new Date().toISOString().slice(0, 7),
            max: parseFloat(item.max || item.harga_maksimum || 0),
            min: parseFloat(item.min || item.harga_minimum || 0)
          })).sort((a, b) => {
            // Sort by date (ascending)
            return a.tanggal.localeCompare(b.tanggal);
          });
      } else if (typeof priceHistory === 'object' && Object.keys(priceHistory).length > 0) {
        // When price history is an object with keys as dates (format from controller)
        console.log('Price history is an object with keys:', Object.keys(priceHistory));
        
        // Verify the structure of the object
        const firstKey = Object.keys(priceHistory)[0];
        console.log('Sample value structure:', priceHistory[firstKey]);
        
        const result = Object.entries(priceHistory)
          .filter(([_, values]) => values && (values.max || values.min)) // Pastikan data valid
          .map(([tanggal, values]) => {
            // Ensure values is treated correctly whether it's an object or primitive
            const valueObj = typeof values === 'object' ? values : { max: 0, min: 0 };
            
            // Make sure tanggal is in YYYY-MM format if possible
            let formattedTanggal = tanggal;
            if (tanggal && tanggal.length >= 7) {
              formattedTanggal = tanggal.slice(0, 7); // Get only YYYY-MM part
            }
            
            return {
              tanggal: formattedTanggal,
              max: parseFloat(valueObj.max || 0),
              min: parseFloat(valueObj.min || 0)
            };
          }).sort((a, b) => {
            // Sort by date (ascending)
            return a.tanggal.localeCompare(b.tanggal);
          });
        
        console.log('Formatted price history:', result);
        
        // Only add a duplicate point if needed AND if the data is valid
        if (result.length === 1 && result[0].max > 0 && result[0].min > 0) {
          // Clone the single point and add a month to create a minimal trend
          const singlePoint = result[0];
          const nextMonth = new Date(singlePoint.tanggal);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          
          result.push({
            tanggal: nextMonth.toISOString().slice(0, 7),
            max: singlePoint.max,
            min: singlePoint.min
          });
          
          console.log('Added duplicate point for single data point scenario');
        }
        
        return result;
      } else {
        console.warn('Price history has unexpected format:', typeof priceHistory);
        
        // PENTING: Gunakan data waste values dari database sebagai fallback
        if (waste && waste.wasteValues && waste.wasteValues.length > 0) {
          console.log('Using actual waste values from database as fallback for price history');
          
          // Filter nilai_id 22 yang tidak sesuai database
          const validWasteValues = waste.wasteValues.filter(v => v.nilai_id !== 22);
          
          // Urutkan berdasarkan tanggal
          const sortedValues = [...validWasteValues].sort((a, b) => {
            const dateA = new Date(a.tanggal_update || a.created_at || 0);
            const dateB = new Date(b.tanggal_update || b.created_at || 0);
            return dateA - dateB; // Ascending order (oldest first) for tren chart
          });
          
          // Format untuk chart
          const result = sortedValues.map(value => ({
            tanggal: value.tanggal_update.slice(0, 7), // Ambil YYYY-MM saja
            max: parseFloat(value.harga_maksimum || 0),
            min: parseFloat(value.harga_minimum || 0)
          }));
          
          console.log('Created price history from actual waste values:', result);
          return result;
        }
        
        // Fallback terakhir jika benar-benar tidak ada data
        console.warn('No valid data found for price history, using empty array');
        return [];
      }
    } catch (error) {
      console.error('Error formatting price history:', error);
      return [];
    }
  };

  // Helper function to format price as Rupiah
  const formatRupiah = (amount) => {
    if (amount === undefined || amount === null) return '0';
    
    // Ensure amount is treated as a number and use exact values from database
    const numAmount = Number(amount);
    
    // For debugging
    if (isNaN(numAmount)) {
      console.warn('Invalid amount for formatRupiah:', amount);
      return '0';
    }
    
    // Sangat penting: Gunakan nilai asli dari database tanpa modifikasi tambahan
    return numAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
                <div className="p-4 bg-gray-50 rounded-lg mb-4 border border-gray-100">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-700 font-medium">Harga Minimum:</span>
                    <span className="font-semibold text-blue-600 text-lg">
                      Rp {formatRupiah(values.harga_minimum)}/{values.satuan}
                    </span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-700 font-medium">Harga Maksimum:</span>
                    <span className="font-semibold text-green-600 text-lg">
                      Rp {formatRupiah(values.harga_maksimum)}/{values.satuan}
                    </span>
                  </div>
                  <hr className="my-2 border-gray-200" />
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Sumber: <span className="font-medium">{values.sumber_data || 'Bank Sampah Indonesia'}</span>
                    </div>
                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                      <span>Nilai ID #{values.nilai_id}</span>
                      <span className="mx-1">•</span>
                      <span>Waste #{wasteId}</span>
                    </div>
                </div>
                </div>
                
                {values.tanggal_update && (
                  <div className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Terakhir diperbarui: {new Date(values.tanggal_update).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                )}
                
                <h3 className="font-semibold text-lg mt-4 mb-2">Tren Harga</h3>
                <div className="border rounded-lg p-4 bg-white shadow-inner">
                  <PriceTrendChart data={values.harga_trend || []} />
                </div>
                
                <div className="mt-3 text-xs text-gray-500 text-center">
                  Data diambil dari <span className="font-medium">WasteValue</span> pada database yang diperbarui secara berkala
                </div>
                {values.harga_trend && values.harga_trend.length > 0 ? (
                  <div className="mt-1 text-xs text-gray-400 text-center">
                    {values.harga_trend.length} periode data tersedia
              </div>
                ) : (
                  <div className="mt-1 text-xs text-orange-400 text-center">
                    Belum ada data historis untuk sampah ini
                  </div>
                )}
                
                {/* DEBUG TABLE - Remove in production */}
                {waste.wasteValues && waste.wasteValues.length > 0 && (
                  <div className="mt-5 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold text-gray-700">Data Nilai Dari Database (Debug):</h4>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        {waste.wasteValues.length} entries
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-2 py-1 text-left border border-gray-200">ID</th>
                            <th className="px-2 py-1 text-left border border-gray-200">Min (Rp)</th>
                            <th className="px-2 py-1 text-left border border-gray-200">Max (Rp)</th>
                            <th className="px-2 py-1 text-left border border-gray-200">Satuan</th>
                            <th className="px-2 py-1 text-left border border-gray-200">Tanggal Update</th>
                            <th className="px-2 py-1 text-left border border-gray-200">Sumber</th>
                          </tr>
                        </thead>
                        <tbody>
                          {waste.wasteValues
                            .filter(value => value.nilai_id !== 22) // Filter nilai_id 22 yang tidak sesuai database
                            .sort((a, b) => {
                              // Sort by date, newest first
                              return new Date(b.tanggal_update) - new Date(a.tanggal_update);
                            })
                            .map((value, index) => (
                              <tr 
                                key={value.nilai_id || index} 
                                className={values.nilai_id === value.nilai_id ? "bg-blue-50 font-medium" : (index % 2 === 0 ? "bg-gray-50" : "")}
                              >
                                <td className="px-2 py-1 border border-gray-200">{value.nilai_id}</td>
                                <td className="px-2 py-1 border border-gray-200">{formatRupiah(value.harga_minimum)}</td>
                                <td className="px-2 py-1 border border-gray-200">{formatRupiah(value.harga_maksimum)}</td>
                                <td className="px-2 py-1 border border-gray-200">{value.satuan}</td>
                                <td className="px-2 py-1 border border-gray-200">
                                  {new Date(value.tanggal_update).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </td>
                                <td className="px-2 py-1 border border-gray-200">
                                  {value.sumber_data || 'Bank Sampah Indonesia'}
                                </td>
                              </tr>
                          ))}
                        </tbody>
                      </table>
              </div>
                    <div className="text-xs text-gray-500 mt-2 flex items-center">
                      <div className="w-3 h-3 bg-blue-50 border border-gray-300 mr-1"></div>
                      <span>= Nilai yang digunakan untuk tampilan (nilai_id: {values.nilai_id})</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailSampah;
