-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 14, 2025 at 04:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shimmerserp`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--

CREATE TABLE `audit_log` (
  `id` int(11) NOT NULL,
  `table_name` varchar(50) NOT NULL,
  `record_id` varchar(50) NOT NULL,
  `action` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_log`
--

INSERT INTO `audit_log` (`id`, `table_name`, `record_id`, `action`, `old_values`, `new_values`, `created_at`, `created_by`) VALUES
(1, 'deliver_data', 'DEL0NaN', 'INSERT', NULL, '{\"item_code\":\"ITM005\",\"item_name\":\"Tape02\",\"quantity\":15,\"date\":\"2025-08-11\",\"status\":\"Pending\"}', '2025-08-11 23:12:29', NULL),
(2, 'item_master_data', 'ITM005', 'UPDATE', '{\"Available_Stock\":200}', '{\"Available_Stock\":185}', '2025-08-11 23:12:29', NULL),
(3, 'deliver_data', 'DEL0001', 'INSERT', NULL, '{\"item_code\":\"ITM004\",\"item_name\":\"Tape02\",\"quantity\":3,\"date\":\"2025-08-11\",\"status\":\"Pending\"}', '2025-08-11 23:12:29', NULL),
(4, 'item_master_data', 'ITM004', 'UPDATE', '{\"Available_Stock\":125}', '{\"Available_Stock\":122}', '2025-08-11 23:12:29', NULL),
(5, 'customer_invoices', '7', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0001\",\"invoice_date\":\"2025-08-11\",\"payment_terms\":\"Net 30\",\"total_amount\":500,\"tax_amount\":50,\"grand_total\":550,\"notes\":\"Thank you for your business.\",\"items\":[{\"item_code\":\"ITM005\",\"item_name\":\"Tape02\",\"quantity\":15,\"unit_price\":100,\"total_price\":1500},{\"item_code\":\"ITM004\",\"item_name\":\"Tape02\",\"quantity\":3,\"unit_price\":100,\"total_price\":300}],\"invoice_no\":\"INV0002\"}', '2025-08-11 23:12:29', NULL),
(6, 'deliver_data', 'DEL0002', 'INSERT', NULL, '{\"item_code\":\"ITM005\",\"item_name\":\"Tape02\",\"quantity\":45,\"date\":\"2025-08-11\",\"status\":\"Pending\"}', '2025-08-12 18:47:09', NULL),
(7, 'item_master_data', 'ITM005', 'UPDATE', '{\"Available_Stock\":185}', '{\"Available_Stock\":140}', '2025-08-12 18:47:09', NULL),
(8, 'deliver_data', 'DEL0003', 'INSERT', NULL, '{\"item_code\":\"ITM004\",\"item_name\":\"Tape02\",\"quantity\":18,\"date\":\"2025-08-11\",\"status\":\"Pending\"}', '2025-08-12 18:47:09', NULL),
(9, 'item_master_data', 'ITM004', 'UPDATE', '{\"Available_Stock\":122}', '{\"Available_Stock\":104}', '2025-08-12 18:47:09', NULL),
(10, 'customer_invoices', '12', 'INSERT', NULL, '{\"customer_id\":\"CU0002\",\"user_id\":\"U0002\",\"invoice_date\":\"2025-08-11\",\"payment_terms\":\"Net 30\",\"total_amount\":500,\"tax_amount\":50,\"grand_total\":550,\"notes\":\"Thank you for your business.\",\"items\":[{\"item_code\":\"ITM005\",\"item_name\":\"Tape02\",\"quantity\":45,\"unit_price\":100,\"total_price\":4500},{\"item_code\":\"ITM004\",\"item_name\":\"Tape02\",\"quantity\":18,\"unit_price\":100,\"total_price\":1800}],\"invoice_no\":\"INV0002\"}', '2025-08-12 18:47:09', NULL),
(11, 'customer_invoices', '13', 'INSERT', NULL, '{\"customer_id\":\"CU0002\",\"user_id\":\"U0002\",\"invoice_date\":\"2025-08-11\",\"payment_terms\":\"Net 30\",\"total_amount\":500,\"tax_amount\":50,\"grand_total\":550,\"notes\":\"Thank you for your business.\",\"items\":[],\"invoice_no\":\"INV0003\"}', '2025-08-13 18:41:24', NULL),
(12, 'deliver_data', 'DEL0004', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 18:58:30', NULL),
(13, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7500}', '{\"Available_Stock\":7499}', '2025-08-13 18:58:30', NULL),
(14, 'customer_invoices', '14', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0004\"}', '2025-08-13 18:58:30', NULL),
(15, 'deliver_data', 'DEL0005', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:16:52', NULL),
(16, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7499}', '{\"Available_Stock\":7498}', '2025-08-13 19:16:52', NULL),
(17, 'customer_invoices', '15', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0005\"}', '2025-08-13 19:16:52', NULL),
(18, 'deliver_data', 'DEL0006', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:16:58', NULL),
(19, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7498}', '{\"Available_Stock\":7497}', '2025-08-13 19:16:58', NULL),
(20, 'customer_invoices', '16', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0006\"}', '2025-08-13 19:16:58', NULL),
(21, 'deliver_data', 'DEL0007', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:16:59', NULL),
(22, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7497}', '{\"Available_Stock\":7496}', '2025-08-13 19:16:59', NULL),
(23, 'customer_invoices', '17', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0007\"}', '2025-08-13 19:16:59', NULL),
(24, 'deliver_data', 'DEL0008', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:16:59', NULL),
(25, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7496}', '{\"Available_Stock\":7495}', '2025-08-13 19:16:59', NULL),
(26, 'customer_invoices', '18', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0008\"}', '2025-08-13 19:16:59', NULL),
(27, 'deliver_data', 'DEL0009', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:16:59', NULL),
(28, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7495}', '{\"Available_Stock\":7494}', '2025-08-13 19:16:59', NULL),
(29, 'customer_invoices', '19', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0009\"}', '2025-08-13 19:16:59', NULL),
(30, 'deliver_data', 'DEL0010', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:16:59', NULL),
(31, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7494}', '{\"Available_Stock\":7493}', '2025-08-13 19:16:59', NULL),
(32, 'customer_invoices', '20', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0010\"}', '2025-08-13 19:17:00', NULL),
(33, 'deliver_data', 'DEL0011', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:00', NULL),
(34, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7493}', '{\"Available_Stock\":7492}', '2025-08-13 19:17:00', NULL),
(35, 'customer_invoices', '21', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0011\"}', '2025-08-13 19:17:00', NULL),
(36, 'deliver_data', 'DEL0012', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:00', NULL),
(37, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7492}', '{\"Available_Stock\":7491}', '2025-08-13 19:17:00', NULL),
(38, 'customer_invoices', '22', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0012\"}', '2025-08-13 19:17:00', NULL),
(39, 'deliver_data', 'DEL0013', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:00', NULL),
(40, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7491}', '{\"Available_Stock\":7490}', '2025-08-13 19:17:00', NULL),
(41, 'customer_invoices', '23', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0013\"}', '2025-08-13 19:17:00', NULL),
(42, 'deliver_data', 'DEL0014', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:00', NULL),
(43, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7490}', '{\"Available_Stock\":7489}', '2025-08-13 19:17:00', NULL),
(44, 'customer_invoices', '24', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0014\"}', '2025-08-13 19:17:00', NULL),
(45, 'deliver_data', 'DEL0015', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:00', NULL),
(46, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7489}', '{\"Available_Stock\":7488}', '2025-08-13 19:17:00', NULL),
(47, 'customer_invoices', '25', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0015\"}', '2025-08-13 19:17:00', NULL),
(48, 'deliver_data', 'DEL0016', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:01', NULL),
(49, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7488}', '{\"Available_Stock\":7487}', '2025-08-13 19:17:01', NULL),
(50, 'customer_invoices', '26', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0016\"}', '2025-08-13 19:17:01', NULL),
(51, 'deliver_data', 'DEL0017', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:01', NULL),
(52, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7487}', '{\"Available_Stock\":7486}', '2025-08-13 19:17:01', NULL),
(53, 'customer_invoices', '27', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0017\"}', '2025-08-13 19:17:01', NULL),
(54, 'deliver_data', 'DEL0018', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:01', NULL),
(55, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7486}', '{\"Available_Stock\":7485}', '2025-08-13 19:17:01', NULL),
(56, 'customer_invoices', '28', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0018\"}', '2025-08-13 19:17:01', NULL),
(57, 'deliver_data', 'DEL0019', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:01', NULL),
(58, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7485}', '{\"Available_Stock\":7484}', '2025-08-13 19:17:01', NULL),
(59, 'customer_invoices', '29', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0019\"}', '2025-08-13 19:17:01', NULL),
(60, 'deliver_data', 'DEL0020', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:01', NULL),
(61, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7484}', '{\"Available_Stock\":7483}', '2025-08-13 19:17:01', NULL),
(62, 'customer_invoices', '30', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0020\"}', '2025-08-13 19:17:01', NULL),
(63, 'deliver_data', 'DEL0021', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:01', NULL),
(64, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7483}', '{\"Available_Stock\":7482}', '2025-08-13 19:17:01', NULL),
(65, 'customer_invoices', '31', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0021\"}', '2025-08-13 19:17:01', NULL),
(66, 'deliver_data', 'DEL0022', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:02', NULL),
(67, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7482}', '{\"Available_Stock\":7481}', '2025-08-13 19:17:02', NULL),
(68, 'customer_invoices', '32', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0022\"}', '2025-08-13 19:17:02', NULL),
(69, 'deliver_data', 'DEL0023', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:02', NULL),
(70, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7481}', '{\"Available_Stock\":7480}', '2025-08-13 19:17:02', NULL),
(71, 'customer_invoices', '33', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0023\"}', '2025-08-13 19:17:02', NULL),
(72, 'deliver_data', 'DEL0024', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:02', NULL),
(73, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7480}', '{\"Available_Stock\":7479}', '2025-08-13 19:17:02', NULL),
(74, 'customer_invoices', '34', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0024\"}', '2025-08-13 19:17:02', NULL),
(75, 'deliver_data', 'DEL0025', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:02', NULL),
(76, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7479}', '{\"Available_Stock\":7478}', '2025-08-13 19:17:02', NULL),
(77, 'customer_invoices', '35', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0025\"}', '2025-08-13 19:17:02', NULL),
(78, 'deliver_data', 'DEL0026', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:02', NULL),
(79, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7478}', '{\"Available_Stock\":7477}', '2025-08-13 19:17:02', NULL),
(80, 'customer_invoices', '36', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0026\"}', '2025-08-13 19:17:02', NULL),
(81, 'deliver_data', 'DEL0027', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:02', NULL),
(82, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7477}', '{\"Available_Stock\":7476}', '2025-08-13 19:17:02', NULL),
(83, 'customer_invoices', '37', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0027\"}', '2025-08-13 19:17:02', NULL),
(84, 'deliver_data', 'DEL0028', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:03', NULL),
(85, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7476}', '{\"Available_Stock\":7475}', '2025-08-13 19:17:03', NULL),
(86, 'customer_invoices', '38', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0028\"}', '2025-08-13 19:17:03', NULL),
(87, 'deliver_data', 'DEL0029', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:03', NULL),
(88, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7475}', '{\"Available_Stock\":7474}', '2025-08-13 19:17:03', NULL),
(89, 'customer_invoices', '39', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0029\"}', '2025-08-13 19:17:03', NULL),
(90, 'deliver_data', 'DEL0030', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:03', NULL),
(91, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7474}', '{\"Available_Stock\":7473}', '2025-08-13 19:17:03', NULL),
(92, 'customer_invoices', '40', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0030\"}', '2025-08-13 19:17:03', NULL),
(93, 'deliver_data', 'DEL0031', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:03', NULL),
(94, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7473}', '{\"Available_Stock\":7472}', '2025-08-13 19:17:03', NULL),
(95, 'customer_invoices', '41', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0031\"}', '2025-08-13 19:17:03', NULL),
(96, 'deliver_data', 'DEL0032', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:03', NULL),
(97, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7472}', '{\"Available_Stock\":7471}', '2025-08-13 19:17:03', NULL),
(98, 'customer_invoices', '42', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0032\"}', '2025-08-13 19:17:03', NULL),
(99, 'deliver_data', 'DEL0033', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:03', NULL),
(100, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7471}', '{\"Available_Stock\":7470}', '2025-08-13 19:17:03', NULL),
(101, 'customer_invoices', '43', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0033\"}', '2025-08-13 19:17:03', NULL),
(102, 'deliver_data', 'DEL0034', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:04', NULL),
(103, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7470}', '{\"Available_Stock\":7469}', '2025-08-13 19:17:04', NULL),
(104, 'customer_invoices', '44', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0034\"}', '2025-08-13 19:17:04', NULL),
(105, 'deliver_data', 'DEL0035', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:04', NULL),
(106, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7469}', '{\"Available_Stock\":7468}', '2025-08-13 19:17:04', NULL),
(107, 'customer_invoices', '45', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0035\"}', '2025-08-13 19:17:04', NULL),
(108, 'deliver_data', 'DEL0036', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:04', NULL),
(109, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7468}', '{\"Available_Stock\":7467}', '2025-08-13 19:17:04', NULL),
(110, 'customer_invoices', '46', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0036\"}', '2025-08-13 19:17:04', NULL),
(111, 'deliver_data', 'DEL0037', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:04', NULL),
(112, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7467}', '{\"Available_Stock\":7466}', '2025-08-13 19:17:04', NULL),
(113, 'customer_invoices', '47', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0037\"}', '2025-08-13 19:17:04', NULL),
(114, 'deliver_data', 'DEL0038', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:17:04', NULL),
(115, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7466}', '{\"Available_Stock\":7465}', '2025-08-13 19:17:04', NULL),
(116, 'customer_invoices', '48', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0038\"}', '2025-08-13 19:17:04', NULL),
(117, 'deliver_data', 'DEL0039', 'INSERT', NULL, '{\"item_code\":\"ITM004\",\"item_name\":\"Tape04\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:18:51', NULL),
(118, 'item_master_data', 'ITM004', 'UPDATE', '{\"Available_Stock\":200}', '{\"Available_Stock\":199}', '2025-08-13 19:18:51', NULL),
(119, 'customer_invoices', '49', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":600,\"tax_amount\":60,\"grand_total\":660,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM004\",\"item_name\":\"Tape04\",\"quantity\":1,\"unit_price\":600,\"total_price\":600}],\"invoice_no\":\"INV0039\"}', '2025-08-13 19:18:51', NULL),
(120, 'deliver_data', 'DEL0040', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:27:14', NULL),
(121, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7465}', '{\"Available_Stock\":7464}', '2025-08-13 19:27:14', NULL),
(122, 'customer_invoices', '50', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0040\"}', '2025-08-13 19:27:14', NULL),
(123, 'customer_invoices', '51', 'INSERT', NULL, '{\"customer_id\":\"CU0003\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-11\",\"payment_terms\":\"Net 30\",\"total_amount\":500,\"tax_amount\":50,\"grand_total\":550,\"notes\":\"Thank you for your business.\",\"items\":[],\"invoice_no\":\"INV0041\"}', '2025-08-13 19:27:44', NULL),
(124, 'deliver_data', 'DEL0041', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-13\",\"status\":\"Pending\"}', '2025-08-13 19:31:22', NULL),
(125, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7464}', '{\"Available_Stock\":7463}', '2025-08-13 19:31:22', NULL),
(126, 'customer_invoices', '52', 'INSERT', NULL, '{\"customer_id\":\"CU0007\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-13\",\"payment_terms\":\"Net 14\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Thank you for your business!\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0042\"}', '2025-08-13 19:31:22', NULL),
(127, 'deliver_data', 'DEL0042', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-14\",\"status\":\"Pending\"}', '2025-08-14 13:55:31', NULL),
(128, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7463}', '{\"Available_Stock\":7462}', '2025-08-14 13:55:31', NULL),
(129, 'customer_invoices', '53', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-14\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Yes\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0043\"}', '2025-08-14 13:55:31', NULL),
(130, 'deliver_data', 'DEL0043', 'INSERT', NULL, '{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"date\":\"2025-08-14\",\"status\":\"Pending\"}', '2025-08-14 13:55:44', NULL),
(131, 'item_master_data', 'ITM001', 'UPDATE', '{\"Available_Stock\":7462}', '{\"Available_Stock\":7461}', '2025-08-14 13:55:44', NULL),
(132, 'customer_invoices', '54', 'INSERT', NULL, '{\"customer_id\":\"CU0001\",\"user_id\":\"U0003\",\"invoice_date\":\"2025-08-14\",\"payment_terms\":\"Net 30\",\"total_amount\":250,\"tax_amount\":25,\"grand_total\":275,\"notes\":\"Yes\",\"items\":[{\"item_code\":\"ITM001\",\"item_name\":\"Tape01\",\"quantity\":1,\"unit_price\":250,\"total_price\":250}],\"invoice_no\":\"INV0044\"}', '2025-08-14 13:55:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `certificate_alert_config`
--

CREATE TABLE `certificate_alert_config` (
  `id` int(11) NOT NULL DEFAULT 1,
  `advance_months` int(11) DEFAULT 6,
  `enabled` tinyint(1) DEFAULT 1,
  `email_notifications` tinyint(1) DEFAULT 1,
  `sms_notifications` tinyint(1) DEFAULT 0,
  `notification_frequency` enum('daily','weekly','monthly') DEFAULT 'daily',
  `last_run` datetime DEFAULT NULL,
  `next_run` datetime DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificate_alert_config`
--

INSERT INTO `certificate_alert_config` (`id`, `advance_months`, `enabled`, `email_notifications`, `sms_notifications`, `notification_frequency`, `last_run`, `next_run`, `updated_at`) VALUES
(1, 6, 1, 1, 0, 'daily', NULL, NULL, '2025-08-06 03:26:55');

-- --------------------------------------------------------

--
-- Table structure for table `certificate_alert_history`
--

CREATE TABLE `certificate_alert_history` (
  `id` int(11) NOT NULL,
  `notification_id` varchar(10) DEFAULT NULL,
  `reg_id` varchar(10) DEFAULT NULL,
  `certificate_name` varchar(255) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `alert_date` date DEFAULT NULL,
  `advance_months` int(11) DEFAULT NULL,
  `action_taken` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certification_expiry_notification`
--

CREATE TABLE `certification_expiry_notification` (
  `Notification_ID` varchar(10) NOT NULL,
  `Reg_Id` varchar(25) NOT NULL,
  `Certification_Name` varchar(50) DEFAULT NULL,
  `Expiry_Date` date NOT NULL,
  `Notification_Status` varchar(15) DEFAULT NULL,
  `Alert_Date` date DEFAULT NULL,
  `Advance_Months` int(11) DEFAULT 6,
  `Email_Sent` tinyint(1) DEFAULT 0,
  `SMS_Sent` tinyint(1) DEFAULT 0,
  `Reminder_Count` int(11) DEFAULT 0,
  `Last_Reminder_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certification_expiry_notification`
--

INSERT INTO `certification_expiry_notification` (`Notification_ID`, `Reg_Id`, `Certification_Name`, `Expiry_Date`, `Notification_Status`, `Alert_Date`, `Advance_Months`, `Email_Sent`, `SMS_Sent`, `Reminder_Count`, `Last_Reminder_Date`) VALUES
('N0001', 'REG001', 'Fire Safety Certificate', '2025-12-31', 'Active', NULL, 6, 0, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `certification_report`
--

CREATE TABLE `certification_report` (
  `Reg_Id` varchar(25) NOT NULL,
  `Certificate_Name` varchar(50) DEFAULT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Expiry_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certification_report`
--

INSERT INTO `certification_report` (`Reg_Id`, `Certificate_Name`, `Item_Code`, `Item_Name`, `Expiry_Date`) VALUES
('REG0003', 'PMPMP', 'ITM005', 'Tape02', '2025-08-18'),
('REG0004', 'PMPMP', 'ITM004', 'Tape04', '2025-08-28'),
('REG001', 'PMP', 'ITM005', 'TAPE02', '2025-08-29'),
('REG0010', 'Medicine-Testing', 'ITM100', 'Heart-Medicine', '2025-08-29');

-- --------------------------------------------------------

--
-- Table structure for table `customer_data`
--

CREATE TABLE `customer_data` (
  `Customer_ID` varchar(10) NOT NULL,
  `Name` varchar(25) DEFAULT NULL,
  `Email` varchar(25) DEFAULT NULL,
  `Phone` varchar(10) DEFAULT NULL,
  `Address` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_data`
--

INSERT INTO `customer_data` (`Customer_ID`, `Name`, `Email`, `Phone`, `Address`) VALUES
('CU0001', 'Heshan ', 'heshan@example.com', '2147483649', 'No. 10, Negombo Road, Negombo'),
('CU0002', 'Nimal Perera', 'nimalp@example.com', '0771234567', '753'),
('CU0004', 'Dinithi Samarasinghe', 'dinithi.s@example.com', '0712345678', '45 Kandy Street, Kandy'),
('CU0005', 'Kasun Jayasuriya', 'kasunj@example.com', '0759876543', '789 Matara Lane, Matara'),
('CU0006', 'Harshani Gunawardena', 'harshani.g@example.com', '0784563210', 'No. 10, Negombo Road, Negombo'),
('CU0007', 'Heshan Deemantha', 'hesha99@gmail.com', '0776171219', '282/4 pitipana south,koswaththa,kiriwaththuduwa');

-- --------------------------------------------------------

--
-- Table structure for table `customer_invoices`
--

CREATE TABLE `customer_invoices` (
  `Invoice_ID` int(11) NOT NULL,
  `Invoice_No` varchar(50) NOT NULL,
  `Sales_Order_ID` varchar(10) DEFAULT NULL,
  `Customer_ID` varchar(10) NOT NULL,
  `User_ID` varchar(10) NOT NULL,
  `Invoice_Date` date NOT NULL,
  `Payment_Terms` varchar(50) DEFAULT NULL,
  `Total_Amount` decimal(12,2) DEFAULT 0.00,
  `Tax_Amount` decimal(12,2) DEFAULT 0.00,
  `Grand_Total` decimal(12,2) DEFAULT 0.00,
  `Notes` text DEFAULT NULL,
  `Created_At` datetime DEFAULT current_timestamp(),
  `status` enum('PAID','OVERDUE','PENDING') NOT NULL DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_invoices`
--

INSERT INTO `customer_invoices` (`Invoice_ID`, `Invoice_No`, `Sales_Order_ID`, `Customer_ID`, `User_ID`, `Invoice_Date`, `Payment_Terms`, `Total_Amount`, `Tax_Amount`, `Grand_Total`, `Notes`, `Created_At`, `status`) VALUES
(3, 'INV0001', NULL, 'CU0001', 'U0001', '2025-08-11', 'Net 30', 500.00, 50.00, 550.00, 'Thank you for your business!', '2025-08-11 16:29:05', 'PENDING'),
(12, 'INV0002', NULL, 'CU0002', 'U0002', '2025-08-11', 'Net 30', 500.00, 50.00, 550.00, 'Thank you for your business.', '2025-08-12 18:47:09', 'PENDING'),
(13, 'INV0003', NULL, 'CU0002', 'U0002', '2025-08-11', 'Net 30', 500.00, 50.00, 550.00, 'Thank you for your business.', '2025-08-13 18:41:24', 'PENDING'),
(14, 'INV0004', NULL, 'CU0001', 'U0003', '2025-08-13', 'Net 30', 250.00, 25.00, 275.00, 'Thank you for your business!', '2025-08-13 18:58:30', 'PENDING'),
(15, 'INV0005', NULL, 'CU0001', 'U0003', '2025-08-13', 'Net 30', 250.00, 25.00, 275.00, 'Thank you for your business!', '2025-08-13 19:16:52', 'PENDING'),
(16, 'INV0006', NULL, 'CU0001', 'U0003', '2025-08-13', 'Net 30', 250.00, 25.00, 275.00, 'Thank you for your business!', '2025-08-13 19:16:58', 'PENDING'),
(17, 'INV0007', NULL, 'CU0001', 'U0003', '2025-08-13', 'Net 30', 250.00, 25.00, 275.00, 'Thank you for your business!', '2025-08-13 19:16:59', 'PENDING'),
(18, 'INV0008', NULL, 'CU0001', 'U0003', '2025-08-13', 'Net 30', 250.00, 25.00, 275.00, 'Thank you for your business!', '2025-08-13 19:16:59', 'PENDING'),
(19, 'INV0009', NULL, 'CU0001', 'U0003', '2025-08-13', 'Net 30', 250.00, 25.00, 275.00, 'Thank you for your business!', '2025-08-13 19:16:59', 'PENDING'),
(36, 'INV0026', NULL, 'CU0001', 'U0003', '2025-08-13', 'Net 30', 250.00, 25.00, 275.00, 'Thank you for your business!', '2025-08-13 19:17:02', 'PENDING'),
(37, 'INV0027', NULL, 'CU0001', 'U0003', '2025-08-13', 'Net 30', 250.00, 25.00, 275.00, 'Thank you for your business!', '2025-08-13 19:17:02', 'PENDING'),
(38, 'INV0028', NULL, 'CU0001', 'U0003', '2025-08-13', 'Net 30', 250.00, 25.00, 275.00, 'Thank you for your business!', '2025-08-13 19:17:03', 'PENDING'),
(39, 'INV0029', NULL, 'CU0001', 'U0003', '2025-08-13', 'Net 30', 250.00, 25.00, 275.00, 'Thank you for your business!', '2025-08-13 19:17:03', 'PENDING'),
(40, 'INV0030', NULL, 'CU0001', 'U0003', '2025-08-13', 'Net 30', 250.00, 25.00, 275.00, 'Thank you for your business!', '2025-08-13 19:17:03', 'PENDING'),
(53, 'INV0043', NULL, 'CU0001', 'U0003', '2025-08-14', 'Net 30', 250.00, 25.00, 275.00, 'Yes', '2025-08-14 13:55:31', 'PENDING'),
(54, 'INV0044', NULL, 'CU0001', 'U0003', '2025-08-14', 'Net 30', 250.00, 25.00, 275.00, 'Yes', '2025-08-14 13:55:44', 'PENDING');

-- --------------------------------------------------------

--
-- Table structure for table `deliver_data`
--

CREATE TABLE `deliver_data` (
  `Deliver_Id` varchar(10) NOT NULL,
  `Sales_Order_ID` varchar(10) DEFAULT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Date` date NOT NULL,
  `Status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deliver_data`
--

INSERT INTO `deliver_data` (`Deliver_Id`, `Sales_Order_ID`, `Item_Code`, `Item_Name`, `Quantity`, `Date`, `Status`) VALUES
('D0002', 'S0002', 'ITM002', 'Tape02', NULL, '2025-08-03', 'PENDING'),
('D001', 'SO001', 'ITM002', 'Tape02', 10, '0000-00-00', 'sent'),
('DEL0001', 'SO0000', 'ITM004', 'Tape02', 3, '2025-08-11', 'Pending'),
('DEL0002', 'SO0000', 'ITM005', 'Tape02', 45, '2025-08-11', 'Pending'),
('DEL0003', 'SO0000', 'ITM004', 'Tape02', 18, '2025-08-11', 'Pending'),
('DEL0004', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0005', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0006', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0007', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0008', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0009', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0010', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0011', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0012', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0013', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0014', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0015', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0016', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0017', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0018', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0019', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0020', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0021', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0022', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0023', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0024', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0025', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0026', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0027', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0028', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0029', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0030', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0031', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0032', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0033', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0034', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0035', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0036', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0037', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0038', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0039', 'SO0000', 'ITM004', 'Tape04', 1, '2025-08-13', 'Pending'),
('DEL0040', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0041', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-13', 'Pending'),
('DEL0042', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-14', 'Pending'),
('DEL0043', 'SO0000', 'ITM001', 'Tape01', 1, '2025-08-14', 'Pending'),
('DEL0NaN', 'SO0000', 'ITM005', 'Tape02', 15, '2025-08-11', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `expiry_notification_data`
--

CREATE TABLE `expiry_notification_data` (
  `Notification_ID` varchar(10) NOT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 0,
  `Expiry_Date` date NOT NULL,
  `Notification_Status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expiry_notification_data`
--

INSERT INTO `expiry_notification_data` (`Notification_ID`, `Item_Code`, `Item_Name`, `Quantity`, `Expiry_Date`, `Notification_Status`) VALUES
('NTF001', 'ITM005', 'Tape02', 25, '2025-08-10', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `good_issues_data`
--

CREATE TABLE `good_issues_data` (
  `Good_Issue_Id` varchar(25) NOT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 0,
  `Issued_Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `good_issues_data`
--

INSERT INTO `good_issues_data` (`Good_Issue_Id`, `Item_Code`, `Item_Name`, `Quantity`, `Issued_Date`) VALUES
('GI0002', 'ITM005', 'Tape02', 50, '2025-08-05'),
('GI0003', 'ITM005', 'Tape02', 300, '2025-08-05'),
('GI0004', 'ITM005', 'Tape02', 25, '2025-08-05'),
('GI0005', 'ITM004', 'Tape04', 25, '2025-08-06'),
('GI0006', 'ITM005', 'Tape02', 25, '2025-08-07'),
('GI0007', 'ITM005', 'Tape02', 50, '2025-08-09'),
('GI0008', 'ITM004', 'Tape04', 12, '2025-08-13'),
('GI0009', 'ITM004', 'Tape04', 30, '2025-08-22');

-- --------------------------------------------------------

--
-- Table structure for table `good_receipts_data`
--

CREATE TABLE `good_receipts_data` (
  `GRN_ID` varchar(10) NOT NULL,
  `Po_Id` varchar(10) DEFAULT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Unit_Price` double DEFAULT NULL,
  `Total_Amount` double DEFAULT NULL,
  `MF_Date` date DEFAULT NULL,
  `Status` varchar(25) DEFAULT NULL,
  `Ex_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `good_receipts_data`
--

INSERT INTO `good_receipts_data` (`GRN_ID`, `Po_Id`, `Item_Code`, `Item_Name`, `Quantity`, `Unit_Price`, `Total_Amount`, `MF_Date`, `Status`, `Ex_Date`) VALUES
('GR0001', 'P0001', 'ITM005', 'Tape02', 150, 12.5, 1875, '2025-07-15', 'Received', '2026-07-15'),
('GR0002', 'P0002', 'ITM004', 'Tape04', 50, 45, 2250, '2025-08-07', 'RECEIVED', '2025-08-28'),
('GR0003', '-', 'ITM004', 'Tape04', 103, 459, 47277, '2025-08-13', 'RECEIVED', '2025-08-27'),
('GR0004', 'P0002', 'ITM004', 'Tape04', 4, 425, 1700, '2025-08-13', 'RECEIVED', '2025-08-28'),
('GR0005', 'P0003', 'ITM005', 'Tape02', 60, 20, 1200, '2025-08-14', 'RECEIVED', '2025-08-14'),
('GR0006', 'P0003', 'ITM005', 'Tape02', 20, 250, 5000, '2025-08-14', 'RECEIVED', '2025-09-25');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `Invoice_Item_ID` int(11) NOT NULL,
  `Invoice_ID` int(11) NOT NULL,
  `Item_Code` varchar(10) NOT NULL,
  `Item_Name` varchar(50) NOT NULL,
  `Quantity` decimal(12,2) NOT NULL,
  `Unit_Price` decimal(12,2) NOT NULL,
  `Total_Price` decimal(12,2) NOT NULL,
  `SR_No` varchar(50) DEFAULT NULL,
  `MF_Date` date DEFAULT NULL,
  `Ex_Date` date DEFAULT NULL,
  `Batch_No` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`Invoice_Item_ID`, `Invoice_ID`, `Item_Code`, `Item_Name`, `Quantity`, `Unit_Price`, `Total_Price`, `SR_No`, `MF_Date`, `Ex_Date`, `Batch_No`) VALUES
(2, 3, 'ITM005', 'Tape02', 2.00, 100.00, 200.00, 'SR12345', '2025-01-01', '2026-01-01', 'BATCH001'),
(3, 3, 'ITM004', 'Tape04', 3.00, 100.00, 300.00, NULL, NULL, NULL, NULL),
(12, 12, 'ITM005', 'Tape02', 45.00, 100.00, 4500.00, NULL, NULL, NULL, NULL),
(13, 12, 'ITM004', 'Tape02', 18.00, 100.00, 1800.00, NULL, NULL, NULL, NULL),
(14, 14, 'ITM001', 'Tape01', 1.00, 250.00, 250.00, NULL, NULL, NULL, NULL),
(15, 15, 'ITM001', 'Tape01', 1.00, 250.00, 250.00, NULL, NULL, NULL, NULL),
(16, 16, 'ITM001', 'Tape01', 1.00, 250.00, 250.00, NULL, NULL, NULL, NULL),
(17, 17, 'ITM001', 'Tape01', 1.00, 250.00, 250.00, NULL, NULL, NULL, NULL),
(18, 18, 'ITM001', 'Tape01', 1.00, 250.00, 250.00, NULL, NULL, NULL, NULL),
(19, 19, 'ITM001', 'Tape01', 1.00, 250.00, 250.00, NULL, NULL, NULL, NULL),
(36, 36, 'ITM001', 'Tape01', 1.00, 250.00, 250.00, NULL, NULL, NULL, NULL),
(37, 37, 'ITM001', 'Tape01', 1.00, 250.00, 250.00, NULL, NULL, NULL, NULL),
(38, 38, 'ITM001', 'Tape01', 1.00, 250.00, 250.00, NULL, NULL, NULL, NULL),
(39, 39, 'ITM001', 'Tape01', 1.00, 250.00, 250.00, NULL, NULL, NULL, NULL),
(40, 40, 'ITM001', 'Tape01', 1.00, 250.00, 250.00, NULL, NULL, NULL, NULL),
(52, 53, 'ITM001', 'Tape01', 1.00, 250.00, 250.00, NULL, NULL, NULL, NULL),
(53, 54, 'ITM001', 'Tape01', 1.00, 250.00, 250.00, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `item_master_data`
--

CREATE TABLE `item_master_data` (
  `Item_Code` varchar(10) NOT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Brand` varchar(10) DEFAULT NULL,
  `Size` varchar(10) DEFAULT NULL,
  `Available_Stock` int(10) NOT NULL DEFAULT 0,
  `Price` double NOT NULL DEFAULT 0,
  `Country` varchar(15) DEFAULT NULL,
  `Created_Date` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_master_data`
--

INSERT INTO `item_master_data` (`Item_Code`, `Item_Name`, `Brand`, `Size`, `Available_Stock`, `Price`, `Country`, `Created_Date`) VALUES
('ITM001', 'Tape01', 'Nike', 'Large', 7461, 250, 'China', '2025-08-13'),
('ITM004', 'Tape04', 'Nike', 'Small', 169, 600, 'USA', '2025-08-04'),
('ITM005', 'Tape02', 'Hero', '18*15', 220, 2500.25, 'Argentina', '2025-07-25'),
('ITM100', 'Heart-Medicine', 'Panadol', 'Small', 25, 8000, 'USA', '2025-08-14');

-- --------------------------------------------------------

--
-- Table structure for table `item_movement_report`
--

CREATE TABLE `item_movement_report` (
  `Report_Id` varchar(10) NOT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Deliver_Id` varchar(25) DEFAULT NULL,
  `Item_Name` varchar(100) DEFAULT NULL,
  `Total_Movement` int(11) DEFAULT NULL,
  `Last_Movement_Date` date DEFAULT NULL,
  `Days_Since_Movement` int(11) DEFAULT NULL,
  `Category` enum('Fast','Slow') DEFAULT NULL,
  `Report_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_movement_report`
--

INSERT INTO `item_movement_report` (`Report_Id`, `Item_Code`, `Deliver_Id`, `Item_Name`, `Total_Movement`, `Last_Movement_Date`, `Days_Since_Movement`, `Category`, `Report_Date`) VALUES
('RPT001', 'ITM005', 'D001', 'TAPE02', 100, '2024-07-20', 5, 'Fast', '2024-07-25');

-- --------------------------------------------------------

--
-- Table structure for table `low_stock_notification_data`
--

CREATE TABLE `low_stock_notification_data` (
  `Notification_Id` varchar(11) NOT NULL,
  `Item_Code` varchar(25) NOT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Current_Qty` int(11) NOT NULL DEFAULT 0,
  `Reorder_level` int(11) DEFAULT NULL,
  `Notification_Status` varchar(100) DEFAULT NULL,
  `Notification_Date` date NOT NULL,
  `Email` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order`
--

CREATE TABLE `purchase_order` (
  `Po_Id` varchar(10) NOT NULL,
  `Created_Date` date NOT NULL,
  `Location` varchar(15) DEFAULT NULL,
  `Supplier_Id` varchar(10) DEFAULT NULL,
  `Supplier_Name` varchar(15) DEFAULT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Item_Name` varchar(15) DEFAULT NULL,
  `Price` double DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `DisValue` double DEFAULT NULL,
  `TotValue` double DEFAULT NULL,
  `Status` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_order`
--

INSERT INTO `purchase_order` (`Po_Id`, `Created_Date`, `Location`, `Supplier_Id`, `Supplier_Name`, `Item_Code`, `Item_Name`, `Price`, `Quantity`, `DisValue`, `TotValue`, `Status`) VALUES
('P0001', '2025-08-06', 'Colombo Warehou', 'SUP0001', 'Heshan', 'ITM004', 'Tape04', 450, 100, 1500, 43500, 'Rejected'),
('P0002', '2025-08-13', 'Colombo Warehou', 'SUP0001', 'Heshan', 'ITM005', 'Tape02', 450, 100, 0, 45000, 'Rejected'),
('P0003', '2025-08-09', 'Hoamgama', 'SUP0003', 'Heshan', 'ITM005', 'Tape02', 53, 42, 142, 2084, 'Completed'),
('P0004', '2025-08-11', 'Colombo Warehou', 'SUP0001', 'Heshan', 'ITM004', 'Tape04', 425, 752, 4582, 315018, 'Pending'),
('P0005', '2025-08-13', 'Sri Lanka', 'SUP0005', 'Heshan', 'ITM001', 'Tape01', 425, 752, 425, 319175, 'Approved'),
('P0006', '2025-08-14', 'Gampaha', 'SUP0006', 'Rumeshika', 'ITM005', 'Tape02', 10000, 80, 0, 800000, 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `quatation_data`
--

CREATE TABLE `quatation_data` (
  `Quatation_Id` varchar(10) NOT NULL,
  `Customer_Name` varchar(25) DEFAULT NULL,
  `Date_Created` date NOT NULL,
  `Valid_Until` date NOT NULL,
  `Status` varchar(100) NOT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Quantity` int(11) NOT NULL,
  `Total_Amount` double NOT NULL,
  `Discount` double NOT NULL,
  `Grand_Total` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quatation_data`
--

INSERT INTO `quatation_data` (`Quatation_Id`, `Customer_Name`, `Date_Created`, `Valid_Until`, `Status`, `Item_Code`, `Item_Name`, `Quantity`, `Total_Amount`, `Discount`, `Grand_Total`) VALUES
('Q0001', 'Heshan', '2025-08-13', '2025-08-27', 'Rejected', 'ITM005', 'Tape02', 5, 1000, 100, 4900),
('Q0003', 'Heshan ', '2025-08-08', '2025-08-28', 'Approved', 'ITM004', 'Tape04', 32, 1.24, 1.16, 38.52);

-- --------------------------------------------------------

--
-- Table structure for table `return_orders`
--

CREATE TABLE `return_orders` (
  `Return_Order_ID` varchar(10) NOT NULL,
  `Sales_Order_ID` int(11) NOT NULL,
  `Customer_ID` int(11) NOT NULL,
  `Return_Date` date NOT NULL,
  `Return_Status` enum('Pending','Approved','Rejected','Completed','Cancelled') DEFAULT 'Pending',
  `Refund_Amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `return_order_items`
--

CREATE TABLE `return_order_items` (
  `Return_Order_Item_ID` int(11) NOT NULL,
  `Return_Order_ID` varchar(10) NOT NULL,
  `Sales_Order_Item_ID` int(11) NOT NULL,
  `Item_Code` varchar(10) NOT NULL,
  `Item_Name` varchar(150) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1,
  `Unit_Price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `Total_Amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `Remarks` text DEFAULT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_orders`
--

CREATE TABLE `sales_orders` (
  `Sales_Order_ID` varchar(10) NOT NULL,
  `Customer_ID` varchar(10) NOT NULL,
  `Customer_Name` varchar(100) NOT NULL,
  `Customer_Address` varchar(255) DEFAULT NULL,
  `Customer_Phone` varchar(20) DEFAULT NULL,
  `Order_Date` date NOT NULL,
  `Delivery_Date` date DEFAULT NULL,
  `Payment_Terms` varchar(50) DEFAULT NULL,
  `Total_Amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `Tax_Amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `Discount_Amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `Net_Amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `Status` varchar(50) DEFAULT NULL,
  `Remarks` text DEFAULT NULL,
  `User_ID` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_orders`
--

INSERT INTO `sales_orders` (`Sales_Order_ID`, `Customer_ID`, `Customer_Name`, `Customer_Address`, `Customer_Phone`, `Order_Date`, `Delivery_Date`, `Payment_Terms`, `Total_Amount`, `Tax_Amount`, `Discount_Amount`, `Net_Amount`, `Status`, `Remarks`, `User_ID`) VALUES
('SO0001', 'CU0002', 'Nimal Perera', '753', '0771234567', '2025-08-09', NULL, 'Net 30', 4500.00, 0.00, 0.00, 4500.00, 'PENDING', '', 'SYSTEM'),
('SO0002', 'CU0001', 'Heshan ', '456', '2147483647', '2025-08-06', '2025-08-27', 'Net 30', 945.00, 94.50, 0.00, 1039.50, 'Delivered', 'sdfghjkl', 'U0003'),
('SO0003', 'CU0001', 'Heshan ', '456', '2147483647', '2025-08-13', NULL, '', 0.00, 0.00, 0.00, 0.00, 'Pending', 'thanks', 'U0003'),
('SO0004', 'CU0004', 'Dinithi Samarasinghe', '45 Kandy Street, Kandy', '0712345678', '2025-08-14', '2025-08-28', 'Check', 8000.00, 750.00, 500.00, 8250.00, 'Confirmed', 'Testing', 'U0001'),
('SO0005', 'CU0007', 'Heshan Deemantha', '282/4 pitipana south,koswaththa,kiriwaththuduwa', '0776171219', '2025-08-14', '2025-08-21', 'Check', 66725.00, 6672.50, 0.00, 73397.50, 'Pending', 'hello', 'U0001');

-- --------------------------------------------------------

--
-- Table structure for table `sales_order_items`
--

CREATE TABLE `sales_order_items` (
  `Sales_Order_Item_ID` int(11) NOT NULL,
  `Sales_Order_ID` varchar(10) NOT NULL,
  `Item_Code` varchar(10) NOT NULL,
  `Item_Name` varchar(150) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1,
  `Unit_Price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `Total_Price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `Remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_order_items`
--

INSERT INTO `sales_order_items` (`Sales_Order_Item_ID`, `Sales_Order_ID`, `Item_Code`, `Item_Name`, `Quantity`, `Unit_Price`, `Total_Price`, `Remarks`) VALUES
(5, 'SO0002', 'ITM005', 'Tape02', 15, 15.00, 225.00, ''),
(6, 'SO0002', 'ITM004', 'Tape04', 15, 48.00, 720.00, ''),
(10, 'SO0003', 'ITM001', 'Tape01', 1, 0.00, 0.00, ''),
(13, 'SO0004', 'ITM005', 'Tape02', 15, 500.00, 7500.00, ''),
(14, 'SO0004', 'ITM001', 'Tape01', 1, 500.00, 500.00, ''),
(15, 'SO0005', 'ITM001', 'Tape01', 157, 425.00, 66725.00, '');

-- --------------------------------------------------------

--
-- Table structure for table `sequences`
--

CREATE TABLE `sequences` (
  `name` varchar(50) NOT NULL,
  `next_id` bigint(20) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sequences`
--

INSERT INTO `sequences` (`name`, `next_id`) VALUES
('deliver_id', 43),
('invoice_no', 44);

-- --------------------------------------------------------

--
-- Table structure for table `supplier_data`
--

CREATE TABLE `supplier_data` (
  `Supplier_Id` varchar(10) NOT NULL,
  `Supplier_Name` varchar(25) DEFAULT NULL,
  `Country` varchar(15) DEFAULT NULL,
  `Email` varchar(25) DEFAULT NULL,
  `Phone` varchar(10) DEFAULT NULL,
  `Address` varchar(100) DEFAULT NULL,
  `Status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier_data`
--

INSERT INTO `supplier_data` (`Supplier_Id`, `Supplier_Name`, `Country`, `Email`, `Phone`, `Address`, `Status`) VALUES
('SUP0001', 'Heshan', 'Sri lanka', 'heshan@example.com', '077123456', '250/5 galle road,bambalapitiya', 'pending'),
('SUP0003', 'Heshan', 'USA', 'heshandeemantha99@gmail.c', '011215487', '125 Galle road,Colombo', 'Active'),
('SUP0004', 'Heshan', 'Japan', 'heshandeemantha99@gmail.c', '0776171219', '282/4 pitipana south,koswaththa,kiriwaththuduwa', 'Active'),
('SUP0005', 'Heshan', 'Germany', 'heshandeemanth@gmail.com', '0776171219', '282/4 pitipana south,koswaththa,kiriwaththuduwa', 'Active'),
('SUP0006', 'Rumeshika', 'USA', 'rumeshikarunajeewa@gmail.', '0761766990', 'N0 4061 Ashokpitilya ,Gallewela', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `supplier_invoice_data`
--

CREATE TABLE `supplier_invoice_data` (
  `In_No` varchar(25) NOT NULL,
  `Po_Id` varchar(10) DEFAULT NULL,
  `Supplier_Id` varchar(25) DEFAULT NULL,
  `Supplier_Name` varchar(25) DEFAULT NULL,
  `Item_Code` varchar(15) DEFAULT NULL,
  `Item_Name` varchar(25) NOT NULL,
  `Pack_Size` int(11) DEFAULT NULL,
  `Total_Amount` double DEFAULT NULL,
  `Status` varchar(25) NOT NULL,
  `Created_Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier_invoice_data`
--

INSERT INTO `supplier_invoice_data` (`In_No`, `Po_Id`, `Supplier_Id`, `Supplier_Name`, `Item_Code`, `Item_Name`, `Pack_Size`, `Total_Amount`, `Status`, `Created_Date`) VALUES
('SI0001', 'P0001', 'SUP0001', 'Heshan', 'ITM005', 'Tape02', 20, 150000, 'Pending', '2025-08-04'),
('SI0002', 'P0001', 'SUP0001', 'Heshan', 'ITM004', 'Tape04', 20, 200, 'Completed', '2025-08-04');

-- --------------------------------------------------------

--
-- Table structure for table `user_data`
--

CREATE TABLE `user_data` (
  `User_ID` varchar(10) NOT NULL,
  `Name` varchar(25) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `Profile_Picture` varchar(10000) DEFAULT NULL,
  `User_Address` varchar(100) DEFAULT NULL,
  `Status` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_data`
--

INSERT INTO `user_data` (`User_ID`, `Name`, `Email`, `Password`, `Profile_Picture`, `User_Address`, `Status`) VALUES
('U0001', 'Heshan Deemantha', 'heshan@example.com', '1234', 'https://www.canva.com/icons/MAEGkZHHSyM-user-profile-illustration/', '123 Main Street, Colombo, Sri Lanka', ''),
('U0002', 'lkjhgfds', 'lkjhgfd', '$2b$10$BsV', 'https://www.canva.com/icons/MAEGkZHHSyM-user-profile-illustration/', '123 Main Street, Colombo, Sri Lanka', ''),
('U0003', 'Damith', 'Deheshan@example.com', '$2b$10$nCW', 'https://www.canva.com/icons/MAEGkZHHSyM-user-profile-illustration/', '123 Main Street, Colombo, Sri Lanka', 'active'),
('U0004', 'Heshan', 'heshandeemantha99@gmail.com', 'Heshan@2002', 'https://example.com/images/john-doe.jpg', '123 Main Street, Springfield, USA', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `user_settings`
--

CREATE TABLE `user_settings` (
  `Setting_ID` int(11) NOT NULL,
  `User_ID` varchar(10) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `isEnabled` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_table_name` (`table_name`),
  ADD KEY `idx_record_id` (`record_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `certificate_alert_config`
--
ALTER TABLE `certificate_alert_config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `certificate_alert_history`
--
ALTER TABLE `certificate_alert_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notification_id` (`notification_id`);

--
-- Indexes for table `certification_expiry_notification`
--
ALTER TABLE `certification_expiry_notification`
  ADD PRIMARY KEY (`Notification_ID`),
  ADD UNIQUE KEY `Cerificate_Id` (`Reg_Id`(10)),
  ADD KEY `idx_notification_status` (`Notification_Status`),
  ADD KEY `idx_notification_reg_id` (`Reg_Id`);

--
-- Indexes for table `certification_report`
--
ALTER TABLE `certification_report`
  ADD PRIMARY KEY (`Reg_Id`),
  ADD KEY `Item_Code` (`Item_Code`),
  ADD KEY `idx_cert_expiry_date` (`Expiry_Date`),
  ADD KEY `idx_item_code` (`Item_Code`);

--
-- Indexes for table `customer_data`
--
ALTER TABLE `customer_data`
  ADD PRIMARY KEY (`Customer_ID`);

--
-- Indexes for table `customer_invoices`
--
ALTER TABLE `customer_invoices`
  ADD PRIMARY KEY (`Invoice_ID`),
  ADD UNIQUE KEY `Invoice_No` (`Invoice_No`),
  ADD KEY `Customer_ID` (`Customer_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `fk_customer_invoices_sales_order` (`Sales_Order_ID`);

--
-- Indexes for table `deliver_data`
--
ALTER TABLE `deliver_data`
  ADD PRIMARY KEY (`Deliver_Id`);

--
-- Indexes for table `expiry_notification_data`
--
ALTER TABLE `expiry_notification_data`
  ADD PRIMARY KEY (`Notification_ID`),
  ADD KEY `Item_Code` (`Item_Code`);

--
-- Indexes for table `good_issues_data`
--
ALTER TABLE `good_issues_data`
  ADD PRIMARY KEY (`Good_Issue_Id`(10)),
  ADD KEY `Item_Code` (`Item_Code`);

--
-- Indexes for table `good_receipts_data`
--
ALTER TABLE `good_receipts_data`
  ADD PRIMARY KEY (`GRN_ID`),
  ADD KEY `Item_Code` (`Item_Code`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`Invoice_Item_ID`),
  ADD KEY `Invoice_ID` (`Invoice_ID`),
  ADD KEY `Item_Code` (`Item_Code`);

--
-- Indexes for table `item_master_data`
--
ALTER TABLE `item_master_data`
  ADD PRIMARY KEY (`Item_Code`);

--
-- Indexes for table `item_movement_report`
--
ALTER TABLE `item_movement_report`
  ADD PRIMARY KEY (`Report_Id`),
  ADD KEY `Item_Code` (`Item_Code`),
  ADD KEY `fk_deliver_id` (`Deliver_Id`);

--
-- Indexes for table `low_stock_notification_data`
--
ALTER TABLE `low_stock_notification_data`
  ADD PRIMARY KEY (`Notification_Id`),
  ADD KEY `Item_Code` (`Item_Code`);

--
-- Indexes for table `purchase_order`
--
ALTER TABLE `purchase_order`
  ADD PRIMARY KEY (`Po_Id`),
  ADD KEY `Supplier_Id` (`Supplier_Id`);

--
-- Indexes for table `quatation_data`
--
ALTER TABLE `quatation_data`
  ADD PRIMARY KEY (`Quatation_Id`),
  ADD KEY `idx_item_code` (`Item_Code`);

--
-- Indexes for table `return_orders`
--
ALTER TABLE `return_orders`
  ADD PRIMARY KEY (`Return_Order_ID`),
  ADD KEY `idx_sales_order` (`Sales_Order_ID`),
  ADD KEY `idx_customer` (`Customer_ID`),
  ADD KEY `idx_return_date` (`Return_Date`),
  ADD KEY `idx_status` (`Return_Status`),
  ADD KEY `idx_created_at` (`Created_At`);

--
-- Indexes for table `return_order_items`
--
ALTER TABLE `return_order_items`
  ADD PRIMARY KEY (`Return_Order_Item_ID`);

--
-- Indexes for table `sales_orders`
--
ALTER TABLE `sales_orders`
  ADD PRIMARY KEY (`Sales_Order_ID`),
  ADD KEY `fk_sales_customer` (`Customer_ID`);

--
-- Indexes for table `sales_order_items`
--
ALTER TABLE `sales_order_items`
  ADD PRIMARY KEY (`Sales_Order_Item_ID`),
  ADD KEY `fk_sales_order` (`Sales_Order_ID`),
  ADD KEY `fk_sales_item` (`Item_Code`);

--
-- Indexes for table `sequences`
--
ALTER TABLE `sequences`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `supplier_data`
--
ALTER TABLE `supplier_data`
  ADD PRIMARY KEY (`Supplier_Id`);

--
-- Indexes for table `supplier_invoice_data`
--
ALTER TABLE `supplier_invoice_data`
  ADD PRIMARY KEY (`In_No`(10)),
  ADD KEY `Item_Code` (`Item_Code`),
  ADD KEY `supplier_invoice_data_ibfk_1` (`Supplier_Id`);

--
-- Indexes for table `user_data`
--
ALTER TABLE `user_data`
  ADD PRIMARY KEY (`User_ID`);

--
-- Indexes for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`Setting_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `certificate_alert_history`
--
ALTER TABLE `certificate_alert_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_invoices`
--
ALTER TABLE `customer_invoices`
  MODIFY `Invoice_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `Invoice_Item_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `return_order_items`
--
ALTER TABLE `return_order_items`
  MODIFY `Return_Order_Item_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales_order_items`
--
ALTER TABLE `sales_order_items`
  MODIFY `Sales_Order_Item_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `Setting_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `certificate_alert_history`
--
ALTER TABLE `certificate_alert_history`
  ADD CONSTRAINT `certificate_alert_history_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `certification_expiry_notification` (`Notification_ID`);

--
-- Constraints for table `certification_expiry_notification`
--
ALTER TABLE `certification_expiry_notification`
  ADD CONSTRAINT `certification_expiry_notification_ibfk_1` FOREIGN KEY (`Reg_Id`) REFERENCES `certification_report` (`Reg_Id`),
  ADD CONSTRAINT `fk_cert_report` FOREIGN KEY (`Reg_Id`) REFERENCES `certification_report` (`Reg_Id`) ON DELETE CASCADE;

--
-- Constraints for table `certification_report`
--
ALTER TABLE `certification_report`
  ADD CONSTRAINT `certification_report_ibfk_1` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`);

--
-- Constraints for table `customer_invoices`
--
ALTER TABLE `customer_invoices`
  ADD CONSTRAINT `customer_invoices_ibfk_1` FOREIGN KEY (`Customer_ID`) REFERENCES `customer_data` (`Customer_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_invoices_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user_data` (`User_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_customer_invoices_sales_order` FOREIGN KEY (`Sales_Order_ID`) REFERENCES `sales_orders` (`Sales_Order_ID`);

--
-- Constraints for table `expiry_notification_data`
--
ALTER TABLE `expiry_notification_data`
  ADD CONSTRAINT `expiry_notification_data_ibfk_1` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`);

--
-- Constraints for table `good_issues_data`
--
ALTER TABLE `good_issues_data`
  ADD CONSTRAINT `good_issues_data_ibfk_1` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`);

--
-- Constraints for table `good_receipts_data`
--
ALTER TABLE `good_receipts_data`
  ADD CONSTRAINT `Item_Code` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`);

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`Invoice_ID`) REFERENCES `customer_invoices` (`Invoice_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_items_ibfk_2` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`) ON DELETE CASCADE;

--
-- Constraints for table `item_movement_report`
--
ALTER TABLE `item_movement_report`
  ADD CONSTRAINT `fk_deliver_id` FOREIGN KEY (`Deliver_Id`) REFERENCES `deliver_data` (`Deliver_Id`),
  ADD CONSTRAINT `item_movement_report_ibfk_1` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`);

--
-- Constraints for table `low_stock_notification_data`
--
ALTER TABLE `low_stock_notification_data`
  ADD CONSTRAINT `low_stock_notification_data_ibfk_1` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`);

--
-- Constraints for table `purchase_order`
--
ALTER TABLE `purchase_order`
  ADD CONSTRAINT `purchase_order_ibfk_1` FOREIGN KEY (`Supplier_Id`) REFERENCES `supplier_data` (`Supplier_Id`);

--
-- Constraints for table `sales_orders`
--
ALTER TABLE `sales_orders`
  ADD CONSTRAINT `fk_sales_customer` FOREIGN KEY (`Customer_ID`) REFERENCES `customer_data` (`Customer_ID`);

--
-- Constraints for table `sales_order_items`
--
ALTER TABLE `sales_order_items`
  ADD CONSTRAINT `fk_sales_item` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`),
  ADD CONSTRAINT `fk_sales_order` FOREIGN KEY (`Sales_Order_ID`) REFERENCES `sales_orders` (`Sales_Order_ID`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_invoice_data`
--
ALTER TABLE `supplier_invoice_data`
  ADD CONSTRAINT `supplier_invoice_data_ibfk_1` FOREIGN KEY (`Supplier_Id`) REFERENCES `supplier_data` (`Supplier_Id`),
  ADD CONSTRAINT `supplier_invoice_data_ibfk_2` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`);

--
-- Constraints for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user_data` (`User_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
