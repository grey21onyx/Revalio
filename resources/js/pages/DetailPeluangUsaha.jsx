import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Chip, 
  Divider, 
  Avatar, 
  Paper,
  IconButton,
  Grid,
  useTheme
} from '@mui/material';
import {
  ArrowBack,
  Share,
  Bookmark,
  BookmarkBorder,
  CheckCircle,
  CircleOutlined,
  Expand,
  Close as CloseIcon,
  Download
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const defaultImage = '/assets/images/tutorials/green.png';

const mockBusinessOpportunities = [
  {
    id: 1,
    title: 'Kerajinan Tangan dari Sampah Plastik',
    description: 'Membuat berbagai kerajinan tangan bernilai dari sampah plastik yang didaur ulang.',
    category: 'Kerajinan',
    investment: 10000000,
    potentialIncome: 'Rp 15.000.000 - Rp 25.000.000 per bulan',
    challenges: 'Mendapatkan bahan baku plastik yang konsisten dan berkualitas, serta pemasaran produk yang efektif.',
    implementationSuggestions: 'Mulailah dengan skala kecil dan fokus pada produk unik. Gunakan media sosial untuk promosi dan bangun jaringan dengan komunitas daur ulang.',
    media: defaultImage,
  },
  {
    id: 2,
    title: 'Pengolahan Kompos Organik',
    description: 'Usaha pengolahan sampah organik menjadi kompos berkualitas tinggi.',
    category: 'Kompos',
    investment: 5000000,
    potentialIncome: 'Rp 8.000.000 - Rp 12.000.000 per bulan',
    challenges: 'Pengelolaan limbah organik yang tepat dan menjaga kualitas kompos agar sesuai standar pasar.',
    implementationSuggestions: 'Pelajari teknik pengomposan yang efisien dan jalin kerjasama dengan petani atau toko tanaman sebagai pasar.',
    media: defaultImage,
  },
  {
    id: 3,
    title: 'Jasa Pengumpulan Sampah Terjadwal',
    description: 'Layanan pengumpulan sampah terjadwal untuk lingkungan perumahan dan bisnis.',
    category: 'Jasa Pengolahan',
    investment: 15000000,
    potentialIncome: 'Rp 20.000.000 - Rp 30.000.000 per bulan',
    challenges: 'Mengatur jadwal pengumpulan yang efisien dan membangun kepercayaan pelanggan.',
    implementationSuggestions: 'Gunakan aplikasi atau sistem manajemen untuk jadwal dan komunikasi pelanggan. Fokus pada pelayanan yang ramah dan tepat waktu.',
    media: defaultImage,
  },
  {
    id: 4,
    title: 'Produksi Energi Biogas dari Sampah Organik',
    description: 'Menghasilkan energi biogas dari limbah organik untuk kebutuhan rumah tangga dan industri kecil.',
    category: 'Energi Terbarukan',
    investment: 25000000,
    potentialIncome: 'Rp 30.000.000 - Rp 50.000.000 per bulan',
    challenges: 'Investasi awal yang cukup besar dan pemeliharaan alat biogas yang tepat.',
    implementationSuggestions: 'Pelajari teknologi biogas dan cari mitra teknis. Edukasi masyarakat tentang manfaat energi terbarukan.',
    media: defaultImage,
  },
  {
    id: 5,
    title: 'Pengolahan Sampah Elektronik',
    description: 'Mendaur ulang sampah elektronik menjadi bahan baku baru yang bernilai.',
    category: 'Lainnya',
    investment: 20000000,
    potentialIncome: 'Rp 25.000.000 - Rp 40.000.000 per bulan',
    challenges: 'Pengelolaan limbah berbahaya dan perizinan usaha.',
    implementationSuggestions: 'Pastikan mematuhi regulasi lingkungan dan gunakan teknologi pengolahan yang aman.',
    media: defaultImage,
  },
];

const DetailPeluangUsaha = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    const foundOpportunity = mockBusinessOpportunities.find(item => item.id === parseInt(id));
    if (foundOpportunity) {
      setOpportunity(foundOpportunity);
    } else {
      // Redirect back if not found
      navigate('/peluang-usaha', { replace: true });
    }
  }, [id, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCompleteToggle = () => {
    setIsCompleted(!isCompleted);
  };

  const handleShare = () => {
    // Placeholder for share functionality
    alert(`Bagikan peluang usaha: ${opportunity?.title}`);
  };

  const handleDownloadPDF = () => {
    // Placeholder for download PDF functionality
    alert(`Unduh PDF peluang usaha: ${opportunity?.title}`);
  };

  const handleImageClick = () => {
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  if (!opportunity) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Typography variant="h6">Memuat detail peluang usaha...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          {opportunity.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {opportunity.description}
        </Typography>

        {/* Meta Information */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Chip 
            label={opportunity.category} 
            size="small" 
            variant="outlined"
            sx={{ 
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
            Estimasi Investasi: Rp {opportunity.investment.toLocaleString('id-ID')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
            Potensi Pendapatan: {opportunity.potentialIncome}
          </Typography>
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
          src={opportunity.media ? opportunity.media : defaultImage}
          alt={opportunity.title}
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

      {/* Challenges Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
          Tantangan
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'grey.100', borderRadius: 2 }}>
          <Typography variant="body1">{opportunity.challenges}</Typography>
        </Paper>
      </Box>

      {/* Implementation Suggestions Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
          Saran Implementasi
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'grey.100', borderRadius: 2 }}>
          <Typography variant="body1">{opportunity.implementationSuggestions}</Typography>
        </Paper>
      </Box>

      {/* Image Modal */}
      {imageModalOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1300,
            p: 2
          }}
          onClick={handleCloseImageModal}
        >
          <Box
            component="img"
            src={opportunity.imageUrl}
            alt={opportunity.title}
            sx={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: 2,
              boxShadow: 24
            }}
          />
          <IconButton
            onClick={handleCloseImageModal}
            sx={{
              position: 'fixed',
              top: 16,
              right: 16,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Container>
  );
};

export default DetailPeluangUsaha;
