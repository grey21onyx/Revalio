import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Divider,
  Chip,
  IconButton,
  FormHelperText,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link,
  useTheme
} from '@mui/material';
import { 
  ArrowBack, 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TutorialService from '../services/tutorialService';
import WasteTypeService from '../services/wasteTypeService';

// Mock data for waste types (harus diganti dengan API calls)
// const wasteTypes = [
//   { waste_id: 1, nama_sampah: 'Plastik', kategori_id: 1 },
//   { waste_id: 2, nama_sampah: 'Kertas', kategori_id: 2 },
//   { waste_id: 3, nama_sampah: 'Besi', kategori_id: 3 },
//   { waste_id: 4, nama_sampah: 'Aluminium', kategori_id: 4 },
//   { waste_id: 5, nama_sampah: 'Elektronik', kategori_id: 5 },
//   { waste_id: 6, nama_sampah: 'Tekstil', kategori_id: 6 },
// ];

// Difficulty level mapping
const difficultyLevels = {
  'VERY_EASY': 'Sangat Mudah',
  'EASY': 'Mudah',
  'MEDIUM': 'Sedang',
  'HARD': 'Sulit',
  'VERY_HARD': 'Sangat Sulit'
};

// Tutorial type mapping
const tutorialTypes = {
  'daur_ulang': 'Daur Ulang',
  'reuse': 'Reuse'
};

const TambahPanduan = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State untuk form
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    jenis_tutorial: 'daur_ulang',
    waste_id: '',
    tingkat_kesulitan: 'MEDIUM',
    estimasi_waktu: 30,
    media: null,
    bahan_dan_alat: [],
    langkah_langkah: []
  });
  
  // State untuk validasi
  const [errors, setErrors] = useState({});
  
  // State untuk notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // State untuk file preview
  const [mediaPreview, setMediaPreview] = useState(null);
  
  // State untuk form item baru
  const [newMaterial, setNewMaterial] = useState({ nama: '', gambar: null });
  const [newStep, setNewStep] = useState({ judul: '', deskripsi: '', media: null, langkah: 1 });
  
  // State untuk daftar jenis sampah
  const [wasteTypes, setWasteTypes] = useState([]);
  
  // State untuk loading
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch data jenis sampah
  useEffect(() => {
    const fetchWasteTypes = async () => {
      setIsLoading(true);
      try {
        const response = await WasteTypeService.getPublicWasteTypes();
        if (response && response.data) {
          setWasteTypes(response.data);
        }
      } catch (error) {
        console.error('Error fetching waste types:', error);
        setNotification({
          open: true,
          message: 'Gagal memuat data jenis sampah',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWasteTypes();
  }, []);
  
  // Handle input text change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if any
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle media file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        media: file
      });
      
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      if (errors.media) {
        setErrors({
          ...errors,
          media: null
        });
      }
    }
  };
  
  // Handle material input
  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial({
      ...newMaterial,
      [name]: value
    });
  };
  
  // Handle material file change
  const handleMaterialFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMaterial({
        ...newMaterial,
        gambar: file
      });
      
      // If needed, preview can be added here
    }
  };
  
  // Add new material
  const handleAddMaterial = () => {
    if (newMaterial.nama.trim() === '') {
      setErrors({
        ...errors,
        bahan_dan_alat: 'Nama bahan/alat tidak boleh kosong'
      });
      return;
    }
    
    const updatedMaterials = [...formData.bahan_dan_alat, {
      ...newMaterial,
      id: Date.now() // Temporary ID for UI manipulation
    }];
    
    setFormData({
      ...formData,
      bahan_dan_alat: updatedMaterials
    });
    
    // Reset new material form
    setNewMaterial({ nama: '', gambar: null });
    
    // Clear error if any
    if (errors.bahan_dan_alat) {
      setErrors({
        ...errors,
        bahan_dan_alat: null
      });
    }
  };
  
  // Delete material
  const handleDeleteMaterial = (id) => {
    const updatedMaterials = formData.bahan_dan_alat.filter(item => item.id !== id);
    setFormData({
      ...formData,
      bahan_dan_alat: updatedMaterials
    });
  };
  
  // Handle step input
  const handleStepChange = (e) => {
    const { name, value } = e.target;
    setNewStep({
      ...newStep,
      [name]: value
    });
  };
  
  // Handle step file change
  const handleStepFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewStep({
        ...newStep,
        media: file
      });
      
      // If needed, preview can be added here
    }
  };
  
  // Add new step
  const handleAddStep = () => {
    if (newStep.judul.trim() === '' || newStep.deskripsi.trim() === '') {
      setErrors({
        ...errors,
        langkah_langkah: 'Judul dan deskripsi langkah tidak boleh kosong'
      });
      return;
    }
    
    const nextStepNumber = formData.langkah_langkah.length + 1;
    const updatedSteps = [...formData.langkah_langkah, {
      ...newStep,
      langkah: nextStepNumber,
      id: Date.now() // Temporary ID for UI manipulation
    }];
    
    setFormData({
      ...formData,
      langkah_langkah: updatedSteps
    });
    
    // Reset new step form
    setNewStep({ judul: '', deskripsi: '', media: null, langkah: nextStepNumber + 1 });
    
    // Clear error if any
    if (errors.langkah_langkah) {
      setErrors({
        ...errors,
        langkah_langkah: null
      });
    }
  };
  
  // Delete step
  const handleDeleteStep = (id) => {
    const updatedSteps = formData.langkah_langkah.filter(item => item.id !== id);
    // Renumber steps
    const renumberedSteps = updatedSteps.map((step, index) => ({
      ...step,
      langkah: index + 1
    }));
    
    setFormData({
      ...formData,
      langkah_langkah: renumberedSteps
    });
    
    // Update next step number in form
    setNewStep({
      ...newStep,
      langkah: renumberedSteps.length + 1
    });
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.judul.trim()) newErrors.judul = 'Judul tidak boleh kosong';
    if (!formData.deskripsi.trim()) newErrors.deskripsi = 'Deskripsi tidak boleh kosong';
    if (!formData.waste_id) newErrors.waste_id = 'Jenis sampah harus dipilih';
    if (!formData.media) newErrors.media = 'Gambar panduan harus diupload';
    if (formData.bahan_dan_alat.length === 0) newErrors.bahan_dan_alat = 'Minimal satu bahan/alat harus ditambahkan';
    if (formData.langkah_langkah.length === 0) newErrors.langkah_langkah = 'Minimal satu langkah harus ditambahkan';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setNotification({
        open: true,
        message: 'Silakan perbaiki error pada form',
        severity: 'error'
      });
      return;
    }
    
    // Prepare form data for API
    const apiFormData = new FormData();
    apiFormData.append('judul', formData.judul);
    apiFormData.append('deskripsi', formData.deskripsi);
    apiFormData.append('jenis_tutorial', formData.jenis_tutorial);
    apiFormData.append('waste_id', formData.waste_id);
    apiFormData.append('tingkat_kesulitan', formData.tingkat_kesulitan);
    apiFormData.append('estimasi_waktu', formData.estimasi_waktu);
    
    // Add main media
    if (formData.media) {
      apiFormData.append('media', formData.media);
    }
    
    // Add materials and steps as JSON
    apiFormData.append('bahan_dan_alat', JSON.stringify(formData.bahan_dan_alat));
    apiFormData.append('langkah_langkah', JSON.stringify(formData.langkah_langkah));
    
    // Add material images
    formData.bahan_dan_alat.forEach((material, index) => {
      if (material.gambar) {
        apiFormData.append(`bahan_gambar_${index}`, material.gambar);
      }
    });
    
    // Add step images
    formData.langkah_langkah.forEach((step, index) => {
      if (step.media) {
        apiFormData.append(`langkah_media_${index}`, step.media);
      }
    });
    
    try {
      setIsLoading(true);
      const response = await TutorialService.createTutorial(apiFormData);
      
      setNotification({
        open: true,
        message: 'Panduan berhasil disimpan!',
        severity: 'success'
      });
      
      // Redirect after success
      setTimeout(() => {
        navigate('/daur-ulang');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <Box sx={{ backgroundColor: '#f9f9f9', py: { xs: 3, md: 5 }, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link 
            color="inherit" 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            sx={{ textDecoration: 'none' }}
          >
            Home
          </Link>
          <Link 
            color="inherit" 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate('/daur-ulang'); }}
            sx={{ textDecoration: 'none' }}
          >
            Panduan Daur Ulang
          </Link>
          <Typography color="text.primary">Tambah Panduan Baru</Typography>
        </Breadcrumbs>
        
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={handleBack} 
            sx={{ mr: 2 }}
            color="primary"
          >
            <ArrowBack />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight={700}
            sx={{ 
              position: 'relative', 
              display: 'inline-block',
            }}
          >
            Tambah Panduan Baru
            <Box 
              sx={{ 
                position: 'absolute',
                bottom: -5,
                left: 0,
                width: '100%',
                height: 4,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 2
              }}
            />
          </Typography>
        </Box>
        
        {/* Form */}
        <Paper 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            p: { xs: 3, md: 4 }, 
            borderRadius: 2, 
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            mb: 4
          }}
        >
          <Grid container spacing={3}>
            {/* Informasi Dasar */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Informasi Dasar
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            {/* Judul */}
            <Grid item xs={12}>
              <TextField
                name="judul"
                label="Judul Panduan"
                fullWidth
                value={formData.judul}
                onChange={handleInputChange}
                error={!!errors.judul}
                helperText={errors.judul}
                placeholder="Contoh: Membuat Pot Tanaman dari Botol Plastik"
              />
            </Grid>
            
            {/* Deskripsi */}
            <Grid item xs={12}>
              <TextField
                name="deskripsi"
                label="Deskripsi"
                fullWidth
                multiline
                rows={4}
                value={formData.deskripsi}
                onChange={handleInputChange}
                error={!!errors.deskripsi}
                helperText={errors.deskripsi}
                placeholder="Jelaskan secara singkat tentang panduan ini"
              />
            </Grid>
            
            {/* Jenis Tutorial */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Jenis Panduan</InputLabel>
                <Select
                  name="jenis_tutorial"
                  value={formData.jenis_tutorial}
                  onChange={handleInputChange}
                  label="Jenis Panduan"
                >
                  {Object.entries(tutorialTypes).map(([value, label]) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Jenis Sampah */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.waste_id}>
                <InputLabel>Jenis Sampah</InputLabel>
                <Select
                  name="waste_id"
                  value={formData.waste_id}
                  onChange={handleInputChange}
                  label="Jenis Sampah"
                >
                  {wasteTypes.map((type) => (
                    <MenuItem key={type.waste_id} value={type.waste_id}>
                      {type.nama_sampah}
                    </MenuItem>
                  ))}
                </Select>
                {errors.waste_id && <FormHelperText>{errors.waste_id}</FormHelperText>}
              </FormControl>
            </Grid>
            
            {/* Tingkat Kesulitan */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tingkat Kesulitan</InputLabel>
                <Select
                  name="tingkat_kesulitan"
                  value={formData.tingkat_kesulitan}
                  onChange={handleInputChange}
                  label="Tingkat Kesulitan"
                >
                  {Object.entries(difficultyLevels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Estimasi Waktu */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="estimasi_waktu"
                label="Estimasi Waktu (menit)"
                type="number"
                fullWidth
                value={formData.estimasi_waktu}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            {/* Gambar Utama */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Gambar Utama
              </Typography>
              
              <Box 
                sx={{ 
                  border: '2px dashed', 
                  borderColor: errors.media ? 'error.main' : 'grey.300',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  mb: 2,
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover'
                  }
                }}
                onClick={() => document.getElementById('media-upload').click()}
              >
                {mediaPreview ? (
                  <Box sx={{ position: 'relative' }}>
                    <img 
                      src={mediaPreview} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px',
                        borderRadius: '8px'
                      }} 
                    />
                    <IconButton 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.8)',
                        }
                      }}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMediaPreview(null);
                        setFormData({
                          ...formData,
                          media: null
                        });
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body1" gutterBottom>
                      Klik untuk upload gambar
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Format: JPG, PNG (Max: 2MB)
                    </Typography>
                  </>
                )}
                <input
                  id="media-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Box>
              
              {errors.media && (
                <FormHelperText error>{errors.media}</FormHelperText>
              )}
            </Grid>
            
            {/* Bahan dan Alat */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Bahan dan Alat
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            {/* Form tambah bahan/alat */}
            <Grid item xs={12}>
              <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 2, mb: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      name="nama"
                      label="Nama Bahan/Alat"
                      fullWidth
                      value={newMaterial.nama}
                      onChange={handleMaterialChange}
                      placeholder="Contoh: Botol plastik bekas"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddMaterial}
                      fullWidth
                      sx={{ 
                        height: '100%',
                        minHeight: '56px',
                        borderRadius: 2
                      }}
                    >
                      Tambah
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              
              {errors.bahan_dan_alat && (
                <Alert severity="error" sx={{ mb: 2 }}>{errors.bahan_dan_alat}</Alert>
              )}
              
              {/* Daftar bahan/alat */}
              {formData.bahan_dan_alat.length > 0 ? (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Daftar Bahan dan Alat
                  </Typography>
                  <Grid container spacing={2}>
                    {formData.bahan_dan_alat.map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Paper
                          variant="outlined"
                          sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Typography variant="body1">
                            {index + 1}. {item.nama}
                          </Typography>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteMaterial(item.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Belum ada bahan dan alat yang ditambahkan
                </Alert>
              )}
            </Grid>
            
            {/* Langkah-langkah */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Langkah-langkah
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            {/* Form tambah langkah */}
            <Grid item xs={12}>
              <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 2, mb: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Langkah {newStep.langkah}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="judul"
                      label="Judul Langkah"
                      fullWidth
                      value={newStep.judul}
                      onChange={handleStepChange}
                      placeholder="Contoh: Persiapan Bahan"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="deskripsi"
                      label="Deskripsi Langkah"
                      fullWidth
                      multiline
                      rows={3}
                      value={newStep.deskripsi}
                      onChange={handleStepChange}
                      placeholder="Jelaskan langkah secara detail"
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      fullWidth
                      sx={{ 
                        height: '100%',
                        minHeight: '56px',
                        borderRadius: 2
                      }}
                    >
                      {newStep.media ? 'Ganti Gambar' : 'Upload Gambar'} (Opsional)
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleStepFileChange}
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddStep}
                      fullWidth
                      sx={{ 
                        height: '100%',
                        minHeight: '56px',
                        borderRadius: 2
                      }}
                    >
                      Tambah Langkah
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              
              {errors.langkah_langkah && (
                <Alert severity="error" sx={{ mb: 2 }}>{errors.langkah_langkah}</Alert>
              )}
              
              {/* Daftar langkah */}
              {formData.langkah_langkah.length > 0 ? (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Daftar Langkah
                  </Typography>
                  {formData.langkah_langkah.map((step) => (
                    <Paper
                      key={step.id}
                      variant="outlined"
                      sx={{ 
                        p: 3, 
                        borderRadius: 2, 
                        mb: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Langkah {step.langkah}: {step.judul}
                        </Typography>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteStep(step.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="body1" paragraph>
                        {step.deskripsi}
                      </Typography>
                      {step.media && (
                        <Chip 
                          label="Gambar terlampir" 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      )}
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Belum ada langkah yang ditambahkan
                </Alert>
              )}
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={isLoading}
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: 8,
                  fontWeight: 600
                }}
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Panduan'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TambahPanduan; 