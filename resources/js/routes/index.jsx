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
import PeluangUsaha from '../pages/PeluangUsaha';
import DetailPeluangUsaha from '../pages/DetailPeluangUsaha';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Profile from '../pages/profile';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import FormNewTopic from '../pages/FormNewTopic';
import WasteBuyerMap from '../pages/WasteBuyerMap';
import LandingPage from '../pages/LandingPage';

// Layout
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root Route - Conditional rendering berdasarkan auth state */}
      <Route path="/" element={<RootRoute />} />
      
      {/* Tentang Kami (Public) */}
      <Route path="/tentang" element={<About />} />
      
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
          
          {/* Katalog Sampah */}
          <Route path="/katalog" element={<Katalog />} />
          <Route path="/katalog/detail-sampah/:id" element={<DetailSampah />} />
          
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
          <Route path="/detail-forum/:id" element={<DetailForum />} />
          <Route path="/forum/:id" element={<ThreadDetail />} />
          <Route path="/forum/new-topic" element={<FormNewTopic />} />
          
          {/* Peluang Usaha */}
          <Route path="/peluang-usaha" element={<PeluangUsaha />} />
          <Route path="/peluang-usaha/:id" element={<DetailPeluangUsaha />} />
          
          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Route untuk peta lokasi pengepul sampah (publik dan admin) */}
          <Route path="/peta-pengepul" element={<WasteBuyerMap />} />
        </Route>
      </Route>
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
