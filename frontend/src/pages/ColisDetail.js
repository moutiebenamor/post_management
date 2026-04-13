import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { colisService } from '../services/colisService';

const ColisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [colis, setColis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchColis();
  }, [id]);

  const fetchColis = async () => {
    try {
      setLoading(true);
      const data = await colisService.getColisById(id);
      setColis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce colis ?')) {
      try {
        await colisService.deleteColis(id);
        navigate('/colis');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
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

  if (!colis) {
    return (
      <div className="alert alert-info">
        Colis non trouvé
      </div>
    );
  }

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

  return (
    <div className="detail-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Détails du Colis</h1>
          <p>Numéro de suivi: <strong>{colis.numeroSuivi}</strong></p>
        </div>
        <div className="header-actions">
          <Link to={`/colis/edit/${colis._id}`} className="btn btn-primary">
            ✏️ Modifier
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            🗑️ Supprimer
          </button>
        </div>
      </div>

      <div className="detail-grid">
        {/* Statut et informations principales */}
        <div className="card">
          <div className="card-header">
            <h3>📊 Informations Générales</h3>
          </div>
          <div className="card-body">
            <div className="info-grid">
              <div className="info-item">
                <label>Statut</label>
                <span className={`status-badge status-${colis.statut}`}>
                  {getStatusBadge(colis.statut)}
                </span>
              </div>
              <div className="info-item">
                <label>Priorité</label>
                <span className={`status-badge priority-${colis.priorite}`}>
                  {colis.priorite.charAt(0).toUpperCase() + colis.priorite.slice(1)}
                </span>
              </div>
              <div className="info-item">
                <label>Prix</label>
                <strong>{colis.prix}€</strong>
              </div>
              <div className="info-item">
                <label>Poids</label>
                <strong>{colis.poids} kg</strong>
              </div>
              <div className="info-item">
                <label>Dimensions</label>
                <strong>
                  {colis.dimensions.longueur} × {colis.dimensions.largeur} × {colis.dimensions.hauteur} cm
                </strong>
              </div>
              <div className="info-item">
                <label>Date d'expédition</label>
                <strong>{new Date(colis.dateExpedition).toLocaleDateString('fr-FR')}</strong>
              </div>
              <div className="info-item">
                <label>Livraison prévue</label>
                <strong>{new Date(colis.dateLivraisonPrevue).toLocaleDateString('fr-FR')}</strong>
              </div>
              {colis.dateLivraisonReelle && (
                <div className="info-item">
                  <label>Livraison réelle</label>
                  <strong>{new Date(colis.dateLivraisonReelle).toLocaleDateString('fr-FR')}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expéditeur */}
        <div className="card">
          <div className="card-header">
            <h3>📤 Expéditeur</h3>
          </div>
          <div className="card-body">
            <div className="contact-info">
              <h4>{colis.expediteur.nom}</h4>
              <p>{colis.expediteur.adresse}</p>
              {colis.expediteur.telephone && (
                <p><strong>Tél:</strong> {colis.expediteur.telephone}</p>
              )}
              {colis.expediteur.email && (
                <p><strong>Email:</strong> {colis.expediteur.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Destinataire */}
        <div className="card">
          <div className="card-header">
            <h3>📥 Destinataire</h3>
          </div>
          <div className="card-body">
            <div className="contact-info">
              <h4>{colis.destinataire.nom}</h4>
              <p>{colis.destinataire.adresse}</p>
              {colis.destinataire.telephone && (
                <p><strong>Tél:</strong> {colis.destinataire.telephone}</p>
              )}
              {colis.destinataire.email && (
                <p><strong>Email:</strong> {colis.destinataire.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card full-width">
          <div className="card-header">
            <h3>📦 Description du Colis</h3>
          </div>
          <div className="card-body">
            <p>{colis.description}</p>
          </div>
        </div>

        {/* Historique */}
        {colis.historique && colis.historique.length > 0 && (
          <div className="card full-width">
            <div className="card-header">
              <h3>📋 Historique de Suivi</h3>
            </div>
            <div className="card-body">
              <div className="timeline">
                {colis.historique.map((event, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className={`status-badge status-${event.statut}`}>
                          {getStatusBadge(event.statut)}
                        </span>
                        <span className="timeline-date">
                          {new Date(event.date).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <div className="timeline-body">
                        <p><strong>Lieu:</strong> {event.lieu}</p>
                        {event.commentaire && (
                          <p><strong>Commentaire:</strong> {event.commentaire}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="back-button">
        <Link to="/colis" className="btn btn-secondary">
          ← Retour à la liste
        </Link>
      </div>
    </div>
  );
};

export default ColisDetail;
