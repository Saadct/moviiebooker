import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MoviesList from './pages/movies/MoviesList.jsx';
import LoginPage from './pages/login/LoginPage.jsx';
import Navbar from './components/Navbar.jsx';
import NavbarLogin from './components/NavbarLogin.jsx';
import ReservationsPage from './pages/reservations/ReservationsPage.jsx';

function App() {
  const token = localStorage.getItem('token'); // Vérifie si l'utilisateur est connecté

  return (
    
    <Router>
       {token ? <NavbarLogin /> : <Navbar />}

      <Routes>
        <Route path="/" element={<MoviesList/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/reservations" element={<ReservationsPage/>} />

      </Routes>
    </Router>
  );
}

export default App;
