import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Button as MuiButton
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

// Import custom Input and Button components
import Input from '../components/common/Input';
import Button from '../components/common/Button';

// Import authService for password reset request
import authService from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    if (!email) {
      return 'Email tidak boleh kosong';
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return 'Format email tidak valid';
    }
    return '';
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors) {
      setErrors('');
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setErrors(validationError);
      return;
    }
    setIsLoading(true);
    setErrors('');
    setSuccessMessage('');
    try {
      // Call authService to request password reset email
      await authService.forgotPassword({ email });
      setSuccessMessage('Permintaan reset password berhasil dikirim. Silakan cek email Anda.');
    } catch (error) {
      const errorMsg = error.message || 'Terjadi kesalahan saat mengirim permintaan reset password.';
      setErrors(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Lupa Password
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Masukkan email Anda untuk menerima tautan reset password.
      </Typography>

      {errors && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Input
          id="email"
          name="email"
          label="Email"
          value={email}
          onChange={handleChange}
          error={Boolean(errors)}
          helperText={errors}
          startIcon={<EmailIcon />}
          required
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          sx={{ mb: 2 }}
        >
          Kirim Tautan Reset Password
        </Button>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            ATAU
          </Typography>
        </Divider>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <MuiButton
            component={Link}
            to="/login"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="small"
          >
            Kembali ke Login
          </MuiButton>

          <MuiButton
            component={Link}
            to="/register"
            variant="outlined"
            size="small"
          >
            Daftar Akun Baru
          </MuiButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
