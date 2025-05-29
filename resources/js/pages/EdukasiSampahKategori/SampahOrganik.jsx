import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Divider, useTheme, List, ListItem, ListItemIcon, ListItemText, Card, CardMedia, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import LandingPageNavbar from '../../components/layout/LandingPageNavbar';
import LandingPageFooter from '../../components/layout/LandingPageFooter';
import { 
  Recycling as RecyclingIcon, 
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  MonetizationOn as MonetizationOnIcon,
  Spa as SpaIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const SampahOrganik = () => {
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
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('/assets/images/organic-waste.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Button 
            component={Link} 
            to="/edukasi"
            startIcon={<ArrowBackIcon />}
            sx={{ 
              color: 'white', 
              mb: 2,
              '&:hover': { 
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Kembali ke Edukasi Sampah
          </Button>
          
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight={700} 
            gutterBottom
            sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            Sampah Organik
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ maxWidth: 800, mb: 4, opacity: 0.9 }}
          >
            Pahami cara mengelola sampah organik untuk menghasilkan produk bernilai ekonomis dan ramah lingkungan.
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
                Apa Itu Sampah Organik?
              </Typography>
              <Typography variant="body1" paragraph>
                Sampah organik adalah jenis sampah yang dapat terurai secara alami melalui proses biologis. Sampah ini berasal dari makhluk hidup seperti tumbuhan dan hewan. Sampah organik merupakan komponen terbesar dari sampah rumah tangga, mencapai 50-70% dari total sampah yang dihasilkan.
              </Typography>
              <Typography variant="body1" paragraph>
                Tidak seperti sampah anorganik yang membutuhkan waktu sangat lama untuk terurai, sampah organik dapat terurai dalam waktu relatif singkat dan dapat dimanfaatkan kembali menjadi produk yang bermanfaat seperti kompos, pupuk cair, dan biogas.
              </Typography>
              <Box 
                sx={{ 
                  bgcolor: 'success.light', 
                  color: 'black',
                  p: 2,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  mt: 2
                }}
              >
                <InfoIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Menurut data Kementerian Lingkungan Hidup dan Kehutanan, Indonesia memproduksi sekitar 175.000 ton sampah per hari, dan sekitar 60% dari total tersebut adalah sampah organik yang sebagian besar berakhir di TPA.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* Jenis-jenis Sampah Organik */}
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Jenis-jenis Sampah Organik
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {[
                {
                  title: 'Sisa Makanan',
                  description: 'Mencakup nasi, sayuran, buah-buahan, sisa daging, tulang, dan makanan basi.',
                  // image: '/assets/images/food-waste.jpg'
                },
                {
                  title: 'Daun dan Rumput',
                  description: 'Hasil pemangkasan tanaman di pekarangan rumah, taman, atau area publik.',
                  // image: '/assets/images/leaves-waste.jpg'
                },
                {
                  title: 'Kotoran Hewan',
                  description: 'Kotoran dari hewan peliharaan atau ternak yang bisa diolah menjadi pupuk berkualitas.',
                  // image: '/assets/images/animal-waste.jpg'
                },
                {
                  title: 'Kertas dan Kardus',
                  description: 'Produk kertas yang tidak dilapisi plastik atau bahan kimia dapat terurai secara alami.',
                  // image: '/assets/images/paper-waste.jpg'
                }
              ].map((type, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    sx={{ 
                      display: 'flex', 
                      height: '100%',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    {/* <CardMedia
                      component="img"
                      sx={{ width: 150 }}
                      image={type.image}
                      alt={type.title}
                    /> */}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h6" fontWeight={600}>
                          {type.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="div">
                          {type.description}
                        </Typography>
                      </CardContent>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          {/* Metode Pengolahan */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Metode Pengolahan Sampah Organik
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    borderLeft: `4px solid ${theme.palette.success.main}`,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Pengomposan (Composting)
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Pengomposan adalah proses mengubah sampah organik menjadi kompos yang dapat digunakan sebagai pupuk alami untuk tanaman. Proses ini terjadi melalui dekomposisi mikroba dalam kondisi yang terkontrol.
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 2 }}>
                    Metode Pengomposan:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Sistem tumpukan (heap system)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Pengomposan dengan bin/tong komposter" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Vermicomposting (menggunakan cacing)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Pengomposan Takakura (metode Jepang)" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Biodigester & Produksi Biogas
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Biodigester adalah sistem tertutup di mana bakteri anaerob mengurai sampah organik untuk menghasilkan biogas (terutama metana) dan pupuk cair sebagai produk sampingan.
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 2 }}>
                    Keuntungan Biodigester:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Menghasilkan energi terbarukan (biogas)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Memproduksi pupuk organik cair yang kaya nutrisi" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Mengurangi emisi gas metana ke atmosfer" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Ideal untuk pengolahan sampah skala komunitas" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          
          {/* Nilai Ekonomis */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 2,
                background: `linear-gradient(to right, ${theme.palette.success.dark}, ${theme.palette.success.light})`,
                color: 'white'
              }}
            >
              <Typography variant="h5" fontWeight={600} gutterBottom align="center">
                Nilai Ekonomis Sampah Organik
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      p: 3,
                      borderRadius: 2,
                      height: '100%',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'translateY(-5px)' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SpaIcon sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Pupuk Organik
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                      Kompos berkualitas tinggi dapat dijual ke petani, nursery tanaman, atau langsung ke konsumen. Harga pupuk organik di pasaran berkisar Rp 15.000 - Rp 25.000 per kg tergantung kualitas.
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Potensi keuntungan: Rp 750.000 - Rp 1.250.000 per 50 kg pupuk organik.
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      p: 3,
                      borderRadius: 2,
                      height: '100%',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'translateY(-5px)' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MonetizationOnIcon sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Media Tanam Khusus
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                      Kompos dapat diolah menjadi media tanam khusus untuk tanaman tertentu. Media tanam untuk tanaman hias seperti monstera atau anggrek bisa dijual dengan harga premium.
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Potensi keuntungan: Rp 35.000 - Rp 100.000 per kemasan 5 kg.
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      p: 3,
                      borderRadius: 2,
                      height: '100%',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'translateY(-5px)' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <RecyclingIcon sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Biogas
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                      Biogas dari digester dapat digunakan sebagai pengganti LPG untuk kebutuhan memasak atau bahkan pembangkit listrik skala kecil.
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Potensi penghematan: Rp 150.000 - Rp 300.000 per bulan untuk substitusi LPG rumah tangga.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Tips Praktis */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Tips Praktis Pengolahan Sampah Organik
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Pembuatan Komposter Sederhana
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Anda dapat membuat komposter sederhana di rumah menggunakan bahan-bahan bekas:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Gunakan ember bekas cat 20L dengan tutup" 
                        secondary="Lubangi bagian bawah untuk sirkulasi udara dan drainase"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tambahkan lapisan tanah dan dedaunan kering" 
                        secondary="Ini membantu memulai proses pengomposan"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Masukkan sampah organik dan aduk secara berkala" 
                        secondary="Aduk setiap 3-4 hari untuk aerasi yang baik"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Panen kompos setelah 2-3 bulan" 
                        secondary="Kompos matang berwarna gelap dan berbau seperti tanah"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Membuat Pupuk Cair
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Pupuk cair organik memiliki nilai jual tinggi dan mudah dibuat:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Campurkan sisa sayuran dan buah dalam ember" 
                        secondary="Potong kecil-kecil untuk mempercepat fermentasi"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tambahkan gula merah dan EM4 (mikroorganisme efektif)" 
                        secondary="Perbandingan 1:10 untuk gula merah dan air"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tutup rapat dan fermentasi selama 14 hari" 
                        secondary="Simpan di tempat teduh dan hindari sinar matahari langsung"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Saring dan kemas dalam botol" 
                        secondary="Dapat dijual Rp 25.000 - Rp 50.000 per liter"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          
          {/* CTA Section */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                mt: 4,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
                color: 'white',
                borderRadius: 2
              }}
            >
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Mulai Perjalanan Daur Ulang Anda
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
                Daftar sekarang untuk mendapatkan panduan lengkap pengolahan sampah organik, termasuk resep kompos premium dan teknik fermentasi pupuk cair bernilai jual tinggi.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/register"
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.success.dark,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                    px: 4,
                    py: 1,
                    borderRadius: 8,
                    fontWeight: 600
                  }}
                >
                  Daftar Sekarang
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/edukasi"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderColor: 'white'
                    },
                    px: 4,
                    py: 1,
                    borderRadius: 8,
                    fontWeight: 600
                  }}
                >
                  Pelajari Kategori Lain
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Footer */}
      <LandingPageFooter />
    </Box>
  );
};

export default SampahOrganik; 