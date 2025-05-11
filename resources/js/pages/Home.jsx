import React, { useEffect, useRef } from 'react';
import { Typography, Container, Grid, Box, Button, Card, CardContent, CardMedia } from '@mui/material';
import { gsap, ScrollTrigger } from '../config/gsap';

const Home = () => {
  // Refs untuk animasi
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  
  // Reset cardsRef array
  cardsRef.current = [];
  
  // Fungsi untuk menambahkan elemen ke cardsRef
  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  // Animasi dengan GSAP
  useEffect(() => {
    // Hero section animation
    gsap.from(titleRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });
    
    gsap.from(subtitleRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
    });
    
    // Card stagger animation with ScrollTrigger
    gsap.from(cardsRef.current, {
      opacity: 0, 
      y: 50, 
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardsRef.current[0],
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
    
    // Cleanup ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const cardsData = [
    {
      title: 'Katalog Sampah Bernilai',
      description: 'Temukan nilai ekonomis dari berbagai jenis sampah yang umumnya dibuang begitu saja.',
      color: '#4CAF50', // Warna hijau
    },
    {
      title: 'Panduan Daur Ulang',
      description: 'Pelajari cara mendaur ulang sampah menjadi produk yang bernilai dan bermanfaat.',
      color: '#2196F3', // Warna biru
    },
    {
      title: 'Tracking Sampah',
      description: 'Pantau jumlah sampah yang telah Anda kelola dan lihat estimasi nilainya.',
      color: '#FF9800', // Warna oranye
    },
    {
      title: 'Tips Monetisasi',
      description: 'Dapatkan tips dan trik untuk menghasilkan pendapatan tambahan dari sampah.',
      color: '#673AB7', // Warna ungu
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 10,
          mb: 6,
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                ref={titleRef}
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Ubah Sampahmu Menjadi Penghasilan
              </Typography>
              <Typography
                ref={subtitleRef}
                variant="h5"
                paragraph
                sx={{ mb: 4, opacity: 0.9 }}
              >
                Revalio memberikan edukasi tentang cara mengelola sampah menjadi sumber pendapatan tambahan sambil melestarikan lingkungan.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ mr: 2 }}
              >
                Mulai Sekarang
              </Button>
              <Button variant="outlined" color="inherit" size="large">
                Pelajari Lebih Lanjut
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Placeholder untuk hero image */}
              <Box
                sx={{
                  height: 300,
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 3,
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'secondary.main',
                  color: 'white',
                }}
              >
                <Typography variant="h4">
                  Revalio
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feature Cards Section */}
      <Container sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Fitur Utama
        </Typography>
        <Grid container spacing={4}>
          {cardsData.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                ref={addToCardsRef}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  }
                }}
              >
                <Box 
                  sx={{ 
                    height: 140, 
                    bgcolor: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" color="white">
                    {card.title}
                  </Typography>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container>
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Dampak Revalio
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4} md={4} textAlign="center">
              <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
                10,000+
              </Typography>
              <Typography variant="h6">Pengguna Aktif</Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={4} textAlign="center">
              <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
                25 Ton
              </Typography>
              <Typography variant="h6">Sampah Dikelola</Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={4} textAlign="center">
              <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
                Rp 150 Juta
              </Typography>
              <Typography variant="h6">Nilai Ekonomis Dihasilkan</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
