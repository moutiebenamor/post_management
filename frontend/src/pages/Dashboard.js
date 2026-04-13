import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { statsService } from '../services/statsService';
import { chartOptions, pieChartOptions } from '../charts/ChartSetup';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await statsService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  const statusData = {
    labels: ['En attente', 'En transit', 'En distribution', 'Livré', 'Retourné'],
    datasets: [
      {
        data: [
          stats?.colisByStatus?.en_attente || 0,
          stats?.colisByStatus?.en_transit || 0,
          stats?.colisByStatus?.en_distribution || 0,
          stats?.colisByStatus?.livre || 0,
          stats?.colisByStatus?.retourne || 0,
        ],
        backgroundColor: [
          '#ffc107',
          '#28a745',
          '#17a2b8',
          '#007bff',
          '#dc3545',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const priorityData = {
    labels: ['Normale', 'Express', 'Urgente'],
    datasets: [
      {
        label: 'Nombre de colis',
        data: [
          stats?.colisByPriority?.normale || 0,
          stats?.colisByPriority?.express || 0,
          stats?.colisByPriority?.urgente || 0,
        ],
        backgroundColor: ['#6c757d', '#ffc107', '#dc3545'],
        borderColor: ['#495057', '#e0a800', '#bd2130'],
        borderWidth: 1,
      },
    ],
  };

  const monthlyData = {
    labels: stats?.monthlyStats?.map(stat => 
      `${stat._id.month}/${stat._id.year}`
    ) || [],
    datasets: [
      {
        label: 'Nombre de colis',
        data: stats?.monthlyStats?.map(stat => stat.count) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Revenus (€)',
        data: stats?.monthlyStats?.map(stat => stat.totalRevenue) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Vue d'ensemble de vos colis</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats?.totalColis || 0}</h3>
            <p>Total Colis</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{stats?.totalRevenue?.toFixed(2) || 0}€</h3>
            <p>Revenus Total</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats?.averagePrice?.toFixed(2) || 0}€</h3>
            <p>Prix Moyen</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats?.colisByStatus?.livre || 0}</h3>
            <p>Colis Livrés</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="card-header">
            <h3>Répartition par Statut</h3>
          </div>
          <div className="chart-container">
            <Pie 
              data={statusData} 
              options={{
                ...pieChartOptions,
                plugins: {
                  ...pieChartOptions.plugins,
                  title: {
                    display: false
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3>Répartition par Priorité</h3>
          </div>
          <div className="chart-container">
            <Bar 
              data={priorityData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: false
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="chart-card full-width">
          <div className="card-header">
            <h3>Évolution Mensuelle</h3>
          </div>
          <div className="chart-container">
            <Line 
              data={monthlyData} 
              options={{
                ...lineChartOptions,
                plugins: {
                  ...lineChartOptions.plugins,
                  title: {
                    display: false
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      <div className="recent-colis">
        <div className="card">
          <div className="card-header">
            <h3>Colis Récents</h3>
          </div>
          <div className="card-body">
            {stats?.recentColis?.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Numéro de Suivi</th>
                      <th>Destinataire</th>
                      <th>Statut</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentColis.map((colis) => (
                      <tr key={colis._id}>
                        <td>
                          <strong>{colis.numeroSuivi}</strong>
                        </td>
                        <td>{colis.destinataire.nom}</td>
                        <td>
                          <span className={`status-badge status-${colis.statut}`}>
                            {colis.statut.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          {new Date(colis.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Aucun colis récent</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
