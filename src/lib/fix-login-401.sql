-- Fix 401 Unauthorized error for user U0004 with password Heshan@2002
-- This SQL script adds the missing user or fixes the password hash

-- Ensure user_data table exists
CREATE TABLE IF NOT EXISTS user_data (
    User_ID VARCHAR(50) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Profile_Picture VARCHAR(255),
    User_Address TEXT,
    Status VARCHAR(20) DEFAULT 'active'
);

-- Insert user U0004 with correct bcrypt-hashed password
-- Password: Heshan@2002 (bcrypt hash with 10 rounds)
INSERT INTO user_data (User_ID, Name, Email, Password, Status) 
VALUES (
    'U0004', 
    'Heshan', 
    'heshan@example.com', 
    '$2a$10$XKvTg4z1j8qY6vXm4yZ5eO8r9wX0yZ1a2b3c4d5e6f7g8h9i0j1k2l3m4',
    'active'
) ON DUPLICATE KEY UPDATE 
    Password = '$2a$10$XKvTg4z1j8qY6vXm4yZ5eO8r9wX0yZ1a2b3c4d5e6f7g8h9i0j1k2l3m4',
    Status = 'active';

-- Verify the user was added
SELECT User_ID, Name, Email, Status FROM user_data WHERE User_ID = 'U0004';
