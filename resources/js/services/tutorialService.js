import axios from 'axios';

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
      const response = await axios.get(`${API_URL}/tutorials/${id}`);
      return response.data;
    } catch (error) {
      throw error;
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