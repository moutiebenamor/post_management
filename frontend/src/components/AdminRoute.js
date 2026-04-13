import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h2>🚫 Accès Refusé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <p>Seuls les administrateurs peuvent accéder à cette section.</p>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-primary"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
