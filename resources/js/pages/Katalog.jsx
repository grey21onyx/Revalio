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
  Pagination,
  CircularProgress,
  Alert
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
  InfoOutlined as InfoOutlinedIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { gsap } from 'gsap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Definisi icon kategori sebagai fallback
const categoryIcons = {
  'Plastik': '🥤',
  'Kertas': '📄',
  'Besi': '🔧',
  'Alumunium': '🍾',
  'Elektronik': '💻',
  'default': '♻️'
};

// Definisi warna kategori sebagai fallback
const categoryColors = {
  'Plastik': '#2196F3',
  'Kertas': '#FF9800',
  'Besi': '#607D8B',
  'Alumunium': '#4CAF50',
  'Elektronik': '#9C27B0',
  'default': '#3f51b5'
};

// Data statis sebagai fallback jika API belum tersedia atau gagal
const mockCategories = [
  { id: 1, nama: 'Plastik', ikon: '/assets/images/waste/plastic-icon.png' },
  { id: 2, nama: 'Kertas', ikon: '/assets/images/waste/paper-icon.png' },
  { id: 3, nama: 'Besi', ikon: '/assets/images/waste/metal-icon.png' },
  { id: 4, nama: 'Alumunium', ikon: '/assets/images/waste/aluminum-icon.png' },
  { id: 5, nama: 'Elektronik', ikon: '/assets/images/waste/electronic-icon.png' }
];

const mockTypes = [
  { 
    id: 1, 
    nama: 'Botol Plastik PET', 
    kategori_id: 1, 
    deskripsi: 'Botol plastik minuman seperti air mineral, soda, dan jus.',
    gambar: '/assets/images/waste/plastic-bottle.jpg',
    harga_minimum: 2500,
    harga_maksimum: 5000
  },
  { 
    id: 2, 
    nama: 'Kertas HVS', 
    kategori_id: 2, 
    deskripsi: 'Kertas putih untuk dokumen dan fotokopi.',
    gambar: '/assets/images/waste/paper.jpg',
    harga_minimum: 3000,
    harga_maksimum: 4500
  },
  { 
    id: 3, 
    nama: 'Besi Bekas', 
    kategori_id: 3, 
    deskripsi: 'Potongan besi bekas dari berbagai sumber.',
    gambar: '/assets/images/waste/iron.jpg',
    harga_minimum: 5000,
    harga_maksimum: 8000
  },
  { 
    id: 4, 
    nama: 'Kaleng Aluminium', 
    kategori_id: 4, 
    deskripsi: 'Kaleng minuman aluminium seperti kaleng soda dan bir.',
    gambar: '/assets/images/waste/aluminum-can.jpg',
    harga_minimum: 10000,
    harga_maksimum: 15000
  },
  { 
    id: 5, 
    nama: 'Elektronik Bekas', 
    kategori_id: 5, 
    deskripsi: 'Perangkat elektronik bekas seperti ponsel dan laptop.',
    gambar: '/assets/images/waste/electronic.jpg',
    harga_minimum: 20000,
    harga_maksimum: 100000
  }
];

// Komponen untuk card kategori
const CategoryCard = ({ category, isSelected, onClick }) => {
  const theme = useTheme();
  const cardRef = useRef(null);
  
  const handleCardClick = () => {
    onClick(category.id);
  };
  
  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { 
      y: -5, 
      boxShadow: '0 6px 12px rgba(0,0,0,0.08)', 
      duration: 0.3 
    });
  };
  
  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { 
      y: 0, 
      boxShadow: isSelected ? '0 4px 8px rgba(0,0,0,0.1)' : 'none', 
      duration: 0.3 
    });
  };
  
  return (
    <Paper 
      ref={cardRef}
      elevation={0}
      sx={{
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        bgcolor: isSelected ? 'primary.main' : 'background.paper',
        color: isSelected ? 'primary.contrastText' : 'text.primary',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: isSelected ? 'primary.main' : 'grey.200',
        boxShadow: isSelected ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
        '&:hover': {
          borderColor: isSelected ? 'primary.dark' : 'primary.main',
        }
      }}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Avatar 
        sx={{ 
          width: 48, 
          height: 48, 
          mb: 1.5,
          bgcolor: isSelected ? 'primary.contrastText' : 'grey.100'
        }}
      >
        <img 
          src={category.ikon || "/assets/images/waste/recycle-icon.png"}
          alt={category.nama}
          style={{ 
            width: '60%', 
            height: '60%', 
            objectFit: 'contain',
            filter: isSelected ? 'brightness(0) saturate(100%) invert(37%) sepia(74%) saturate(1530%) hue-rotate(142deg) brightness(91%) contrast(101%)' : 'none'
          }}
          onError={(e) => {
            e.target.src = "/assets/images/waste/recycle-icon.png";
          }}
        />
      </Avatar>
      <Typography 
        variant="body2" 
        component="span" 
        align="center"
        sx={{ 
          fontWeight: isSelected ? 700 : 500,
          fontSize: '0.875rem',
          mt: 0.5
        }}
      >
        {category.nama}
      </Typography>
    </Paper>
  );
};

// Komponen untuk tampilan grid
const GridItemCard = ({ item, index }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  
  useEffect(() => {
    const element = cardRef.current;
    
    gsap.fromTo(
      element,
      { 
        opacity: 0, 
        y: 20 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5,
        delay: index * 0.1,
        ease: "power2.out"
      }
    );
  }, [index]);
  
  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { 
      y: -6, 
      boxShadow: '0 8px 16px rgba(0,0,0,0.08)', 
      duration: 0.3 
    });
  };
  
  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { 
      y: 0, 
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
      duration: 0.3 
    });
  };
  
  const handleClick = () => {
    navigate(`/katalog/detail-sampah/${item.id}`);
  };
  
  return (
    <Paper 
      ref={cardRef}
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s, box-shadow 0.3s',
        position: 'relative',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'grey.100',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', pt: '56.25%' /* 16:9 aspect ratio */ }}>
        <img 
          src={item.gambar || '/assets/images/waste/default-waste.jpg'} 
          alt={item.nama}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = '/assets/images/waste/default-waste.jpg';
          }}
        />
        <Chip 
          label={item.category?.nama || 'Uncategorized'} 
          size="small" 
          sx={{ 
            position: 'absolute', 
            bottom: 8, 
            left: 8,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            fontWeight: 500,
            fontSize: '0.7rem',
            height: 24,
            borderRadius: '8px'
          }} 
        />
      </Box>
      
      {/* Content */}
      <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 600 }}>
          {item.nama}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {item.deskripsi && item.deskripsi.length > 80 
            ? `${item.deskripsi.substring(0, 80)}...` 
            : item.deskripsi}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PriceIcon 
              sx={{ 
                fontSize: 16, 
                color: theme.palette.success.main,
                mr: 0.5 
              }} 
            />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.success.main
              }}
            >
              {item.harga_minimum && item.harga_maksimum 
                ? `Rp ${item.harga_minimum.toLocaleString()} - ${item.harga_maksimum.toLocaleString()}`
                : "Harga tidak tersedia"}
            </Typography>
          </Box>
          <Tooltip title="Lihat Detail">
            <IconButton size="small" color="primary">
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

// Komponen untuk tampilan list
const ListItemRow = ({ item, index }) => {
  const theme = useTheme();
  const itemRef = useRef(null);
  const navigate = useNavigate();
  
  // Tetapkan warna kategori
  const categoryName = item.category?.nama;
  const categoryColor = categoryName ? (categoryColors[categoryName] || categoryColors.default) : categoryColors.default;
  
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

  const handleItemClick = () => {
    navigate(`/katalog/detail-sampah/${item.id}`);
  };

  return (
    <Card 
      ref={itemRef}
      sx={{
        mb: 2,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
          transform: 'translateY(-6px)'
        },
        border: '1px solid',
        borderColor: 'grey.100',
        cursor: 'pointer'
      }}
      onClick={handleItemClick}
    >
      <ListItem component="div" disablePadding>
        <ListItemAvatar sx={{ minWidth: 200, display: 'flex', alignItems: 'center', p: 2 }}>
          <Box sx={{ position: 'relative', width: '100%', height: 140 }}>
            <img 
              src={item.gambar || '/assets/images/waste/default-waste.jpg'} 
              alt={item.nama}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                borderRadius: 8
              }}
              onError={(e) => {
                e.target.src = '/assets/images/waste/default-waste.jpg';
              }}
            />
            <Chip 
              label={item.category?.nama || 'Uncategorized'} 
              size="small"
              sx={{ 
                position: 'absolute', 
                top: 8, 
                left: 8,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 500,
                fontSize: '0.7rem',
                height: 24,
                borderRadius: '8px'
              }} 
            />
          </Box>
        </ListItemAvatar>
        
        <ListItemText 
          sx={{ py: 2, pr: 2 }}
          primary={
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              {item.nama}
            </Typography>
          }
          secondary={
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {item.deskripsi && item.deskripsi.length > 150 
                  ? `${item.deskripsi.substring(0, 150)}...` 
                  : item.deskripsi}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <PriceIcon 
                  sx={{ 
                    fontSize: 16, 
                    color: theme.palette.success.main,
                    mr: 0.5 
                  }} 
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 700, 
                    color: theme.palette.success.main
                  }}
                >
                  {item.harga_minimum && item.harga_maksimum 
                    ? `Rp ${item.harga_minimum.toLocaleString()} - ${item.harga_maksimum.toLocaleString()}`
                    : "Harga tidak tersedia"}
                </Typography>
              </Box>
            </Box>
          }
        />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', pr: 2 }}>
          <Button 
            variant="outlined" 
            size="small" 
            sx={{ 
              borderRadius: 2,
              minWidth: 100,
              fontSize: '0.75rem'
            }}
            onClick={handleItemClick}
          >
            Detail
          </Button>
        </Box>
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
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6; // Jumlah item per halaman
  
  // State untuk data dari API
  const [wasteCategories, setWasteCategories] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  
  // Efek untuk fetch data
  useEffect(() => {
    fetchData();
  }, []);
  
  // Fungsi untuk mengambil data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch kategori sampah
      console.log('Fetching waste categories...');
      const categoriesResponse = await axios.get('/api/v1/public/waste-categories');
      const categories = categoriesResponse.data.data || [];
      setWasteCategories(categories);
      console.log('Categories:', categories);
      
      // Fetch jenis sampah dengan parameter with_waste_values=true untuk memastikan data harga dimuat
      console.log('Fetching waste types...');
      const typesResponse = await axios.get('/api/v1/public/waste-types', {
        params: {
          with_waste_values: true // Selalu minta data harga
        }
      });
      const types = typesResponse.data.data || [];
      setWasteTypes(types);
      console.log('Types with price data:', types);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Terjadi kesalahan saat memuat data. Silakan coba lagi.');
      setLoading(false);
    }
  };
  
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
  
  // Gabungkan data jenis sampah dengan kategorinya
  const processedWasteTypes = wasteTypes.map(wasteType => {
    // Pastikan wasteType adalah objek valid
    if (!wasteType) return null;
    
    // Cari kategori yang sesuai jika belum di-load dengan API
    const category = wasteType.category || 
                   (wasteType.kategori_id && wasteCategories.find(cat => cat.id === wasteType.kategori_id)) ||
                   null;
    
    return {
      ...wasteType,
      category: category,
      kategori_id: wasteType.kategori_id || (category ? category.id : null)
    };
  }).filter(Boolean); // Hapus nilai null jika ada
  
  // Filter dan urutkan data sampah
  const filteredAndSortedItems = processedWasteTypes
    .filter(item => {
      const matchesSearch = item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (item.deskripsi && item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.kategori_id === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort based on selected option
      switch(sortBy) {
        case 'name_asc':
          return (a.nama || '').localeCompare(b.nama || '');
        case 'name_desc':
          return (b.nama || '').localeCompare(a.nama || '');
        case 'price_asc':
          return ((a.harga_minimum || 0) + (a.harga_maksimum || 0)) / 2 - ((b.harga_minimum || 0) + (b.harga_maksimum || 0)) / 2;
        case 'price_desc':
          return ((b.harga_minimum || 0) + (b.harga_maksimum || 0)) / 2 - ((a.harga_minimum || 0) + (a.harga_maksimum || 0)) / 2;
        default:
          return 0;
      }
    });
  
  // Gunakan data asli jika tersedia, jika tidak gunakan data statis
  const displayCategories = wasteCategories.length > 0 ? wasteCategories : mockCategories;
  const displayTypes = wasteTypes.length > 0 ? filteredAndSortedItems : 
    mockTypes.filter(item => {
      const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (item.deskripsi && item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.kategori_id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  
  // Hitung jumlah halaman
  const totalPages = Math.ceil(displayTypes.length / itemsPerPage);
  
  // Potong data sesuai pagination
  const paginatedItems = displayTypes.slice(
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
        
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        )}
        
        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 5 }}>
            {error}
          </Alert>
        )}
        
        {/* Debug State */}
        <Box sx={{ mb: 5, p: 2, border: '1px dashed', borderColor: 'grey.300', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Debug Info:</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">API Responses:</Typography>
              <Typography variant="body2">• Categories: {wasteCategories.length} items</Typography>
              <Typography variant="body2">• Types: {wasteTypes.length} items</Typography>
              <Typography variant="body2">• Filtered Types: {filteredAndSortedItems.length} items</Typography>
              <Typography variant="body2">• Currently Showing: {paginatedItems.length} items (page {page} of {totalPages})</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Filter Status:</Typography>
              <Typography variant="body2">• Search: "{searchQuery}"</Typography>
              <Typography variant="body2">• Category: {selectedCategory === 'all' ? 'All Categories' : 
                `ID ${selectedCategory} (${wasteCategories.find(c => c.id === selectedCategory)?.nama || 'Unknown'})`}</Typography>
              <Typography variant="body2">• Sort: {sortBy}</Typography>
              <Typography variant="body2">• View Mode: {viewMode}</Typography>
            </Grid>
          </Grid>
        </Box>
        
        {/* Konten Utama - ditampilkan hanya jika tidak loading dan tidak error */}
        {!loading && !error && (
          <>
            {/* Category Filters */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ mb: 2, fontSize: '1.2rem' }}>
                Kategori Sampah ({wasteCategories.length})
              </Typography>
              <Grid container spacing={2.5}>
                {displayCategories.length > 0 ? (
                  displayCategories.map((category) => (
                    <Grid item xs={6} sm={4} md={2} key={category.id}>
                      <CategoryCard 
                        category={category} 
                        isSelected={selectedCategory === category.id}
                        onClick={handleCategoryChange}
                      />
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body1" sx={{ p: 2 }}>Tidak ada kategori sampah yang tersedia.</Typography>
                )}
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
                  Menampilkan {Math.min((page - 1) * itemsPerPage + 1, displayTypes.length)}-
                  {Math.min(page * itemsPerPage, displayTypes.length)} dari {displayTypes.length} hasil
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
              {displayTypes.length > 0 ? (
                viewMode === 'grid' ? (
                  <Grid container spacing={3}>
                    {paginatedItems.map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <GridItemCard 
                          item={item} 
                          index={index}
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
            {displayTypes.length > 0 && totalPages > 1 && (
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
          </>
        )}
      </Container>
    </Box>
  );
};

export default Katalog;