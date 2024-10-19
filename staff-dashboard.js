document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the backend and populate the tables
    fetchAppointments();
    fetchConsultations();
});

function fetchAppointments() {
    // Example: You'd use a real API to fetch data from your database
    const appointments = [
        { id: 1, petName: 'Max', ownerName: 'John Doe', doctor: 'Dr. Smith', date: '2024-10-18', time: '14:00', status: 'Scheduled' },
        { id: 2, petName: 'Luna', ownerName: 'Jane Doe', doctor: 'Dr. Brown', date: '2024-10-18', time: '16:00', status: 'Completed' }
    ];

    const tableBody = document.querySelector('.data-section:nth-of-type(1) tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    appointments.forEach(app => {
        const row = `<tr>
                        <td>${app.id}</td>
                        <td>${app.petName}</td>
                        <td>${app.ownerName}</td>
                        <td>${app.doctor}</td>
                        <td>${app.date}</td>
                        <td>${app.time}</td>
                        <td>${app.status}</td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
}

function fetchConsultations() {
    // Example: You'd use a real API to fetch data from your database
    const consultations = [
        { id: 1, petName: 'Charlie', doctor: 'Dr. Green', date: '2024-10-18', startTime: '10:00', endTime: '11:00' },
        { id: 2, petName: 'Bella', doctor: 'Dr. White', date: '2024-10-18', startTime: '11:30', endTime: '12:00' }
    ];

    const tableBody = document.querySelector('.data-section:nth-of-type(2) tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    consultations.forEach(cons => {
        const row = `<tr>
                        <td>${cons.id}</td>
                        <td>${cons.petName}</td>
                        <td>${cons.doctor}</td>
                        <td>${cons.date}</td>
                        <td>${cons.startTime}</td>
                        <td>${cons.endTime}</td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
}

// Client-side fetch example for login
const form = document.querySelector('form'); // Ensure you select the correct form

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const email = document.getElementById('floatingInput').value;
    const password = document.getElementById('floatingPassword').value;

    const loginData = { email, password };

    try {
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token); // Store the token
            window.location.href = 'Admin_Side/Admin Dashboard.html'; // Redirect to dashboard
        } else {
            console.log('Login failed:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
