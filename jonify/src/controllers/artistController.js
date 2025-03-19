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




exports.createArtist = (req, res) => {
    console.log("Received request to create artist:", req.body); // Debugging
    const { name, monthly_listeners, genre } = req.body;
    const sql = 'INSERT INTO artists (name, monthly_listeners, genre) VALUES (?, ?, ?)';
    connection.query(sql, [name, monthly_listeners, genre], (err, results) => {
        if (err) {
            console.error("Error inserting artist:", err);  // Log the full error
            return res.status(500).json({ message: 'Error inserting artist', error: err });
        }
        res.status(200).json({ message: 'Artist inserted' });
    });
    
};

exports.updateArtist = (req, res) => {
    const { name, monthly_listeners, genre } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE artists SET name = ?, monthly_listeners = ?, genre = ? WHERE id = ?';
    connection.query(sql, [name, monthly_listeners, genre, id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error updating artist' });
        res.status(200).json({ message: 'Artist updated' });
    });
};

exports.deleteArtist = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM artists WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ err: err.message });
        res.json({ message: 'Artist deleted' });
    });
};
