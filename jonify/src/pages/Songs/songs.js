import React, {useState, useEffect} from 'react';


const Songs = () => {
    const [songName, setSongName] = useState('');
    const [songs, setSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [responseData, setResponseData] = useState('');
    const [albums, setAlbums] = useState([]);
    const [albumId, setAlbumId] = useState('');
    const [songYear, setSongYear] = useState('');
    const [selectedAlbumId, setSelectedAlbumId] = useState('');



    // create a song / post request

    const handleCreateSong = async () => {
        if (!songName || !songYear || !selectedAlbumId) {
            setResponseData("❌ Missing required fields");
            console.error("Error: Missing required fields", { songName, songYear, selectedAlbumId });
            return;
        }
    
        const payload = {
            name: songName,
            release_year: songYear,
            album_id: selectedAlbumId
        };
    
        console.log("Creating Song with:", JSON.stringify(payload, null, 2));
    
        const result = await fetch('http://localhost:3001/songs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    
        const dataq = await result.json();
        setResponseData(dataq.message);
        fetchSongs();
    };
    
    
    
    

    // function to retrieve artists (GET Request)

    const fetchSongs = async () => {
        if (songName.trim() !== "") {
            // Fetch a specific song
            const result = await fetch(`http://localhost:3001/songs/search/${songName}`);
            const data = await result.json();
            
            // Ensure data is an array to prevent .map() errors
            setSongs(Array.isArray(data) ? data : [data]);
        } else {
            // Fetch all songs if no name is entered
            const result = await fetch('http://localhost:3001/songs');
            const data = await result.json();
            setSongs(data);
        }
    };
    
    
    
    

    useEffect(() => {
        const fetchAlbums = async () => {
            const response = await fetch('http://localhost:3001/albums');
            const data = await response.json();
            setAlbums(data);
        };
        fetchAlbums();
    }, []);
    

    // function to update a song (PUT request)

    const handleUpdateSong = async () => {
        if (!selectedSong) return;
    
        const updatedSong = {
            name: songName,
            release_year: songYear,
            album_id: selectedAlbumId
        };
    
        console.log("Updating Song with:", JSON.stringify(updatedSong, null, 2));
    
        try {
            const result = await fetch(`http://localhost:3001/songs/${selectedSong.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSong),
            });
    
            const data = await result.json();
            if (!result.ok) throw new Error(data.message || "Error updating song");
    
            setResponseData("✅ Song updated successfully");
            fetchSongs();
            setSelectedSong(null);
        } catch (error) {
            setResponseData(`❌ ${error.message}`);
        }
    };
    

    // function to delete a song (DELETE request)

    const handleDeleteSong = async (id) => {
        const result = await fetch(`http://localhost:3001/songs/${id}`, {
            method: 'DELETE',
        });
        const data = await result.json();
        setResponseData(data.message);
        fetchSongs();
    };

    // fetch songs when the page loads

    useEffect(() => {
        fetchSongs();
    }   , []);

    return (

        <div>

        <h1>Songs</h1>

        {/* form to create a song */}
        <input
    type="text"
    placeholder="Enter Song Name"
    value={songName}
    onChange={(e) => setSongName(e.target.value)}
/>

<input
    type="text"
    placeholder="Enter Release Year"
    value={songYear}
    onChange={(e) => setSongYear(e.target.value)}
/>



              
        {/* Album dropdown */}
         <select value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
         <option value="">Select an album</option>
        {albums.map((album) => (
        <option key={album.id} value={album.id}>
        {album.album_name} - {album.artist_name}
        </option>
  ))}
        </select>





            {/* crud buttons */}

            <button onClick = {handleCreateSong}>Create Song</button>
            {selectedSong && <button onClick = {handleUpdateSong}>Update Song</button>}
            <button onClick = {fetchSongs}>Fetch Songs</button>
                
                {/* display response songs */}
                <div>Response: {responseData}</div>

                {/* display list of songs with update and delete buttons */}

                <div>
    {songs.map((song) => (
        <div key={song.id}>
            <h3>{song.song_name}</h3>
            <p><strong>Album:</strong> {song.album_name ? song.album_name : "No album"}</p>
            <p><strong>Artist:</strong> {song.artist_name ? song.artist_name : "Unknown artist"}</p>
            <p><strong>Release Year:</strong> {song.release_year ? song.release_year : "Unknown"}</p>
            
            <button onClick={() => {
    setSelectedSong(song); 
    setSongName(song.song_name || ""); 
    setSongYear(song.release_year || ""); 
    setSelectedAlbumId(song.album_id || "");
}}>
    Edit
</button>

            <button onClick={() => handleDeleteSong(song.id)}>Delete</button>
        </div>
    ))}
</div>


        </div>
    );
}

export default Songs;