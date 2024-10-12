const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const connection = require('./db');

const app = express();
app.use(cors());
app.use(express.json());


app.use(cors({
    origin: '*', // Allow all origins, you can restrict this to specific domains if needed
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    app.post('/api/login', (req, res) => {
        const { email, password } = req.body;
    
        console.log('Received login request:', email, password);
    
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
    
        const query = 'SELECT * FROM users WHERE email = ?';
        connection.query(query, [email], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
    
            console.log('Database query results:', results);
    
            if (results.length > 0) {
                const user = results[0];
    
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        console.error('Error comparing passwords:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
    
                    console.log('Password match result:', isMatch);
    
                    if (isMatch) {
                        res.json({ message: 'Login successful', user });
                    } else {
                        res.status(401).json({ message: 'Invalid credentials' });
                    }
                });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    });
    
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
