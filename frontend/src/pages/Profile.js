import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Mon Profil</h1>
        <p>Informations de votre compte</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>👤 Informations Personnelles</h3>
        </div>
        <div className="card-body">
          <div className="info-grid">
            <div className="info-item">
              <label>Prénom</label>
              <strong>{user?.prenom}</strong>
            </div>
            <div className="info-item">
              <label>Nom</label>
              <strong>{user?.nom}</strong>
            </div>
            <div className="info-item">
              <label>Email</label>
              <strong>{user?.email}</strong>
            </div>
            <div className="info-item">
              <label>Rôle</label>
              <span className={`status-badge ${user?.role === 'admin' ? 'priority-urgente' : 'priority-normale'}`}>
                {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </span>
            </div>
            {user?.telephone && (
              <div className="info-item">
                <label>Téléphone</label>
                <strong>{user.telephone}</strong>
              </div>
            )}
            {user?.adresse && (
              <div className="info-item full-width">
                <label>Adresse</label>
                <strong>{user.adresse}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>🔒 Sécurité</h3>
        </div>
        <div className="card-body">
          <p>Pour modifier votre mot de passe ou d'autres informations sensibles, contactez l'administrateur.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
