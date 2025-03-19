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
    connection.query('SELECT * FROM songs WHERE name = ?', [name], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching song' });
        res.status(200).json(results);
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
    const { name, release_date, genre } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE songs SET name = ?, release_date = ?, genre = ? WHERE id = ?';
    connection.query(sql, [name, release_date, genre, id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error updating song' });
        res.status(200).json({ message: 'Song updated' });
    });
};

exports.deleteSong = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM songs WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ err: err.message });
        res.json({ message: 'Song deleted' });
    });
};
