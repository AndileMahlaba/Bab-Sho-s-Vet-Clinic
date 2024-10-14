const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

/* JavaScript to Trigger Sliding Effect */
document.addEventListener("DOMContentLoaded", function() {
    const bookingSection = document.querySelector('.booking-section');
    setTimeout(() => {
        bookingSection.classList.add('active'); // Activate the sliding effect
    }, 300); // Delay the effect slightly for a smoother appearance
});

// Firebase configuration (replace with your own config)
const firebaseConfig = {
    apiKey: "AIzaSyAvyoiWHOCEJOb7XwIMLPcqV5vgf26iLRk",
    authDomain: "vet-clinic-dc537.firebaseapp.com",
    projectId: "vet-clinic-dc537",
    storageBucket: "vet-clinic-dc537.appspot.com",
    messagingSenderId: "506192283099",
    appId: "1:506192283099:web:dbd0762387c1ea980393fe"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Authentication
const auth = firebase.auth();

// Handle Login Form Submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert('Login successful!');
            sessionStorage.setItem('loggedin', 'true');
            window.location.href = 'Home_Page.html';
        })
        .catch((error) => {
            alert('Invalid username or password.');
            console.error('Error:', error.message);
        });
});
