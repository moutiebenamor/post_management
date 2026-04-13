import api from './api';

export const colisService = {
  async getColis(page = 1, limit = 10) {
    try {
      const response = await api.get(`/colis?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de récupération des colis');
    }
  },

  async getColisById(id) {
    try {
      const response = await api.get(`/colis/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de récupération du colis');
    }
  },

  async getColisByTracking(trackingNumber) {
    try {
      const response = await api.get(`/colis/track/${trackingNumber}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Colis non trouvé');
    }
  },

  async createColis(colisData) {
    try {
      const response = await api.post('/colis', colisData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de création du colis');
    }
  },

  async updateColis(id, colisData) {
    try {
      const response = await api.put(`/colis/${id}`, colisData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de mise à jour du colis');
    }
  },

  async deleteColis(id) {
    try {
      const response = await api.delete(`/colis/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de suppression du colis');
    }
  }
};
