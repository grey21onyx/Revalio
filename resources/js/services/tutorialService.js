import axios from 'axios';

// Base API URL - gunakan URL relatif untuk keamanan
const API_URL = '/api/v1';

// Helper untuk mengambil CSRF token jika diperlukan
const fetchCsrfCookie = async (retries = 1, timeout = 1000) => {
  try {
    await axios.get('/sanctum/csrf-cookie');
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, timeout));
      return fetchCsrfCookie(retries - 1, timeout);
    }
    throw error;
  }
};

/**
 * Service untuk mengelola interaksi dengan API tutorial
 */
const TutorialService = {
  /**
   * Mendapatkan daftar tutorial
   * @param {Object} params Parameter query string (filter, pagination, dll)
   * @returns {Promise} Promise berisi data tutorial
   */
  getTutorials: async (params = {}) => {
    try {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      const token = localStorage.getItem('userToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get(`${API_URL}/tutorials`, { 
        params,
        headers 
      });
      
      if (!response.data) {
        throw new Error('Tidak ada data yang diterima dari API');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      
      // Handle berbagai error dengan lebih spesifik
      if (error.response) {
        // Server memberikan respon dengan status error
        if (error.response.status === 401) {
          console.warn('Unauthorized: Token tidak valid atau tidak ditemukan');
        } else if (error.response.status === 500) {
          console.error('Error server:', error.response.data);
        }
      }
      
      throw error;
    }
  },

  /**
   * Mendapatkan tutorial berdasarkan ID
   * @param {number} id ID tutorial
   * @returns {Promise} Promise berisi data tutorial
   */
  getTutorialById: async (id) => {
    try {
      // Memeriksa apakah ID valid dan bukan undefined
      if (!id) {
        throw new Error('Tutorial ID tidak valid atau undefined');
      }
      
      console.log(`Memanggil API untuk mendapatkan tutorial dengan ID: ${id}`);
      
      // Persiapkan header otentikasi jika tersedia
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      // Tambahkan token otentikasi jika tersedia
      const token = localStorage.getItem('userToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Panggil API dengan header yang sudah diperbaiki
      const response = await axios.get(`${API_URL}/tutorials/${id}`, { headers });
      
      console.log('Respon API berhasil:', response.status);
      
      if (!response.data) {
        throw new Error('Tidak ada data yang diterima dari API');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error saat mengambil tutorial:', error);
      
      // Handle berbagai error dengan lebih spesifik
      if (error.response) {
        // Server memberikan respon dengan status error
        if (error.response.status === 401) {
          console.warn('Unauthorized: Token tidak valid atau tidak ditemukan');
          // Bisa redirect ke halaman login atau memberikan error spesifik
          throw new Error('Anda perlu login untuk melihat detail tutorial ini');
        } else if (error.response.status === 404) {
          console.warn('Tutorial tidak ditemukan dengan ID:', id);
          throw new Error('Tutorial tidak ditemukan');
        } else if (error.response.status === 500) {
          // Log error respons untuk debugging
          console.error('Error server saat mengambil tutorial:', error.response.data);
          
          // Cek apakah ada detail error yang lebih spesifik
          const errorData = error.response.data;
          if (errorData && errorData.error) {
            // Jika ada pesan error spesifik dari backend, tampilkan pesan yang lebih informatif
            throw new Error(`Error server: ${errorData.error}`);
          } else {
            throw new Error('Terjadi kesalahan pada server. Silakan coba lagi nanti');
          }
        }
        
        // Teruskan error response untuk dihandle di component
        throw error;
      } else if (error.request) {
        // Request dibuat tapi tidak ada response dari server
        console.error('Tidak ada respon dari server:', error.request);
        throw new Error('Server tidak merespon. Silakan coba lagi nanti.');
      } else {
        // Ada kesalahan saat mengatur request
        console.error('Error request:', error.message);
        throw error;
      }
    }
  },

  /**
   * Mendapatkan daftar tutorial publik
   * @param {Object} params Parameter query string (filter, pagination, dll)
   * @returns {Promise} Promise berisi data tutorial
   */
  getPublicTutorials: async (params = {}) => {
    try {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      const response = await axios.get(`${API_URL}/public/tutorials`, { 
        params,
        headers 
      });
      
      if (!response.data) {
        throw new Error('Tidak ada data yang diterima dari API');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching public tutorials:', error);
      
      if (error.response) {
        if (error.response.status === 500) {
          console.error('Error server:', error.response.data);
          throw new Error('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
        }
      }
      
      throw error;
    }
  },

  /**
   * Membuat tutorial baru
   * @param {Object} tutorialData Data tutorial
   * @returns {Promise} Promise berisi data tutorial yang baru dibuat
   */
  createTutorial: async (tutorialData) => {
    try {
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      };
      
      const token = localStorage.getItem('userToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.post(`${API_URL}/tutorials`, tutorialData, { headers });
      return response.data;
    } catch (error) {
      console.error('Error creating tutorial:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Silakan login terlebih dahulu untuk membuat tutorial');
        } else if (error.response.status === 422) {
          const validationErrors = error.response.data?.errors ? Object.values(error.response.data.errors).flat().join(', ') : 'Data tidak valid';
          throw new Error(`Validasi gagal: ${validationErrors}`);
        } else if (error.response.status === 500) {
          throw new Error('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
        }
      }
      
      throw error;
    }
  },

  /**
   * Toggle status tutorial sebagai telah diselesaikan
   * @param {number} id ID tutorial
   * @returns {Promise} Promise berisi status operasi
   */
  toggleCompleted: async (id) => {
    try {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      const token = localStorage.getItem('userToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.post(`${API_URL}/tutorials/${id}/toggle-completed`, {}, { headers });
      return response.data;
    } catch (error) {
      console.error('Error toggling completed status:', error);
      
      if (error.response && error.response.status === 401) {
        throw new Error('Silakan login terlebih dahulu untuk menandai tutorial sebagai selesai');
      }
      
      throw error;
    }
  },

  /**
   * Toggle status tutorial sebagai disimpan
   * @param {number} id ID tutorial
   * @returns {Promise} Promise berisi status operasi
   */
  toggleSaved: async (id) => {
    try {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      const token = localStorage.getItem('userToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.post(`${API_URL}/tutorials/${id}/toggle-saved`, {}, { headers });
      return response.data;
    } catch (error) {
      console.error('Error toggling saved status:', error);
      
      if (error.response && error.response.status === 401) {
        throw new Error('Silakan login terlebih dahulu untuk menyimpan tutorial');
      }
      
      throw error;
    }
  },

  /**
   * Memberi rating pada tutorial
   * @param {number} id ID tutorial
   * @param {number} rating Nilai rating (1-5)
   * @returns {Promise} Promise berisi data hasil rating
   */
  rateTutorial: async (id, rating) => {
    try {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      const token = localStorage.getItem('userToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.post(`${API_URL}/tutorials/${id}/rate`, { rating }, { headers });
      return response.data;
    } catch (error) {
      console.error('Error rating tutorial:', error);
      
      if (error.response && error.response.status === 401) {
        throw new Error('Silakan login terlebih dahulu untuk memberikan rating');
      }
      
      throw error;
    }
  },

  /**
   * Menambahkan komentar pada tutorial
   * @param {number} id ID tutorial
   * @param {string} content Isi komentar
   * @param {number} rating Rating (opsional)
   * @returns {Promise} Promise berisi data komentar yang baru dibuat
   */
  addComment: async (id, content, rating = null) => {
    try {
      const data = { content };
      if (rating) data.rating = rating;
      
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      const token = localStorage.getItem('userToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.post(`${API_URL}/tutorials/${id}/comments`, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      
      if (error.response && error.response.status === 401) {
        throw new Error('Silakan login terlebih dahulu untuk menambahkan komentar');
      } else if (error.response && error.response.status === 422) {
        throw new Error('Komentar tidak valid. Pastikan komentar tidak kosong dan rating valid.');
      }
      
      throw error;
    }
  },

  /**
   * Mendapatkan daftar komentar pada tutorial
   * @param {number} id ID tutorial
   * @param {Object} params Parameter query string (pagination, dll)
   * @returns {Promise} Promise berisi data komentar
   */
  getComments: async (id, params = {}) => {
    try {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      const token = localStorage.getItem('userToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get(`${API_URL}/tutorials/${id}/comments`, { 
        params,
        headers 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }
};

export default TutorialService;