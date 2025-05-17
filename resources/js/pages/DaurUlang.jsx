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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MobileStepper,
  Breadcrumbs,
  Link,
  Checkbox,
  FormControlLabel,
  Pagination,
  Rating,
  Skeleton,
  TextField
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  Close as CloseIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  AddCircleOutline,
  CheckCircle,
  CircleOutlined
} from '@mui/icons-material';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

// Mock data for tutorials (should be replaced with actual API calls)
const tutorials = [
  {
    tutorial_id: 1,
    judul: 'Membuat Pot dari Botol Plastik',
    deskripsi: 'Panduan lengkap membuat pot tanaman dari botol plastik bekas dengan berbagai desain kreatif.',
    jenis_tutorial: 'daur_ulang',
    waste_id: 1, // relates to plastic
    media: '/assets/images/tutorials/pot-botol.jpg',
    tingkat_kesulitan: 'EASY',
    estimasi_waktu: 30,
    rating: 4.5,
    tried: false
  },
  {
    tutorial_id: 2,
    judul: 'Dompet dari Kemasan Kopi',
    deskripsi: 'Mengubah kemasan kopi sachet menjadi dompet yang stylish dan tahan lama.',
    jenis_tutorial: 'reuse',
    waste_id: 1, // relates to plastic
    media: '/assets/images/tutorials/dompet-kopi.jpg',
    tingkat_kesulitan: 'MEDIUM',
    estimasi_waktu: 60,
    rating: 4.2,
    tried: true
  },
  {
    tutorial_id: 3,
    judul: 'Lampu Hias dari Kaleng Bekas',
    deskripsi: 'Membuat lampu hias dengan pola unik dari kaleng minuman bekas.',
    jenis_tutorial: 'daur_ulang',
    waste_id: 4, // relates to aluminium
    media: '/assets/images/tutorials/lampu-kaleng.jpg',
    tingkat_kesulitan: 'HARD',
    estimasi_waktu: 90,
    rating: 4.8,
    tried: false
  },
  {
    tutorial_id: 4,
    judul: 'Rak Buku dari Kardus',
    deskripsi: 'Membuat rak buku sederhana namun kuat dari kardus bekas.',
    jenis_tutorial: 'reuse',
    waste_id: 2, // relates to paper
    media: '/assets/images/tutorials/rak-kardus.jpg',
    tingkat_kesulitan: 'EASY',
    estimasi_waktu: 45,
    rating: 3.9,
    tried: false
  },
  {
    tutorial_id: 5,
    judul: 'Mainan Robot dari Komponen Elektronik',
    deskripsi: 'Memanfaatkan komponen elektronik bekas untuk membuat mainan robot sederhana.',
    jenis_tutorial: 'daur_ulang',
    waste_id: 5, // relates to electronic
    media: '/assets/images/tutorials/robot-elektronik.jpg',
    tingkat_kesulitan: 'VERY_HARD',
    estimasi_waktu: 120,
    rating: 4.7,
    tried: false
  },
  {
    tutorial_id: 6,
    judul: 'Tas dari Kaos Bekas',
    deskripsi: 'Mengubah kaos bekas menjadi tas yang berguna tanpa perlu menjahit.',
    jenis_tutorial: 'reuse',
    waste_id: null,
    media: '/assets/images/tutorials/tas-kaos.jpg',
    tingkat_kesulitan: 'MEDIUM',
    estimasi_waktu: 50,
    rating: 4.1,
    tried: true
  },
];

// Mock data for waste types (should be replaced with actual API calls)
const wasteTypes = [
  { waste_id: 1, nama: 'Plastik', kategori_id: 1 },
  { waste_id: 2, nama: 'Kertas', kategori_id: 2 },
  { waste_id: 3, nama: 'Besi', kategori_id: 3 },
  { waste_id: 4, nama: 'Aluminium', kategori_id: 4 },
  { waste_id: 5, nama: 'Elektronik', kategori_id: 5 },
];

// Difficulty level mapping
const difficultyLevels = {
  VERY_EASY: 'Sangat Mudah',
  EASY: 'Mudah',
  MEDIUM: 'Sedang',
  HARD: 'Sulit',
  VERY_HARD: 'Sangat Sulit'
};

// Time estimate mapping
const timeEstimates = [
  { label: '< 30 menit', value: '0-30' },
  { label: '30-60 menit', value: '30-60' },
  { label: '> 60 menit', value: '60-999' }
];

// Tutorial type mapping
const tutorialTypes = {
  daur_ulang: 'Daur Ulang',
  reuse: 'Reuse'
};

// Komponen untuk card tutorial
const TutorialCard = ({ tutorial, index, onClick }) => {
  const cardRef = useRef(null);
  const theme = useTheme();
  
  useEffect(() => {
    const element = cardRef.current;
    
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
        y: -8, 
        boxShadow: '0 12px 20px rgba(0,0,0,0.1)', 
        duration: 0.3, 
        ease: "power2.out" 
      });
      
      const imageElement = element.querySelector('.card-image');
      gsap.to(imageElement, {
        scale: 1.05,
        duration: 0.5,
        ease: "power1.out"
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(element, { 
        y: 0, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
        duration: 0.3, 
        ease: "power1.out" 
      });
      
      const imageElement = element.querySelector('.card-image');
      gsap.to(imageElement, {
        scale: 1,
        duration: 0.3,
        ease: "power1.out"
      });
    };

    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [index]);

  const wasteType = tutorial.waste_id 
    ? wasteTypes.find(w => w.waste_id === tutorial.waste_id) 
    : null;

  return (
    <Card 
      ref={cardRef}
      onClick={() => onClick(tutorial)}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: 'grey.100',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {/* Tried indicator */}
      {tutorial.tried && (
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
          image={tutorial.media}
          alt={tutorial.judul}
          sx={{ 
            transition: 'transform 0.5s ease',
            objectFit: 'cover',
          }}
        />
        {wasteType && (
          <Chip 
            label={wasteType.nama} 
            size="small" 
            sx={{ 
              position: 'absolute', 
              top: 12, 
              left: 12,
              fontWeight: 600,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              px: 1,
              borderRadius: '12px'
            }} 
          />
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom fontWeight={700} sx={{ mb: 1 }}>
          {tutorial.judul}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {tutorial.deskripsi.length > 80 
            ? `${tutorial.deskripsi.substring(0, 80)}...` 
            : tutorial.deskripsi}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ my: 1.5 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating 
              value={tutorial.rating} 
              precision={0.5} 
              readOnly 
              size="small" 
              sx={{ mr: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {tutorial.rating.toFixed(1)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Chip 
              label={difficultyLevels[tutorial.tingkat_kesulitan]} 
              size="small" 
              variant="outlined"
              sx={{ 
                borderRadius: 1,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [showUntriedOnly, setShowUntriedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setCurrentPage(1);
  };
  
  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
    setCurrentPage(1);
  };
  
  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
    setCurrentPage(1);
  };
  
  const handleTriedFilterChange = (event) => {
    setShowUntriedOnly(event.target.checked);
    setCurrentPage(1);
  };
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleTutorialClick = (tutorial) => {
    navigate(`/daur-ulang/${tutorial.tutorial_id}`);
  };
  
  const handleCreateNew = () => {
    navigate('/daur-ulang/baru');
  };
  
  const filteredTutorials = tutorials
    .filter(tutorial => {
      // Search filter
      const matchesSearch = tutorial.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tutorial.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type filter
      const matchesType = selectedType === 'all' || tutorial.jenis_tutorial === selectedType;
      
      // Difficulty filter
      const matchesDifficulty = selectedDifficulty === 'all' || 
                               tutorial.tingkat_kesulitan === selectedDifficulty;
      
      // Time filter
      const matchesTime = selectedTime === 'all' || 
        (selectedTime === '0-30' && tutorial.estimasi_waktu < 30) ||
        (selectedTime === '30-60' && tutorial.estimasi_waktu >= 30 && tutorial.estimasi_waktu <= 60) ||
        (selectedTime === '60-999' && tutorial.estimasi_waktu > 60);
      
      // Tried filter
      const matchesTried = !showUntriedOnly || !tutorial.tried;
      
      return matchesSearch && matchesType && matchesDifficulty && matchesTime && matchesTried;
    });
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredTutorials.length / itemsPerPage);
  const paginatedTutorials = filteredTutorials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return (
    <Box sx={{ backgroundColor: '#f9f9f9', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: { xs: 4, md: 5 } }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
            <Link color="inherit" href="/">
              Beranda
            </Link>
            <Typography color="text.primary">Panduan Daur Ulang & Reuse</Typography>
          </Breadcrumbs>
          
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
                  maxWidth: '800px',
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}
              >
                Temukan berbagai panduan kreatif untuk mendaur ulang dan memanfaatkan kembali sampah menjadi barang berguna.
              </Typography>
            </Box>
            
            {/* Add new tutorial button (visible for certain roles) */}
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
              Unggah Panduan Baru
            </Button>
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
            borderRadius: 3,
          }}
        >
          <Grid container spacing={3}>
            {/* Search */}
            <Grid item xs={12} md={6}>
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
                  <MenuItem value="daur_ulang">Daur Ulang</MenuItem>
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
                  <MenuItem value="MEDIUM">Sedang</MenuItem>
                  <MenuItem value="HARD">Sulit</MenuItem>
                  <MenuItem value="VERY_HARD">Sangat Sulit</MenuItem>
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
            
            {/* Tried Filter */}
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
            Menampilkan {filteredTutorials.length} panduan
          </Typography>
        </Box>
        
        {/* Tutorials Grid */}
        <Box sx={{ mb: 6 }}>
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 3 }} />
                </Grid>
              ))}
            </Grid>
          ) : filteredTutorials.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {paginatedTutorials.map((tutorial, index) => (
                  <Grid item xs={12} sm={6} md={4} key={tutorial.tutorial_id}>
                    <TutorialCard 
                      tutorial={tutorial} 
                      index={index} 
                      onClick={handleTutorialClick}
                    />
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
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
      </Container>
    </Box>
  );
};

export default DaurUlang;