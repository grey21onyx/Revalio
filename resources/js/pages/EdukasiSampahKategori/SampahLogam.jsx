import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Divider, useTheme, List, ListItem, ListItemIcon, ListItemText, Card, CardMedia, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';
import LandingPageNavbar from '../../components/layout/LandingPageNavbar';
import LandingPageFooter from '../../components/layout/LandingPageFooter';
import { 
  Recycling as RecyclingIcon, 
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  MonetizationOn as MonetizationOnIcon,
  Info as InfoIcon,
  LocalShipping as LocalShippingIcon,
  Construction as ConstructionIcon
} from '@mui/icons-material';

const SampahLogam = () => {
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
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('/assets/images/metal-waste.jpg')`,
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
            Sampah Logam
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ maxWidth: 800, mb: 4, opacity: 0.9 }}
          >
            Pelajari jenis-jenis sampah logam, proses daur ulang, dan nilai ekonomisnya yang tinggi.
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
                Mengenal Sampah Logam
              </Typography>
              <Typography variant="body1" paragraph>
                Sampah logam adalah limbah yang terbuat dari berbagai jenis logam seperti besi, aluminium, tembaga, kuningan, dan baja. Sampah logam memiliki nilai ekonomi yang tinggi karena dapat didaur ulang tanpa kehilangan kualitas material aslinya (daur ulang tertutup).
              </Typography>
              <Typography variant="body1" paragraph>
                Indonesia menghasilkan sekitar 1,2 juta ton sampah logam per tahun, di mana sekitar 30-40% sudah berhasil didaur ulang. Meski persentase daur ulang logam di Indonesia masih rendah dibandingkan negara maju, industri daur ulang logam telah menjadi sektor ekonomi informal yang signifikan dengan nilai transaksi mencapai triliunan rupiah per tahun.
              </Typography>
              <Box 
                sx={{ 
                  bgcolor: 'warning.light', 
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
                  Mendaur ulang 1 ton aluminium dapat menghemat energi setara dengan konsumsi listrik 3 rumah tangga selama 1 tahun dan mengurangi emisi CO₂ hingga 9 ton. Selain itu, daur ulang logam dapat dilakukan berulang kali tanpa menurunkan kualitasnya.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* Jenis-jenis Logam */}
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Jenis-jenis Sampah Logam
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {[
                {
                  title: 'Besi & Baja',
                  description: 'Termasuk paku, sekrup, alat pertukangan, serta berbagai jenis wadah atau struktur besi. Memiliki nilai jual menengah dan mudah didaur ulang.',
                  examples: 'Kaleng makanan, paku, seng atap, besi konstruksi',
                  // image: '/assets/images/iron-steel-waste.jpg',
                  color: theme.palette.grey[700]
                },
                {
                  title: 'Aluminium',
                  description: 'Ringan, tahan karat, dan memiliki nilai jual tinggi. Banyak digunakan untuk kemasan minuman, peralatan rumah tangga, dan komponen elektronik.',
                  examples: 'Kaleng minuman, foil makanan, kusen jendela',
                  // image: '/assets/images/aluminum-waste.jpg',
                  color: theme.palette.grey[400]
                },
                {
                  title: 'Tembaga',
                  description: 'Memiliki nilai jual sangat tinggi, sering ditemukan dalam kabel listrik, pipa, dan komponen elektronik. Sangat dicari oleh pengepul.',
                  examples: 'Kabel listrik, pipa tembaga, komponen elektronik',
                  // image: '/assets/images/copper-waste.jpg',
                  color: theme.palette.warning.dark
                },
                {
                  title: 'Kuningan & Perunggu',
                  description: 'Paduan logam yang sering digunakan untuk dekorasi, kerajinan, dan komponen mesin. Memiliki nilai jual tinggi dan tahan korosi.',
                  examples: 'Keran air, ornamen, piala, medali',
                  // image: '/assets/images/brass-waste.jpg',
                  color: theme.palette.warning.main
                }
              ].map((type, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
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
                      sx={{ 
                        width: { xs: '100%', sm: 150 }, 
                        height: { xs: 140, sm: 'auto' } 
                      }}
                      image={type.image}
                      alt={type.title}
                    /> */}
                    <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                      <Typography 
                        variant="h6" 
                        fontWeight={600} 
                        gutterBottom
                        sx={{ 
                          borderLeft: `4px solid ${type.color}`,
                          pl: 1
                        }}
                      >
                        {type.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {type.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Contoh:</strong> {type.examples}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          {/* Proses Daur Ulang */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Proses Daur Ulang Logam
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box 
                    component="img" 
                    src="/assets/images/lambang-daur-ulang.png" 
                    alt="Proses Daur Ulang Logam"
                    sx={{ 
                      width: '100%', 
                      borderRadius: 2
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="1. Pengumpulan" 
                        secondary="Sampah logam dikumpulkan dari rumah tangga, industri, dan lokasi konstruksi/pembongkaran oleh pemulung, bank sampah, atau pengepul."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="2. Pemilahan" 
                        secondary="Logam dipisahkan berdasarkan jenisnya (besi, aluminium, tembaga, dll) menggunakan magnet, sensor, atau pemilahan manual."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="3. Pemrosesan Awal" 
                        secondary="Logam dipotong, dihancurkan, atau dipadatkan menjadi ukuran yang lebih kecil dan seragam untuk mempermudah pengolahan selanjutnya."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="4. Peleburan" 
                        secondary="Logam dipanaskan dalam tungku peleburan hingga mencair, kemudian kotoran dan pengotor dipisahkan."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="5. Pembentukan" 
                        secondary="Logam cair dicetak menjadi bentuk dasar seperti batangan, lembaran, atau bentuk lain sesuai kebutuhan industri."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="6. Pemurnian & Pengolahan Lanjutan" 
                        secondary="Untuk aplikasi khusus, logam daur ulang dapat dimurnikan lebih lanjut atau dicampur dengan logam lain untuk membentuk paduan dengan sifat tertentu."
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Nilai Ekonomis */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Nilai Ekonomis Sampah Logam
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Harga Jual Sampah Logam
              </Typography>
              <Typography variant="body2" paragraph>
                Sampah logam memiliki nilai ekonomis tertinggi dibandingkan jenis sampah lainnya. Berikut adalah perkiraan harga jual sampah logam (per kg) di Indonesia:
              </Typography>
              
              <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'warning.light' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Jenis Logam</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Kondisi</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Harga/Kg (Rp)</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Catatan</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { type: 'Besi', condition: 'Campuran', price: '4.000 - 6.000', notes: 'Harga bervariasi tergantung ketebalan' },
                      { type: 'Aluminium', condition: 'Kaleng Minuman', price: '10.000 - 14.000', notes: 'Harus bersih dari kotoran' },
                      { type: 'Aluminium', condition: 'Campuran', price: '15.000 - 20.000', notes: 'Potongan jendela, kusen, dll' },
                      { type: 'Tembaga', condition: 'Kabel', price: '60.000 - 80.000', notes: 'Harga lebih tinggi jika sudah dikupas' },
                      { type: 'Tembaga', condition: 'Murni', price: '90.000 - 120.000', notes: 'Tembaga berkualitas tinggi tanpa campuran' },
                      { type: 'Kuningan', condition: 'Campuran', price: '45.000 - 65.000', notes: 'Keran, ornamen, komponen' },
                      { type: 'Baja', condition: 'Stainless Steel', price: '15.000 - 25.000', notes: 'Peralatan dapur, komponen mesin' }
                    ].map((row, index) => (
                      <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.condition}</TableCell>
                        <TableCell>{row.price}</TableCell>
                        <TableCell>{row.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box 
                sx={{ 
                  bgcolor: 'info.light', 
                  color: 'black',
                  p: 2,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3
                }}
              >
                <InfoIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Harga dapat berfluktuasi berdasarkan kondisi pasar global, kualitas material, kebersihan, dan volume penjualan. Tembaga dan kuningan konsisten memiliki nilai jual tertinggi di antara logam-logam bekas.
                </Typography>
              </Box>
              
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Potensi Penghasilan dari Sampah Logam
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalShippingIcon color="warning" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Pemulung & Pengepul
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Seorang pemulung dapat mengumpulkan 5-10 kg sampah logam campuran per hari, menghasilkan Rp 50.000 - Rp 100.000 per hari.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Pengepul kecil yang mengumpulkan dari 10-15 pemulung dapat menghasilkan omset Rp 5-10 juta per minggu dengan margin keuntungan 15-20%.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 'auto' }}>
                      <strong>Potensi penghasilan bulanan:</strong> Rp 1,5 - 3 juta (pemulung), Rp 3 - 8 juta (pengepul kecil)
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ConstructionIcon color="warning" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Bengkel Pengolahan
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Bengkel kecil yang memproses sampah logam menjadi bahan setengah jadi (misalnya mengupas kabel, memadatkan aluminium) dapat meningkatkan nilai jual 30-50%.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Dengan modal awal Rp 10-15 juta untuk peralatan, bengkel pengolahan dapat menghasilkan omset Rp 20-40 juta per bulan.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 'auto' }}>
                      <strong>Potensi keuntungan bersih:</strong> Rp 5 - 15 juta per bulan
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <RecyclingIcon color="warning" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Produk Kreatif
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Mengolah sampah logam menjadi produk seni atau kerajinan dapat meningkatkan nilai hingga 10-20 kali lipat dari harga beli.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Contoh: 1 kg aluminium (Rp 15.000) dapat diubah menjadi hiasan atau furnitur bernilai Rp 150.000 - Rp 300.000.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 'auto' }}>
                      <strong>Potensi keuntungan:</strong> Rp 10 - 25 juta per bulan (untuk usaha kecil-menengah)
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Kreasi Logam */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Inovasi & Kreasi dari Sampah Logam
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {[
                {
                  title: 'Furnitur & Dekorasi',
                  description: 'Sampah logam dapat diubah menjadi berbagai furnitur unik seperti meja, kursi, rak, atau elemen dekorasi rumah yang bernilai jual tinggi.',
                  // image: '/assets/images/metal-furniture.jpg'
                },
                {
                  title: 'Perhiasan & Aksesoris',
                  description: 'Logam seperti tembaga dan kuningan dapat dibentuk menjadi perhiasan, gantungan kunci, atau aksesoris fashion yang trendy.',
                  // image: '/assets/images/metal-jewelry.jpg'
                },
                {
                  title: 'Patung & Karya Seni',
                  description: 'Potongan logam bekas dapat dilas dan dibentuk menjadi patung atau karya seni yang bisa dijual dengan harga premium di galeri seni.',
                  // image: '/assets/images/metal-sculpture.jpg'
                },
                {
                  title: 'Alat & Perkakas',
                  description: 'Logam bekas dapat dilebur dan dicetak ulang menjadi berbagai alat atau perkakas sederhana untuk kebutuhan rumah tangga atau pertanian.',
                  // image: '/assets/images/metal-tools.jpg'
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
          
          {/* Success Stories */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Kisah Sukses Wirausaha Sampah Logam
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Paper 
              sx={{ 
                p: 4, 
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`,
                color: 'white'
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Bengkel Kreatif "Logam Berdaya" - Bandung
              </Typography>
              <Typography variant="body1" paragraph>
                Didirikan oleh Pak Dedi, seorang mantan pekerja pabrik yang di-PHK pada tahun 2018. Dengan modal awal Rp 5 juta dari pesangon, beliau memulai usaha pengumpulan dan pengolahan sampah logam.
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Perjalanan Bisnis:
                  </Typography>
                  <List dense disablePadding>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tahun 1: Fokus pada pengumpulan dan penjualan ke pengepul besar" 
                        primaryTypographyProps={{ variant: 'body2', sx: { opacity: 0.9 } }}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tahun 2: Mulai mengolah kabel tembaga dan aluminium untuk meningkatkan nilai jual" 
                        primaryTypographyProps={{ variant: 'body2', sx: { opacity: 0.9 } }}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tahun 3: Mempekerjakan 5 orang dan mulai membuat produk kreatif dari logam bekas" 
                        primaryTypographyProps={{ variant: 'body2', sx: { opacity: 0.9 } }}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tahun 4: Membuka toko online dan menjual produk ke pasar ekspor melalui marketplace" 
                        primaryTypographyProps={{ variant: 'body2', sx: { opacity: 0.9 } }}
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Hasil:
                  </Typography>
                  <List dense disablePadding>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <MonetizationOnIcon fontSize="small" sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Omset bulanan Rp 80-100 juta dengan keuntungan bersih 30-40%" 
                        primaryTypographyProps={{ variant: 'body2', sx: { opacity: 0.9 } }}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <MonetizationOnIcon fontSize="small" sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Mempekerjakan 12 orang, sebagian besar adalah mantan pemulung" 
                        primaryTypographyProps={{ variant: 'body2', sx: { opacity: 0.9 } }}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <MonetizationOnIcon fontSize="small" sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Produk unggulan: lampu hias dari logam bekas (Rp 350.000 - Rp 2 juta/buah)" 
                        primaryTypographyProps={{ variant: 'body2', sx: { opacity: 0.9 } }}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <MonetizationOnIcon fontSize="small" sx={{ color: 'white' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Telah mengolah lebih dari 200 ton sampah logam, mengurangi emisi CO₂ hingga 400 ton" 
                        primaryTypographyProps={{ variant: 'body2', sx: { opacity: 0.9 } }}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              
              <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>
                "Sampah logam adalah aset tersembunyi. Kuncinya bukan hanya mengumpulkan, tapi bagaimana mengolah dan meningkatkan nilainya. Semakin kreatif Anda mengolahnya, semakin tinggi keuntungan yang bisa didapat." - Pak Dedi, Pendiri Logam Berdaya
              </Typography>
            </Paper>
          </Grid>
          
          {/* CTA Section */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                mt: 4,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`,
                color: 'white',
                borderRadius: 2
              }}
            >
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Mulai Usaha Daur Ulang Logam Anda
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
                Daftar sekarang untuk mendapatkan panduan lengkap memulai usaha daur ulang logam, termasuk daftar pengepul terpercaya, teknik pengolahan, dan jaringan pembeli potensial.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/register"
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.warning.dark,
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

export default SampahLogam; 