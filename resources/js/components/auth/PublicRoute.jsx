import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Jika sedang loading, tampilkan indikator loading
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Jika user sudah terautentikasi, redirect ke halaman home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Jika user belum terautentikasi, tampilkan konten publik
  return <Outlet />;
};

export default PublicRoute; 