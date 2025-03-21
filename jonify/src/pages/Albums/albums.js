import React, { useState, useEffect } from 'react';

const Albums = () => {
    const [albumName, setAlbumName] = useState('');
    const [releaseYear, setReleaseYear] = useState('');
    const [artistId, setArtistId] = useState('');
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [responseData, setResponseData] = useState('');

    const fetchArtists = async () => {
        const result = await fetch('http://localhost:3001/artists');
        const data = await result.json();
        setArtists(data);
    };

  
    const fetchAlbums = async () => {
        try {
            let url = 'http://localhost:3001/albums';
            if (albumName.trim() !== '') {
                url += `/search/${encodeURIComponent(albumName)}`;
            }
    
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                setResponseData(errorData.message || "An error occurred.");
                setAlbums([]); 
                return;
            }
    
            const data = await response.json();
    
            setAlbums(Array.isArray(data) ? data : [data]);
            setResponseData(""); 
        } catch (error) {
            console.error("Error fetching albums:", error);
            setResponseData("An error occurred while fetching albums.");
            setAlbums([]); 
        }
    };
    

 
    const handleCreateAlbum = async () => {
        const result = await fetch('http://localhost:3001/albums', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: albumName,
                artist_id: artistId,
                release_year: releaseYear,
                monthly_listens: 0,
                songs: []
            })
        });

        const data = await result.json();
        setResponseData(data.message);
        fetchAlbums();
    };

   
    const handleUpdateAlbum = async () => {
        if (!selectedAlbum || !selectedAlbum.id) {
            setResponseData(" No album selected for update.");
            return;
        }
    
        
        const updatedAlbum = {
            name: albumName,
            release_year: releaseYear,
            artist_id: artistId ? artistId : null,
            monthly_listeners: selectedAlbum?.monthly_listeners || 0  
        };
        
    
        try {
            const result = await fetch(`http://localhost:3001/albums/${selectedAlbum.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedAlbum),
            });
    
            const data = await result.json();
            if (!result.ok) throw new Error(data.message || "Error updating album");
    
            setResponseData("Album updated successfully");
            fetchAlbums();
            setSelectedAlbum(null);
        } catch (error) {
            setResponseData(` ${error.message}`);
        }
    };
    

 
    const handleDeleteAlbum = async (id) => {
        const result = await fetch(`http://localhost:3001/albums/${id}`, {
            method: 'DELETE',
        });

        const data = await result.json();
        setResponseData(data.message);
        fetchAlbums();
    };

   
    useEffect(() => {
        fetchAlbums();
        fetchArtists();
    }, []);

    return (
        <div>
            <h1>Albums</h1>

            {/* Input fields */}
            <input type="text" value={albumName} onChange={(e) => setAlbumName(e.target.value)} placeholder="Enter Album name" />
            <input type="text" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} placeholder="Enter Release Year" />

            {/* Artist dropdown */}
            <select value={artistId} onChange={(e) => setArtistId(e.target.value)}>
                <option value="">Select an artist</option>
                {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>{artist.name}</option>
                ))}
            </select>

            {/* CRUD Buttons */}
            <button onClick={handleCreateAlbum}>Create Album</button>
            {selectedAlbum && <button onClick={handleUpdateAlbum}>Update Album</button>}
            <button onClick={fetchAlbums}>Fetch Albums</button>

            {/* Display response messages */}
            <div>Response: {responseData}</div>

            {/* List of albums with edit and delete buttons */}
            <div>
                {albums.map((album) => (
                    <div key={album.id}>
                        <h3>{album.album_name}</h3>
                        <p><strong>Artist:</strong> {album.artist_name}</p>
                        <p><strong>Release Year:</strong> {album.release_year}</p>
                        <p><strong>Monthly Listeners:</strong> {album.monthly_listeners}</p>

                        <p><strong>Songs:</strong> {album.songs ? album.songs : "No songs"}</p>

                        <button onClick={() => {
                            setSelectedAlbum(album);
                            setAlbumName(album.album_name || ""); 
                            setReleaseYear(album.release_year || ""); 
                            setArtistId(album.artist_id || "");
                        }}>Edit</button>

                        <button onClick={() => handleDeleteAlbum(album.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Albums;
