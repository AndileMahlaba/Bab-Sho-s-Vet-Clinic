// Admin
document.getElementById('adminLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    const response = await fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    if (result.success) {
        sessionStorage.setItem('adminLoggedIn', true);
        window.location.href = '/admin/dashboard.html';
    } else {
        alert(result.message);
    }
});

// users functionality
async function fetchUsers() {
    const response = await fetch('/admin/users');
    const users = await response.json();
    // Code to display users on the UI
}

fetchUsers();
