import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // Permet la redirection après une connexion ou inscription réussie
  const API_URL = import.meta.env.VITE_API_URL;
  const API_URL_AUTH_LOGIN = `${API_URL}/auth/login`;
  const API_URL_AUTH_SIGNUP = `${API_URL}/auth/signup`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const response = await axios.post(`${API_URL}${endpoint}`, { email, password });

      localStorage.setItem('token', response.data.access_token); // Stockage du token dans le localStorage
      localStorage.setItem('user_id', response.data.user_id); // Stockage du token dans le localStorage

      // Redirection après connexion ou inscription
      window.location.href = '/'; // Redirige vers la page d'accueil après la déconnexion

    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue'); // Message d'erreur API
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-toggle">
          <button 
            type="button" 
            onClick={() => setIsLogin(true)} 
            className={isLogin ? 'active' : ''}
          >
            Connexion
          </button>
          <button 
            type="button" 
            onClick={() => setIsLogin(false)} 
            className={!isLogin ? 'active' : ''}
          >
            Inscription
          </button>
        </div>

        {error && <div className="error-message">{error}</div>} {/* Affichage de l'erreur */}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          {isLogin ? 'Se connecter' : 'S\'inscrire'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
