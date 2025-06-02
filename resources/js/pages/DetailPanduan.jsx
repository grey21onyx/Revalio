import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Breadcrumbs, 
  Link, 
  Chip, 
  Divider, 
  Rating, 
  Avatar, 
  Paper,
  Button,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MobileStepper,
  useTheme,
  Grid,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ArrowBack,
  Share,
  Bookmark,
  BookmarkBorder,
  CheckCircle,
  CircleOutlined,
  Download,
  Expand,
  NavigateBefore,
  NavigateNext,
  Comment as CommentIcon,
  Favorite,
  FavoriteBorder,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import TutorialService from '../services/tutorialService';
import { useAuth } from '../contexts/AuthContext';

// Tingkat kesulitan
const difficultyLevels = {
  VERY_EASY: 'Sangat Mudah',
  EASY: 'Mudah',
  MEDIUM: 'Sedang',
  MODERATE: 'Sedang',
  DIFFICULT: 'Sulit',
  VERY_DIFFICULT: 'Sangat Sulit',
  HARD: 'Sulit',
  VERY_HARD: 'Sangat Sulit'
};

const DetailPanduan = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [tutorial, setTutorial] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Load tutorial data berdasarkan ID
  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Validasi ID
        if (!id) {
          console.error('ID parameter tidak valid:', id);
          setError('ID tutorial tidak valid, mohon kembali ke halaman panduan');
          setIsLoading(false);
          return;
        }
        
        try {
          // Fetch data dari API
          console.log('Fetching tutorial data from API with ID:', id);
          const response = await TutorialService.getTutorialById(id);
          console.log('Tutorial data received from API:', JSON.stringify(response, null, 2));
          
          // Mengambil data tutorial dari properti 'data' di dalam respons
          const tutorialData = response.data;
          setTutorial(tutorialData);
          
          // Set user interaksi jika sudah login
          if (isAuthenticated && tutorialData) {
            setIsBookmarked(tutorialData.is_saved || false);
            setIsCompleted(tutorialData.is_completed || false);
            if (tutorialData.user_rating) {
              setUserRating(parseFloat(tutorialData.user_rating) || 0);
            }
          }
        } catch (err) {
          console.error('Error fetching tutorial:', err);
          
          // Pesan error yang lebih spesifik berdasarkan jenis error
          if (err.message === 'Tutorial ID tidak valid atau undefined') {
            setError('ID tutorial tidak valid, mohon kembali ke halaman panduan');
          } else if (err.response && err.response.status === 404) {
            setError('Tutorial tidak ditemukan, mohon kembali ke halaman panduan');
            // Redirect setelah 3 detik ke halaman daftar tutorial
            setTimeout(() => navigate('/daur-ulang', { replace: true }), 3000);
          } else if (err.response && err.response.status === 401) {
            setError('Anda perlu login untuk melihat tutorial ini');
            // Tidak perlu redirect ke login jika tutorial bisa dilihat tanpa login
          } else {
            setError('Terjadi kesalahan saat memuat panduan. Silakan coba lagi nanti.');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutorial();
  }, [id, navigate, isAuthenticated, user]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleNextStep = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setActiveStep(prev => prev - 1);
  };
  
  const handleImageClick = () => {
    setImageModalOpen(true);
  };
  
  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Anda harus login untuk memberikan ulasan',
        severity: 'warning'
      });
      return;
    }
    
    if (!comment.trim()) {
      setSnackbar({
        open: true,
        message: 'Komentar tidak boleh kosong',
        severity: 'warning'
      });
      return;
    }
    
    try {
      // Kirim komentar dan rating (jika ada) ke API
      const ratingToSend = userRating > 0 ? Math.round(userRating) : null;
      await TutorialService.addComment(id, comment, ratingToSend);
      
      // Refresh data tutorial untuk menampilkan komentar baru
      const response = await TutorialService.getTutorialById(id);
      setTutorial(response.data);
      
      // Reset form
      setComment('');
      setUserRating(0);
      
      // Tampilkan notifikasi sukses
      setSnackbar({
        open: true,
        message: 'Ulasan berhasil dikirim',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error submitting comment:', err);
      
      // Tampilkan pesan error yang sesuai
      let errorMessage = 'Terjadi kesalahan saat mengirim ulasan';
      
      // Jika error karena tidak terautentikasi
      if (err.response && err.response.status === 401) {
        errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
      } else if (err.message) {
        // Gunakan pesan error dari service jika ada
        errorMessage = err.message;
      } else if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };
  
  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Anda harus login untuk menyimpan tutorial',
        severity: 'warning'
      });
      return;
    }
    
    try {
      // Toggle status disimpan melalui API
      const response = await TutorialService.toggleSaved(id);
      setIsBookmarked(response.is_saved);
      
      // Tampilkan notifikasi sukses
      setSnackbar({
        open: true,
        message: response.message || (isBookmarked ? 'Tutorial dihapus dari daftar simpan' : 'Tutorial disimpan'),
        severity: 'success'
      });
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      
      // Tampilkan pesan error yang sesuai
      let errorMessage = 'Terjadi kesalahan saat menyimpan tutorial';
      
      // Jika error karena tidak terautentikasi
      if (err.response && err.response.status === 401) {
        errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
      } else if (err.message) {
        // Gunakan pesan error dari service jika ada
        errorMessage = err.message;
      } else if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };
  
  const handleCompleteToggle = async () => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Anda harus login untuk menandai tutorial sebagai selesai',
        severity: 'warning'
      });
      return;
    }
    
    try {
      // Toggle status selesai melalui API
      const response = await TutorialService.toggleCompleted(id);
      setIsCompleted(response.is_completed);
      
      // Tampilkan notifikasi sukses
      setSnackbar({
        open: true,
        message: response.message || (isCompleted ? 'Tutorial dihapus dari daftar selesai' : 'Tutorial ditandai sebagai selesai'),
        severity: 'success'
      });
    } catch (err) {
      console.error('Error toggling completed status:', err);
      
      // Tampilkan pesan error yang sesuai
      let errorMessage = 'Terjadi kesalahan saat menandai tutorial sebagai selesai';
      
      // Jika error karena tidak terautentikasi
      if (err.response && err.response.status === 401) {
        errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
      } else if (err.message) {
        // Gunakan pesan error dari service jika ada
        errorMessage = err.message;
      } else if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };
  
  const handleRatingChange = async (event, newValue) => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Anda harus login untuk memberikan rating',
        severity: 'warning'
      });
      return;
    }
    
    // Jika user mencoba untuk menghapus rating (setValue ke 0), hindari
    if (newValue === 0) {
      setSnackbar({
        open: true,
        message: 'Nilai rating harus antara 1 dan 5',
        severity: 'warning'
      });
      return;
    }
    
    try {
      const roundedRating = Math.round(newValue);
      setUserRating(newValue);
      
      // Jika user hanya ingin memberi rating tanpa komentar
      if (!comment.trim()) {
        // Kirim rating yang sudah dibulatkan ke API
        await TutorialService.rateTutorial(id, roundedRating);
        
        // Refresh tutorial data
        const response = await TutorialService.getTutorialById(id);
        setTutorial(response.data);
        
        // Tampilkan notifikasi sukses
        setSnackbar({
          open: true,
          message: 'Rating berhasil disimpan',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      
      // Tampilkan pesan error yang sesuai
      let errorMessage = 'Terjadi kesalahan saat menyimpan rating';
      
      // Jika error karena tidak terautentikasi
      if (err.response && err.response.status === 401) {
        errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
      } else if (err.message) {
        // Gunakan pesan error dari service jika ada
        errorMessage = err.message;
      } else if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };
  
  const handleShare = () => {
    // Implementasi berbagi tutorial
    navigator.clipboard.writeText(window.location.href).then(() => {
      setSnackbar({
        open: true,
        message: 'Tautan berhasil disalin ke clipboard',
        severity: 'success'
      });
    });
  };
  
  const handleDownloadPDF = () => {
    // Implementasi download PDF
    setSnackbar({
      open: true,
      message: 'Fitur download PDF belum tersedia',
      severity: 'info'
    });
  };
  
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column' }}>
          <CircularProgress color="primary" sx={{ mb: 2 }} />
          <Typography variant="h6">Memuat panduan...</Typography>
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column' }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button variant="contained" onClick={() => navigate(-1)}>Kembali</Button>
        </Box>
      </Container>
    );
  }
  
  if (!tutorial) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Typography variant="h6">Tutorial tidak ditemukan</Typography>
        </Box>
      </Container>
    );
  }
  
  // Tampilkan data kontributor jika tersedia
  const kontributor = tutorial.kontributor || null;

  // Tampilkan data jenis sampah jika tersedia
  const jenisSampah = tutorial.jenis_sampah || tutorial.waste_type || null;

  // Parsing konten tutorial dari format JSON jika diperlukan
  const tutorialContent = (() => {
    try {
      if (typeof tutorial.konten === 'string') {
        return JSON.parse(tutorial.konten);
      }
      return tutorial.konten || {};
    } catch (error) {
      console.error('Error parsing tutorial content:', error);
      return {}; // Default empty object if parsing fails
    }
  })();
  
  const steps = tutorialContent && tutorialContent.langkah_langkah ? tutorialContent.langkah_langkah : [];
  const maxSteps = steps.length;
  const bahanDanAlat = tutorialContent && tutorialContent.bahan_dan_alat ? tutorialContent.bahan_dan_alat : [];
  const tips = tutorialContent && tutorialContent.tips ? tutorialContent.tips : null;

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg" sx={{ py: 0 }}>
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Kembali
      </Button>
      
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>
          {tutorial.judul}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {tutorial.deskripsi}
        </Typography>
        
        {/* Meta Information */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {kontributor && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src={kontributor.avatar || '/assets/images/avatars/default.png'} 
                alt={kontributor.nama || 'Kontributor'}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Typography variant="body2">{kontributor.nama || 'Kontributor'}</Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating 
              value={parseFloat(tutorial.average_rating) || 0}
              precision={0.5} 
              readOnly 
              size="small" 
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              ({tutorial.rating_count || 0})
            </Typography>
          </Box>
          
          <Chip 
            label={difficultyLevels[tutorial.tingkat_kesulitan] || tutorial.tingkat_kesulitan} 
            size="small" 
            variant="outlined"
            sx={{ 
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main
            }}
          />
          
          <Typography variant="body2" color="text.secondary">
            {tutorial.estimasi_waktu} menit
          </Typography>
          
          {jenisSampah && (
            <Chip 
              label={jenisSampah.nama || 'Sampah'} 
              size="small" 
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: 'white'
              }}
            />
          )}
        </Box>
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={isCompleted ? <CheckCircle /> : <CircleOutlined />}
            onClick={handleCompleteToggle}
            sx={{ borderRadius: 8 }}
            disabled={!isAuthenticated}
          >
            {isCompleted ? 'Sudah Dicoba' : 'Tandai Selesai'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={isBookmarked ? <Bookmark /> : <BookmarkBorder />}
            onClick={handleBookmarkToggle}
            sx={{ borderRadius: 8 }}
            disabled={!isAuthenticated}
          >
            {isBookmarked ? 'Disimpan' : 'Simpan'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Share />}
            onClick={handleShare}
            sx={{ borderRadius: 8 }}
          >
            Bagikan
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleDownloadPDF}
            sx={{ borderRadius: 8 }}
          >
            Unduh PDF
          </Button>
        </Box>
      </Box>
      
      {/* Main Image */}
      <Box 
        sx={{ 
          position: 'relative', 
          borderRadius: 3, 
          overflow: 'hidden', 
          mb: 5,
          height: { xs: 300, md: 500 },
          cursor: 'pointer'
        }}
        onClick={handleImageClick}
      >
        <Box
          component="img"
          src={tutorial.gambar || '/assets/images/tutorials/default.jpg'}
          alt={tutorial.judul}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.03)'
            }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Expand sx={{ color: 'white' }} />
        </Box>
      </Box>
      
      {/* Materials Needed Section */}
      {bahanDanAlat && bahanDanAlat.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
            Yang Anda Butuhkan
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {bahanDanAlat.map((item, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Box
                    component="img"
                    src={item.gambar || '/assets/images/materials/default.jpg'}
                    alt={item.nama}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: '50%',
                      mb: 1.5,
                      border: '2px solid',
                      borderColor: 'grey.200'
                    }}
                  />
                  <Typography variant="body2">{item.nama}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* Steps Section */}
      {steps && steps.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
            Langkah-langkah
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          {/* Current Step */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              position: 'relative', 
              borderRadius: 3, 
              overflow: 'hidden', 
              mb: 3,
              height: { xs: 250, sm: 400 },
              backgroundColor: 'grey.100'
            }}>
              <Box
                component="img"
                src={steps[activeStep].media || '/assets/images/steps/default.jpg'}
                alt={`Langkah ${steps[activeStep].langkah || activeStep + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                flexShrink: 0
              }}>
                {steps[activeStep].langkah || activeStep + 1}
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {steps[activeStep].judul || `Langkah ${activeStep + 1}`}
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              {steps[activeStep].deskripsi}
            </Typography>
            
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNextStep}
                  disabled={activeStep === maxSteps - 1}
                  endIcon={<NavigateNext />}
                >
                  Berikutnya
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBackStep}
                  disabled={activeStep === 0}
                  startIcon={<NavigateBefore />}
                >
                  Sebelumnya
                </Button>
              }
              sx={{
                justifyContent: 'center',
                py: 2,
                px: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                borderRadius: 3
              }}
            />
          </Box>
        </Box>
      )}
      
      {/* Tips Section */}
      {tips && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
            Tips dan Saran Tambahan
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Paper elevation={0} sx={{ 
            p: 3, 
            backgroundColor: 'primary.light', 
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <Typography variant="body1">{tips}</Typography>
          </Paper>
        </Box>
      )}
      
      {/* Comments and Ratings Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
          Komentar dan Ulasan
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {/* Comment Form */}
        <Paper elevation={0} sx={{ 
          p: 3, 
          mb: 4, 
          border: '1px solid', 
          borderColor: 'grey.200', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Beri Ulasan
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>Rating:</Typography>
            <Rating
              value={userRating}
              onChange={handleRatingChange}
              precision={0.5}
            />
          </Box>
          
          <form onSubmit={handleCommentSubmit}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Bagikan pengalaman Anda mencoba panduan ini..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              disabled={!comment.trim()}
              sx={{ borderRadius: 8 }}
            >
              Kirim Ulasan
            </Button>
          </form>
        </Paper>
        
        {/* Comments List */}
        {tutorial.comments && tutorial.comments.length > 0 ? (
          <List>
            {tutorial.comments.map((item) => (
              <ListItem 
                key={item.id} 
                alignItems="flex-start"
                sx={{ 
                  p: 0, 
                  mb: 3,
                  '&:last-child': { mb: 0 }
                }}
              >
                <ListItemAvatar>
                  <Avatar src={item.user?.foto_profil || '/assets/images/avatars/default.jpg'} alt={item.user?.nama_lengkap || 'User'} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mr: 1 }}>
                        {item.user?.nama_lengkap || 'Pengguna'}
                      </Typography>
                      {item.rating > 0 && (
                        <Rating 
                          value={parseFloat(item.rating) || 0}
                          size="small" 
                          readOnly 
                          sx={{ mr: 1 }}
                        />
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.created_at).toLocaleDateString('id-ID', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.primary">
                      {item.content}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Belum ada komentar. Jadilah yang pertama memberikan ulasan!
          </Typography>
        )}
      </Box>
      
      {/* Image Modal */}
      <Dialog
        open={imageModalOpen}
        onClose={handleCloseImageModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          px: 3
        }}>
          <Typography variant="h6" component="div" fontWeight={600}>
            {tutorial.judul}
          </Typography>
          <IconButton onClick={handleCloseImageModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box
            component="img"
            src={tutorial.gambar || '/assets/images/tutorials/default.jpg'}
            alt={tutorial.judul}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              objectFit: 'contain'
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Snackbar notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    </Box>
  );
};

export default DetailPanduan;