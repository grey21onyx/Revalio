import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Divider, useTheme, List, ListItem, ListItemIcon, ListItemText, Card, CardMedia, CardContent, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import LandingPageNavbar from '../../components/layout/LandingPageNavbar';
import LandingPageFooter from '../../components/layout/LandingPageFooter';
import { 
  Recycling as RecyclingIcon, 
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  MonetizationOn as MonetizationOnIcon,
  Info as InfoIcon,
  LocalOffer as LocalOfferIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const SampahPlastik = () => {
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
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('/assets/images/plastic-waste.jpg')`,
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
            Sampah Plastik
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ maxWidth: 800, mb: 4, opacity: 0.9 }}
          >
            Pelajari klasifikasi, pengolahan, dan nilai ekonomis dari sampah plastik untuk mengurangi dampak lingkungan.
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
                Mengenal Sampah Plastik
              </Typography>
              <Typography variant="body1" paragraph>
                Sampah plastik adalah material berbasis polimer sintetis yang telah dibuang atau tidak digunakan lagi. Plastik merupakan salah satu jenis sampah yang paling problematik karena sifatnya yang sulit terurai secara alami, dengan waktu degradasi mencapai ratusan hingga ribuan tahun.
              </Typography>
              <Typography variant="body1" paragraph>
                Indonesia merupakan salah satu penyumbang sampah plastik terbesar di dunia, dengan produksi sekitar 6,8 juta ton per tahun. Dari jumlah tersebut, hanya sekitar 10% yang berhasil didaur ulang, sementara sebagian besar berakhir di tempat pembuangan akhir atau bahkan mencemari lingkungan seperti sungai dan laut.
              </Typography>
              <Box 
                sx={{ 
                  bgcolor: 'error.light', 
                  color: 'black',
                  p: 2,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  mt: 2
                }}
              >
                <WarningIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Menurut penelitian, jika pola konsumsi dan pengelolaan sampah plastik tidak berubah, pada tahun 2050 diperkirakan jumlah plastik di lautan akan melebihi jumlah ikan (berdasarkan berat).
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* Jenis-jenis Plastik */}
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Jenis-jenis Plastik dan Kode Daur Ulang
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {[
                {
                  code: 'PET/PETE (1)',
                  name: 'Polyethylene Terephthalate',
                  examples: 'Botol air mineral, botol soda, kemasan makanan',
                  recyclable: true,
                  value: 'Tinggi',
                  color: theme.palette.primary.light
                },
                {
                  code: 'HDPE (2)',
                  name: 'High-Density Polyethylene',
                  examples: 'Botol sampo, botol deterjen, mainan, ember',
                  recyclable: true,
                  value: 'Tinggi',
                  color: theme.palette.primary.main
                },
                {
                  code: 'PVC (3)',
                  name: 'Polyvinyl Chloride',
                  examples: 'Pipa, kartu kredit, bungkus makanan, mainan',
                  recyclable: false,
                  value: 'Rendah',
                  color: theme.palette.error.light
                },
                {
                  code: 'LDPE (4)',
                  name: 'Low-Density Polyethylene',
                  examples: 'Kantong plastik, tutup botol, bungkus makanan',
                  recyclable: false,
                  value: 'Rendah',
                  color: theme.palette.warning.light
                },
                {
                  code: 'PP (5)',
                  name: 'Polypropylene',
                  examples: 'Wadah makanan, sedotan, tutup botol',
                  recyclable: true,
                  value: 'Sedang',
                  color: theme.palette.success.light
                },
                {
                  code: 'PS (6)',
                  name: 'Polystyrene',
                  examples: 'Styrofoam, gelas sekali pakai, wadah CD',
                  recyclable: false,
                  value: 'Rendah',
                  color: theme.palette.error.light
                },
                {
                  code: 'Lainnya (7)',
                  name: 'Berbagai jenis plastik lain',
                  examples: 'Galon air, bahan bangunan, peralatan medis',
                  recyclable: false,
                  value: 'Bervariasi',
                  color: theme.palette.grey[400]
                }
              ].map((type, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      borderTop: '4px solid',
                      borderColor: type.color,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {type.code}
                      </Typography>
                      <Chip 
                        label={type.recyclable ? 'Dapat didaur ulang' : 'Sulit didaur ulang'} 
                        size="small"
                        color={type.recyclable ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {type.name}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" paragraph>
                      <strong>Contoh:</strong> {type.examples}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Nilai Ekonomis:</strong> {type.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          {/* Proses Daur Ulang Plastik */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Proses Daur Ulang Plastik
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Paper sx={{ p: 4, borderRadius: 2 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box component="img" src="/assets/images/lambang-daur-ulang.png" alt="Proses Daur Ulang Plastik" sx={{ width: '100%', borderRadius: 2, mb: 2}} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Pengumpulan" 
                        secondary="Sampah plastik dikumpulkan dari berbagai sumber seperti rumah tangga, industri, dan tempat umum."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Pemilahan" 
                        secondary="Plastik dipisahkan berdasarkan jenisnya (PET, HDPE, dll) menggunakan teknologi seperti sensor optik atau secara manual."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Pencucian" 
                        secondary="Plastik dibersihkan dari kontaminan seperti label, sisa makanan, dan bahan kimia."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Pencacahan" 
                        secondary="Plastik dipotong menjadi serpihan kecil (flakes) agar lebih mudah diproses."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Pelelehan & Pembentukan" 
                        secondary="Serpihan plastik dilelehkan dan dibentuk menjadi pelet plastik yang siap digunakan untuk produksi barang baru."
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Nilai Ekonomis Sampah Plastik */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Nilai Ekonomis Sampah Plastik
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Harga Jual Sampah Plastik
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Harga jual sampah plastik bervariasi tergantung pada jenis, kualitas, dan kebersihan plastik. Berikut adalah kisaran harga per kg (data 2023):
                  </Typography>
                  
                  <Box sx={{ overflow: 'auto' }}>
                    <Box sx={{ minWidth: 400 }}>
                      <Grid container sx={{ borderBottom: '1px solid rgba(0,0,0,0.12)', py: 1, fontWeight: 'bold' }}>
                        <Grid item xs={5}>Jenis Plastik</Grid>
                        <Grid item xs={4}>Kondisi</Grid>
                        <Grid item xs={3}>Harga/Kg (Rp)</Grid>
                      </Grid>
                      {[
                        { type: 'Botol PET Bening', condition: 'Bersih', price: '7.000 - 9.000' },
                        { type: 'Botol PET Berwarna', condition: 'Bersih', price: '4.000 - 6.000' },
                        { type: 'HDPE (Botol Sampo)', condition: 'Bersih', price: '6.000 - 8.000' },
                        { type: 'PP (Gelas Minuman)', condition: 'Bersih', price: '5.000 - 7.000' },
                        { type: 'LDPE (Kantong Plastik)', condition: 'Bersih', price: '2.000 - 3.000' },
                        { type: 'Tutup Botol Plastik', condition: 'Bersih', price: '5.000 - 7.000' },
                        { type: 'Galon Air', condition: 'Utuh', price: '2.000 - 4.000/unit' }
                      ].map((item, index) => (
                        <Grid container key={index} sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)', py: 1 }}>
                          <Grid item xs={5}>{item.type}</Grid>
                          <Grid item xs={4}>{item.condition}</Grid>
                          <Grid item xs={3}>{item.price}</Grid>
                        </Grid>
                      ))}
                    </Box>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      bgcolor: 'info.light', 
                      color: 'black',
                      p: 2,
                      borderRadius: 1,
                      mt: 2,
                      display: 'flex',
                      alignItems: 'flex-start'
                    }}
                  >
                    <InfoIcon sx={{ mr: 1, mt: 0.5 }} />
                    <Typography variant="body2">
                      Harga dapat berubah tergantung lokasi, volume, dan fluktuasi pasar. Plastik yang telah dibersihkan dan dikelompokkan biasanya memiliki nilai jual lebih tinggi.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    color: 'white'
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Potensi Nilai Ekonomis
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <MonetizationOnIcon sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Penjualan Langsung" 
                        secondary="Menjual sampah plastik yang sudah dipilah ke pengepul atau bank sampah bisa menghasilkan penghasilan tambahan."
                        secondaryTypographyProps={{ color: 'rgba(255,255,255,0.8)' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <MonetizationOnIcon sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Produk Daur Ulang" 
                        secondary="Mengolah plastik menjadi produk baru seperti tas, pot tanaman, atau furnitur dapat meningkatkan nilai jual hingga 5-10 kali lipat."
                        secondaryTypographyProps={{ color: 'rgba(255,255,255,0.8)' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <MonetizationOnIcon sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Bahan Baku Industri" 
                        secondary="Pelet plastik hasil daur ulang dapat dijual ke industri manufaktur dengan harga Rp 15.000 - Rp 25.000 per kg."
                        secondaryTypographyProps={{ color: 'rgba(255,255,255,0.8)' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <MonetizationOnIcon sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Konversi ke Bahan Bakar" 
                        secondary="Teknologi pirolisis dapat mengubah plastik menjadi bahan bakar alternatif bernilai jual tinggi."
                        secondaryTypographyProps={{ color: 'rgba(255,255,255,0.8)' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          
          {/* Kreasi & Inovasi */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Kreasi & Inovasi dari Sampah Plastik
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {[
                {
                  title: 'Ecobricks',
                  description: 'Botol plastik yang diisi rapat dengan plastik bersih dan kering hingga menjadi blok bangunan yang dapat digunakan untuk membuat furnitur, dinding, atau struktur lainnya.',
                  // image: '/assets/images/ecobricks.jpg'
                },
                {
                  title: 'Kerajinan Tangan',
                  description: 'Sampah plastik dapat diubah menjadi berbagai kerajinan seperti tas, dompet, pot bunga, atau hiasan rumah yang bernilai jual tinggi.',
                  // image: '/assets/images/plastic-crafts.jpg'
                },
                {
                  title: 'Paving Block',
                  description: 'Campuran plastik daur ulang dengan material lain dapat digunakan untuk membuat paving block yang lebih tahan lama dan ramah lingkungan.',
                  // image: '/assets/images/plastic-paving.jpg'
                },
                {
                  title: 'Bahan Tekstil',
                  description: 'Botol PET dapat diproses menjadi serat polyester untuk pembuatan pakaian, tas, dan produk tekstil lainnya.',
                  // image: '/assets/images/plastic-textile.jpg'
                }
              ].map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    sx={{ 
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
                      height="200"
                      image={item.image}
                      alt={item.title}
                    /> */}
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
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
                Jadilah Bagian dari Solusi
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
                Daftar sekarang untuk mendapatkan informasi lengkap tentang teknik daur ulang plastik, pasar potensial, dan panduan pembuatan produk bernilai ekonomis dari sampah plastik.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
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

export default SampahPlastik; 