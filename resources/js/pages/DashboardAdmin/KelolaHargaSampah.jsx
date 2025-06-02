import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Container, 
  TextField, 
  Button, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  MonetizationOn as MoneyIcon,
  HelpOutline as HelpIcon,
  Category as CategoryIcon,
  AttachMoney as AttachMoneyIcon,
  RefreshOutlined as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import api from '../../services/api';

// Dummy data for categories and waste types
const dummyCategories = [
  { id: 1, name: 'Plastik', description: 'Semua jenis sampah berbahan plastik' },
  { id: 2, name: 'Kertas', description: 'Sampah berbahan kertas, kardus, dan sejenisnya' },
  { id: 3, name: 'Kaca', description: 'Sampah berbahan kaca atau gelas' },
  { id: 4, name: 'Logam', description: 'Sampah berbahan logam seperti besi, aluminium, dll' },
  { id: 5, name: 'Elektronik', description: 'Sampah perangkat elektronik dan komponennya' }
];

const dummyWasteTypes = [
  { id: 1, name: 'Botol Plastik PET', category_id: 1, category_name: 'Plastik', price_per_kg: 3000, last_updated: '2023-06-15' },
  { id: 2, name: 'Kardus', category_id: 2, category_name: 'Kertas', price_per_kg: 2500, last_updated: '2023-06-10' },
  { id: 3, name: 'Kaleng Aluminium', category_id: 4, category_name: 'Logam', price_per_kg: 15000, last_updated: '2023-06-12' },
  { id: 4, name: 'Botol Kaca', category_id: 3, category_name: 'Kaca', price_per_kg: 1000, last_updated: '2023-06-01' },
  { id: 5, name: 'Baterai Bekas', category_id: 5, category_name: 'Elektronik', price_per_kg: 5000, last_updated: '2023-05-20' },
  { id: 6, name: 'Plastik HDPE', category_id: 1, category_name: 'Plastik', price_per_kg: 4000, last_updated: '2023-06-08' },
  { id: 7, name: 'Kertas HVS', category_id: 2, category_name: 'Kertas', price_per_kg: 3000, last_updated: '2023-06-05' },
  { id: 8, name: 'Kabel Tembaga', category_id: 4, category_name: 'Logam', price_per_kg: 35000, last_updated: '2023-06-13' },
];

const KelolaHargaSampah = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // States for data management
  const [categories, setCategories] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);
  const [filteredWasteTypes, setFilteredWasteTypes] = useState([]);
  
  // States for filtering and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // States for form and UI
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category_id: '',
    price_per_kg: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // States for loading and error
  const [isLoading, setIsLoading] = useState({
    fetch: true,
    submit: false,
    delete: false
  });
  const [error, setError] = useState(null);

  // Format date helper
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fetch waste types and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(prev => ({ ...prev, fetch: true }));
      setError(null);
      
      try {
        // In a real application, we would fetch from the API
        // Simulate API call with setTimeout
        setTimeout(() => {
          setCategories(dummyCategories);
          setWasteTypes(dummyWasteTypes);
          setFilteredWasteTypes(dummyWasteTypes);
          setIsLoading(prev => ({ ...prev, fetch: false }));
        }, 1000);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Terjadi kesalahan saat memuat data. Silakan coba lagi.');
        setIsLoading(prev => ({ ...prev, fetch: false }));
      }
    };
    
    fetchData();
  }, []);

  // Filter waste types based on search and category
  useEffect(() => {
    if (wasteTypes.length > 0) {
      const filtered = wasteTypes.filter(wasteType => {
        const matchesSearch = wasteType.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === '' || wasteType.category_id === parseInt(categoryFilter);
        return matchesSearch && matchesCategory;
      });
      
      setFilteredWasteTypes(filtered);
      setPage(0); // Reset to first page when filtering
    }
  }, [searchQuery, categoryFilter, wasteTypes]);

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nama jenis sampah harus diisi';
    }
    
    if (!formData.category_id) {
      errors.category_id = 'Kategori harus dipilih';
    }
    
    if (!formData.price_per_kg) {
      errors.price_per_kg = 'Harga per kg harus diisi';
    } else if (isNaN(formData.price_per_kg) || parseFloat(formData.price_per_kg) <= 0) {
      errors.price_per_kg = 'Harga harus berupa angka positif';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(prev => ({ ...prev, submit: true }));
    
    try {
      const data = {
        ...formData,
        price_per_kg: parseFloat(formData.price_per_kg),
        category_name: categories.find(c => c.id === parseInt(formData.category_id))?.name || '',
        last_updated: new Date().toISOString().split('T')[0]
      };
      
      // In a real application, we would call the API to add/update
      if (isEditing) {
        // Update existing waste type
        setWasteTypes(prev => 
          prev.map(item => item.id === data.id ? data : item)
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Harga ${data.name} telah diperbarui.`,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        // Add new waste type
        const newId = Math.max(...wasteTypes.map(item => item.id)) + 1;
        const newWasteType = {
          ...data,
          id: newId
        };
        
        setWasteTypes(prev => [newWasteType, ...prev]);
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Jenis sampah ${data.name} telah ditambahkan.`,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
      
      setFormDialogOpen(false);
      setIsEditing(false);
      setFormData({
        id: null,
        name: '',
        category_id: '',
        price_per_kg: '',
      });
      
    } catch (err) {
      console.error('Error submitting form:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, submit: false }));
    }
  };

  // Handle edit
  const handleEdit = (wasteType) => {
    setFormData({
      id: wasteType.id,
      name: wasteType.name,
      category_id: wasteType.category_id.toString(),
      price_per_kg: wasteType.price_per_kg.toString(),
    });
    setIsEditing(true);
    setFormDialogOpen(true);
  };

  // Handle delete
  const handleDelete = (wasteTypeId) => {
    Swal.fire({
      title: 'Konfirmasi Hapus',
      text: 'Apakah Anda yakin ingin menghapus jenis sampah ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.error.main,
      cancelButtonColor: theme.palette.grey[500],
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(prev => ({ ...prev, delete: true }));
        
        try {
          // In a real application, we would call the API to delete
          setWasteTypes(prev => prev.filter(item => item.id !== wasteTypeId));
          
          Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: 'Jenis sampah berhasil dihapus.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } catch (err) {
          console.error('Error deleting waste type:', err);
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.'
          });
        } finally {
          setIsLoading(prev => ({ ...prev, delete: false }));
        }
      }
    });
  };

  // Handle add new
  const handleAddNew = () => {
    setFormData({
      id: null,
      name: '',
      category_id: '',
      price_per_kg: '',
    });
    setIsEditing(false);
    setFormDialogOpen(true);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle bulk price update (for demo - increases all prices by 5%)
  const handleBulkUpdate = () => {
    Swal.fire({
      title: 'Perbarui Semua Harga',
      text: 'Tindakan ini akan menaikkan semua harga sebesar 5%. Lanjutkan?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Perbarui',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedWasteTypes = wasteTypes.map(item => ({
          ...item,
          price_per_kg: Math.round(item.price_per_kg * 1.05),
          last_updated: new Date().toISOString().split('T')[0]
        }));
        
        setWasteTypes(updatedWasteTypes);
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Semua harga telah diperbarui dengan kenaikan 5%.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    });
  };

  // Check if the user is authenticated as admin
  if (!isAuthenticated) {
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
            maxWidth: 500, 
            width: '90%',
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Akses Terbatas
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Halaman ini hanya dapat diakses oleh admin. Silakan login dengan akun admin.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/login')}
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 600 }}
          >
            Login
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
            Kelola Harga Sampah
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
              mt: 1, 
              maxWidth: '800px',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              lineHeight: 1.6
            }}
          >
            Tetapkan dan perbarui harga dasar untuk setiap jenis sampah di platform
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />} 
              onClick={handleAddNew}
              fullWidth
              size={isMobile ? 'medium' : 'large'}
            >
              Tambah Jenis Sampah Baru
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Button 
              variant="outlined" 
              color="secondary" 
              startIcon={<RefreshIcon />} 
              onClick={handleBulkUpdate}
              fullWidth
              size={isMobile ? 'medium' : 'large'}
            >
              Perbarui Semua Harga
            </Button>
          </Grid>
        </Grid>

        {/* Filter Section */}
        <Paper sx={{ p: isMobile ? 1.5 : 3, mb: 3 }}>
          <Grid container spacing={isMobile ? 1 : 2} alignItems="center">
            <Grid item xs={12} sm={6} md={5}>
              <TextField
                label="Cari Jenis Sampah"
                variant="outlined"
                size="small"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <FormControl fullWidth size="small">
                <InputLabel id="category-filter-label">Filter Kategori</InputLabel>
                <Select
                  labelId="category-filter-label"
                  id="category-filter"
                  value={categoryFilter}
                  label="Filter Kategori"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryIcon fontSize={isMobile ? 'small' : 'medium'} sx={{ ml: 1 }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Semua Kategori</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={2}>
              <Button 
                variant="outlined"
                color="inherit"
                startIcon={<FilterListIcon />}
                onClick={() => { setSearchQuery(''); setCategoryFilter(''); }}
                fullWidth
                size={isMobile ? 'small' : 'medium'}
              >
                Reset Filter
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Main Content - Waste Types Table */}
        <Paper sx={{ overflow: 'hidden', borderRadius: 2 }}>
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
          
          {isLoading.fetch ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Memuat data...</Typography>
            </Box>
          ) : filteredWasteTypes.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Tidak ada data jenis sampah ditemukan
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Coba ubah filter pencarian atau tambahkan jenis sampah baru
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                sx={{ mt: 2 }} 
                onClick={handleAddNew}
              >
                Tambah Jenis Sampah
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table aria-label="waste types table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Jenis Sampah</TableCell>
                      <TableCell>Kategori</TableCell>
                      <TableCell align="right">Harga per Kg</TableCell>
                      <TableCell>Terakhir Diperbarui</TableCell>
                      <TableCell align="center">Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredWasteTypes
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((wasteType) => (
                        <TableRow key={wasteType.id} hover>
                          <TableCell>{wasteType.name}</TableCell>
                          <TableCell>
                            <Chip 
                              label={wasteType.category_name} 
                              size="small" 
                              color={
                                wasteType.category_id === 1 ? 'primary' : 
                                wasteType.category_id === 2 ? 'secondary' :
                                wasteType.category_id === 3 ? 'info' :
                                wasteType.category_id === 4 ? 'warning' :
                                'success'
                              }
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>
                            {formatCurrency(wasteType.price_per_kg)}
                          </TableCell>
                          <TableCell>{formatDate(wasteType.last_updated)}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Edit Harga">
                              <IconButton 
                                color="primary" 
                                size="small"
                                onClick={() => handleEdit(wasteType)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Hapus Jenis Sampah">
                              <IconButton 
                                color="error" 
                                size="small" 
                                onClick={() => handleDelete(wasteType.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={filteredWasteTypes.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
        </Paper>

        {/* Summary Card */}
        <Paper sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Grid container alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h6" fontWeight={600}>
                Statistik Harga Sampah
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Total Jenis Sampah: <strong>{wasteTypes.length}</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Harga Tertinggi: <strong>{formatCurrency(Math.max(...wasteTypes.map(w => w.price_per_kg)))}</strong> ({wasteTypes.find(w => w.price_per_kg === Math.max(...wasteTypes.map(item => item.price_per_kg)))?.name})
                </Typography>
                <Typography variant="body2">
                  Harga Terendah: <strong>{formatCurrency(Math.min(...wasteTypes.map(w => w.price_per_kg)))}</strong> ({wasteTypes.find(w => w.price_per_kg === Math.min(...wasteTypes.map(item => item.price_per_kg)))?.name})
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ mt: { xs: 2, md: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <MoneyIcon sx={{ fontSize: 48, mr: 2 }} />
                <Box>
                  <Typography variant="body2">Rata-rata Harga per Kg</Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {formatCurrency(wasteTypes.reduce((acc, curr) => acc + curr.price_per_kg, 0) / (wasteTypes.length || 1))}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Form Dialog */}
        <Dialog 
          open={formDialogOpen} 
          onClose={() => setFormDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {isEditing ? 'Edit Harga Sampah' : 'Tambah Jenis Sampah Baru'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Nama Jenis Sampah"
                    name="name"
                    fullWidth
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    margin="normal"
                    disabled={isEditing} // Disable name editing for existing items
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal" error={!!formErrors.category_id}>
                    <InputLabel>Kategori</InputLabel>
                    <Select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleFormChange}
                      required
                      label="Kategori"
                      disabled={isEditing} // Disable category editing for existing items
                    >
                      {categories.map(category => (
                        <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                      ))}
                    </Select>
                    {formErrors.category_id && (
                      <Typography variant="caption" color="error">
                        {formErrors.category_id}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Harga per Kg (Rupiah)"
                    name="price_per_kg"
                    type="number"
                    fullWidth
                    value={formData.price_per_kg}
                    onChange={handleFormChange}
                    required
                    error={!!formErrors.price_per_kg}
                    helperText={formErrors.price_per_kg}
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                    }}
                  />
                </Grid>
                {isEditing && (
                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ mt: 1 }}>
                      <AlertTitle>Info</AlertTitle>
                      Perubahan harga akan berpengaruh pada estimasi nilai ekonomi sampah yang akan datang.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button 
                onClick={() => setFormDialogOpen(false)} 
                variant="outlined"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={isLoading.submit ? <CircularProgress size={24} /> : <SaveIcon />}
                disabled={isLoading.submit}
              >
                {isLoading.submit ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default KelolaHargaSampah;
