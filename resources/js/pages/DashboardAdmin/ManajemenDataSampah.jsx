import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ConstructionOutlined, Category } from '@mui/icons-material';

const ManajemenDataSampah = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data or perform initialization here
    const initPage = async () => {
      try {
        // Simulating API call
        setTimeout(() => {
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error initializing page:', err);
        setError('Terjadi kesalahan saat memuat data');
        setLoading(false);
      }
    };

    initPage();
  }, []);

  // Check if user is authenticated as admin
  if (!isAuthenticated || !user?.is_admin) {
    return (
      <Box 
        sx={{ 
          position: 'relative', 
          height: '100vh', 
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 5, 
            maxWidth: 600, 
            width: '90%',
            textAlign: 'center',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <ConstructionOutlined sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Halaman Sedang Dibangun
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Modul Manajemen Data Sampah akan segera hadir! Fitur ini akan memungkinkan admin untuk mengelola kategori dan jenis sampah secara efisien, termasuk menambah, mengedit, dan menghapus entri data sampah.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/admin/dashboard')}
          >
            Kembali ke Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight={800} 
            gutterBottom
            sx={{ 
              position: 'relative',
              display: 'inline-block',
              mb: 2,
              fontSize: { xs: '1.75rem', md: '2.125rem' }
            }}
          >
            Manajemen Data Sampah
            <Box 
              sx={{ 
                position: 'absolute',
                bottom: -5,
                left: 0,
                width: '50%',
                height: 4,
                backgroundColor: 'primary.main',
                borderRadius: 2
              }}
            />
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mt: 1, 
              maxWidth: '800px',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              lineHeight: 1.6
            }}
          >
            Kelola kategori dan jenis sampah di platform Revalio
          </Typography>
        </Box>

        {/* Main Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  minHeight: '300px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Category sx={{ fontSize: 60, color: 'primary.main', opacity: 0.7, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Halaman Manajemen Data Sampah dalam pengembangan
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Segera hadir dengan fitur pengelolaan kategori dan jenis sampah yang komprehensif
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ManajemenDataSampah;
