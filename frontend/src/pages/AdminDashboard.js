import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
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

  const getStatusColor = (status) => {
    const colors = {
      'en_attente': '#fbbf24',
      'en_transit': '#3b82f6',
      'en_distribution': '#8b5cf6',
      'livre': '#10b981',
      'retourne': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'en_attente': 'En attente',
      'en_transit': 'En transit',
      'en_distribution': 'En distribution',
      'livre': 'Livré',
      'retourne': 'Retourné'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger">
          <h3>Erreur</h3>
          <p>{error}</p>
          <button onClick={fetchDashboardStats} className="btn btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1>🛠️ Tableau de Bord Administrateur</h1>
        <p>Bienvenue, {user?.prenom} {user?.nom}</p>
      </div>

      {/* Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.overview.totalUsers}</h3>
            <p>Utilisateurs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.overview.totalColis}</h3>
            <p>Colis Total</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.overview.totalRevenue)}</h3>
            <p>Chiffre d'Affaires</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.overview.averageOrderValue)}</h3>
            <p>Panier Moyen</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-row">
          {/* Status Distribution */}
          <div className="card">
            <div className="card-header">
              <h3>📈 Répartition par Statut</h3>
            </div>
            <div className="card-body">
              <div className="status-chart">
                {stats.charts.colisByStatus.map((item, index) => (
                  <div key={index} className="status-item">
                    <div className="status-bar">
                      <div
                        className="status-fill"
                        style={{
                          backgroundColor: getStatusColor(item._id),
                          width: `${(item.count / stats.overview.totalColis) * 100}%`
                        }}
                      ></div>
                    </div>
                    <div className="status-info">
                      <span className="status-label">{getStatusLabel(item._id)}</span>
                      <span className="status-count">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Colis */}
          <div className="card">
            <div className="card-header">
              <h3>🕒 Colis Récents</h3>
            </div>
            <div className="card-body">
              <div className="recent-colis">
                {stats.recentColis.slice(0, 8).map((colis) => (
                  <div key={colis._id} className="recent-item">
                    <div className="recent-info">
                      <div className="recent-title">
                        <strong>{colis.numeroSuivi}</strong>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(colis.statut) }}
                        >
                          {getStatusLabel(colis.statut)}
                        </span>
                      </div>
                      <div className="recent-details">
                        <span className="recent-user">
                          {colis.createdBy?.prenom} {colis.createdBy?.nom}
                        </span>
                        <span className="recent-date">
                          {formatDate(colis.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="recent-amount">
                      {formatCurrency(colis.prix)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="dashboard-row">
          {/* Revenue Chart */}
          <div className="card chart-card">
            <div className="card-header">
              <h3>💹 Évolution du Chiffre d'Affaires</h3>
            </div>
            <div className="card-body">
              <div className="simple-chart">
                {stats.charts.revenueByMonth.map((item, index) => (
                  <div key={index} className="chart-bar">
                    <div
                      className="bar-fill"
                      style={{
                        height: `${Math.max(10, (item.revenue / Math.max(...stats.charts.revenueByMonth.map(r => r.revenue))) * 100)}%`
                      }}
                      title={`${item._id.month}/${item._id.year}: ${formatCurrency(item.revenue)}`}
                    ></div>
                    <div className="bar-label">
                      {item._id.month}/{item._id.year.toString().slice(-2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Users Chart */}
          <div className="card chart-card">
            <div className="card-header">
              <h3>👥 Nouveaux Utilisateurs</h3>
            </div>
            <div className="card-body">
              <div className="simple-chart">
                {stats.charts.usersByMonth.map((item, index) => (
                  <div key={index} className="chart-bar">
                    <div
                      className="bar-fill users-bar"
                      style={{
                        height: `${Math.max(10, (item.count / Math.max(...stats.charts.usersByMonth.map(u => u.count))) * 100)}%`
                      }}
                      title={`${item._id.month}/${item._id.year}: ${item.count} utilisateurs`}
                    ></div>
                    <div className="bar-label">
                      {item._id.month}/{item._id.year.toString().slice(-2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
