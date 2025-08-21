-- Fix for missing columns in user_data table
-- This script adds the missing columns that the login route expects

ALTER TABLE `user_data` 
ADD COLUMN `Failed_Login_Attempts` INT(11) NOT NULL DEFAULT 0 AFTER `Status`,
ADD COLUMN `Last_Failed_Login` DATETIME NULL DEFAULT NULL AFTER `Failed_Login_Attempts`,
ADD COLUMN `Role` VARCHAR(50) NOT NULL DEFAULT 'user' AFTER `Last_Failed_Login`;

-- Update existing records with default values
UPDATE `user_data` SET 
    `Failed_Login_Attempts` = 0,
    `Last_Failed_Login` = NULL,
    `Role` = 'user'
WHERE 1=1;

-- Create index for better performance on login queries
CREATE INDEX idx_user_login ON user_data(User_ID, Failed_Login_Attempts, Last_Failed_Login);
