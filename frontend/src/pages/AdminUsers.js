import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    role: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers(
        filters.page,
        filters.limit,
        filters.search,
        filters.role
      );
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
      page: 1
    }));
  };

  const handleRoleFilter = (e) => {
    setFilters(prev => ({
      ...prev,
      role: e.target.value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setActionLoading(true);
      await adminService.updateUserRole(userId, newRole);
      await fetchUsers();
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await adminService.deleteUser(selectedUser._id);
      setShowDeleteModal(false);
      setSelectedUser(null);
      await fetchUsers();
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? '#dc2626' : '#059669';
  };

  const getRoleLabel = (role) => {
    return role === 'admin' ? 'Administrateur' : 'Utilisateur';
  };

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1>👥 Gestion des Utilisateurs</h1>
        <p>Gérez les utilisateurs et leurs permissions</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="search-box">
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou email..."
              value={filters.search}
              onChange={handleSearch}
              className="form-control"
            />
          </div>
          <div className="role-filter">
            <select
              value={filters.role}
              onChange={handleRoleFilter}
              className="form-control"
            >
              <option value="">Tous les rôles</option>
              <option value="user">Utilisateurs</option>
              <option value="admin">Administrateurs</option>
            </select>
          </div>
        </div>
        
        <div className="results-info">
          <span>{pagination.total || 0} utilisateur(s) trouvé(s)</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement des utilisateurs...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <p>Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Date d'inscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.prenom?.[0]}{user.nom?.[0]}
                          </div>
                          <div>
                            <div className="user-name">
                              {user.prenom} {user.nom}
                            </div>
                            {user.telephone && (
                              <div className="user-phone">{user.telephone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span 
                          className="role-badge"
                          style={{ backgroundColor: getRoleColor(user.role) }}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="actions-menu">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="role-select"
                            disabled={actionLoading}
                          >
                            <option value="user">Utilisateur</option>
                            <option value="admin">Administrateur</option>
                          </select>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="btn btn-danger btn-sm"
                            disabled={actionLoading}
                            title="Supprimer l'utilisateur"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="btn btn-secondary"
            >
              Précédent
            </button>
            
            <div className="page-info">
              Page {pagination.page} sur {pagination.pages}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="btn btn-secondary"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
            </div>
            <div className="modal-body">
              <p>
                Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
                <strong>{selectedUser.prenom} {selectedUser.nom}</strong> ?
              </p>
              <p className="warning-text">
                Cette action est irréversible. L'utilisateur ne pourra plus se connecter
                et toutes ses données seront supprimées.
              </p>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="btn btn-secondary"
                disabled={actionLoading}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteUser}
                className="btn btn-danger"
                disabled={actionLoading}
              >
                {actionLoading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
