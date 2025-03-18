import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Artist from './pages/Artist/artist';
import Albums from './pages/Albums/albums';
import Songs from './pages/Songs/songs';


function App() {  

  return (

    <Router>
      <nav>
        <Link to = "/">Home</Link> | <Link to = "/artists">Artists</Link> | <Link to = "/albums">Albums</Link> | <Link to = "/songs">Songs</Link>
        
      </nav>

      <Routes>
        <Route path = "/" element = {<h1>Home page</h1>} />
        <Route path = "/artists" element = {<Artist />} />
        <Route path = "/albums" element = {<Albums />} />
        <Route path = "/songs" element = {<Songs />} />
        </Routes>
        </Router>
  );
}

export default App; 