const bcrypt = require('bcrypt');
const connection = require('./db');

const email = 'testuser@example.com';
const password = 'password123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }

    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    connection.query(query, [email, hash], (err, results) => {
        if (err) {
            console.error('Error inserting user into the database:', err);
            return;
        }
        console.log('User created successfully:', results);
    });
});
