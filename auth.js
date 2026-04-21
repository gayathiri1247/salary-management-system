window.API_URL = 'http://localhost:3000/api';

// Toggle between Login and Register
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formTitle = document.getElementById('formTitle');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

if (showRegister) {
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        formTitle.textContent = 'Register';
    });
}

if (showLogin) {
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        formTitle.textContent = 'Login';
    });
}

// Handle Login
loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const role = document.getElementById('loginRole').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        const response = await fetch(`${window.API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('role', data.role);
            localStorage.setItem('username', data.username);
            
            if (data.role === 'admin') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'employee-dashboard.html';
            }
        } else {
            errorDiv.textContent = data.message || 'Login failed';
        }
    } catch (error) {
        console.error('Error logging in:', error);
        errorDiv.textContent = 'Server error. Is the backend running?';
    }
});

// Handle Register
registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const role = document.getElementById('registerRole').value;
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const errorDiv = document.getElementById('registerError');
    const successDiv = document.getElementById('registerSuccess');
    
    errorDiv.textContent = '';
    successDiv.textContent = '';
    
    try {
        const response = await fetch(`${window.API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            successDiv.textContent = 'Registration successful! You can now login.';
            registerForm.reset();
            setTimeout(() => showLogin.click(), 2000);
        } else {
            errorDiv.textContent = data.message || 'Registration failed';
        }
    } catch (error) {
        console.error('Error registering:', error);
        errorDiv.textContent = 'Server error. Is the backend running?';
    }
});

// Protect routes
const path = window.location.pathname;
const isIndex = path.endsWith('index.html') || path === '/';
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const userRole = localStorage.getItem('role');

if (!isIndex && !isLoggedIn) {
    window.location.href = 'index.html';
} else if (!isIndex && isLoggedIn) {
    const adminPages = ['dashboard.html', 'employees.html', 'salaries.html'];
    const isTryingToAccessAdminPage = adminPages.some(page => path.endsWith(page));
    
    if (userRole === 'employee' && isTryingToAccessAdminPage) {
        window.location.href = 'employee-dashboard.html';
    } else if (userRole === 'admin' && path.endsWith('employee-dashboard.html')) {
        window.location.href = 'dashboard.html';
    }
}

// Global Logout Handler
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            window.location.href = 'index.html';
        });
    }
});
