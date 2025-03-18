const connection = require('../config/db');

exports.getAllSongs = (req, res) => {
    connection.query('SELECT * FROM songs', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error getting songs' });
        res.status(200).json(results);
    });
};

exports.createSong = (req, res) => {
    const { name, release_date, genre } = req.body;
    const sql = 'INSERT INTO songs (name, release_date, genre) VALUES (?, ?, ?)';
    connection.query(sql, [name, release_date, genre], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error inserting song' });
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
