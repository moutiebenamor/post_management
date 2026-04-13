import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    adresse: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const { register, error, clearError } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) clearError();
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    
    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
    } catch (err) {
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form register-form">
        <div className="auth-header">
          <div className="auth-logo">📦</div>
          <h1>Poste Project</h1>
          <p>Créez votre compte en quelques secondes</p>
        </div>

        {(error || validationError) && (
          <div className="alert-modern">
            ⚠️ {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group-modern">
            <label htmlFor="role" className="form-label-modern">Type de compte</label>
            <select
              id="role"
              name="role"
              className="form-control-modern"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">Utilisateur Standard</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group-modern" style={{ flex: 1 }}>
              <label htmlFor="prenom" className="form-label-modern">Prénom</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                className="form-control-modern"
                value={formData.prenom}
                onChange={handleChange}
                required
                placeholder="Votre prénom"
              />
            </div>

            <div className="form-group-modern" style={{ flex: 1, marginLeft: '15px' }}>
              <label htmlFor="nom" className="form-label-modern">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                className="form-control-modern"
                value={formData.nom}
                onChange={handleChange}
                required
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div className="form-group-modern">
            <label htmlFor="email" className="form-label-modern">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control-modern"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
            />
          </div>

          <div className="form-row">
            <div className="form-group-modern" style={{ flex: 1 }}>
              <label htmlFor="password" className="form-label-modern">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control-modern"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Mot de passe"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group-modern" style={{ flex: 1, marginLeft: '15px' }}>
              <label htmlFor="confirmPassword" className="form-label-modern">Confirmer</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control-modern"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirmer"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="form-group-modern">
            <label htmlFor="telephone" className="form-label-modern">Téléphone (optionnel)</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              className="form-control-modern"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="Votre numéro de téléphone"
            />
          </div>

          <div className="form-group-modern">
            <label htmlFor="adresse" className="form-label-modern">Adresse (optionnelle)</label>
            <textarea
              id="adresse"
              name="adresse"
              className="form-control-modern"
              rows="2"
              value={formData.adresse}
              onChange={handleChange}
              placeholder="Votre adresse"
              style={{ resize: 'none' }}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn-modern btn-primary-gradient"
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'Créer un compte'}
          </button>
        </form>

        <div className="auth-divider">
          <span>Déjà un compte ?</span>
        </div>

        <Link to="/login" className="btn-modern btn-secondary-modern">
          Se connecter
        </Link>
      </div>
    </div>
  );
};

export default Register;
