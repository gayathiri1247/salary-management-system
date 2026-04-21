fetch('http://localhost:3000/api/salaries', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        employee_id: 3,
        bonus: 500,
        deductions: 50
    })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
