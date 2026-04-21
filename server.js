const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gayu@rec12',
    database: 'salarymanagement'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err.message);
    } else {
        console.log('Connected to MySQL Database.');
    }
});

// Admin / Employee Login
app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ? AND role = ?';
    db.query(query, [username, password, role], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            res.json({ message: 'Login successful', success: true, role: results[0].role, username: results[0].username });
        } else {
            res.status(401).json({ message: 'Invalid credentials or role', success: false });
        }
    });
});

// Register new user
app.post('/api/register', (req, res) => {
    const { username, password, role } = req.body;
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, password, role], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Username already exists', success: false });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Registration successful', success: true });
    });
});

// GET all employees
app.get('/api/employees', (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST add new employee
app.post('/api/employees', (req, res) => {
    const { name, role, department, basic_salary } = req.body;
    const query = 'INSERT INTO employees (name, role, department, basic_salary) VALUES (?, ?, ?, ?)';
    db.query(query, [name, role, department, basic_salary], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Employee added successfully', id: results.insertId });
    });
});

// DELETE an employee
app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM employees WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Employee deleted successfully' });
    });
});

// GET all salaries with employee details
app.get('/api/salaries', (req, res) => {
    const query = `
        SELECT s.id, e.id as employee_id, e.name, e.basic_salary, s.bonus, s.deductions, s.total_salary 
        FROM salaries s 
        JOIN employees e ON s.employee_id = e.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET salaries for specific employee based on username
app.get('/api/employee/salaries/:username', (req, res) => {
    const { username } = req.params;
    const query = `
        SELECT s.id, e.name, e.basic_salary, s.bonus, s.deductions, s.total_salary 
        FROM salaries s 
        JOIN employees e ON s.employee_id = e.id
        WHERE e.name = ?
    `;
    db.query(query, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST calculate and save salary
app.post('/api/salaries', (req, res) => {
    const { employee_id, bonus, deductions } = req.body;
    
    // First, get the basic salary of the employee
    db.query('SELECT basic_salary FROM employees WHERE id = ?', [employee_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Employee not found' });
        
        const basicSalary = parseFloat(results[0].basic_salary);
        const b = parseFloat(bonus) || 0;
        const d = parseFloat(deductions) || 0;
        
        const totalSalary = basicSalary + b - d;
        
        const insertQuery = 'INSERT INTO salaries (employee_id, bonus, deductions, total_salary) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [employee_id, b, d, totalSalary], (err, insertResults) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Salary calculated and saved successfully', total_salary: totalSalary });
        });
    });
});

// DELETE a salary record
app.delete('/api/salaries/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM salaries WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Salary record deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
