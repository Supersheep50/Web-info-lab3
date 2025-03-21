const connection = require('../config/db');

exports.getAllAlbums = (req, res) => {
    const sql = `
        SELECT albums.id, albums.name AS album_name, albums.release_year, artists.monthly_listeners, 
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
    const sql = `
        SELECT albums.id, albums.name AS album_name, albums.release_year, albums.monthly_listeners, 
               artists.name AS artist_name,
               GROUP_CONCAT(DISTINCT songs.name ORDER BY songs.name ASC) AS songs
        FROM albums
        LEFT JOIN artists ON albums.artist_id = artists.id
        LEFT JOIN songs ON songs.album_id = albums.id
        WHERE albums.name = ?
        GROUP BY albums.id, albums.name, albums.release_year, albums.monthly_listeners, artists.name;
    `;

    connection.query(sql, [name], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching album', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Album not found" });
        }

        // Ensure `songs` is an array (in case of a single result with comma-separated values)
        const album = results[0];
        album.songs = album.songs ? album.songs.split(', ') : [];

        res.status(200).json(album);
    });
};



exports.createAlbum = (req, res) => {
    const { name, artist_id, release_year, monthly_listeners, songs } = req.body;
    if (!name || !artist_id || !release_year) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    
    const sql = 'INSERT INTO albums (name, artist_id, release_year, monthly_listeners) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, artist_id, release_year, monthly_listeners || 0], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error inserting album', error: err });

        res.status(200).json({ message: 'Album inserted' });
    });
};


exports.updateAlbum = (req, res) => {
    const { name, release_year, artist_id, monthly_listeners } = req.body;
    const { id } = req.params;

    const sql = 'UPDATE albums SET name = ?, release_year = ?, artist_id = ?, monthly_listeners = ? WHERE id = ?';

    connection.query(sql, [name, release_year, artist_id, monthly_listeners, id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error updating album', error: err });
        res.status(200).json({ message: 'Album updated successfully' });
    });
};


exports.deleteAlbum = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM albums WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ err: err.message });
        res.json({ message: 'Album deleted' });
    });
};
