fetch('http://localhost:3000/api/employees', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        name: 'Test Node',
        role: 'Dev',
        department: 'IT',
        basic_salary: 1000
    })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
