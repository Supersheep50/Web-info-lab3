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
        const result = await fetch('http://localhost:3001/songs', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: songName,
                release_year: songYear,
                album_id: selectedAlbumId  
            })   
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
            setSongs(data);
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
        if(!selectedSong) return;
        const result = await fetch(`http://localhost:3001/songs/${selectedSong.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: songName}),
        });
        const data = await result.json();
        setResponseData(data.message);
        fetchSongs();
        setSelectedSong(null);
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
            <input type = "text" placeholder = "Song name" value = {songName} onChange = {(e) => setSongName(e.target.value)} placeholder = 'Enter song name'/>

              
                        {/* Album dropdown */}
            <label>Pick an Album:</label>
            <select value={albumId} onChange={(e) => setAlbumId(e.target.value)}>
                <option value="">Select an album</option>
                {albums.map((album) => (
                    <option key={album.id} value={album.id}>{album.name}</option>
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
            <p><strong>Release Year:</strong> {song.release_year}</p>
            <p><strong>Album:</strong> {song.album_name ? song.album_name : "No album"}</p>
            <p><strong>Artist:</strong> {song.artist_name ? song.artist_name : "Unknown artist"}</p>

            <button onClick={() => setSelectedSong(song)}>Edit</button>
            <button onClick={() => handleDeleteSong(song.id)}>Delete</button>
        </div>
    ))}
</div>

        </div>
    );
}

export default Songs;