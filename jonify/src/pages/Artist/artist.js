import React, {useState, useEffect} from 'react';


const Artist = () => {
    const [artistName, setArtistName] = useState('');
    const [artists, setArtists] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [responseData, setResponseData] = useState('');

    // create an artist / post request

    const handleCreateArtist = async () => {
        const result = await fetch('http://localhost:3001/artists', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: artistName,
                monthly_listeners: 0,  // Default value
                genre: "Unknown"
            })   
        });

        const dataq = await result.json();
        setResponseData(dataq.message);
        fetchArtists();
    };


    // function to retrieve artists (GET request)

    const fetchArtists = async () => {
        let url = 'http://localhost:3001/artists';
        if (artistName.trim() !== '') {
            url += `?name=${encodeURIComponent(artistName)}`;
        }
    
        const result = await fetch(url);
        const data = await result.json();
        setArtists(data);
    };
    
    

    // function to update an artist (PUT request)
    const handleUpdateArtist = async () => {
        if(!selectedArtist) return;
        const result = await fetch(`http://localhost:3001/artists/${selectedArtist.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: artistName}),
        });
        const data = await result.json();
        setResponseData(data.message);
        fetchArtists();
        setSelectedArtist(null);
    };

    // function to delete an artist (DELETE request)

    const handleDeleteArtist = async (id) => {
        const result = await fetch(`http://localhost:3001/artists/${id}`, {
            method: 'DELETE',
        });
        const data = await result.json();
        setResponseData(data.message);
        fetchArtists();
    };

    // fetch artists when the page loads

    useEffect(() => {
        fetchArtists();
    }, []);

    return (

        <div>
            <h1>Artists</h1>

            {/* input field for artist name */}
            <input
                type="text"
                value = {artistName}
                onChange = {(e) => setArtistName(e.target.value)}
                placeholder = "Enter artist name"
            />

            {/* crud buttons */}

            <button onClick = {handleCreateArtist}>Create Artist</button>   
            {selectedArtist && <button onClick = {handleUpdateArtist}>Update Artist</button>}
            <button onClick = {fetchArtists}>Fetch Artists</button>

            {/* display response messages */}
            <div> Response: {responseData} </div>

            {/* list of artists with update and delete buttons */}
            {/* List of artists with details */}
            <div>
    {artists.map((artist) => (
        <div key={artist.id}>
            <h3>{artist.name}</h3>
            <p>Genre: {artist.genre}</p>
            <p>Monthly Listeners: {artist.monthly_listeners}</p>
            
            <p><strong>Albums:</strong> {artist.albums ? artist.albums : "No albums"}</p>
            <p><strong>Songs:</strong> {artist.songs ? artist.songs : "No songs"}</p>
            
            <button onClick={() => setSelectedArtist(artist)}>Edit</button>
            <button onClick={() => handleDeleteArtist(artist.id)}>Delete</button>
        </div>
    ))}
</div>


             </div>
    );
};  
export default Artist; 
