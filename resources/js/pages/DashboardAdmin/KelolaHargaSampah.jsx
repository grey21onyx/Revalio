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
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || '-';
    }
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    // Tangani NaN, undefined, dan null
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "Rp 0";
    }
    
    try {
      // Pastikan amount adalah number
      const numAmount = Number(amount);
      
      return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(numAmount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return "Rp 0"; // Fallback jika error
    }
  };

  // Fetch waste types and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(prev => ({ ...prev, fetch: true }));
      setError(null);
      
      try {
        // Set default categories jika perlu
        let categoryData = [];
        
        // Fetch categories
        try {
          const categoriesResponse = await api.get('/waste-categories');
          
          if (categoriesResponse.data.success) {
            if (Array.isArray(categoriesResponse.data.data) && categoriesResponse.data.data.length > 0) {
              categoryData = categoriesResponse.data.data;
              setCategories(categoryData);
            } else {
              console.warn('Tidak ada kategori sampah ditemukan dari API. Menggunakan kategori default.');
              
              // Set kategori default untuk menghindari error render
              categoryData = [
                { id: 1, name: 'PLASTIK', description: 'Sampah berbahan plastik' },
                { id: 2, name: 'LOGAM', description: 'Sampah berbahan logam' },
                { id: 3, name: 'KERTAS', description: 'Sampah berbahan kertas' },
                { id: 4, name: 'LIMBAH BIODIESEL', description: 'Sampah limbah biodiesel' }
              ];
              setCategories(categoryData);
            }
          } else {
            throw new Error('Respons API kategori tidak valid.');
          }
        } catch (catError) {
          console.error('Error fetching categories:', catError);
          
          // Gunakan kategori default jika terjadi error
          categoryData = [
            { id: 1, name: 'PLASTIK', description: 'Sampah berbahan plastik' },
            { id: 2, name: 'LOGAM', description: 'Sampah berbahan logam' },
            { id: 3, name: 'KERTAS', description: 'Sampah berbahan kertas' },
            { id: 4, name: 'LIMBAH BIODIESEL', description: 'Sampah limbah biodiesel' }
          ];
          setCategories(categoryData);
        }
        
        // Fetch waste types with values
        try {
          const wasteValuesResponse = await api.get('/waste-values');
          
          if (wasteValuesResponse.data.success) {
            const wasteData = wasteValuesResponse.data.data || [];
            
            // Pastikan setiap waste type memiliki kategori yang valid
            const processedWasteData = wasteData.map(waste => {
              // Jika tidak memiliki kategori, tetapkan default
              if (!waste.category_id || !categoryData.find(cat => cat.id === waste.category_id)) {
                return { ...waste, category_id: 1, category_name: 'Plastik' };
              }
              return waste;
            });
            
            setWasteTypes(processedWasteData);
            setFilteredWasteTypes(processedWasteData);
          } else {
            throw new Error('Respons API waste values tidak valid.');
          }
        } catch (wasteError) {
          console.error('Error fetching waste values:', wasteError);
          setWasteTypes([]);
          setFilteredWasteTypes([]);
        }
        
        setIsLoading(prev => ({ ...prev, fetch: false }));
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err.message || err.response?.data?.message || 'Terjadi kesalahan saat memuat data. Silakan coba lagi.');
        setIsLoading(prev => ({ ...prev, fetch: false }));
      }
    };
    
    fetchData();
  }, []);

  // Filter waste types based on search and category
  useEffect(() => {
    if (wasteTypes.length > 0) {
      const filtered = wasteTypes.filter(wasteType => {
        // Add null checks for name property
        const wasteName = wasteType?.name || '';
        const matchesSearch = wasteName.toLowerCase().includes((searchQuery || '').toLowerCase());
        
        // Add null check for category_id
        const wasteCategory = wasteType?.category_id || 0;
        const matchesCategory = categoryFilter === '' || wasteCategory === parseInt(categoryFilter);
        
        return matchesSearch && matchesCategory;
      });
      
      setFilteredWasteTypes(filtered);
      setPage(0); // Reset to first page when filtering
    }
  }, [searchQuery, categoryFilter, wasteTypes]);

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    // Khusus untuk price_per_kg, pastikan nilainya positif
    if (name === 'price_per_kg') {
      // Parse value ke number jika memungkinkan
      const numValue = parseFloat(value);
      
      // Jika value valid dan lebih besar dari 0, gunakan value, jika tidak kosongkan
      if (value === '' || isNaN(numValue)) {
        setFormData(prev => ({ ...prev, [name]: '' }));
      } else {
        // Pastikan nilai tidak negatif dan tidak terlalu besar
        const sanitizedValue = Math.max(0, Math.min(numValue, 1000000000)).toString();
        setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      }
    } else {
      // Untuk input lainnya
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
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
    } else if (isNaN(parseInt(formData.category_id))) {
      errors.category_id = 'Kategori tidak valid';
    }
    
    if (!formData.price_per_kg) {
      errors.price_per_kg = 'Harga per kg harus diisi';
    } else {
      const price = parseFloat(formData.price_per_kg);
      if (isNaN(price)) {
        errors.price_per_kg = 'Harga harus berupa angka';
      } else if (price <= 0) {
        errors.price_per_kg = 'Harga harus lebih dari 0';
      } else if (price > 1000000000) {
        errors.price_per_kg = 'Harga maksimal adalah 1 miliar rupiah';
      }
    }
    
    // Validasi tambahan jika mode edit
    if (isEditing && !formData.id) {
      // Tidak menampilkan error pada form untuk ini
      // tapi mencegah submit
      errors._general = 'ID jenis sampah tidak valid';
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
        name: formData.name,
        category_id: parseInt(formData.category_id),
        price_per_kg: parseFloat(formData.price_per_kg)
      };
      
      let response;
      
      if (isEditing) {
        // Validasi ID tidak boleh null saat edit
        if (!formData.id) {
          throw new Error('ID jenis sampah tidak valid');
        }
        
        // Update existing waste type price
        response = await api.put(`/waste-values/${formData.id}`, data);
        
        if (response.data.success) {
          setWasteTypes(prev => 
            prev.map(item => item.id === formData.id ? response.data.data : item)
          );
          
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: `Harga ${data.name} telah diperbarui.`,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
        }
      } else {
        // Add new waste type with price
        response = await api.post('/waste-values', data);
        
        if (response.data.success) {
          setWasteTypes(prev => [response.data.data, ...prev]);
          
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: `Jenis sampah ${data.name} telah ditambahkan.`,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
        }
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
        text: err.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, submit: false }));
    }
  };

  // Handle edit
  const handleEdit = (wasteType) => {
    setFormData({
      id: wasteType.id || null,
      name: wasteType.name || '',
      category_id: wasteType.category_id ? wasteType.category_id.toString() : '',
      price_per_kg: wasteType.price_per_kg ? wasteType.price_per_kg.toString() : '0',
    });
    setIsEditing(true);
    setFormDialogOpen(true);
  };

  // Handle delete
  const handleDelete = (wasteTypeId) => {
    // Validasi ID tidak boleh null
    if (!wasteTypeId) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'ID jenis sampah tidak valid. Silakan coba lagi.'
      });
      return;
    }

    Swal.fire({
      title: 'Konfirmasi Hapus',
      text: 'Apakah Anda yakin ingin menghapus jenis sampah ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.error.main,
      cancelButtonColor: theme.palette.grey[500],
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(prev => ({ ...prev, delete: true }));
        
        try {
          const response = await api.delete(`/waste-values/${wasteTypeId}`);
          
          if (response.data.success) {
            setWasteTypes(prev => prev.filter(item => item.id !== wasteTypeId));
          
            Swal.fire({
              icon: 'success',
              title: 'Terhapus!',
              text: 'Jenis sampah berhasil dihapus.',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false
            });
          } else {
            throw new Error(response.data.message || 'Gagal menghapus jenis sampah');
          }
        } catch (err) {
          console.error('Error deleting waste type:', err);
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: err.response?.data?.message || err.message || 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.'
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

  // Handle bulk price update
  const handleBulkUpdate = () => {
    Swal.fire({
      title: 'Perbarui Semua Harga',
      text: 'Masukkan persentase kenaikan harga (gunakan angka negatif untuk menurunkan):',
      input: 'number',
      inputAttributes: {
        step: 1,
        min: -50,
        max: 100
      },
      inputValue: 5,
      showCancelButton: true,
      confirmButtonText: 'Perbarui',
      cancelButtonText: 'Batal',
      showLoaderOnConfirm: true,
      preConfirm: async (percentage) => {
        try {
          const response = await api.post('/waste-values/bulk-update', {
            percentage: parseInt(percentage)
          });
          
          if (response.data.success) {
            // Refresh waste values after bulk update
            const wasteValuesResponse = await api.get('/waste-values');
            if (wasteValuesResponse.data.success) {
              setWasteTypes(wasteValuesResponse.data.data);
              setFilteredWasteTypes(wasteValuesResponse.data.data);
            }
            return response.data;
          }
          
          throw new Error(response.data.message);
        } catch (error) {
          Swal.showValidationMessage(
            `Request failed: ${error.response?.data?.message || error.message}`
          );
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Semua harga telah diperbarui dengan perubahan ${result.value.data.percentage}%.`,
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
                      .map((wasteType, index) => (
                        <TableRow key={wasteType.id ? wasteType.id : `waste-type-${index}`} hover>
                          <TableCell>{wasteType.name || 'Unnamed'}</TableCell>
                          <TableCell>
                            {wasteType.category_name ? (
                              <Chip 
                                label={wasteType.category_name} 
                                size="small" 
                                color={
                                  wasteType.category_name === 'PLASTIK' ? 'primary' : 
                                  wasteType.category_name === 'KERTAS' ? 'secondary' :
                                  wasteType.category_name === 'LOGAM' ? 'warning' :
                                  wasteType.category_name === 'LIMBAH BIODIESEL' ? 'success' :
                                  'info'
                                }
                                variant="outlined"
                              />
                            ) : (
                              <Chip 
                                label="Tidak Terkategori" 
                                size="small" 
                                color="default"
                                variant="outlined"
                              />
                            )}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>
                            {formatCurrency(wasteType.price_per_kg || 0)}
                          </TableCell>
                          <TableCell>{wasteType.last_updated ? formatDate(wasteType.last_updated) : '-'}</TableCell>
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
                {wasteTypes.length > 0 ? (
                  <>
                    {/* Filter nilai yang valid dulu untuk perhitungan */}
                    {(() => {
                      // Olah data terlebih dahulu
                      const validPrices = wasteTypes
                        .filter(w => w && w.price_per_kg && !isNaN(w.price_per_kg) && w.price_per_kg > 0)
                        .map(w => Number(w.price_per_kg));
                        
                      if (validPrices.length === 0) {
                        return <Typography variant="body2">Tidak ada data harga sampah yang valid</Typography>;
                      }
                      
                      const maxPrice = Math.max(...validPrices);
                      const minPrice = Math.min(...validPrices);
                      const maxPriceType = wasteTypes.find(w => Number(w.price_per_kg) === maxPrice);
                      const minPriceType = wasteTypes.find(w => Number(w.price_per_kg) === minPrice);
                      
                      return (
                        <>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            Harga Tertinggi: <strong>{formatCurrency(maxPrice)}</strong> 
                            {maxPriceType?.name && ` (${maxPriceType.name})`}
                          </Typography>
                          <Typography variant="body2">
                            Harga Terendah: <strong>{formatCurrency(minPrice)}</strong>
                            {minPriceType?.name && ` (${minPriceType.name})`}
                          </Typography>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <Typography variant="body2">
                    Tidak ada data harga sampah
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ mt: { xs: 2, md: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <MoneyIcon sx={{ fontSize: 48, mr: 2 }} />
                <Box>
                  <Typography variant="body2">Rata-rata Harga per Kg</Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {(() => {
                      // Menghitung rata-rata dengan validasi
                      const validPrices = wasteTypes
                        .filter(w => w && w.price_per_kg && !isNaN(w.price_per_kg) && w.price_per_kg > 0)
                        .map(w => Number(w.price_per_kg));
                        
                      if (validPrices.length === 0) {
                        return formatCurrency(0);
                      }
                      
                      const sum = validPrices.reduce((acc, price) => acc + price, 0);
                      return formatCurrency(sum / validPrices.length);
                    })()}
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
                    inputProps={{ 
                      min: "1", 
                      step: "100" 
                    }}
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
