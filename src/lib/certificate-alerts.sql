-- Certificate Alert System Schema
-- Add necessary columns to existing tables and create new configuration tables

-- Add additional columns to certification_expiry_notification table
ALTER TABLE certification_expiry_notification 
ADD COLUMN IF NOT EXISTS Alert_Date DATE,
ADD COLUMN IF NOT EXISTS Advance_Months INT DEFAULT 6,
ADD COLUMN IF NOT EXISTS Email_Sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS SMS_Sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS Reminder_Count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS Last_Reminder_Date DATE;

-- Create certificate alert configuration table
CREATE TABLE IF NOT EXISTS certificate_alert_config (
    id INT PRIMARY KEY DEFAULT 1,
    advance_months INT DEFAULT 6,
    enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    notification_frequency ENUM('daily', 'weekly', 'monthly') DEFAULT 'daily',
    last_run DATETIME,
    next_run DATETIME,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create certificate alert history table for tracking
CREATE TABLE IF NOT EXISTS certificate_alert_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notification_id VARCHAR(10),
    reg_id VARCHAR(10),
    certificate_name VARCHAR(255),
    expiry_date DATE,
    alert_date DATE,
    advance_months INT,
    action_taken VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notification_id) REFERENCES certification_expiry_notification(Notification_ID)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_cert_expiry_date ON certification_report(Expiry_Date);
CREATE INDEX IF NOT EXISTS idx_notification_status ON certification_expiry_notification(Notification_Status);
CREATE INDEX IF NOT EXISTS idx_notification_reg_id ON certification_expiry_notification(Reg_Id);

-- Insert default configuration
INSERT INTO certificate_alert_config (id, advance_months, enabled, email_notifications, sms_notifications, notification_frequency)
VALUES (1, 6, TRUE, TRUE, FALSE, 'daily')
ON DUPLICATE KEY UPDATE id = id;

-- Create a view for upcoming expiring certificates
CREATE OR REPLACE VIEW upcoming_certificate_expiry AS
SELECT 
    cr.Reg_Id,
    cr.Certificate_Name,
    cr.Item_Code,
    cr.Item_Name,
    cr.Expiry_Date,
    DATEDIFF(cr.Expiry_Date, CURDATE()) as days_until_expiry,
    CASE 
        WHEN DATEDIFF(cr.Expiry_Date, CURDATE()) <= 30 THEN 'critical'
        WHEN DATEDIFF(cr.Expiry_Date, CURDATE()) <= 90 THEN 'warning'
        WHEN DATEDIFF(cr.Expiry_Date, CURDATE()) <= 180 THEN 'notice'
        ELSE 'safe'
    END as alert_level
FROM certification_report cr
WHERE cr.Expiry_Date >= CURDATE()
ORDER BY cr.Expiry_Date ASC;
