import React, {useState, useEffect} from 'react';

const Albums = () => {
    const [albumName, setAlbumName] = useState('');
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [responseData, setResponseData] = useState('');

    // create an album / post request

    const handleCreateAlbum = async () => {
        const result = await fetch('http://localhost:3001/albums', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: albumName})   
        });

        const dataq = await result.json();
        setResponseData(dataq.message);
        fetchAlbums();

    };

    // function to retrieve albums (GET request)

    const fetchAlbums = async () => {
        const result = await fetch('http://localhost:3001/albums');
        const data = await result.json();
        setAlbums(data);
    };

    // function to update an album (PUT request)
    const handleUpdateAlbum = async () => {
        if(!selectedAlbum) return;
        const result = await fetch(`http://localhost:3001/albums/${selectedAlbum.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: albumName}),
        });
        const data = await result.json();
        setResponseData(data.message);
        fetchAlbums();
        setSelectedAlbum(null);
    };

    // function to delete an album (DELETE request)

    const handleDeleteAlbum = async (id) => {
        const result = await fetch(`http://localhost:3001/albums/${id}`, {
            method: 'DELETE',
        });
        const data = await result.json();
        setResponseData(data.message);
        fetchAlbums();
    };

    // fetch albums when the page loads

    useEffect(() => {
        fetchAlbums();
    }   , []);

    return (
        <div>
        <h1>Albums</h1>

        {/* input feild for album name */}

        <input type = "text" value = {albumName} onChange = {(e) => setAlbumName(e.target.value)} placeholder='Enter Album name'/>

        {/* crud buttons */}

        <button onClick = {handleCreateAlbum}>Create Album</button>
        {selectedAlbum && <button onClick = {handleUpdateAlbum}>Update Album</button>}
        <button onClick = {fetchAlbums}>Fetch Albums</button>

        {/* display response messages */}

        <div> Response: {responseData} </div>

        {/* list of albums with update and delete buttons */}

        <div>
            {albums.map((album) => (
                <div key = {album.id}>
                    <h3>{album.name}</h3>
                    <button onClick = {() => setSelectedAlbum(album)}>Edit</button>
                    <button onClick = {() => handleDeleteAlbum(album.id)}>Delete</button>
                </div>
            ))}
        </div>
        </div>
        
    );
};

export default Albums;
    