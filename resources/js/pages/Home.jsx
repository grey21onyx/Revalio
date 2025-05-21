import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Alert
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
  Article as ArticleIcon
} from '@mui/icons-material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import axios from 'axios';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Import komponen kustom
import WasteCardItem from '../components/ui/WasteCardItem';
import TutorialCard from '../components/ui/TutorialCard';

// Data dummy untuk tampilan
const featuredWasteItems = [
  {
    id: 1,
    name: 'Botol Plastik PET',
    description: 'Botol plastik minuman bekas yang dapat didaur ulang menjadi berbagai produk baru',
    imageUrl: '/assets/images/waste/botol-plastik.jpg',
    category: 'Plastik',
    categoryId: 1,
    priceRange: { min: 8000, max: 10000 },
    unit: 'kg',
    isRecyclable: true,
    isReusable: true,
  },
  {
    id: 2,
    name: 'Kardus Bekas',
    description: 'Kardus bekas packaging yang dapat didaur ulang atau digunakan kembali',
    imageUrl: '/assets/images/waste/kardus.jpg',
    category: 'Kertas',
    categoryId: 2,
    priceRange: { min: 2000, max: 3000 },
    unit: 'kg',
    isRecyclable: true,
    isReusable: true,
  },
  {
    id: 3,
    name: 'Kaleng Aluminium',
    description: 'Kaleng minuman aluminium yang memiliki nilai ekonomis tinggi',
    imageUrl: '/assets/images/waste/kaleng.jpeg',
    category: 'Logam',
    categoryId: 3,
    priceRange: { min: 11000, max: 14000 },
    unit: 'kg',
    isRecyclable: true,
    isReusable: false,
  }
];

const featuredTutorials = [
  {
    id: 1,
    title: 'Ecobrick dari Botol Plastik',
    description: 'Membuat ecobrick dari botol plastik bekas untuk konstruksi ramah lingkungan',
    imageUrl: '/assets/images/tutorials/ecobrick.png',
    difficulty: 'EASY',
    estimasiWaktu: 45,
    rating: 4.5,
    jenisTutorial: 'reuse',
  },
  {
    id: 2,
    title: 'Kerajinan dari Koran Bekas',
    description: 'Membuat kerajinan tangan dari koran bekas yang bernilai estetika',
    imageUrl: '/assets/images/tutorials/koran.jpg',
    difficulty: 'MODERATE',
    estimasiWaktu: 120,
    rating: 4.2,
    jenisTutorial: 'daur ulang',
  }
];

// Komponen untuk section fitur dengan animasi hover
const FeatureCard = ({ icon: Icon, title, description, path, color }) => {
  const cardRef = useRef(null);

  return (
    <Card
      ref={cardRef}
      className="feature-card"
      data-color={color}
      component={Link}
      to={path}
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

// Component for section headings
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

const Home = () => {
  const theme = useTheme();
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroImageRef = useRef(null);
  const featuresRef = useRef(null);
  const wasteItemsRef = useRef(null);
  const tutorialsRef = useRef(null);
  const ctaRef = useRef(null);
  const articlesRef = useRef(null);
  const communityRef = useRef(null);
  const statsRef = useRef(null);
  const parallaxRef = useRef(null);
  const impactSectionRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroButtonsRef = useRef(null);
  const aboutSectionRef = useRef(null);
  
  // State untuk data dinamis
  const [wasteItems, setWasteItems] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [articles, setArticles] = useState([]);
  const [communityThreads, setCommunityThreads] = useState([]);
  const [userStats, setUserStats] = useState(null);
  
  // State untuk loading dan error
  const [loading, setLoading] = useState({
    waste: false,
    tutorials: false,
    articles: false,
    community: false,
    stats: false
  });
  const [error, setError] = useState({
    waste: null,
    tutorials: null,
    articles: null,
    community: null,
    stats: null
  });
  
  // Fungsi untuk mengambil data sampah unggulan
  const fetchWasteItems = async () => {
    setLoading(prev => ({ ...prev, waste: true }));
    try {
      // Untuk saat ini, gunakan dummy data
      // Nantinya akan diganti dengan panggilan API yang sebenarnya
      // const response = await axios.get('/api/waste-items/featured');
      // setWasteItems(response.data);
      setTimeout(() => {
        setWasteItems(featuredWasteItems);
        setLoading(prev => ({ ...prev, waste: false }));
      }, 500);
    } catch (err) {
      console.error('Error fetching waste items:', err);
      setError(prev => ({ ...prev, waste: 'Gagal memuat data sampah unggulan' }));
      setLoading(prev => ({ ...prev, waste: false }));
    }
  };
  
  // Fungsi untuk mengambil data tutorial unggulan
  const fetchTutorials = async () => {
    setLoading(prev => ({ ...prev, tutorials: true }));
    try {
      // Untuk saat ini, gunakan dummy data
      // Nantinya akan diganti dengan panggilan API yang sebenarnya
      // const response = await axios.get('/api/tutorials/featured');
      // setTutorials(response.data);
      setTimeout(() => {
        setTutorials(featuredTutorials);
        setLoading(prev => ({ ...prev, tutorials: false }));
      }, 700);
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError(prev => ({ ...prev, tutorials: 'Gagal memuat data tutorial unggulan' }));
      setLoading(prev => ({ ...prev, tutorials: false }));
    }
  };
  
  // Fungsi untuk mengambil data artikel terbaru
  const fetchArticles = async () => {
    setLoading(prev => ({ ...prev, articles: true }));
    try {
      // Nantinya akan diganti dengan panggilan API yang sebenarnya
      // const response = await axios.get('/api/articles/latest');
      // setArticles(response.data);
      setTimeout(() => {
        setArticles([
          {
            id: 1,
            title: 'Mengenal Jenis Plastik yang Bernilai Ekonomis',
            excerpt: 'Tidak semua plastik memiliki nilai yang sama. Pelajari jenis plastik yang paling dicari oleh pengepul...',
            imageUrl: '/assets/images/tutorials/green.png',
            createdAt: '2023-05-15',
            author: 'Tim Revalio'
          },
          {
            id: 2,
            title: 'Cara Memulai Bank Sampah di Lingkungan Anda',
            excerpt: 'Panduan lengkap memulai bank sampah di RT/RW, mulai dari perizinan hingga operasional harian...',
            imageUrl: '/assets/images/tutorials/green.png',
            createdAt: '2023-05-10',
            author: 'Tim Revalio'
          }
        ]);
        setLoading(prev => ({ ...prev, articles: false }));
      }, 800);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(prev => ({ ...prev, articles: 'Gagal memuat data artikel terbaru' }));
      setLoading(prev => ({ ...prev, articles: false }));
    }
  };
  
  // Fungsi untuk mengambil data aktivitas komunitas terkini
  const fetchCommunityThreads = async () => {
    setLoading(prev => ({ ...prev, community: true }));
    try {
      // Nantinya akan diganti dengan panggilan API yang sebenarnya
      // const response = await axios.get('/api/forum/recent-threads');
      // setCommunityThreads(response.data);
      setTimeout(() => {
        setCommunityThreads([
          {
            id: 1,
            title: 'Dimana tempat jual kardus bekas di Jakarta Selatan?',
            excerpt: 'Saya punya banyak kardus bekas pindahan, ada yang tahu tempat jual yang harganya bagus?',
            author: 'Budi Santoso',
            replies: 8,
            lastActivity: '2023-05-18T14:35:00Z'
          },
          {
            id: 2,
            title: 'Sharing pengalaman jualan ecobrick ke pengepul',
            excerpt: 'Sudah 3 bulan saya rutin membuat ecobrick, ini pengalaman dan tips saya menjualnya...',
            author: 'Siti Aminah',
            replies: 12,
            lastActivity: '2023-05-17T09:20:00Z'
          }
        ]);
        setLoading(prev => ({ ...prev, community: false }));
      }, 600);
    } catch (err) {
      console.error('Error fetching community threads:', err);
      setError(prev => ({ ...prev, community: 'Gagal memuat data aktivitas komunitas' }));
      setLoading(prev => ({ ...prev, community: false }));
    }
  };
  
  // Fungsi untuk mengambil statistik pengguna
  const fetchUserStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      // Nantinya akan diganti dengan panggilan API yang sebenarnya
      // const response = await axios.get('/api/user/stats');
      // setUserStats(response.data);
      
      // Cek apakah user login (untuk demo, anggap user login)
      const isLoggedIn = true; // Nantinya akan menggunakan state auth
      
      if (isLoggedIn) {
        setTimeout(() => {
          setUserStats({
            totalSampah: 45.2, // dalam kg
            nilaiEkonomi: 320000, // dalam rupiah
            sampahTerakhir: '2023-05-16',
            kategoriTerbanyak: 'Plastik'
          });
          setLoading(prev => ({ ...prev, stats: false }));
        }, 900);
      } else {
        setUserStats(null);
        setLoading(prev => ({ ...prev, stats: false }));
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(prev => ({ ...prev, stats: 'Gagal memuat data statistik pengguna' }));
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };
  
  // Handle dummy toggle favorite
  const handleToggleFavorite = (id) => {
    console.log(`Toggle favorite for waste item ${id}`);
  };

  // Handle dummy toggle save
  const handleToggleSave = (id) => {
    console.log(`Toggle save for tutorial ${id}`);
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format time ago helper
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} detik yang lalu`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} hari yang lalu`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} bulan yang lalu`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} tahun yang lalu`;
  };

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
    
    // Animasi sederhana untuk hero text tanpa efek split text
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
    
    // Hero subtitle reveal animation
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
    
    // Hero buttons staggered animation
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
      statsRef, 
      featuresRef, 
      wasteItemsRef, 
      tutorialsRef, 
      articlesRef, 
      communityRef, 
      ctaRef
    ].filter(ref => ref.current); // Filter out any null refs (in case user is not logged in)
    
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
    
    // Add special animation for stats cards if they exist
    if (statsRef.current) {
      const statCards = statsRef.current.querySelectorAll('.MuiCard-root');
      gsap.fromTo(
        statCards,
        { 
          opacity: 0, 
          y: 30 
        },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.15,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.4,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          }
        }
      );
    }
    
    // Parallax effect for the Environmental Impact Section
    if (impactSectionRef.current) {
      // Background parallax
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
      
      // Content parallax (icons float up at different speeds)
      const impactIcons = impactSectionRef.current.querySelectorAll('.impact-icon');
      impactIcons.forEach((icon, i) => {
        const speed = 0.2 + (i * 0.1); // Different speed for each icon
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
    
    // Feature cards hover animation enhancement
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      const cardContent = card.querySelector('.card-content');
      const cardIcon = card.querySelector('.feature-icon');
      const cardTitle = card.querySelector('h6');
      const cardDesc = card.querySelector('.card-description');
      const cardAction = card.querySelector('.card-action');
      
      // Create hover timeline (paused by default)
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
      
      // Add event listeners
      card.addEventListener('mouseenter', () => tl.play());
      card.addEventListener('mouseleave', () => tl.reverse());
    });
    
    // Waste items cards 3D tilt effect
    const wasteCards = document.querySelectorAll('.waste-card');
    wasteCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          duration: 0.5,
          ease: "power1.out"
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)"
        });
      });
    });
    
    // Horizontal scroll for tutorials section on mobile
    const mm = gsap.matchMedia();
    
    mm.add("(max-width: 768px)", () => {
      // Mobile-specific animations
      if (tutorialsRef.current) {
        const tutorialCards = tutorialsRef.current.querySelector('.MuiGrid-container');
        if (tutorialCards) {
          // Menggunakan pendekatan scroll container yang lebih baik
          // Tidak menggunakan pin dan horizontal scroll yang bermasalah
          gsap.set(tutorialsRef.current, {
            overflowX: 'auto',
            overflowY: 'hidden'
          });
          
          // Mengatur layout grid untuk tampilan mobile
          gsap.set(tutorialCards, {
            display: 'flex',
            flexWrap: 'nowrap',
            gap: '16px',
            paddingBottom: '16px' // Untuk scrollbar
          });
          
          // Animasi subtle untuk item saat discroll
          const tutorialItems = tutorialCards.querySelectorAll('.MuiGrid-item');
          tutorialItems.forEach((item) => {
            gsap.to(item, {
              scale: 1.02,
              duration: 0.3,
              scrollTrigger: {
                trigger: item,
                start: "left center",
                end: "right center",
                containerAnimation: gsap.to(tutorialsRef.current, {
                  scrollTrigger: {
                    trigger: tutorialsRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: true
                  }
                }),
                scrub: true
              }
            });
          });
        }
      }
      return () => {
        // Cleanup function
      };
    });
    
    // Fetch data
    fetchWasteItems();
    fetchTutorials();
    fetchArticles();
    fetchCommunityThreads();
    fetchUserStats();
    
    // Clean up all ScrollTriggers when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      mm.revert();
    };
  }, []);

  // Parallax effect for About Revalio section
  const aboutSection = aboutSectionRef.current;
  if (aboutSection) {
    // Image parallax
    const aboutImage = aboutSection.querySelector('.about-image');
    if (aboutImage) {
      gsap.to(aboutImage, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: aboutSection,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
      
      // Image reveal animation
      gsap.fromTo(
        aboutImage.querySelector('img'),
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
    
    // Feature items staggered reveal
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

  // CTA section animations
  const ctaSection = ctaRef.current;
  if (ctaSection) {
    // Background parallax effect
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
    
    // CTA content reveal animation
    const ctaTitle = ctaSection.querySelector('.cta-title');
    const ctaDescription = ctaSection.querySelector('.cta-description');
    const ctaSteps = ctaSection.querySelector('.cta-steps');
    const ctaButtons = ctaSection.querySelector('.cta-buttons');
    const ctaImage = ctaSection.querySelector('.cta-image');
    
    // Create a timeline for the CTA section
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
        { 
          opacity: 0, 
          y: 30 
        }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.7, 
          ease: "power2.out" 
        }
      );
    }
    
    if (ctaDescription) {
      ctaTl.fromTo(ctaDescription, 
        { 
          opacity: 0, 
          y: 20 
        }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.7, 
          ease: "power2.out" 
        }, 
        "-=0.5" // Start slightly before previous animation ends
      );
    }
    
    if (ctaSteps) {
      const steps = ctaSteps.querySelectorAll('.cta-step');
      ctaTl.fromTo(steps, 
        { 
          opacity: 0, 
          x: -20 
        }, 
        { 
          opacity: 1, 
          x: 0, 
          stagger: 0.15, 
          duration: 0.5, 
          ease: "back.out(1.2)" 
        }, 
        "-=0.3"
      );
    }
    
    if (ctaButtons) {
      ctaTl.fromTo(ctaButtons.children, 
        { 
          opacity: 0, 
          y: 20, 
          scale: 0.9 
        }, 
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          stagger: 0.2, 
          duration: 0.6, 
          ease: "power3.out" 
        }, 
        "-=0.2"
      );
    }
    
    if (ctaImage) {
      // Floating animation for the image
      ctaTl.fromTo(ctaImage, 
        { 
          opacity: 0, 
          scale: 0.8, 
          rotation: -5 
        }, 
        { 
          opacity: 1, 
          scale: 1, 
          rotation: 0, 
          duration: 1, 
          ease: "elastic.out(1, 0.5)" 
        }, 
        "-=0.7"
      );
      
      // Continuous floating animation
      gsap.to(ctaImage, {
        y: 15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }

  return (
    <Box sx={{ backgroundColor: '#f8f9fa' }}>
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
                    mb: 3
                  }}
                >
                  Ubah Sampah Menjadi Penghasilan
                </Typography>
                <Typography 
                  ref={heroSubtitleRef}
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    mb: 4, 
                    fontWeight: 400,
                    fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.35rem' },
                    opacity: 0.95,
                    maxWidth: '700px',
                    lineHeight: 1.6
                  }}
                >
                  Platform edukasi digital untuk memberdayakan sampah menjadi sumber penghasilan yang berkelanjutan
                </Typography>
                <Stack 
                  ref={heroButtonsRef}
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 2, sm: 3 }}
                  sx={{ mt: 6 }}
                >
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large"
                    component={Link}
                    to="/katalog"
                    sx={{ 
                      borderRadius: 8,
                      px: { xs: 3, md: 5 },
                      py: 1.75,
                      fontSize: '1 rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                      }
                    }}
                  >
                    Mulai Sekarang
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
                      fontSize: '1 rem',
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

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Feature Sections */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={featuresRef}>
          <SectionHeading 
            title="Fitur Utama"
            subtitle="Revalio menyediakan berbagai fitur untuk membantu Anda memahami dan mendapatkan nilai ekonomis dari sampah yang biasanya terbuang percuma"
          />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={6}>
              <FeatureCard 
                icon={KatalogIcon}
                title="Katalog Sampah" 
                description="Pelajari berbagai jenis sampah bernilai ekonomis, cara sortir, dan estimasi harganya di pasaran." 
                path="/katalog"
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <FeatureCard 
                icon={DaurUlangIcon}
                title="Panduan Daur Ulang" 
                description="Temukan berbagai tutorial dan panduan cara mendaur ulang atau menggunakan kembali sampah." 
                path="/daur-ulang"
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <FeatureCard 
                icon={TrackingIcon}
                title="Tracking Sampah" 
                description="Catat dan monitor sampah yang Anda kelola serta lihat estimasi nilai ekonomisnya." 
                path="/tracking"
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <FeatureCard 
                icon={MonetisasiIcon}
                title="Tips Monetisasi" 
                description="Dapatkan informasi tentang cara menjual sampah dan siapa yang membelinya di lokasi Anda." 
                path="/monetisasi"
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <FeatureCard 
                icon={ForumIcon}
                title="Forum Diskusi" 
                description="Diskusikan dan berbagi pengalaman dengan komunitas pengelola sampah lainnya." 
                path="/forum"
                color={theme.palette.info.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <FeatureCard 
                icon={PeluangUsahaIcon}
                title="Peluang Usaha" 
                description="Temukan berbagai peluang usaha dari pengelolaan sampah dan kisah sukses pelaku usaha." 
                path="/peluang-usaha" 
                color={theme.palette.error.main}
              />
            </Grid>
          </Grid>
        </Box>

        {/* About Revalio Section - NEW */}
        <Box ref={aboutSectionRef} sx={{ mb: { xs: 6, md: 8 } }}>
          <SectionHeading 
            title="Tentang Revalio"
            subtitle="Revalio adalah platform edukasi digital yang bertujuan untuk memberdayakan masyarakat dalam mengelola sampah menjadi sumber penghasilan yang berkelanjutan"
          />
          
          <Grid container spacing={4} alignItems="stretch">
            {/* Image and Description Column */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                {/* Image with Overlay */}
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
                
                {/* Description Text */}
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
            
            {/* Features Column */}
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '100%' }}>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {/* Feature 1 */}
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
                        Informasi tentang berbagai jenis sampah yang memiliki nilai ekonomis, termasuk sampah rumah tangga dan industri ringan.
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  {/* Feature 2 */}
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
                        Tutorial cara mengklasifikasi, mengolah, dan mendaur ulang sampah menjadi barang bernilai.
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  {/* Feature 3 */}
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
                        Tools untuk melacak volume sampah yang dikelola dan mempelajari cara monetisasinya.
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  {/* Feature 4 */}
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
                        Komunitas & Edukasi
                      </Typography>
                      <Typography variant="body2">
                        Forum diskusi dan berbagi pengalaman dengan komunitas peduli lingkungan.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                {/* Learn More Button - left Aligned */}
                <Box sx={{ textAlign: 'left' }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    component={Link}
                    to="/tentang"
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

        {/* Environmental Impact Section - NEW */}
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
              <Box sx={{ 
                textAlign: 'center', 
                p: 2,
                height: '100%',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}>
                <Box 
                  className="impact-icon"
                  sx={{ 
                    fontSize: '3rem', 
                    mb: 2,
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    p: 2,
                    borderRadius: '50%',
                    lineHeight: 1
                  }}
                >
                  ♻️
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Pengurangan Limbah
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Mengurangi volume sampah yang masuk ke TPA, menghemat ruang dan mengurangi polusi tanah.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2,
                height: '100%',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}>
                <Box 
                  sx={{ 
                    fontSize: '3rem', 
                    mb: 2,
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    p: 2,
                    borderRadius: '50%',
                    lineHeight: 1
                  }}
                >
                  🌱
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Penghematan Energi
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Menghemat energi yang dibutuhkan untuk memproduksi barang baru dari bahan mentah.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2,
                height: '100%',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}>
                <Box 
                  sx={{ 
                    fontSize: '3rem', 
                    mb: 2,
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    p: 2,
                    borderRadius: '50%',
                    lineHeight: 1
                  }}
                >
                  💰
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Nilai Ekonomis
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Mengubah sampah menjadi sumber pendapatan dan menciptakan lapangan kerja baru.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2,
                height: '100%',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}>
                <Box 
                  sx={{ 
                    fontSize: '3rem', 
                    mb: 2,
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    p: 2,
                    borderRadius: '50%',
                    lineHeight: 1
                  }}
                >
                  🌍
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Pengurangan Emisi
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Mengurangi emisi gas rumah kaca dari dekomposisi sampah di tempat pembuangan.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Katalog Sampah Preview */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={wasteItemsRef}>
          <SectionHeading 
            title="Sampah Bernilai"
            subtitle="Ketahui jenis-jenis sampah yang memiliki nilai ekonomis tinggi di pasaran"
            actionText="Lihat Semua" 
            actionLink="/katalog"
          />
          
          {loading.waste ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error.waste ? (
            <Alert severity="error" sx={{ mb: 4 }}>{error.waste}</Alert>
          ) : (
          <Grid container spacing={3} alignItems="stretch">
              {wasteItems.map((item) => (
                <Grid item xs={6} sm={6} md={3} key={item.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box className="waste-card" sx={{ flexGrow: 1, transformStyle: 'preserve-3d', perspective: 1000 }}>
                    <WasteCardItem 
                      {...item}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Tutorial Preview */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={tutorialsRef}>
          <SectionHeading 
            title="Tutorial Terpopuler"
            subtitle="Pelajari cara mendaur ulang atau menggunakan kembali sampah menjadi barang bernilai"
            actionText="Lihat Semua" 
            actionLink="/daur-ulang"
          />
          
          {loading.tutorials ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error.tutorials ? (
            <Alert severity="error" sx={{ mb: 4 }}>{error.tutorials}</Alert>
          ) : (
            <Grid container spacing={3}>
              {tutorials.map((tutorial) => (
                <Grid item xs={6} sm={3} key={tutorial.id}>
                  <TutorialCard 
                    {...tutorial}
                    onToggleSave={handleToggleSave}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Artikel Edukasi Terbaru - NEW */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={articlesRef}>
          <SectionHeading 
            title="Artikel Edukasi Terbaru"
            subtitle="Perluas wawasan Anda tentang pengelolaan sampah dan isu lingkungan terkini"
            actionText="Lihat Semua" 
            actionLink="/artikel"
          />
          
          {loading.articles ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error.articles ? (
            <Alert severity="error" sx={{ mb: 4 }}>{error.articles}</Alert>
          ) : (
            <Grid container spacing={3}>
              {articles.map((article) => (
                <Grid item xs={6} md={6} key={article.id}>
                  <Card sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 6px 25px rgba(0,0,0,0.1)',
                    }
                  }}>
                    <CardMedia
                      component="img"
                      sx={{ 
                        width: { xs: '100%', sm: 140 },
                        height: { xs: 200, sm: 'auto' }
                      }}
                      image={article.imageUrl}
                      alt={article.title}
                    />
                    <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </Typography>
                      <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                        {article.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {article.excerpt}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Oleh: {article.author}
                        </Typography>
                        <Button 
                          component={Link}
                          to={`/artikel/${article.id}`}
                          endIcon={<ArrowForwardIcon />}
                          sx={{ 
                            fontWeight: 600,
                            '&:hover': {
                              backgroundColor: 'transparent',
                              transform: 'translateX(3px)'
                            },
                            transition: 'transform 0.2s ease'
                          }}
                        >
                          Baca Selengkapnya
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Aktivitas Komunitas Terkini - NEW */}
        <Box sx={{ mb: { xs: 6, md: 8 } }} ref={communityRef}>
          <SectionHeading 
            title="Aktivitas Komunitas Terkini"
            subtitle="Bergabunglah dengan diskusi dan berbagi pengalaman dengan komunitas pengelola sampah"
            actionText="Lihat Semua" 
            actionLink="/forum"
          />
          
          {loading.community ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error.community ? (
            <Alert severity="error" sx={{ mb: 4 }}>{error.community}</Alert>
          ) : (
            <Box sx={{ 
              borderRadius: 4, 
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              backgroundColor: 'white'
            }}>
              {communityThreads.map((thread, index) => (
                <React.Fragment key={thread.id}>
                  <Box 
                    component={Link} 
                    to={`/forum/thread/${thread.id}`}
                    sx={{ 
                      display: 'flex', 
                      p: 3,
                      textDecoration: 'none',
                      color: 'text.primary',
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.03)'
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      mr: 3,
                      minWidth: { xs: 50, md: 80 }
                    }}>
                      <Box sx={{ 
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        borderRadius: '50%',
                        width: { xs: 40, md: 50 },
                        height: { xs: 40, md: 50 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: { xs: '1rem', md: '1.2rem' },
                        mb: 1
                      }}>
                        {thread.replies}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        balasan
                      </Typography>
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {thread.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {thread.excerpt}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Oleh: <Box component="span" fontWeight={500}>{thread.author}</Box>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimeAgo(thread.lastActivity)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      ml: 2,
                      color: theme.palette.primary.main
                    }}>
                      <ChevronRightIcon />
                    </Box>
                  </Box>
                  {index < communityThreads.length - 1 && (
                    <Divider />
                  )}
                </React.Fragment>
              ))}
              
              <Box sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.02)'
              }}>
                <Button 
                  component={Link}
                  to="/forum/new"
                  variant="contained" 
                  color="primary"
                  sx={{ 
                    borderRadius: 8,
                    px: 3,
                    py: 1,
                    fontWeight: 600
                  }}
                >
                  Mulai Diskusi Baru
                </Button>
              </Box>
            </Box>
          )}
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
            transform: 'translateZ(0)', // Hardware acceleration
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
                  Mulai Kelola Sampah Anda Sekarang
                </Typography>
                <Typography 
                  className="cta-description"
                  variant="body1" 
                  sx={{ mb: 3, opacity: 0.9, fontSize: '1.1rem', maxWidth: '600px' }}
                >
                  Bergabunglah dengan komunitas Revalio untuk mendapatkan akses penuh ke seluruh fitur dan mulai memonetisasi sampah Anda. Kami akan membimbing Anda langkah demi langkah.
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 4 }} className="cta-steps">
                  <Grid item xs={12} sm={6}>
                    <Box className="cta-step" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(255,255,255,0.15)',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        1
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        Daftar akun gratis
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box className="cta-step" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(255,255,255,0.15)',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        2
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        Akses panduan dan tutorial
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box className="cta-step" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(255,255,255,0.15)',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        3
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        Mulai tracking sampah
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box className="cta-step" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(255,255,255,0.15)',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        4
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        Dapatkan nilai ekonomis
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
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
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 15px rgba(0,0,0,0.2)'
                      },
                      borderRadius: 8,
                      px: { xs: 3, md: 5 },
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
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
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-3px)',
                      },
                      borderRadius: 8,
                      px: { xs: 3, md: 5 },
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      transition: 'all 0.3s',
                      borderWidth: 2
                    }}
                  >
                    Masuk
                  </Button>
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    position: 'relative'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: '280px',
                      height: '280px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Box 
                      className="cta-image"
                      component="img"
                      src="/assets/images/kelola-sampah.png"
                      alt="Revalio App"
                      sx={{ 
                        width: '90%',
                        height: 'auto',
                        borderRadius: '10px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        transform: 'rotate(-5deg)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'rotate(0deg) scale(1.05)'
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Home;
