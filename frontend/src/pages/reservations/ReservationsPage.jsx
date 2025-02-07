import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./ReservationsPage";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const API_URL_RESERVATIONS = `${API_URL}/reservations/`; 

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('user_id');

        if (!token || !user_id) {
          navigate('/login'); 
          return;
        }

        const response = await axios.get(`${API_URL_RESERVATIONS}${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReservations(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors de la récupération des réservations');
      }
    };

    fetchReservations();
  }, [navigate]);

  // Annuler une réservation
  const handleCancelReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        return;
      }

      await axios.delete(`${API_URL_RESERVATIONS}${reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filtrer la réservation annulée de la liste
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.id !== reservationId)
      );
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de l'annulation de la réservation");
    }
  };

  return (
    <div className="reservations-container">
      <h2>Mes Réservations</h2>

      {error && <div className="error-message">{error}</div>}

      {reservations.length === 0 ? (
        <p>Aucune réservation à afficher.</p>
      ) : (
        <ul className="reservations-list">
          {reservations.map((reservation) => (
            <li key={reservation.id} className="reservation-item">
              <div>
                <p><strong>ID :</strong> {reservation.id}</p>
                <p><strong>Nom :</strong> {reservation.movieName}</p>
                <p><strong>Date :</strong> {new Date(reservation.reservationDateTime).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Heure :</strong> {new Date(reservation.reservationDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                <button onClick={() => handleCancelReservation(reservation.id)} className="cancel-btn">
                  Annuler
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationsPage;
