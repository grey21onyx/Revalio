import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  useTheme,
  Stack
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import RecyclingIcon from '@mui/icons-material/Recycling';

// Footer menu items
const menuItems = [
  { title: 'Beranda', path: '/' },
  { title: 'Katalog Sampah', path: '/katalog' },
  { title: 'Panduan Daur Ulang', path: '/daur-ulang' },
  { title: 'Tracking Sampah', path: '/tracking' },
  { title: 'Tips Monetisasi', path: '/monetisasi' },
];

const resourceItems = [
  { title: 'Forum Diskusi', path: '/forum' },
  { title: 'Peluang Usaha', path: '/peluang-usaha' },
  { title: 'Tentang Kami', path: '/tentang' },
  { title: 'Kebijakan Privasi', path: '/kebijakan-privasi' },
  { title: 'Syarat dan Ketentuan', path: '/syarat-ketentuan' },
];

const Footer = ({ sidebarOpen, isMobile, drawerWidth }) => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: theme.palette.grey[900],
        color: theme.palette.common.white,
        pt: 6,
        pb: 3,
        mt: 'auto',
        flexShrink: 0,
        transition: !isMobile ? theme.transitions.create(['margin-left', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }) : 'none',
        marginLeft: !isMobile && sidebarOpen ? `${drawerWidth}px` : 0,
        width: !isMobile && sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
      }}
    >
      <Container maxWidth={isMobile ? false : "lg"}>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RecyclingIcon sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                REVALIO
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Aplikasi Edukasi Digital untuk Memberdayakan Sampah Menjadi Sumber Penghasilan
            </Typography>
            
            {/* Contact Info */}
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MailIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">info@revalio.id</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">+62 812 3456 7890</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">Batam, Indonesia</Typography>
              </Box>
            </Stack>
            
            {/* Social Media */}
            <Box sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="facebook" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="twitter" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="instagram" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" aria-label="linkedin" size="small">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          
          {/* Menu Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Menu Utama
            </Typography>
            <Stack spacing={1}>
              {menuItems.map((item) => (
                <Typography 
                  key={item.title} 
                  variant="body2" 
                  component={Link} 
                  to={item.path}
                  sx={{ 
                    color: theme.palette.grey[400],
                    textDecoration: 'none',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  {item.title}
                </Typography>
              ))}
            </Stack>
          </Grid>
          
          {/* Resources Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Sumber Daya
            </Typography>
            <Stack spacing={1}>
              {resourceItems.map((item) => (
                <Typography 
                  key={item.title} 
                  variant="body2" 
                  component={Link} 
                  to={item.path}
                  sx={{ 
                    color: theme.palette.grey[400],
                    textDecoration: 'none',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  {item.title}
                </Typography>
              ))}
            </Stack>
          </Grid>
        </Grid>
        
        <Divider sx={{ mt: 4, mb: 2, borderColor: theme.palette.grey[800] }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} Revalio. Hak Cipta Dilindungi.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
