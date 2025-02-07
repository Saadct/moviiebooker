// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Ajoute le CSS pour la navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/" className="navbar-item">Accueil</Link></li>
        <li><Link to="/login" className="navbar-item">Se connecter</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
