import React, {useState, useEffect} from 'react';


const Songs = () => {
    const [songName, setSongName] = useState('');
    const [songs, setSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [responseData, setResponseData] = useState('');

    // create a song / post request

    const handleCreateSong = async () => {
        const result = await fetch('http://localhost:3001/songs', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: songName,
                release_year: songYear,
                album_id: selectedAlbumId  // Ensure you have this value
            })   
        });

        const dataq = await result.json();
        setResponseData(dataq.message);
        fetchSongs();
    };

    // function to retrieve artists (GET Request)

    const fetchSongs = async () => {
        const result = await fetch('http://localhost:3001/songs');
        const data = await result.json();
        setSongs(data);
    }; 

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

            {/* crud buttons */}

            <button onClick = {handleCreateSong}>Create Song</button>
            {selectedSong && <button onClick = {handleUpdateSong}>Update Song</button>}
            <button onClick = {fetchSongs}>Fetch Songs</button>
                
                {/* display response songs */}
                <div>Response: {responseData}</div>

                {/* display list of songs with update and delete buttons */}

                <div>

                    {songs.map((song) => (
                        <div key = {song.id}>
                            <div>{song.name}</div>
                            <button onClick = {() => setSelectedSong(song)}>Edit</button>
                            <button onClick = {() => handleDeleteSong(song.id)}>Delete</button>
                        </div>
                    ))}
                </div>
        </div>
    );
}

export default Songs;