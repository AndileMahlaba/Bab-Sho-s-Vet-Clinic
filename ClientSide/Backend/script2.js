document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:2000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            sessionStorage.setItem('loggedin', 'true');
            window.location.href = 'Home_Page.html';
        } else {
            alert('Invalid username or password.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error logging in. Please try again later.');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    if (!sessionStorage.getItem('loggedin')) {
        console.log('User not logged in, redirecting to Login.html');
        window.location.href = 'login2.html'; // Redirect to login page if not logged in
    }
});