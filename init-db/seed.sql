INSERT INTO employees (name, position, phone_number, email, password, created_at, role) VALUES
('Alice Barber', 'Barber', '0111222333', 'alice@barber.com', 'hashed_password_1', CURRENT_TIMESTAMP, 'employee'),
('Bob Stylist', 'Stylist', '0445566778', 'bob@stylist.com', 'hashed_password_2', CURRENT_TIMESTAMP, 'employee');

-- Insert sample data into Appointments
INSERT INTO appointments (name, phone_number, employee_id, appointment_time, status, created_at) VALUES
('John Doe', '0123456789', 1, '2024-08-15 10:00:00', 'pending', CURRENT_TIMESTAMP),
('Jane Doe', '0987654321', 2, '2024-08-16 14:00:00', 'pending', CURRENT_TIMESTAMP);
