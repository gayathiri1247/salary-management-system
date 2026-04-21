const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    document.getElementById('welcomeUser').textContent = `Welcome, ${username}`;
    
    // Logout handler
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    });

    fetchMySalaries(username);
});

async function fetchMySalaries(username) {
    const errorDiv = document.getElementById('salaryError');
    const tableBody = document.getElementById('mySalariesTableBody');
    
    try {
        const response = await fetch(`${API_BASE_URL}/employee/salaries/${username}`);
        const salaries = await response.json();
        
        if (!response.ok) {
            throw new Error(salaries.message || 'Failed to fetch salaries');
        }
        
        tableBody.innerHTML = '';
        
        if (salaries.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No salary records found for your account.</td></tr>';
            return;
        }

        salaries.forEach(salary => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${salary.id}</td>
                <td>${salary.name}</td>
                <td>$${salary.basic_salary}</td>
                <td>$${salary.bonus}</td>
                <td>$${salary.deductions}</td>
                <td><strong>$${salary.total_salary}</strong></td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching salaries:', error);
        errorDiv.textContent = 'Failed to load your salary records. Or maybe you do not have an employee profile yet.';
    }
}
