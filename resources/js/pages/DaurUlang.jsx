import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Fade,
  useTheme,
  Paper,
  IconButton,
  Checkbox,
  FormControlLabel,
  Pagination,
  Rating,
  Skeleton,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  AddCircleOutline,
  CheckCircle,
  CircleOutlined
} from '@mui/icons-material';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

// Difficulty level mapping
const difficultyLevels = {
  VERY_EASY: 'Sangat Mudah',
  EASY: 'Mudah',
  MODERATE: 'Sedang',
  DIFFICULT: 'Sulit',
  VERY_DIFFICULT: 'Sangat Sulit'
};

// Time estimate mapping
const timeEstimates = [
  { label: '< 30 menit', value: '0-30' },
  { label: '30-60 menit', value: '30-60' },
  { label: '> 60 menit', value: '60-999' }
];

// Tutorial type mapping
const tutorialTypes = {
  'daur ulang': 'Daur Ulang',
  'reuse': 'Reuse'
};

// Komponen untuk card tutorial
const TutorialCard = ({ tutorial, index, onClick }) => {
  const cardRef = useRef(null);
  const theme = useTheme();
  
  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;
    
    gsap.fromTo(
      element,
      { 
        opacity: 0, 
        y: 30 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5,
        delay: index * 0.1,
        ease: "power2.out"
      }
    );
    
    const handleMouseEnter = () => {
      gsap.to(element, { 
        y: -6, 
        boxShadow: '0 8px 16px rgba(0,0,0,0.08)', 
        duration: 0.3, 
        ease: "power2.out" 
      });
      
      const imageElement = element.querySelector('.card-image');
      if (imageElement) {
        gsap.to(imageElement, {
          scale: 1.05,
          duration: 0.5,
          ease: "power1.out"
        });
      }
    };
    
    const handleMouseLeave = () => {
      gsap.to(element, { 
        y: 0, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
        duration: 0.3, 
        ease: "power1.out" 
      });
      
      const imageElement = element.querySelector('.card-image');
      if (imageElement) {
        gsap.to(imageElement, {
          scale: 1,
          duration: 0.3,
          ease: "power1.out"
        });
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [index]);

  return (
    <Card 
      ref={cardRef}
      onClick={() => onClick(tutorial)}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: 'grey.100',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {/* Tried indicator */}
      {tutorial.is_completed && (
        <Box sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1,
          backgroundColor: theme.palette.success.main,
          color: 'white',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <CheckCircle fontSize="small" />
        </Box>
      )}
      
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
        <CardMedia
          className="card-image"
          component="img"
          height="100%"
          image={tutorial.media || '/assets/images/tutorials/default.jpg'}
          alt={tutorial.judul}
          sx={{ 
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            objectFit: 'cover',
          }}
        />
        {tutorial.waste_type && (
          <Chip 
            label={tutorial.waste_type.nama} 
            size="small" 
            sx={{ 
              position: 'absolute', 
              top: 12, 
              left: 12,
              fontWeight: 600,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              px: 1,
              borderRadius: '8px'
            }} 
          />
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom fontWeight={700} sx={{ mb: 1 }}>
          {tutorial.judul}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {tutorial.deskripsi?.length > 80 
            ? `${tutorial.deskripsi.substring(0, 80)}...` 
            : tutorial.deskripsi}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ my: 1.5 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating 
              value={tutorial.average_rating || 0} 
              precision={0.5} 
              readOnly 
              size="small" 
              sx={{ mr: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {tutorial.average_rating ? tutorial.average_rating.toFixed(1) : 'Belum ada rating'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Chip 
              label={difficultyLevels[tutorial.tingkat_kesulitan] || tutorial.tingkat_kesulitan} 
              size="small" 
              variant="outlined"
              sx={{ 
                borderRadius: 8,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main
              }}
            />
            
            <Typography variant="caption" color="text.secondary">
              {tutorial.estimasi_waktu} menit
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Komponen utama halaman Panduan Daur Ulang
const DaurUlang = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { auth } = useAuth();
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [showUntriedOnly, setShowUntriedOnly] = useState(false);
  
  // State for data
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch tutorials from API
  const fetchTutorials = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        per_page: pagination.per_page,
        search: searchQuery,
        jenis_tutorial: selectedType !== 'all' ? selectedType : undefined,
        tingkat_kesulitan: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        max_time: selectedTime !== 'all' ? 
          (selectedTime === '0-30' ? 30 : 
           selectedTime === '30-60' ? 60 : 
           999) : undefined,
        tried: showUntriedOnly ? 'false' : undefined
      };
      
      // Remove undefined params
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      
      const response = await axios.get('/api/v1/tutorials', {
        params,
        headers: {
          Authorization: `Bearer ${auth?.accessToken}`
        }
      });
      
      setTutorials(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        total: response.data.total,
        last_page: response.data.last_page
      });
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      const errorMessage = err.response?.data?.message || 'Gagal memuat data tutorial. Silakan coba lagi.';
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTutorials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search and filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTutorials(1); // Reset to first page when filters change
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedType, selectedDifficulty, selectedTime, showUntriedOnly, auth?.accessToken]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };
  
  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };
  
  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };
  
  const handleTriedFilterChange = (event) => {
    setShowUntriedOnly(event.target.checked);
  };
  
  const handlePageChange = (event, value) => {
    fetchTutorials(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleTutorialClick = (tutorial) => {
    if (tutorial && tutorial.id) {
      navigate(`/daur-ulang/${tutorial.id}`);
    } else {
      console.error('Tutorial ID tidak ditemukan:', tutorial);
      setSnackbar({
        open: true,
        message: 'Tidak dapat membuka detail panduan. ID tidak valid.',
        severity: 'error'
      });
    }
  };
  
  const handleCreateNew = () => {
    navigate('/daur-ulang/baru');
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: { xs: 4, md: 5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight={800} 
                gutterBottom 
                sx={{ 
                  position: 'relative', 
                  display: 'inline-block',
                  mb: 2
                }}
              >
                Panduan Daur Ulang & Reuse Kreatif
                <Box 
                  sx={{ 
                    position: 'absolute',
                    bottom: -5,
                    left: 0,
                    width: '100%',
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
                  maxWidth: '500px',
                  fontSize: '1.rem',
                  lineHeight: 1.6
                }}
              >
                Temukan berbagai panduan kreatif untuk mendaur ulang dan memanfaatkan kembali sampah menjadi barang berguna.
              </Typography>
            </Box>
            
            {/* Add new tutorial button (visible for certain roles) */}
            {auth?.roles?.includes('admin') && (
              <Button 
                variant="contained" 
                startIcon={<AddCircleOutline />}
                onClick={handleCreateNew}
                sx={{
                  borderRadius: 8,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  display: { xs: 'none', md: 'flex' }
                }}
              >
                Panduan Baru
              </Button>
            )}
          </Box>
        </Box>
        
        {/* Filter Panel */}
        <Paper
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 5,
            border: '1px solid',
            borderColor: 'grey.200',
            borderRadius: '12px',
          }}
        >
          <Grid container spacing={3}>
            {/* Search */}
            <Grid item xs={12} md={12}>
              <Paper
                sx={{ 
                  p: '2px 4px', 
                  display: 'flex', 
                  alignItems: 'center',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}
              >
                <IconButton sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <TextField
                  fullWidth
                  placeholder="Cari panduan..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{ 
                    '& input': { 
                      py: 1.2, 
                      fontSize: '1rem' 
                    } 
                  }}
                />
                {searchQuery && (
                  <Fade in={!!searchQuery}>
                    <IconButton onClick={handleClearSearch} size="small" sx={{ mr: 1 }}>
                      <ClearIcon />
                    </IconButton>
                  </Fade>
                )}
              </Paper>
            </Grid>
            
            {/* Tutorial Type */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="type-label">Jenis Panduan</InputLabel>
                <Select
                  labelId="type-label"
                  value={selectedType}
                  onChange={handleTypeChange}
                  label="Jenis Panduan"
                >
                  <MenuItem value="all">Semua Jenis</MenuItem>
                  <MenuItem value="daur ulang">Daur Ulang</MenuItem>
                  <MenuItem value="reuse">Reuse</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Difficulty */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="difficulty-label">Tingkat Kesulitan</InputLabel>
                <Select
                  labelId="difficulty-label"
                  value={selectedDifficulty}
                  onChange={handleDifficultyChange}
                  label="Tingkat Kesulitan"
                >
                  <MenuItem value="all">Semua Tingkat</MenuItem>
                  <MenuItem value="VERY_EASY">Sangat Mudah</MenuItem>
                  <MenuItem value="EASY">Mudah</MenuItem>
                  <MenuItem value="MODERATE">Sedang</MenuItem>
                  <MenuItem value="DIFFICULT">Sulit</MenuItem>
                  <MenuItem value="VERY_DIFFICULT">Sangat Sulit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Time Estimate */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="time-label">Estimasi Waktu</InputLabel>
                <Select
                  labelId="time-label"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  label="Estimasi Waktu"
                >
                  <MenuItem value="all">Semua Durasi</MenuItem>
                  {timeEstimates.map((time) => (
                    <MenuItem key={time.value} value={time.value}>{time.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Tried Filter - Only show if user is logged in */}
            {auth?.accessToken && (
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={showUntriedOnly}
                      onChange={handleTriedFilterChange}
                      icon={<CircleOutlined />}
                      checkedIcon={<CheckCircle />}
                    />
                  }
                  label="Hanya yang belum dicoba"
                  sx={{ ml: 1 }}
                />
              </Grid>
            )}
          </Grid>
        </Paper>
        
        {/* Results Count */}
        <Box 
          sx={{ 
            mb: 4, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          >
            Menampilkan {pagination.total} panduan
          </Typography>
        </Box>
        
        {/* Tutorials Grid */}
        <Box sx={{ mb: 6 }}>
          {loading && pagination.current_page === 1 ? (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 3 }} />
                </Grid>
              ))}
            </Grid>
          ) : error ? (
            <Fade in={true} timeout={600}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  p: 8,
                  textAlign: 'center',
                  height: '350px',
                  backgroundColor: 'grey.50',
                  borderRadius: 4,
                  border: '1px dashed',
                  borderColor: 'grey.300'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Terjadi Kesalahan
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '500px' }}>
                  {error}
                </Typography>
                <Button 
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => fetchTutorials()}
                  sx={{ 
                    borderRadius: 8,
                    px: 4,
                    py: 1.25,
                    fontWeight: 600
                  }}
                >
                  Coba Lagi
                </Button>
              </Box>
            </Fade>
          ) : tutorials.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {tutorials && tutorials.map((tutorial, index) => (
                  <Grid item xs={12} sm={6} md={4} key={tutorial.id || index}>
                    <TutorialCard 
                      tutorial={tutorial} 
                      index={index} 
                      onClick={handleTutorialClick}
                    />
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              {pagination.last_page > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={pagination.last_page}
                    page={pagination.current_page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        fontWeight: 600
                      }
                    }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Fade in={true} timeout={600}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  p: 8,
                  textAlign: 'center',
                  height: '350px',
                  backgroundColor: 'grey.50',
                  borderRadius: 4,
                  border: '1px dashed',
                  borderColor: 'grey.300'
                }}
              >
                <SearchIcon sx={{ fontSize: 72, color: 'grey.400', mb: 3 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Tidak ada panduan yang ditemukan
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '500px' }}>
                  Coba ubah filter pencarian Anda untuk menemukan panduan yang sesuai
                </Typography>
                <Button 
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedDifficulty('all');
                    setSelectedTime('all');
                    setShowUntriedOnly(false);
                  }}
                  sx={{ 
                    borderRadius: 8,
                    px: 4,
                    py: 1.25,
                    fontWeight: 600
                  }}
                >
                  Reset Filter
                </Button>
              </Box>
            </Fade>
          )}
        </Box>
        
        {/* Floating action button for mobile */}
        {auth?.roles?.includes('admin') && (
          <Box sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24, 
            zIndex: 1000,
            display: { xs: 'block', md: 'none' }
          }}>
            <Button 
              variant="contained" 
              startIcon={<AddCircleOutline />}
              onClick={handleCreateNew}
              sx={{
                borderRadius: 8,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
            >
              Baru
            </Button>
          </Box>
        )}
      </Container>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DaurUlang;