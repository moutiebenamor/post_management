import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { colisService } from '../services/colisService';
import './Colis.css';

const Colis = () => {
  const [colis, setColis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchColis();
  }, [currentPage]);

  const fetchColis = async () => {
    try {
      setLoading(true);
      const data = await colisService.getColis(currentPage, 10);
      setColis(data.colis);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce colis ?')) {
      try {
        await colisService.deleteColis(id);
        fetchColis(); // Refresh the list
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchColis();
      return;
    }

    try {
      setLoading(true);
      const colisFound = await colisService.getColisByTracking(searchTerm.trim());
      setColis([colisFound]);
      setPagination({ page: 1, pages: 1, total: 1 });
    } catch (err) {
      setError(err.message);
      setColis([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statut) => {
    const statusMap = {
      en_attente: 'En attente',
      en_transit: 'En transit',
      en_distribution: 'En distribution',
      livre: 'Livré',
      retourne: 'Retourné'
    };
    return statusMap[statut] || statut;
  };

  const getPriorityBadge = (priorite) => {
    const priorityMap = {
      normale: 'Normale',
      express: 'Express',
      urgente: 'Urgente'
    };
    return priorityMap[priorite] || priorite;
  };

  if (loading && colis.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des colis...</p>
      </div>
    );
  }

  return (
    <div className="colis-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestion des Colis</h1>
          <p>Gérez et suivez tous vos colis</p>
        </div>
        <Link to="/colis/new" className="btn btn-primary">
          ➕ Nouveau Colis
        </Link>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Rechercher par numéro de suivi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control search-input"
          />
          <button type="submit" className="btn btn-primary">
            🔍 Rechercher
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                fetchColis();
              }}
              className="btn btn-secondary"
            >
              Effacer
            </button>
          )}
        </form>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3>Liste des Colis</h3>
          <span className="total-count">
            Total: {pagination.total || 0} colis
          </span>
        </div>
        <div className="card-body">
          {colis.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Numéro de Suivi</th>
                    <th>Destinataire</th>
                    <th>Statut</th>
                    <th>Priorité</th>
                    <th>Prix</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {colis.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.numeroSuivi}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{item.destinataire.nom}</strong>
                          <br />
                          <small className="text-muted">
                            {item.destinataire.adresse.substring(0, 30)}...
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${item.statut}`}>
                          {getStatusBadge(item.statut)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge priority-${item.priorite}`}>
                          {getPriorityBadge(item.priorite)}
                        </span>
                      </td>
                      <td>
                        <strong>{item.prix}€</strong>
                      </td>
                      <td>
                        {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/colis/${item._id}`}
                            className="btn btn-sm btn-info"
                            title="Voir détails"
                          >
                            👁️
                          </Link>
                          <Link
                            to={`/colis/edit/${item._id}`}
                            className="btn btn-sm btn-primary"
                            title="Modifier"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="btn btn-sm btn-danger"
                            title="Supprimer"
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
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>Aucun colis trouvé</h3>
              <p>
                {searchTerm 
                  ? 'Aucun colis ne correspond à votre recherche.'
                  : 'Vous n\'avez pas encore créé de colis.'
                }
              </p>
              {!searchTerm && (
                <Link to="/colis/new" className="btn btn-primary">
                  Créer votre premier colis
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-secondary"
          >
            ← Précédent
          </button>
          
          <span className="page-info">
            Page {currentPage} sur {pagination.pages}
          </span>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.pages}
            className="btn btn-secondary"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
};

export default Colis;
