import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { fetchCsrfCookie } from '../config/axios';

// Buat context untuk autentikasi
const AuthContext = createContext(null);

// Provider component untuk Auth Context
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cek apakah user sudah login (dari token di localStorage)
  useEffect(() => {
    console.log('AuthContext initialized, checking localStorage...');
    const token = localStorage.getItem('userToken');
    const savedUser = localStorage.getItem('userData');
    
    console.log('Token from localStorage:', token ? 'exists' : 'not found');
    console.log('User data from localStorage:', savedUser ? 'exists' : 'not found');
    
    if (token) {
      setIsAuthenticated(true);
      
      // Jika ada data user di localStorage, gunakan itu
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('User restored from localStorage');
        } catch (err) {
          console.error('Error parsing user data from localStorage:', err);
          // Jika parse error, fetch user dari API
          fetchCurrentUser();
        }
      } else {
        // Tidak ada data user di localStorage, fetch dari API
        fetchCurrentUser();
      }
    }
    
    // Ambil CSRF token saat aplikasi dimulai
    fetchCsrfCookie().catch(err => {
      console.error('Error fetching initial CSRF token:', err);
    });
  }, []);

  const fetchCurrentUser = async () => {
    try {
      console.log('Fetching current user data from API...');
      const token = localStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.get('/v1/user');
      console.log('User data fetched from API:', response.data);
      
      // Simpan user data ke state dan localStorage
      setUser(response.data.user || response.data);
      // Simpan user data ke localStorage untuk persistensi
      localStorage.setItem('userData', JSON.stringify(response.data.user || response.data));
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
      // Jika token invalid, logout
      if (err.response && err.response.status === 401) {
        console.log('Token tidak valid, melakukan logout...');
        logout();
      }
    }
  };

  // Fungsi untuk menyegarkan data user
  const refreshUser = async () => {
    console.log('Refreshing user data...');
    try {
      const response = await axios.get('/v1/profile');
      console.log('Profile refresh response:', response.data);
      
      if (response.data && response.data.status === 'success') {
        const userData = response.data.data.user;
        console.log('User data from profile API:', userData);
        
        // Update user state
        setUser(prevUser => {
          const updatedUser = {
            ...prevUser,
            ...userData
          };
          console.log('Updated user state:', updatedUser);
          return updatedUser;
        });
        
        // Update localStorage
        const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');
        const updatedUser = {
          ...storedUser,
          ...userData
        };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        
        console.log('User data refreshed successfully');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error refreshing user data:', err);
      return false;
    }
  };

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      // Ambil CSRF token terlebih dahulu sebelum login
      console.log('Fetching CSRF token before login...');
      await fetchCsrfCookie();
      
      console.log('Attempting login with credentials:', { ...credentials, password: '******' });
      const response = await axios.post('/v1/login', credentials);
      console.log('Login response:', response.data);
      
      // Ekstrak data dari response
      const responseData = response.data.data || {};
      const { access_token, token, user: userData } = responseData;
      
      // Gunakan token dari response.data.data
      const authToken = access_token || token;
      const userInfo = userData || responseData;
      
      // Cek jika token ada
      if (!authToken) {
        console.error('No token found in response:', response.data);
        throw new Error('Token tidak ditemukan dalam respons');
      }
      
      // Simpan token
      localStorage.setItem('userToken', authToken);
      
      // Simpan user data
      localStorage.setItem('userData', JSON.stringify(userInfo));
      
      console.log('Auth data saved to localStorage');
      
      // Set state
      setIsAuthenticated(true);
      setUser(userInfo);
      setSuccess('Login berhasil');
      
      // Redirect ke halaman utama
      navigate('/');
      
      return response.data;
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.message || 'Login gagal. Mohon coba lagi.';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Ambil CSRF token terlebih dahulu sebelum register
      console.log('Fetching CSRF token before registration...');
      await fetchCsrfCookie();
      
      console.log('Attempting registration with data:', { ...userData, password: '******' });
      const response = await axios.post('/v1/register', userData);
      console.log('Registration response:', response.data);
      
      // Jika registrasi sekaligus login
      if (response.data.token || response.data.access_token) {
        const authToken = response.data.token || response.data.access_token;
        const userInfo = response.data.user || response.data;
        
        // Simpan token dan user data
        localStorage.setItem('userToken', authToken);
        localStorage.setItem('userData', JSON.stringify(userInfo));
        
        console.log('Auth data saved to localStorage after registration');
        
        setIsAuthenticated(true);
        setUser(userInfo);
        navigate('/');
      } else {
        // Jika registrasi saja tanpa login
        setSuccess('Registrasi berhasil, silakan login');
        navigate('/login');
      }
      
      return response.data;
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = err.response?.data?.message || 'Registrasi gagal, silakan coba lagi';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log('Logging out...');
      // API call ke logout (opsional)
      await axios.post('/v1/logout');
    } catch (err) {
      console.error("Error saat logout:", err);
    } finally {
      // Hapus token dan user data dari localStorage
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      
      console.log('Auth data removed from localStorage');
      
      // Reset state
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      navigate('/login');
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    error,
    success,
    login,
    register,
    logout,
    clearError,
    clearSuccess,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 