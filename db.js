const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Default username, change if necessary
    password: '',        // Empty if no password is set
    database: 'vetclinicdb'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the MySQL database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = connection;
