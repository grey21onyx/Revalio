import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
  IconButton
} from '@mui/material';
import {
  Recycling as RecyclingIcon,
  NavigateNext as NavigateNextIcon, 
  AutoAwesome as KatalogIcon,
  Refresh as DaurUlangIcon,
  Insights as TrackingIcon,
  MonetizationOn as MonetisasiIcon,
  Forum as ForumIcon,
  BusinessCenter as PeluangUsahaIcon,
  ChevronRight as ChevronRightIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { gsap } from 'gsap';

// Import komponen kustom
import WasteCardItem from '../components/ui/WasteCardItem';
import TutorialCard from '../components/ui/TutorialCard';

// Data dummy untuk tampilan
const featuredWasteItems = [
  {
    id: 1,
    name: 'Botol Plastik PET',
    description: 'Botol plastik minuman bekas yang dapat didaur ulang menjadi berbagai produk baru',
    imageUrl: '/assets/images/waste/botol-pet.jpg',
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
    imageUrl: '/assets/images/waste/kaleng.jpg',
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
    imageUrl: '/assets/images/tutorials/ecobrick.jpg',
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

// Komponen untuk section fitur dengan animasi hover
const FeatureCard = ({ icon: Icon, title, description, path, color }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const element = cardRef.current;
    
    const handleMouseEnter = () => {
      gsap.to(element, { 
        y: -8, 
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)', 
        duration: 0.3, 
        ease: "power2.out" 
      });
      
      // Animate icon
      const iconElement = element.querySelector('.feature-icon');
      gsap.to(iconElement, {
        rotation: 5,
        scale: 1.1,
        duration: 0.4,
        ease: "back.out"
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(element, { 
        y: 0, 
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
        duration: 0.3, 
        ease: "power1.out" 
      });
      
      // Reset icon
      const iconElement = element.querySelector('.feature-icon');
      gsap.to(iconElement, {
        rotation: 0,
        scale: 1,
        duration: 0.3,
        ease: "power1.out"
      });
    };

    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <Card
      ref={cardRef}
      component={Link}
      to={path}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'text.primary',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: 'grey.100',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '3px',
          backgroundColor: color,
          transform: 'scaleX(0)',
          transition: 'transform 0.3s ease',
          transformOrigin: 'left'
        },
        '&:hover:after': {
          transform: 'scaleX(1)'
        }
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            className="feature-icon"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}15`, 
              color,
              borderRadius: '50%',
              p: 1.5,
              mr: 2,
              transition: 'all 0.3s ease'
            }}
          >
            <Icon fontSize="large" />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mb: 2, flexGrow: 1, color: 'text.secondary' }}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Typography 
            variant="button" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: color,
              fontWeight: 500,
              transition: 'transform 0.2s ease'
            }}
          >
            Jelajahi 
            <ChevronRightIcon sx={{ ml: 0.5, transition: 'transform 0.2s ease' }} />
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Component for section headings
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
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroImageRef = useRef(null);
  const featuresRef = useRef(null);
  const wasteItemsRef = useRef(null);
  const tutorialsRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Handle dummy toggle favorite
  const handleToggleFavorite = (id) => {
    console.log(`Toggle favorite for waste item ${id}`);
  };

  // Handle dummy toggle save
  const handleToggleSave = (id) => {
    console.log(`Toggle save for tutorial ${id}`);
  };

  useEffect(() => {
    // Hero section animations
    gsap.fromTo(
      heroContentRef.current.children,
      { 
        opacity: 0, 
        y: 30 
      },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.15, 
        duration: 0.9,
        ease: "power3.out",
        delay: 0.2
      }
    );
    
    gsap.fromTo(
      heroImageRef.current,
      { 
        opacity: 0, 
        scale: 0.9,
        rotation: -5
      },
      { 
        opacity: 1, 
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
      }
    );

    // Section reveal animations with scroll trigger
    const sections = [featuresRef, wasteItemsRef, tutorialsRef, ctaRef];
    
    sections.forEach((sectionRef, index) => {
      gsap.fromTo(
        sectionRef.current,
        { 
          opacity: 0, 
          y: 50 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          delay: 0.1 * index,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );
    });
  }, []);

  return (
    <Box sx={{ backgroundColor: '#f8f9fa' }}>
      {/* Hero Section */}
      <Box 
        ref={heroRef}
        sx={{ 
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/assets/images/bg1.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          mb: { xs: 5, md: 8 },
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          minHeight: { xs: '70vh', md: '85vh' }, 
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7} ref={heroContentRef}>
              <Box sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  fontWeight={800} 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    letterSpacing: '-0.5px',
                    mb: 3
                  }}
                >
                  Ubah Sampah Menjadi Penghasilan
                </Typography>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    mb: 4, 
                    fontWeight: 400,
                    fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.35rem' },
                    opacity: 0.95,
                    maxWidth: '700px',
                    lineHeight: 1.6
                  }}
                >
                  Platform edukasi digital untuk memberdayakan sampah menjadi sumber penghasilan yang berkelanjutan
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 2, sm: 3 }}
                  sx={{ mt: 6 }}
                >
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large"
                    component={Link}
                    to="/katalog"
                    sx={{ 
                      borderRadius: 8,
                      px: { xs: 3, md: 5 },
                      py: 1.75,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                      }
                    }}
                  >
                    Mulai Sekarang
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    size="large"
                    component={Link}
                    to="/tentang"
                    sx={{ 
                      borderRadius: 8,
                      px: { xs: 3, md: 5 },
                      py: 1.75,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderColor: 'white',
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 2,
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s'
                    }}
                  >
                    Pelajari Lebih Lanjut
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Box 
                ref={heroImageRef}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.25))'
                }}
              >
                <RecyclingIcon sx={{ fontSize: 280, opacity: 0.95 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Feature Sections */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={featuresRef}>
          <SectionHeading 
            title="Fitur Utama"
            subtitle="Revalio menyediakan berbagai fitur untuk membantu Anda memahami dan mendapatkan nilai ekonomis dari sampah yang biasanya terbuang percuma"
          />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={6}>
              <FeatureCard 
                icon={KatalogIcon}
                title="Katalog Sampah" 
                description="Pelajari berbagai jenis sampah bernilai ekonomis, cara sortir, dan estimasi harganya di pasaran." 
                path="/katalog"
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <FeatureCard 
                icon={DaurUlangIcon}
                title="Panduan Daur Ulang" 
                description="Temukan berbagai tutorial dan panduan cara mendaur ulang atau menggunakan kembali sampah." 
                path="/daur-ulang"
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <FeatureCard 
                icon={TrackingIcon}
                title="Tracking Sampah" 
                description="Catat dan monitor sampah yang Anda kelola serta lihat estimasi nilai ekonomisnya." 
                path="/tracking"
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <FeatureCard 
                icon={MonetisasiIcon}
                title="Tips Monetisasi" 
                description="Dapatkan informasi tentang cara menjual sampah dan siapa yang membelinya di lokasi Anda." 
                path="/monetisasi"
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <FeatureCard 
                icon={ForumIcon}
                title="Forum Diskusi" 
                description="Diskusikan dan berbagi pengalaman dengan komunitas pengelola sampah lainnya." 
                path="/forum"
                color={theme.palette.info.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <FeatureCard 
                icon={PeluangUsahaIcon}
                title="Peluang Usaha" 
                description="Temukan berbagai peluang usaha dari pengelolaan sampah dan kisah sukses pelaku usaha." 
                path="/peluang-usaha" 
                color={theme.palette.error.main}
              />
            </Grid>
          </Grid>
        </Box>

        {/* About Revalio Section - NEW */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <SectionHeading 
            title="Tentang Revalio"
            subtitle="Revalio adalah platform edukasi digital yang bertujuan untuk memberdayakan masyarakat dalam mengelola sampah menjadi sumber penghasilan yang berkelanjutan"
          />
          
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}>
                <img 
                  src="/assets/images/bg1.jpeg" 
                  alt="Revalio Background" 
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    display: 'block'
                  }} 
                />
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  width: '100%', 
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  p: 3,
                  color: 'white'
                }}>
                  <Typography variant="h6" fontWeight={700}>
                    Ubah Limbah Menjadi Peluang
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body1" paragraph sx={{ mb: 2, fontSize: '1.05rem' }}>
                  Revalio berfokus pada pemberdayaan masyarakat untuk mengelola sampah dengan lebih baik dan mendapatkan nilai ekonomis darinya. Aplikasi ini membantu Anda mengidentifikasi sampah bernilai, mempelajari cara pengelolaannya, dan menemukan peluang monetisasi.
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, height: '100%', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Edukasi Jenis Sampah
                      </Typography>
                      <Typography variant="body2">
                        Informasi tentang berbagai jenis sampah yang memiliki nilai ekonomis, termasuk sampah rumah tangga dan industri ringan.
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, height: '100%', borderLeft: '4px solid', borderColor: 'secondary.main' }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Panduan Interaktif
                      </Typography>
                      <Typography variant="body2">
                        Tutorial cara mengklasifikasi, mengolah, dan mendaur ulang sampah menjadi barang bernilai.
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, height: '100%', borderLeft: '4px solid', borderColor: 'success.main' }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Tracking & Monetisasi
                      </Typography>
                      <Typography variant="body2">
                        Tools untuk melacak volume sampah yang dikelola dan mempelajari cara monetisasinya.
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, height: '100%', borderLeft: '4px solid', borderColor: 'warning.main' }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Komunitas & Edukasi
                      </Typography>
                      <Typography variant="body2">
                        Forum diskusi dan berbagi pengalaman dengan komunitas peduli lingkungan.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  component={Link}
                  to="/tentang"
                  sx={{ 
                    borderRadius: 8,
                    px: 3,
                    py: 1.25,
                    fontWeight: 600
                  }}
                >
                  Pelajari Selengkapnya
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Katalog Sampah Preview */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={wasteItemsRef}>
          <SectionHeading 
            title="Sampah Bernilai"
            subtitle="Ketahui jenis-jenis sampah yang memiliki nilai ekonomis tinggi di pasaran"
            actionText="Lihat Semua" 
            actionLink="/katalog"
          />
          
          <Grid container spacing={3}>
            {featuredWasteItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <WasteCardItem 
                  {...item}
                  onToggleFavorite={handleToggleFavorite}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Environmental Impact Section - NEW */}
        <Box 
          sx={{ 
            mb: { xs: 6, md: 8 },
            py: 5,
            px: { xs: 3, md: 5 },
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(rgba(76, 175, 80, 0.8), rgba(76, 175, 80, 0.9)), url('/assets/images/bg1.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            fontWeight={700} 
            gutterBottom
            align="center"
            sx={{ mb: 4 }}
          >
            Dampak Positif Pengelolaan Sampah
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2,
                height: '100%',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}>
                <Box 
                  sx={{ 
                    fontSize: '3rem', 
                    mb: 2,
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    p: 2,
                    borderRadius: '50%',
                    lineHeight: 1
                  }}
                >
                  ♻️
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Pengurangan Limbah
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Mengurangi volume sampah yang masuk ke TPA, menghemat ruang dan mengurangi polusi tanah.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2,
                height: '100%',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}>
                <Box 
                  sx={{ 
                    fontSize: '3rem', 
                    mb: 2,
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    p: 2,
                    borderRadius: '50%',
                    lineHeight: 1
                  }}
                >
                  🌱
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Penghematan Energi
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Menghemat energi yang dibutuhkan untuk memproduksi barang baru dari bahan mentah.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2,
                height: '100%',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}>
                <Box 
                  sx={{ 
                    fontSize: '3rem', 
                    mb: 2,
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    p: 2,
                    borderRadius: '50%',
                    lineHeight: 1
                  }}
                >
                  💰
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Nilai Ekonomis
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Mengubah sampah menjadi sumber pendapatan dan menciptakan lapangan kerja baru.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2,
                height: '100%',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}>
                <Box 
                  sx={{ 
                    fontSize: '3rem', 
                    mb: 2,
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    p: 2,
                    borderRadius: '50%',
                    lineHeight: 1
                  }}
                >
                  🌍
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Pengurangan Emisi
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Mengurangi emisi gas rumah kaca dari dekomposisi sampah di tempat pembuangan.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Tutorial Preview */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={tutorialsRef}>
          <SectionHeading 
            title="Tutorial Terpopuler"
            subtitle="Pelajari cara mendaur ulang atau menggunakan kembali sampah menjadi barang bernilai"
            actionText="Lihat Semua" 
            actionLink="/daur-ulang"
          />
          
          <Grid container spacing={3}>
            {featuredTutorials.map((tutorial) => (
              <Grid item xs={12} sm={6} key={tutorial.id}>
                <TutorialCard 
                  {...tutorial}
                  onToggleSave={handleToggleSave}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Card
          ref={ctaRef}
          sx={{
            mb: 6,
            borderRadius: { xs: 3, md: 4 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            transform: 'translateZ(0)', // Hardware acceleration
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'url(/assets/images/bg1.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.1,
              zIndex: 1
            }
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 }, position: 'relative', zIndex: 2 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  Mulai Kelola Sampah Anda Sekarang
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, fontSize: '1.1rem', maxWidth: '600px' }}>
                  Bergabunglah dengan komunitas Revalio untuk mendapatkan akses penuh ke seluruh fitur dan mulai memonetisasi sampah Anda. Kami akan membimbing Anda langkah demi langkah.
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(255,255,255,0.15)',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        1
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        Daftar akun gratis
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(255,255,255,0.15)',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        2
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        Akses panduan dan tutorial
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(255,255,255,0.15)',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        3
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        Mulai tracking sampah
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(255,255,255,0.15)',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        4
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        Dapatkan nilai ekonomis
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/register"
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 15px rgba(0,0,0,0.2)'
                      },
                      borderRadius: 8,
                      px: { xs: 4, md: 5 },
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                    }}
                  >
                    Daftar Gratis
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/login"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-3px)',
                      },
                      borderRadius: 8,
                      px: { xs: 4, md: 5 },
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      transition: 'all 0.3s',
                      borderWidth: 2
                    }}
                  >
                    Masuk
                  </Button>
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    position: 'relative'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: '280px',
                      height: '280px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Box 
                      component="img"
                      src="/assets/images/bg1.jpeg"
                      alt="Revalio App"
                      sx={{ 
                        width: '90%',
                        height: 'auto',
                        borderRadius: '10px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        transform: 'rotate(-5deg)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'rotate(0deg) scale(1.05)'
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Home;
