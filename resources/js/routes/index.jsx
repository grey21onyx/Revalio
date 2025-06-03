import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

// Auth components
import ProtectedRoute from '../components/auth/ProtectedRoute';
import PublicRoute from '../components/auth/PublicRoute';
import RootRoute from '../components/auth/RootRoute';

// Import halaman-halaman
import Home from '../pages/Home';
import Katalog from '../pages/Katalog';
import DetailSampah from '../pages/DetailSampah';
import DaurUlang from '../pages/DaurUlang';
import DetailPanduan from '../pages/DetailPanduan';
import TambahPanduan from '../pages/TambahPanduan';
import Tracking from '../pages/Tracking';
import Monetisasi from '../pages/Monetisasi';
import Forum from '../pages/Forum';
import ThreadDetail from '../pages/ThreadDetail';
import DetailForum from '../pages/DetailForum';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Profile from '../pages/profile';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import FormNewTopic from '../pages/FormNewTopic';
import WasteBuyerMap from '../pages/WasteBuyerMap';
import LandingPage from '../pages/LandingPage';

// New landing pages
import EdukasiSampah from '../pages/EdukasiSampah';
import TentangKami from '../pages/TentangKami';

// Kategori Sampah pages
import SampahOrganik from '../pages/EdukasiSampahKategori/SampahOrganik';
import SampahPlastik from '../pages/EdukasiSampahKategori/SampahPlastik';
import SampahKertas from '../pages/EdukasiSampahKategori/SampahKertas';
import SampahLogam from '../pages/EdukasiSampahKategori/SampahLogam';

// Admin pages
import HomeAdmin from '../pages/DashboardAdmin/HomeAdmin';
import ManajemenDataSampah from '../pages/DashboardAdmin/ManajemenDataSampah';
import KelolaHargaSampah from '../pages/DashboardAdmin/KelolaHargaSampah';
import ManajemenLokasi from '../pages/DashboardAdmin/ManajemenLokasi';
import CMS from '../pages/DashboardAdmin/CMS';

// Layout
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Admin Route Component - Protects routes that require admin privileges
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  
  React.useEffect(() => {
    const checkAdminAccess = async () => {
      setChecking(true);
      
      // Jika sedang loading auth state, tunggu
      if (isLoading) return;
      
      // Check if user is authenticated and has admin role
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
        return;
      }
      
      const isAdmin = user?.role === 'admin' || user?.is_admin;
      if (!isAdmin) {
        navigate('/home', { replace: true, state: { message: 'Access denied. Admin privileges required.' } });
        return;
      }
      
      setChecking(false);
    };
    
    checkAdminAccess();
  }, [isAuthenticated, user, navigate, isLoading]);

  // Show loading indicator while checking admin status
  if (isLoading || checking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return children;
};

// User Route Component - Protects routes for regular users, preventing admin access
const UserRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Tampilkan loading saat memeriksa status autentikasi
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Jika tidak terotentikasi, arahkan ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Cek jika user adalah admin, redirect ke dashboard admin
  // KECUALI untuk halaman Profile yang dapat diakses oleh semua tipe pengguna
  const isAdmin = user?.role === 'admin' || user?.is_admin;
  const currentPath = window.location.pathname;
  
  if (isAdmin && currentPath !== '/profile') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Jika user biasa atau admin mengakses profile, render children
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root Route - Conditional rendering berdasarkan auth state */}
      <Route path="/" element={<RootRoute />} />
      
      {/* Landing Pages (Public) */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/edukasi" element={<EdukasiSampah />} />
      <Route path="/tentang" element={<TentangKami />} />
      
      {/* Kategori Sampah Routes */}
      <Route path="/edukasi/kategori/sampah-organik" element={<SampahOrganik />} />
      <Route path="/edukasi/kategori/sampah-plastik" element={<SampahPlastik />} />
      <Route path="/edukasi/kategori/sampah-kertas" element={<SampahKertas />} />
      <Route path="/edukasi/kategori/sampah-logam" element={<SampahLogam />} />
      
      {/* Public Katalog Routes */}
      <Route element={<MainLayout />}>
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/katalog/detail-sampah/:id" element={<DetailSampah />} />
      </Route>
      
      {/* Auth Routes - untuk user yang BELUM login */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Route>

      {/* Main App Routes - untuk user yang SUDAH login */}
      <Route element={<ProtectedRoute />}>
        {/* Admin Routes - dengan AdminLayout */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route path="dashboard" element={<HomeAdmin />} />
          <Route path="data-sampah" element={<ManajemenDataSampah />} />
          <Route path="harga-sampah" element={<KelolaHargaSampah />} />
          <Route path="forum-diskusi" element={<Forum />} />
          <Route path="lokasi-pengepul" element={<ManajemenLokasi />} />
          <Route path="cms" element={<CMS />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Regular User Routes - hanya untuk pengguna biasa */}
        <Route element={
          <UserRoute>
            <MainLayout />
          </UserRoute>
        }>
          {/* Dashboard/Home */}
          <Route path="/home" element={<Home />} />
          
          {/* Panduan Daur Ulang */}
          <Route path="/daur-ulang" element={<DaurUlang />} />
          <Route path="/daur-ulang/baru" element={<TambahPanduan />} />
          <Route path="/daur-ulang/:id" element={<DetailPanduan />} />
          
          {/* Tracking */}
          <Route path="/tracking" element={<Tracking />} />
          
          {/* Monetisasi */}
          <Route path="/monetisasi" element={<Monetisasi />} />
          
          {/* Forum */}
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/new-topic" element={<FormNewTopic />} />
          <Route path="/detail-forum/:id" element={<DetailForum />} />
          
          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Route untuk peta lokasi pengepul sampah */}
          <Route path="/peta-pengepul" element={<WasteBuyerMap />} />

          {/* About */}
          <Route path="/about" element={<About />} />
        </Route>
      </Route>
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
