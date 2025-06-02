import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import LandingPage from '../../pages/LandingPage';

const RootRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Tampilkan loading hanya saat autentikasi sedang diperiksa
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Jika user sudah terautentikasi, redirect sesuai peran
  if (isAuthenticated) {
    // Jika user adalah admin, redirect ke dashboard admin
    const isAdmin = user?.role === 'admin' || user?.is_admin;
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Jika user biasa, redirect ke halaman home
    return <Navigate to="/home" replace />;
  }

  // Jika user belum terautentikasi, tampilkan LandingPage
  return <LandingPage />;
};

export default RootRoute; 