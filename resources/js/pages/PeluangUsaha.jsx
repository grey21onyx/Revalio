import React, { useState, useEffect } from 'react';
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
  Stack,
  Pagination,
  Chip
} from '@mui/material';
import { BusinessCenter as PeluangUsahaIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Mock data for categories and business opportunities
const categories = [
  'Kerajinan',
  'Jasa Pengolahan',
  'Kompos',
  'Energi Terbarukan',
  'Lainnya'
];

const mockBusinessOpportunities = [
  {
    id: 1,
    title: 'Kerajinan Tangan dari Sampah Plastik',
    description: 'Membuat berbagai kerajinan tangan bernilai dari sampah plastik yang didaur ulang.',
    category: 'Kerajinan',
    investment: 10000000,
    potentialIncome: 'Rp 15.000.000 - Rp 25.000.000 per bulan',
    imageUrl: '/assets/images/business-opportunities/kerajinan-plastik.jpg',
  },
  {
    id: 2,
    title: 'Pengolahan Kompos Organik',
    description: 'Usaha pengolahan sampah organik menjadi kompos berkualitas tinggi.',
    category: 'Kompos',
    investment: 5000000,
    potentialIncome: 'Rp 8.000.000 - Rp 12.000.000 per bulan',
    imageUrl: '/assets/images/business-opportunities/kompos.jpg',
  },
  {
    id: 3,
    title: 'Jasa Pengumpulan Sampah Terjadwal',
    description: 'Layanan pengumpulan sampah terjadwal untuk lingkungan perumahan dan bisnis.',
    category: 'Jasa Pengolahan',
    investment: 15000000,
    potentialIncome: 'Rp 20.000.000 - Rp 30.000.000 per bulan',
    imageUrl: '/assets/images/business-opportunities/jasa-pengumpulan.jpg',
  },
  {
    id: 4,
    title: 'Produksi Energi Biogas dari Sampah Organik',
    description: 'Menghasilkan energi biogas dari limbah organik untuk kebutuhan rumah tangga dan industri kecil.',
    category: 'Energi Terbarukan',
    investment: 25000000,
    potentialIncome: 'Rp 30.000.000 - Rp 50.000.000 per bulan',
    imageUrl: '/assets/images/business-opportunities/biogas.jpg',
  },
  {
    id: 5,
    title: 'Pengolahan Sampah Elektronik',
    description: 'Mendaur ulang sampah elektronik menjadi bahan baku baru yang bernilai.',
    category: 'Lainnya',
    investment: 20000000,
    potentialIncome: 'Rp 25.000.000 - Rp 40.000.000 per bulan',
    imageUrl: '/assets/images/business-opportunities/sampah-elektronik.jpg',
  },
];

const PeluangUsaha = () => {
  const theme = useTheme();

  // State for filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [investmentRange, setInvestmentRange] = useState([0, 30000000]);
  const [filteredOpportunities, setFilteredOpportunities] = useState(mockBusinessOpportunities);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

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

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', pb: 0.5 }}>
      {/* Hero Section - Banner with title and subtitle */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('/assets/images/bg1.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 6, md: 10 },
          mb: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          position: 'relative',
          minHeight: { xs: '30vh', md: '40vh' },
        }}
      >
        <Container maxWidth="md">
          <PeluangUsahaIcon sx={{ fontSize: 64, mb: 2, color: theme.palette.error.main }} />
          <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
            Temukan Peluang Usaha dari Sampah
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.85 }}>
            Jelajahi berbagai peluang usaha yang dapat Anda mulai dengan pengelolaan sampah
          </Typography>
        </Container>
      </Box>

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
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Grid container spacing={4}>
          {paginatedOpportunities.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="h6" align="center" color="text.secondary">
                Tidak ada peluang usaha yang sesuai dengan filter.
              </Typography>
            </Grid>
          ) : (
            paginatedOpportunities.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {item.imageUrl && (
                    <CardMedia
                      component="img"
                      height="160"
                      image={item.imageUrl}
                      alt={item.title}
                    />
                  )}
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
