// dashboard.js

// Fetch data and populate lists
function fetchData(endpoint, displayFunc) {
    fetch(`http://localhost:4000/${endpoint}`)
        .then(response => response.json())
        .then(data => displayFunc(data))
        .catch(error => console.error('Error fetching data:', error));
}

// Display clients
function displayClients(clients) {
    const clientList = document.getElementById('client-list');
    clientList.innerHTML = ''; // Clear existing list
    clients.forEach(client => {
        const div = document.createElement('div');
        div.innerHTML = `${client.ownerFName} ${client.ownerLName} - ${client.ownerEmail_addr} <button onclick="deleteClient(${client.ownerID})">Delete</button>`;
        clientList.appendChild(div);
    });
}

// Display doctors
function displayDoctors(doctors) {
    const doctorList = document.getElementById('doctor-list');
    doctorList.innerHTML = '';
    doctors.forEach(doctor => {
        const div = document.createElement('div');
        div.innerHTML = `${doctor.doctorInitials} ${doctor.doctorSurname} <button onclick="deleteDoctor(${doctor.doctorID})">Delete</button>`;
        doctorList.appendChild(div);
    });
}

// Display admins
function displayAdmins(admins) {
    const adminList = document.getElementById('admin-list');
    adminList.innerHTML = '';
    admins.forEach(admin => {
        const div = document.createElement('div');
        div.innerHTML = `${admin.AdminInitials} ${admin.AdminSurname} <button onclick="deleteAdmin(${admin.AdminID})">Delete</button>`;
        adminList.appendChild(div);
    });
}

// Display pets
function displayPets(pets) {
    const petList = document.getElementById('pet-list');
    petList.innerHTML = '';
    pets.forEach(pet => {
        const div = document.createElement('div');
        div.innerHTML = `${pet.petName} (${pet.petType}) <button onclick="deletePet(${pet.petID})">Delete</button>`;
        petList.appendChild(div);
    });
}

// Display appointments
function displayAppointments(appointments) {
    const appointmentList = document.getElementById('appointment-list');
    appointmentList.innerHTML = '';
    appointments.forEach(appointment => {
        const div = document.createElement('div');
        div.innerHTML = `${appointment.appointTime} on ${appointment.appointDate} <button onclick="deleteAppointment(${appointment.AppointNum})">Delete</button>`;
        appointmentList.appendChild(div);
    });
}

// Add Client
function addClient() {
    const clientData = {
        ownerFName: document.getElementById('clientFName').value,
        ownerLName: document.getElementById('clientLName').value,
        ownerEmail_addr: document.getElementById('clientEmail').value,
        ownerContactNum: document.getElementById('clientPhone').value,
        ownerPhy_addr: document.getElementById('clientAddress').value,
    };

    fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        fetchData('clients', displayClients); // Refresh client list
    })
    .catch(error => console.error('Error adding client:', error));
}

// Add Doctor
function addDoctor() {
    const doctorData = {
        doctorInitials: document.getElementById('doctorInitials').value,
        doctorSurname: document.getElementById('doctorSurname').value,
        doctorContact_Num: document.getElementById('doctorContact').value,
    };

    fetch('http://localhost:4000/add-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        fetchData('doctors', displayDoctors); // Refresh doctor list
    })
    .catch(error => console.error('Error adding doctor:', error));
}

// Add Admin
function addAdmin() {
    const adminData = {
        AdminInitials: document.getElementById('adminInitials').value,
        AdminSurname: document.getElementById('adminSurname').value,
        AdminContact_Num: document.getElementById('adminContact').value,
        AdminEmail_addr: document.getElementById('adminEmail').value,
    };

    fetch('http://localhost:4000/add-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        fetchData('admins', displayAdmins); // Refresh admin list
    })
    .catch(error => console.error('Error adding admin:', error));
}

// Add Pet
function addPet() {
    const petData = {
        petName: document.getElementById('petName').value,
        petType: document.getElementById('petType').value,
        petBreed: document.getElementById('petBreed').value,
        petAge: document.getElementById('petAge').value,
        petOwnerID: document.getElementById('petOwnerID').value,
    };

    fetch('http://localhost:4000/add-pet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(petData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        fetchData('pets', displayPets); // Refresh pet list
    })
    .catch(error => console.error('Error adding pet:', error));
}

// Add Appointment
function addAppointment() {
    const appointmentData = {
        appointTime: document.getElementById('appointTime').value,
        appointDate: document.getElementById('appointDate').value,
        appointStatus: document.getElementById('appointStatus').value,
        appointAdminID: document.getElementById('appointAdminID').value,
        appointOwnerID: document.getElementById('appointOwnerID').value,
        appointPetID: document.getElementById('appointPetID').value,
        appointDoctorID: document.getElementById('appointDoctorID').value,
    };

    fetch('http://localhost:4000/add-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        fetchData('appointments', displayAppointments); // Refresh appointment list
    })
    .catch(error => console.error('Error adding appointment:', error));
}

// Function to delete a client
function deleteClient(id) {
    fetch(`http://localhost:4000/delete-client/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchData('clients', displayClients); // Refresh client list
        })
        .catch(error => console.error('Error deleting client:', error));
}

// Function to delete a doctor
function deleteDoctor(id) {
    fetch(`http://localhost:4000/delete-doctor/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchData('doctors', displayDoctors); // Refresh doctor list
        })
        .catch(error => console.error('Error deleting doctor:', error));
}

// Function to delete an admin
function deleteAdmin(id) {
    fetch(`http://localhost:4000/delete-admin/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchData('admins', displayAdmins); // Refresh admin list
        })
        .catch(error => console.error('Error deleting admin:', error));
}

// Function to delete a pet
function deletePet(id) {
    fetch(`http://localhost:4000/delete-pet/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchData('pets', displayPets); // Refresh pet list
        })
        .catch(error => console.error('Error deleting pet:', error));
}

// Function to delete an appointment
function deleteAppointment(id) {
    fetch(`http://localhost:4000/delete-appointment/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchData('appointments', displayAppointments); // Refresh appointment list
        })
        .catch(error => console.error('Error deleting appointment:', error));
}

// Fetch initial data when the page loads
document.addEventListener('DOMContentLoaded', function () {
    fetchData('clients', displayClients);
    fetchData('doctors', displayDoctors);
    fetchData('admins', displayAdmins);
    fetchData('pets', displayPets);
    fetchData('appointments', displayAppointments);
});

// Show form functions
function showClientForm() {
    document.getElementById('client-form').style.display = 'block';
}
function showDoctorForm() {
    document.getElementById('doctor-form').style.display = 'block';
}
function showAdminForm() {
    document.getElementById('admin-form').style.display = 'block';
}
function showPetForm() {
    document.getElementById('pet-form').style.display = 'block';
}
function showAppointmentForm() {
    document.getElementById('appointment-form').style.display = 'block';
}