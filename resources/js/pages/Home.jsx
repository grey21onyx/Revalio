import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Container, 
  Button,
  Stack,
  useTheme,
  Divider,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Rating
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon, 
  ArrowForward as ArrowForwardIcon,
  ChevronRight as ChevronRightIcon,
  ExitToApp as ExitToAppIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Import komponen ScrollToTop
import ScrollToTop from '../components/ui/ScrollToTop';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Import komponen kustom
import WasteCardItem from '../components/ui/WasteCardItem';
import TutorialCard from '../components/ui/TutorialCard';
import api from '../services/api'; // Import API service

// Data dummy untuk tampilan (bisa dipindahkan ke state jika perlu)
const featuredWasteItems = [
  {
    id: 1,
    name: 'Botol Plastik PET',
    description: 'Botol plastik minuman bekas yang dapat didaur ulang menjadi berbagai produk baru',
    imageUrl: '/assets/images/waste/botol-plastik.jpg',
    category: 'Plastik',
    categoryId: 1,
    priceRange: { min: 8000, max: 10000 },
    unit: 'kg',
    isRecyclable: true,
    isReusable: true,
  },
  {
    id: 2,
    name: 'Kardus Bekas',
    description: 'Kardus bekas packaging yang dapat didaur ulang atau digunakan kembali',
    imageUrl: '/assets/images/waste/kardus.jpg',
    category: 'Kertas',
    categoryId: 2,
    priceRange: { min: 2000, max: 3000 },
    unit: 'kg',
    isRecyclable: true,
    isReusable: true,
  },
  {
    id: 3,
    name: 'Kaleng Aluminium',
    description: 'Kaleng minuman aluminium yang memiliki nilai ekonomis tinggi',
    imageUrl: '/assets/images/waste/kaleng.jpeg',
    category: 'Logam',
    categoryId: 3,
    priceRange: { min: 11000, max: 14000 },
    unit: 'kg',
    isRecyclable: true,
    isReusable: false,
  }
];

const featuredTutorials = [
  {
    id: 1,
    title: 'Ecobrick dari Botol Plastik',
    description: 'Membuat ecobrick dari botol plastik bekas untuk konstruksi ramah lingkungan',
    imageUrl: '/assets/images/tutorials/ecobrick.png',
    difficulty: 'EASY',
    estimasiWaktu: 45,
    rating: 4.5,
    jenisTutorial: 'reuse',
  },
  {
    id: 2,
    title: 'Kerajinan dari Koran Bekas',
    description: 'Membuat kerajinan tangan dari koran bekas yang bernilai estetika',
    imageUrl: '/assets/images/tutorials/koran.jpg',
    difficulty: 'MODERATE',
    estimasiWaktu: 120,
    rating: 4.2,
    jenisTutorial: 'daur ulang',
  }
];

// Component for section headings (sama seperti di LandingPage.jsx)
const SectionHeading = ({ title, subtitle, actionText, actionLink }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          fontWeight={700}
          sx={{
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 60,
              height: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.primary.main
            }
          }}
        >
          {title}
        </Typography>
        
        {actionText && actionLink && (
          <Button 
            component={Link} 
            to={actionLink}
            endIcon={<ArrowForwardIcon />}
            variant="text"
            color="primary"
            sx={{
              fontWeight: 600,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateX(4px)'
              }
            }}
          >
            {actionText}
          </Button>
        )}
      </Box>
      
      {subtitle && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 2.5, mb: 3, maxWidth: '70ch' }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

// Tambahkan fungsi helper untuk mendapatkan kategori dari tags
const getCategoryFromTags = (tags) => {
  if (!tags) return 'Umum';
  
  try {
    // Pastikan tags adalah string, bukan array atau null
    const tagString = typeof tags === 'string' ? tags : '';
    if (!tagString) return 'Umum';
    
    const tagList = tagString.toLowerCase().split(',');
    
    // Cek secara case-insensitive
    if (tagList.some(tag => tag.includes('tips') || tag.includes('trik'))) {
      return 'Tips & Trik';
    } else if (tagList.some(tag => tag.includes('daur') || tag.includes('recycling'))) {
      return 'Daur Ulang';
    }
    return 'Umum';
  } catch (error) {
    console.error('Error processing tags:', error);
    return 'Umum';
  }
};

const Home = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Refs untuk section di dashboard
  const wasteItemsRef = useRef(null);
  const tutorialsRef = useRef(null);
  const articlesRef = useRef(null);
  const communityRef = useRef(null);
  const statsRef = useRef(null);
  
  // State untuk data dinamis
  const [wasteItems, setWasteItems] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [articles, setArticles] = useState([]);
  const [communityThreads, setCommunityThreads] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [userName, setUserName] = useState('');
  
  // State untuk loading dan error
  const [loading, setLoading] = useState({
    waste: false,
    tutorials: false,
    articles: false,
    community: false,
    stats: false
  });
  const [error, setError] = useState({
    waste: null,
    tutorials: null,
    articles: null,
    community: null,
    stats: null
  });

  // Check for login success
  useEffect(() => {
    // Check if user just logged in
    const loginSuccess = sessionStorage.getItem('loginSuccess');
    if (loginSuccess === 'true') {
      // Show success alert
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Login Berhasil',
          text: 'Selamat datang kembali di Revalio',
          showConfirmButton: false,
          timer: 1500
        });
      }, 500);
      
      // Clear the flag
      sessionStorage.removeItem('loginSuccess');
    }
  }, []);
  
  // Fungsi untuk mengambil data sampah unggulan
  const fetchWasteItems = async () => {
    setLoading(prev => ({ ...prev, waste: true }));
    try {
      // Ganti dengan panggilan API sesungguhnya
      // const response = await axios.get('/api/waste-items/featured');
      // setWasteItems(response.data);
      setTimeout(() => {
        setWasteItems(featuredWasteItems);
        setLoading(prev => ({ ...prev, waste: false }));
      }, 500);
    } catch (err) {
      console.error('Error fetching waste items:', err);
      setError(prev => ({ ...prev, waste: 'Gagal memuat data sampah unggulan' }));
      setLoading(prev => ({ ...prev, waste: false }));
    }
  };
  
  // Fungsi untuk mengambil data tutorial unggulan
  const fetchTutorials = async () => {
    setLoading(prev => ({ ...prev, tutorials: true }));
    try {
      // Ganti dengan panggilan API sesungguhnya
      // const response = await axios.get('/api/tutorials/featured');
      // setTutorials(response.data);
      setTimeout(() => {
        setTutorials(featuredTutorials);
        setLoading(prev => ({ ...prev, tutorials: false }));
      }, 700);
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError(prev => ({ ...prev, tutorials: 'Gagal memuat data tutorial unggulan' }));
      setLoading(prev => ({ ...prev, tutorials: false }));
    }
  };
  
  // Fungsi untuk mengambil data artikel terbaru
  const fetchArticles = async () => {
    setLoading(prev => ({ ...prev, articles: true }));
    try {
      // Ganti dengan panggilan API sesungguhnya
      // const response = await axios.get('/api/articles/latest');
      // setArticles(response.data);
      setTimeout(() => {
        setArticles([
          {
            id: 1,
            title: 'Mengenal Jenis Plastik yang Bernilai Ekonomis',
            excerpt: 'Tidak semua plastik memiliki nilai yang sama. Pelajari jenis plastik yang paling dicari oleh pengepul...',
            imageUrl: '/assets/images/tutorials/green.png',
            createdAt: '2023-05-15',
            author: 'Tim Revalio'
          },
          {
            id: 2,
            title: 'Cara Memulai Bank Sampah di Lingkungan Anda',
            excerpt: 'Panduan lengkap memulai bank sampah di RT/RW, mulai dari perizinan hingga operasional harian...',
            imageUrl: '/assets/images/tutorials/green.png',
            createdAt: '2023-05-10',
            author: 'Tim Revalio'
          }
        ]);
        setLoading(prev => ({ ...prev, articles: false }));
      }, 800);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(prev => ({ ...prev, articles: 'Gagal memuat data artikel terbaru' }));
      setLoading(prev => ({ ...prev, articles: false }));
    }
  };
  
  // Fungsi untuk mengambil data aktivitas komunitas terkini
  const fetchCommunityThreads = async () => {
    setLoading(prev => ({ ...prev, community: true }));
    console.log('Memulai fetchCommunityThreads...'); // Debugging
    try {
      // Menggunakan API yang sama dengan halaman Forum.jsx untuk mendapatkan thread populer
      console.log('Memanggil API: /public/forum-threads/popular'); // Debugging
      const response = await api.get('/public/forum-threads/popular', { params: { limit: 3 } });
      console.log('Response API:', response); // Debugging - tampilkan seluruh response
      console.log('Forum threads response data:', response.data); // Debugging
      
      // Validasi format response
      if (!response.data || !Array.isArray(response.data.data)) {
        console.error('Invalid response format:', response.data);
        console.log('Format data tidak valid - type:', typeof response.data, 'data:', response.data); // Debugging
        setError(prev => ({ ...prev, community: 'Format data tidak valid. Silakan coba lagi.' }));
        return;
      }
      
      console.log('Jumlah thread yang ditemukan:', response.data.data.length); // Debugging
      
      // Format data dari API ke format yang digunakan di frontend
      const formattedThreads = response.data.data.map(thread => {
        // Validasi data dan pastikan tipe data numerik dengan fallback
        const commentsCount = parseInt(thread.comments_count) || 0;
        const likesCount = parseInt(thread.likes_count) || 0;
        const viewCount = parseInt(thread.view_count) || 0;
        
        // Penanganan khusus untuk average_rating dengan validasi yang lebih ketat
        let avgRating = 0;
        if (thread.average_rating !== undefined && thread.average_rating !== null) {
          // Coba konversi ke float dengan sanitasi
          if (typeof thread.average_rating === 'string') {
            avgRating = parseFloat(thread.average_rating.replace(/[^\d.-]/g, '')) || 0;
          } else {
            avgRating = parseFloat(thread.average_rating) || 0;
          }
        }
        
        // Validasi kisaran rating (1-5)
        const validRating = avgRating > 0 && avgRating <= 5 ? avgRating : 0;
        
        // Penanganan khusus untuk rating_count
        const ratingCount = thread.rating_count !== undefined && thread.rating_count !== null
          ? parseInt(thread.rating_count)
          : 0;
        
        // Calculate popularity score dengan validasi
        const commentScore = commentsCount * 2;
        const likeScore = likesCount * 3;
        const viewScore = viewCount * 0.5;
        const ratingScore = validRating * 5;
        const popularityScore = commentScore + likeScore + viewScore + ratingScore;
        
        return {
          id: thread.id || thread.thread_id,
          title: thread.judul || 'Tanpa Judul',
          excerpt: thread.konten 
            ? thread.konten.replace(/<[^>]*>?/gm, ' ').substring(0, 120) + '...' 
            : 'Tidak ada deskripsi',
          author: thread.user ? (thread.user.nama || thread.user.name || 'Pengguna') : 'Pengguna',
          replies: commentsCount,
          likes: likesCount,
          views: viewCount,
          rating: validRating,
          rating_count: ratingCount,
          lastActivity: thread.tanggal_posting || new Date().toISOString(),
          category: getCategoryFromTags(thread.tags),
          tags: thread.tags ? thread.tags.split(',').filter(tag => tag.trim()) : [],
          popularityScore: popularityScore
        };
      });
      
      // Sort berdasarkan popularityScore (terpopuler)
      formattedThreads.sort((a, b) => b.popularityScore - a.popularityScore);
      
      console.log('Formatted community threads (final):', formattedThreads); // Debugging
      console.log('Setting state communityThreads dengan', formattedThreads.length, 'items'); // Debugging
      setCommunityThreads(formattedThreads.slice(0, 3)); // Batasi hanya 3 thread terpopuler
    } catch (err) {
      console.error('Error fetching community threads:', err);
      console.error('Error details:', err.response?.status, err.response?.data); // Debugging detail error
      setError(prev => ({ ...prev, community: 'Gagal memuat data aktivitas komunitas' }));
    } finally {
      console.log('fetchCommunityThreads selesai'); // Debugging
      setLoading(prev => ({ ...prev, community: false }));
    }
  };
  
  // Fungsi untuk mengambil statistik pengguna
  const fetchUserStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      // Mengambil data tracking dari API yang sama dengan Tracking.jsx
      const response = await api.get('/user-waste-trackings');
      
      if (response?.data?.data && Array.isArray(response.data.data)) {
        const trackingData = response.data.data;
        
        // Hitung total sampah (kg)
        const totalSampah = trackingData.reduce((total, record) => {
          return total + parseFloat(record.amount || 0);
        }, 0);
        
        // Hitung total nilai ekonomi (Rp)
        const nilaiEkonomi = trackingData.reduce((total, record) => {
          return total + parseFloat(record.estimated_value || 0);
        }, 0);
        
        // Temukan tanggal input terakhir
        const sortedByDate = [...trackingData].sort((a, b) => {
          return new Date(b.tracking_date) - new Date(a.tracking_date);
        });
        const sampahTerakhir = sortedByDate.length > 0 ? sortedByDate[0].tracking_date : '';
        
        // Hitung kategori favorit (yang paling sering)
        const kategoriCount = {};
        trackingData.forEach(record => {
          // Coba dapatkan kategori dari category_name atau dari waste_name
          // Ini fleksibel untuk menangani berbagai format data
          const kategori = record.category_name || (record.waste_name ? record.waste_name.split(' ')[0] : 'Uncategorized');
          kategoriCount[kategori] = (kategoriCount[kategori] || 0) + 1;
        });
        
        let kategoriTerbanyak = 'Belum ada';
        let maxCount = 0;
        
        Object.entries(kategoriCount).forEach(([kategori, count]) => {
          if (count > maxCount) {
            maxCount = count;
            kategoriTerbanyak = kategori;
          }
        });
        
        // Set statistik user
        setUserStats({
          totalSampah: parseFloat(totalSampah.toFixed(2)),
          nilaiEkonomi: nilaiEkonomi,
          sampahTerakhir: sampahTerakhir,
          kategoriTerbanyak: kategoriTerbanyak
        });
      } else {
        // Jika belum ada data tracking
        setUserStats({
          totalSampah: 0,
          nilaiEkonomi: 0,
          sampahTerakhir: '',
          kategoriTerbanyak: 'Belum ada'
        });
      }
      
      setLoading(prev => ({ ...prev, stats: false }));
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(prev => ({ ...prev, stats: 'Gagal memuat data statistik pengguna' }));
      setLoading(prev => ({ ...prev, stats: false }));
      
      // Fallback ke data dummy untuk development/demo
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using dummy data for user stats as fallback');
        setUserStats({
          totalSampah: 0,
          nilaiEkonomi: 0,
          sampahTerakhir: '',
          kategoriTerbanyak: 'Belum ada'
        });
        setLoading(prev => ({ ...prev, stats: false }));
      }
    }
  };
  
  // Handle dummy toggle favorite
  const handleToggleFavorite = (id) => {
    console.log(`Toggle favorite for waste item ${id}`);
  };

  // Handle dummy toggle save
  const handleToggleSave = (id) => {
    console.log(`Toggle save for tutorial ${id}`);
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Belum ada input';
    
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Format tanggal tidak valid';
    }
  };

  // Format time ago helper
  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      if (isNaN(date.getTime())) {
        console.warn('Invalid date format:', dateString);
        return 'beberapa waktu lalu';
      }
      
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) return `${diffInDays} hari yang lalu`;
      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) return `${diffInMonths} bulan yang lalu`;
      const diffInYears = Math.floor(diffInMonths / 12);
      return `${diffInYears} tahun yang lalu`;
    } catch (error) {
      console.error('Error calculating time ago:', error);
      return 'beberapa waktu lalu';
    }
  };

  // Function to handle thread click navigation
  const handleThreadClick = (threadId) => {
    if (!threadId) {
      console.error('Invalid thread ID:', threadId);
      return;
    }
    navigate(`/detail-forum/${threadId}`);
  };

  // Tambahkan fungsi handleLogout
  const handleLogout = () => {
    // Tampilkan konfirmasi logout dengan SweetAlert
    Swal.fire({
      title: 'Logout',
      text: 'Apakah Anda yakin ingin keluar dari akun?',
      icon: 'question', 
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: theme.palette.error.main,
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proses logout
        logout();
        
        // Tampilkan notifikasi sukses
        Swal.fire({
          title: 'Berhasil Logout',
          text: 'Anda telah berhasil keluar dari sistem',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Arahkan ke halaman login
          navigate('/login');
        });
      }
    });
  };

  useEffect(() => {
    // Animasi untuk section-section dashboard
    const sections = [
      wasteItemsRef, 
      tutorialsRef, 
      articlesRef, 
      communityRef, 
    ].filter(ref => ref.current); 
    
    try {
      // Animasi section
      sections.forEach((sectionRef, index) => {
        if (sectionRef.current) {
          gsap.fromTo(
            sectionRef.current,
            { opacity: 0, y: 50 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.8,
              delay: 0.1 * index,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
      
      // Animasi stat cards
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll('.MuiCard-root');
        if (statCards && statCards.length > 0) {
          gsap.fromTo(
            Array.from(statCards),
            { opacity: 0, y: 30 },
            { 
              opacity: 1, 
              y: 0, 
              stagger: 0.15,
              duration: 0.6,
              ease: "power2.out",
              delay: 0.4,
              scrollTrigger: {
                trigger: statsRef.current,
                start: "top 85%",
              }
            }
          );
        }
      }
      
      // Animasi waste cards
      const wasteCards = document.querySelectorAll('.waste-card');
      if (wasteCards && wasteCards.length > 0) {
        Array.from(wasteCards).forEach(card => {
          if (!card) return;
          
          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            gsap.to(card, {
              rotateX: rotateX,
              rotateY: rotateY,
              transformPerspective: 1000,
              duration: 0.5,
              ease: "power1.out"
            });
          });
          
          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              duration: 0.5,
              ease: "elastic.out(1, 0.5)"
            });
          });
        });
      }
      
      // Media query animations
      const mm = gsap.matchMedia();
      mm.add("(max-width: 768px)", () => {
        try {
          if (tutorialsRef.current) {
            const tutorialCardsContainer = tutorialsRef.current.querySelector('.MuiGrid-container');
            if (tutorialCardsContainer) {
              gsap.set(tutorialsRef.current, { overflowX: 'auto', overflowY: 'hidden' });
              gsap.set(tutorialCardsContainer, { display: 'flex', flexWrap: 'nowrap', gap: '16px', paddingBottom: '16px' });
              
              const tutorialItems = Array.from(tutorialCardsContainer.querySelectorAll('.MuiGrid-item') || []);
              
              if (tutorialItems.length > 0) {
                const containerAnim = gsap.to(tutorialsRef.current, {
                  x: 0, // Nilai dummy untuk trigger
                  scrollTrigger: {
                    trigger: tutorialsRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: true
                  }
                });
                
                tutorialItems.forEach((item) => {
                  if (item) {
                    gsap.to(item, {
                      scale: 1.02,
                      duration: 0.3,
                      scrollTrigger: {
                        trigger: item,
                        start: "left center",
                        end: "right center",
                        containerAnimation: containerAnim,
                        scrub: true
                      }
                    });
                  }
                });
              }
            }
          }
        } catch (error) {
          console.error('Error in GSAP tutorial animations:', error);
        }
        return () => { /* cleanup */ };
      });
      
      // Fetch data
      fetchUserStats();
      fetchWasteItems();
      fetchTutorials();
      fetchArticles();
      fetchCommunityThreads();
      
      // Return cleanup function
      return () => {
        ScrollTrigger.getAll().forEach(st => st.kill());
        mm.revert();
      };
    } catch (error) {
      console.error('Error in GSAP animations:', error);
      
      // Masih fetch data jika animasi error
      fetchUserStats();
      fetchWasteItems();
      fetchTutorials();
      fetchArticles();
      fetchCommunityThreads();
      
      return () => {};
    }
  }, []);

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Welcome Message and User Stats */}
        <Box sx={{ mb: { xs: 4, md: 6 } }} ref={statsRef}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
              Selamat Datang Kembali, {user ? (user.nama_lengkap || user.nama || user.name || 'Pengguna Revalio') : 'Pengguna Revalio'}!
            </Typography>
            <Button 
              variant="outlined" 
              color="error"
              startIcon={<ExitToAppIcon />}
              onClick={handleLogout}
              sx={{ borderRadius: 8 }}
            >
              Logout
            </Button>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Berikut adalah ringkasan aktivitas dan pencapaian Anda di Revalio.
          </Typography>

          {loading.stats ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
          ) : error.stats ? (
            <Alert severity="error" sx={{ mb: 3 }}>{error.stats}</Alert>
          ) : userStats ? (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Total Sampah Dikelola</Typography>
                    <Typography variant="h4" color="primary.main" fontWeight={700}>{userStats.totalSampah} kg</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Estimasi Nilai Ekonomi</Typography>
                    <Typography variant="h4" color="secondary.main" fontWeight={700}>{formatCurrency(userStats.nilaiEkonomi)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Input Terakhir</Typography>
                    <Typography variant="h5" fontWeight={500}>{formatDate(userStats.sampahTerakhir)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Kategori Favorit</Typography>
                    <Typography variant="h5" fontWeight={500}>{userStats.kategoriTerbanyak}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="info">Login untuk melihat statistik Anda.</Alert> 
          )}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
            <SectionHeading
                title="Aksi Cepat"
                subtitle="Langsung mulai kelola sampah atau pelajari hal baru."
            />
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Button variant="contained" component={Link} to="/tracking/new" fullWidth size="large" sx={{ py:2, borderRadius: 2, boxShadow: 2 }}>
                        Catat Sampah Baru
                    </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button variant="outlined" component={Link} to="/katalog" fullWidth size="large" sx={{ py:2, borderRadius: 2 }}>
                        Lihat Katalog Sampah
                    </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button variant="outlined" component={Link} to="/daur-ulang" fullWidth size="large" sx={{ py:2, borderRadius: 2 }}>
                        Cari Tutorial Daur Ulang
                    </Button>
                </Grid>
            </Grid>
        </Box>


        {/* Katalog Sampah Preview */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={wasteItemsRef}>
          <SectionHeading 
            title="Sampah Bernilai di Sekitar Anda"
            subtitle="Temukan potensi sampah yang bisa Anda kelola dan jual kembali."
            actionText="Lihat Semua Katalog" 
            actionLink="/katalog"
          />
          
          {loading.waste ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
          ) : error.waste ? (
            <Alert severity="error" sx={{ mb: 4 }}>{error.waste}</Alert>
          ) : (
          <Grid container spacing={3} alignItems="stretch">
              {wasteItems.slice(0, 4).map((item) => ( // Tampilkan 4 item saja
                <Grid item xs={6} sm={6} md={3} key={item.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box className="waste-card" sx={{ flexGrow: 1, transformStyle: 'preserve-3d', perspective: 1000 }}>
                    <WasteCardItem 
                      {...item}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Tutorial Preview */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={tutorialsRef}>
          <SectionHeading 
            title="Tutorial Terbaru untuk Anda"
            subtitle="Ide-ide kreatif untuk mengubah sampah menjadi barang bermanfaat."
            actionText="Lihat Semua Tutorial" 
            actionLink="/daur-ulang"
          />
          
          {loading.tutorials ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
          ) : error.tutorials ? (
            <Alert severity="error" sx={{ mb: 4 }}>{error.tutorials}</Alert>
          ) : (
            <Grid container spacing={3}>
              {tutorials.slice(0, 4).map((tutorial) => ( // Tampilkan 4 tutorial
                <Grid item xs={6} sm={3} key={tutorial.id}>
                  <TutorialCard 
                    {...tutorial}
                    onToggleSave={handleToggleSave}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Aktivitas Komunitas Terkini */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={communityRef}>
          <SectionHeading 
            title="Diskusi Hangat di Komunitas"
            subtitle="Lihat apa yang sedang dibicarakan dan bagikan pengalaman Anda."
            actionText="Kunjungi Forum" 
            actionLink="/forum"
          />
          
          {loading.community ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
          ) : error.community ? (
            <Alert severity="error" sx={{ mb: 4 }}>{error.community}</Alert>
          ) : communityThreads && communityThreads.length > 0 ? (
            <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 2, backgroundColor: 'white' }}>
              {communityThreads.map((thread, index) => (
                <React.Fragment key={thread.id}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      p: 3, 
                      textDecoration: 'none', 
                      color: 'text.primary', 
                      transition: 'background-color 0.2s ease', 
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.03)' },
                      cursor: 'pointer'
                    }}
                    onClick={() => handleThreadClick(thread.id)}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>{thread.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          mb: 1
                       }}>{thread.excerpt}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Oleh: <Box component="span" fontWeight={500}>{thread.author}</Box></Typography>
                        <Typography variant="caption" color="text.secondary">{formatTimeAgo(thread.lastActivity)}</Typography>
                      </Box>
                      
                      {/* Tampilkan rating, views, dan kategori */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1, alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <VisibilityIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem', color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">{thread.views || 0} dilihat</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StarIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem', color: thread.rating > 0 ? 'gold' : 'text.secondary' }} />
                          {thread.rating > 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                                {parseFloat(thread.rating).toFixed(1)}
                              </Typography>
                              <Rating 
                                value={parseFloat(thread.rating)} 
                                readOnly 
                                size="small" 
                                precision={0.5}
                                sx={{ fontSize: '0.75rem' }}
                              />
                              {thread.rating_count > 0 && (
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                  ({thread.rating_count})
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Belum ada rating
                            </Typography>
                          )}
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <CategoryIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                          <span style={{ textTransform: 'capitalize' }}>{thread.category}</span>
                        </Typography>
                        
                        <Chip 
                          label={`Skor: ${Math.round(thread.popularityScore)}`} 
                          size="small" 
                          color="primary"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, color: theme.palette.primary.main }}><ChevronRightIcon /></Box>
                  </Box>
                  {index < communityThreads.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', bgcolor: 'rgba(0, 0, 0, 0.01)' }}>
                <Button component={Link} to="/forum/new-topic" variant="contained" color="primary" sx={{ borderRadius: 8, px: 3, py: 1, fontWeight: 600 }}>
                  Mulai Diskusi Baru
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center', borderRadius: 3, boxShadow: 2, backgroundColor: 'white' }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Belum ada diskusi aktif. Jadilah yang pertama memulai diskusi!
              </Typography>
              <Button component={Link} to="/forum/new-topic" variant="contained" color="primary" sx={{ borderRadius: 8, px: 3, py: 1, fontWeight: 600 }}>
                Mulai Diskusi Baru
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      <ScrollToTop threshold={400} color="secondary" />
    </Box>
  );
};

export default Home;