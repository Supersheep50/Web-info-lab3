const mysql = require('mysql');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // handling json data from react

// connect to phpadmin db

const connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cs230_p250126'
});

connection.connect(err => {

if(error){
    console.log("Connection failed", error);
} else {
    console.log("Connected to database");
}
});

// insert an artist 

app.post('/artists', (req, res) => {
    const {name, monthly_listeners, genre} = req.body;
    const sql = 'INSERT INTO artists (name, monthly_listeners, genre) VALUES (?, ?, ?)';
    connection.query[sql, [name, monthly_listeners, genre], (error, results) => {
        if(error){
            res.status(500).json({message: 'Error inserting artist'});
        } else {
            res.status(200).json({message: 'Artist inserted'});
        }}
    ];
});

// get all artists

app.get('/artists', (req, res) => {
    connection.query('SELECT * FROM artists', (error, results) => {
        if(error){
            res.status(500).json({message: 'Error getting artists'});
        } else {
            res.status(200).json(results);
        }
    });
});

// update an artist





