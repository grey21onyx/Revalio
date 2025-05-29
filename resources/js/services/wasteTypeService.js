import axios from 'axios';

// Base URL untuk API
const API_URL = '/api/v1';

/**
 * Service untuk mengelola interaksi dengan API jenis sampah
 */
const WasteTypeService = {
  /**
   * Mendapatkan daftar jenis sampah
   * @param {Object} params Parameter query string (filter, pagination, dll)
   * @returns {Promise} Promise berisi data jenis sampah
   */
  getWasteTypes: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/waste-types`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mendapatkan daftar jenis sampah publik
   * @param {Object} params Parameter query string (filter, pagination, dll)
   * @returns {Promise} Promise berisi data jenis sampah
   */
  getPublicWasteTypes: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/public/waste-types`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mendapatkan jenis sampah berdasarkan ID
   * @param {number} id ID jenis sampah
   * @returns {Promise} Promise berisi data jenis sampah
   */
  getWasteTypeById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/waste-types/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mendapatkan detail jenis sampah publik
   * @param {number} id ID jenis sampah
   * @returns {Promise} Promise berisi data jenis sampah
   */
  getPublicWasteTypeDetail: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/public/waste-types/${id}/detail`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mendapatkan tutorial terkait jenis sampah
   * @param {number} id ID jenis sampah
   * @param {Object} params Parameter query string (filter, pagination, dll)
   * @returns {Promise} Promise berisi data tutorial
   */
  getRelatedTutorials: async (id, params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/public/waste-types/${id}/tutorials`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mendapatkan pengepul potensial untuk jenis sampah
   * @param {number} id ID jenis sampah
   * @param {Object} params Parameter query string (filter, pagination, dll)
   * @returns {Promise} Promise berisi data pengepul
   */
  getPotentialBuyers: async (id, params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/public/waste-types/${id}/buyers`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Toggle favorit jenis sampah
   * @param {number} id ID jenis sampah
   * @returns {Promise} Promise berisi status operasi
   */
  toggleFavorite: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/favorites/waste-types/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mendapatkan daftar jenis sampah favorit user
   * @param {Object} params Parameter query string (pagination, dll)
   * @returns {Promise} Promise berisi data jenis sampah favorit
   */
  getUserFavorites: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/favorites/waste-types`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default WasteTypeService; 