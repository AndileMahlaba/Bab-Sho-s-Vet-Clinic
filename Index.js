const mysql = require('mysql2');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Default XAMPP MySQL user
    password: '', // Leave blank if no password set
    database: 'vet_clinic_db'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

const jwtSecret = 'your_jwt_secret_key';

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if the admin exists in the database
    const query = 'SELECT * FROM admins WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        const admin = results[0];

        // Compare entered password with hashed password from the database
        bcrypt.compare(password, admin.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                // Generate JWT token
                const token = jwt.sign({ email: admin.email }, jwtSecret, { expiresIn: '1h' });
                return res.json({ success: true, token });
            } else {
                return res.status(400).json({ message: 'Invalid password' });
            }
        });
    });
});

// Protected route (e.g., admin dashboard)
app.get('/admin-dashboard', verifyToken, (req, res) => {
    jwt.verify(req.token, jwtSecret, (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Welcome to the admin dashboard!',
                authData
            });
        }
    });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

const bcrypt = require('bcryptjs');

const password = 'password123'; // The password you want to hash

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        console.log('Hashed Password:', hash); // Store this hashed password
    });
});
