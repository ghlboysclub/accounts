-- migrations/0004_security_enhancement.sql
-- Security Enhancement Tables

-- API request tracking for rate limiting
CREATE TABLE IF NOT EXISTS api_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id TEXT NOT NULL, -- IP or User ID
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    user_id INTEGER,
    response_status INTEGER,
    response_time INTEGER, -- milliseconds
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Token blacklist for revoked tokens
CREATE TABLE IF NOT EXISTS token_blacklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    reason TEXT, -- 'logout', 'security_breach', 'password_change'
    blacklisted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Security events logging
CREATE TABLE IF NOT EXISTS security_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event_type TEXT NOT NULL,
    severity TEXT DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    details TEXT, -- JSON
    ip_address TEXT,
    user_agent TEXT,
    timestamp INTEGER NOT NULL,
    resolved INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_requests_client_timestamp ON api_requests(client_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_api_requests_user_timestamp ON api_requests(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_token ON token_blacklist(token);
CREATE INDEX IF NOT EXISTS idx_security_events_user_timestamp ON security_events(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
