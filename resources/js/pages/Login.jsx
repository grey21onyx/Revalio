import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux'; // Hapus atau comment jika Redux belum digunakan untuk auth
import {
  Box,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  ArrowBack,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon
} from '@mui/icons-material';

// Import komponen yang sudah dibuat
import Input from '../components/common/Input';
import Button from '../components/common/Button';

// Import authService
import authService from '../services/authService';

// Import action untuk login (akan diimplementasikan nanti)
// import { login as loginAction } from '../store/slices/authSlice'; // Ubah nama jika ada konflik

const Login = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch(); // Hapus atau comment jika Redux belum digunakan untuk auth

  const handleBack = () => {
    navigate(-1);
  };
  
  // State untuk form
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // State untuk error dan loading
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    });
    
    // Reset error untuk field ini jika ada
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    // Reset general login error
    if (loginError) {
        setLoginError('');
    }
  };

  // Validasi form
  const validateForm = () => {
    const newErrors = {};
    
    // Validasi email
    if (!formData.email) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    // Validasi password
    if (!formData.password) {
      newErrors.password = 'Password tidak boleh kosong';
    } 
    // Validasi panjang password bisa dihapus jika backend yang menangani sepenuhnya
    // else if (formData.password.length < 6) { 
    //   newErrors.password = 'Password minimal 6 karakter';
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setLoginError('');
    
    // Validasi form
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await authService.login({ 
        email: formData.email, 
        password: formData.password 
      });
      
      console.log('Login response:', response);
      // authService.login sudah menyimpan token dan user data ke localStorage
      // serta mengatur header default axios

      // Jika menggunakan Redux, dispatch action di sini
      // dispatch(loginAction(response.user)); 

      // Sukses login, navigate ke homepage
      navigate('/'); // Atau ke halaman dashboard, misal '/dashboard'
      
    } catch (error) {
      console.error('Login error object:', error);
      // Handle error login
      const errorMessage = error.message || (error.errors && error.errors.email && error.errors.email[0]) || 'Terjadi kesalahan saat login. Silakan coba lagi.';
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Beranda
      </Button>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Masuk ke Akun Anda
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Isi kredensial Anda di bawah ini untuk mengakses akun Revalio
      </Typography>
      
      {loginError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {loginError}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
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
        />
        
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
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox 
                name="rememberMe" 
                checked={formData.rememberMe}
                onChange={handleChange}
                color="primary"
                size="small"
              />
            }
            label={<Typography variant="body2">Ingat saya</Typography>}
          />
          
          <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
            <Typography 
              variant="body2" 
              color="primary"
              sx={{ '&:hover': { textDecoration: 'underline' } }}
            >
              Lupa password?
            </Typography>
          </Link>
        </Box>
        
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          sx={{ mb: 2 }}
        >
          Masuk
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
          onClick={() => {/* Google login implementation */}}
          sx={{ mb: 3 }}
        >
          Masuk dengan Google
        </Button>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            Belum memiliki akun?{' '}
            <Link 
              to="/register" 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Typography 
                component="span" 
                variant="body2" 
                color="primary"
                fontWeight={600}
                sx={{ '&:hover': { textDecoration: 'underline' } }}
              >
                Daftar sekarang
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
