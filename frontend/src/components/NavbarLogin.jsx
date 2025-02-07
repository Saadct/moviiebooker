import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Ajoute le CSS pour la navbar

const NavbarLogin = () => {

  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprime le token du localStorage
    window.location.href = '/'; // Redirige vers la page d'accueil après la déconnexion
};

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/" className="navbar-item">Accueil</Link></li>
        <li><Link to="/reservations" className="navbar-item">Mes réservations</Link></li>
        {/* Utilisation d'un bouton pour la déconnexion */}
        <li><button onClick={handleLogout} className="navbar-item">Déconnexion</button></li>
      </ul>
    </nav>
  );
};

export default NavbarLogin;
