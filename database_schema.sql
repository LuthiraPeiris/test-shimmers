-- Accounting Database Schema for Shimmers Financial
-- Created: 2024-08-19

-- Chart of Accounts table
CREATE TABLE IF NOT EXISTS chart_of_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id VARCHAR(50) UNIQUE NOT NULL,
    account_code VARCHAR(20) UNIQUE NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type ENUM('ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE') NOT NULL,
    account_subtype VARCHAR(100),
    parent_account_id INT NULL,
    description TEXT,
    opening_balance DECIMAL(15,2) DEFAULT 0.00,
    current_balance DECIMAL(15,2) DEFAULT 0.00,
    tax_code VARCHAR(20),
    currency_code VARCHAR(3) DEFAULT 'USD',
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_account_code (account_code),
    INDEX idx_account_type (account_type),
    INDEX idx_status (status),
    FOREIGN KEY (parent_account_id) REFERENCES chart_of_accounts(id) ON DELETE SET NULL
);

-- Journal Entries table
CREATE TABLE IF NOT EXISTS journal_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    journal_entry_id VARCHAR(50) UNIQUE NOT NULL,
    entry_date DATE NOT NULL,
    reference_number VARCHAR(100),
    description TEXT,
    total_debits DECIMAL(15,2) DEFAULT 0.00,
    total_credits DECIMAL(15,2) DEFAULT 0.00,
    status ENUM('DRAFT', 'POSTED', 'CANCELLED') DEFAULT 'DRAFT',
    created_by VARCHAR(100),
    posted_by VARCHAR(100),
    posted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_entry_date (entry_date),
    INDEX idx_status (status),
    INDEX idx_reference (reference_number)
);

-- Journal Entry Lines table
CREATE TABLE IF NOT EXISTS journal_entry_lines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    journal_entry_id INT NOT NULL,
    account_id INT NOT NULL,
    line_number INT NOT NULL,
    description TEXT,
    debit_amount DECIMAL(15,2) DEFAULT 0.00,
    credit_amount DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id) ON DELETE RESTRICT,
    INDEX idx_journal_entry (journal_entry_id),
    INDEX idx_account (account_id)
);

-- Account Registers table (for transaction history)
CREATE TABLE IF NOT EXISTS account_registers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    transaction_id VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    journal_entry_id INT NULL,
    reference_number VARCHAR(100),
    description TEXT,
    debit_amount DECIMAL(15,2) DEFAULT 0.00,
    credit_amount DECIMAL(15,2) DEFAULT 0.00,
    running_balance DECIMAL(15,2) DEFAULT 0.00,
    source_document VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id) ON DELETE RESTRICT,
    FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE SET NULL,
    INDEX idx_account_date (account_id, transaction_date),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_reference (reference_number)
);

-- Account Reconciliations table
CREATE TABLE IF NOT EXISTS account_reconciliations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reconciliation_id VARCHAR(50) UNIQUE NOT NULL,
    account_id INT NOT NULL,
    statement_date DATE NOT NULL,
    beginning_balance DECIMAL(15,2) DEFAULT 0.00,
    ending_balance DECIMAL(15,2) DEFAULT 0.00,
    reconciled_transactions INT DEFAULT 0,
    outstanding_items INT DEFAULT 0,
    adjustments DECIMAL(15,2) DEFAULT 0.00,
    reconciliation_status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    reconciled_by VARCHAR(100),
    reconciled_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id) ON DELETE RESTRICT,
    INDEX idx_account_statement (account_id, statement_date),
    INDEX idx_status (reconciliation_status)
);

-- Closing Periods table
CREATE TABLE IF NOT EXISTS closing_periods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    period_id VARCHAR(50) UNIQUE NOT NULL,
    closing_period VARCHAR(20) NOT NULL, -- e.g., '2024-08'
    closing_date DATE,
    revenue_total DECIMAL(15,2) DEFAULT 0.00,
    expense_total DECIMAL(15,2) DEFAULT 0.00,
    net_income DECIMAL(15,2) DEFAULT 0.00,
    retained_earnings_adjustment DECIMAL(15,2) DEFAULT 0.00,
    status ENUM('OPEN', 'CLOSED', 'LOCKED') DEFAULT 'OPEN',
    closed_by VARCHAR(100),
    closed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_period (closing_period),
    INDEX idx_status (status),
    INDEX idx_closing_date (closing_date)
);

-- Opening Balances table
CREATE TABLE IF NOT EXISTS opening_balances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    opening_balance_id VARCHAR(50) UNIQUE NOT NULL,
    account_id INT NOT NULL,
    opening_balance_date DATE NOT NULL,
    debit_balance DECIMAL(15,2) DEFAULT 0.00,
    credit_balance DECIMAL(15,2) DEFAULT 0.00,
    reference VARCHAR(255),
    status ENUM('DRAFT', 'FINAL', 'CANCELLED') DEFAULT 'DRAFT',
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id) ON DELETE RESTRICT,
    INDEX idx_account_date (account_id, opening_balance_date),
    INDEX idx_status (status),
    INDEX idx_balance_date (opening_balance_date)
);

-- Currencies table
CREATE TABLE IF NOT EXISTS currencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currency_id VARCHAR(50) UNIQUE NOT NULL,
    currency_code VARCHAR(3) UNIQUE NOT NULL,
    currency_name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    exchange_rate DECIMAL(10,4) DEFAULT 1.0000,
    rate_date DATE,
    default_currency BOOLEAN DEFAULT FALSE,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_currency_code (currency_code),
    INDEX idx_status (status),
    INDEX idx_default (default_currency)
);

-- Reconciliation Items table (for detailed reconciliation tracking)
CREATE TABLE IF NOT EXISTS reconciliation_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reconciliation_id INT NOT NULL,
    transaction_id INT NULL,
    item_date DATE NOT NULL,
    description TEXT,
    statement_amount DECIMAL(15,2) DEFAULT 0.00,
    book_amount DECIMAL(15,2) DEFAULT 0.00,
    difference DECIMAL(15,2) DEFAULT 0.00,
    item_type ENUM('MATCHED', 'OUTSTANDING', 'ADJUSTMENT') DEFAULT 'OUTSTANDING',
    status ENUM('PENDING', 'CLEARED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reconciliation_id) REFERENCES account_reconciliations(id) ON DELETE CASCADE,
    INDEX idx_reconciliation (reconciliation_id),
    INDEX idx_status (status),
    INDEX idx_type (item_type)
);

-- Insert default currency (USD)
INSERT IGNORE INTO currencies (currency_id, currency_code, currency_name, symbol, exchange_rate, rate_date, default_currency, status) 
VALUES ('CUR001', 'USD', 'US Dollar', '$', 1.0000, CURDATE(), TRUE, 'ACTIVE');