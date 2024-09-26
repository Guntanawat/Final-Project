-- Create table for Employees
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) DEFAULT 'employee'
);

-- Create table for Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    employee_id INT NOT NULL,
    appointment_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

INSERT INTO employees (name, position, phone_number, email, password, created_at, role) VALUES
('Alice Barber', 'Barber', '0111222333', 'alice@barber.com', 'hashed_password_1', CURRENT_TIMESTAMP, 'employee'),
('Bob Stylist', 'Stylist', '0445566778', 'bob@stylist.com', 'hashed_password_2', CURRENT_TIMESTAMP, 'employee');

-- Insert sample data into Appointments
INSERT INTO appointments (name, phone_number, employee_id, appointment_time, status, created_at) VALUES
('John Doe', '0123456789', 1, '2024-08-15 10:00:00', 'pending', CURRENT_TIMESTAMP),
('Jane Doe', '0987654321', 2, '2024-08-16 14:00:00', 'pending', CURRENT_TIMESTAMP);
