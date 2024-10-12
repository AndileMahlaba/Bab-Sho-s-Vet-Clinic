const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());

// Change this line to use port 4000
const port = 4000;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key', // Change this to a random secret
    resave: false,
    saveUninitialized: true
}));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ballet_studio_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/Login.html'); // Redirect to login page if not authenticated
}

// Routes
app.post('/signup', (req, res) => {
    const { username, password, email, phone, first_name, last_name } = req.body;

    // Check if the user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ success: false, message: 'Error hashing password' });

            // Insert new user into the database
            const newUser = {
                username,
                password: hashedPassword,
                email,
                phone,
                first_name,
                last_name,
                role: 'user', // Default role
                created_at: new Date()
            };

            db.query('INSERT INTO users SET ?', newUser, (err, result) => {
                if (err) return res.status(500).json({ success: false, message: 'Database error' });

                res.json({ success: true, message: 'User registered successfully' });
            });
        });
    });
});

// Login route with bcrypt for password comparison
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Email: ${email}, Password: ${password}`); // Log inputs

    // Correct query to select user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error(err); // Log any database error
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            console.log('Email not found');
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = results[0]; // Get the user from the results
        console.log('User found:', user);

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error(err); // Log error in password comparison
                return res.status(500).json({ success: false, message: 'Error comparing passwords' });
            }

            if (isMatch) {
                req.session.userId = user.user_id;
                console.log('Login successful');
                res.json({ success: true, message: 'Login successful' });
            } else {
                console.log('Password mismatch');
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        });
    });
});


 

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


//Okay this server was working 50% fine on my other website however we need to try convert or change it and make it adapt to our website for vet because it was able to signup a user and also appears in the database however fail to login must have missed something.