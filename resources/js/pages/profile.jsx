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
  useMediaQuery
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
  Category as CategoryIcon
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
    { id: 1, judul: 'Cara Membuat Kompos dari Sampah Dapur', kategori: 'Organik' },
    { id: 2, judul: 'Tutorial Daur Ulang Botol Plastik Menjadi Pot Tanaman', kategori: 'Plastik' }
  ],
  sampah_favorit: [
    { id: 1, nama: 'Botol Plastik', kategori: 'Plastik' },
    { id: 2, nama: 'Kardus', kategori: 'Kertas' }
  ],
  kontribusi_forum: {
    thread: 5,
    komentar: 12
  }
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
      // Biasanya di sini perlu upload file ke server
      // Untuk sementara kita hanya update state saja dengan URL dummy
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
    // Tambahkan logika untuk menyimpan ke server di sini
  };

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', py: 4, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Profil Saya
          </Typography>
          <Typography variant="body1">
            Kelola informasi profil dan pengaturan akun Anda
          </Typography>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Sidebar - Navigation and Actions */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              {/* Profile Picture and Name */}
              <Box sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                bgcolor: theme.palette.primary.light,
                color: 'white'
              }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={formData.foto_profil} 
                    alt={formData.nama_lengkap}
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      border: '4px solid white', 
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
                    }}
                  />
                  {editMode && (
                    <IconButton 
                      color="primary" 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        right: 0, 
                        bgcolor: 'white',
                        '&:hover': {
                          bgcolor: 'grey.200'
                        }
                      }}
                      onClick={handleAvatarClick}
                    >
                      <PhotoCameraIcon fontSize="small" />
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                  {userData.nama_lengkap}
                </Typography>
                <Typography variant="body2">
                  Terdaftar sejak {new Date(userData.tanggal_registrasi).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>

              <Divider />

              {/* Navigation List */}
              <List component="nav">
                <ListItemButton selected={tabValue === 0} onClick={() => setTabValue(0)}>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText primary="Informasi Profil" />
                </ListItemButton>
                <ListItemButton selected={tabValue === 1} onClick={() => setTabValue(1)}>
                  <ListItemIcon>
                    <LockIcon />
                  </ListItemIcon>
                  <ListItemText primary="Keamanan Akun" />
                </ListItemButton>
                <ListItemButton selected={tabValue === 2} onClick={() => setTabValue(2)}>
                  <ListItemIcon>
                    <RecyclingIcon />
                  </ListItemIcon>
                  <ListItemText primary="Aktivitas Sampah" />
                </ListItemButton>
                <ListItemButton selected={tabValue === 3} onClick={() => setTabValue(3)}>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Pengaturan Notifikasi" />
                </ListItemButton>
                
                <Divider sx={{ my: 1 }} />
                
                <ListItemButton>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Keluar" />
                </ListItemButton>
              </List>
            </Paper>
          </Grid>

          {/* Main Content Tabs */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              {/* Desktop: Tab indicator at top */}
              {!isMobile && (
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Informasi Profil" id="tab-0" />
                    <Tab label="Keamanan Akun" id="tab-1" />
                    <Tab label="Aktivitas Sampah" id="tab-2" />
                    <Tab label="Pengaturan Notifikasi" id="tab-3" />
                  </Tabs>
                </Box>
              )}

              {/* Tab Panels */}
              <Box role="tabpanel" hidden={tabValue !== 0}>
                {tabValue === 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" fontWeight={600}>Informasi Pribadi</Typography>
                      {!editMode ? (
                        <Button 
                          variant="contained" 
                          startIcon={<EditIcon />} 
                          onClick={() => setEditMode(true)}
                        >
                          Edit Profil
                        </Button>
                      ) : (
                        <Button 
                          variant="contained" 
                          color="success"
                          startIcon={<SaveIcon />} 
                          onClick={handleSaveChanges}
                        >
                          Simpan Perubahan
                        </Button>
                      )}
                    </Box>

                    <Grid container spacing={3}>
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
                                <EmailIcon />
                              </InputAdornment>
                            ),
                          }}
                          helperText="Email tidak dapat diubah"
                          variant="filled"
                          margin="normal"
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
                                <PhoneIcon />
                              </InputAdornment>
                            ),
                          }}
                          variant={editMode ? "outlined" : "filled"}
                          margin="normal"
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
                                />
                              </InputAdornment>
                            ),
                          }}
                          variant="filled"
                          margin="normal"
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
                                <HomeIcon />
                              </InputAdornment>
                            ),
                          }}
                          multiline
                          rows={2}
                          variant={editMode ? "outlined" : "filled"}
                          margin="normal"
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
                                <CategoryIcon />
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
                    <Typography variant="h5" fontWeight={600} gutterBottom>Keamanan Akun</Typography>
                    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>Ubah Password</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Pastikan password Anda kuat dan unik untuk melindungi akun Anda.
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Password Saat Ini"
                            type="password"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Password Baru"
                            type="password"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Konfirmasi Password Baru"
                            type="password"
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ mt: 2 }}
                      >
                        Ubah Password
                      </Button>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>Verifikasi Dua Faktor</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Aktifkan verifikasi dua faktor untuk meningkatkan keamanan akun.
                          </Typography>
                        </Box>
                        <Switch />
                      </Box>
                    </Paper>
                  </Box>
                )}
              </Box>

              <Box role="tabpanel" hidden={tabValue !== 2}>
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>Aktivitas Sampah</Typography>
                    
                    {/* Stats Cards */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>Total Sampah Dikelola</Typography>
                            <Typography variant="h3" fontWeight={700}>
                              {activityDummyData.total_terkelola} kg
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ bgcolor: theme.palette.success.main, color: 'white' }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>Total Nilai Ekonomis</Typography>
                            <Typography variant="h3" fontWeight={700}>
                              Rp {activityDummyData.total_nilai.toLocaleString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Favorite Lists */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardHeader 
                            title="Tutorial Favorit" 
                            titleTypographyProps={{ fontWeight: 600 }}
                            avatar={<FavoriteIcon color="error" />} 
                          />
                          <CardContent>
                            {activityDummyData.tutorial_favorit.length > 0 ? (
                              <List>
                                {activityDummyData.tutorial_favorit.map((tutorial) => (
                                  <ListItem key={tutorial.id} divider>
                                    <ListItemIcon>
                                      <FavoriteIcon color="error" />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={tutorial.judul} 
                                      secondary={`Kategori: ${tutorial.kategori}`}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Anda belum memiliki tutorial favorit.
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardHeader 
                            title="Jenis Sampah Favorit" 
                            titleTypographyProps={{ fontWeight: 600 }}
                            avatar={<RecyclingIcon color="primary" />} 
                          />
                          <CardContent>
                            {activityDummyData.sampah_favorit.length > 0 ? (
                              <List>
                                {activityDummyData.sampah_favorit.map((sampah) => (
                                  <ListItem key={sampah.id} divider>
                                    <ListItemIcon>
                                      <RecyclingIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={sampah.nama} 
                                      secondary={`Kategori: ${sampah.kategori}`}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Anda belum memiliki jenis sampah favorit.
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Forum Activity */}
                    <Card sx={{ mt: 3 }}>
                      <CardHeader 
                        title="Kontribusi Forum" 
                        titleTypographyProps={{ fontWeight: 600 }}
                        avatar={<CommentIcon color="info" />}
                      />
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h4" color="primary" fontWeight={700}>
                                {activityDummyData.kontribusi_forum.thread}
                              </Typography>
                              <Typography variant="body1">Thread Dibuat</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h4" color="primary" fontWeight={700}>
                                {activityDummyData.kontribusi_forum.komentar}
                              </Typography>
                              <Typography variant="body1">Komentar</Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Box>

              <Box role="tabpanel" hidden={tabValue !== 3}>
                {tabValue === 3 && (
                  <Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>Pengaturan Notifikasi</Typography>
                    
                    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Notifikasi Aplikasi</Typography>
                      
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Pemberitahuan Forum" 
                            secondary="Notifikasi saat ada tanggapan baru pada thread atau komentar Anda" 
                          />
                          <Switch defaultChecked />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText 
                            primary="Tutorial dan Konten Baru" 
                            secondary="Notifikasi saat ada tutorial atau panduan baru tentang sampah" 
                          />
                          <Switch defaultChecked />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText 
                            primary="Pengingat Pengumpulan Sampah" 
                            secondary="Notifikasi pengingat jadwal pengumpulan sampah di daerah Anda" 
                          />
                          <Switch />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText 
                            primary="Peluang Usaha Baru" 
                            secondary="Notifikasi saat ada peluang usaha baru terkait pengolahan sampah" 
                          />
                          <Switch defaultChecked />
                        </ListItem>
                      </List>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Notifikasi Email</Typography>
                      
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Berita dan Update Bulanan" 
                            secondary="Terima email tentang berita dan update platform secara bulanan" 
                          />
                          <Switch />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText 
                            primary="Laporan Aktivitas" 
                            secondary="Laporan mingguan tentang aktivitas pengelolaan sampah Anda" 
                          />
                          <Switch defaultChecked />
                        </ListItem>
                      </List>
                      
                      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                        Simpan Pengaturan
                      </Button>
                    </Paper>
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
