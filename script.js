const hero = document.getElementById('hero');

// Array of image URLs for the background
const images = [
    'German-Shepherd-dog-Alsatian.webp',
    '360_F_138462002_m2XcZawSWBppPTTUJDHvpJjP8aCdfexH.jpg',
    'two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.webp'
];

let currentImageIndex = 0;

// Function to change background image
function changeBackgroundImage() {
    hero.style.backgroundImage = `url('${images[currentImageIndex]}')`;
    currentImageIndex = (currentImageIndex + 1) % images.length;
}

// Initial background image
changeBackgroundImage();

// Change the background image every 5 seconds
setInterval(changeBackgroundImage, 5000);

////////////////////////////////Login/////////////////////////

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: username, password: password })
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
    if (!sessionStorage.getItem('loggedin')) {
        window.location.href = 'Login.html'; // Redirect to login page if not logged in
    }
});





/*document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:4000/api/login', {
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
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error logging in. Please try again later.');
    });
});
*/

