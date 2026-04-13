import api from './api';

export const adminService = {
  // Dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de récupération des statistiques');
    }
  },

  // User management
  async getUsers(page = 1, limit = 10, search = '', role = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(role && { role })
      });
      
      const response = await api.get(`/admin/users?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de récupération des utilisateurs');
    }
  },

  async updateUserRole(userId, role) {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de mise à jour du rôle');
    }
  },

  async deleteUser(userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de suppression de l\'utilisateur');
    }
  },

  // System information
  async getSystemInfo() {
    try {
      const response = await api.get('/admin/system/info');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de récupération des informations système');
    }
  }
};
