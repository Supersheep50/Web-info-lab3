const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // handling json data from react

// connect to phpadmin db

const connection = mysql.createConnection({

    host: 'webcourse.cs.nuim.ie',
    user: 'p250126',
    password: 'OhV9vohSeequeuya',
    database: 'cs230_p250126'
});

connection.connect(err => {

if(err){
    console.log("Connection failed", err);
} else {
    console.log("Connected to database");
}
});

// insert an artist 

app.post('/artists', (req, res) => {
    const {name, monthly_listeners, genre} = req.body;
    const sql = 'INSERT INTO artists (name, monthly_listeners, genre) VALUES (?, ?, ?)';
    connection.query(sql, [name, monthly_listeners, genre], (err, results) => {
        if(err){
            res.status(500).json({message: 'Error inserting artist'});
        } else {
            res.status(200).json({message: 'Artist inserted'});
        }}
    );
});

// get all artists

app.get('/artists', (req, res) => {
    connection.query('SELECT * FROM artists', (err, results) => {
        if(err){
            res.status(500).json({message: 'Error getting artists'});
        } else {
            res.status(200).json(results);
        }
    });
});

// update an artist
app.put('/artists/:id', (req, res) => {
    const {name, monthly_listeners, genre} = req.body;
    const {id } = req.params;
    const sql = 'UPDATE artists SET name = ?, monthly_listeners = ?, genre = ? WHERE id = ?';
    connection.query(sql, [name, monthly_listeners, genre, id], (err, results) => {
        if(err){
            res.status(500).json({message: 'Error updating artist'});
        } else {
            res.status(200).json({message: 'Artist updated'});
        }
    });

});

// delete an artist 

app.delete('/artists/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM artists WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ err: err.message });
        res.json({ message: 'Artist deleted' });
    });
});

// starting the server 

app.listen(3001, () => {
    console.log('Server started');
});










