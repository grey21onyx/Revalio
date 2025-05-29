import axios from 'axios';
import Swal from 'sweetalert2';

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: '/api/v1',  // Gunakan /api/v1 sesuai dengan route di backend
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Add 30 second timeout
});

// Tambahkan interceptor untuk request
api.interceptors.request.use(
  config => {
    // Coba token dari berbagai sumber yang mungkin
    // Di AuthContext.js, token disimpan sebagai 'userToken'
    let token = localStorage.getItem('userToken');
    
    // Log permintaan untuk debugging
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    
    // Log request body untuk debugging
    if (config.data) {
      console.log('Request body:', JSON.stringify(config.data));
    }
    
    console.log('Authentication:', token ? 'Bearer Token exists' : 'No token');
    
    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      
      // Tambahkan juga header X-XSRF-TOKEN jika ada
      const xsrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='));
      
      if (xsrfToken) {
        const value = xsrfToken.split('=')[1];
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(value);
      }
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Tambahkan interceptor untuk response
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Error handling berdasarkan status code
    const originalRequest = error.config;
    
    // Log error untuk debugging
    console.log('API Error:', error.response?.status, originalRequest.url);
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', originalRequest.url);
      return Promise.reject({
        ...error,
        response: {
          status: 408,
          data: {
            message: 'Request timeout. Server took too long to respond.'
          }
        }
      });
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        ...error,
        response: {
          status: 0,
          data: {
            message: 'Network error. Please check your connection.'
          }
        }
      });
    }
    
    // Error 500 dengan pesan "column not found" - kemungkinan masalah view_count atau tabel yang tidak ada
    if (error.response && 
        error.response.status === 500 && 
        error.response.data?.message && 
        error.response.data.message.includes('Column not found')) {
      console.warn('Database schema error detected, might be missing column or table');
      
      // Jika request adalah GET detail thread, kita bisa mencoba cara alternatif
      if (originalRequest.url.match(/\/forum-threads\/\d+$/) && originalRequest.method === 'get') {
        // Ubah URL untuk mencoba API public jika tersedia
        const threadId = originalRequest.url.split('/').pop();
        return api.get(`/public/forum-threads/${threadId}`);
      }
    }
    
    if (error.response && error.response.status === 401) {
      // Unauthorized - pemeriksaan token tidak valid
      Swal.fire({
        title: 'Sesi Berakhir',
        text: 'Silakan login kembali untuk melanjutkan.',
        icon: 'warning',
        timer: 3000,
        showConfirmButton: false
      });
    } else if (error.response && error.response.status === 403) {
      // Forbidden - tidak memiliki izin
      Swal.fire({
        title: 'Akses Ditolak',
        text: 'Anda tidak memiliki izin untuk melakukan operasi ini.',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false
      });
    } else if (error.response && error.response.status === 422) {
      // Validation error - form tidak valid
      const errors = error.response.data.errors;
      let errorMessage = 'Terdapat kesalahan pada data yang dimasukkan:';
      
      if (errors) {
        Object.keys(errors).forEach(key => {
          errorMessage += `\n- ${errors[key][0]}`;
        });
      }
      
      Swal.fire({
        title: 'Validasi Error',
        text: errorMessage,
        icon: 'error'
      });
    }
    
    return Promise.reject(error);
  }
);

export default api; 