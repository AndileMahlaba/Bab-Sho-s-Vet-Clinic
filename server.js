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

//Route to the register
app.post('/register', (req, res) => {
    const { ownerFName, ownerLName, email, phone, password, ownerPhy_addr, username } = req.body;

    db.query('SELECT * FROM Client WHERE ownerEmail_addr = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: 'Error hashing password' });

            // Insert new client with hashed password
            const newClient = {
                ownerFName,
                ownerLName,
                ownerEmail_addr: email,
                ownerPhy_addr,
                ownerContactNum: phone,
                password: hashedPassword, // Store hashed password
                username
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


// Route to fetch all clients
app.get('/clients', (req, res) => {
    db.query('SELECT * FROM Client', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results); // Send the results back to the client as JSON
    });
});

app.get('/insert-dummy-client', (req, res) => {
    const dummyClient = {
        ownerFName: 'John',
        ownerLName: 'Doe',
        ownerEmail_addr: 'john.doe@example.com',
        ownerPhy_addr: '123 Example Street',
        ownerContactNum: '1234567890'
    };

    db.query('INSERT INTO Client (ownerFName, ownerLName, ownerEmail_addr, ownerPhy_addr, ownerContactNum) VALUES (?, ?, ?, ?, ?)', 
    [dummyClient.ownerFName, dummyClient.ownerLName, dummyClient.ownerEmail_addr, dummyClient.ownerPhy_addr, dummyClient.ownerContactNum], 
    (err, result) => {
        if (err) {
            console.error("Database error details: ", err); // Log detailed error to the console
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json({ message: 'Dummy client inserted successfully' });
    });
});


//fetch all doctors
app.get('/doctors', (req, res) => {
    db.query('SELECT * FROM Doctor', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
});

//insert new doctors
app.post('/add-doctor', (req, res) => {
    const { doctorInitials, doctorSurname, doctorContact_Num } = req.body;
    const newDoctor = { doctorInitials, doctorSurname, doctorContact_Num };

    db.query('INSERT INTO Doctor SET ?', newDoctor, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Doctor added successfully' });
    });
});

// Update a doctor's information
app.put('/update-doctor/:doctorID', (req, res) => {
    const { doctorID } = req.params;
    const { doctorInitials, doctorSurname, doctorContact_Num } = req.body;
    
    db.query('UPDATE Doctor SET doctorInitials = ?, doctorSurname = ?, doctorContact_Num = ? WHERE doctorID = ?', 
    [doctorInitials, doctorSurname, doctorContact_Num, doctorID], 
    (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Doctor updated successfully' });
    });
});

// Delete a doctor by doctorID
app.delete('/delete-doctor/:doctorID', (req, res) => {
    const { doctorID } = req.params;

    db.query('DELETE FROM Doctor WHERE doctorID = ?', [doctorID], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Doctor deleted successfully' });
    });
});


//fetch admin
app.get('/admin-staff', (req, res) => {
    db.query('SELECT * FROM AdminStaff', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
});

//insert admin
app.post('/add-admin-staff', (req, res) => {
    const { AdminInitials, AdminSurname, AdminContact_Num } = req.body;
    const newAdmin = { AdminInitials, AdminSurname, AdminContact_Num };

    db.query('INSERT INTO AdminStaff SET ?', newAdmin, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Admin staff added successfully' });
    });
});

// Update an admin staff member
app.put('/update-admin/:AdminID', (req, res) => {
    const { AdminID } = req.params;
    const { AdminInitials, AdminSurname, AdminContact_Num } = req.body;

    db.query('UPDATE AdminStaff SET AdminInitials = ?, AdminSurname = ?, AdminContact_Num = ? WHERE AdminID = ?', 
    [AdminInitials, AdminSurname, AdminContact_Num, AdminID], 
    (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Admin staff updated successfully' });
    });
});

// Delete an admin staff member by AdminID
app.delete('/delete-admin/:AdminID', (req, res) => {
    const { AdminID } = req.params;

    db.query('DELETE FROM AdminStaff WHERE AdminID = ?', [AdminID], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Admin staff deleted successfully' });
    });
});

//fetch pets
app.get('/pets', (req, res) => {
    db.query('SELECT * FROM Pet', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
});

//insert pet
app.post('/add-pet', (req, res) => {
    const { petName, petType, petBreed, petAge, ownerID } = req.body;
    const newPet = { petName, petType, petBreed, petAge, ownerID };

    db.query('INSERT INTO Pet SET ?', newPet, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Pet added successfully' });
    });
});

// Update a pet's information
app.put('/update-pet/:petID', (req, res) => {
    const { petID } = req.params;
    const { petName, petType, petBreed, petAge } = req.body;

    db.query('UPDATE Pet SET petName = ?, petType = ?, petBreed = ?, petAge = ? WHERE petID = ?', 
    [petName, petType, petBreed, petAge, petID], 
    (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Pet updated successfully' });
    });
});

// Delete a pet by petID
app.delete('/delete-pet/:petID', (req, res) => {
    const { petID } = req.params;

    db.query('DELETE FROM Pet WHERE petID = ?', [petID], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Pet deleted successfully' });
    });
});

// fetch appointment 
app.get('/appointments', (req, res) => {
    db.query('SELECT * FROM Appointment', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
});

//insert appointment
app.post('/add-appointment', (req, res) => {
    const { appointTime, appointDate, appointStatus, AdminID, ownerID, petID, doctorID } = req.body;
    const newAppointment = { appointTime, appointDate, appointStatus, AdminID, ownerID, petID, doctorID };

    db.query('INSERT INTO Appointment SET ?', newAppointment, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Appointment booked successfully' });
    });
});

// Update an appointment
app.put('/update-appointment/:AppointNum', (req, res) => {
    const { AppointNum } = req.params;
    const { AppointTime, AppointDate, AppointStatus, AdminID, ownerID, petID, doctorID } = req.body;

    // Only update fields that are provided in the request body (use existing values if not provided)
    db.query('UPDATE Appointment SET AppointTime = COALESCE(?, AppointTime), AppointDate = COALESCE(?, AppointDate), AppointStatus = COALESCE(?, AppointStatus), AdminID = COALESCE(?, AdminID), ownerID = COALESCE(?, ownerID), petID = COALESCE(?, petID), doctorID = COALESCE(?, doctorID) WHERE AppointNum = ?', 
    [AppointTime, AppointDate, AppointStatus, AdminID, ownerID, petID, doctorID, AppointNum], 
    (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json({ message: 'Appointment updated successfully' });
    });
});


//// Delete an appointment by AppointNum
app.delete('/delete-appointment/:AppointNum', (req, res) => {
    const { AppointNum } = req.params;

    db.query('DELETE FROM Appointment WHERE AppointNum = ?', [AppointNum], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Appointment deleted successfully' });
    });
});

//fetch consultation
app.get('/consultations', (req, res) => {
    db.query('SELECT * FROM Consultation', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
});


//insert consultation
app.post('/add-consultation', (req, res) => {
    const { ConsulDate, ConsulStartTime, ConsulEndTime, doctorID, petID } = req.body;
    const newConsultation = { ConsulDate, ConsulStartTime, ConsulEndTime, doctorID, petID };

    db.query('INSERT INTO Consultation SET ?', newConsultation, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Consultation added successfully' });
    });
});

// Update a consultation
app.put('/update-consultation/:ConsulNum', (req, res) => {
    const { ConsulNum } = req.params;
    const { ConsulDate, ConsulStartTime, ConsulEndTime, doctorID, petID } = req.body;

    db.query('UPDATE Consultation SET ConsulDate = ?, ConsulStartTime = ?, ConsulEndTime = ?, doctorID = ?, petID = ? WHERE ConsulNum = ?', 
    [ConsulDate, ConsulStartTime, ConsulEndTime, doctorID, petID, ConsulNum], 
    (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Consultation updated successfully' });
    });
});

// Delete a consultation by ConsulNum
app.delete('/delete-consultation/:ConsulNum', (req, res) => {
    const { ConsulNum } = req.params;

    db.query('DELETE FROM Consultation WHERE ConsulNum = ?', [ConsulNum], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Consultation deleted successfully' });
    });
});

//fetch medical history
app.get('/medical-history', (req, res) => {
    db.query('SELECT * FROM MedicalHistory', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
});

//insert medical history
app.post('/add-medical-history', (req, res) => {
    const { serviceType, serviceDate, serviceStartTime, serviceEndTime, serviceDesc, ConsulNum, petID } = req.body;
    const newMedicalHistory = { serviceType, serviceDate, serviceStartTime, serviceEndTime, serviceDesc, ConsulNum, petID };

    db.query('INSERT INTO MedicalHistory SET ?', newMedicalHistory, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Medical history added successfully' });
    });
});

// Update a medical history record
app.put('/update-medical-history/:serviceID', (req, res) => {
    const { serviceID } = req.params;
    const { serviceType, serviceDate, serviceStartTime, serviceEndTime, serviceDesc, ConsulNum, petID } = req.body;

    db.query('UPDATE MedicalHistory SET serviceType = ?, serviceDate = ?, serviceStartTime = ?, serviceEndTime = ?, serviceDesc = ?, ConsulNum = ?, petID = ? WHERE serviceID = ?', 
    [serviceType, serviceDate, serviceStartTime, serviceEndTime, serviceDesc, ConsulNum, petID, serviceID], 
    (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Medical history updated successfully' });
    });
});

// Delete a medical history by serviceID
app.delete('/delete-medical-history/:serviceID', (req, res) => {
    const { serviceID } = req.params;

    db.query('DELETE FROM MedicalHistory WHERE serviceID = ?', [serviceID], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Medical history deleted successfully' });
    });
});

//fetch payments
app.get('/payments', (req, res) => {
    db.query('SELECT * FROM Payment', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
});

//insert payments
app.post('/add-payment', (req, res) => {
    const { paymentMethod, accountNum, accountHolder, accountExpDate, accountCVV, paymentAmt, paymentDate, ownerID } = req.body;
    const newPayment = { paymentMethod, accountNum, accountHolder, accountExpDate, accountCVV, paymentAmt, paymentDate, ownerID };

    db.query('INSERT INTO Payment SET ?', newPayment, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Payment added successfully' });
    });
});

// Update a payment record
app.put('/update-payment/:paymentNum', (req, res) => {
    const { paymentNum } = req.params;
    const { paymentMethod, accountNum, accountHolder, accountExpDate, accountCVV, paymentAmt, paymentDate, ownerID } = req.body;

    db.query('UPDATE Payment SET paymentMethod = ?, accountNum = ?, accountHolder = ?, accountExpDate = ?, accountCVV = ?, paymentAmt = ?, paymentDate = ?, ownerID = ? WHERE paymentNum = ?', 
    [paymentMethod, accountNum, accountHolder, accountExpDate, accountCVV, paymentAmt, paymentDate, ownerID, paymentNum], 
    (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Payment updated successfully' });
    });
});


// Delete a payment by paymentNum
app.delete('/delete-payment/:paymentNum', (req, res) => {
    const { paymentNum } = req.params;

    db.query('DELETE FROM Payment WHERE paymentNum = ?', [paymentNum], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Payment deleted successfully' });
    });
});

// Start the server
const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
