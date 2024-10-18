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
