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
            body: JSON.stringify({name: artistName})   
        });

        const dataq = await result.json();
        setResponseData(dataq.message);
        fetchArtists();
    };


    // function to retrieve artists (GET request)

    const fetchArtists = async () => {
        const result = await fetch('http://localhost:3001/artists');
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
            <div>
                {artists.map((artist) => (
                    <div key = {artist.id}>
                        <p>{artist.name}</p>
                        <button onClick = {() => setSelectedArtist(artist)}>Edit</button>
                        <button onClick = {() => handleDeleteArtist(artist.id)}>Delete</button>
                    </div>
                ))}
                </div>
             </div>
    );
};  
export default Artist; 
