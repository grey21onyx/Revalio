import React from 'react';
import { Routes, Route } from 'react-router-dom';

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

// Layout
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';

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
        <Route element={<MainLayout />}>
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

          {/* Route untuk peta lokasi pengepul sampah (publik dan admin) */}
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
