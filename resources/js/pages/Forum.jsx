import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Container, 
  Button, 
  TextField, 
  MenuItem, 
  Chip, 
  Stack,
  CircularProgress,
  Avatar
} from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Swal from 'sweetalert2';

// Komponen error boundary sederhana
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Terjadi Kesalahan
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Maaf, terjadi kesalahan saat menampilkan data forum.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
          >
            Coba Lagi
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

const Forum = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // State for forum threads, categories, filters, and search
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories] = useState([
    { id: '', name: 'Semua Kategori' },
    { id: 'general', name: 'Umum' },
    { id: 'tips', name: 'Tips & Trik' },
    { id: 'recycling', name: 'Daur Ulang' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('latest'); // 'latest' or 'popular'
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredThreads, setFilteredThreads] = useState([]);

  // Fetch threads from API
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        // Pilih endpoint yang sesuai berdasarkan sortOption
        const endpoint = sortOption === 'popular' 
          ? '/public/forum-threads/popular'
          : '/public/forum-threads';
        
        // Siapkan parameter untuk filter category dan search
        let params = {};
        if (searchQuery) {
          params.search = searchQuery;
        }
        
        if (selectedCategory) {
          params.tags = selectedCategory;
        }
        
        console.log('Fetching forum threads from:', endpoint, 'with params:', params);
        const response = await api.get(endpoint, { params });
        console.log('Forum threads response:', response.data);
        
        // Validasi format response
        if (!response.data || !Array.isArray(response.data.data)) {
          console.error('Invalid response format:', response.data);
          setError('Format data tidak valid. Silakan coba lagi.');
          return;
        }
        
        // Format data dari API ke format yang digunakan di frontend
        const formattedThreads = response.data.data.map(thread => {
          // Log setiap thread untuk debugging
          console.log('Processing thread:', thread.id, thread.judul, 'User:', thread.user);
          
          return {
            id: thread.id,
            title: thread.judul || 'Tanpa Judul',
            author: thread.user ? (thread.user.nama || thread.user.name || 'Pengguna') : 'Pengguna',
            replies: thread.comments_count || 0,
            lastPost: thread.tanggal_posting || new Date().toISOString(),
            category: getCategoryFromTags(thread.tags),
            tags: thread.tags ? thread.tags.split(',').filter(tag => tag.trim()) : [],
            avatar: thread.user ? thread.user.foto_profil || thread.user.avatar : null,
          };
        });
        
        console.log('Formatted threads:', formattedThreads);
        setThreads(formattedThreads);
        setFilteredThreads(formattedThreads);
      } catch (err) {
        console.error('Error fetching threads:', err);
        console.error('Error details:', err.response?.status, err.response?.data);
        setError('Gagal mengambil data forum. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchThreads();
  }, [sortOption, selectedCategory, searchQuery]);

  // Helper function untuk mendapatkan kategori dari tags
  const getCategoryFromTags = (tags) => {
    if (!tags) return 'Umum';
    
    try {
      // Pastikan tags adalah string, bukan array atau null
      const tagString = typeof tags === 'string' ? tags : '';
      if (!tagString) return 'Umum';
      
      const tagList = tagString.toLowerCase().split(',');
      console.log('Tag list for category mapping:', tagList);
      
      // Cek secara case-insensitive
      if (tagList.some(tag => tag.includes('tips') || tag.includes('trik'))) {
        return 'Tips & Trik';
      } else if (tagList.some(tag => tag.includes('daur') || tag.includes('recycling'))) {
        return 'Daur Ulang';
      }
      return 'Umum';
    } catch (error) {
      console.error('Error processing tags:', error);
      return 'Umum';
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateThread = () => {
    navigate('/forum/new-topic');
  };

  // Handle klik pada thread
  const handleThreadClick = (threadId) => {
    console.log('Navigating to forum detail with ID:', threadId);
    if (!threadId) {
      console.error('Invalid thread ID:', threadId);
      Swal.fire('Error', 'ID thread tidak valid', 'error');
      return;
    }
    
    // Validasi lebih jauh untuk memastikan ID adalah angka atau string yang valid 
    if (isNaN(parseInt(threadId))) {
      console.error('Thread ID is not a valid number:', threadId);
      Swal.fire('Error', 'Format ID thread tidak valid', 'error');
      return;
    }
    
    try {
      navigate(`/detail-forum/${threadId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      Swal.fire('Error', 'Gagal membuka detail thread', 'error');
    }
  };

  return (
      <Box sx={{ backgroundColor: '#f9f9f9', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <ErrorBoundary>
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
              Forum Diskusi Revalio
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: -5,
                  left: 0,
                  width: '50%',
                  height: 4,
                  backgroundColor: (theme) => theme.palette.primary.main,
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
              Temukan dan diskusikan berbagai topik terkait pengelolaan sampah dan daur ulang.
            </Typography>
          </Box>

          {/* Filter and Search Panel */}
          <Paper sx={{ p: 3, mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              select
              label="Kategori"
              value={selectedCategory}
              onChange={handleCategoryChange}
              sx={{ minWidth: 180 }}
              size="small"
            >
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Urutkan"
              value={sortOption}
              onChange={handleSortChange}
              sx={{ minWidth: 140 }}
              size="small"
            >
              <MenuItem value="latest">Terbaru</MenuItem>
              <MenuItem value="popular">Terpopuler</MenuItem>
            </TextField>

            <TextField
              label="Cari topik..."
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              sx={{ flexGrow: 1, minWidth: 200 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateThread}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Buat Topik Baru
            </Button>
          </Paper>

          {/* Threads List */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="error">{error}</Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </Button>
            </Box>
          ) : filteredThreads.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 6 }}>
              Tidak ada topik yang ditemukan.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredThreads.map(thread => (
                <Grid item xs={12} key={thread.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      borderRadius: '12px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { 
                        backgroundColor: 'grey.100',
                        transform: 'translateY(-6px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                      },
                      border: '1px solid',
                      borderColor: 'grey.200',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}
                    onClick={() => handleThreadClick(thread.id)}
                  >
                    <Typography variant="h6" color="primary" gutterBottom>
                      {thread.title}
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      <Typography>Oleh: {thread.author || 'Pengguna'}</Typography>
                      <Typography>{thread.replies} balasan</Typography>
                      <Typography>Terakhir: {formatDateTime(thread.lastPost)}</Typography>
                      <Typography sx={{ textTransform: 'capitalize' }}>Kategori: {thread.category}</Typography>
                    </Stack>
                    {thread.tags && thread.tags.length > 0 && (
                      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                        {thread.tags.map((tag, idx) => (
                          <Chip key={idx} label={`#${tag}`} size="small" color="primary" sx={{ borderRadius: '8px' }} />
                        ))}
                      </Stack>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </ErrorBoundary>
      </Container>
    </Box>
  );
};

// Fungsi formatDateTime untuk digunakan di page Forum
const formatDateTime = (isoString) => {
  try {
    if (!isoString) return '-';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', isoString);
      return '-';
    }
    return date.toLocaleString();
  } catch (error) {
    console.error('Error formatting date:', error, isoString);
    return '-';
  }
};

export default Forum;
