import React, { useState, useRef } from 'react';
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
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
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
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';

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

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(userDummyData);
  const fileInputRef = useRef(null);

  // State untuk form
  const [formData, setFormData] = useState({
    ...userDummyData
  });

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
  };

  // Handler untuk unggah foto profil
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          foto_profil: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler untuk tombol simpan perubahan
  const handleSaveChanges = () => {
    setUserData(formData);
    setEditMode(false);
  };

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', py: 4, minHeight: '100vh' }}>
      <Container maxWidth="lg">
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
                <Chip 
                  label={`Member sejak ${new Date(userData.tanggal_registrasi).getFullYear()}`} 
                  size="small" 
                  sx={{ 
                    mt: 1, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white' 
                  }} 
                />
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
                <ListItemButton 
                  selected={tabValue === 2} 
                  onClick={() => setTabValue(2)}
                  sx={{ 
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: `${theme.palette.primary.light}20`,
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <RecyclingIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Aktivitas Sampah" primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
                <ListItemButton 
                  selected={tabValue === 3} 
                  onClick={() => setTabValue(3)}
                  sx={{ 
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: `${theme.palette.primary.light}20`,
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <NotificationsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Notifikasi" primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
                
                <Divider sx={{ my: 1 }} />
                
                <ListItemButton sx={{ borderRadius: 1 }}>
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

            {/* Quick Stats */}
            <Paper sx={{ 
              mt: 3, 
              p: 2, 
              borderRadius: 3,
              boxShadow: theme.shadows[1]
            }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Ringkasan Aktivitas
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <RecyclingIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    <strong>{activityDummyData.total_terkelola} kg</strong> sampah dikelola
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FavoriteIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    <strong>{activityDummyData.tutorial_favorit.length}</strong> tutorial favorit
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CommentIcon color="info" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    <strong>{activityDummyData.kontribusi_forum.komentar}</strong> komentar forum
                  </Typography>
                </Box>
              </Stack>
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
                    <Tab label="Aktivitas" id="tab-2" />
                    <Tab label="Notifikasi" id="tab-3" />
                  </Tabs>
                  {tabValue === 0 && (
                    <Button 
                      variant={editMode ? "contained" : "outlined"} 
                      color={editMode ? "success" : "primary"}
                      startIcon={editMode ? <SaveIcon /> : <EditIcon />} 
                      onClick={editMode ? handleSaveChanges : () => setEditMode(true)}
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >
                      {editMode ? 'Simpan' : 'Edit Profil'}
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
                        >
                          {editMode ? 'Simpan' : 'Edit'}
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
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Status Akun"
                          value={userData.status_akun === 'active' ? 'Aktif' : 'Tidak Aktif'}
                          InputProps={{
                            readOnly: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <Chip 
                                  label={userData.status_akun === 'active' ? 'Aktif' : 'Tidak Aktif'} 
                                  size="small" 
                                  color={userData.status_akun === 'active' ? "success" : "error"} 
                                  icon={userData.status_akun === 'active' ? <CheckCircleIcon fontSize="small" /> : null}
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
                              <InputAdornment position="start">
                                <HomeIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                          multiline
                          rows={3}
                          variant={editMode ? "outlined" : "filled"}
                          margin="normal"
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Preferensi Sampah"
                          name="preferensi_sampah"
                          value={editMode ? formData.preferensi_sampah : userData.preferensi_sampah}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !editMode,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CategoryIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                          helperText="Pisahkan dengan koma (contoh: Plastik, Kertas, Elektronik)"
                          variant={editMode ? "outlined" : "filled"}
                          margin="normal"
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
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Password Saat Ini"
                              type="password"
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Password Baru"
                              type="password"
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Konfirmasi Password Baru"
                              type="password"
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                        </Grid>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          sx={{ mt: 2, borderRadius: 2 }}
                          startIcon={<LockIcon />}
                        >
                          Ubah Password
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Two-Factor Authentication */}
                    <Card sx={{ borderRadius: 2 }}>
                      <CardHeader 
                        title="Verifikasi Dua Faktor" 
                        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                        avatar={<VerifiedUserIcon color="action" />}
                        action={
                          <Switch color="primary" />
                        }
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Aktifkan verifikasi dua faktor untuk meningkatkan keamanan akun Anda. 
                          Setelah diaktifkan, Anda akan dimintai kode verifikasi saat login dari perangkat baru.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Box>

              <Box role="tabpanel" hidden={tabValue !== 2}>
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Aktivitas Sampah</Typography>
                    
                    {/* Stats Cards */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <Card sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white',
                          borderRadius: 2,
                          height: '100%'
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <RecyclingIcon sx={{ mr: 1 }} />
                              <Typography variant="subtitle1">Total Sampah Dikelola</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight={700}>
                              {activityDummyData.total_terkelola} kg
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              Sejak bergabung {new Date(userData.tanggal_registrasi).getFullYear()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Card sx={{ 
                          bgcolor: 'success.main', 
                          color: 'white',
                          borderRadius: 2,
                          height: '100%'
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <FavoriteIcon sx={{ mr: 1 }} />
                              <Typography variant="subtitle1">Total Nilai Ekonomis</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight={700}>
                              Rp {activityDummyData.total_nilai.toLocaleString('id-ID')}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              Dari pengelolaan sampah
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Recent Activity */}
                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                      <CardHeader 
                        title="Riwayat Terakhir" 
                        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                        avatar={<HistoryIcon color="action" />}
                      />
                      <CardContent>
                        {activityDummyData.riwayat_terakhir.length > 0 ? (
                          <List disablePadding>
                            {activityDummyData.riwayat_terakhir.map((item, index) => (
                              <React.Fragment key={item.id}>
                                <ListItem disablePadding sx={{ py: 1.5 }}>
                                  <ListItemIcon sx={{ minWidth: 40 }}>
                                    {item.jenis === 'Penjualan' ? (
                                      <FavoriteIcon color="error" />
                                    ) : (
                                      <RecyclingIcon color="primary" />
                                    )}
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={item.item}
                                    secondary={`${item.jumlah} ${item.satuan} • ${new Date(item.tanggal).toLocaleDateString('id-ID')}`}
                                  />
                                  <Typography variant="subtitle2" fontWeight={600}>
                                    Rp {item.nilai.toLocaleString('id-ID')}
                                  </Typography>
                                </ListItem>
                                {index < activityDummyData.riwayat_terakhir.length - 1 && (
                                  <Divider component="li" />
                                )}
                              </React.Fragment>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                            Belum ada riwayat aktivitas
                          </Typography>
                        )}
                      </CardContent>
                    </Card>

                    {/* Favorite Lists */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 2 }}>
                          <CardHeader 
                            title="Tutorial Favorit" 
                            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                            avatar={<FavoriteIcon color="error" />}
                          />
                          <CardContent>
                            {activityDummyData.tutorial_favorit.length > 0 ? (
                              <List disablePadding>
                                {activityDummyData.tutorial_favorit.map((tutorial, index) => (
                                  <React.Fragment key={tutorial.id}>
                                    <ListItem disablePadding sx={{ py: 1.5 }}>
                                      <ListItemIcon sx={{ minWidth: 40 }}>
                                        <FavoriteIcon color="error" fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary={tutorial.judul}
                                        secondary={`Kategori: ${tutorial.kategori} • Dilihat ${tutorial.dilihat}x`}
                                      />
                                    </ListItem>
                                    {index < activityDummyData.tutorial_favorit.length - 1 && (
                                      <Divider component="li" />
                                    )}
                                  </React.Fragment>
                                ))}
                              </List>
                            ) : (
                              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                                Anda belum memiliki tutorial favorit
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 2 }}>
                          <CardHeader 
                            title="Sampah Favorit" 
                            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                            avatar={<RecyclingIcon color="primary" />}
                          />
                          <CardContent>
                            {activityDummyData.sampah_favorit.length > 0 ? (
                              <List disablePadding>
                                {activityDummyData.sampah_favorit.map((sampah, index) => (
                                  <React.Fragment key={sampah.id}>
                                    <ListItem disablePadding sx={{ py: 1.5 }}>
                                      <ListItemIcon sx={{ minWidth: 40 }}>
                                        <RecyclingIcon color="primary" fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary={sampah.nama}
                                        secondary={`Kategori: ${sampah.kategori}`}
                                      />
                                      <Typography variant="subtitle2" color="primary" fontWeight={600}>
                                        Rp {sampah.nilai.toLocaleString('id-ID')}
                                      </Typography>
                                    </ListItem>
                                    {index < activityDummyData.sampah_favorit.length - 1 && (
                                      <Divider component="li" />
                                    )}
                                  </React.Fragment>
                                ))}
                              </List>
                            ) : (
                              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                                Anda belum memiliki sampah favorit
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>

              <Box role="tabpanel" hidden={tabValue !== 3}>
                {tabValue === 3 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Pengaturan Notifikasi</Typography>
                    
                    {/* App Notifications */}
                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                      <CardHeader 
                        title="Notifikasi Aplikasi" 
                        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                        avatar={<NotificationsIcon color="primary" />}
                      />
                      <CardContent>
                        <List disablePadding>
                          <ListItem disablePadding>
                            <ListItemText 
                              primary="Pemberitahuan Forum" 
                              secondary="Notifikasi saat ada tanggapan baru pada thread atau komentar Anda" 
                            />
                            <Switch defaultChecked color="primary" />
                          </ListItem>
                          <Divider component="li" />
                          <ListItem disablePadding>
                            <ListItemText 
                              primary="Tutorial dan Konten Baru" 
                              secondary="Notifikasi saat ada tutorial atau panduan baru tentang sampah" 
                            />
                            <Switch defaultChecked color="primary" />
                          </ListItem>
                          <Divider component="li" />
                          <ListItem disablePadding>
                            <ListItemText 
                              primary="Pengingat Pengumpulan Sampah" 
                              secondary="Notifikasi pengingat jadwal pengumpulan sampah di daerah Anda" 
                            />
                            <Switch color="primary" />
                          </ListItem>
                          <Divider component="li" />
                          <ListItem disablePadding>
                            <ListItemText 
                              primary="Peluang Usaha Baru" 
                              secondary="Notifikasi saat ada peluang usaha baru terkait pengolahan sampah" 
                            />
                            <Switch defaultChecked color="primary" />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>

                    {/* Email Notifications */}
                    <Card sx={{ borderRadius: 2 }}>
                      <CardHeader 
                        title="Notifikasi Email" 
                        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                        avatar={<EmailIcon color="action" />}
                      />
                      <CardContent>
                        <List disablePadding>
                          <ListItem disablePadding>
                            <ListItemText 
                              primary="Berita dan Update Bulanan" 
                              secondary="Terima email tentang berita dan update platform secara bulanan" 
                            />
                            <Switch color="primary" />
                          </ListItem>
                          <Divider component="li" />
                          <ListItem disablePadding>
                            <ListItemText 
                              primary="Laporan Aktivitas" 
                              secondary="Laporan mingguan tentang aktivitas pengelolaan sampah Anda" 
                            />
                            <Switch defaultChecked color="primary" />
                          </ListItem>
                        </List>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          sx={{ mt: 2, borderRadius: 2 }}
                          startIcon={<SaveIcon />}
                        >
                          Simpan Pengaturan
                        </Button>
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