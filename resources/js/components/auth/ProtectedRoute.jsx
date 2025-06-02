import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Jika sedang loading, tampilkan indikator loading yang sederhana
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Jika user belum terautentikasi, redirect ke halaman login dengan menyimpan intended URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin status for admin routes
  if (location.pathname.startsWith('/admin')) {
    const isAdmin = user?.role === 'admin' || user?.is_admin;
    if (!isAdmin) {
      // If trying to access admin routes but not an admin, redirect to home
      return <Navigate to="/home" state={{ message: 'Access denied. Admin privileges required.' }} replace />;
    }
  }

  // Check if regular user tries to access user pages when they are admin
  // Catatan: ini sebagai lapisan keamanan tambahan, UserRoute sudah menangani ini juga
  if (!location.pathname.startsWith('/admin')) {
    const isAdmin = user?.role === 'admin' || user?.is_admin;
    if (isAdmin && location.pathname === '/home') {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // Jika user sudah terautentikasi, tampilkan konten yang dilindungi
  return <Outlet />;
};

export default ProtectedRoute; 