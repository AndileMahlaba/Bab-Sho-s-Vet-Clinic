const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'ClientSide/Frontend/Views')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'VetClinicDataBase'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to VetClinicDataBase');
});

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/Login.html');
}

// Route to serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ClientSide/Frontend/Views/Home_Page.html'));
});

// Register client
app.post('/register', (req, res) => {
    const { ownerFName, ownerLName, email, phone, password } = req.body;

    db.query('SELECT * FROM Client WHERE ownerEmail_addr = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: 'Error hashing password' });

            const newClient = {
                ownerFName,
                ownerLName,
                ownerEmail_addr: email,
                ownerContactNum: phone,
                password: hashedPassword
            };

            db.query('INSERT INTO Client SET ?', newClient, (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                res.json({ message: 'Client registered successfully' });
            });
        });
    });
});

// Login client
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM Client WHERE ownerEmail_addr = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const client = results[0];
        bcrypt.compare(password, client.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error comparing passwords' });

            if (isMatch) {
                req.session.userId = client.ownerID;
                res.json({ message: 'Login successful' });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    });
});

// Book appointment
app.post('/book-appointment', isAuthenticated, (req, res) => {
    const { petID, doctorID, appointTime, appointDate, appointStatus } = req.body;

    db.query('INSERT INTO Appointment (petID, doctorID, AppointTime, AppointDate, AppointStatus, ownerID) VALUES (?, ?, ?, ?, ?, ?)', 
    [petID, doctorID, appointTime, appointDate, appointStatus, req.session.userId], 
    (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Appointment booked successfully' });
    });
});

// Start the server
const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
