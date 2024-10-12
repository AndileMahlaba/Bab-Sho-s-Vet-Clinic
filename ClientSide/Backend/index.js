const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.send('Hello World from Vet Clinic!');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//////////////////////////////////////////////////////////////New Addition///////////////////////////////////
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',       // Your database host
    user: 'root',            // Your MySQL username
    password: '',            // No password
    database: 'vetclinicdb'  // Your MySQL database name
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = connection;
