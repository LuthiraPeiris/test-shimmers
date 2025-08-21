-- Create the missing audit_log table
CREATE TABLE IF NOT EXISTS `audit_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_name` varchar(50) NOT NULL,
  `record_id` varchar(50) NOT NULL,
  `action` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_table_name` (`table_name`),
  KEY `idx_record_id` (`record_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
