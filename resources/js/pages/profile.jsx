import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Avatar,
  Paper,
  TextField,
  Button,
  Divider,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  Chip,
  InputAdornment,
  Tooltip,
  useTheme,
  useMediaQuery,
  Badge,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Lock as LockIcon,
  Logout as LogoutIcon,
  Favorite as FavoriteIcon,
  Recycling as RecyclingIcon,
  Comment as CommentIcon,
  History as HistoryIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Email as EmailIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';
import axiosInstance from '../config/axios';
import SimpleImageCrop from '../components/ui/SimpleImageCrop';

// Data dummy untuk profil pengguna
const userDummyData = {
  user_id: 1,
  nama_lengkap: 'Ahmad Fauzi',
  email: 'ahmad.fauzi@gmail.com',
  no_telepon: '+6281234567890',
  alamat: 'Jl. Kenanga No. 15, Bandung, Jawa Barat',
  foto_profil: '/assets/images/user.jpg',
  preferensi_sampah: 'Plastik, Kertas, Elektronik',
  tanggal_registrasi: '2023-01-15',
  status_akun: 'active'
};

// Data dummy untuk aktivitas
const activityDummyData = {
  total_terkelola: 48.5, // dalam kg
  total_nilai: 152000, // dalam rupiah
  tutorial_favorit: [
    { id: 1, judul: 'Cara Membuat Kompos dari Sampah Dapur', kategori: 'Organik', dilihat: 12 },
    { id: 2, judul: 'Tutorial Daur Ulang Botol Plastik Menjadi Pot Tanaman', kategori: 'Plastik', dilihat: 8 }
  ],
  sampah_favorit: [
    { id: 1, nama: 'Botol Plastik', kategori: 'Plastik', nilai: 4500 },
    { id: 2, nama: 'Kardus', kategori: 'Kertas', nilai: 2000 }
  ],
  kontribusi_forum: {
    thread: 5,
    komentar: 12,
    poin: 245
  },
  riwayat_terakhir: [
    { id: 1, jenis: 'Penjualan', item: 'Botol Plastik', jumlah: 3.5, satuan: 'kg', nilai: 15750, tanggal: '2023-05-15' },
    { id: 2, jenis: 'Penukaran', item: 'Kardus Bekas', jumlah: 2, satuan: 'kg', nilai: 4000, tanggal: '2023-05-10' }
  ]
};

// Definisikan BASE_URL sebagai konstanta
const BASE_URL = window.location.origin;

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, refreshUser } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [userData, setUserData] = useState({
    nama_lengkap: '',
    email: '',
    no_telepon: '',
    alamat: '',
    foto_profil: '',
    status_akun: ''
  });
  
  const fileInputRef = useRef(null);
  
  // State for crop image dialog
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  
  // Password form error state
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // Loading state for password update
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    no_telepon: '',
    alamat: '',
    foto_profil: '',
    status_akun: ''
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({});
  
  // Loading state for profile update
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  
  // Determine if we're in admin context based on the URL path
  const isAdminContext = location.pathname.startsWith('/admin');
  
  // Toggle password visibility handlers
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Fetch user data when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Login Diperlukan',
        text: 'Anda harus login terlebih dahulu untuk mengakses halaman profil.',
        icon: 'warning',
        confirmButtonText: 'Login Sekarang',
      }).then(() => {
        navigate('/login', { state: { from: '/profile' } });
      });
      return;
    }
    
    // Fetch user profile data
    const fetchUserProfile = async () => {
      setIsProfileLoading(true);
      try {
        const response = await axiosInstance.get('/v1/profile');
        
        if (response.data && response.data.status === 'success') {
          const profileData = response.data.data.user;
          
          setUserData({
            nama_lengkap: profileData.nama_lengkap || '',
            email: profileData.email || '',
            no_telepon: profileData.no_telepon || '',
            alamat: profileData.alamat || '',
            foto_profil: profileData.foto_profil ? `/storage/${profileData.foto_profil}` : '',
            status_akun: profileData.status_akun || 'active'
          });
          
          setFormData({
            nama_lengkap: profileData.nama_lengkap || '',
            email: profileData.email || '',
            no_telepon: profileData.no_telepon || '',
            alamat: profileData.alamat || '',
            foto_profil: profileData.foto_profil ? `/storage/${profileData.foto_profil}` : '',
            status_akun: profileData.status_akun || 'active'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        Swal.fire({
          title: 'Error',
          text: 'Gagal memuat data profil. Silakan coba lagi nanti.',
          icon: 'error',
        });
      } finally {
        setIsProfileLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated, user, navigate]);

  // Handler untuk perubahan tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handler untuk perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field if exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Handler untuk unggah foto profil
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create temp URL for cropping
      const imageUrl = URL.createObjectURL(file);
      setTempImageUrl(imageUrl);
      setCropDialogOpen(true);
    }
  };

  // Handler untuk crop dialog
  const handleCropDialogClose = () => {
    setCropDialogOpen(false);
    URL.revokeObjectURL(tempImageUrl); // Clean up URL
  };

  const handleCropComplete = (croppedImageUrl) => {
    setFormData({
      ...formData,
      foto_profil: croppedImageUrl
    });
  };

  // Handler untuk tombol simpan perubahan
  const handleSaveChanges = async () => {
    // Validate form
    let formIsValid = true;
    let errors = {};
    
    if (!formData.nama_lengkap) {
      errors.nama_lengkap = 'Nama lengkap wajib diisi';
      formIsValid = false;
    }
    
    if (!formIsValid) {
      setFormErrors(errors);
      return;
    }
    
    setIsUpdateLoading(true);
    
    try {
      // Check if photo was updated (data URL format)
      let updateData = {
        nama_lengkap: formData.nama_lengkap,
        no_telepon: formData.no_telepon,
        alamat: formData.alamat
      };
      
      // Update profile info
      const profileResponse = await axiosInstance.put('/v1/profile', updateData);
      
      // If photo was changed (starts with data:image)
      if (formData.foto_profil && formData.foto_profil.startsWith('data:image')) {
        // Upload photo
        const base64Data = formData.foto_profil;
        const blob = await fetch(base64Data).then(res => res.blob());
        const formDataPhoto = new FormData();
        formDataPhoto.append('foto', blob, 'profile.jpg');
        
        await axiosInstance.post('/v1/upload-photo', formDataPhoto, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Refresh user data
      if (refreshUser) {
        await refreshUser();
      }
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Profil berhasil diperbarui',
        timer: 1500,
        showConfirmButton: false
      });
      
      // Update displayed user data
      setUserData({...formData});
      setEditMode(false);
      
      // Fetch updated profile
      const response = await axiosInstance.get('/v1/profile');
      if (response.data && response.data.status === 'success') {
        const profileData = response.data.data.user;
        
        // Update photo URL from server response
        setUserData(prevData => ({
          ...prevData,
          foto_profil: profileData.foto_profil ? `/storage/${profileData.foto_profil}` : ''
        }));
        
        setFormData(prevData => ({
          ...prevData,
          foto_profil: profileData.foto_profil ? `/storage/${profileData.foto_profil}` : ''
        }));
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Handle API errors
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setFormErrors(error.response.data.errors);
        } else if (error.response.data.message) {
          Swal.fire({
            title: 'Gagal',
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } else {
        Swal.fire({
          title: 'Gagal',
          text: 'Terjadi kesalahan. Silakan coba lagi nanti.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } finally {
      setIsUpdateLoading(false);
    }
  };

  // Handle password form input change
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: null
      });
    }
  };
  
  // Handle password change submission
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setPasswordErrors({});
    
    // Validate form
    let formIsValid = true;
    let errors = {};
    
    if (!passwordForm.current_password) {
      errors.current_password = 'Password saat ini wajib diisi';
      formIsValid = false;
    }
    
    if (!passwordForm.password) {
      errors.password = 'Password baru wajib diisi';
      formIsValid = false;
    } else if (passwordForm.password.length < 8) {
      errors.password = 'Password baru minimal 8 karakter';
      formIsValid = false;
    }
    
    if (!passwordForm.password_confirmation) {
      errors.password_confirmation = 'Konfirmasi password wajib diisi';
      formIsValid = false;
    } else if (passwordForm.password_confirmation !== passwordForm.password) {
      errors.password_confirmation = 'Konfirmasi password tidak cocok';
      formIsValid = false;
    }
    
    if (!formIsValid) {
      setPasswordErrors(errors);
      return;
    }
    
    // Submit form to API
    setIsPasswordLoading(true);
    
    try {
      const response = await axiosInstance.post('/v1/change-password', passwordForm);
      
      // Reset form
      setPasswordForm({
        current_password: '',
        password: '',
        password_confirmation: ''
      });
      
      // Show success message
      Swal.fire({
        title: 'Berhasil!',
        text: 'Password berhasil diperbarui',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      
    } catch (error) {
      // Handle API errors
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setPasswordErrors(error.response.data.errors);
        } else if (error.response.data.message) {
          Swal.fire({
            title: 'Gagal',
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } else {
        Swal.fire({
          title: 'Gagal',
          text: 'Terjadi kesalahan. Silakan coba lagi nanti.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Handle logout with proper redirect based on user context
  const handleLogout = () => {
    // Tutup menu dropdown terlebih dahulu
    // handleMenuClose();
    
    // Tampilkan konfirmasi logout dengan SweetAlert
    Swal.fire({
      title: 'Logout',
      text: 'Apakah Anda yakin ingin keluar dari akun?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: theme.palette.error.main,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya, Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proses logout
        logout();
        
        // Tampilkan notifikasi sukses
        Swal.fire({
          title: 'Berhasil Logout',
          text: 'Anda telah berhasil keluar dari sistem',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Arahkan ke halaman login setelah notifikasi
          navigate('/login');
        });
      }
    });
  };

  // Handle back navigation
  const handleBack = () => {
    // Navigate back to the appropriate dashboard
    if (isAdminContext) {
      navigate('/admin/dashboard');
    } else {
      navigate('/home');
    }
  };

  // Jika belum terautentikasi, tidak perlu render halaman
  if (!isAuthenticated) {
    return null;
  }

  // Show loading state when profile is loading
  if (isProfileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', py: 4, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Image Crop Dialog */}
        <SimpleImageCrop
          open={cropDialogOpen}
          onClose={handleCropDialogClose}
          imageUrl={tempImageUrl}
          onSave={handleCropComplete}
          aspect={1}
        />
      
        {/* Back Button */}
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          {isAdminContext ? 'Dashboard Admin' : 'Dashboard'}
        </Button>
      
        {/* Header */}
        <Paper elevation={0} sx={{ 
          p: { xs: 2, md: 3 }, 
          mb: 4, 
          borderRadius: 3, 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          boxShadow: theme.shadows[4]
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Profil Saya
              </Typography>
              <Typography variant="body1">
                Kelola informasi profil dan pengaturan akun Anda
              </Typography>
            </Box>
            <Chip 
              label="Akun Verifikasi" 
              color="success" 
              size="small" 
              icon={<VerifiedUserIcon fontSize="small" />}
              sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}
            />
          </Box>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Sidebar - Navigation and Actions */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ 
              borderRadius: 3, 
              overflow: 'hidden',
              boxShadow: theme.shadows[2]
            }}>
              {/* Profile Picture and Name */}
              <Box sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                color: 'white',
                textAlign: 'center'
              }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    editMode && (
                      <IconButton 
                        size="small" 
                        onClick={handleAvatarClick}
                        sx={{ 
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'grey.200' }
                        }}
                      >
                        <PhotoCameraIcon fontSize="small" color="primary" />
                        <input
                          ref={fileInputRef}
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </IconButton>
                    )
                  }
                >
                  <Avatar
                    src={formData.foto_profil} 
                    alt={formData.nama_lengkap}
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      border: '4px solid white', 
                      boxShadow: theme.shadows[4] 
                    }}
                  />
                </Badge>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                  {userData.nama_lengkap}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {userData.email}
                </Typography>
              </Box>

              <Divider />

              {/* Navigation List */}
              <List component="nav" sx={{ p: 1 }}>
                <ListItemButton 
                  selected={tabValue === 0} 
                  onClick={() => setTabValue(0)}
                  sx={{ 
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: `${theme.palette.primary.light}20`,
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Informasi Profil" primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
                <ListItemButton 
                  selected={tabValue === 1} 
                  onClick={() => setTabValue(1)}
                  sx={{ 
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: `${theme.palette.primary.light}20`,
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LockIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Keamanan Akun" primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
                
                <Divider sx={{ my: 1 }} />
                
                <ListItemButton 
                  onClick={handleLogout}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Keluar" 
                    primaryTypographyProps={{ 
                      variant: 'body2',
                      color: 'error.main'
                    }} 
                  />
                </ListItemButton>
              </List>
            </Paper>
          </Grid>

          {/* Main Content Tabs */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ 
              p: { xs: 2, md: 3 }, 
              borderRadius: 3,
              boxShadow: theme.shadows[1],
              minHeight: 'calc(100vh - 200px)'
            }}>
              {/* Desktop: Tab indicator at top */}
              {!isMobile && (
                <Box sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider', 
                  mb: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    sx={{
                      '& .MuiTab-root': {
                        minHeight: 48,
                        fontWeight: 600
                      }
                    }}
                  >
                    <Tab label="Informasi Profil" id="tab-0" />
                    <Tab label="Keamanan" id="tab-1" />
                  </Tabs>
                  {tabValue === 0 && (
                    <Button 
                      variant={editMode ? "contained" : "outlined"} 
                      color={editMode ? "success" : "primary"}
                      startIcon={editMode ? <SaveIcon /> : <EditIcon />} 
                      onClick={editMode ? handleSaveChanges : () => setEditMode(true)}
                      size="small"
                      sx={{ borderRadius: 2 }}
                      disabled={isUpdateLoading}
                    >
                      {isUpdateLoading ? (
                        <CircularProgress size={24} />
                      ) : (
                        editMode ? 'Simpan' : 'Edit Profil'
                      )}
                    </Button>
                  )}
                </Box>
              )}

              {/* Tab Panels */}
              <Box role="tabpanel" hidden={tabValue !== 0}>
                {tabValue === 0 && (
                  <Box>
                    {isMobile && (
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 3 
                      }}>
                        <Typography variant="h6" fontWeight={600}>Informasi Profil</Typography>
                        <Button 
                          variant={editMode ? "contained" : "outlined"} 
                          color={editMode ? "success" : "primary"}
                          startIcon={editMode ? <SaveIcon /> : <EditIcon />} 
                          onClick={editMode ? handleSaveChanges : () => setEditMode(true)}
                          size="small"
                          disabled={isUpdateLoading}
                        >
                          {isUpdateLoading ? (
                            <CircularProgress size={24} />
                          ) : (
                            editMode ? 'Simpan' : 'Edit'
                          )}
                        </Button>
                      </Box>
                    )}
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Nama Lengkap"
                          name="nama_lengkap"
                          value={editMode ? formData.nama_lengkap : userData.nama_lengkap}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !editMode,
                          }}
                          variant={editMode ? "outlined" : "filled"}
                          margin="normal"
                          sx={{ mb: 2 }}
                          error={!!formErrors.nama_lengkap}
                          helperText={formErrors.nama_lengkap}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          value={userData.email}
                          InputProps={{
                            readOnly: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                          helperText="Email tidak dapat diubah"
                          variant="filled"
                          margin="normal"
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Nomor Telepon"
                          name="no_telepon"
                          value={editMode ? formData.no_telepon : userData.no_telepon}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !editMode,
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                          variant={editMode ? "outlined" : "filled"}
                          margin="normal"
                          sx={{ mb: 2 }}
                          error={!!formErrors.no_telepon}
                          helperText={formErrors.no_telepon}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Status Akun"
                          value=" "
                          InputProps={{
                            readOnly: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <Chip 
                                  label="Aktif" 
                                  size="small" 
                                  color="success" 
                                  icon={<CheckCircleIcon fontSize="small" />}
                                />
                              </InputAdornment>
                            ),
                          }}
                          variant="filled"
                          margin="normal"
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Alamat"
                          name="alamat"
                          value={editMode ? formData.alamat : userData.alamat}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !editMode,
                            startAdornment: (
                              <InputAdornment position="top">
                                <HomeIcon   color="action" />
                              </InputAdornment>
                            ),
                          }}
                          multiline
                          rows={1}
                          variant={editMode ? "outlined" : "filled"}
                          margin="normal"
                          sx={{ mb: 2 }}
                          error={!!formErrors.alamat}
                          helperText={formErrors.alamat}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>

              <Box role="tabpanel" hidden={tabValue !== 1}>
                {tabValue === 1 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Keamanan Akun</Typography>
                    
                    {/* Password Section */}
                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                      <CardHeader 
                        title="Ubah Password" 
                        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                        avatar={<SecurityIcon color="primary" />}
                      />
                      <CardContent>
                        <form onSubmit={handlePasswordChange}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Password Saat Ini"
                                name="current_password"
                                type={showCurrentPassword ? "text" : "password"}
                                variant="outlined"
                                size="small"
                                value={passwordForm.current_password}
                                onChange={handlePasswordInputChange}
                                error={!!passwordErrors.current_password}
                                helperText={passwordErrors.current_password}
                                required
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={toggleCurrentPasswordVisibility}
                                        edge="end"
                                        size="small"
                                      >
                                        {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Password Baru"
                                name="password"
                                type={showNewPassword ? "text" : "password"}
                                variant="outlined"
                                size="small"
                                value={passwordForm.password}
                                onChange={handlePasswordInputChange}
                                error={!!passwordErrors.password}
                                helperText={passwordErrors.password || 'Minimal 8 karakter'}
                                required
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={toggleNewPasswordVisibility}
                                        edge="end"
                                        size="small"
                                      >
                                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Konfirmasi Password Baru"
                                name="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                variant="outlined"
                                size="small"
                                value={passwordForm.password_confirmation}
                                onChange={handlePasswordInputChange}
                                error={!!passwordErrors.password_confirmation}
                                helperText={passwordErrors.password_confirmation}
                                required
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={toggleConfirmPasswordVisibility}
                                        edge="end"
                                        size="small"
                                      >
                                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            sx={{ mt: 2, borderRadius: 2 }}
                            startIcon={<LockIcon />}
                            type="submit"
                            disabled={isPasswordLoading}
                          >
                            {isPasswordLoading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              'Ubah Password'
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;