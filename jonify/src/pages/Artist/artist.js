import React, { useState, useEffect } from 'react';

const Artist = () => {
    const [artistName, setArtistName] = useState('');
    const [genre, setGenre] = useState('');
    const [monthlyListeners, setMonthlyListeners] = useState('');
    const [artists, setArtists] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [responseData, setResponseData] = useState('');

    // Create an artist (POST request)
    const handleCreateArtist = async () => {
        if (!artistName || !genre || !monthlyListeners) {
            setResponseData("Missing required fields");
            console.error("Error: Missing required fields", { artistName, genre, monthlyListeners });
            return;
        }

        const payload = {
            name: artistName,
            genre: genre || "Unknown",
            monthly_listeners: monthlyListeners || 0
        };

        console.log("Creating Artist with:", JSON.stringify(payload, null, 2));

        const result = await fetch('http://localhost:3001/artists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const dataq = await result.json();
        setResponseData(dataq.message);
        fetchArtists();
    };

    // Retrieve artists (GET request)
    const fetchArtists = async () => {
        console.log("Fetching artists...");
        let url = 'http://localhost:3001/artists';
        if (artistName.trim() !== '') {
            url += `/search/${encodeURIComponent(artistName)}`;
        }
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                setResponseData(errorData.message || "An error occurred.");
                setArtists([]); 
                return;
            }
            const data = await response.json();
    
          
            setArtists(Array.isArray(data) ? data : [data]);
    
            setResponseData(""); 
        } catch (error) {
            console.error("Error fetching artist:", error);
            setResponseData("An error occurred while fetching the artist.");
            setArtists([]); 
        }
    };
    

    useEffect(() => {
        console.log("Artists state updated:", artists);
    }, [artists]);

    // Update an artist (PUT request)
    const handleUpdateArtist = async () => {
        if (!selectedArtist) return;
    
        const updatedArtist = {
            name: artistName,
            genre: genre,
            monthly_listeners: monthlyListeners
        };
    
        console.log("Updating Artist with:", JSON.stringify(updatedArtist, null, 2));
    
        const result = await fetch(`http://localhost:3001/artists/${selectedArtist.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedArtist)
        });
    
        const data = await result.json();
        setResponseData(data.message);
        fetchArtists();
        setSelectedArtist(null);  
    };
    
    

    // Delete an artist (DELETE request)
    const handleDeleteArtist = async (id) => {
        const result = await fetch(`http://localhost:3001/artists/${id}`, {
            method: 'DELETE',
        });
        const data = await result.json();
        setResponseData(data.message);
        fetchArtists();
    };

    // Fetch artists when the page loads
    useEffect(() => {
        fetchArtists();
    }, []);

    return (
        <div>
            <h1>Artists</h1>

            {/* Input fields for artist details */}
            <input
  type="text"
  value={artistName}
  onChange={(e) => setArtistName(e.target.value)}
  placeholder="Enter artist name"
/>

<input
  type="text"
  value={genre}
  onChange={(e) => setGenre(e.target.value)}
  placeholder="Enter genre"
/>

<input
  type="number"
  value={monthlyListeners}
  onChange={(e) => setMonthlyListeners(e.target.value)}
  placeholder="Enter monthly listeners"
/>



            {/* CRUD buttons */}
            <button onClick={handleCreateArtist}>Create Artist</button>
            {selectedArtist && <button onClick={handleUpdateArtist}>Update Artist</button>}
            <button onClick={fetchArtists}>Fetch Artists</button>

            {/* Display response messages */}
            <div>Response: {responseData}</div>

            {/* Display list of artists with update and delete buttons */}
            <div>
                {artists.map((artist) => (
                    <div key={artist.id}>
                        <h3>{artist.name}</h3>
                        <p><strong>Genre:</strong> {artist.genre}</p>
                        <p><strong>Monthly Listeners:</strong> {artist.monthly_listeners}</p>
                        <p><strong>Albums:</strong> {artist.albums ? artist.albums : "No albums"}</p>
                        <p><strong>Songs:</strong> {artist.songs ? artist.songs : "No songs"}</p>
                        <button onClick={() => {
    setSelectedArtist(artist); 
    setArtistName(artist.name || ""); 
    setGenre(artist.genre || ""); 
    setMonthlyListeners(artist.monthly_listeners || 0);
}}>
    Edit
</button>

                        <button onClick={() => handleDeleteArtist(artist.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Artist;
