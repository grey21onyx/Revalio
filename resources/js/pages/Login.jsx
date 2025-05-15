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
  FormControlLabel
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon
} from '@mui/icons-material';

// Import komponen yang sudah dibuat
import Input from '../components/common/Input';
import Button from '../components/common/Button';

// Import action untuk login (akan diimplementasikan nanti)
// import { login } from '../store/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
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
      // Simulasi login (ganti dengan dispatch ke redux action nanti)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sukses login, navigate ke homepage
      navigate('/');
      
    } catch (error) {
      // Handle error login
      setLoginError(
        error.response?.data?.message || 
        'Terjadi kesalahan saat login. Silakan coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
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
