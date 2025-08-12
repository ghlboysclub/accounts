-- Migration: 0005_remaining_tables_only.sql
-- Description: Add only the missing tables (not conflicting with existing ones)
-- Date: 2025-08-07

-- =====================================================
-- USERS & AUTHENTICATION SYSTEM (NEW TABLES)
-- =====================================================

-- Users table with role-based access
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'employee',
    partner_id INTEGER,
    phone TEXT,
    avatar_url TEXT,
    status TEXT DEFAULT 'active',
    last_login_at DATETIME,
    password_changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    must_change_password BOOLEAN DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User sessions for authentication tracking
CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    refresh_token TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User permissions for granular access control
CREATE TABLE IF NOT EXISTS user_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    permission TEXT NOT NULL,
    resource TEXT,
    granted_by INTEGER,
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    UNIQUE(user_id, permission, resource)
);

-- =====================================================
-- TRANSACTION EXTENSIONS (NEW TABLES)
-- =====================================================

-- Transaction attachments (receipts, invoices, contracts)
CREATE TABLE IF NOT EXISTS transaction_attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    file_path TEXT NOT NULL,
    uploaded_by INTEGER,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Monthly distribution summaries
CREATE TABLE IF NOT EXISTS monthly_distributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partner_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_transactions INTEGER NOT NULL DEFAULT 0,
    average_percentage DECIMAL(5,2),
    status TEXT DEFAULT 'draft',
    finalized_by INTEGER,
    finalized_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(partner_id, year, month)
);

-- =====================================================
-- ADVANCES & INVESTMENTS SYSTEM (NEW TABLES)
-- =====================================================

-- Partner advances (money given before profit distribution)
CREATE TABLE IF NOT EXISTS advances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partner_id INTEGER NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'PKR',
    purpose TEXT NOT NULL,
    advance_date DATE NOT NULL,
    repayment_method TEXT DEFAULT 'deduct_from_profits',
    installment_amount DECIMAL(12,2),
    installment_frequency TEXT,
    total_repaid DECIMAL(12,2) DEFAULT 0,
    remaining_balance DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'active',
    approved_by INTEGER,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Advance repayments tracking
CREATE TABLE IF NOT EXISTS advance_repayments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    advance_id INTEGER NOT NULL,
    distribution_id INTEGER,
    amount DECIMAL(12,2) NOT NULL,
    repayment_date DATE NOT NULL,
    method TEXT NOT NULL,
    reference_number TEXT,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Partner investments in the business
CREATE TABLE IF NOT EXISTS investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partner_id INTEGER NOT NULL,
    investment_type TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'PKR',
    description TEXT NOT NULL,
    investment_date DATE NOT NULL,
    expected_return_rate DECIMAL(5,2),
    maturity_date DATE,
    current_value DECIMAL(12,2),
    total_returns DECIMAL(12,2) DEFAULT 0,
    status TEXT DEFAULT 'active',
    agreement_url TEXT,
    notes TEXT,
    approved_by INTEGER,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- EXPENSES & BUSINESS COSTS (NEW TABLE)
-- =====================================================

-- Business expenses
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'PKR',
    vendor TEXT,
    expense_date DATE NOT NULL,
    payment_method TEXT,
    receipt_number TEXT,
    receipt_url TEXT,
    status TEXT DEFAULT 'pending',
    requested_by INTEGER,
    approved_by INTEGER,
    approved_at DATETIME,
    is_tax_deductible BOOLEAN DEFAULT 1,
    tax_category TEXT,
    is_reimbursable BOOLEAN DEFAULT 0,
    reimbursed_to INTEGER,
    reimbursed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- EXCHANGE RATES & CURRENCY (NEW TABLE)
-- =====================================================

-- Historical exchange rates for accurate conversions
CREATE TABLE IF NOT EXISTS exchange_rates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_currency TEXT NOT NULL,
    to_currency TEXT NOT NULL,
    rate DECIMAL(8,4) NOT NULL,
    rate_date DATE NOT NULL,
    source TEXT DEFAULT 'manual',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_currency, to_currency, rate_date)
);

-- =====================================================
-- SYSTEM CONFIGURATION (NEW TABLE)
-- =====================================================

-- System settings and configuration
CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type TEXT DEFAULT 'string',
    description TEXT,
    category TEXT DEFAULT 'general',
    is_public BOOLEAN DEFAULT 0,
    updated_by INTEGER,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- NOTIFICATION SYSTEM (NEW TABLE)
-- =====================================================

-- System notifications for users
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    category TEXT DEFAULT 'general',
    action_url TEXT,
    action_label TEXT,
    is_read BOOLEAN DEFAULT 0,
    is_dismissed BOOLEAN DEFAULT 0,
    scheduled_for DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME
);

-- =====================================================
-- PERFORMANCE INDEXES FOR NEW TABLES
-- =====================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_permissions_user ON user_permissions(user_id);

-- New transaction indexes
CREATE INDEX IF NOT EXISTS idx_attachments_transaction ON transaction_attachments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_monthly_dist_partner ON monthly_distributions(partner_id);
CREATE INDEX IF NOT EXISTS idx_monthly_dist_year_month ON monthly_distributions(year, month);

-- Advance indexes
CREATE INDEX IF NOT EXISTS idx_advances_partner ON advances(partner_id);
CREATE INDEX IF NOT EXISTS idx_advances_status ON advances(status);
CREATE INDEX IF NOT EXISTS idx_repayments_advance ON advance_repayments(advance_id);

-- Investment indexes
CREATE INDEX IF NOT EXISTS idx_investments_partner ON investments(partner_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);

-- Expense indexes
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);

-- Exchange rate indexes
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_date ON exchange_rates(rate_date);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert default system settings
INSERT OR IGNORE INTO system_settings (setting_key, setting_value, setting_type, description, category, is_public) VALUES
('app_name', 'Accounts - Finance Management', 'string', 'Application name', 'general', 1),
('app_version', '1.0.0', 'string', 'Current application version', 'general', 1),
('default_currency', 'PKR', 'string', 'Default system currency', 'financial', 0),
('company_name', 'GHL Boys Club', 'string', 'Company name for reports', 'general', 1),
('auto_distribution', 'true', 'string', 'Automatically calculate partner distributions', 'financial', 0),
('session_timeout_minutes', '480', 'string', 'User session timeout in minutes', 'security', 0),
('max_login_attempts', '5', 'string', 'Maximum failed login attempts', 'security', 0);

-- Insert default exchange rates
INSERT OR IGNORE INTO exchange_rates (from_currency, to_currency, rate, rate_date, source) VALUES
('USD', 'PKR', 278.50, DATE('now'), 'manual'),
('EUR', 'PKR', 305.20, DATE('now'), 'manual'),
('PKR', 'USD', 0.0036, DATE('now'), 'manual'),
('PKR', 'EUR', 0.0033, DATE('now'), 'manual');

-- Create default admin user (password: 'admin123' - CHANGE IN PRODUCTION!)
INSERT OR IGNORE INTO users (username, email, password_hash, full_name, role, status, must_change_password) VALUES
('admin', 'admin@ghlboysclub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin', 'active', 1);

-- Link existing partners to user accounts (you can modify these emails as needed)
INSERT OR IGNORE INTO users (username, email, password_hash, full_name, role, partner_id, status, must_change_password) VALUES
('ahmad.ali', 'ahmad@ghlboysclub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ahmad Ali', 'partner', 1, 'active', 1),
('hassan.khan', 'hassan@ghlboysclub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Hassan Khan', 'partner', 2, 'active', 1),
('fatima.shah', 'fatima@ghlboysclub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fatima Shah', 'partner', 3, 'active', 1),
('omar.malik', 'omar@ghlboysclub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Omar Malik', 'partner', 4, 'active', 1);

-- Mark migration as completed
INSERT OR IGNORE INTO system_settings (setting_key, setting_value, setting_type, description, category) VALUES
('migration_0005_completed', datetime('now'), 'string', 'Remaining tables migration completed', 'system');
