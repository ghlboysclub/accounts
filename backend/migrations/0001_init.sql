-- migrations/0001_init.sql
-- Base system tables

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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('weekly', 'bi-weekly', 'monthly', 'project')),
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT CHECK (payment_method IN ('wise', 'payoneer', 'remitly', 'other')),
    contact_email TEXT,
    contact_phone TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    partner_id INTEGER,
    type TEXT NOT NULL CHECK (type IN ('income', 'withdrawal', 'expense')),
    amount_usd REAL,
    amount_pkr INTEGER NOT NULL,
    pkr_rate REAL,
    description TEXT,
    date DATE NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (partner_id) REFERENCES partners(id)
);

-- Partner distributions
CREATE TABLE IF NOT EXISTS partner_distributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    partner_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    percentage REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (partner_id) REFERENCES partners(id)
);

-- Insert sample partners
INSERT INTO partners (name, percentage, phone, email) VALUES
('Ahmad Ali', 18.0, '+92-300-1234567', 'ahmad@ghlboysclub.com'),
('Hassan Khan', 18.0, '+92-300-2345678', 'hassan@ghlboysclub.com'),
('Fatima Shah', 15.0, '+92-300-3456789', 'fatima@ghlboysclub.com'),
('Omar Malik', 12.5, '+92-300-4567890', 'omar@ghlboysclub.com');

-- Insert sample clients
INSERT INTO clients (name, type, amount, payment_method, contact_email) VALUES
('TechCorp USA', 'weekly', 2500.00, 'wise', 'payments@techcorp.com'),
('Marketing Plus', 'bi-weekly', 4200.00, 'payoneer', 'billing@marketingplus.com');-- migrations/0001_init.sql
-- Complete database schema for Accounts finance management system

-- Partners table - Your 8 team members with percentage shares
CREATE TABLE partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    percentage REAL NOT NULL, -- 18, 15, 12.5, 10.5, 10, 8, 8
    phone TEXT,
    email TEXT,
    balance INTEGER DEFAULT 0, -- Current available balance in PKR
    total_earned INTEGER DEFAULT 0, -- Total lifetime earnings in PKR
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Clients table - Your clients with different payment terms
CREATE TABLE clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('weekly', 'bi-weekly', 'monthly', 'project')),
    amount REAL NOT NULL, -- Amount in USD
    currency TEXT DEFAULT 'USD',
    payment_method TEXT CHECK (payment_method IN ('wise', 'payoneer', 'remitly', 'other')),
    contact_email TEXT,
    contact_phone TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table - All income and withdrawals
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER, -- For income transactions
    partner_id INTEGER, -- For withdrawal transactions
    type TEXT NOT NULL CHECK (type IN ('income', 'withdrawal', 'expense')),
    amount_usd REAL, -- Original USD amount (for income)
    amount_pkr INTEGER NOT NULL, -- Amount in PKR
    pkr_rate REAL, -- USD to PKR conversion rate used
    description TEXT,
    date DATE NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (partner_id) REFERENCES partners(id)
);

-- Partner distributions - Track how much each partner gets from each income
CREATE TABLE partner_distributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    partner_id INTEGER NOT NULL,
    amount INTEGER NOT NULL, -- Amount in PKR
    percentage REAL NOT NULL, -- Percentage used for this distribution
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (partner_id) REFERENCES partners(id)
);

-- Create indexes for better performance
CREATE INDEX idx_partners_active ON partners(active);
CREATE INDEX idx_clients_active ON clients(active);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);

-- Insert your 8 partners (modify names as needed)
INSERT INTO partners (name, percentage, phone, email) VALUES
('Ahmad Ali', 18.0, '+92-300-1234567', 'ahmad@ghlboysclub.com'),
('Hassan Khan', 18.0, '+92-300-2345678', 'hassan@ghlboysclub.com'),
('Fatima Shah', 15.0, '+92-300-3456789', 'fatima@ghlboysclub.com'),
('Omar Malik', 12.5, '+92-300-4567890', 'omar@ghlboysclub.com'),
('Zain Ahmed', 10.5, '+92-300-5678901', 'zain@ghlboysclub.com'),
('Sara Khan', 10.0, '+92-300-6789012', 'sara@ghlboysclub.com'),
('Ali Raza', 8.0, '+92-300-7890123', 'ali@ghlboysclub.com'),
('Ayesha Sheikh', 8.0, '+92-300-8901234', 'ayesha@ghlboysclub.com');

-- Insert sample clients
INSERT INTO clients (name, type, amount, payment_method, contact_email) VALUES
('TechCorp USA', 'weekly', 2500.00, 'wise', 'payments@techcorp.com'),
('Marketing Plus', 'bi-weekly', 4200.00, 'payoneer', 'billing@marketingplus.com'),
('StartupXYZ', 'project', 8500.00, 'wise', 'founder@startupxyz.com'),
('E-commerce Hub', 'monthly', 3800.00, 'remitly', 'finance@ecommhub.com');

-- Insert sample recent transaction
INSERT INTO transactions (client_id, type, amount_usd, amount_pkr, pkr_rate, description, date) VALUES
(1, 'income', 2500.00, 697500, 279.00, 'Weekly payment - Week 32', '2025-08-07');

-- Insert partner distributions for the sample transaction
INSERT INTO partner_distributions (transaction_id, partner_id, amount, percentage) VALUES
(1, 1, 125550, 18.0), -- Ahmad Ali
(1, 2, 125550, 18.0), -- Hassan Khan
(1, 3, 104625, 15.0), -- Fatima Shah
(1, 4, 87188, 12.5),  -- Omar Malik
(1, 5, 73238, 10.5),  -- Zain Ahmed
(1, 6, 69750, 10.0),  -- Sara Khan
(1, 7, 55800, 8.0),   -- Ali Raza
(1, 8, 55800, 8.0);   -- Ayesha Sheikh

-- Update partner balances
UPDATE partners SET 
    balance = (SELECT COALESCE(SUM(amount), 0) FROM partner_distributions WHERE partner_id = partners.id),
    total_earned = (SELECT COALESCE(SUM(amount), 0) FROM partner_distributions WHERE partner_id = partners.id);
