
let appointments = [];
        let editingIndex = null;

        // Function to add a new row to the table
        function addAppointmentToTable(appointment, index) {
            const tableBody = document.getElementById('appointments-body');
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${appointment.clientName}</td>
                <td>${appointment.petName}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.service}</td>
                <td>
                    <button class="edit-btn" onclick="editAppointment(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteAppointment(${index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        }

        // Function to clear the table rows
        function clearTable() {
            const tableBody = document.getElementById('appointments-body');
            tableBody.innerHTML = '';
        }

        // Function to render all appointments
        function renderAppointments() {
            clearTable();
            appointments.forEach((appointment, index) => {
                addAppointmentToTable(appointment, index);
            });
        }

        // Function to add a new appointment or update an existing one
        document.getElementById('appointment-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const clientName = document.getElementById('client-name').value;
            const petName = document.getElementById('pet-name').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const service = document.getElementById('service').value;
            
            const newAppointment = { clientName, petName, date, time, service };

            if (editingIndex === null) {
                // Add new appointment
                appointments.push(newAppointment);
            } else {
                // Update existing appointment
                appointments[editingIndex] = newAppointment;
                editingIndex = null;
                document.getElementById('submit-btn').textContent = 'Add Appointment';
                document.getElementById('form-title').textContent = 'Add New Appointment';
            }

            renderAppointments();
            this.reset(); // Reset the form
        });

        // Function to delete an appointment
        function deleteAppointment(index) {
            const confirmation = confirm('Are you sure you want to delete this appointment?');
            if (confirmation) {
                appointments.splice(index, 1);
                renderAppointments();
            }
        }

        // Function to edit an appointment
        function editAppointment(index) {
            const appointment = appointments[index];

            // Populate the form with appointment details
            document.getElementById('client-name').value = appointment.clientName;
            document.getElementById('pet-name').value = appointment.petName;
            document.getElementById('date').value = appointment.date;
            document.getElementById('time').value = appointment.time;
            document.getElementById('service').value = appointment.service;

            // Set the editing index and change the form button and title
            editingIndex = index;
            document.getElementById('submit-btn').textContent = 'Update Appointment';
            document.getElementById('form-title').textContent = 'Edit Appointment';
        }
