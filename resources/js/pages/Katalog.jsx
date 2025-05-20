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
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tooltip,
  Pagination
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  CategoryOutlined as CategoryIcon,
  LocalOffer as PriceIcon,
  ArrowForward as ArrowForwardIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

// Data dummy untuk kategori sampah
const wasteCategories = [
  { id: 1, name: 'Plastik', count: 15, color: '#2196F3', icon: '🥤' },
  { id: 2, name: 'Kertas', count: 8, color: '#FF9800', icon: '📄' },
  { id: 3, name: 'Besi', count: 12, color: '#607D8B', icon: '🔧' },
  { id: 4, name: 'Allumunium', count: 6, color: '#4CAF50', icon: '🍾' },
  { id: 5, name: 'Elektronik', count: 9, color: '#9C27B0', icon: '💻' },
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
const GridItemCard = ({ item, index, onToggleFavorite, favorites }) => {
  const cardRef = useRef(null);
  const theme = useTheme();
  const isFavorite = favorites.includes(item.id);
  
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
  
  // Handle favorite toggle with animation
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const btn = e.currentTarget;
    
    // Animate the button on click
    gsap.to(btn, {
      scale: 0.8,
      duration: 0.1,
      onComplete: () => {
        gsap.to(btn, {
          scale: 1.2,
          duration: 0.2,
          ease: "back.out(1.7)",
          onComplete: () => {
            gsap.to(btn, {
              scale: 1,
              duration: 0.2
            });
          }
        });
      }
    });
    
    onToggleFavorite(item.id);
  };

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
        <IconButton 
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            color: isFavorite ? 'error.main' : 'grey.400'
          }}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom fontWeight={700} sx={{ mb: 1 }}>
          {item.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, flexGrow: 1 }}
        >
          {item.description.length > 120 
            ? `${item.description.substring(0, 120)}...` 
            : item.description
          }
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ my: 1.5 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Harga di atas kiri */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 1 // Memberikan jarak antara harga dan button
            }}>
              <PriceIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
              <Typography variant="subtitle1" color="success.main" fontWeight={700}>
                Rp {item.priceRange.min.toLocaleString()} - {item.priceRange.max.toLocaleString()}
                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                  /{item.unit}
                </Typography>
              </Typography>
            </Box>
            
            {/* Button di bawah dengan align right */}
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'flex-end' // Mengatur button ke kanan
            }}>
              <Button
                component={Link}
                to={`/katalog/detail-sampah/${item.id}`}
                variant="outlined"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderRadius: 8,
                  px: 2,
                  py: 0.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                Detail
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Komponen untuk tampilan list
const ListItemRow = ({ item, index, onToggleFavorite, favorites }) => {
  const theme = useTheme();
  const itemRef = useRef(null);
  const isFavorite = favorites.includes(item.id);
  
  useEffect(() => {
    const element = itemRef.current;
    
    gsap.fromTo(
      element,
      { 
        opacity: 0, 
        x: -20 
      },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.5,
        delay: index * 0.08,
        ease: "power2.out"
      }
    );
  }, [index]);
  
  // Find category color
  const categoryData = wasteCategories.find(cat => cat.name === item.category);
  const categoryColor = categoryData ? categoryData.color : theme.palette.primary.main;
  
  // Handle favorite toggle with animation
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const btn = e.currentTarget;
    
    // Animate the button on click
    gsap.to(btn, {
      scale: 0.8,
      duration: 0.1,
      onComplete: () => {
        gsap.to(btn, {
          scale: 1.2,
          duration: 0.2,
          ease: "back.out(1.7)",
          onComplete: () => {
            gsap.to(btn, {
              scale: 1,
              duration: 0.2
            });
          }
        });
      }
    });
    
    onToggleFavorite(item.id);
  };

  return (
    <Card 
      ref={itemRef}
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
          transform: 'translateY(-3px)'
        },
        border: '1px solid',
        borderColor: 'grey.100'
      }}
    >
      <ListItem component="div" disablePadding>
        <ListItemAvatar sx={{ minWidth: 200, display: 'flex', alignItems: 'center', p: 2 }}>
          <Box sx={{ position: 'relative', width: '100%', height: 140 }}>
            <img 
              src={item.imageUrl} 
              alt={item.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                borderRadius: 8
              }}
            />
            <Chip 
              label={item.category} 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: 8, 
                left: 8,
                fontWeight: 600,
                backgroundColor: categoryColor,
                color: 'white',
                px: 1,
                borderRadius: '12px'
              }} 
            />
          </Box>
        </ListItemAvatar>
        
        <ListItemText 
          primary={
            <Typography variant="h6" fontWeight={700}>
              {item.name}
            </Typography>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                {item.description.length > 180 
                  ? `${item.description.substring(0, 180)}...` 
                  : item.description
                }
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <PriceIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle1" color="success.main" fontWeight={700}>
                  Rp {item.priceRange.min.toLocaleString()} - {item.priceRange.max.toLocaleString()}
                  <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    /{item.unit}
                  </Typography>
                </Typography>
              </Box>
            </Box>
          }
          sx={{ py: 2, pr: 2 }}
        />
        
        <ListItemSecondaryAction sx={{ right: 16, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: 2 }}>
          <IconButton 
            edge="end" 
            onClick={handleFavoriteClick}
            sx={{ 
              mb: 'auto',
              color: isFavorite ? 'error.main' : 'grey.400'
            }}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          
          <Button
            component={Link}
            to={`/katalog/detail-sampah/${item.id}`}
            variant="outlined"
            size="small"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: 8,
              px: 2,
              py: 0.5,
              textTransform: 'none',
              fontWeight: 600,
              borderWidth: 2,
              mt: 'auto',
              '&:hover': {
                borderWidth: 2
              }
            }}
          >
            Detail
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
    </Card>
  );
};

// Komponen utama halaman katalog
const Katalog = () => {
  const theme = useTheme();
  // State untuk tampilan dan filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6; // Jumlah item per halaman
  
  // Handle view mode change
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };
  
  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll ke atas halaman saat ganti halaman
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  // Handle toggle favorite
  const handleToggleFavorite = (itemId) => {
    setFavorites(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };
  
  // Handle pencarian
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setIsSearchActive(!!event.target.value);
    setPage(1); // Reset ke halaman pertama saat pencarian berubah
  };
  
  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchActive(false);
    setPage(1); // Reset ke halaman pertama saat pencarian dibersihkan
  };
  
  // Handle perubahan kategori
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? 'all' : categoryId);
    setPage(1); // Reset ke halaman pertama saat kategori berubah
  };
  
  // Handle pengurutan
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1); // Reset ke halaman pertama saat pengurutan berubah
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
  
  // Hitung jumlah halaman
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  
  // Potong data sesuai pagination
  const paginatedItems = filteredAndSortedItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
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
            Katalog Sampah Bernilai
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
            Temukan berbagai jenis sampah bernilai ekonomis, cara sortir, dan estimasi harganya di pasaran. 
            Katalog ini membantu Anda mengidentifikasi jenis sampah yang memiliki nilai jual.
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
        
        {/* Sort Controls dan View Toggle */}
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontWeight: 500,
                fontSize: '0.95rem',
                mr: 2
              }}
            >
              Menampilkan {Math.min((page - 1) * itemsPerPage + 1, filteredAndSortedItems.length)}-
              {Math.min(page * itemsPerPage, filteredAndSortedItems.length)} dari {filteredAndSortedItems.length} hasil
            </Typography>
            
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              size="small"
            >
              <ToggleButton value="grid" aria-label="grid view">
                <Tooltip title="Tampilan Grid">
                  <GridViewIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <Tooltip title="Tampilan List">
                  <ListViewIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          
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
        <Box sx={{ mb: 4 }}>
          {filteredAndSortedItems.length > 0 ? (
            viewMode === 'grid' ? (
              <Grid container spacing={3}>
                {paginatedItems.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <GridItemCard 
                      item={item} 
                      index={index} 
                      onToggleFavorite={handleToggleFavorite}
                      favorites={favorites}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <List sx={{ width: '100%' }}>
                {paginatedItems.map((item, index) => (
                  <ListItemRow 
                    key={item.id} 
                    item={item} 
                    index={index} 
                    onToggleFavorite={handleToggleFavorite}
                    favorites={favorites}
                  />
                ))}
              </List>
            )
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
        
        {/* Pagination */}
        {filteredAndSortedItems.length > 0 && totalPages > 1 && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              my: 4,
              py: 2,
              borderTop: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                  fontWeight: 500
                }
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Katalog;