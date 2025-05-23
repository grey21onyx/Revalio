import axios from 'axios';

// Buat instance axios dengan konfigurasi default
const instance = axios.create({
  baseURL: '/api', // URL dasar untuk semua request
  timeout: 15000, // Timeout 15 detik
  withCredentials: true, // Tambahkan ini untuk mengirim cookie
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Interceptor untuk menambahkan token otentikasi ke semua request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      console.log('Attaching auth token to request', config.url);
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor untuk handling error response
instance.interceptors.response.use(
  (response) => {
    // Bisa menambahkan logika tambahan di sini jika perlu
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    // Handle 401 Unauthorized response (token invalid/expired)
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized detected, clearing auth data');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      
      // Redirect ke halaman login jika bukan di halaman login
      if (window.location.pathname !== '/login') {
        console.log('Redirecting to login page');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance; 