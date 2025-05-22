
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Slider, 
  Button, 
  Pagination,
  Chip,
  Fade,
  Skeleton
} from '@mui/material';
import { BusinessCenter as PeluangUsahaIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

// Mock data for categories and business opportunities
const categories = [
  'Kerajinan',
  'Jasa Pengolahan',
  'Kompos',
  'Energi Terbarukan',
  'Lainnya'
];

// Default fallback image path
const defaultImage = '/assets/images/tutorials/green.png';

const mockBusinessOpportunities = [
  {
    id: 1,
    title: 'Kerajinan Tangan dari Sampah Plastik',
    description: 'Membuat berbagai kerajinan tangan bernilai dari sampah plastik yang didaur ulang.',
    category: 'Kerajinan',
    investment: 10000000,
    potentialIncome: 'Rp 15.000.000 - Rp 25.000.000 per bulan',
    media: defaultImage,
  },
  {
    id: 2,
    title: 'Pengolahan Kompos Organik',
    description: 'Usaha pengolahan sampah organik menjadi kompos berkualitas tinggi.',
    category: 'Kompos',
    investment: 5000000,
    potentialIncome: 'Rp 8.000.000 - Rp 12.000.000 per bulan',
    media: defaultImage,
  },
  {
    id: 3,
    title: 'Jasa Pengumpulan Sampah Terjadwal',
    description: 'Layanan pengumpulan sampah terjadwal untuk lingkungan perumahan dan bisnis.',
    category: 'Jasa Pengolahan',
    investment: 15000000,
    potentialIncome: 'Rp 20.000.000 - Rp 30.000.000 per bulan',
    media: defaultImage,
  },
  {
    id: 4,
    title: 'Produksi Energi Biogas dari Sampah Organik',
    description: 'Menghasilkan energi biogas dari limbah organik untuk kebutuhan rumah tangga dan industri kecil.',
    category: 'Energi Terbarukan',
    investment: 25000000,
    potentialIncome: 'Rp 30.000.000 - Rp 50.000.000 per bulan',
    media: defaultImage,
  },
  {
    id: 5,
    title: 'Pengolahan Sampah Elektronik',
    description: 'Mendaur ulang sampah elektronik menjadi bahan baku baru yang bernilai.',
    category: 'Lainnya',
    investment: 20000000,
    potentialIncome: 'Rp 25.000.000 - Rp 40.000.000 per bulan',
    media: defaultImage,
  },
];

const PeluangUsaha = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // State for filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [investmentRange, setInvestmentRange] = useState([0, 30000000]);
  const [filteredOpportunities, setFilteredOpportunities] = useState(mockBusinessOpportunities);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 4;
  const cardsRef = useRef([]);

  // Handle filter changes
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handleInvestmentChange = (event, newValue) => {
    setInvestmentRange(newValue);
    setPage(1);
  };

  // Filter data based on filters
  useEffect(() => {
    let filtered = mockBusinessOpportunities;

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    filtered = filtered.filter(item => 
      item.investment >= investmentRange[0] && item.investment <= investmentRange[1]
    );

    setFilteredOpportunities(filtered);
  }, [selectedCategory, investmentRange]);

  // Pagination
  const pageCount = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const paginatedOpportunities = filteredOpportunities.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Format currency
  const formatCurrency = (value) => {
    return 'Rp ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Navigate to detail page
  const handleCardClick = (id) => {
    navigate(`/peluang-usaha/${id}`);
  };

  // Animate cards on mount and update
  useEffect(() => {
    if (!loading) {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1, ease: "power2.out" }
          );
        }
      });
    }
  }, [loading, paginatedOpportunities]);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
      <Box sx={{ backgroundColor: '#f9f9f9', py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight={800} 
              gutterBottom 
              sx={{ 
                position: 'relative', 
                display: 'inline-block',
                mb: 3
              }}
            >
              Temukan Peluang Usaha dari Sampah
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: -5,
                  left: 0,
                  width: '50%',
                  height: 4,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 2
                }}
              />
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mt: 2, 
                maxWidth: '800px',
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}
            >
              Jelajahi berbagai peluang usaha yang dapat Anda mulai dengan pengelolaan sampah
            </Typography>
          </Box>
        </Container>

      {/* Filters */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Kategori</InputLabel>
              <Select
                labelId="category-label"
                value={selectedCategory}
                label="Kategori"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">Semua Kategori</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom>
              Rentang Investasi: {formatCurrency(investmentRange[0])} - {formatCurrency(investmentRange[1])}
            </Typography>
            <Slider
              value={investmentRange}
              onChange={handleInvestmentChange}
              valueLabelDisplay="auto"
              min={0}
              max={30000000}
              step={1000000}
              marks={[
                { value: 0, label: '0' },
                { value: 10000000, label: '10jt' },
                { value: 20000000, label: '20jt' },
                { value: 30000000, label: '30jt' },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              onClick={() => {
                setSelectedCategory('');
                setInvestmentRange([0, 30000000]);
                setPage(1);
              }}
            >
              Reset Filter
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Business Opportunities Grid */}
      <Container maxWidth="lg" sx={{ mb: 6, px: 0, maxWidth: '1200px' }}>
        {loading ? (
          <Grid container spacing={2} sx={{ mx: 0, maxWidth: '1200px' }}>
            {[...Array(itemsPerPage)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ px: 1 }}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2} sx={{ mx: 0, maxWidth: '1200px' }}>
            {paginatedOpportunities.length === 0 ? (
              <Grid item xs={12} sx={{ px: 1 }}>
                <Typography variant="h6" align="center" color="text.secondary">
                  Tidak ada peluang usaha yang sesuai dengan filter.
                </Typography>
              </Grid>
            ) : (
              paginatedOpportunities.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={item.id} ref={el => cardsRef.current[index] = el} sx={{ px: 1 }}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      cursor: 'pointer', 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)'
                      }
                    }}
                    onClick={() => handleCardClick(item.id)}
                    onMouseEnter={() => {
                      const card = cardsRef.current[index];
                      if (card) {
                        gsap.to(card, { y: -6, boxShadow: 'none', duration: 0.3, ease: "power2.out" });
                        const img = card.querySelector('img');
                        if (img) {
                          gsap.to(img, { scale: 1.05, duration: 0.5, ease: "power1.out" });
                        }
                      }
                    }}
                    onMouseLeave={() => {
                      const card = cardsRef.current[index];
                      if (card) {
                        gsap.to(card, { y: 0, boxShadow: 'none', duration: 0.3, ease: "power1.out" });
                        const img = card.querySelector('img');
                        if (img) {
                          gsap.to(img, { scale: 1, duration: 0.3, ease: "power1.out" });
                        }
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={item.media}
                      alt={item.title}
                      sx={{ transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {item.title}
                      </Typography>
                      <Chip 
                        label={item.category} 
                        color="primary" 
                        size="small" 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.description}
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Estimasi Investasi: {formatCurrency(item.investment)}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Potensi Pendapatan: {item.potentialIncome}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Container>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Pagination 
            count={pageCount} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default PeluangUsaha;
