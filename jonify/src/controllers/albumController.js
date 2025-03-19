const connection = require('../config/db');

exports.getAllAlbums = (req, res) => {
    const sql = `
        SELECT albums.id, albums.name AS album_name, albums.release_year, albums.num_listens, 
               artists.name AS artist_name,
               GROUP_CONCAT(DISTINCT songs.name ORDER BY songs.name ASC) AS songs
        FROM albums
        LEFT JOIN artists ON albums.artist_id = artists.id
        LEFT JOIN songs ON songs.album_id = albums.id
        GROUP BY albums.id;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ message: "Error retrieving albums", error: err });
        } else {
            res.status(200).json(results);
        }
    });
};


exports.getAlbumByName = (req, res) => {
    const { name } = req.params;
    connection.query('SELECT * FROM albums WHERE name = ?', [name], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching album' });
        res.status(200).json(results);
    });
};


exports.createAlbum = (req, res) => {
    const { name, artist_id, release_year, num_listens, songs } = req.body;
    if (!name || !artist_id || !release_year) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    
    const sql = 'INSERT INTO albums (name, artist_id, release_year, num_listens) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, artist_id, release_year, num_listens || 0], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error inserting album', error: err });

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
