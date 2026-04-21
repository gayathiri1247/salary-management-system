const EMP_API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    fetchEmployees();

    document.getElementById('addEmployeeForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const employeeData = {
            name: document.getElementById('empName').value,
            role: document.getElementById('empRole').value,
            department: document.getElementById('empDept').value,
            basic_salary: parseFloat(document.getElementById('empSalary').value)
        };
        
        try {
            const response = await fetch(`${EMP_API_URL}/employees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData)
            });
            
            if (response.ok) {
                alert('Employee added successfully');
                document.getElementById('addEmployeeForm').reset();
                fetchEmployees();
            } else {
                alert('Failed to add employee');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Server error');
        }
    });
});

async function fetchEmployees() {
    const tableBody = document.getElementById('employeeTableBody');
    if (!tableBody) return;
    
    try {
        const response = await fetch(`${EMP_API_URL}/employees`);
        const employees = await response.json();
        
        tableBody.innerHTML = '';
        employees.forEach(emp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.role}</td>
                <td>${emp.department}</td>
                <td>$${parseFloat(emp.basic_salary).toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteEmployee(${emp.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

// Global scope function for onclick access
window.deleteEmployee = async function(id) {
    if(!confirm('Are you sure you want to delete this employee? (This will also delete associated salary records)')) return;
    
    try {
        const response = await fetch(`${EMP_API_URL}/employees/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            fetchEmployees();
        } else {
            alert('Failed to delete employee');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
