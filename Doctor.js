//Doctor
document.getElementById('doctorLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    const response = await fetch('/doctor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    if (result.success) {
        sessionStorage.setItem('doctorLoggedIn', true);
        window.location.href = '/doctor/dashboard.html';
    } else {
        alert(result.message);
    }
});

// Fetch and display appointments for the doctor
async function fetchAppointments() {
    const response = await fetch('/doctor/appointments');
    const appointments = await response.json();
    // Code to display appointments on the UI
}

fetchAppointments();
