const bcrypt = require('bcrypt');

const password = 'mom1'; // Replace this with the actual plain text password
                         // The previous user has this password: admin1
bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
    } else {
        console.log('Hashed password:', hash);
    }
});