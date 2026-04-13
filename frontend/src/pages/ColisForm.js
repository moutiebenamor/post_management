import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { colisService } from '../services/colisService';

const ColisForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    expediteur: {
      nom: '',
      adresse: '',
      telephone: '',
      email: ''
    },
    destinataire: {
      nom: '',
      adresse: '',
      telephone: '',
      email: ''
    },
    description: '',
    poids: '',
    dimensions: {
      longueur: '',
      largeur: '',
      hauteur: ''
    },
    statut: 'en_attente',
    priorite: 'normale',
    prix: '',
    dateLivraisonPrevue: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchColis();
    }
  }, [id, isEdit]);

  const fetchColis = async () => {
    try {
      setLoading(true);
      const colis = await colisService.getColisById(id);
      
      // Format date for input
      const dateLivraisonPrevue = colis.dateLivraisonPrevue 
        ? new Date(colis.dateLivraisonPrevue).toISOString().split('T')[0]
        : '';

      setFormData({
        ...colis,
        dateLivraisonPrevue
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.poids || parseFloat(formData.poids) <= 0) {
        throw new Error('Le poids doit être supérieur à 0');
      }
      if (!formData.prix || parseFloat(formData.prix) <= 0) {
        throw new Error('Le prix doit être supérieur à 0');
      }
      if (!formData.dimensions.longueur || parseFloat(formData.dimensions.longueur) <= 0) {
        throw new Error('La longueur doit être supérieure à 0');
      }
      if (!formData.dimensions.largeur || parseFloat(formData.dimensions.largeur) <= 0) {
        throw new Error('La largeur doit être supérieure à 0');
      }
      if (!formData.dimensions.hauteur || parseFloat(formData.dimensions.hauteur) <= 0) {
        throw new Error('La hauteur doit être supérieure à 0');
      }
      if (!formData.dateLivraisonPrevue) {
        throw new Error('La date de livraison prévue est requise');
      }

      const submitData = {
        ...formData,
        poids: parseFloat(formData.poids),
        prix: parseFloat(formData.prix),
        dimensions: {
          longueur: parseFloat(formData.dimensions.longueur),
          largeur: parseFloat(formData.dimensions.largeur),
          hauteur: parseFloat(formData.dimensions.hauteur)
        },
        dateLivraisonPrevue: new Date(formData.dateLivraisonPrevue)
      };

      if (isEdit) {
        await colisService.updateColis(id, submitData);
      } else {
        await colisService.createColis(submitData);
      }

      navigate('/colis');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="page-header">
        <h1>{isEdit ? 'Modifier le Colis' : 'Nouveau Colis'}</h1>
        <p>{isEdit ? 'Modifiez les informations du colis' : 'Créez un nouveau colis'}</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-sections">
          {/* Expéditeur */}
          <div className="card">
            <div className="card-header">
              <h3>📤 Expéditeur</h3>
            </div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nom *</label>
                  <input
                    type="text"
                    name="expediteur.nom"
                    className="form-control"
                    value={formData.expediteur.nom}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    name="expediteur.telephone"
                    className="form-control"
                    value={formData.expediteur.telephone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Adresse *</label>
                <textarea
                  name="expediteur.adresse"
                  className="form-control"
                  rows="2"
                  value={formData.expediteur.adresse}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="expediteur.email"
                  className="form-control"
                  value={formData.expediteur.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Destinataire */}
          <div className="card">
            <div className="card-header">
              <h3>📥 Destinataire</h3>
            </div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nom *</label>
                  <input
                    type="text"
                    name="destinataire.nom"
                    className="form-control"
                    value={formData.destinataire.nom}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    name="destinataire.telephone"
                    className="form-control"
                    value={formData.destinataire.telephone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Adresse *</label>
                <textarea
                  name="destinataire.adresse"
                  className="form-control"
                  rows="2"
                  value={formData.destinataire.adresse}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="destinataire.email"
                  className="form-control"
                  value={formData.destinataire.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Détails du colis */}
          <div className="card">
            <div className="card-header">
              <h3>📦 Détails du Colis</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Décrivez le contenu du colis..."
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Poids (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    name="poids"
                    className="form-control"
                    value={formData.poids}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Prix (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="prix"
                    className="form-control"
                    value={formData.prix}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dimensions (cm)</label>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      name="dimensions.longueur"
                      className="form-control"
                      placeholder="Longueur"
                      value={formData.dimensions.longueur}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      name="dimensions.largeur"
                      className="form-control"
                      placeholder="Largeur"
                      value={formData.dimensions.largeur}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      name="dimensions.hauteur"
                      className="form-control"
                      placeholder="Hauteur"
                      value={formData.dimensions.hauteur}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Priorité</label>
                  <select
                    name="priorite"
                    className="form-control"
                    value={formData.priorite}
                    onChange={handleChange}
                  >
                    <option value="normale">Normale</option>
                    <option value="express">Express</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                {isEdit && (
                  <div className="form-group">
                    <label className="form-label">Statut</label>
                    <select
                      name="statut"
                      className="form-control"
                      value={formData.statut}
                      onChange={handleChange}
                    >
                      <option value="en_attente">En attente</option>
                      <option value="en_transit">En transit</option>
                      <option value="en_distribution">En distribution</option>
                      <option value="livre">Livré</option>
                      <option value="retourne">Retourné</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Date de livraison prévue *</label>
                <input
                  type="date"
                  name="dateLivraisonPrevue"
                  className="form-control"
                  value={formData.dateLivraisonPrevue}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/colis')}
            className="btn btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer le colis')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ColisForm;