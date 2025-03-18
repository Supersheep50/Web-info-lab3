// config/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'webcourse.cs.nuim.ie',
    user: 'p250126',
    password: 'OhV9vohSeequeuya',
    database: 'cs230_p250126'
});

connection.connect(err => {
    if (err) {
        console.log("Connection failed", err);
    } else {
        console.log("Connected to database");
    }
});

module.exports = connection;
