import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Divider, useTheme, List, ListItem, ListItemIcon, ListItemText, Card, CardMedia, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Link } from 'react-router-dom';
import LandingPageNavbar from '../../components/layout/LandingPageNavbar';
import LandingPageFooter from '../../components/layout/LandingPageFooter';
import { 
  Recycling as RecyclingIcon, 
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  MonetizationOn as MonetizationOnIcon,
  AutoAwesome as AutoAwesomeIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const SampahKertas = () => {
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
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('/assets/images/paper-waste.jpg')`,
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
            Sampah Kertas
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ maxWidth: 800, mb: 4, opacity: 0.9 }}
          >
            Pelajari cara mengolah dan mendaur ulang sampah kertas menjadi produk bernilai ekonomis.
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
                Apa Itu Sampah Kertas?
              </Typography>
              <Typography variant="body1" paragraph>
                Sampah kertas adalah material berbasis selulosa yang telah digunakan dan dibuang. Kertas merupakan salah satu jenis sampah yang paling umum dihasilkan dari aktivitas rumah tangga, perkantoran, sekolah, dan industri.
              </Typography>
              <Typography variant="body1" paragraph>
                Meskipun kertas merupakan material organik yang dapat terurai secara alami, waktu penguraiannya bisa mencapai 2-5 bulan tergantung kondisi lingkungan. Daripada terbuang percuma, sampah kertas dapat didaur ulang hingga 5-7 kali sebelum serat selulosa menjadi terlalu pendek untuk diproses kembali.
              </Typography>
              <Box 
                sx={{ 
                  bgcolor: 'info.light', 
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
                  Mendaur ulang 1 ton kertas dapat menyelamatkan 17 pohon, menghemat 26.500 liter air, 4.000 kWh listrik, dan mengurangi 2,5 meter kubik ruang di tempat pembuangan akhir.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* Jenis-jenis Kertas */}
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Jenis-jenis Sampah Kertas
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {[
                {
                  title: 'Kertas HVS/Office Paper',
                  description: 'Kertas putih atau berwarna yang biasa digunakan untuk mencetak dokumen, fotokopi, atau menulis.',
                  // image: '/assets/images/office-paper.jpg',
                  value: 'Rp 3.000 - Rp 5.000/kg'
                },
                {
                  title: 'Kertas Koran',
                  description: 'Kertas tipis dan berwarna abu-abu yang digunakan untuk mencetak koran.',
                  // image: '/assets/images/newspaper.jpg',
                  value: 'Rp 2.000 - Rp 3.000/kg'
                },
                {
                  title: 'Kardus/Karton',
                  description: 'Kertas tebal yang digunakan untuk kemasan, dus, atau box.',
                  // image: '/assets/images/cardboard.jpg',
                  value: 'Rp 2.500 - Rp 4.000/kg'
                },
                {
                  title: 'Kertas Majalah/Art Paper',
                  description: 'Kertas mengkilap yang digunakan untuk majalah, brosur, atau katalog.',
                  // image: '/assets/images/magazine-paper.jpg',
                  value: 'Rp 2.000 - Rp 3.500/kg'
                }
              ].map((type, index) => (
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
                      height="180"
                      image={type.image}
                      alt={type.title}
                    /> */}
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {type.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {type.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <MonetizationOnIcon color="secondary" sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="secondary.main">
                          <strong>Nilai Jual:</strong> {type.value}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          {/* Proses Daur Ulang */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Proses Daur Ulang Kertas
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box 
                  component="img" 
                  src="/assets/images/paper-recycling-process.jpg" 
                  alt="Proses Daur Ulang Kertas"
                  sx={{ 
                    width: '100%', 
                    borderRadius: 2,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="1. Pengumpulan dan Pemilahan" 
                      secondary="Kertas dikumpulkan dan dipisahkan berdasarkan jenisnya untuk memudahkan proses daur ulang."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="2. Pencacahan dan Pulping" 
                      secondary="Kertas dicacah dan direndam dalam air untuk membentuk bubur kertas (pulp). Bahan kimia seperti soda api ditambahkan untuk memecah serat."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="3. Pembersihan dan Penyaringan" 
                      secondary="Kontaminan seperti staples, plastik, dan tinta dihilangkan melalui proses penyaringan dan pembersihan."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="4. Penghalusan dan Pemutihan" 
                      secondary="Pulp dihaluskan dan, jika diperlukan, diputihkan menggunakan bahan pemutih ramah lingkungan."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="5. Pembentukan Lembaran" 
                      secondary="Pulp ditekan dan dikeringkan untuk membentuk lembaran kertas baru."
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Grid>
          
          {/* Kerajinan dari Kertas */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Kerajinan dari Sampah Kertas
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" paragraph>
              Selain didaur ulang menjadi kertas baru, sampah kertas dapat dimanfaatkan untuk membuat berbagai kerajinan tangan bernilai ekonomis. Berikut beberapa ide kerajinan dari sampah kertas:
            </Typography>
            
            <Grid container spacing={3}>
              {[
                {
                  title: 'Kertas Daur Ulang Artistik',
                  description: 'Membuat kertas daur ulang dengan tekstur unik dan tambahan bunga kering atau daun untuk produk kertas seni premium.',
                  // image: '/assets/images/handmade-paper.jpg'
                },
                {
                  title: 'Pot Tanaman dari Kertas',
                  description: 'Membuat pot biodegradable dari bubur kertas yang dapat ditanam langsung ke tanah bersama bibitnya.',
                  // image: '/assets/images/paper-pot.jpg'
                },
                {
                  title: 'Hiasan Dinding Quilling',
                  description: 'Membuat hiasan dinding dengan teknik quilling (gulungan kertas) yang membentuk pola indah.',
                  // image: '/assets/images/paper-quilling.jpg'
                },
                {
                  title: 'Papier-Mâché',
                  description: 'Membuat patung, topeng, atau wadah dekoratif dari campuran bubur kertas dan lem.',
                  // image: '/assets/images/papier-mache.jpg'
                },
                {
                  title: 'Kotak Hadiah',
                  description: 'Membuat kotak hadiah unik dari kardus bekas yang dilapisi kertas dekoratif.',
                  // image: '/assets/images/gift-box.jpg'
                },
                {
                  title: 'Kartu Ucapan',
                  description: 'Membuat kartu ucapan dari kertas daur ulang dengan tambahan hiasan dari material alami.',
                  // image: '/assets/images/greeting-cards.jpg'
                }
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
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
                      height="180"
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
          
          {/* Tutorial */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Tutorial Membuat Kertas Daur Ulang
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Alat dan Bahan
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Sampah kertas (kertas HVS, koran, dll)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Blender atau mixer" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Ember atau baskom besar" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Screen mesh atau kain kasa" />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Bingkai kayu (untuk cetakan kertas)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Kain flanel atau handuk tipis" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Pewarna alami (opsional)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Bunga kering atau daun (opsional)" />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Langkah-langkah
              </Typography>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>Langkah 1: Persiapan Bahan</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    Robek atau potong kertas menjadi potongan-potongan kecil (sekitar 2x2 cm). Semakin kecil potongannya, semakin mudah untuk diproses. Rendam kertas dalam air hangat selama 1-2 jam atau semalaman untuk mempermudah proses pembuatan pulp.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>Langkah 2: Pembuatan Pulp</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    Masukkan kertas yang sudah direndam ke dalam blender dengan perbandingan 1:2 (kertas:air). Blend hingga halus dan menjadi bubur kertas (pulp). Jika ingin membuat kertas berwarna, tambahkan pewarna alami pada tahap ini.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>Langkah 3: Pembentukan Lembaran</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    Siapkan ember besar berisi air dan tuangkan pulp ke dalamnya. Aduk rata. Masukkan bingkai kayu yang sudah dilapisi screen mesh ke dalam air, angkat secara perlahan dengan posisi horizontal. Pulp akan tertinggal di atas screen mesh membentuk lembaran. Jika ingin menambahkan hiasan seperti bunga kering, letakkan di atas pulp yang masih basah.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>Langkah 4: Pengeringan</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    Letakkan kain flanel atau handuk tipis di atas pulp, tekan perlahan untuk menyerap kelebihan air. Balikkan bingkai di atas permukaan datar, tekan bagian belakang screen mesh agar lembaran pulp menempel pada kain. Angkat screen mesh perlahan. Biarkan lembaran kertas mengering secara alami selama 1-2 hari (tergantung cuaca).
                  </Typography>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>Langkah 5: Finishing</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    Setelah kertas benar-benar kering, lepaskan dari kain dengan hati-hati. Untuk hasil yang lebih halus, Anda bisa menyetrika kertas dengan suhu rendah menggunakan alas kain tipis. Potong tepi kertas untuk mendapatkan bentuk yang rapi. Kertas daur ulang siap digunakan atau dijual!
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>
          
          {/* Nilai Ekonomis */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Nilai Ekonomis Sampah Kertas
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Paper 
              sx={{ 
                p: 4, 
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                color: 'white'
              }}
            >
              <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Potensi Nilai Ekonomi Sampah Kertas
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Selain menjual sampah kertas ke pengepul, Anda dapat meningkatkan nilai ekonomisnya dengan mengolahnya menjadi produk daur ulang. Berikut perbandingan nilai ekonomis:
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      1. Penjualan Langsung ke Pengepul:
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      - Kertas HVS: Rp 3.000 - Rp 5.000/kg<br />
                      - Kardus: Rp 2.500 - Rp 4.000/kg<br />
                      - Koran: Rp 2.000 - Rp 3.000/kg
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      2. Pengolahan Menjadi Produk Kreatif:
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      - Kertas daur ulang artistik: Rp 15.000 - Rp 50.000/lembar<br />
                      - Kartu ucapan handmade: Rp 10.000 - Rp 25.000/buah<br />
                      - Kotak hadiah dekoratif: Rp 20.000 - Rp 100.000/buah<br />
                      - Hiasan dinding quilling: Rp 75.000 - Rp 300.000/buah
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      3. Kursus atau Workshop:
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Menyelenggarakan workshop pembuatan kertas daur ulang atau kerajinan kertas<br />
                      Potensi pendapatan: Rp 150.000 - Rp 300.000/peserta
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={5}>
                  <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AutoAwesomeIcon sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Studi Kasus
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph sx={{ opacity: 0.9 }}>
                      Kelompok "Kertas Berdaya" di Yogyakarta berhasil mengubah 100 kg sampah kertas per bulan menjadi berbagai produk kreatif. Dengan investasi awal Rp 2 juta untuk peralatan, mereka mencapai omset bulanan Rp 8-10 juta dengan keuntungan bersih 50-60%.
                    </Typography>
                    <Typography variant="body2" paragraph sx={{ opacity: 0.9 }}>
                      Produk unggulan mereka adalah kertas daur ulang premium dengan campuran serat alami yang dijual seharga Rp 25.000 - Rp 50.000 per lembar ukuran A4, serta undangan pernikahan eksklusif dengan harga Rp 15.000 - Rp 30.000 per buah.
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Kelompok ini juga menyelenggarakan workshop bulanan dengan rata-rata 20 peserta per sesi (Rp 200.000/peserta), menambah pendapatan Rp 4 juta per bulan.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* CTA Section */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                mt: 4,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                color: 'white',
                borderRadius: 2
              }}
            >
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Mulai Perjalanan Daur Ulang Kertas Anda
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
                Daftar sekarang untuk mendapatkan panduan lengkap membuat produk bernilai tinggi dari sampah kertas serta akses ke direktori pembeli potensial produk daur ulang.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/register"
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.secondary.main,
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

export default SampahKertas; 