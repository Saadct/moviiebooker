import { useEffect, useState } from "react";
import axios from "axios";
import "./MoviesList.css";

const MoviesList = () => {
  const [movies, setMovies] = useState([]); // Films récupérés
  const [searchQuery, setSearchQuery] = useState(""); // Valeur de la recherche
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Films récupérés
  const [totalPages, setTotalPages] = useState(1); // Nombre total de pages
  const [selectedMovie, setSelectedMovie] = useState(null); // Film sélectionné pour réservation
  const [reservationDate, setReservationDate] = useState(""); // Date de la réservation
  const [reservationTime, setReservationTime] = useState(""); // Heure de la réservation
  const [reservationError, setReservationError] = useState(""); // Message d'erreur pour réservation
  const API = import.meta.env.VITE_API_URL;
  const SEARCH_API_URL = `${API}/movies/searchPaginated`; // API de recherche des films

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let response;
        if (searchQuery) {
          response = await axios.get(`${SEARCH_API_URL}?query=${searchQuery}&page=${currentPage}`);
        } else {
          response = await axios.get(`${API}/movies/popularPaginated?page=${currentPage}`);
        }
        
        setMovies(response.data.movies);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
      }
    };
  
    fetchMovies();
  }, [currentPage, searchQuery]);

  const searchMovies = async (query) => {
    if (!query) return; // Si la recherche est vide, on ne fait rien
    try {
      const response = await axios.get(`${SEARCH_API_URL}?query=${query}%20&page=${currentPage}`);
      setMovies(response.data.movies); // Assurez-vous que la structure de la réponse a bien 'movies'
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    searchMovies(event.target.value); // Lancer la recherche dès que l'utilisateur tape
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Fonction de réservation
  const handleReserve = (movie) => {
    console.log("Film sélectionné:", movie); // Ajoute ce log pour vérifier
    setSelectedMovie(movie);
    setReservationDate("");
    setReservationTime("");
    setReservationError("");
  };
  

  const handleSubmitReservation = async () => {
    if (!reservationDate || !reservationTime) {
      setReservationError("Veuillez sélectionner une date et une heure.");
      return;
    }

    const userId = localStorage.getItem("user_id"); // Récupérer l'ID de l'utilisateur

    if (!userId) {
      setReservationError("Vous devez être connecté pour réserver un film.");
      return;
    }

    try {
      const reservationDateTime = `${reservationDate}T${reservationTime}:00.000Z`;

      const response = await axios.post(`${API}/reservations`, {
        userId: userId,
        movieId: selectedMovie.id,
        movieName: selectedMovie.original_title,
        reservationDateTime: reservationDateTime, 
      });

      console.log("Réservation effectuée :", response.data);
      setSelectedMovie(null); // Fermer le formulaire de réservation
      setReservationDate("");
      setReservationTime("");
      alert("Réservation réussie !");
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      setReservationError("Une erreur est survenue lors de la réservation.");
    }
  };

  if (loading) {
    return <p>Chargement des films...</p>;
  }

  return (
    <div className="movies-container">
      <h1>Liste des films</h1>
      <input
        type="text"
        placeholder="Rechercher un film..."
        value={searchQuery}
        onChange={handleSearchChange} // Met à jour la recherche à chaque changement
        className="search-bar"
      />
      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <h2>{movie.title}</h2>
            <h3>{movie.release_date}</h3>
            <p>{movie.overview}</p>
            <button onClick={() => handleReserve(movie)} className="reserve-btn">
              Réserver
            </button>
          </div>
        ))}
      </div>

      {/* Formulaire de réservation uniquement si un film est sélectionné */}
      {selectedMovie && (
        <div className="reservation-form">
          <h3>Réserver le film : {selectedMovie.title}</h3>
          <label>
            Date :
            <input
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
            />
          </label>
          <label>
            Heure :
            <input
              type="time"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
            />
          </label>
          {reservationError && <div className="error-message">{reservationError}</div>}
          <button onClick={handleSubmitReservation}>Confirmer la réservation</button>
          <button onClick={() => setSelectedMovie(null)}>Annuler</button>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1} // Désactiver le bouton "Précédent" sur la première page
        >
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages} // Désactiver le bouton "Suivant" sur la dernière page
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default MoviesList;
