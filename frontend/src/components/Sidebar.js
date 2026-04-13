import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-item">
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </NavLink>
        
        <NavLink to="/colis" className="nav-item">
          <span className="nav-icon">📦</span>
          <span className="nav-text">Gestion Colis</span>
        </NavLink>
        
        <NavLink to="/colis/new" className="nav-item">
          <span className="nav-icon">➕</span>
          <span className="nav-text">Nouveau Colis</span>
        </NavLink>
        
        <NavLink to="/profile" className="nav-item">
          <span className="nav-icon">👤</span>
          <span className="nav-text">Profil</span>
        </NavLink>

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="nav-divider">
              <span className="divider-text">Administration</span>
            </div>
            
            <NavLink to="/admin/dashboard" className="nav-item admin-item">
              <span className="nav-icon">🛠️</span>
              <span className="nav-text">Admin Dashboard</span>
            </NavLink>
            
            <NavLink to="/admin/users" className="nav-item admin-item">
              <span className="nav-icon">👥</span>
              <span className="nav-text">Gestion Utilisateurs</span>
            </NavLink>
            
            <NavLink to="/admin/system" className="nav-item admin-item">
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Système</span>
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
