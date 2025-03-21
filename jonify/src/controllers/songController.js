const connection = require('../config/db');

exports.getAllSongs = (req, res) => {
    const sql = `
        SELECT songs.id, songs.name AS song_name, songs.release_year,
               albums.name AS album_name, artists.name AS artist_name
        FROM songs
        LEFT JOIN albums ON songs.album_id = albums.id
        LEFT JOIN artists ON albums.artist_id = artists.id;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ message: "Error retrieving songs", error: err });
        } else {
            res.status(200).json(results);
        }
    });
};


exports.getSongByName = (req, res) => {
    const { name } = req.params;
    const sql = `
        SELECT songs.id, songs.name AS song_name, 
               albums.name AS album_name, albums.release_year,
               artists.name AS artist_name
        FROM songs
        LEFT JOIN albums ON songs.album_id = albums.id
        LEFT JOIN artists ON albums.artist_id = artists.id
        WHERE songs.name = ?
    `;

    connection.query(sql, [name], (err, results) => {
        if (err) {
            console.error("Error fetching song:", err);
            return res.status(500).json({ message: 'Error fetching song', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Song not found" });
        }

        res.status(200).json(results[0]); // Return a single object instead of an array
    });
};




exports.createSong = (req, res) => {
    const { name, release_year, album_id } = req.body;
    if (!name || !release_year || !album_id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const sql = 'INSERT INTO songs (name, release_year, album_id) VALUES (?, ?, ?)';
    connection.query(sql, [name, release_year, album_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error inserting song', error: err });

        res.status(200).json({ message: 'Song inserted' });
    });
};


exports.updateSong = (req, res) => {
    const { name, release_year, album_id } = req.body; 
    const { id } = req.params;

    const sql = 'UPDATE songs SET name = ?, release_year = ?, album_id = ? WHERE id = ?';
    connection.query(sql, [name, release_year, album_id, id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error updating song', error: err });
        res.status(200).json({ message: 'Song updated successfully' });
    });
};


exports.deleteSong = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM songs WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ err: err.message });
        res.json({ message: 'Song deleted' });
    });
};
