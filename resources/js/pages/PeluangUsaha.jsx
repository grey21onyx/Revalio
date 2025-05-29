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
  Skeleton,
  Alert
} from '@mui/material';
import { BusinessCenter as PeluangUsahaIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import BusinessOpportunityService from '../services/businessOpportunityService';

// Default fallback image path
const defaultImage = '/assets/images/tutorials/green.png';

const PeluangUsaha = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // State for data and UI states
  const [opportunities, setOpportunities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [investmentRange, setInvestmentRange] = useState([0, 30000000]);
  const [maxInvestment, setMaxInvestment] = useState(30000000);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 4;
  const cardsRef = useRef([]);

  // Fetch business opportunities data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await BusinessOpportunityService.getPublicBusinessOpportunities();
        
        if (response && response.data) {
          // Transform API data to match component's expected format
          const transformedData = response.data.map(item => ({
            id: item.id,
            title: item.judul,
            description: item.deskripsi,
            category: item.jenis_sampah_terkait,
            investment: item.investasi_minimal,
            potentialIncome: item.potensi_keuntungan,
            media: item.gambar_url || defaultImage,
          }));
          
          setOpportunities(transformedData);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(transformedData.map(item => item.category))].filter(Boolean);
          setCategories(uniqueCategories);
          
          // Find max investment value for slider
          const maxValue = Math.max(...transformedData.map(item => item.investment), 30000000);
          setMaxInvestment(maxValue);
          setInvestmentRange([0, maxValue]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching business opportunities:", err);
        setError("Gagal mengambil data peluang usaha. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle filter changes
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handleInvestmentChange = (event, newValue) => {
    setInvestmentRange(newValue);
    setPage(1);
  };

  // Function to navigate to detail page
  const handleCardClick = (id) => {
    navigate(`/peluang-usaha/${id}`);
  };

  // Filter data based on filters
  useEffect(() => {
    let filtered = opportunities;

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    filtered = filtered.filter(item => 
      item.investment >= investmentRange[0] && item.investment <= investmentRange[1]
    );

    setFilteredOpportunities(filtered);
  }, [selectedCategory, investmentRange, opportunities]);

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

  // Animate cards on mount and update
  useEffect(() => {
    if (!loading && cardsRef.current.length > 0) {
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

      {/* Display error if exists */}
      {error && (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      )}

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
              max={maxInvestment}
              step={1000000}
              marks={[
                { value: 0, label: '0' },
                { value: Math.round(maxInvestment / 3), label: formatCurrency(Math.round(maxInvestment / 3)).substring(0, 7) },
                { value: Math.round(maxInvestment * 2/3), label: formatCurrency(Math.round(maxInvestment * 2/3)).substring(0, 7) },
                { value: maxInvestment, label: formatCurrency(maxInvestment).substring(0, 7) },
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
                setInvestmentRange([0, maxInvestment]);
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
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: 'background.paper',
                      cursor: 'pointer',
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
