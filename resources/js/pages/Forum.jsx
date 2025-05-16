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
  Stack 
} from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

const Forum = () => {
  // State for forum threads, categories, filters, and search
  const [threads, setThreads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('latest'); // 'latest' or 'popular'
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredThreads, setFilteredThreads] = useState([]);

  // Mock data fetching functions (replace with real API calls)
  useEffect(() => {
    // Fetch categories (if any)
    // Example categories
    setCategories([
      { id: '', name: 'Semua Kategori' },
      { id: 'general', name: 'Umum' },
      { id: 'tips', name: 'Tips & Trik' },
      { id: 'recycling', name: 'Daur Ulang' },
    ]);

    // Fetch threads
    setThreads([
      {
        id: 1,
        title: 'Cara efektif mengelola sampah plastik',
        author: 'Budi Santoso',
        replies: 12,
        lastPost: '2024-06-01T10:30:00Z',
        category: 'recycling',
        tags: ['plastik', 'daur ulang'],
      },
      {
        id: 2,
        title: 'Tips memulai usaha daur ulang sampah',
        author: 'Sari Dewi',
        replies: 8,
        lastPost: '2024-05-30T15:45:00Z',
        category: 'tips',
        tags: ['usaha', 'daur ulang'],
      },
      {
        id: 3,
        title: 'Diskusi umum tentang pengelolaan sampah',
        author: 'Andi Wijaya',
        replies: 20,
        lastPost: '2024-06-02T08:20:00Z',
        category: 'general',
        tags: ['diskusi', 'sampah'],
      },
    ]);
  }, []);

  // Filter and sort threads based on user input
  useEffect(() => {
    let filtered = threads;

    if (selectedCategory && selectedCategory !== '') {
      filtered = filtered.filter(thread => thread.category === selectedCategory);
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        thread =>
          thread.title.toLowerCase().includes(query) ||
          thread.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (sortOption === 'popular') {
      filtered = filtered.slice().sort((a, b) => b.replies - a.replies);
    } else {
      // latest
      filtered = filtered.slice().sort(
        (a, b) => new Date(b.lastPost).getTime() - new Date(a.lastPost).getTime()
      );
    }

    setFilteredThreads(filtered);
  }, [threads, selectedCategory, sortOption, searchQuery]);

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
    // Redirect to create thread page or open modal
    alert('Fitur buat topik baru belum tersedia.');
  };

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ForumIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h4" fontWeight={700}>
            Forum Diskusi Revalio
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
        {filteredThreads.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 6 }}>
            Tidak ada topik yang ditemukan.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredThreads.map(thread => (
              <Grid item xs={12} key={thread.id}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    '&:hover': { backgroundColor: 'grey.100' }
                  }}
                  onClick={() => alert(`Navigasi ke detail thread ID: ${thread.id}`)}
                >
                  <Typography variant="h6" color="primary" gutterBottom>
                    {thread.title}
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    <Typography>Oleh: {thread.author}</Typography>
                    <Typography>{thread.replies} balasan</Typography>
                    <Typography>Terakhir: {new Date(thread.lastPost).toLocaleString()}</Typography>
                    <Typography sx={{ textTransform: 'capitalize' }}>Kategori: {thread.category}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                    {thread.tags.map((tag, idx) => (
                      <Chip key={idx} label={`#${tag}`} size="small" color="primary" />
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Forum;
