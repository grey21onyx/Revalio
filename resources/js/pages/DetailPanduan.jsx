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
  Grid
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

// Database tutorial
const allTutorials = [
  {
    tutorial_id: 1,
    judul: 'Membuat Pot dari Botol Plastik',
    deskripsi: 'Panduan lengkap membuat pot tanaman dari botol plastik bekas dengan berbagai desain kreatif.',
    jenis_tutorial: 'daur_ulang',
    waste_id: 1,
    media: '/assets/images/tutorials/green.png',
    tingkat_kesulitan: 'EASY',
    estimasi_waktu: 30,
    rating: 4.5,
    rating_count: 24,
    kontributor: {
      nama: 'admin Revalio',
      avatar: '/assets/images/avatars/admin.png'
    },
    konten: {
      bahan_dan_alat: [
        {
          nama: 'Botol plastik bekas',
          gambar: '/assets/images/materials/green.png'
        },
        {
          nama: 'Gunting/cutter',
          gambar: '/assets/images/materials/green.png'
        },
        {
          nama: 'Cat akrilik',
          gambar: '/assets/images/materials/green.png'
        },
        {
          nama: 'Kuas',
          gambar: '/assets/images/materials/green.png'
        }
      ],
      langkah_langkah: [
        {
          langkah: 1,
          judul: 'Persiapan botol',
          deskripsi: 'Bersihkan botol plastik dari label dan sisa minuman. Potong bagian atas botol sesuai dengan desain yang diinginkan.',
          media: '/assets/images/steps/green.png',
          media_type: 'image'
        },
        {
          langkah: 2,
          judul: 'Lubangi bagian bawah',
          deskripsi: 'Buat beberapa lubang kecil di bagian bawah botol untuk drainase air. Gunakan paku yang dipanaskan atau bor kecil.',
          media: '/assets/images/steps/green.png',
          media_type: 'image'
        },
        {
          langkah: 3,
          judul: 'Hias botol',
          deskripsi: 'Gunakan cat akrilik untuk menghias botol sesuai selera. Biarkan kering sebelum digunakan.',
          media: '/assets/images/steps/green.png',
          media_type: 'image'
        }
      ],
      tips: 'Anda bisa menggunakan botol dengan berbagai ukuran untuk membuat set pot tanaman yang serasi. Untuk hasil lebih rapi, gunakan masking tape saat mengecat.'
    },
    komentar: [
      {
        id: 1,
        user: {
          nama: 'Budi Santoso',
          avatar: '/assets/images/avatars/green.png'
        },
        teks: 'Sangat membantu! Sudah saya coba dan hasilnya bagus.',
        rating: 5,
        tanggal: '2023-05-15'
      },
      {
        id: 2,
        user: {
          nama: 'Ani Wijaya',
          avatar: '/assets/images/avatars/green.png'
        },
        teks: 'Bagus panduannya, tapi menurut saya bagian melubangi botol agak susah kalau tidak punya alat yang tepat.',
        rating: 4,
        tanggal: '2023-05-10'
      }
    ]
  },
  {
    tutorial_id: 2,
    judul: 'Membuat Tas dari Baju Bekas',
    deskripsi: 'Ubah baju bekas menjadi tas unik dan stylish dengan panduan ini.',
    jenis_tutorial: 'daur_ulang',
    waste_id: 2,
    media: '/assets/images/tutorials/green.png',
    tingkat_kesulitan: 'MEDIUM',
    estimasi_waktu: 60,
    rating: 4.2,
    rating_count: 15,
    kontributor: {
      nama: 'admin Revalio',
      avatar: '/assets/images/avatars/admin.png'
    },
    konten: {
      bahan_dan_alat: [
        {
          nama: 'Baju bekas',
          gambar: '/assets/images/materials/green.png'
        },
        {
          nama: 'Gunting',
          gambar: '/assets/images/materials/green.png'
        },
        {
          nama: 'Benang dan jarum',
          gambar: '/assets/images/materials/green.png'
        }
      ],
      langkah_langkah: [
        {
          langkah: 1,
          judul: 'Persiapan bahan',
          deskripsi: 'Pilih baju bekas yang akan digunakan dan potong sesuai pola.',
          media: '/assets/images/steps/green.png',
          media_type: 'image'
        },
        {
          langkah: 2,
          judul: 'Jahit bagian dasar',
          deskripsi: 'Jahit bagian bawah baju untuk membentuk dasar tas.',
          media: '/assets/images/steps/green.png',
          media_type: 'image'
        }
      ],
      tips: 'Gunakan baju dengan bahan yang kuat untuk hasil yang lebih tahan lama.'
    },
    komentar: [
      {
        id: 1,
        user: {
          nama: 'Citra Dewi',
          avatar: '/assets/images/avatars/green.png'
        },
        teks: 'Hasilnya keren! Anak-anak suka dengan tasnya.',
        rating: 5,
        tanggal: '2023-06-10'
      }
    ]
  }
];

// Data jenis sampah
const wasteTypes = [
  { waste_id: 1, nama: 'Plastik', kategori_id: 1 },
  { waste_id: 2, nama: 'Tekstil', kategori_id: 2 }
];

// Tingkat kesulitan
const difficultyLevels = {
  VERY_EASY: 'Sangat Mudah',
  EASY: 'Mudah',
  MEDIUM: 'Sedang',
  HARD: 'Sulit',
  VERY_HARD: 'Sangat Sulit'
};

const DetailPanduan = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // Load tutorial data berdasarkan ID
  useEffect(() => {
    const foundTutorial = allTutorials.find(t => t.tutorial_id === parseInt(id));
    
    if (foundTutorial) {
      // Simulasi loading
      setTimeout(() => {
        setTutorial(foundTutorial);
      }, 500);
    } else {
      // Jika tutorial tidak ditemukan, redirect ke halaman daur ulang
      navigate('/daur-ulang', { replace: true });
    }
  }, [id, navigate]);
  
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
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    console.log('Comment submitted:', comment);
    console.log('Rating submitted:', userRating);
    setComment('');
    setUserRating(0);
  };
  
  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };
  
  const handleCompleteToggle = () => {
    setIsCompleted(!isCompleted);
  };
  
  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };
  
  const handleShare = () => {
    console.log('Sharing tutorial:', tutorial?.judul);
  };
  
  const handleDownloadPDF = () => {
    console.log('Downloading PDF for tutorial:', tutorial?.judul);
  };
  
  if (!tutorial) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Typography variant="h6">Memuat panduan...</Typography>
        </Box>
      </Container>
    );
  }
  
  const wasteType = wasteTypes.find(w => w.waste_id === tutorial.waste_id);
  const steps = tutorial.konten.langkah_langkah;
  const maxSteps = steps.length;

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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={tutorial.kontributor.avatar} 
              alt={tutorial.kontributor.nama}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Typography variant="body2">{tutorial.kontributor.nama}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating 
              value={tutorial.rating} 
              precision={0.5} 
              readOnly 
              size="small" 
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              ({tutorial.rating_count})
            </Typography>
          </Box>
          
          <Chip 
            label={difficultyLevels[tutorial.tingkat_kesulitan]} 
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
          
          {wasteType && (
            <Chip 
              label={wasteType.nama} 
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
          >
            {isCompleted ? 'Sudah Dicoba' : 'Tandai Selesai'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={isBookmarked ? <Bookmark /> : <BookmarkBorder />}
            onClick={handleBookmarkToggle}
            sx={{ borderRadius: 8 }}
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
          src={tutorial.media}
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
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
          Yang Anda Butuhkan
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {tutorial.konten.bahan_dan_alat.map((item, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <Box
                  component="img"
                  src={item.gambar}
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
      
      {/* Steps Section */}
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
              src={steps[activeStep].media}
              alt={`Langkah ${steps[activeStep].langkah}`}
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
              {steps[activeStep].langkah}
            </Box>
            <Typography variant="h6" fontWeight={600}>
              {steps[activeStep].judul}
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
      
      {/* Tips Section */}
      {tutorial.konten.tips && (
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
            <Typography variant="body1">{tutorial.konten.tips}</Typography>
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
              onChange={(event, newValue) => {
                setUserRating(newValue);
              }}
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
              disabled={!comment}
              sx={{ borderRadius: 8 }}
            >
              Kirim Ulasan
            </Button>
          </form>
        </Paper>
        
        {/* Comments List */}
        {tutorial.komentar.length > 0 ? (
          <List>
            {tutorial.komentar.map((item) => (
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
                  <Avatar src={item.user.avatar} alt={item.user.nama} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mr: 1 }}>
                        {item.user.nama}
                      </Typography>
                      <Rating 
                        value={item.rating} 
                        size="small" 
                        readOnly 
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {item.tanggal}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.primary">
                      {item.teks}
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
          <Typography variant="h6" fontWeight={600}>
            {tutorial.judul}
          </Typography>
          <IconButton onClick={handleCloseImageModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box
            component="img"
            src={tutorial.media}
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
    </Container>
    </Box>
  );
};

export default DetailPanduan;