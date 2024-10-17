        let clients = [];
        let editingIndex = null;

        // Function to add a new row to the table
        function addClientToTable(client, index) {
            const tableBody = document.getElementById('clients-body');
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${client.clientName}</td>
                <td>${client.contact}</td>
                <td>${client.petName}</td>
                <td>${client.petType}</td>
                <td>${client.petAge}</td>
                <td>
                    <button class="edit-btn" onclick="editClient(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteClient(${index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        }

        // Function to clear the table rows
        function clearTable() {
            const tableBody = document.getElementById('clients-body');
            tableBody.innerHTML = '';
        }

        // Function to render all clients
        function renderClients() {
            clearTable();
            clients.forEach((client, index) => {
                addClientToTable(client, index);
            });
        }

        // Function to add a new client or update an existing one
        document.getElementById('client-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const clientName = document.getElementById('client-name').value;
            const contact = document.getElementById('contact').value;
            const petName = document.getElementById('pet-name').value;
            const petType = document.getElementById('pet-type').value;
            const petAge = document.getElementById('pet-age').value;
            
            const newClient = { clientName, contact, petName, petType, petAge };

            if (editingIndex === null) {
                // Add new client
                clients.push(newClient);
            } else {
                // Update existing client
                clients[editingIndex] = newClient;
                editingIndex = null;
                document.getElementById('submit-btn').textContent = 'Add Client';
                document.getElementById('form-title').textContent = 'Add New Client';
            }

            renderClients();
            this.reset(); // Reset the form
        });

        // Function to delete a client
        function deleteClient(index) {
            const confirmation = confirm('Are you sure you want to delete this client?');
            if (confirmation) {
                clients.splice(index, 1);
                renderClients();
            }
        }

        // Function to edit a client
        function editClient(index) {
            const client = clients[index];

            // Populate the form with client details
            document.getElementById('client-name').value = client.clientName;
            document.getElementById('contact').value = client.contact;
            document.getElementById('pet-name').value = client.petName;
            document.getElementById('pet-type').value = client.petType;
            document.getElementById('pet-age').value = client.petAge;

            // Set the editing index and change the form button and title
            editingIndex = index;
            document.getElementById('submit-btn').textContent = 'Update Client';
            document.getElementById('form-title').textContent = 'Edit Client';
        }
    

