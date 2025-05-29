import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Container,
  IconButton,
  useScrollTrigger,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Recycling as RecyclingIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Komponen untuk navbar dengan efek elevasi saat scroll
function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 6 : 0,
    sx: {
      backgroundColor: 'rgba(41, 98, 41, 0.85)', // Warna hijau konsisten
      color: 'white', // Warna teks putih konsisten
      transition: 'all 0.3s ease',
      backdropFilter: trigger ? 'blur(10px)' : 'blur(5px)',
      borderBottom: trigger ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.1)',
      boxShadow: trigger 
        ? '0 4px 20px rgba(0,0,0,0.2)' 
        : '0 2px 10px rgba(0,0,0,0.1)',
    },
  });
}

const LandingPageNavbar = ({ navItems = [], scrollRefs = {} }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollToSection = (elementRef) => {
    if (elementRef && elementRef.current) {
      window.scrollTo({
        top: elementRef.current.offsetTop - 80, // Adjust for navbar height
        behavior: 'smooth',
      });
    }
    setMobileMenuOpen(false); // Close mobile menu after clicking
  };

  const handleNavLogin = () => {
    navigate('/login');
  };

  const handleNavRegister = () => {
    navigate('/register');
  };

  // Default nav items if none provided
  const defaultNavItems = [
    { label: 'Beranda', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'Fitur', action: () => handleScrollToSection(scrollRefs.featuresRef) },
    { label: 'Tentang', action: () => handleScrollToSection(scrollRefs.aboutSectionRef) },
    { label: 'Cara Kerja', action: () => handleScrollToSection(scrollRefs.howItWorksSectionRef) },
    { label: 'Dampak', action: () => handleScrollToSection(scrollRefs.impactSectionRef) },
    { label: 'FAQ', action: () => handleScrollToSection(scrollRefs.faqSectionRef) },
  ];

  const displayNavItems = navItems.length > 0 ? navItems : defaultNavItems;

  return (
    <>
      {/* Navbar */}
      <ElevationScroll>
        <AppBar position="fixed" color="transparent">
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ py: 1 }}>
              {/* Logo */}
              <Box
                component={Link}
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  mr: 3,
                  position: 'relative',
                  zIndex: 2,
                  '&:hover': {
                    '& .logo-icon': {
                      transform: 'rotate(20deg)',
                    }
                  }
                }}
              >
                <RecyclingIcon 
                  className="logo-icon"
                  sx={{ 
                    mr: 1, 
                    fontSize: 35,
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))',
                    transition: 'transform 0.3s ease',
                  }} 
                />
                <Typography 
                  variant="h5" 
                  fontWeight={700}
                  sx={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -2,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      backgroundColor: 'secondary.main',
                      opacity: 0.8,
                    }
                  }}
                >
                  Revalio
                </Typography>
              </Box>

              {/* Desktop Menu */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {displayNavItems.map((item, index) => (
                  <Button
                    key={index}
                    onClick={item.action}
                    sx={{ 
                      mx: 1, 
                      color: 'inherit',
                      fontWeight: 600,
                      position: 'relative',
                      overflow: 'hidden',
                      px: 1.5,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '3px',
                        backgroundColor: 'secondary.main',
                        transform: 'scaleX(0)',
                        transformOrigin: 'bottom right',
                        transition: 'transform 0.3s',
                        borderRadius: '3px 3px 0 0',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        '&::after': {
                          transform: 'scaleX(1)',
                          transformOrigin: 'bottom left',
                        }
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              {/* Auth Buttons - Desktop */}
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button 
                  onClick={handleNavLogin} 
                  sx={{ 
                    mx: 1,
                    borderWidth: 2,
                    fontWeight: 600,
                    borderColor: 'white',
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderColor: 'white',
                    }
                  }}
                  variant="outlined" 
                  color="inherit"
                >
                  Masuk
                </Button>
                <Button 
                  onClick={handleNavRegister}
                  variant="contained" 
                  sx={{ 
                    ml: 1,
                    borderRadius: 8,
                    px: 3,
                    fontWeight: 600,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    backgroundColor: 'white',
                    color: 'rgba(41, 98, 41, 0.85)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }
                  }}
                >
                  Daftar
                </Button>
              </Box>

              {/* Mobile menu icon - Posisi diubah ke kanan */}
              <Box sx={{ 
                display: { xs: 'flex', md: 'none' },
                marginLeft: 'auto', // Mendorong hamburger icon ke kanan
                justifyContent: 'flex-end' // Memastikan icon berada di sisi kanan
              }}>
                <IconButton 
                  size="large" 
                  color="inherit"
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.15)', 
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.25)'
                    }
                  }}
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': { 
            width: '80%', 
            maxWidth: 300,
            boxSizing: 'border-box',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>Menu</Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {displayNavItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={item.action}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton onClick={handleNavLogin}>
              <ListItemText primary="Masuk" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleNavRegister}
              sx={{ 
                bgcolor: theme.palette.secondary.main,
                color: 'white',
                mx: 2,
                my: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: theme.palette.secondary.dark,
                }
              }}
            >
              <ListItemText 
                primary="Daftar Sekarang" 
                primaryTypographyProps={{ 
                  align: 'center',
                  fontWeight: 600
                }} 
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Toolbar offset for fixed navbar */}
      <Toolbar />
    </>
  );
};

export default LandingPageNavbar;
