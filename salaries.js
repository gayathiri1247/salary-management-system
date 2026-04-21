const SAL_API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    fetchSalaries();
    loadEmployeeSelect();

    document.getElementById('addSalaryForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const salaryData = {
            employee_id: parseInt(document.getElementById('employeeSelect').value),
            bonus: parseFloat(document.getElementById('bonus').value),
            deductions: parseFloat(document.getElementById('deductions').value)
        };
        
        try {
            const response = await fetch(`${SAL_API_URL}/salaries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(salaryData)
            });
            
            if (response.ok) {
                alert('Salary calculated and saved successfully');
                document.getElementById('addSalaryForm').reset();
                fetchSalaries();
            } else {
                alert('Failed to save salary');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Server error');
        }
    });
});

async function loadEmployeeSelect() {
    const select = document.getElementById('employeeSelect');
    if (!select) return;
    
    try {
        const response = await fetch(`${SAL_API_URL}/employees`);
        const employees = await response.json();
        
        select.innerHTML = '<option value="">-- Select Employee --</option>';
        employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.id;
            option.textContent = `${emp.id} - ${emp.name} (${emp.role})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading employees:', error);
        select.innerHTML = '<option value="">Error loading employees</option>';
    }
}

async function fetchSalaries() {
    const tableBody = document.getElementById('salaryTableBody');
    if (!tableBody) return;
    
    try {
        const response = await fetch(`${SAL_API_URL}/salaries`);
        const salaries = await response.json();
        
        tableBody.innerHTML = '';
        salaries.forEach(sal => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${sal.id}</td>
                <td>${sal.name} (ID: ${sal.employee_id})</td>
                <td>$${parseFloat(sal.basic_salary).toFixed(2)}</td>
                <td>$${parseFloat(sal.bonus).toFixed(2)}</td>
                <td>$${parseFloat(sal.deductions).toFixed(2)}</td>
                <td><strong>$${parseFloat(sal.total_salary).toFixed(2)}</strong></td>
                <td>
                    <button class="btn btn-danger" onclick="deleteSalary(${sal.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching salaries:', error);
    }
}

// Global scope function for onclick access
window.deleteSalary = async function(id) {
    if(!confirm('Are you sure you want to delete this salary record?')) return;
    
    try {
        const response = await fetch(`${SAL_API_URL}/salaries/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            fetchSalaries();
        } else {
            alert('Failed to delete salary record');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
