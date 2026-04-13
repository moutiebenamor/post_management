import api from './api';

export const statsService = {
  async getDashboardStats() {
    try {
      const response = await api.get('/stats/dashboard');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de récupération des statistiques');
    }
  },

  async getRevenueStats() {
    try {
      const response = await api.get('/stats/revenue');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de récupération des revenus');
    }
  },

  async getDeliveryStats() {
    try {
      const response = await api.get('/stats/delivery');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de récupération des statistiques de livraison');
    }
  }
};
