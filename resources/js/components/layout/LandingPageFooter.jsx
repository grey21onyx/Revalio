import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  Stack,
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Recycling as RecyclingIcon,
  LocationOn as LocationOnIcon,
  Email as MailIcon,
  Phone as PhoneIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';

const LandingPageFooter = () => {
  const theme = useTheme();
  
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
      }}
    >
      <Container maxWidth="lg">
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
              Platform Edukasi Digital yang Memberdayakan Masyarakat untuk Mengubah Sampah Menjadi Sumber Penghasilan Berkelanjutan
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
                <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
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
          
          {/* Informasi Links - Only Tentang Kami */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Informasi
            </Typography>
            <Stack spacing={1}>
              <Typography 
                variant="body2" 
                component={Link} 
                to="/tentang"
                sx={{ 
                  color: theme.palette.grey[400],
                  textDecoration: 'none',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  }
                }}
              >
                Tentang Kami
              </Typography>
            </Stack>
          </Grid>
          
          {/* Layanan Links - Modified */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Layanan
            </Typography>
            <Stack spacing={1}>
              {[
                { title: 'Edukasi Sampah', path: '/edukasi' }
              ].map((item) => (
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
        {/* Copyright Mark */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Revalio. Hak Cipta Dilindungi Undang-Undang.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPageFooter;
