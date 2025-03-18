const connection = require('../config/db');

exports.getAllAlbums = (req, res) => {
    connection.query('SELECT * FROM albums', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error getting albums' });
        res.status(200).json(results);
    });
};

exports.createAlbum = (req, res) => {
    const { name, release_date, genre } = req.body;
    const sql = 'INSERT INTO albums (name, release_date, genre) VALUES (?, ?, ?)';
    connection.query(sql, [name, release_date, genre], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error inserting album' });
        res.status(200).json({ message: 'Album inserted' });
    });
};

exports.updateAlbum = (req, res) => {
    const { name, release_date, genre } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE albums SET name = ?, release_date = ?, genre = ? WHERE id = ?';
    connection.query(sql, [name, release_date, genre, id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error updating album' });
        res.status(200).json({ message: 'Album updated' });
    });
};

exports.deleteAlbum = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM albums WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ err: err.message });
        res.json({ message: 'Album deleted' });
    });
};
