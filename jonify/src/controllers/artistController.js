const connection = require('../config/db');

exports.getAllArtists = (req, res) => {
    const sql = `
        SELECT artists.id, artists.name, artists.monthly_listeners, artists.genre,
               GROUP_CONCAT(DISTINCT albums.name ORDER BY albums.name ASC) AS albums,
               GROUP_CONCAT(DISTINCT songs.name ORDER BY songs.name ASC) AS songs
        FROM artists
        LEFT JOIN albums ON albums.artist_id = artists.id
        LEFT JOIN songs ON songs.album_id = albums.id
        GROUP BY artists.id;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ message: "Error retrieving artists", error: err });
        } else {
            res.status(200).json(results);
        }
    });
};

exports.getArtistByName = (req, res) => {
    const artistName = req.params.name; 

    const query = `
        SELECT artists.id, artists.name, artists.genre, artists.monthly_listeners,
               GROUP_CONCAT(DISTINCT albums.name ORDER BY albums.name ASC) AS albums,
               GROUP_CONCAT(DISTINCT songs.name ORDER BY songs.name ASC) AS songs
        FROM artists
        LEFT JOIN albums ON albums.artist_id = artists.id
        LEFT JOIN songs ON songs.album_id = albums.id
        WHERE artists.name = ?
        GROUP BY artists.id;
    `;

    connection.query(query, [artistName], (err, results) => {
        if (err) {
            console.error("Error fetching artist:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Artist not found" });
        }

      
        const artist = results[0];
        artist.albums = artist.albums ? artist.albums.split(', ') : [];
        artist.songs = artist.songs ? artist.songs.split(', ') : [];

        res.status(200).json(artist);
    });
};







exports.createArtist = (req, res) => {
    console.log("Received request to create artist:", req.body); 
    const { name, monthly_listeners, genre } = req.body;
    const sql = 'INSERT INTO artists (name, monthly_listeners, genre) VALUES (?, ?, ?)';
    connection.query(sql, [name, monthly_listeners, genre], (err, results) => {
        if (err) {
            console.error("Error inserting artist:", err); 
            return res.status(500).json({ message: 'Error inserting artist', error: err });
        }
        res.status(200).json({ message: 'Artist inserted' });
    });
    
};

exports.updateArtist = (req, res) => {
    const { name, genre, monthly_listeners } = req.body;
    const artistId = req.params.id;

    const sql = `UPDATE artists 
                 SET name = ?, genre = ?, monthly_listeners = ? 
                 WHERE id = ?`;

    connection.query(sql, [name, genre, monthly_listeners, artistId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error updating artist", error: err });
        }
        res.status(200).json({ message: "Artist updated successfully" });
    });
};


exports.deleteArtist = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM artists WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ err: err.message });
        res.json({ message: 'Artist deleted' });
    });
};
