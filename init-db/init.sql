-- สร้างตารางลูกค้า (Users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,      
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- สร้างตารางพนักงาน (Employees)
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,           -- รหัสพนักงาน (Primary Key)
    name VARCHAR(100) NOT NULL,      -- ชื่อพนักงาน
    position VARCHAR(50) NOT NULL,   -- ตำแหน่ง เช่น ช่างตัดผม
    phone_number VARCHAR(15) UNIQUE NOT NULL, -- เบอร์โทรศัพท์พนักงาน (ต้องไม่ซ้ำ)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- วันที่สร้างข้อมูล
);

-- สร้างตารางการจองคิว (Appointments)
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,           -- รหัสการจอง (Primary Key)
    user_id INT NOT NULL,            -- รหัสลูกค้า (Foreign Key ไปที่ users)
    employee_id INT NOT NULL,        -- รหัสพนักงานที่ให้บริการ (Foreign Key ไปที่ employees)
    appointment_time TIMESTAMP NOT NULL, -- เวลาที่จอง
    status VARCHAR(20) DEFAULT 'pending', -- สถานะการจอง เช่น pending, completed, canceled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- วันที่สร้างข้อมูล
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- ลบข้อมูลการจองถ้าลูกค้าถูกลบ
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE -- ลบข้อมูลการจองถ้าพนักงานถูกลบ
);

-- ใส่ข้อมูลตัวอย่างลงในตารางลูกค้า (Users)
INSERT INTO users (name, phone_number) VALUES
('John Doe', '0123456789'),
('Jane Doe', '0987654321');

-- ใส่ข้อมูลตัวอย่างลงในตารางพนักงาน (Employees)
INSERT INTO employees (name, position, phone_number) VALUES
('Alice Barber', 'Barber', '0111222333'),
('Bob Stylist', 'Stylist', '0445566778');

-- ใส่ข้อมูลตัวอย่างลงในตารางการจองคิว (Appointments)
INSERT INTO appointments (user_id, employee_id, appointment_time, status) VALUES
(1, 1, '2024-08-15 10:00:00', 'pending'),
(2, 2, '2024-08-16 14:00:00', 'pending');
