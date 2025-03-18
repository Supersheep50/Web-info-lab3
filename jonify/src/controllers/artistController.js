const connection = require('../config/db');

exports.getAllArtists = (req, res) => {
    connection.query('SELECT * FROM artists', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error getting artists' });
        res.status(200).json(results);
    });
};

exports.createArtist = (req, res) => {
    const { name, monthly_listeners, genre } = req.body;
    const sql = 'INSERT INTO artists (name, monthly_listeners, genre) VALUES (?, ?, ?)';
    connection.query(sql, [name, monthly_listeners, genre], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error inserting artist' });
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
