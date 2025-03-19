import React, { useState, useEffect } from 'react';

const Albums = () => {
    const [albumName, setAlbumName] = useState('');
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [responseData, setResponseData] = useState('');
    const [releaseYear, setReleaseYear] = useState('');
    const [artistId, setArtistId] = useState('');
    const [artists, setArtists] = useState([]);

    // Fetch artists for the dropdown
    const fetchArtists = async () => {
        const result = await fetch('http://localhost:3001/artists');
        const data = await result.json();
        setArtists(data);
    };

    // Fetch albums
    const fetchAlbums = async () => {
        if (albumName.trim() !== "") {
            // Fetch a specific album
            const result = await fetch(`http://localhost:3001/albums/search/${albumName}`);
            const data = await result.json();
            setAlbums(data);
        } else {
            // Fetch all albums if no name is entered
            const result = await fetch('http://localhost:3001/albums');
            const data = await result.json();
            setAlbums(data);
        }
    };
    

    // Runs on page load
    useEffect(() => {
        fetchAlbums();
        fetchArtists();
    }, []);

    // Create an album
    const handleCreateAlbum = async () => {
        const result = await fetch('http://localhost:3001/albums', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: albumName,
                artist_id: artistId,
                release_year: releaseYear,
                num_listens: 0,
                songs: []
            })
        });

        const dataq = await result.json();
        setResponseData(dataq.message);
        fetchAlbums();
    };

    // Update an album
    const handleUpdateAlbum = async () => {
        if (!selectedAlbum) return;
        const result = await fetch(`http://localhost:3001/albums/${selectedAlbum.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: albumName }),
        });

        const data = await result.json();
        setResponseData(data.message);
        fetchAlbums();
        setSelectedAlbum(null);
    };

    // Delete an album
    const handleDeleteAlbum = async (id) => {
        const result = await fetch(`http://localhost:3001/albums/${id}`, {
            method: 'DELETE',
        });

        const data = await result.json();
        setResponseData(data.message);
        fetchAlbums();
    };

    return (
        <div>
            <h1>Albums</h1>

            {/* Input fields */}
            <input type="text" value={albumName} onChange={(e) => setAlbumName(e.target.value)} placeholder="Enter Album name" />
            <input type="text" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} placeholder="Enter Release Year" />

            {/* Artist dropdown */}
            <label>Pick an Artist:</label>
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
            <div> Response: {responseData} </div>

            {/* List of albums with edit and delete buttons */}
            <div>
    {albums.map((album) => (
        <div key={album.id}>
            <h3>{album.album_name}</h3>
            <p><strong>Artist:</strong> {album.artist_name}</p>
            <p><strong>Release Year:</strong> {album.release_year}</p>
            <p><strong>Number of Listens:</strong> {album.num_listens}</p>
            <p><strong>Songs:</strong> {album.songs ? album.songs : "No songs"}</p>

            <button onClick={() => setSelectedAlbum(album)}>Edit</button>
            <button onClick={() => handleDeleteAlbum(album.id)}>Delete</button>
        </div>
    ))}
</div>

        </div>
    );
};

export default Albums;
