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
  Alert
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon, 
  ArrowForward as ArrowForwardIcon,
  ChevronRight as ChevronRightIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Import komponen ScrollToTop
import ScrollToTop from '../components/ui/ScrollToTop';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Import komponen kustom
import WasteCardItem from '../components/ui/WasteCardItem';
import TutorialCard from '../components/ui/TutorialCard';

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
  const [userName, setUserName] = useState('Pengguna Revalio'); // Nama pengguna default
  
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
    try {
      // Ganti dengan panggilan API sesungguhnya
      // const response = await axios.get('/api/forum/recent-threads');
      // setCommunityThreads(response.data);
      setTimeout(() => {
        setCommunityThreads([
          {
            id: 1,
            title: 'Dimana tempat jual kardus bekas di Jakarta Selatan?',
            excerpt: 'Saya punya banyak kardus bekas pindahan, ada yang tahu tempat jual yang harganya bagus?',
            author: 'Budi Santoso',
            replies: 8,
            lastActivity: '2023-05-18T14:35:00Z'
          },
          {
            id: 2,
            title: 'Sharing pengalaman jualan ecobrick ke pengepul',
            excerpt: 'Sudah 3 bulan saya rutin membuat ecobrick, ini pengalaman dan tips saya menjualnya...',
            author: 'Siti Aminah',
            replies: 12,
            lastActivity: '2023-05-17T09:20:00Z'
          }
        ]);
        setLoading(prev => ({ ...prev, community: false }));
      }, 600);
    } catch (err) {
      console.error('Error fetching community threads:', err);
      setError(prev => ({ ...prev, community: 'Gagal memuat data aktivitas komunitas' }));
      setLoading(prev => ({ ...prev, community: false }));
    }
  };
  
  // Fungsi untuk mengambil statistik pengguna
  const fetchUserStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      // Simulasi pengambilan data pengguna yang sudah login
      // Ganti dengan logika autentikasi dan panggilan API sesungguhnya
      // const user = auth.currentUser; // Contoh jika menggunakan Firebase Auth
      // if (user) {
      //   setUserName(user.displayName || 'Pengguna Revalio');
      //   const response = await axios.get(`/api/user/${user.uid}/stats`);
      //   setUserStats(response.data);
      // } else {
      //   // Handle jika pengguna tidak login, mungkin redirect atau tampilkan pesan
      //   setUserStats(null);
      // }
      setTimeout(() => {
        // Data dummy untuk statistik jika user login
        setUserStats({
          totalSampah: 45.2, // dalam kg
          nilaiEkonomi: 320000, // dalam rupiah
          sampahTerakhir: '2023-05-16',
          kategoriTerbanyak: 'Plastik'
        });
        setUserName("Siti Aminah"); // Contoh nama pengguna
        setLoading(prev => ({ ...prev, stats: false }));
      }, 900);

    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(prev => ({ ...prev, stats: 'Gagal memuat data statistik pengguna' }));
      setLoading(prev => ({ ...prev, stats: false }));
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
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format time ago helper
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
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
  };

  // Tambahkan fungsi handleLogout
  const handleLogout = () => {
    logout();
    navigate('/login');
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
              Selamat Datang Kembali, {user?.name || userName}!
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

        {/* Artikel Edukasi Terbaru */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={articlesRef}>
          <SectionHeading 
            title="Bacaan Terbaru"
            subtitle="Perluas wawasan Anda tentang pengelolaan sampah dan isu lingkungan."
            actionText="Lihat Semua Artikel" 
            actionLink="/artikel"
          />
          
          {loading.articles ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
          ) : error.articles ? (
            <Alert severity="error" sx={{ mb: 4 }}>{error.articles}</Alert>
          ) : (
            <Grid container spacing={3}>
              {articles.slice(0, 2).map((article) => ( // Tampilkan 2 artikel
                <Grid item xs={12} md={6} key={article.id}>
                  <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, height: '100%', borderRadius: 3, overflow: 'hidden', boxShadow: 2, transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: 3 } }}>
                    <CardMedia component="img" sx={{ width: { xs: '100%', sm: 140 }, height: { xs: 200, sm: 'auto' } }} image={article.imageUrl} alt={article.title} />
                    <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>{formatDate(article.createdAt)}</Typography>
                      <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>{article.title}</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>{article.excerpt}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">Oleh: {article.author}</Typography>
                        <Button component={Link} to={`/artikel/${article.id}`} endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 600, '&:hover': { backgroundColor: 'transparent', transform: 'translateX(3px)' }, transition: 'transform 0.2s ease' }}>
                          Baca Selengkapnya
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
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
          ) : (
            <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 2, backgroundColor: 'white' }}>
              {communityThreads.slice(0, 3).map((thread, index) => ( // Tampilkan 3 thread
                <React.Fragment key={thread.id}>
                  <Box component={Link} to={`/forum/thread/${thread.id}`} sx={{ display: 'flex', p: 3, textDecoration: 'none', color: 'text.primary', transition: 'background-color 0.2s ease', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 3, minWidth: { xs: 50, md: 80 } }}>
                      <Box sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText, borderRadius: '50%', width: { xs: 40, md: 50 }, height: { xs: 40, md: 50 }, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: { xs: '1rem', md: '1.2rem' }, mb: 1 }}>
                        {thread.replies}
                      </Box>
                      <Typography variant="caption" color="text.secondary">balasan</Typography>
                    </Box>
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
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, color: theme.palette.primary.main }}><ChevronRightIcon /></Box>
                  </Box>
                  {index < communityThreads.slice(0, 3).length - 1 && <Divider />}
                </React.Fragment>
              ))}
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', bgcolor: 'rgba(0, 0, 0, 0.01)' }}>
                <Button component={Link} to="/forum/new" variant="contained" color="primary" sx={{ borderRadius: 8, px: 3, py: 1, fontWeight: 600 }}>
                  Mulai Diskusi Baru
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Container>

      <ScrollToTop threshold={400} color="secondary" />
    </Box>
  );
};

export default Home;

