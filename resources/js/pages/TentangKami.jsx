import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Card, CardContent, Avatar, Divider, useTheme, IconButton, LinearProgress, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import LandingPageNavbar from '../components/layout/LandingPageNavbar';
import LandingPageFooter from '../components/layout/LandingPageFooter';
import { 
  Recycling as RecyclingIcon, 
  CheckCircle as CheckCircleIcon,
  EmojiObjects as VisionIcon,
  Flag as MissionIcon,
  Timeline as TimelineIcon,
  ArrowForward as ArrowForwardIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  // Icons for statistics
  PeopleAlt as PeopleIcon,
  Public as EarthIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const TentangKami = () => {
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
            Tentang Revalio
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ maxWidth: 800, mb: 4, opacity: 0.9 }}
          >
            Mengenal lebih dekat platform edukasi digital yang berfokus pada pemberdayaan masyarakat melalui pengelolaan sampah.
          </Typography>
        </Container>
      </Box>
      
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1, mb: 8 }}>
        <Grid container spacing={4}>
          {/* Story Section */}
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 4, 
                borderRadius: 2, 
                mb: 4,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Cerita Kami
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Revalio bermula dari keprihatinan kami terhadap masalah sampah di Indonesia yang belum terkelola dengan optimal. 
                    Banyak sampah yang sebenarnya memiliki nilai ekonomis justru berakhir di tempat pembuangan akhir. Berdasarkan data, 
                    Indonesia menghasilkan sekitar 67,8 juta ton sampah per tahun, dengan hanya sekitar 7,5% yang didaur ulang.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Sebagai mahasiswa Program Studi Teknologi Rekayasa Perangkat Lunak di Politeknik Negeri Batam, 
                    kami menggabungkan pengetahuan teknologi dengan kepedulian lingkungan untuk menciptakan solusi digital 
                    yang dapat memberdayakan masyarakat dalam mengelola sampah.
                  </Typography>
                  <Typography variant="body1">
                    Pada tahun 2025, Revalio resmi diluncurkan sebagai platform edukasi digital yang membantu masyarakat 
                    memahami cara mengelola sampah rumah tangga dan industri ringan agar bisa memiliki nilai ekonomis. 
                    Platform kami telah membantu ribuan pengguna mengubah persepsi tentang sampah dari beban menjadi sumber daya.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/images/ubah-limbah-menjadi-peluang.jpeg"
                      alt="Revalio Story"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 2,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        transition: 'transform 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Vision & Mission */}
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Visi & Misi
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <VisionIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Visi Kami
                    </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    Menjadi platform edukasi pengelolaan sampah terdepan di Indonesia yang memberdayakan masyarakat 
                    untuk berpartisipasi aktif dalam ekonomi sirkular dan menciptakan dampak lingkungan yang positif.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: `4px solid ${theme.palette.secondary.main}`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MissionIcon sx={{ color: theme.palette.secondary.main, mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Misi Kami
                    </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    1. Menjadi solusi inovatif untuk mengatasi masalah pengelolaan sampah di Indonesia dengan membantu 
                    klasifikasi dan sortir sampah rumah tangga dan industri ringan.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    2. Memberikan pengetahuan praktis tentang cara mengelola sampah sehingga dapat menjadi 
                    sumber penghasilan tambahan.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    3. Menyediakan panduan interaktif daur ulang dan reuse, informasi nilai ekonomis sampah, 
                    serta tips monetisasi limbah.
                  </Typography>
                  <Typography variant="body1">
                    4. Menghubungkan pelaku daur ulang dengan pasar potensial untuk meningkatkan nilai ekonomi sampah.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          
          {/* Core Values */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Nilai-Nilai Kami
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {[
                {
                  value: 'Pemberdayaan Masyarakat',
                  description: 'Membantu masyarakat memahami nilai ekonomis dari sampah yang mereka hasilkan dan memberikan alat untuk mengubahnya menjadi sumber penghasilan.'
                },
                {
                  value: 'Ekonomi Sirkular',
                  description: 'Mendorong praktik ekonomi sirkular melalui daur ulang dan penggunaan kembali, mengurangi limbah yang berakhir di TPA dan menciptakan nilai tambah.'
                },
                {
                  value: 'Kolaborasi',
                  description: 'Bekerja sama dengan berbagai pihak termasuk bank sampah, pengepul, perusahaan daur ulang, dan komunitas untuk menciptakan dampak yang lebih besar.'
                },
                {
                  value: 'Inovasi',
                  description: 'Kami terus mencari solusi kreatif dan inovatif untuk masalah sampah yang dihadapi masyarakat.'
                },
                {
                  value: 'Aksesibilitas',
                  description: 'Kami berkomitmen untuk membuat informasi dan solusi pengelolaan sampah dapat diakses oleh semua lapisan masyarakat.'
                },
                {
                  value: 'Transparansi',
                  description: 'Kami menjunjung tinggi keterbukaan dalam segala aspek operasional dan komunikasi kami.'
                }
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      border: '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: 2,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-5px)'
                      }
                    }}
                  >
                    <CheckCircleIcon sx={{ color: theme.palette.success.main, mr: 1.5, mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {item.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          {/* Team Section - Enhanced */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Tim Kami
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3} justifyContent="center">
              {[
                {
                  name: 'Muhamad Ariffadhlullah',
                  role: 'Ketua Tim',
                  bio: 'Bertanggung jawab atas pengembangan konsep dan strategi bisnis Revalio. Memastikan platform sesuai dengan kebutuhan pengguna dan memberikan dampak nyata bagi masyarakat.',
                  avatar: '/assets/images/arif.jpg',
                  social: {
                    linkedin: 'https://linkedin.com/',
                    twitter: 'https://twitter.com/',
                    instagram: 'https://instagram.com/'
                  }
                },
                {
                  name: 'Diva Satria',
                  role: 'Pengembang Utama',
                  bio: 'Mengembangkan platform teknologi untuk mendukung visi Revalio. Memastikan aplikasi berjalan dengan lancar, aman, dan memberikan pengalaman pengguna yang optimal.',
                  avatar: '/assets/images/Diva.jpeg',
                  social: {
                    linkedin: 'https://linkedin.com/',
                    twitter: 'https://twitter.com/',
                    instagram: 'https://instagram.com/'
                  }
                },
                {
                  name: 'Berkat Tua Siallagan',
                  role: 'Ahli Konten',
                  bio: 'Menyusun materi edukasi dan panduan pengelolaan sampah yang akurat dan mudah dipahami. Bertanggung jawab atas kualitas konten dan relevansi informasi yang disajikan.',
                  avatar: 'https://berkat.my.id/assets/img/profile/berkat-tua-siallagan.jpg',
                  social: {
                    linkedin: 'https://linkedin.com/',
                    twitter: 'https://twitter.com/',
                    instagram: 'https://instagram.com/'
                  }
                },
              ].map((member, index) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.12)'
                      },
                      maxWidth: { md: '95%', lg: '85%' },
                      mx: 'auto'
                    }}
                  >
                    <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden' }}>
                      <Box
                        component="img"
                        src={member.avatar}
                        alt={member.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="primary.main" sx={{ mb: 1.5 }}>
                        {member.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {member.bio}
                      </Typography>
                      
                      {/* Social media icons */}
                      <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                        <Tooltip title="LinkedIn">
                          <IconButton 
                            size="small" 
                            component="a" 
                            href={member.social.linkedin} 
                            target="_blank"
                            sx={{ 
                              color: 'text.secondary',
                              '&:hover': { color: '#0077B5' }
                            }}
                          >
                            <LinkedInIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Twitter">
                          <IconButton 
                            size="small" 
                            component="a" 
                            href={member.social.twitter} 
                            target="_blank"
                            sx={{ 
                              color: 'text.secondary',
                              '&:hover': { color: '#1DA1F2' }
                            }}
                          >
                            <TwitterIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Instagram">
                          <IconButton 
                            size="small" 
                            component="a" 
                            href={member.social.instagram} 
                            target="_blank"
                            sx={{ 
                              color: 'text.secondary',
                              '&:hover': { 
                                background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                                color: 'white'
                              }
                            }}
                          >
                            <InstagramIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          {/* Partners Section - New */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Didukung Oleh
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Paper sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="body1" align="center" color="text.secondary" paragraph>
                Revalio berkolaborasi dengan institusi dan organisasi terkemuka untuk mewujudkan visi kami
              </Typography>
              
              <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ justifyContent: 'center' }}>
                {[
                  {
                    name: 'Politeknik Negeri Batam',
                    logo: '/assets/images/Poltek.png',
                    link: '#'
                  },
                  {
                    name: 'Kementerian Pendidikan',
                    logo: '/assets/images/Kemendikbutristek.png',
                    link: '#'
                  },
                  {
                    name: 'OLIVIA 2025',
                    logo: '/assets/images/Logo-Olivia-X-2025.jpg',
                    link: '#'
                  }
                ].map((partner, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box
                      component={Link}
                      to={partner.link}
                      sx={{
                        display: 'block',
                        textAlign: 'center',
                        p: 2,
                        height: 120,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={partner.logo}
                        alt={partner.name}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
          
          {/* CTA Section - Enhanced */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                mt: 4,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                color: 'white',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background decoration */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  zIndex: 0
                }} 
              />
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  zIndex: 0
                }} 
              />
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Jadilah Bagian dari Gerakan Kami
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
                  Bergabunglah dengan Revalio dan ikut berkontribusi dalam menciptakan lingkungan yang lebih bersih sambil membuka peluang ekonomi baru.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/register"
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 15px rgba(0,0,0,0.1)' 
                    },
                    px: 4,
                    py: 1,
                    borderRadius: 8,
                    fontWeight: 600,
                    transition: 'all 0.3s ease'
                  }}
                >
                  Daftar Sekarang
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

export default TentangKami;