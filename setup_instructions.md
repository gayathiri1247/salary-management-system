# Salary Management System

A beginner-friendly full-stack application built with Express.js, MySQL, and Vanilla HTML/CSS/JavaScript.

## Features
- **Admin Login**: Simple authentication for dashboard access.
- **Employee Management**: Add, view, and delete employee records.
- **Salary Management**: Automatically calculate total salaries (Basic + Bonus - Deductions), save records, and view/delete them.

## Prerequisites
- **Node.js** installed on your computer.
- **MySQL Server** installed and running on default port (`3306`).

## Step-by-Step Setup Instructions

### 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or terminal).
2. Execute the `backend/database.sql` script to create the `salary_management` database, tables, and insert the default admin user.
3. The default Admin credentials are **Username: admin**, **Password: admin123**.

*(Note: The database connects via user `root` with no password by default. If your local MySQL has a password, update it in `backend/server.js` at line 16).*

### 2. Backend Setup
1. Open your terminal or powershell in the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the necessary Node modules:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm start
   ```
   *You should see "Connected to MySQL Database" and "Server is running on http://localhost:3000".*

### 3. Frontend Setup
1. The frontend uses plain HTML/JS and doesn't explicitly require a development server, but some browsers restrict CORS for `file://` usage.
2. It's recommended to serve the `frontend` directory using a simple server like Live Server (VS Code extension) or via Python/npx.
3. Once served, open your browser and navigate to the local URL (or double click to open `index.html` if cors isn't an issue).
4. Log in as **admin** / **admin123** and navigate to the dashboard to manage employees and calculate salaries!
