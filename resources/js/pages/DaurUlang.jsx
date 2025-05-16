import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  TextField, 
  InputAdornment,
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
  Avatar
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  CategoryOutlined as CategoryIcon,
  LocalOffer as PriceIcon
} from '@mui/icons-material';
import SwipeableViews from 'react-swipeable-views';
import { gsap } from 'gsap';

// Data dummy untuk kategori sampah
const wasteCategories = [
  { id: 1, name: 'Plastik', count: 15, color: '#2196F3', icon: '🥤' },
  { id: 2, name: 'Kertas', count: 8, color: '#FF9800', icon: '📄' },
  { id: 3, name: 'Besi', count: 12, color: '#607D8B', icon: '🔧' },
  { id: 4, name: 'Allumunium', count: 6, color: '#4CAF50', icon: '💿' },
  { id: 5, name: 'Elektronik', count: 9, color: '#9C27B0', icon: '💻' },
  // { id: 6, name: 'Tekstil', count: 4, color: '#E91E63', icon: '👕' },
];

// Data dummy untuk sampah bernilai
const wasteItems = [
  {
    id: 1,
    name: 'Botol Plastik',
    description: 'Botol plastik minuman bekas yang dapat didaur ulang menjadi berbagai produk baru. Termasuk kategori plastik yang paling banyak dicari oleh pengepul.',
    imageUrl: '/assets/images/waste/botol-plastik.jpeg',
    category: 'Plastik',
    categoryId: 1,
    priceRange: { min: 1000, max: 4000 },
    unit: 'kg'
  },
  {
    id: 2,
    name: 'Kardus Bekas',
    description: 'Kardus bekas packaging yang dapat didaur ulang atau digunakan kembali untuk berbagai keperluan. Sangat diminati oleh industri daur ulang kertas.',
    imageUrl: '/assets/images/waste/kardus.jpg',
    category: 'Kertas',
    categoryId: 2,
    priceRange: { min: 800, max: 2000 },
    unit: 'kg'
  },
  {
    id: 3,
    name: 'Kaleng Aluminium',
    description: 'Kaleng minuman aluminium yang memiliki nilai ekonomis tinggi dan mudah didaur ulang. Logam aluminium dapat didaur ulang berkali-kali tanpa menurunkan kualitasnya.',
    imageUrl: '/assets/images/waste/kaleng.jpeg',
    category: 'Alumunium',
    categoryId: 4,
    priceRange: { min: 12000, max: 18000 },
    unit: 'kg'
  }
];

// Komponen untuk card kategori
const CategoryCard = ({ category, isSelected, onClick }) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    const element = cardRef.current;
    
    const handleMouseEnter = () => {
      if (!isSelected) {
        gsap.to(element, { 
          y: -5, 
          boxShadow: '0 8px 15px rgba(0,0,0,0.08)', 
          duration: 0.3, 
          ease: "power2.out" 
        });
      }
    };
    
    const handleMouseLeave = () => {
      if (!isSelected) {
        gsap.to(element, { 
          y: 0, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
          duration: 0.3, 
          ease: "power1.out" 
        });
      }
    };

    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isSelected]);
  
  return (
    <Card
      ref={cardRef}
      onClick={() => onClick(category.id)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2.5,
        borderRadius: 3,
        boxShadow: isSelected 
          ? `0 0 0 2px ${category.color}, 0 4px 12px rgba(0,0,0,0.1)` 
          : '0 2px 8px rgba(0,0,0,0.05)',
        bgcolor: isSelected ? `${category.color}10` : 'background.paper',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'translateY(-5px)' : 'none',
        border: '1px solid',
        borderColor: isSelected ? category.color : 'grey.200',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '3px',
          backgroundColor: category.color,
          transform: isSelected ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 0.3s ease',
          transformOrigin: 'left'
        },
      }}
    >
      <Box 
        sx={{ 
          width: 60, 
          height: 60, 
          borderRadius: '50%', 
          bgcolor: `${category.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          border: '2px solid',
          borderColor: category.color,
          fontSize: '1.8rem'
        }}
      >
        {category.icon}
      </Box>
      <Typography variant="subtitle1" fontWeight={600} textAlign="center">
        {category.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {category.count} jenis
      </Typography>
    </Card>
  );
};

// Komponen untuk tampilan grid
const GridItemCard = ({ item, index }) => {
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
      
      // Animate image zoom
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
      
      // Reset image zoom
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

  // Find category color
  const categoryData = wasteCategories.find(cat => cat.name === item.category);
  const categoryColor = categoryData ? categoryData.color : theme.palette.primary.main;

  return (
    <Card 
      ref={cardRef}
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
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 220 }}>
        <CardMedia
          className="card-image"
          component="img"
          height="100%"
          image={item.imageUrl}
          alt={item.name}
          sx={{ 
            transition: 'transform 0.5s ease',
            objectFit: 'cover',
          }}
        />
        <Chip 
          label={item.category} 
          size="small" 
          sx={{ 
            position: 'absolute', 
            top: 12, 
            left: 12,
            fontWeight: 600,
            backgroundColor: categoryColor,
            color: 'white',
            px: 1,
            borderRadius: '12px'
          }} 
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom fontWeight={700} sx={{ mb: 1 }}>
          {item.name}
        </Typography>
        
        {/* <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, flexGrow: 1 }}
        >
          {item.description.length > 120 
            ? `${item.description.substring(0, 120)}...` 
            : item.description
          }
        </Typography> */}
        
        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="success.main" fontWeight={700}>
              Rp {item.priceRange.min.toLocaleString()} - {item.priceRange.max.toLocaleString()}
              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                /{item.unit}
              </Typography>
            </Typography>

            <Button variant="outlined" size="small" onClick={() => handleDetailClick(item.id)}>
              Detail Panduan
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Komponen utama halaman DaurUlang
const DaurUlang = () => {
  const theme = useTheme();
  // State untuk tampilan dan filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  // Handle pencarian
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setIsSearchActive(!!event.target.value);
  };
  
  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchActive(false);
  };
  
  // Handle perubahan kategori
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? 'all' : categoryId);
  };
  
  // Handle pengurutan
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };
  
  // Filter dan sort data
  const filteredAndSortedItems = wasteItems
    .filter(item => {
      // Filter by search query
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by category
      const matchesCategory = selectedCategory === 'all' || item.categoryId === parseInt(selectedCategory);
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort based on selected option
      switch(sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'price_asc':
          return a.priceRange.min - b.priceRange.min;
        case 'price_desc':
          return b.priceRange.min - a.priceRange.min;
        default:
          return 0;
      }
    });
  
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
            Daur Ulang Sampah Bernilai
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
              mt: 2, 
              maxWidth: '800px',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Temukan berbagai jenis sampah yang bisa dijual kembali, cara menyortirnya, dan estimasi harga pasaran.
          </Typography>
        </Box>
        
        {/* Search Bar */}
        <Paper
          elevation={0}
          sx={{ 
            p: 2.5, 
            mb: 5, 
            display: 'flex', 
            alignItems: 'center',
            border: '1px solid',
            borderColor: isSearchActive ? theme.palette.primary.main : 'grey.200',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            boxShadow: isSearchActive ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
            transform: isSearchActive ? 'scale(1.01)' : 'scale(1)',
          }}
        >
          <SearchIcon 
            sx={{ 
              mx: 1.5, 
              color: isSearchActive ? 'primary.main' : 'action',
              fontSize: 28
            }} 
          />
          <TextField
            fullWidth
            placeholder="Cari jenis sampah..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="standard"
            InputProps={{
              disableUnderline: true,
            }}
            sx={{ 
              '& input': { 
                py: 1.2, 
                fontSize: '1.1rem' 
              } 
            }}
          />
          {isSearchActive && (
            <Fade in={isSearchActive}>
              <IconButton onClick={handleClearSearch} size="medium" sx={{ mr: 1 }}>
                <ClearIcon />
              </IconButton>
            </Fade>
          )}
        </Paper>
        
        {/* Category Filters */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ mb: 2, fontSize: '1.2rem' }}>
            Kategori Sampah
          </Typography>
          <Grid container spacing={2.5}>
            {wasteCategories.map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <CategoryCard 
                  category={category} 
                  isSelected={selectedCategory === category.id}
                  onClick={handleCategoryChange}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Sort Controls */}
        <Box 
          sx={{ 
            mb: 4, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
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
            Menampilkan {filteredAndSortedItems.length} hasil
          </Typography>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="sort-label">Urutkan</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              onChange={handleSortChange}
              label="Urutkan"
            >
              <MenuItem value="name_asc">Nama (A-Z)</MenuItem>
              <MenuItem value="name_desc">Nama (Z-A)</MenuItem>
              <MenuItem value="price_asc">Harga (Rendah-Tinggi)</MenuItem>
              <MenuItem value="price_desc">Harga (Tinggi-Rendah)</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {/* Hasil Pencarian */}
        <Box sx={{ mb: 6 }}>
          {filteredAndSortedItems.length > 0 ? (
            <Grid container spacing={3}>
              {filteredAndSortedItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <GridItemCard item={item} index={index} />
                </Grid>
              ))}
            </Grid>
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
                  Tidak ada hasil yang ditemukan
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '500px' }}>
                  Coba ubah kata kunci atau filter pencarian Anda untuk menemukan jenis sampah yang dicari
                </Typography>
                <Button 
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  sx={{ 
                    borderRadius: 8,
                    px: 4,
                    py: 1.25,
                    fontWeight: 600
                  }}
                >
                  Reset Pencarian
                </Button>
              </Box>
            </Fade>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default DaurUlang;
