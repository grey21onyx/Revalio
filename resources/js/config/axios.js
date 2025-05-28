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

// Interceptor untuk menambahkan token otentikasi dan CSRF token ke semua request
instance.interceptors.request.use(
  (config) => {
    // Tambahkan auth token jika tersedia
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Tambahkan CSRF token untuk request non-GET
    if (config.method !== 'get') {
      // Fungsi untuk mendapatkan cookie value
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };
      
      // Coba dapatkan token dari meta tag
      let csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      // Jika tidak ada meta tag, coba dapatkan dari cookie XSRF-TOKEN
      if (!csrfToken) {
        const xsrfCookie = getCookie('XSRF-TOKEN');
        if (xsrfCookie) {
          // Cookie XSRF-TOKEN akan di-encode, jadi kita perlu decode
          csrfToken = decodeURIComponent(xsrfCookie);
          
          // Debugging - log token untuk verifikasi (hapus di production)
          console.debug('CSRF token ditemukan di cookie:', csrfToken?.substring(0, 10) + '...');
        }
      }
      
      if (csrfToken) {
        // Pastikan format header yang benar untuk Laravel Sanctum
        config.headers['X-CSRF-TOKEN'] = csrfToken;
        
        // Untuk kompatibilitas dengan middleware VerifyCsrfToken Laravel,
        // tambahkan juga sebagai X-XSRF-TOKEN
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      } else {
        console.warn('No CSRF token found for non-GET request to', config.url);
        
        // Jika token tidak ada dan ini bukan request ke endpoint csrf-cookie,
        // coba ambil token baru di background (tanpa blocking request saat ini)
        if (!config.url.includes('/sanctum/csrf-cookie')) {
          console.debug('Attempting to fetch new CSRF token in background');
          axios.get('/sanctum/csrf-cookie')
            .catch(err => console.error('Failed to fetch CSRF token:', err));
        }
      }
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
    
    // Handle 403 Forbidden karena CSRF
    if (error.response && error.response.status === 403 && 
        error.response.data && error.response.data.message && 
        error.response.data.message.includes('CSRF')) {
      console.log('CSRF token mismatch detected, refreshing CSRF token');
      
      // Refresh CSRF token
      axios.get('/sanctum/csrf-cookie')
        .then(() => {
          console.log('CSRF token refreshed successfully');
        })
        .catch(refreshError => {
          console.error('Failed to refresh CSRF token:', refreshError);
        });
    }
    
    return Promise.reject(error);
  }
);

export default instance; 