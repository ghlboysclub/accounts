-- migrations/0002_base_system.sql
-- Simple base system that works

-- Partners table
CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    percentage REAL NOT NULL,
    phone TEXT,
    email TEXT,
    balance INTEGER DEFAULT 0,
    total_earned INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Clients table  
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT,
    contact_email TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO partners (name, percentage, phone, email) VALUES
('Ahmad Ali', 18.0, '+92-300-1234567', 'ahmad@ghlboysclub.com'),
('Hassan Khan', 18.0, '+92-300-2345678', 'hassan@ghlboysclub.com'),
('Fatima Shah', 15.0, '+92-300-3456789', 'fatima@ghlboysclub.com'),
('Omar Malik', 12.5, '+92-300-4567890', 'omar@ghlboysclub.com');

INSERT INTO clients (name, type, amount, contact_email) VALUES
('TechCorp USA', 'weekly', 2500.00, 'payments@techcorp.com'),
('Marketing Plus', 'bi-weekly', 4200.00, 'billing@marketingplus.com');
