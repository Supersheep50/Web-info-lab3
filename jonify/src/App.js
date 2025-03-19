import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Artist from './pages/Artist/artist';
import Albums from './pages/Albums/albums';
import Songs from './pages/Songs/songs';
import './styles.css';

function Home() {
  return (
    <div className="home-container">
      <img src="/jonifyLogo.webp" alt="Jonify Logo" className="logo" />
    </div>
  );
}

function App() {  
  return (
    <Router>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/artists">Artists</Link>
          <Link to="/albums">Albums</Link>
          <Link to="/songs">Songs</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artist />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/songs" element={<Songs />} />
      </Routes>
    </Router>
  );
}

export default App;
