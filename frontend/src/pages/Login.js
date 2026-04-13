import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login, error, clearError } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <div className="auth-header">
          <div className="auth-logo">📦</div>
          <h1>Poste Project</h1>
          <p>Connectez-vous à votre espace personnel</p>
        </div>

        {error && (
          <div className="alert-modern">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          <div className="form-group-modern">
            <label htmlFor="password" className="form-label-modern">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control-modern"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Votre mot de passe"
              autoComplete="current-password"
            />
          </div>

          <div className="auth-buttons-wrapper">
            <button
              type="submit"
              className="btn-modern btn-primary-gradient"
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Connexion Utilisateur'}
            </button>
            
            <button
              type="submit"
              className="btn-modern btn-secondary-modern"
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Connexion Administrateur'}
            </button>
          </div>
        </form>

        <div className="auth-divider">
          <span>Nouveau sur la plateforme ?</span>
        </div>

        <Link to="/register" className="btn-modern btn-outline-modern">
          Créer un compte
        </Link>
      </div>
    </div>
  );
};

export default Login;
