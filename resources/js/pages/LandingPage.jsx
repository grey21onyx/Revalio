import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Container, 
  Button,
  Stack,
  useTheme,
  Divider,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  useScrollTrigger,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  TextField
} from '@mui/material';
import {
  Recycling as RecyclingIcon,
  NavigateNext as NavigateNextIcon, 
  AutoAwesome as KatalogIcon,
  Refresh as DaurUlangIcon,
  Insights as TrackingIcon,
  MonetizationOn as MonetisasiIcon,
  Forum as ForumIcon,
  BusinessCenter as PeluangUsahaIcon,
  ChevronRight as ChevronRightIcon,
  ArrowForward as ArrowForwardIcon,
  Article as ArticleIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  NavigateBefore as NavigateBeforeIcon,
  FormatQuote as FormatQuoteIcon,
  Star as StarIcon,
  Lock as LockIcon,
  People as PeopleIcon,
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
// import axios from 'axios'; // Akan diaktifkan jika ada panggilan API di landing page

// Import komponen ScrollToTop
import ScrollToTop from '../components/ui/ScrollToTop';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

// Komponen untuk section fitur dengan animasi hover (sama seperti di Home.jsx)
const FeatureCard = ({ icon: Icon, title, description, path, color }) => {
  const cardRef = useRef(null);

  return (
    <Card
      ref={cardRef}
      className="feature-card"
      data-color={color}
      component={Link}
      to={path} // Path ini mungkin perlu disesuaikan jika fitur hanya bisa diakses setelah login
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'text.primary',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: 'grey.100',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '3px',
          backgroundColor: color,
          transform: 'scaleX(0)',
          transition: 'transform 0.3s ease',
          transformOrigin: 'left'
        },
        '&:hover:after': {
          transform: 'scaleX(1)'
        }
      }}
    >
      <CardContent className="card-content" sx={{ p: 3, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            className="feature-icon"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}15`, 
              color,
              borderRadius: '50%',
              p: 1.5,
              mr: 2,
              transition: 'all 0.3s ease'
            }}
          >
            <Icon fontSize="large" />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          className="card-description"
          sx={{ mb: 2, flexGrow: 1, color: 'text.secondary' }}
        >
          {description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Typography 
            className="card-action"
            variant="button" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: color,
              fontWeight: 500,
              transition: 'transform 0.2s ease'
            }}
          >
            Jelajahi 
            <ChevronRightIcon sx={{ ml: 0.5, transition: 'transform 0.2s ease' }} />
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Component for section headings (sama seperti di Home.jsx)
const SectionHeading = ({ title, subtitle, actionText, actionLink }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          fontWeight={700}
          sx={{
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 60,
              height: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.primary.main
            }
          }}
        >
          {title}
        </Typography>
        
        {actionText && actionLink && (
          <Button 
            component={Link} 
            to={actionLink}
            endIcon={<ArrowForwardIcon />}
            variant="text"
            color="primary"
            sx={{
              fontWeight: 600,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateX(4px)'
              }
            }}
          >
            {actionText}
          </Button>
        )}
      </Box>
      
      {subtitle && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 2.5, mb: 3, maxWidth: '70ch' }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};


const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroImageRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const impactSectionRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroButtonsRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const faqSectionRef = useRef(null);
  const howItWorksSectionRef = useRef(null);

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

  // Menu items for navbar
  const navItems = [
    { label: 'Beranda', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'Fitur', action: () => handleScrollToSection(featuresRef) },
    { label: 'Tentang', action: () => handleScrollToSection(aboutSectionRef) },
    { label: 'Cara Kerja', action: () => handleScrollToSection(howItWorksSectionRef) },
    { label: 'Dampak', action: () => handleScrollToSection(impactSectionRef) },
    { label: 'FAQ', action: () => handleScrollToSection(faqSectionRef) },
  ];

  useEffect(() => {
    // Hero section animations
    gsap.fromTo(
      heroContentRef.current.children,
      { 
        opacity: 0, 
        y: 30 
      },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.15, 
        duration: 0.9,
        ease: "power3.out",
        delay: 0.2
      }
    );
    
    if (heroTextRef.current) {
      gsap.fromTo(
        heroTextRef.current,
        { 
          opacity: 0, 
          y: 20 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: "power3.out",
          delay: 0.5
        }
      );
    }
    
    if (heroSubtitleRef.current) {
      gsap.fromTo(
        heroSubtitleRef.current,
        { 
          clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
          opacity: 0
        },
        { 
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          opacity: 1,
          duration: 1.2,
          delay: 1.2,
          ease: "power4.out"
        }
      );
    }
    
    if (heroButtonsRef.current) {
      gsap.fromTo(
        heroButtonsRef.current.children,
        { 
          scale: 0.8,
          opacity: 0
        },
        { 
          scale: 1,
          opacity: 1,
          stagger: 0.2,
          duration: 0.7,
          delay: 1.5,
          ease: "back.out(1.7)"
        }
      );
    }
    
    gsap.fromTo(
      heroImageRef.current,
      { 
        opacity: 0, 
        scale: 0.9,
        rotation: -5
      },
      { 
        opacity: 1, 
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
      }
    );

    // Section reveal animations with scroll trigger
    const sections = [
      featuresRef, 
      aboutSectionRef,
      impactSectionRef,
      ctaRef
    ].filter(ref => ref.current);
    
    sections.forEach((sectionRef, index) => {
      gsap.fromTo(
        sectionRef.current,
        { 
          opacity: 0, 
          y: 50 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          delay: 0.1 * index,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
    
    if (impactSectionRef.current) {
      gsap.to(impactSectionRef.current, {
        backgroundPosition: "50% 30%",
        ease: "none",
        scrollTrigger: {
          trigger: impactSectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
      
      const impactIcons = impactSectionRef.current.querySelectorAll('.impact-icon');
      impactIcons.forEach((icon, i) => {
        const speed = 0.2 + (i * 0.1);
        gsap.to(icon, {
          y: `-${speed * 100}px`,
          ease: "none",
          scrollTrigger: {
            trigger: impactSectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    }
    
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      const cardContent = card.querySelector('.card-content');
      const cardIcon = card.querySelector('.feature-icon');
      const cardTitle = card.querySelector('h6');
      const cardAction = card.querySelector('.card-action');
      
      const tl = gsap.timeline({ paused: true });
      
      tl.to(card, { 
        y: -10, 
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)', 
        duration: 0.3, 
        ease: "power2.out" 
      }, 0);
      
      tl.to(cardIcon, {
        rotation: 5,
        scale: 1.2,
        duration: 0.4,
        ease: "back.out"
      }, 0);
      
      tl.to(cardTitle, {
        color: card.dataset.color || '#1976d2',
        duration: 0.3
      }, 0);
      
      tl.to(cardAction, {
        x: 5,
        opacity: 1,
        duration: 0.3
      }, 0);
      
      card.addEventListener('mouseenter', () => tl.play());
      card.addEventListener('mouseleave', () => tl.reverse());
    });

    const aboutSection = aboutSectionRef.current;
    if (aboutSection) {
      const aboutImage = aboutSection.querySelector('.about-image img');
      if (aboutImage) {
        gsap.fromTo(
          aboutImage,
          { 
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            scale: 1.2
          },
          { 
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            scale: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: aboutImage,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );
      }
      
      const featureItems = aboutSection.querySelectorAll('.about-feature');
      if (featureItems.length) {
        gsap.fromTo(
          featureItems,
          { 
            x: -30,
            opacity: 0
          },
          { 
            x: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: aboutSection,
              start: "top 70%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    }

    const ctaSection = ctaRef.current;
    if (ctaSection) {
      gsap.to(ctaSection, {
        backgroundPosition: "50% 30%",
        ease: "none",
        scrollTrigger: {
          trigger: ctaSection,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
      
      const ctaTitle = ctaSection.querySelector('.cta-title');
      const ctaDescription = ctaSection.querySelector('.cta-description');
      const ctaSteps = ctaSection.querySelector('.cta-steps');
      const ctaButtons = ctaSection.querySelector('.cta-buttons');
      const ctaImage = ctaSection.querySelector('.cta-image');
      
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: ctaSection,
          start: "top 80%",
          end: "center center",
          toggleActions: "play none none none"
        }
      });
      
      if (ctaTitle) {
        ctaTl.fromTo(ctaTitle, 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
        );
      }
      
      if (ctaDescription) {
        ctaTl.fromTo(ctaDescription, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 
          "-=0.5"
        );
      }
      
      if (ctaSteps) {
        const steps = ctaSteps.querySelectorAll('.cta-step');
        ctaTl.fromTo(steps, 
          { opacity: 0, x: -20 }, 
          { opacity: 1, x: 0, stagger: 0.15, duration: 0.5, ease: "back.out(1.2)" }, 
          "-=0.3"
        );
      }
      
      if (ctaButtons) {
        ctaTl.fromTo(ctaButtons.children, 
          { opacity: 0, y: 20, scale: 0.9 }, 
          { opacity: 1, y: 0, scale: 1, stagger: 0.2, duration: 0.6, ease: "power3.out" }, 
          "-=0.2"
        );
      }
      
      if (ctaImage) {
        ctaTl.fromTo(ctaImage, 
          { opacity: 0, scale: 0.8, rotation: -5 }, 
          { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: "elastic.out(1, 0.5)" }, 
          "-=0.7"
        );
        
        gsap.to(ctaImage, {
          y: 15,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <Box sx={{ backgroundColor: '#f8f9fa' }}>
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
                {navItems.map((item, index) => (
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
          {navItems.map((item, index) => (
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

      {/* Hero Section */}
      <Box 
        ref={heroRef}
        sx={{ 
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/assets/images/bg1.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          mb: { xs: 5, md: 8 },
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          minHeight: { xs: '70vh', md: '85vh' }, 
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7} ref={heroContentRef}>
              <Box sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography 
                  ref={heroTextRef}
                  variant="h3" 
                  component="h1" 
                  fontWeight={800} 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    letterSpacing: '-0.5px',
                    mb: 2
                  }}
                >
                  Ubah Sampah Menjadi <Box component="span" sx={{ color: theme.palette.secondary.main }}>Nilai Ekonomis</Box>
                </Typography>
                <Typography 
                  ref={heroSubtitleRef}
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 400,
                    fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.35rem' },
                    opacity: 0.9,
                    maxWidth: '700px',
                    lineHeight: 1.6
                  }}
                >
                  Temukan cara praktis mendaur ulang sampah, dapatkan pendapatan tambahan, dan berkontribusi pada lingkungan yang lebih bersih.
                </Typography>
                
                <Stack 
                  ref={heroButtonsRef}
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 2, sm: 3 }}
                  sx={{ mt: 3 }}
                >
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large"
                    component={Link}
                    to="/register"
                    sx={{ 
                      borderRadius: 8,
                      px: { xs: 3, md: 5 },
                      py: 1.75,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                      }
                    }}
                  >
                    Daftar Sekarang
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    size="large"
                    component={Link}
                    to="/tentang"
                    sx={{ 
                      borderRadius: 8,
                      px: { xs: 3, md: 5 },
                      py: 1.75,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderColor: 'white',
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 2,
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s'
                    }}
                  >
                    Pelajari Lebih Lanjut
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Box 
                ref={heroImageRef}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.25))'
                }}
              >
                <RecyclingIcon sx={{ fontSize: 280, opacity: 0.95 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content for Landing Page */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Feature Sections */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={featuresRef}>
          <SectionHeading 
            title="Fitur Unggulan Revalio"
            subtitle="Revalio menyediakan berbagai fitur untuk membantu Anda memahami dan mendapatkan nilai ekonomis dari sampah yang biasanya terbuang percuma."
          />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={4}> {/* Disesuaikan gridnya agar lebih pas */}
              <FeatureCard 
                icon={KatalogIcon}
                title="Katalog Sampah Informatif" 
                description="Pelajari berbagai jenis sampah bernilai ekonomis, cara sortir, dan estimasi harganya di pasaran." 
                path="/register" // Arahkan ke registrasi untuk eksplorasi lebih lanjut
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <FeatureCard 
                icon={DaurUlangIcon}
                title="Panduan Daur Ulang Kreatif" 
                description="Temukan berbagai tutorial dan panduan cara mendaur ulang atau menggunakan kembali sampah menjadi produk berguna." 
                path="/register"
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <FeatureCard 
                icon={MonetisasiIcon}
                title="Tips Monetisasi Efektif" 
                description="Dapatkan informasi tentang cara menjual sampah dan siapa yang membelinya di lokasi Anda." 
                path="/register"
                color={theme.palette.warning.main}
              />
            </Grid>
            {/* Fitur lain bisa ditambahkan atau beberapa fitur di sini adalah yang paling menonjol untuk landing page */}
          </Grid>
        </Box>

        {/* About Revalio Section */}
        <Box ref={aboutSectionRef} sx={{ mb: { xs: 6, md: 8 } }}>
          <SectionHeading 
            title="Tentang Revalio"
            subtitle="Revalio adalah platform edukasi digital yang bertujuan untuk memberdayakan masyarakat dalam mengelola sampah menjadi sumber penghasilan yang berkelanjutan."
          />
          
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                <Box 
                  className="about-image"
                  sx={{ 
                    position: 'relative', 
                    borderRadius: 4, 
                    overflow: 'hidden', 
                    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                    mb: 3
                  }}
                >
                  <img 
                    src="/assets/images/ubah-limbah-menjadi-peluang.jpeg" 
                    alt="Revalio Background" 
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      display: 'block'
                    }} 
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    width: '100%', 
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    p: 3,
                    color: 'white'
                  }}>
                    <Typography variant="h6" fontWeight={700} align="left">
                      Ubah Limbah Menjadi Peluang
                    </Typography>
                  </Box>
                </Box>
                
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    mb: 2, 
                    fontSize: '1.05rem',
                    textAlign: 'justify'
                  }}
                >
                  Revalio berfokus pada pemberdayaan masyarakat untuk mengelola sampah dengan lebih baik dan mendapatkan nilai ekonomis darinya. Aplikasi ini membantu Anda mengidentifikasi sampah bernilai, mempelajari cara pengelolaannya, dan menemukan peluang monetisasi.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '100%' }}>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Paper 
                      className="about-feature"
                      sx={{ 
                        p: 2, 
                        height: '100%', 
                        borderLeft: '4px solid', 
                        borderColor: 'primary.main',
                        textAlign: 'left'
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Edukasi Jenis Sampah
                      </Typography>
                      <Typography variant="body2">
                        Informasi tentang berbagai jenis sampah yang memiliki nilai ekonomis.
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper 
                      className="about-feature"
                      sx={{ 
                        p: 2, 
                        height: '100%', 
                        borderLeft: '4px solid', 
                        borderColor: 'secondary.main',
                        textAlign: 'left'
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Panduan Interaktif
                      </Typography>
                      <Typography variant="body2">
                        Tutorial cara mengolah sampah menjadi barang bernilai.
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper 
                      className="about-feature"
                      sx={{ 
                        p: 2, 
                        height: '100%', 
                        borderLeft: '4px solid', 
                        borderColor: 'success.main',
                        textAlign: 'left'
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Tracking & Monetisasi
                      </Typography>
                      <Typography variant="body2">
                        Tools untuk melacak dan mempelajari cara monetisasi sampah.
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper 
                      className="about-feature"
                      sx={{ 
                        p: 2, 
                        height: '100%', 
                        borderLeft: '4px solid', 
                        borderColor: 'warning.main',
                        textAlign: 'left'
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Komunitas Peduli
                      </Typography>
                      <Typography variant="body2">
                        Forum diskusi dan berbagi pengalaman dengan sesama pengelola sampah.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                <Box sx={{ textAlign: 'left' }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    component={Link}
                    to="/tentang" // Halaman detail Tentang Kami
                    sx={{ 
                      borderRadius: 8,
                      px: 3,
                      py: 1.25,
                      fontWeight: 600
                    }}
                  >
                    Pelajari Selengkapnya
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>


        {/* How It Works Section */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={howItWorksSectionRef}>
          <SectionHeading 
            title="Cara Kerja Revalio"
            subtitle="Ikuti langkah-langkah sederhana ini untuk mulai mendaur ulang dan menghasilkan pendapatan tambahan dari sampah."
          />
          
          <Box sx={{ position: 'relative', py: 4 }}>
            <Box 
              sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: 0, 
                right: 0, 
                height: 4, 
                bgcolor: 'grey.100', 
                zIndex: 0,
                display: { xs: 'none', md: 'block' }
              }}
            />
            
            <Grid container spacing={3}>
              {[
                {
                  icon: <RecyclingIcon sx={{ fontSize: 40, color: 'white' }} />,
                  color: theme.palette.primary.main,
                  title: 'Kumpulkan Sampah',
                  description: 'Pisahkan sampah berdasarkan jenisnya (plastik, kertas, logam, dll.) dan bersihkan seperlunya.'
                },
                {
                  icon: <KatalogIcon sx={{ fontSize: 40, color: 'white' }} />,
                  color: theme.palette.secondary.main,
                  title: 'Identifikasi Nilai',
                  description: 'Gunakan katalog Revalio untuk mengetahui nilai ekonomis dan cara terbaik mengelola sampah Anda.'
                },
                {
                  icon: <DaurUlangIcon sx={{ fontSize: 40, color: 'white' }} />,
                  color: theme.palette.success.main,
                  title: 'Daur Ulang / Jual',
                  description: 'Ikuti tutorial daur ulang atau temukan pengepul terdekat untuk menjual sampah tersebut.'
                },
                {
                  icon: <MonetisasiIcon sx={{ fontSize: 40, color: 'white' }} />,
                  color: theme.palette.warning.main,
                  title: 'Dapatkan Keuntungan',
                  description: 'Hasilkan pendapatan dari penjualan sampah atau produk daur ulang yang bernilai lebih tinggi.'
                },
              ].map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Box 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%', 
                        backgroundColor: step.color, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        boxShadow: `0 4px 20px ${step.color}40`,
                        mx: 'auto',
                        mb: 2,
                        position: 'relative',
                        '&::before': {
                          content: `"${index + 1}"`,
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          bgcolor: 'background.paper',
                          border: `2px solid ${step.color}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.875rem'
                        }
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {step.description}
                    </Typography>
                    
                    {index < 3 && (
                      <Box 
                        sx={{ 
                          display: { xs: 'none', md: 'block' }, 
                          position: 'absolute', 
                          top: 40, 
                          right: -16, 
                          transform: 'rotate(-20deg)',
                          color: step.color
                        }}
                      >
                        <NavigateNextIcon sx={{ fontSize: 40 }} />
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ textAlign: 'center', mt: 5 }}>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link}
                to="/login" 
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  borderRadius: 8,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                Mulai Sekarang
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Environmental Impact Section */}
        <Box 
          ref={impactSectionRef}
          sx={{ 
            mb: { xs: 6, md: 8 },
            py: 5,
            px: { xs: 3, md: 5 },
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(rgba(76, 175, 80, 0.8), rgba(76, 175, 80, 0.9)), url('/assets/images/bg1.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            fontWeight={700} 
            gutterBottom
            align="center"
            sx={{ mb: 4 }}
          >
            Dampak Positif Pengelolaan Sampah
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, height: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: 3, backdropFilter: 'blur(10px)', transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-8px)' } }}>
                <Box className="impact-icon" sx={{ fontSize: '3rem', mb: 2, display: 'inline-block', background: 'rgba(255,255,255,0.2)', p: 2, borderRadius: '50%', lineHeight: 1 }}>♻️</Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>Pengurangan Limbah</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Mengurangi volume sampah ke TPA.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, height: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: 3, backdropFilter: 'blur(10px)', transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-8px)' } }}>
                <Box sx={{ fontSize: '3rem', mb: 2, display: 'inline-block', background: 'rgba(255,255,255,0.2)', p: 2, borderRadius: '50%', lineHeight: 1 }}>🌱</Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>Penghematan Energi</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Menghemat energi produksi barang baru.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, height: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: 3, backdropFilter: 'blur(10px)', transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-8px)' } }}>
                <Box sx={{ fontSize: '3rem', mb: 2, display: 'inline-block', background: 'rgba(255,255,255,0.2)', p: 2, borderRadius: '50%', lineHeight: 1 }}>💰</Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>Nilai Ekonomis</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Mengubah sampah jadi sumber pendapatan.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, height: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: 3, backdropFilter: 'blur(10px)', transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-8px)' } }}>
                <Box sx={{ fontSize: '3rem', mb: 2, display: 'inline-block', background: 'rgba(255,255,255,0.2)', p: 2, borderRadius: '50%', lineHeight: 1 }}>🌍</Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>Pengurangan Emisi</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Mengurangi emisi gas rumah kaca.</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* FAQ Section */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={faqSectionRef}>
          <SectionHeading 
            title="Pertanyaan Umum"
            subtitle="Temukan jawaban atas pertanyaan yang sering ditanyakan tentang Revalio dan cara kerjanya."
          />
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              {/* FAQ Accordion - Column 1 */}
              {[
                {
                  question: "Apa itu Revalio?",
                  answer: "Revalio adalah platform edukasi digital yang fokus pada pengelolaan sampah menjadi sumber penghasilan. Kami menyediakan informasi, tutorial, dan alat untuk membantu Anda mengidentifikasi, mengelola, dan memonetisasi sampah."
                },
                {
                  question: "Bagaimana cara memulai di Revalio?",
                  answer: "Cukup daftar akun gratis, lalu akses katalog sampah dan panduan daur ulang. Anda bisa mulai mencatat sampah yang terkumpul, mempelajari tutorial, dan terhubung dengan komunitas penggiat daur ulang."
                },
                {
                  question: "Apakah Revalio gratis digunakan?",
                  answer: "Ya, sebagian besar fitur Revalio tersedia secara gratis. Kami menyediakan layanan premium dengan fitur tambahan untuk pengguna yang membutuhkan analisis mendalam dan alat pengelolaan sampah yang lebih canggih."
                }
              ].map((item, index) => (
                <Accordion 
                  key={index} 
                  sx={{ 
                    mb: 1.5, 
                    borderRadius: '10px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    sx={{ 
                      backgroundColor: 'rgba(0,0,0,0.02)', 
                      borderBottom: '1px solid rgba(0,0,0,0.05)', 
                    }}
                  >
                    <Typography fontWeight={600}>{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
            
            <Grid item xs={12} md={6}>
              {/* FAQ Accordion - Column 2 */}
              {[
                {
                  question: "Bagaimana Revalio membantu memonetisasi sampah?",
                  answer: "Revalio menyediakan informasi lengkap tentang jenis sampah bernilai ekonomi, estimasi harga pasaran, dan kontak pengepul di sekitar Anda. Kami juga memberikan tutorial daur ulang sampah menjadi produk bernilai jual."
                },
                {
                  question: "Siapa saja yang bisa menggunakan Revalio?",
                  answer: "Revalio bisa digunakan oleh siapa saja - individu, komunitas, lembaga pendidikan, dan bisnis yang peduli dengan pengelolaan sampah dan ingin mendapatkan nilai ekonomis dari aktivitas daur ulang."
                },
                {
                  question: "Bagaimana cara melacak sampah yang sudah saya kumpulkan?",
                  answer: "Di dashboard Revalio, Anda bisa mencatat jenis dan jumlah sampah yang dikumpulkan. Platform akan menghitung estimasi nilai ekonomisnya dan menampilkan statistik perkembangan Anda dari waktu ke waktu."
                }
              ].map((item, index) => (
                <Accordion 
                  key={index} 
                  sx={{ 
                    mb: 1.5, 
                    borderRadius: '10px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index+3}-content`}
                    id={`panel${index+3}-header`}
                    sx={{ 
                      backgroundColor: 'rgba(0,0,0,0.02)', 
                      borderBottom: '1px solid rgba(0,0,0,0.05)', 
                    }}
                  >
                    <Typography fontWeight={600}>{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
              
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action */}
        <Card
          ref={ctaRef}
          sx={{
            mb: 6,
            borderRadius: { xs: 3, md: 4 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            transform: 'translateZ(0)',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'url(/assets/images/bg1.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.1,
              zIndex: 1
            }
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 }, position: 'relative', zIndex: 2 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography 
                  className="cta-title"
                  variant="h4" 
                  fontWeight={800} 
                  gutterBottom
                >
                  Mulai Perjalanan Daur Ulang Anda Sekarang
                </Typography>
                <Typography 
                  className="cta-description"
                  variant="body1" 
                  sx={{ mb: 4, opacity: 0.9, fontSize: '1.1rem', maxWidth: '600px' }}
                >
                  Dapatkan akses penuh ke fitur Revalio dan jadilah bagian dari komunitas yang peduli lingkungan sambil menghasilkan pendapatan tambahan dari sampah.
                </Typography>
                
                {/* Feature highlights */}
                <Box className="cta-features" sx={{ mb: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Box 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            bgcolor: 'rgba(255,255,255,0.15)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            mr: 2,
                            flexShrink: 0
                          }}
                        >
                          <KatalogIcon />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                            Katalog Sampah Lengkap
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Akses informasi 500+ jenis sampah berharga
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Box 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            bgcolor: 'rgba(255,255,255,0.15)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            mr: 2,
                            flexShrink: 0
                          }}
                        >
                          <DaurUlangIcon />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                            Panduan Daur Ulang
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Tutorial langkah demi langkah dengan gambar dan video
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Box 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            bgcolor: 'rgba(255,255,255,0.15)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            mr: 2,
                            flexShrink: 0
                          }}
                        >
                          <TrackingIcon />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                            Tracking & Analisis
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Pantau progres dan analisa nilai ekonomi sampah Anda
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Box 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            bgcolor: 'rgba(255,255,255,0.15)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            mr: 2,
                            flexShrink: 0
                          }}
                        >
                          <ForumIcon />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                            Komunitas Aktif
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Forum diskusi dan berbagi pengalaman antar penggiat daur ulang
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Stack 
                  className="cta-buttons"
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                >
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/register"
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)', transform: 'translateY(-3px)', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' },
                      borderRadius: 8, px: { xs: 3, md: 5 }, py: 1.5, fontSize: '1.1rem', fontWeight: 600, transition: 'all 0.3s', boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                    }}
                  >
                    Daftar Gratis
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/login"
                    sx={{
                      borderColor: 'white', color: 'white',
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)', transform: 'translateY(-3px)' },
                      borderRadius: 8, px: { xs: 3, md: 5 }, py: 1.5, fontSize: '1.1rem', fontWeight: 600, transition: 'all 0.3s', borderWidth: 2
                    }}
                  >
                    Masuk
                  </Button>
                </Stack>
                

              </Grid>
              
              <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'relative' }}>
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      width: '280px',
                      height: '280px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)',
                      filter: 'blur(20px)',
                      animation: 'pulse 3s infinite',
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(1)', opacity: 0.6 },
                        '50%': { transform: 'scale(1.1)', opacity: 0.4 },
                        '100%': { transform: 'scale(1)', opacity: 0.6 }
                      }
                    }}
                  />
                  <Box sx={{ width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <Box 
                      className="cta-image"
                      component="img"
                      src="/assets/images/kelola-sampah.png"
                      alt="Revalio App"
                      sx={{ width: '90%', height: 'auto', borderRadius: '10px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', transform: 'rotate(-5deg)', transition: 'transform 0.3s ease', '&:hover': { transform: 'rotate(0deg) scale(1.05)' }
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* Back to Top Button */}
      <ScrollToTop />
    </Box>
  );
};

export default LandingPage; 