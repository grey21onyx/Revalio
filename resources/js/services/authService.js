import apiInstance from '../config/axios'; // Menggunakan instance axios kustom

// API_URL tidak lagi diperlukan secara eksplisit di sini karena baseURL sudah ada di instance
// const API_URL = '/api/v1'; 

/**
 * Melakukan registrasi pengguna baru.
 * @param {object} userData - Data pengguna untuk registrasi.
 * @param {string} userData.nama_lengkap - Nama lengkap pengguna.
 * @param {string} userData.email - Email pengguna.
 * @param {string} userData.password - Password pengguna.
 * @param {string} userData.password_confirmation - Konfirmasi password pengguna.
 * @param {string} [userData.no_telepon] - Nomor telepon pengguna (opsional).
 * @param {string} [userData.alamat] - Alamat pengguna (opsional).
 * @returns {Promise<object>} - Respons dari API.
 */
const register = async (userData) => {
  try {
    // URL disesuaikan menjadi relatif terhadap baseURL instance ('/api')
    const response = await apiInstance.post('/v1/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Registrasi gagal');
  }
};

/**
 * Melakukan login pengguna.
 * @param {object} credentials - Kredensial pengguna.
 * @param {string} credentials.email - Email pengguna.
 * @param {string} credentials.password - Password pengguna.
 * @returns {Promise<object>} - Respons dari API, biasanya berisi token dan data user.
 */
const login = async (credentials) => {
  try {
    // URL disesuaikan
    const response = await apiInstance.post('/v1/login', credentials);
    // Backend mengembalikan 'access_token' dan 'user'
    if (response.data.access_token && response.data.user) {
      localStorage.setItem('userToken', response.data.access_token); // Menggunakan access_token dari backend
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      // Pengaturan header Authorization global tidak lagi diperlukan di sini,
      // karena interceptor pada apiInstance akan menanganinya.
      // axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    }
    return response.data;
  } catch (error) {
    console.error('Error during login:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Login gagal');
  }
};

/**
 * Melakukan logout pengguna.
 * @returns {Promise<void>}
 */
const logout = async () => {
  try {
    // Panggil API logout di backend jika ada endpoint khusus
    // Endpoint logout di backend adalah /api/v1/logout dan memerlukan otentikasi
    await apiInstance.post('/v1/logout'); 
    
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    // Penghapusan header Authorization global tidak lagi diperlukan di sini.
    // delete axios.defaults.headers.common['Authorization'];
  } catch (error) {
    console.error('Error during logout:', error.response ? error.response.data : error.message);
    // Tetap hapus data lokal meskipun logout API gagal, agar user tetap ter-logout di frontend
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    // delete axios.defaults.headers.common['Authorization'];
    // Sebaiknya throw error agar komponen UI bisa menanganinya jika perlu
    // throw error.response ? error.response.data : new Error('Logout gagal'); 
    // Untuk logout, biasanya kita tidak ingin melempar error yang menghentikan proses logout di UI
  }
};

/**
 * Mendapatkan data pengguna saat ini dari localStorage.
 * @returns {object|null} - Data pengguna atau null jika tidak ada.
 */
const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Mendapatkan token pengguna saat ini dari localStorage.
 * @returns {string|null} - Token pengguna atau null jika tidak ada.
 */
const getCurrentToken = () => {
  return localStorage.getItem('userToken');
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getCurrentToken,
}; 