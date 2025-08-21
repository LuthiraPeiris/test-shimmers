-- Fix user_data table password field length for bcrypt hashes
ALTER TABLE user_data MODIFY COLUMN Password VARCHAR(255) NOT NULL;

-- Update any plain text passwords to use bcrypt hashes
-- Note: This should be run after ensuring all new passwords use bcrypt

-- Example of updating a plain text password (run this for each plain text password found)
-- UPDATE user_data SET Password = '$2b$10$BsV...' WHERE User_ID = 'U0001';
