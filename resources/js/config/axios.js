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

// Fungsi khusus untuk mendapatkan CSRF cookie
export const fetchCsrfCookie = async (retries = 3, timeout = 30000) => {
  const csrfInstance = axios.create({
    baseURL: '/', // URL dasar ke root karena sanctum/csrf-cookie bukan di /api
    timeout: timeout, // Timeout lebih lama untuk permintaan ini
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`Attempting to fetch CSRF cookie (attempt ${attempt + 1}/${retries})...`);
      const response = await csrfInstance.get('/sanctum/csrf-cookie');
      console.log('CSRF cookie fetched successfully.');
      return response;
    } catch (error) {
      console.warn(`Attempt ${attempt + 1} failed:`, error.message);
      lastError = error;
      
      // Jika bukan error timeout dan bukan network error, break loop
      if (error.code !== 'ECONNABORTED' && !error.message.includes('Network Error')) {
        break;
      }
      
      // Tunggu sejenak sebelum mencoba lagi (backoff exponential)
      if (attempt < retries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s, etc.
        console.log(`Waiting ${delay}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Semua percobaan gagal
  console.error(`Failed to fetch CSRF cookie after ${retries} attempts:`, lastError);
  throw lastError;
};

// Cek apakah CSRF cookie ada dan valid
const hasCsrfToken = () => {
  // Cek meta tag
  const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (metaToken) return true;
  
  // Cek cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  
  const xsrfCookie = getCookie('XSRF-TOKEN');
  return !!xsrfCookie;
};

// Interceptor untuk menambahkan token otentikasi dan CSRF token ke semua request
instance.interceptors.request.use(
  async (config) => {
    // Tambahkan auth token jika tersedia
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Tambahkan CSRF token untuk request non-GET
    if (config.method !== 'get') {
      // Jika tidak ada CSRF token dan ini bukan request ke csrf-cookie endpoint
      // Maka ambil CSRF token terlebih dahulu
      if (!hasCsrfToken() && !config.url.includes('/sanctum/csrf-cookie')) {
        try {
          console.log('No CSRF token found. Fetching new token before request...');
          await fetchCsrfCookie();
          console.log('Successfully fetched CSRF token before request');
        } catch (err) {
          console.error('Failed to fetch CSRF token before request:', err);
        }
      }
      
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
  async (error) => {
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
    
    // Handle 419 untuk CSRF token mismatch
    if (error.response && (error.response.status === 419 || 
        (error.response.status === 403 && 
         error.response.data?.message?.includes('CSRF')))) {
      console.log('CSRF token mismatch detected (status 419/403), refreshing CSRF token');
      
      // Coba refresh CSRF token dan coba lagi request
      try {
        await fetchCsrfCookie(3, 30000); // 3 percobaan dengan timeout 30 detik
        console.log('CSRF token refreshed, retrying original request');
        
        // Buat konfigurasi baru tanpa interceptor untuk menghindari loop
        const originalRequest = error.config;
        
        // Ambil CSRF token baru
        const getCookie = (name) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
        };
        
        const xsrfCookie = getCookie('XSRF-TOKEN');
        if (xsrfCookie) {
          const csrfToken = decodeURIComponent(xsrfCookie);
          originalRequest.headers['X-CSRF-TOKEN'] = csrfToken;
          originalRequest.headers['X-XSRF-TOKEN'] = csrfToken;
        }
        
        // Retry request dengan token baru
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh CSRF token:', refreshError);
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance; 