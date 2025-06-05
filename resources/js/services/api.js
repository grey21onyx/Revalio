import axios from 'axios';
import Swal from 'sweetalert2';

const baseURL = '/api/v1';

const apiService = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// IMPROVED: More robust token handling for initialization
function setupAuthToken() {
  const token = localStorage.getItem('userToken');
  if (token) {
    console.log('Setting up auth token on apiService initialization');
    apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return true;
  }
  return false;
}

// Initialize token on service creation
setupAuthToken();

// Add request interceptor for diagnostics and token refresh
apiService.interceptors.request.use(
  config => {
    // Check token before every request - handle case where token was added after service init
    if (!config.headers['Authorization']) {
      setupAuthToken();
    }
    
    // Log outgoing requests only in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 API Request [${config.method?.toUpperCase()}] ${config.url}`, {
        headers: {
          Authorization: config.headers.Authorization ? 
            'Bearer ' + config.headers.Authorization.split(' ')[1]?.substr(0, 10) + '...' : 
            'None',
          'Content-Type': config.headers['Content-Type'],
          'Accept': config.headers['Accept'],
          'X-Requested-With': config.headers['X-Requested-With'] || 'None'
        },
        params: config.params,
        // Don't log full request body for security but indicate presence
        hasData: !!config.data
      });
    }
    return config;
  },
  error => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor with improved authentication error handling
apiService.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      console.error('👤 Authentication error:', error.response.data);
      
      // Check if token exists but is being rejected
      const token = localStorage.getItem('userToken');
      if (token) {
        console.warn('🔑 Authentication failed with existing token. Token might be expired or invalid.');
        console.warn('Token preview:', token.substr(0, 10) + '...' + token.substr(-10));
        
        // Only show one auth error message at a time (prevent multiple dialogs)
        if (!window.authErrorShown) {
          window.authErrorShown = true;
          
          Swal.fire({
            icon: 'warning',
            title: 'Sesi Berakhir',
            text: 'Sesi login Anda telah berakhir. Silakan login ulang.',
            confirmButtonText: 'Login Ulang'
          }).then(result => {
            if (result.isConfirmed) {
              // Clear token and redirect to login
              localStorage.removeItem('userToken');
              window.location.href = '/login';
            }
            window.authErrorShown = false;
          });
        }
      }
    }
    
    // Log all API errors
    console.error('Response error:', error.response?.status, error.response?.data);
    
    return Promise.reject(error);
  }
);

// Function to check authentication status - can be used to verify token is working
export const checkAuthStatus = async () => {
  try {
    // Use the auth-test endpoint we created in routes/api.php
    const response = await apiService.get('/auth-test');
    console.log('Auth check result:', response.data);
    return response.data.is_authenticated;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

export default apiService; 


