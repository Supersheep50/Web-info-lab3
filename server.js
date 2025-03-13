const mysql = require('mysql');


const connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'CS230_2025'
});

connection.connect();

connection.query("INSERT INTO students (name, email, grade) VALUES ('John', 'jonathan@gmail.com', 9)",
function (error, results, fields) {
    if (error) {
    console.log(error);
} else {
    console.log(results);
}}); 

// node.server.js in terminal 


