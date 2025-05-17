import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import halaman-halaman
import Home from '../pages/Home';
import Katalog from '../pages/Katalog';
import DetailSampah from '../pages/DetailSampah';
import DaurUlang from '../pages/DaurUlang';
import DetailPanduan from '../pages/DetailPanduan';
import Tracking from '../pages/Tracking';
import Monetisasi from '../pages/Monetisasi';
import Forum from '../pages/Forum';
import ThreadDetail from '../pages/ThreadDetail';
import PeluangUsaha from '../pages/PeluangUsaha';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import About from '../pages/About'; // Tambahkan import untuk About
import NotFound from '../pages/NotFound';

// Layout
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Main App Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        
        {/* Katalog Sampah */}
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/katalog/:id" element={<DetailSampah />} />
        
        {/* Panduan Daur Ulang */}
        <Route path="/daur-ulang" element={<DaurUlang />} />
        <Route path="/daur-ulang/:id" element={<DetailPanduan />} />
        
        {/* Tracking */}
        <Route path="/tracking" element={<Tracking />} />
        
        {/* Monetisasi */}
        <Route path="/monetisasi" element={<Monetisasi />} />
        
        {/* Forum */}
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/:id" element={<ThreadDetail />} />
        
        {/* Peluang Usaha */}
        <Route path="/peluang-usaha" element={<PeluangUsaha />} />
        
        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        
        {/* Tentang Kami */}
        <Route path="/tentang" element={<About />} />
      </Route>
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;