export const mockData = {
    chartOfAccounts: [
      {
        id: 1,
        account_id: 'ACC001',
        account_code: '1000',
        account_name: 'Cash and Bank',
        account_type: 'ASSET',
        account_subtype: 'Current Assets',
        parent_account: null,
        description: 'Cash in hand and bank accounts',
        tax_code: 'TAX001',
        status: 'ACTIVE',
        created_date: '2024-01-01',
        balance: 125000.00
      },
      {
        id: 2,
        account_id: 'ACC002',
        account_code: '1100',
        account_name: 'Accounts Receivable',
        account_type: 'ASSET',
        account_subtype: 'Current Assets',
        parent_account: null,
        description: 'Amount owed by customers',
        tax_code: 'TAX002',
        status: 'ACTIVE',
        created_date: '2024-01-01',
        balance: 85000.00
      },
      {
        id: 3,
        account_id: 'ACC003',
        account_code: '2000',
        account_name: 'Accounts Payable',
        account_type: 'LIABILITY',
        account_subtype: 'Current Liabilities',
        parent_account: null,
        description: 'Amount owed to suppliers',
        tax_code: 'TAX003',
        status: 'ACTIVE',
        created_date: '2024-01-01',
        balance: 45000.00
      },
      {
        id: 4,
        account_id: 'ACC004',
        account_code: '3000',
        account_name: 'Share Capital',
        account_type: 'EQUITY',
        account_subtype: 'Equity',
        parent_account: null,
        description: 'Company share capital',
        tax_code: null,
        status: 'ACTIVE',
        created_date: '2024-01-01',
        balance: 100000.00
      },
      {
        id: 5,
        account_id: 'ACC005',
        account_code: '4000',
        account_name: 'Sales Revenue',
        account_type: 'INCOME',
        account_subtype: 'Operating Income',
        parent_account: null,
        description: 'Revenue from sales',
        tax_code: 'TAX004',
        status: 'ACTIVE',
        created_date: '2024-01-01',
        balance: 250000.00
      },
      {
        id: 6,
        account_id: 'ACC006',
        account_code: '5000',
        account_name: 'Office Expenses',
        account_type: 'EXPENSE',
        account_subtype: 'Operating Expenses',
        parent_account: null,
        description: 'General office expenses',
        tax_code: 'TAX005',
        status: 'ACTIVE',
        created_date: '2024-01-01',
        balance: 35000.00
      }
    ],
    
    accountRegisters: [
      {
        id: 1,
        transaction_id: 'TXN001',
        date: '2024-08-15',
        account_name: 'Cash and Bank',
        reference_number: 'INV-001',
        description: 'Customer payment received',
        debit_amount: 15000.00,
        credit_amount: 0,
        running_balance: 125000.00,
        source_document: 'Invoice INV-001'
      },
      {
        id: 2,
        transaction_id: 'TXN002',
        date: '2024-08-14',
        account_name: 'Cash and Bank',
        reference_number: 'BILL-001',
        description: 'Office rent payment',
        debit_amount: 0,
        credit_amount: 5000.00,
        running_balance: 110000.00,
        source_document: 'Bill BILL-001'
      },
      {
        id: 3,
        transaction_id: 'TXN003',
        date: '2024-08-13',
        account_name: 'Cash and Bank',
        reference_number: 'DEP-001',
        description: 'Bank deposit',
        debit_amount: 25000.00,
        credit_amount: 0,
        running_balance: 115000.00,
        source_document: 'Deposit slip DEP-001'
      }
    ],
    
    journalEntries: [
      {
        id: 1,
        journal_entry_id: 'JE001',
        date: '2024-08-15',
        reference_number: 'JE-2024-001',
        description: 'Monthly depreciation entry',
        status: 'POSTED',
        created_by: 'John Doe',
        total_debits: 5000.00,
        total_credits: 5000.00,
        entries: [
          { account_name: 'Depreciation Expense', debit_amount: 5000.00, credit_amount: 0 },
          { account_name: 'Accumulated Depreciation', debit_amount: 0, credit_amount: 5000.00 }
        ]
      },
      {
        id: 2,
        journal_entry_id: 'JE002',
        date: '2024-08-10',
        reference_number: 'JE-2024-002',
        description: 'Accrued expenses adjustment',
        status: 'POSTED',
        created_by: 'Jane Smith',
        total_debits: 3500.00,
        total_credits: 3500.00,
        entries: [
          { account_name: 'Utilities Expense', debit_amount: 3500.00, credit_amount: 0 },
          { account_name: 'Accrued Expenses', debit_amount: 0, credit_amount: 3500.00 }
        ]
      },
      {
        id: 3,
        journal_entry_id: 'JE003',
        date: '2024-08-05',
        reference_number: 'JE-2024-003',
        description: 'Prepaid insurance adjustment',
        status: 'DRAFT',
        created_by: 'Mike Johnson',
        total_debits: 2000.00,
        total_credits: 2000.00,
        entries: [
          { account_name: 'Insurance Expense', debit_amount: 2000.00, credit_amount: 0 },
          { account_name: 'Prepaid Insurance', debit_amount: 0, credit_amount: 2000.00 }
        ]
      }
    ],
    
    reconciliations: [
      {
        id: 1,
        reconciliation_id: 'REC001',
        account_name: 'Cash and Bank - Main Account',
        statement_date: '2024-08-31',
        beginning_balance: 110000.00,
        ending_balance: 125000.00,
        reconciled_transactions: 15,
        outstanding_items: 2,
        adjustments: 0,
        reconciliation_status: 'COMPLETED'
      },
      {
        id: 2,
        reconciliation_id: 'REC002',
        account_name: 'Credit Card - Business',
        statement_date: '2024-08-31',
        beginning_balance: 5500.00,
        ending_balance: 4200.00,
        reconciled_transactions: 8,
        outstanding_items: 1,
        adjustments: 150.00,
        reconciliation_status: 'IN_PROGRESS'
      },
      {
        id: 3,
        reconciliation_id: 'REC003',
        account_name: 'Savings Account',
        statement_date: '2024-08-31',
        beginning_balance: 50000.00,
        ending_balance: 52500.00,
        reconciled_transactions: 3,
        outstanding_items: 0,
        adjustments: 0,
        reconciliation_status: 'PENDING'
      }
    ],
    
    closingPeriods: [
      {
        id: 1,
        closing_period: '2024-07',
        closing_date: '2024-08-05',
        status: 'CLOSED',
        revenue_total: 245000.00,
        expense_total: 180000.00,
        net_income: 65000.00,
        retained_earnings_adjustment: 65000.00,
        closed_by: 'Finance Manager',
        date_closed: '2024-08-05'
      },
      {
        id: 2,
        closing_period: '2024-06',
        closing_date: '2024-07-05',
        status: 'CLOSED',
        revenue_total: 220000.00,
        expense_total: 165000.00,
        net_income: 55000.00,
        retained_earnings_adjustment: 55000.00,
        closed_by: 'Finance Manager',
        date_closed: '2024-07-05'
      },
      {
        id: 3,
        closing_period: '2024-08',
        closing_date: null,
        status: 'OPEN',
        revenue_total: 0,
        expense_total: 0,
        net_income: 0,
        retained_earnings_adjustment: 0,
        closed_by: null,
        date_closed: null
      }
    ],
    
    openingBalances: [
      {
        id: 1,
        account_id: 'ACC001',
        account_name: 'Cash and Bank',
        opening_balance_date: '2024-01-01',
        debit_balance: 100000.00,
        credit_balance: 0,
        reference: 'Opening Balance 2024',
        status: 'FINAL',
        created_date: '2024-01-01'
      },
      {
        id: 2,
        account_id: 'ACC002',
        account_name: 'Accounts Receivable',
        opening_balance_date: '2024-01-01',
        debit_balance: 75000.00,
        credit_balance: 0,
        reference: 'Opening Balance 2024',
        status: 'FINAL',
        created_date: '2024-01-01'
      },
      {
        id: 3,
        account_id: 'ACC003',
        account_name: 'Accounts Payable',
        opening_balance_date: '2024-01-01',
        debit_balance: 0,
        credit_balance: 35000.00,
        reference: 'Opening Balance 2024',
        status: 'FINAL',
        created_date: '2024-01-01'
      },
      {
        id: 4,
        account_id: 'ACC004',
        account_name: 'Share Capital',
        opening_balance_date: '2024-01-01',
        debit_balance: 0,
        credit_balance: 100000.00,
        reference: 'Opening Balance 2024',
        status: 'FINAL',
        created_date: '2024-01-01'
      }
    ],
    
    currencies: [
      {
        id: 1,
        currency_id: 'CUR001',
        currency_code: 'USD',
        currency_name: 'US Dollar',
        symbol: '$',
        exchange_rate: 1.0000,
        rate_date: '2024-08-17',
        default_currency: true,
        status: 'ACTIVE'
      },
      {
        id: 2,
        currency_id: 'CUR002',
        currency_code: 'EUR',
        currency_name: 'Euro',
        symbol: '€',
        exchange_rate: 0.9200,
        rate_date: '2024-08-17',
        default_currency: false,
        status: 'ACTIVE'
      },
      {
        id: 3,
        currency_id: 'CUR003',
        currency_code: 'LKR',
        currency_name: 'Sri Lankan Rupee',
        symbol: 'Rs',
        exchange_rate: 298.50,
        rate_date: '2024-08-17',
        default_currency: false,
        status: 'ACTIVE'
      },
      {
        id: 4,
        currency_id: 'CUR004',
        currency_code: 'GBP',
        currency_name: 'British Pound',
        symbol: '£',
        exchange_rate: 0.7850,
        rate_date: '2024-08-17',
        default_currency: false,
        status: 'ACTIVE'
      }
    ]
  };