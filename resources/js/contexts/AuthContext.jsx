import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { fetchCsrfCookie } from '../config/axios';
import api from '../services/api'; // Import API service

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

      // Gunakan api service untuk konsistensi
      const response = await api.get('/user');
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
      // Gunakan api service untuk konsistensi
      const response = await api.get('/profile');
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
      try {
        await fetchCsrfCookie();
        console.log('CSRF token fetched successfully');
      } catch (csrfError) {
        console.error('Failed to fetch CSRF token:', csrfError);
        // Continue anyway - some servers don't require CSRF for API endpoints
      }
      
      console.log('Attempting login with credentials:', { ...credentials, password: '******' });
      
      // Explicitly set headers for authentication request
      const customHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest' // IMPORTANT: Laravel treats requests with this header as AJAX
      };
      
      // Use a direct request to /auth/login to avoid redirect issues
      console.log('Using api service for login with proper Laravel-compatible headers');
      
      const axiosResponse = await api.post('/auth/login', credentials, { headers: customHeaders });
      
      console.log('Login response status:', axiosResponse.status);
      console.log('Login response headers:', axiosResponse.headers);
      console.log('Login response data:', axiosResponse.data);
      
      // Extract data using more flexible path traversal
      let authToken, userInfo;
      
      // Find token in various possible response structures
      if (axiosResponse.data.data?.access_token) {
        authToken = axiosResponse.data.data.access_token;
      } else if (axiosResponse.data.data?.token) {
        authToken = axiosResponse.data.data.token;
      } else if (axiosResponse.data.access_token) {
        authToken = axiosResponse.data.access_token;
      } else if (axiosResponse.data.token) {
        authToken = axiosResponse.data.token;
      }
      
      // Find user info in various possible response structures
      if (axiosResponse.data.data?.user) {
        userInfo = axiosResponse.data.data.user;
      } else if (axiosResponse.data.user) {
        userInfo = axiosResponse.data.user;
      } else if (axiosResponse.data.data && axiosResponse.data.data.id) {
        userInfo = axiosResponse.data.data;
      } else if (axiosResponse.data.id) {
        userInfo = axiosResponse.data;
      }
      
      // Check if token exists
      if (!authToken) {
        console.error('No token found in response:', axiosResponse.data);
        throw new Error('Token tidak ditemukan dalam respons');
      }
      
      console.log('Auth token received:', {
        length: authToken.length,
        preview: `${authToken.substring(0, 10)}...${authToken.substring(authToken.length - 10)}`,
      });
      
      // Make sure user info has a valid ID field
      if (!userInfo || (!userInfo.id && !userInfo.user_id)) {
        console.warn('No complete user info found in response, fetching from /user endpoint');
        
        // Set token temporarily to make the user request
        api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
        try {
          // Fetch user data directly
          const userResponse = await api.get('/user');
          userInfo = userResponse.data.user || userResponse.data;
          console.log('Fetched user data from /user endpoint:', userInfo);
        } catch (userError) {
          console.error('Failed to fetch user data:', userError);
          // Continue with whatever user info we have
        }
      }
      
      // Ensure user object has the id field
      if (userInfo && !userInfo.id && userInfo.user_id) {
        userInfo.id = userInfo.user_id; // Ensure we have an id field
      }
      
      // Final validation of user info
      console.log('User info before saving to localStorage:', {
        id: userInfo?.id,
        user_id: userInfo?.user_id,
        name: userInfo?.name,
        email: userInfo?.email
      });
      
      // Simpan token
      localStorage.setItem('userToken', authToken);
      
      // Configure API service with token for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      // Adding the X-Requested-With header helps Laravel identify AJAX requests
      api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
      
      // Also set it on the global axios instance for consistency
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
      
      // Simpan user data - ensure it has the id field
      localStorage.setItem('userData', JSON.stringify(userInfo));
      
      console.log('Auth data saved to localStorage');
      console.log('User data saved:', userInfo);
      
      // Set state
      setIsAuthenticated(true);
      setUser(userInfo);
      setSuccess('Login berhasil');
      
      // Immediately fetch the user profile to verify authentication and get complete user data
      try {
        console.log('Fetching user profile to verify authentication...');
        const profileResponse = await api.get('/user');
        console.log('User profile verification result:', profileResponse.data);
        
        const profileData = profileResponse.data.user || profileResponse.data;
        
        // Update user info with the most accurate data from the profile endpoint
        if (profileData && profileData.id) {
          // Update user state and localStorage with the most accurate data
          setUser(profileData);
          localStorage.setItem('userData', JSON.stringify(profileData));
          console.log('User data updated with profile information:', profileData);
          
          // Use this updated info for the return value
          userInfo = profileData;
        }
      } catch (profileError) {
        console.error('Failed to verify authentication with profile:', profileError);
        // Continue anyway - the login was successful
      }
      
      // Return user data untuk digunakan oleh komponen Login
      return userInfo;
    } catch (err) {
      console.error('Login error:', err);
      
      // Tambahkan logging yang lebih detail untuk error
      if (err.response) {
        console.error('Response error data:', err.response.data);
        console.error('Response error status:', err.response.status);
        console.error('Response error headers:', err.response.headers);
        
        // Panduan troubleshooting khusus untuk error 405 Method Not Allowed
        if (err.response.status === 405) {
          console.error('HTTP 405 Method Not Allowed detected. Kemungkinan masalah:');
          console.error('1. Route definition mismatch: Periksa routes/api.php');
          console.error('2. CSRF protection: Periksa VerifyCsrfToken middleware');
          console.error('3. Cross-Origin issues: Periksa CORS setting');
          console.error('Full error message:', err.response.data.message);
        }
      } else if (err.request) {
        console.error('Request was made but no response was received:', err.request);
      } else {
        console.error('Error during request setup:', err.message);
      }
      
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
      // Gunakan API service untuk konsistensi dengan login
      console.log('Using api service for registration');
      
      // Gunakan api.post alih-alih axios.post
      const response = await api.post('/register', userData);
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
      // Gunakan api service untuk konsistensi
      await api.post('/logout');
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