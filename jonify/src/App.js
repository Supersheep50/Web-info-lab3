import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Artist from './pages/Artist/artist';


function App() {  

  return (

    <Router>
      <nav>
        <Link to = "/">Home</Link> | <Link to = "/artists">Artists</Link>
      </nav>

      <Routes>
        <Route path = "/" element = {<h1>Home page</h1>} />
        <Route path = "/artists" element = {<Artist />} />
        </Routes>
        </Router>
  );
}

export default App; 