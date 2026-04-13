import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>📦 Poste Project</h1>
      </div>
      
      <div className="navbar-user">
        <div className="user-info">
          <span className="user-name">{user?.prenom} {user?.nom}</span>
          <span className="user-role">{user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</span>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
