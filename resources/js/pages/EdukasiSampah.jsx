import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Divider, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import LandingPageNavbar from '../components/layout/LandingPageNavbar';
import LandingPageFooter from '../components/layout/LandingPageFooter';
import { Recycling as RecyclingIcon, AutoAwesome as KatalogIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const EdukasiSampah = () => {
  const theme = useTheme();
  
  // Custom navItems untuk halaman statis (bukan landing page)
  const navItems = [
    { label: 'Beranda', action: () => window.location.href = '/' },
    { label: 'Edukasi Sampah', action: () => window.location.href = '/edukasi' },
    { label: 'Tentang', action: () => window.location.href = '/tentang' },
  ];

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <LandingPageNavbar navItems={navItems} />
      
      {/* Header */}
      <Box 
        sx={{ 
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('/assets/images/bg1.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight={700} 
            gutterBottom
            sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            Edukasi Sampah
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ maxWidth: 800, mb: 4, opacity: 0.9 }}
          >
            Pahami berbagai jenis sampah dan cara pengelolaannya yang tepat untuk menghasilkan nilai ekonomis dan membantu lingkungan.
          </Typography>
        </Container>
      </Box>
      
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1, mb: 8 }}>
        <Grid container spacing={4}>
          {/* Intro Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Mengapa Edukasi Sampah Penting?
              </Typography>
              <Typography variant="body1" paragraph>
                Edukasi sampah sangat penting dalam upaya mengelola sampah secara tepat dan berkelanjutan. Dengan memahami berbagai jenis sampah dan cara penanganannya, kita dapat mengurangi dampak negatif sampah terhadap lingkungan, menghemat sumber daya alam, dan bahkan menciptakan peluang ekonomi.
              </Typography>
              <Typography variant="body1">
                Di Revalio, kami menyediakan informasi lengkap dan terstruktur tentang berbagai jenis sampah, cara memilahnya, serta potensi nilai ekonomis yang dapat dihasilkan dari sampah-sampah tersebut.
              </Typography>
            </Paper>
          </Grid>
          
          {/* Kategori Sampah */}
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Kategori Sampah
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {[
                {
                  title: 'Sampah Organik',
                  description: 'Sampah yang dapat terurai secara alami seperti sisa makanan, daun, dan kertas. Bisa diolah menjadi kompos yang bernilai ekonomis.',
                  icon: <RecyclingIcon sx={{ fontSize: 50, color: theme.palette.success.main }} />,
                  color: theme.palette.success.light
                },
                {
                  title: 'Sampah Plastik',
                  description: 'Berbagai jenis plastik yang dapat didaur ulang menjadi produk baru atau diolah menjadi bahan bakar alternatif.',
                  icon: <KatalogIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
                  color: theme.palette.primary.light
                },
                {
                  title: 'Sampah Kertas',
                  description: 'Kertas bekas yang dapat didaur ulang menjadi kertas baru atau produk kerajinan bernilai jual tinggi.',
                  icon: <RecyclingIcon sx={{ fontSize: 50, color: theme.palette.secondary.main }} />,
                  color: theme.palette.secondary.light
                },
                {
                  title: 'Sampah Logam',
                  description: 'Berbagai jenis logam bekas yang memiliki nilai jual tinggi untuk didaur ulang menjadi produk logam baru.',
                  icon: <KatalogIcon sx={{ fontSize: 50, color: theme.palette.warning.main }} />,
                  color: theme.palette.warning.light
                }
              ].map((category, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderTop: '4px solid',
                      borderColor: category.color,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      {category.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                      {category.description}
                    </Typography>
                    <Button
                      variant="text"
                      endIcon={<ArrowForwardIcon />}
                      component={Link}
                      to={`/edukasi/kategori/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                      sx={{ alignSelf: 'flex-start', mt: 'auto' }}
                    >
                      Pelajari Lebih Lanjut
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          {/* CTA Section */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                mt: 4,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                color: 'white',
                borderRadius: 2
              }}
            >
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Siap Memulai Perjalanan Daur Ulang Anda?
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
                Daftar sekarang untuk mengakses informasi lengkap tentang berbagai jenis sampah, nilai ekonomisnya, dan panduan cara pengolahannya.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/register"
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                  px: 4,
                  py: 1,
                  borderRadius: 8,
                  fontWeight: 600
                }}
              >
                Daftar Sekarang
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Footer */}
      <LandingPageFooter />
    </Box>
  );
};

export default EdukasiSampah; 