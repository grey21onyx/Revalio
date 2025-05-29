import axios from 'axios';
import { fetchCsrfCookie } from '../config/axios';

// Base URL untuk API
const API_URL = '/api/v1';

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
      const response = await axios.get(`${API_URL}/tutorials`, { params });
      return response.data;
    } catch (error) {
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
      
      // Pastikan CSRF token tersedia
      await fetchCsrfCookie(1, 3000);
      
      console.log(`Memanggil API untuk mendapatkan tutorial dengan ID: ${id}`);
      
      // Persiapkan header otentikasi jika tersedia
      const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Debug-Info': 'DetailPanduan-Component'
      };
      
      // Tambahkan token otentikasi jika tersedia
      const token = localStorage.getItem('userToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Panggil API dengan header yang sudah diperbaiki
      const response = await axios.get(`${API_URL}/tutorials/${id}`, { headers });
      
      console.log('Respon API berhasil:', response.status);
      return response.data;
    } catch (error) {
      console.error('Error saat mengambil tutorial:', error);
      
      // Handle berbagai error dengan lebih spesifik
      if (error.response) {
        // Server memberikan respon dengan status error
        if (error.response.status === 401) {
          console.warn('Unauthorized: Token tidak valid atau tidak ditemukan');
          // Bisa redirect ke halaman login atau memberikan error spesifik
        } else if (error.response.status === 404) {
          console.warn('Tutorial tidak ditemukan dengan ID:', id);
        } else if (error.response.status === 500) {
          console.error('Error server saat mengambil tutorial:', error.response.data);
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
      const response = await axios.get(`${API_URL}/public/tutorials`, { params });
      return response.data;
    } catch (error) {
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
      const response = await axios.post(`${API_URL}/tutorials`, tutorialData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
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
      const response = await axios.post(`${API_URL}/tutorials/${id}/rate`, { rating });
      return response.data;
    } catch (error) {
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
      const response = await axios.post(`${API_URL}/tutorials/${id}/complete`);
      return response.data;
    } catch (error) {
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
      const response = await axios.post(`${API_URL}/tutorials/${id}/save`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Menambahkan komentar pada tutorial
   * @param {number} id ID tutorial
   * @param {string} comment Isi komentar
   * @param {number} rating Rating (opsional)
   * @returns {Promise} Promise berisi data komentar yang baru dibuat
   */
  addComment: async (id, comment, rating = null) => {
    try {
      const data = { comment };
      if (rating) data.rating = rating;
      
      const response = await axios.post(`${API_URL}/tutorials/${id}/comments`, data);
      return response.data;
    } catch (error) {
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
      const response = await axios.get(`${API_URL}/tutorials/${id}/comments`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default TutorialService; 