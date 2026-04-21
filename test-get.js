fetch('http://localhost:3000/api/employees')
.then(res => res.json())
.then(console.log)
.catch(console.error);
