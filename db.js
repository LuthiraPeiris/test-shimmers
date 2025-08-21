//Accounting
use shimmerserp;
-- Complete MySQL Schema for Accounting Management System
-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS opening_balances;
DROP TABLE IF EXISTS journal_entry_lines;
DROP TABLE IF EXISTS journal_entries;
DROP TABLE IF EXISTS account_registers;
DROP TABLE IF EXISTS reconciliation_items;
DROP TABLE IF EXISTS reconciliations;
DROP TABLE IF EXISTS closing_periods;
DROP TABLE IF EXISTS chart_of_accounts;
DROP TABLE IF EXISTS currencies;

-- ========== CURRENCIES TABLE ==========
CREATE TABLE currencies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  currency_id VARCHAR(20) UNIQUE NOT NULL,
  currency_code VARCHAR(3) UNIQUE NOT NULL,
  currency_name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  exchange_rate DECIMAL(10,4) NOT NULL DEFAULT 1.0000,
  rate_date DATE NOT NULL,
  default_currency BOOLEAN DEFAULT FALSE,
  status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========== CHART OF ACCOUNTS TABLE ==========
CREATE TABLE chart_of_accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  account_id VARCHAR(20) UNIQUE NOT NULL,
  account_code VARCHAR(20) UNIQUE NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_type ENUM('ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE') NOT NULL,
  account_subtype VARCHAR(100),
  parent_account VARCHAR(20),
  description TEXT,
  tax_code VARCHAR(20),
  currency_id VARCHAR(20) DEFAULT 'CUR001',
  balance DECIMAL(15,2) DEFAULT 0.00,
  status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  created_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (currency_id) REFERENCES currencies(currency_id) ON DELETE SET NULL,
  INDEX idx_account_type (account_type),
  INDEX idx_account_code (account_code),
  INDEX idx_status (status)
);

-- ========== JOURNAL ENTRIES TABLE ==========
CREATE TABLE journal_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  journal_entry_id VARCHAR(20) UNIQUE NOT NULL,
  date DATE NOT NULL,
  reference_number VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  total_debits DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  total_credits DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  status ENUM('DRAFT', 'POSTED', 'CANCELLED') DEFAULT 'DRAFT',
  created_by VARCHAR(100) NOT NULL,
  posted_by VARCHAR(100),
  posted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (date),
  INDEX idx_status (status),
  INDEX idx_reference (reference_number)
);

-- ========== JOURNAL ENTRY LINES TABLE ==========
CREATE TABLE journal_entry_lines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  journal_entry_id VARCHAR(20) NOT NULL,
  line_number INT NOT NULL,
  account_id VARCHAR(20) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  description TEXT,
  debit_amount DECIMAL(15,2) DEFAULT 0.00,
  credit_amount DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(journal_entry_id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES chart_of_accounts(account_id) ON DELETE RESTRICT,
  INDEX idx_journal_entry (journal_entry_id),
  INDEX idx_account (account_id)
);

-- ========== ACCOUNT REGISTERS TABLE ==========
CREATE TABLE account_registers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  transaction_id VARCHAR(20) UNIQUE NOT NULL,
  date DATE NOT NULL,
  account_id VARCHAR(20) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  reference_number VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  debit_amount DECIMAL(15,2) DEFAULT 0.00,
  credit_amount DECIMAL(15,2) DEFAULT 0.00,
  running_balance DECIMAL(15,2) NOT NULL,
  source_document VARCHAR(100),
  journal_entry_id VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES chart_of_accounts(account_id) ON DELETE RESTRICT,
  FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(journal_entry_id) ON DELETE SET NULL,
  INDEX idx_account_date (account_id, date),
  INDEX idx_date (date),
  INDEX idx_reference (reference_number)
);

-- ========== RECONCILIATIONS TABLE ==========
CREATE TABLE reconciliations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reconciliation_id VARCHAR(20) UNIQUE NOT NULL,
  account_id VARCHAR(20) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  statement_date DATE NOT NULL,
  beginning_balance DECIMAL(15,2) NOT NULL,
  ending_balance DECIMAL(15,2) NOT NULL,
  reconciled_transactions INT DEFAULT 0,
  outstanding_items INT DEFAULT 0,
  adjustments DECIMAL(15,2) DEFAULT 0.00,
  reconciliation_status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  reconciled_by VARCHAR(100),
  reconciled_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES chart_of_accounts(account_id) ON DELETE RESTRICT,
  INDEX idx_account (account_id),
  INDEX idx_statement_date (statement_date),
  INDEX idx_status (reconciliation_status)
);

-- ========== RECONCILIATION ITEMS TABLE ==========
CREATE TABLE reconciliation_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reconciliation_id VARCHAR(20) NOT NULL,
  transaction_id VARCHAR(20) NOT NULL,
  transaction_date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  reconciled BOOLEAN DEFAULT FALSE,
  outstanding BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reconciliation_id) REFERENCES reconciliations(reconciliation_id) ON DELETE CASCADE,
  FOREIGN KEY (transaction_id) REFERENCES account_registers(transaction_id) ON DELETE CASCADE,
  INDEX idx_reconciliation (reconciliation_id),
  INDEX idx_transaction (transaction_id)
);

-- ========== CLOSING PERIODS TABLE ==========
CREATE TABLE closing_periods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  closing_period VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  closing_date DATE,
  status ENUM('OPEN', 'CLOSED') DEFAULT 'OPEN',
  revenue_total DECIMAL(15,2) DEFAULT 0.00,
  expense_total DECIMAL(15,2) DEFAULT 0.00,
  net_income DECIMAL(15,2) DEFAULT 0.00,
  retained_earnings_adjustment DECIMAL(15,2) DEFAULT 0.00,
  closed_by VARCHAR(100),
  date_closed DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_period (closing_period),
  INDEX idx_status (status),
  INDEX idx_period (closing_period)
);

-- ========== OPENING BALANCES TABLE ==========
CREATE TABLE opening_balances (
  id INT PRIMARY KEY AUTO_INCREMENT,
  account_id VARCHAR(20) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  opening_balance_date DATE NOT NULL,
  debit_balance DECIMAL(15,2) DEFAULT 0.00,
  credit_balance DECIMAL(15,2) DEFAULT 0.00,
  reference VARCHAR(100),
  status ENUM('ACTIVE', 'INACTIVE', 'FINAL') DEFAULT 'ACTIVE',
  created_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES chart_of_accounts(account_id) ON DELETE CASCADE,
  INDEX idx_account (account_id),
  INDEX idx_date (opening_balance_date),
  INDEX idx_status (status)
);

-- ========== INSERT SAMPLE DATA ==========

-- Insert sample currencies
INSERT INTO currencies (currency_id, currency_code, currency_name, symbol, exchange_rate, rate_date, default_currency, status) VALUES
('CUR001', 'USD', 'US Dollar', '$', 1.0000, '2024-08-19', TRUE, 'ACTIVE'),
('CUR002', 'EUR', 'Euro', '€', 0.9200, '2024-08-19', FALSE, 'ACTIVE'),
('CUR003', 'LKR', 'Sri Lankan Rupee', 'Rs', 298.50, '2024-08-19', FALSE, 'ACTIVE'),
('CUR004', 'GBP', 'British Pound', '£', 0.7850, '2024-08-19', FALSE, 'ACTIVE'),
('CUR005', 'JPY', 'Japanese Yen', '¥', 145.20, '2024-08-19', FALSE, 'ACTIVE');

-- Insert sample chart of accounts
INSERT INTO chart_of_accounts (account_id, account_code, account_name, account_type, account_subtype, parent_account, description, tax_code, currency_id, balance, status, created_date) VALUES
('ACC001', '1000', 'Cash and Bank', 'ASSET', 'Current Assets', NULL, 'Cash in hand and bank accounts', 'TAX001', 'CUR001', 125000.00, 'ACTIVE', '2024-01-01'),
('ACC002', '1100', 'Accounts Receivable', 'ASSET', 'Current Assets', NULL, 'Amount owed by customers', 'TAX002', 'CUR001', 85000.00, 'ACTIVE', '2024-01-01'),
('ACC003', '1200', 'Inventory', 'ASSET', 'Current Assets', NULL, 'Stock of goods for sale', 'TAX003', 'CUR001', 75000.00, 'ACTIVE', '2024-01-01'),
('ACC004', '2000', 'Accounts Payable', 'LIABILITY', 'Current Liabilities', NULL, 'Amount owed to suppliers', 'TAX004', 'CUR001', 45000.00, 'ACTIVE', '2024-01-01'),
('ACC005', '3000', 'Share Capital', 'EQUITY', 'Equity', NULL, 'Company share capital', NULL, 'CUR001', 100000.00, 'ACTIVE', '2024-01-01');

-- Insert sample journal entries
INSERT INTO journal_entries (journal_entry_id, date, reference_number, description, total_debits, total_credits, status, created_by, posted_by, posted_at) VALUES
('JE001', '2024-08-15', 'JE-2024-001', 'Monthly depreciation entry', 5000.00, 5000.00, 'POSTED', 'John Doe', 'John Doe', '2024-08-15 10:30:00'),
('JE002', '2024-08-10', 'JE-2024-002', 'Accrued expenses adjustment', 3500.00, 3500.00, 'POSTED', 'Jane Smith', 'Jane Smith', '2024-08-10 14:20:00'),
('JE003', '2024-08-05', 'JE-2024-003', 'Prepaid insurance adjustment', 2000.00, 2000.00, 'DRAFT', 'Mike Johnson', NULL, NULL),
('JE004', '2024-08-12', 'JE-2024-004', 'Bank charges entry', 150.00, 150.00, 'POSTED', 'Sarah Wilson', 'Sarah Wilson', '2024-08-12 16:45:00'),
('JE005', '2024-08-18', 'JE-2024-005', 'Revenue recognition adjustment', 8000.00, 8000.00, 'DRAFT', 'David Brown', NULL, NULL);

-- Insert sample journal entry lines
INSERT INTO journal_entry_lines (journal_entry_id, line_number, account_id, account_name, description, debit_amount, credit_amount) VALUES
('JE001', 1, 'ACC001', 'Cash and Bank', 'Depreciation expense', 5000.00, 0.00),
('JE001', 2, 'ACC002', 'Accounts Receivable', 'Accumulated depreciation', 0.00, 5000.00),
('JE002', 1, 'ACC003', 'Inventory', 'Utilities expense', 3500.00, 0.00),
('JE002', 2, 'ACC004', 'Accounts Payable', 'Accrued expenses', 0.00, 3500.00),
('JE003', 1, 'ACC001', 'Cash and Bank', 'Insurance expense', 2000.00, 0.00);

-- Insert sample account registers
INSERT INTO account_registers (transaction_id, date, account_id, account_name, reference_number, description, debit_amount, credit_amount, running_balance, source_document, journal_entry_id) VALUES
('TXN001', '2024-08-15', 'ACC001', 'Cash and Bank', 'INV-001', 'Customer payment received', 15000.00, 0.00, 125000.00, 'Invoice INV-001', 'JE001'),
('TXN002', '2024-08-14', 'ACC001', 'Cash and Bank', 'BILL-001', 'Office rent payment', 0.00, 5000.00, 110000.00, 'Bill BILL-001', 'JE002'),
('TXN003', '2024-08-13', 'ACC001', 'Cash and Bank', 'DEP-001', 'Bank deposit', 25000.00, 0.00, 115000.00, 'Deposit slip DEP-001', 'JE003'),
('TXN004', '2024-08-12', 'ACC002', 'Accounts Receivable', 'INV-002', 'Sales invoice issued', 12000.00, 0.00, 85000.00, 'Invoice INV-002', 'JE004'),
('TXN005', '2024-08-11', 'ACC003', 'Inventory', 'PUR-001', 'Inventory purchase', 8000.00, 0.00, 75000.00, 'Purchase order PUR-001', 'JE005');

-- Insert sample reconciliations
INSERT INTO reconciliations (reconciliation_id, account_id, account_name, statement_date, beginning_balance, ending_balance, reconciled_transactions, outstanding_items, adjustments, reconciliation_status, reconciled_by, reconciled_at) VALUES
('REC001', 'ACC001', 'Cash and Bank - Main Account', '2024-08-31', 110000.00, 125000.00, 15, 2, 0.00, 'COMPLETED', 'Finance Manager', '2024-09-01 09:00:00'),
('REC002', 'ACC001', 'Cash and Bank - Savings', '2024-08-31', 5500.00, 4200.00, 8, 1, 150.00, 'IN_PROGRESS', 'Finance Clerk', NULL),
('REC003', 'ACC002', 'Accounts Receivable', '2024-08-31', 50000.00, 52500.00, 3, 0, 0.00, 'PENDING', NULL, NULL),
('REC004', 'ACC003', 'Inventory Account', '2024-07-31', 70000.00, 75000.00, 12, 1, 200.00, 'COMPLETED', 'Finance Manager', '2024-08-02 10:30:00'),
('REC005', 'ACC004', 'Accounts Payable', '2024-08-31', 40000.00, 45000.00, 6, 3, 0.00, 'IN_PROGRESS', 'Finance Clerk', NULL);

-- Insert sample closing periods
INSERT INTO closing_periods (closing_period, closing_date, status, revenue_total, expense_total, net_income, retained_earnings_adjustment, closed_by, date_closed) VALUES
('2024-07', '2024-08-05', 'CLOSED', 245000.00, 180000.00, 65000.00, 65000.00, 'Finance Manager', '2024-08-05'),
('2024-06', '2024-07-05', 'CLOSED', 220000.00, 165000.00, 55000.00, 55000.00, 'Finance Manager', '2024-07-05'),
('2024-05', '2024-06-05', 'CLOSED', 235000.00, 175000.00, 60000.00, 60000.00, 'Finance Manager', '2024-06-05'),
('2024-04', '2024-05-05', 'CLOSED', 210000.00, 155000.00, 55000.00, 55000.00, 'Finance Manager', '2024-05-05'),
('2024-08', NULL, 'OPEN', 0.00, 0.00, 0.00, 0.00, NULL, NULL);

-- Insert sample opening balances
INSERT INTO opening_balances (account_id, account_name, opening_balance_date, debit_balance, credit_balance, reference, status, created_date) VALUES
('ACC001', 'Cash and Bank', '2024-01-01', 100000.00, 0.00, 'Opening Balance 2024', 'FINAL', '2024-01-01'),
('ACC002', 'Accounts Receivable', '2024-01-01', 75000.00, 0.00, 'Opening Balance 2024', 'FINAL', '2024-01-01'),
('ACC003', 'Inventory', '2024-01-01', 65000.00, 0.00, 'Opening Balance 2024', 'FINAL', '2024-01-01'),
('ACC004', 'Accounts Payable', '2024-01-01', 0.00, 35000.00, 'Opening Balance 2024', 'FINAL', '2024-01-01'),
('ACC005', 'Share Capital', '2024-01-01', 0.00, 100000.00, 'Opening Balance 2024', 'FINAL', '2024-01-01');

-- ========== CREATE INDEXES FOR PERFORMANCE ==========
CREATE INDEX idx_chart_accounts_type_status ON chart_of_accounts(account_type, status);
CREATE INDEX idx_journal_entries_date_status ON journal_entries(date, status);
CREATE INDEX idx_account_registers_account_date ON account_registers(account_id, date);
CREATE INDEX idx_reconciliations_account_status ON reconciliations(account_id, reconciliation_status);
CREATE INDEX idx_opening_balances_date_status ON opening_balances(opening_balance_date, status);
//Expenses
-- MySQL Schema for Expense Management System

-- Database creation
CREATE DATABASE IF NOT EXISTS expense_management;
USE expense_management;

-- Expenses table
CREATE TABLE expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    expense_id VARCHAR(50) UNIQUE NOT NULL,
    expense_date DATE NOT NULL,
    payee_name VARCHAR(255) NOT NULL,
    expense_category ENUM(
        'TRAVEL', 
        'OFFICE_SUPPLIES', 
        'UTILITIES', 
        'RENT', 
        'MEALS', 
        'MARKETING', 
        'TECHNOLOGY', 
        'PROFESSIONAL_SERVICES', 
        'INSURANCE', 
        'MAINTENANCE', 
        'OTHER'
    ) NOT NULL,
    payment_method ENUM(
        'CASH', 
        'CREDIT_CARD', 
        'DEBIT_CARD', 
        'CHECK', 
        'BANK_TRANSFER', 
        'PAYPAL', 
        'ACH',
        'OTHER'
    ) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    receipt_attachment VARCHAR(500),
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_expense_date (expense_date),
    INDEX idx_category (expense_category),
    INDEX idx_status (status),
    INDEX idx_payee (payee_name)
);

-- Recurring expenses table
CREATE TABLE recurring_expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recurring_expense_id VARCHAR(50) UNIQUE NOT NULL,
    payee_name VARCHAR(255) NOT NULL,
    expense_category ENUM(
        'RENT', 
        'UTILITIES', 
        'INSURANCE', 
        'SUBSCRIPTIONS', 
        'LOAN_PAYMENTS', 
        'MAINTENANCE', 
        'OTHER'
    ) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    frequency ENUM('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    payment_method ENUM(
        'ACH', 
        'CREDIT_CARD', 
        'CHECK', 
        'BANK_TRANSFER', 
        'OTHER'
    ) NOT NULL,
    notes TEXT,
    status ENUM('ACTIVE', 'INACTIVE', 'CANCELLED') DEFAULT 'ACTIVE',
    next_payment_date DATE NOT NULL,
    last_generated_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_next_payment (next_payment_date),
    INDEX idx_status (status),
    INDEX idx_frequency (frequency)
);

-- Categories table (for future expansion and custom categories)
CREATE TABLE expense_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment methods table (for future expansion)
CREATE TABLE payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    method_code VARCHAR(50) UNIQUE NOT NULL,
    method_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expense attachments table (for multiple file support)
CREATE TABLE expense_attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    expense_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
    INDEX idx_expense_id (expense_id)
);

-- Approval workflow table (for future expansion)
CREATE TABLE expense_approvals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    expense_id INT NOT NULL,
    approver_id VARCHAR(50),
    approval_status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL,
    approval_date TIMESTAMP NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
    INDEX idx_expense_id (expense_id),
    INDEX idx_status (approval_status)
);

-- Insert default categories
INSERT INTO expense_categories (category_code, category_name, description) VALUES
('TRAVEL', 'Travel & Transportation', 'Business travel, flights, hotels, car rentals'),
('OFFICE_SUPPLIES', 'Office Supplies', 'Stationery, equipment, office materials'),
('UTILITIES', 'Utilities', 'Electricity, water, gas, internet, phone'),
('RENT', 'Rent & Facilities', 'Office rent, facility costs'),
('MEALS', 'Meals & Entertainment', 'Business meals, client entertainment'),
('MARKETING', 'Marketing & Advertising', 'Promotional materials, advertising costs'),
('TECHNOLOGY', 'Technology & Software', 'Software subscriptions, hardware, IT services'),
('PROFESSIONAL_SERVICES', 'Professional Services', 'Legal, accounting, consulting fees'),
('INSURANCE', 'Insurance', 'Business insurance premiums'),
('MAINTENANCE', 'Maintenance & Repairs', 'Equipment maintenance, facility repairs'),
('OTHER', 'Other Expenses', 'Miscellaneous business expenses');

-- Insert default payment methods
INSERT INTO payment_methods (method_code, method_name, description) VALUES
('CASH', 'Cash', 'Cash payments'),
('CREDIT_CARD', 'Credit Card', 'Credit card transactions'),
('DEBIT_CARD', 'Debit Card', 'Debit card transactions'),
('CHECK', 'Check', 'Check payments'),
('BANK_TRANSFER', 'Bank Transfer', 'Wire transfers and bank transfers'),
('PAYPAL', 'PayPal', 'PayPal payments'),
('ACH', 'ACH Transfer', 'Automated Clearing House transfers'),
('OTHER', 'Other', 'Other payment methods');

-- Trigger to auto-generate expense_id
DELIMITER //
CREATE TRIGGER generate_expense_id 
BEFORE INSERT ON expenses
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    SET next_id = (SELECT COALESCE(MAX(id), 0) + 1 FROM expenses);
    SET NEW.expense_id = CONCAT('EXP', LPAD(next_id, 3, '0'));
END//
DELIMITER ;

-- Trigger to auto-generate recurring_expense_id
DELIMITER //
CREATE TRIGGER generate_recurring_expense_id 
BEFORE INSERT ON recurring_expenses
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    SET next_id = (SELECT COALESCE(MAX(id), 0) + 1 FROM recurring_expenses);
    SET NEW.recurring_expense_id = CONCAT('REC', LPAD(next_id, 3, '0'));
END//
DELIMITER ;

-- Function to calculate next payment date
DELIMITER //
CREATE FUNCTION calculate_next_payment_date(
    last_date DATE, 
    frequency_type VARCHAR(20)
) RETURNS DATE
READS SQL DATA
DETERMINISTIC
BEGIN
    CASE frequency_type
        WHEN 'WEEKLY' THEN RETURN DATE_ADD(last_date, INTERVAL 1 WEEK);
        WHEN 'BIWEEKLY' THEN RETURN DATE_ADD(last_date, INTERVAL 2 WEEK);
        WHEN 'MONTHLY' THEN RETURN DATE_ADD(last_date, INTERVAL 1 MONTH);
        WHEN 'QUARTERLY' THEN RETURN DATE_ADD(last_date, INTERVAL 3 MONTH);
        WHEN 'ANNUALLY' THEN RETURN DATE_ADD(last_date, INTERVAL 1 YEAR);
        ELSE RETURN last_date;
    END CASE;
END//
DELIMITER ;

-- Procedure to generate recurring expenses
DELIMITER //
CREATE PROCEDURE generate_recurring_expenses()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_id INT;
    DECLARE v_payee_name VARCHAR(255);
    DECLARE v_category VARCHAR(50);
    DECLARE v_amount DECIMAL(10,2);
    DECLARE v_payment_method VARCHAR(50);
    DECLARE v_notes TEXT;
    DECLARE v_next_payment_date DATE;
    DECLARE v_frequency VARCHAR(20);
    
    DECLARE cur CURSOR FOR 
        SELECT id, payee_name, expense_category, amount, payment_method, 
               notes, next_payment_date, frequency
        FROM recurring_expenses 
        WHERE status = 'ACTIVE' 
        AND next_payment_date <= CURDATE()
        AND (end_date IS NULL OR end_date >= CURDATE());
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_id, v_payee_name, v_category, v_amount, 
                      v_payment_method, v_notes, v_next_payment_date, v_frequency;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Insert new expense
        INSERT INTO expenses (
            expense_date, payee_name, expense_category, payment_method,
            amount, notes, status
        ) VALUES (
            v_next_payment_date, v_payee_name, v_category, v_payment_method,
            v_amount, CONCAT('Auto-generated from recurring expense. ', COALESCE(v_notes, '')), 'APPROVED'
        );
        
        -- Update next payment date
        UPDATE recurring_expenses 
        SET next_payment_date = calculate_next_payment_date(v_next_payment_date, v_frequency),
            last_generated_date = v_next_payment_date
        WHERE id = v_id;
        
    END LOOP;
    
    CLOSE cur;
END//
DELIMITER ;

-- Create indexes for better performance
CREATE INDEX idx_expenses_date_category ON expenses(expense_date, expense_category);
CREATE INDEX idx_expenses_amount ON expenses(amount);
CREATE INDEX idx_recurring_payee ON recurring_expenses(payee_name);
CREATE INDEX idx_recurring_amount ON recurring_expenses(amount);

//Payroll

-- MySQL Schema for Payroll Management System

-- Database creation
CREATE DATABASE IF NOT EXISTS payroll_management;
USE payroll_management;

-- Departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    manager_id INT NULL,
    budget DECIMAL(15, 2) DEFAULT 0,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_code (code)
);

-- Employees table
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    national_id VARCHAR(50),
    job_title VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    joining_date DATE NOT NULL,
    termination_date DATE NULL,
    salary_amount DECIMAL(12, 2) NOT NULL,
    salary_type ENUM('HOURLY', 'MONTHLY', 'ANNUAL') DEFAULT 'MONTHLY',
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    bank_branch VARCHAR(100),
    bank_routing_number VARCHAR(20),
    tax_id VARCHAR(50),
    social_security_number VARCHAR(20),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    status ENUM('ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE') DEFAULT 'ACTIVE',
    profile_image VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_employee_id (employee_id),
    INDEX idx_department (department_id),
    INDEX idx_status (status),
    INDEX idx_joining_date (joining_date),
    INDEX idx_email (email)
);

-- Tax settings table
CREATE TABLE tax_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tax_id VARCHAR(50) UNIQUE NOT NULL,
    tax_name VARCHAR(100) NOT NULL,
    tax_type ENUM(
        'INCOME_TAX', 
        'SOCIAL_SECURITY', 
        'MEDICARE', 
        'STATE_TAX', 
        'EPF', 
        'ETF',
        'UNEMPLOYMENT',
        'DISABILITY',
        'OTHER'
    ) NOT NULL,
    tax_rate DECIMAL(8, 6) NULL,
    is_percentage BOOLEAN DEFAULT TRUE,
    flat_amount DECIMAL(10, 2) NULL,
    min_salary DECIMAL(12, 2) DEFAULT 0,
    max_salary DECIMAL(12, 2) NULL,
    employee_contribution_rate DECIMAL(8, 6) NULL,
    employer_contribution_rate DECIMAL(8, 6) NULL,
    effective_date DATE NOT NULL,
    end_date DATE NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tax_type (tax_type),
    INDEX idx_status (status),
    INDEX idx_effective_date (effective_date)
);

-- Payroll runs table
CREATE TABLE payroll_runs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payroll_run_id VARCHAR(50) UNIQUE NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    payment_date DATE NOT NULL,
    status ENUM('DRAFT', 'PROCESSING', 'COMPLETED', 'CANCELLED') DEFAULT 'DRAFT',
    total_employees INT DEFAULT 0,
    total_gross_pay DECIMAL(15, 2) DEFAULT 0,
    total_deductions DECIMAL(15, 2) DEFAULT 0,
    total_net_pay DECIMAL(15, 2) DEFAULT 0,
    processed_by INT NULL,
    processed_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (processed_by) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_pay_period (pay_period_start, pay_period_end),
    INDEX idx_payment_date (payment_date)
);

-- Pay slips table
CREATE TABLE pay_slips (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pay_slip_id VARCHAR(50) UNIQUE NOT NULL,
    employee_id INT NOT NULL,
    payroll_run_id INT NOT NULL,
    basic_salary DECIMAL(12, 2) NOT NULL,
    overtime_hours DECIMAL(8, 2) DEFAULT 0,
    overtime_rate DECIMAL(8, 2) DEFAULT 0,
    overtime_pay DECIMAL(12, 2) DEFAULT 0,
    allowances DECIMAL(12, 2) DEFAULT 0,
    bonuses DECIMAL(12, 2) DEFAULT 0,
    commissions DECIMAL(12, 2) DEFAULT 0,
    gross_pay DECIMAL(12, 2) NOT NULL,
    total_deductions DECIMAL(12, 2) NOT NULL,
    net_pay DECIMAL(12, 2) NOT NULL,
    payment_method ENUM('BANK_TRANSFER', 'CHECK', 'CASH', 'DIGITAL_WALLET') DEFAULT 'BANK_TRANSFER',
    payment_status ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED') DEFAULT 'PENDING',
    payment_date DATE NULL,
    payment_reference VARCHAR(100),
    year INT NOT NULL,
    month INT NOT NULL,
    days_worked DECIMAL(5, 2) DEFAULT 0,
    leave_days DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id) ON DELETE CASCADE,
    INDEX idx_employee_payroll (employee_id, payroll_run_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_year_month (year, month),
    UNIQUE KEY unique_employee_payroll (employee_id, payroll_run_id)
);

-- Pay slip deductions table
CREATE TABLE pay_slip_deductions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pay_slip_id INT NOT NULL,
    tax_setting_id INT NOT NULL,
    deduction_name VARCHAR(100) NOT NULL,
    deduction_type ENUM('TAX', 'INSURANCE', 'LOAN', 'ADVANCE', 'OTHER') NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    is_employee_contribution BOOLEAN DEFAULT TRUE,
    calculation_base DECIMAL(12, 2), -- The amount this deduction was calculated on
    rate_applied DECIMAL(8, 6), -- The rate that was applied
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pay_slip_id) REFERENCES pay_slips(id) ON DELETE CASCADE,
    FOREIGN KEY (tax_setting_id) REFERENCES tax_settings(id) ON DELETE RESTRICT,
    INDEX idx_pay_slip (pay_slip_id),
    INDEX idx_deduction_type (deduction_type)
);

-- Employee allowances table
CREATE TABLE employee_allowances (
    id INT PRIMARY KEY AUTO_INCREMENT,
    allowance_id VARCHAR(50) UNIQUE NOT NULL,
    employee_id INT NOT NULL,
    allowance_name VARCHAR(100) NOT NULL,
    allowance_type ENUM(
        'TRANSPORT', 
        'HOUSING', 
        'MEAL', 
        'MEDICAL', 
        'COMMUNICATION',
        'EDUCATION',
        'OTHER'
    ) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    is_taxable BOOLEAN DEFAULT TRUE,
    effective_date DATE NOT NULL,
    end_date DATE NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_employee (employee_id),
    INDEX idx_status (status),
    INDEX idx_allowance_type (allowance_type)
);

-- Employee leaves table
CREATE TABLE employee_leaves (
    id INT PRIMARY KEY AUTO_INCREMENT,
    leave_id VARCHAR(50) UNIQUE NOT NULL,
    employee_id INT NOT NULL,
    leave_type ENUM(
        'ANNUAL', 
        'SICK', 
        'MATERNITY', 
        'PATERNITY', 
        'PERSONAL', 
        'EMERGENCY',
        'BEREAVEMENT',
        'OTHER'
    ) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_requested DECIMAL(5, 2) NOT NULL,
    days_approved DECIMAL(5, 2) NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
    reason TEXT,
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_employee (employee_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_leave_type (leave_type)
);

-- Employee attendance table
CREATE TABLE employee_attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    attendance_id VARCHAR(50) UNIQUE NOT NULL,
    employee_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    clock_in_time TIME NULL,
    clock_out_time TIME NULL,
    break_duration DECIMAL(5, 2) DEFAULT 0, -- in hours
    total_hours DECIMAL(5, 2) DEFAULT 0,
    overtime_hours DECIMAL(5, 2) DEFAULT 0,
    status ENUM('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'LEAVE') DEFAULT 'PRESENT',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_employee_date (employee_id, attendance_date),
    INDEX idx_attendance_date (attendance_date),
    INDEX idx_status (status),
    UNIQUE KEY unique_employee_date (employee_id, attendance_date)
);

-- Salary adjustments table
CREATE TABLE salary_adjustments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    adjustment_id VARCHAR(50) UNIQUE NOT NULL,
    employee_id INT NOT NULL,
    adjustment_type ENUM('RAISE', 'REDUCTION', 'PROMOTION', 'DEMOTION', 'BONUS', 'DEDUCTION') NOT NULL,
    old_salary DECIMAL(12, 2) NOT NULL,
    new_salary DECIMAL(12, 2) NOT NULL,
    adjustment_amount DECIMAL(12, 2) NOT NULL,
    effective_date DATE NOT NULL,
    reason TEXT,
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_employee (employee_id),
    INDEX idx_effective_date (effective_date),
    INDEX idx_status (status)
);

-- Insert default departments
INSERT INTO departments (department_id, name, code, description, status) VALUES
('DEPT001', 'Human Resources', 'HR', 'Manages employee relations, recruitment, and policies', 'ACTIVE'),
('DEPT002', 'Information Technology', 'IT', 'Manages technology infrastructure and software development', 'ACTIVE'),
('DEPT003', 'Finance & Accounting', 'FIN', 'Manages financial operations, accounting, and budgets', 'ACTIVE'),
('DEPT004', 'Sales & Marketing', 'SALES', 'Manages sales operations and marketing campaigns', 'ACTIVE'),
('DEPT005', 'Operations', 'OPS', 'Manages daily operations and logistics', 'ACTIVE'),
('DEPT006', 'Research & Development', 'RND', 'Manages product research and development', 'ACTIVE'),
('DEPT007', 'Customer Service', 'CS', 'Manages customer support and relations', 'ACTIVE');

-- Insert default tax settings
INSERT INTO tax_settings (tax_id, tax_name, tax_type, tax_rate, is_percentage, effective_date, status, description) VALUES
('TAX001', 'Federal Income Tax', 'INCOME_TAX', 0.22, TRUE, '2024-01-01', 'ACTIVE', 'Federal income tax for employees'),
('TAX002', 'Social Security Tax', 'SOCIAL_SECURITY', 0.062, TRUE, '2024-01-01', 'ACTIVE', 'Social Security contribution'),
('TAX003', 'Medicare Tax', 'MEDICARE', 0.0145, TRUE, '2024-01-01', 'ACTIVE', 'Medicare contribution'),
('TAX004', 'State Income Tax', 'STATE_TAX', 0.05, TRUE, '2024-01-01', 'ACTIVE', 'State income tax'),
('TAX005', 'Unemployment Tax', 'UNEMPLOYMENT', 0.006, TRUE, '2024-01-01', 'ACTIVE', 'State unemployment insurance'),
('TAX006', 'Disability Insurance', 'DISABILITY', 0.009, TRUE, '2024-01-01', 'ACTIVE', 'State disability insurance');

-- Triggers for auto-generating IDs
DELIMITER //
CREATE TRIGGER generate_employee_id 
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    SET next_id = (SELECT COALESCE(MAX(id), 0) + 1 FROM employees);
    SET NEW.employee_id = CONCAT('EMP', LPAD(next_id, 4, '0'));
END//

CREATE TRIGGER generate_payroll_run_id 
BEFORE INSERT ON payroll_runs
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    DECLARE current_year VARCHAR(4);
    SET next_id = (SELECT COALESCE(MAX(id), 0) + 1 FROM payroll_runs);
    SET current_year = YEAR(CURDATE());
    SET NEW.payroll_run_id = CONCAT('PR', current_year, LPAD(next_id, 3, '0'));
END//

CREATE TRIGGER generate_pay_slip_id 
BEFORE INSERT ON pay_slips
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    DECLARE current_year VARCHAR(4);
    SET next_id = (SELECT COALESCE(MAX(id), 0) + 1 FROM pay_slips);
    SET current_year = YEAR(CURDATE());
    SET NEW.pay_slip_id = CONCAT('PS', current_year, LPAD(next_id, 4, '0'));
END//

CREATE TRIGGER generate_allowance_id 
BEFORE INSERT ON employee_allowances
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    SET next_id = (SELECT COALESCE(MAX(id), 0) + 1 FROM employee_allowances);
    SET NEW.allowance_id = CONCAT('ALL', LPAD(next_id, 4, '0'));
END//

CREATE TRIGGER generate_leave_id 
BEFORE INSERT ON employee_leaves
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    SET next_id = (SELECT COALESCE(MAX(id), 0) + 1 FROM employee_leaves);
    SET NEW.leave_id = CONCAT('LV', LPAD(next_id, 4, '0'));
END//

CREATE TRIGGER generate_attendance_id 
BEFORE INSERT ON employee_attendance
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    SET next_id = (SELECT COALESCE(MAX(id), 0) + 1 FROM employee_attendance);
    SET NEW.attendance_id = CONCAT('ATT', LPAD(next_id, 6, '0'));
END//

CREATE TRIGGER generate_adjustment_id 
BEFORE INSERT ON salary_adjustments
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    SET next_id = (SELECT COALESCE(MAX(id), 0) + 1 FROM salary_adjustments);
    SET NEW.adjustment_id = CONCAT('ADJ', LPAD(next_id, 4, '0'));
END//
DELIMITER ;

-- Function to calculate gross pay based on salary type
DELIMITER //
CREATE FUNCTION calculate_gross_pay(
    salary_amount DECIMAL(12,2),
    salary_type VARCHAR(20),
    hours_worked DECIMAL(8,2),
    days_worked DECIMAL(5,2)
) RETURNS DECIMAL(12,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    CASE salary_type
        WHEN 'HOURLY' THEN RETURN salary_amount * hours_worked;
        WHEN 'MONTHLY' THEN RETURN salary_amount * (days_worked / 30);
        WHEN 'ANNUAL' THEN RETURN (salary_amount / 12) * (days_worked / 30);
        ELSE RETURN salary_amount;
    END CASE;
END//
DELIMITER ;

-- Procedure to calculate payroll for a specific run
DELIMITER //
CREATE PROCEDURE calculate_payroll(IN payroll_run_id_param INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE emp_id INT;
    DECLARE emp_salary DECIMAL(12,2);
    DECLARE emp_salary_type VARCHAR(20);
    DECLARE calculated_gross DECIMAL(12,2);
    DECLARE calculated_deductions DECIMAL(12,2);
    DECLARE calculated_net DECIMAL(12,2);
    
    DECLARE emp_cursor CURSOR FOR 
        SELECT id, salary_amount, salary_type 
        FROM employees 
        WHERE status = 'ACTIVE';
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN emp_cursor;
    
    calc_loop: LOOP
        FETCH emp_cursor INTO emp_id, emp_salary, emp_salary_type;
        
        IF done THEN
            LEAVE calc_loop;
        END IF;
        
        -- Calculate gross pay (assuming 30 days worked for monthly employees)
        SET calculated_gross = calculate_gross_pay(emp_salary, emp_salary_type, 0, 30);
        
        -- Calculate basic deductions (simplified)
        SET calculated_deductions = calculated_gross * 0.25; -- 25% total deductions
        SET calculated_net = calculated_gross - calculated_deductions;
        
        -- Insert pay slip
        INSERT INTO pay_slips (
            employee_id, payroll_run_id, basic_salary, gross_pay, 
            total_deductions, net_pay, days_worked, year, month
        ) VALUES (
            emp_id, payroll_run_id_param, emp_salary, calculated_gross,
            calculated_deductions, calculated_net, 30, YEAR(CURDATE()), MONTH(CURDATE())
        );
        
    END LOOP;
    
    CLOSE emp_cursor;
    
    -- Update payroll run totals
    UPDATE payroll_runs pr
    SET 
        total_employees = (SELECT COUNT(*) FROM pay_slips WHERE payroll_run_id = payroll_run_id_param),
        total_gross_pay = (SELECT SUM(gross_pay) FROM pay_slips WHERE payroll_run_id = payroll_run_id_param),
        total_deductions = (SELECT SUM(total_deductions) FROM pay_slips WHERE payroll_run_id = payroll_run_id_param),
        total_net_pay = (SELECT SUM(net_pay) FROM pay_slips WHERE payroll_run_id = payroll_run_id_param)
    WHERE id = payroll_run_id_param;
    
END//
DELIMITER ;

-- Create indexes for better performance
CREATE INDEX idx_employees_department_status ON employees(department_id, status);
CREATE INDEX idx_pay_slips_employee_year_month ON pay_slips(employee_id, year, month);
CREATE INDEX idx_attendance_employee_month ON employee_attendance(employee_id, attendance_date);
CREATE INDEX idx_leaves_employee_status ON employee_leaves(employee_id, status);
CREATE INDEX idx_allowances_employee_status ON employee_allowances(employee_id, status);

//Error Debug

DELIMITER //
CREATE PROCEDURE sp_calculate_gross_pay(
    IN p_salary_amount DECIMAL(12,2),
    IN p_salary_type VARCHAR(20),
    IN p_hours_worked DECIMAL(8,2),
    IN p_days_worked DECIMAL(5,2),
    OUT p_gross_pay DECIMAL(12,2)
)
COMMENT 'Calculates gross pay and returns via OUT parameter'
BEGIN
    DECLARE result DECIMAL(12,2) DEFAULT 0.00;
    
    -- Input validation with proper exit handling
    IF p_salary_amount IS NULL OR p_salary_amount < 0 THEN
        SET p_gross_pay = 0.00;
    ELSEIF p_salary_type IS NULL THEN
        SET p_gross_pay = p_salary_amount;
    ELSE
        -- Calculate based on salary type
        CASE UPPER(p_salary_type)
            WHEN 'HOURLY' THEN 
                SET result = p_salary_amount * COALESCE(p_hours_worked, 0);
            WHEN 'MONTHLY' THEN 
                SET result = p_salary_amount * (COALESCE(p_days_worked, 0) / 30.0);
            WHEN 'ANNUAL' THEN 
                SET result = (p_salary_amount / 12.0) * (COALESCE(p_days_worked, 0) / 30.0);
            ELSE 
                SET result = p_salary_amount;
        END CASE;
        
        -- Ensure non-negative result
        SET p_gross_pay = GREATEST(result, 0.00);
    END IF;
END//
DELIMITER ;