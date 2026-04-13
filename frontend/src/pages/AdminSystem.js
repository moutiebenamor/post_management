import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import './AdminSystem.css';

const AdminSystem = () => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSystemInfo();
      setSystemInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}j ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
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

  const getActivityIcon = (activity) => {
    if (activity.type === 'colis') {
      return activity.action === 'created' ? '📦' : '✏️';
    }
    return '📊';
  };

  const getActivityColor = (activity) => {
    if (activity.type === 'colis') {
      return activity.action === 'created' ? '#10b981' : '#3b82f6';
    }
    return '#6b7280';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des informations système...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger">
          <h3>Erreur</h3>
          <p>{error}</p>
          <button onClick={fetchSystemInfo} className="btn btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-system">
      <div className="page-header">
        <h1>⚙️ Informations Système</h1>
        <p>Surveillez les performances et l'activité du système</p>
      </div>

      <div className="system-grid">
        {/* Database Stats */}
        <div className="card">
          <div className="card-header">
            <h3>🗄️ Base de Données</h3>
          </div>
          <div className="card-body">
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Utilisateurs</span>
                <span className="stat-value">{systemInfo.database.totalUsers}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Colis</span>
                <span className="stat-value">{systemInfo.database.totalColis}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Collections</span>
                <span className="stat-value">{systemInfo.database.collections.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Server Info */}
        <div className="card">
          <div className="card-header">
            <h3>🖥️ Serveur</h3>
          </div>
          <div className="card-body">
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Node.js</span>
                <span className="stat-value">{systemInfo.server.nodeVersion}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Environnement</span>
                <span className="stat-value environment-badge">
                  {systemInfo.server.environment}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Uptime</span>
                <span className="stat-value">{formatUptime(systemInfo.server.uptime)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="card">
          <div className="card-header">
            <h3>💾 Utilisation Mémoire</h3>
          </div>
          <div className="card-body">
            <div className="memory-stats">
              <div className="memory-item">
                <div className="memory-label">RSS</div>
                <div className="memory-value">
                  {formatBytes(systemInfo.server.memoryUsage.rss)}
                </div>
                <div className="memory-description">Mémoire résidente</div>
              </div>
              <div className="memory-item">
                <div className="memory-label">Heap Used</div>
                <div className="memory-value">
                  {formatBytes(systemInfo.server.memoryUsage.heapUsed)}
                </div>
                <div className="memory-description">Tas utilisé</div>
              </div>
              <div className="memory-item">
                <div className="memory-label">Heap Total</div>
                <div className="memory-value">
                  {formatBytes(systemInfo.server.memoryUsage.heapTotal)}
                </div>
                <div className="memory-description">Tas total</div>
              </div>
              <div className="memory-item">
                <div className="memory-label">External</div>
                <div className="memory-value">
                  {formatBytes(systemInfo.server.memoryUsage.external)}
                </div>
                <div className="memory-description">Mémoire externe</div>
              </div>
            </div>
          </div>
        </div>

        {/* Collections Info */}
        <div className="card">
          <div className="card-header">
            <h3>📚 Collections MongoDB</h3>
          </div>
          <div className="card-body">
            <div className="collections-list">
              {systemInfo.database.collections.map((collection, index) => (
                <div key={index} className="collection-item">
                  <div className="collection-icon">
                    {collection === 'users' ? '👥' : '📦'}
                  </div>
                  <div className="collection-name">{collection}</div>
                  <div className="collection-status">Active</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card activity-card">
        <div className="card-header">
          <h3>📊 Activité Récente</h3>
          <button 
            onClick={fetchSystemInfo}
            className="btn btn-secondary btn-sm"
          >
            🔄 Actualiser
          </button>
        </div>
        <div className="card-body">
          {systemInfo.recentActivity.length === 0 ? (
            <div className="empty-activity">
              <p>Aucune activité récente</p>
            </div>
          ) : (
            <div className="activity-list">
              {systemInfo.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-description">
                      {activity.description}
                    </div>
                    <div className="activity-meta">
                      <span className="activity-user">{activity.user}</span>
                      <span className="activity-time">
                        {formatDate(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div 
                    className="activity-status"
                    style={{ backgroundColor: getActivityColor(activity) }}
                  >
                    {activity.action}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSystem;
