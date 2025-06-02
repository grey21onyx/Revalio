import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  Checkbox,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon
} from '@mui/icons-material';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location.state?.from || { pathname: '/home' };
  const { login, error, clearError, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password tidak boleh kosong';
    } 
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Call login and wait for it to complete
      const userData = await login({ 
        email: formData.email, 
        password: formData.password
      });
      
      // Store login success info in sessionStorage for the target page to display
      sessionStorage.setItem('loginSuccess', 'true');
      
      // Determine redirect path based on user role
      const isAdmin = userData?.role === 'admin' || userData?.is_admin;
      
      // Admin selalu ke dashboard admin, user biasa ke home atau intended path
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        // User biasa diarahkan ke halaman yang dituju sebelumnya jika ada
        const redirectPath = fromLocation.pathname === '/admin/dashboard' ? '/home' : fromLocation.pathname;
        navigate(redirectPath, { replace: true });
      }
      
    } catch (err) {
      console.error('Login error:', err);
      // Show error alert directly in login page
      const errorMessage = error || 'Terjadi kesalahan saat login';
      setErrors({ ...errors, general: errorMessage });
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
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {errors.general && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.general}
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