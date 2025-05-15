import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  Checkbox,
  FormControlLabel,
  Grid
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// Import komponen yang sudah dibuat
import Input from '../components/common/Input';
import Button from '../components/common/Button';

// Import action untuk register (akan diimplementasikan nanti)
// import { register } from '../store/slices/authSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // State untuk form
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  // State untuk error dan loading
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeTerms' ? checked : value
    });
    
    // Reset error untuk field ini jika ada
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validasi form
  const validateForm = () => {
    const newErrors = {};
    
    // Validasi nama
    if (!formData.nama) {
      newErrors.nama = 'Nama tidak boleh kosong';
    }
    
    // Validasi email
    if (!formData.email) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    // Validasi password
    if (!formData.password) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    // Validasi confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak boleh kosong';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    
    // Validasi terms
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Anda harus menyetujui syarat dan ketentuan';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setRegisterError('');
    
    // Validasi form
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulasi register (ganti dengan dispatch ke redux action nanti)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sukses register, navigate ke login page
      navigate('/login');
      
    } catch (error) {
      // Handle error register
      setRegisterError(
        error.response?.data?.message || 
        'Terjadi kesalahan saat mendaftar. Silakan coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Daftar Akun Baru
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Isi data berikut untuk mendaftar di platform Revalio
      </Typography>
      
      {registerError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {registerError}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Input
          id="nama"
          name="nama"
          label="Nama Lengkap"
          value={formData.nama}
          onChange={handleChange}
          error={errors.nama}
          helperText={errors.nama}
          startIcon={<PersonIcon />}
          required
          sx={{ mb: 2 }}
        />
        
        <Input
          id="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          helperText={errors.email}
          startIcon={<EmailIcon />}
          required
          sx={{ mb: 2 }}
        />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Input
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText={errors.password}
              startIcon={<LockIcon />}
              endIcon={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
              required
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Konfirmasi Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              helperText={errors.confirmPassword}
              startIcon={<LockIcon />}
              endIcon={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
              required
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox 
                name="agreeTerms" 
                checked={formData.agreeTerms}
                onChange={handleChange}
                color="primary"
                size="small"
              />
            }
            label={
              <Typography variant="body2">
                Saya setuju dengan {' '}
                <Link 
                  to="/terms" 
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Typography 
                    component="span" 
                    variant="body2" 
                    color="primary"
                    fontWeight={600}
                    sx={{ '&:hover': { textDecoration: 'underline' } }}
                  >
                    syarat dan ketentuan
                  </Typography>
                </Link>
              </Typography>
            }
          />
          {errors.agreeTerms && (
            <Typography variant="caption" color="error">
              {errors.agreeTerms}
            </Typography>
          )}
        </Box>
        
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          sx={{ mb: 2 }}
        >
          Daftar
        </Button>
        
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            ATAU
          </Typography>
        </Divider>
        
        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={() => {/* Google register implementation */}}
          sx={{ mb: 3 }}
        >
          Daftar dengan Google
        </Button>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            Sudah memiliki akun?{' '}
            <Link 
              to="/login" 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Typography 
                component="span" 
                variant="body2" 
                color="primary"
                fontWeight={600}
                sx={{ '&:hover': { textDecoration: 'underline' } }}
              >
                Masuk sekarang
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
