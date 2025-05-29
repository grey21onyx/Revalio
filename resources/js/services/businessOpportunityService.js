import axios from 'axios';
import api from './api'; // Import instance API yang sudah dikonfigurasi

/**
 * Service untuk mengelola interaksi dengan API peluang usaha
 */
const BusinessOpportunityService = {
  /**
   * Mendapatkan daftar peluang usaha
   * @param {Object} params Parameter query string (filter, pagination, dll)
   * @returns {Promise} Promise berisi data peluang usaha
   */
  getBusinessOpportunities: async (params = {}) => {
    try {
      const response = await api.get(`/business-opportunities`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mendapatkan daftar peluang usaha publik
   * @param {Object} params Parameter query string (filter, pagination, dll)
   * @returns {Promise} Promise berisi data peluang usaha
   */
  getPublicBusinessOpportunities: async (params = {}) => {
    try {
      const response = await api.get(`/public/business-opportunities`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mendapatkan peluang usaha berdasarkan ID
   * @param {number} id ID peluang usaha
   * @returns {Promise} Promise berisi data peluang usaha
   */
  getBusinessOpportunityById: async (id) => {
    try {
      // Menggunakan endpoint publik untuk mendapatkan detail peluang usaha
      const response = await api.get(`/public/business-opportunities/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Toggle status peluang usaha sebagai disimpan
   * @param {number} id ID peluang usaha
   * @returns {Promise} Promise berisi status operasi
   */
  toggleBookmark: async (id) => {
    try {
      const response = await api.post(`/business-opportunities/${id}/bookmark`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Toggle status peluang usaha sebagai selesai
   * @param {number} id ID peluang usaha
   * @returns {Promise} Promise berisi status operasi
   */
  toggleCompleted: async (id) => {
    try {
      const response = await api.post(`/business-opportunities/${id}/complete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mendapatkan PDF peluang usaha
   * @param {number} id ID peluang usaha
   * @returns {Promise} Promise berisi URL PDF
   */
  downloadPDF: async (id) => {
    try {
      const response = await api.get(`/business-opportunities/${id}/pdf`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default BusinessOpportunityService; 