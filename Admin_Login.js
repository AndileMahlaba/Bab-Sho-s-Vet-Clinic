// Import necessary modules
const mysql = require('mysql2');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Include 'path' for static file serving

const app = express();
const port = 4000;

app.use(express.static(path.join(__dirname, 'Admin_Side'))); // Serve static files (HTML, CSS, JS)
app.use(bodyParser.json()); // To parse JSON request bodies
app.use(cors()); // Enable CORS

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Default XAMPP MySQL user
    password: '', // Leave blank if no password set
    database: 'vetclinicdatabase'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Secret key for JWT token
const jwtSecret = 'your_jwt_secret_key';

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if the admin exists in the database
    const query = 'SELECT * FROM admins WHERE Admin_Email = "admin@vetclinic.com"';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        const admin = results[0];

        // Compare entered password with hashed password from the database
        bcrypt.compare(password, admin.Admin_Password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                // Generate JWT token
                const token = jwt.sign({ id: admin.Admin_ID, email: admin.Admin_Email }, jwtSecret, { expiresIn: '1h' });
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

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Client-side fetch example:
const loginData = {
    email: 'admin@vetclinic.com',
    password: 'password123'
};

fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
})
.then(response => response.json())
.then(data =>  {
    console.log('Success:', data);
    if (data.token) {
        localStorage.setItem('token', data.token); 
        
        window.location.href = 'Admin_Side/Admin Dashboard.html'; // Redirect after successful login
    } else {
        console.log('Login failed:', data.message);
    }
})
.catch(error => {
    console.error('Error:', error);
});

// Dark mode toggle script (client-side)
toggleButton.addEventListener('click', () => {
    console.log('Toggle button clicked');
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        toggleButton.textContent = "Switch to Light Mode";
        console.log('Dark mode activated');
    } else {
        toggleButton.textContent = "Switch to Dark Mode";
        console.log('Light mode activated');
    }
});

