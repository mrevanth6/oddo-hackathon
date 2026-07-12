// Connect to DB abd aslo create a table if it does not exist
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');   
dotenv.config(); 
const connection =mysql.createPool({
    uri:process.env.mysql_url,
    connectionLimit:10
})
// connection.getConnection((err, conn) => {
//     if (err) {
//         console.error('Error connecting to the database:', err);
//         return;
//     } 
//     else{
//         console.log('Connected to the database.');
//     }
// }) 
// create a table if it does not exist
connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst') NOT NULL,
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);
//2. Vehicle Registry
connection.query(`CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(50) PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    max_load_capacity INT NOT NULL,
    odometer INT DEFAULT 0,
    acquisition_cost DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Available',
    region VARCHAR(100) DEFAULT 'Unassigned'
);
`)
//Drivers Table
connection.query(`CREATE TABLE IF NOT EXISTS drivers ( id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_category VARCHAR(20) NOT NULL,
    license_expiry_date DATE NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    safety_score INT DEFAULT 100,
    status VARCHAR(50) DEFAULT 'Available'
);`)
//4. Trips Table
connection.query(`CREATE TABLE IF NOT EXISTS trips (id VARCHAR(50) PRIMARY KEY,
    source VARCHAR(150) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    vehicle_id VARCHAR(50) REFERENCES vehicles(id) ON DELETE SET NULL,
    driver_id VARCHAR(50) REFERENCES drivers(id) ON DELETE SET NULL,
    cargo_weight INT NOT NULL,
    planned_distance INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft',
    odometer_at_start INT,
    odometer_at_end INT,
    fuel_consumed INT,
    revenue DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL
);`)

//5. Maintenance Logs Table
connection.query(`CREATE TABLE IF NOT EXISTS maintenance_logs ( id VARCHAR(50) PRIMARY KEY,
    vehicle_id VARCHAR(50) REFERENCES vehicles(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    cost DECIMAL(12, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'Active'
);`)

//-- 6. Fuel Logs Table
connection.query(`CREATE TABLE IF NOT EXISTS fuel_logs (  id VARCHAR(50) PRIMARY KEY,
    vehicle_id VARCHAR(50) REFERENCES vehicles(id) ON DELETE CASCADE,
    liters INT NOT NULL,
    cost DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL
);`)

//-- 7. Operational Expenses Table
connection.query(`CREATE TABLE IF NOT EXISTS expenses ( id VARCHAR(50) PRIMARY KEY,
     vehicle_id VARCHAR(50) REFERENCES vehicles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL,
    description VARCHAR(255) NOT NULL
);`)
//-- Seed Initial Users (Passwords are 'password123' for immediate dashboard entry)
// connection.query(`INSERT IGNORE INTO users (id, email, password_hash, name, role, contact_number) VALUES
//     ('u-1', 'manager@transitops.com', 'password123', 'Sarah Connor', 'Fleet Manager', '+1 555-0199') ON CONFLICT (id) DO NOTHING;
//     `)
// connection.query(`INSERT IGNORE INTO users (id, email, password_hash, name, role, contact_number) VALUES
//     ('u-2', 'driver@transitops.com', 'password123', 'Alex Mercer', 'Driver', '+1 555-0188') ON CONFLICT (id) DO NOTHING;
//     `)
// connection.query(`INSERT IGNORE INTO users (id, email, password_hash, name, role, contact_number) VALUES
//     ('u-3', 'safety@transitops.com', 'password123', 'Officer Frank', 'Safety Officer', '+1 555-0177') ON CONFLICT (id) DO NOTHING;`)
// connection.query(`INSERT IGNORE INTO users (id, email, password_hash, name, role, contact_number) VALUES
// ('u-4', 'finance@transitops.com', 'password123', 'Martha Stewart', 'Financial Analyst', '+1 555-0166') ON CONFLICT (id) DO NOTHING;
// `)
module.exports=connection;