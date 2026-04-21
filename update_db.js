const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gayu@rec12',
    database: 'salarymanagement'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected');
    db.query(`ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'employee'`, (err) => {
        if (err && err.code !== 'ER_DUP_FIELDNAME') console.log(err);
        db.query(`UPDATE users SET role='admin' WHERE username='admin'`, (err) => {
            if (err) console.log(err);
            console.log('Roles updated');
            process.exit();
        });
    });
});
