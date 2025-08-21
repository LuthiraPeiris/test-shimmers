// Complete Banking Management System
'use client';
import "../globals.css"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BuildingLibraryIcon,
  CreditCardIcon,
  ArrowsRightLeftIcon,
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  BanknotesIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

// Import UI Components
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  Modal,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabPanel,
  StatsCard,
  SearchAndFilter,
  BankAccountCard,
  TransactionItem,
  ReconciliationSummary,
  TransferCard
} from '../components/bank/ui/index.js';

// Import Forms
import {
  BankAccountForm,
  TransactionForm,
  ReconciliationForm,
  TransferForm
} from '../components/bank/forms/index.js';

// ========== MAIN BANKING COMPONENT ==========

const BankingManagement = () => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modals, setModals] = useState({
    bankAccount: false,
    transaction: false,
    reconciliation: false,
    transfer: false
  });

  // Form data states
  const [editingAccount, setEditingAccount] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingTransfer, setEditingTransfer] = useState(null);

  // Search and filter states
  const [searchTerms, setSearchTerms] = useState({
    accounts: '',
    transactions: '',
    transfers: ''
  });

  const [filters, setFilters] = useState({
    accountStatus: '',
    transactionStatus: '',
    transactionCategory: '',
    dateRange: ''
  });

  // Mock data states
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 'BA001',
      bankName: 'Chase Bank',
      accountNumber: '123456789012',
      accountType: 'Business Checking',
      routingNumber: '021000021',
      balance: 125000.50,
      status: 'Active',
      dateAdded: '2024-01-15'
    },
    {
      id: 'BA002',
      bankName: 'Bank of America',
      accountNumber: '987654321098',
      accountType: 'Business Savings',
      routingNumber: '026009593',
      balance: 75000.00,
      status: 'Active',
      dateAdded: '2024-02-01'
    },
    {
      id: 'BA003',
      bankName: 'Wells Fargo',
      accountNumber: '456789123456',
      accountType: 'Money Market',
      routingNumber: '121000248',
      balance: 50000.25,
      status: 'Inactive',
      dateAdded: '2024-01-10'
    }
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 'TXN001',
      bankAccount: 'BA001',
      bankAccountName: 'Chase Bank - Business Checking',
      date: '2024-08-18',
      description: 'Monthly Office Rent Payment',
      amount: -5000.00,
      category: 'rent',
      status: 'Cleared',
      notes: 'August rent payment'
    },
    {
      id: 'TXN002',
      bankAccount: 'BA001',
      bankAccountName: 'Chase Bank - Business Checking',
      date: '2024-08-17',
      description: 'Client Payment - ABC Corp',
      amount: 15000.00,
      category: 'sales',
      status: 'Cleared',
      notes: 'Invoice #INV-2024-001'
    },
    {
      id: 'TXN003',
      bankAccount: 'BA002',
      bankAccountName: 'Bank of America - Business Savings',
      date: '2024-08-16',
      description: 'Interest Payment',
      amount: 125.50,
      category: 'interest',
      status: 'Cleared',
      notes: 'Monthly interest'
    },
    {
      id: 'TXN004',
      bankAccount: 'BA001',
      bankAccountName: 'Chase Bank - Business Checking',
      date: '2024-08-15',
      description: 'Office Supplies - Staples',
      amount: -485.75,
      category: 'office_expenses',
      status: 'Pending',
      notes: 'Monthly office supplies'
    },
    {
      id: 'TXN005',
      bankAccount: 'BA001',
      bankAccountName: 'Chase Bank - Business Checking',
      date: '2024-08-14',
      description: 'Marketing Campaign Payment',
      amount: -2500.00,
      category: 'marketing',
      status: 'Cleared',
      notes: 'Google Ads campaign'
    }
  ]);

  const [reconciliations, setReconciliations] = useState([
    {
      id: 'REC001',
      bankAccount: 'Chase Bank - Business Checking',
      statementStartDate: '2024-07-01',
      statementEndDate: '2024-07-31',
      openingBalance: 145000.00,
      closingBalance: 138500.25,
      systemBalance: 138500.25,
      difference: 0.00,
      status: 'Completed',
      dateCompleted: '2024-08-05'
    },
    {
      id: 'REC002',
      bankAccount: 'Bank of America - Business Savings',
      statementStartDate: '2024-07-01',
      statementEndDate: '2024-07-31',
      openingBalance: 72000.00,
      closingBalance: 74850.50,
      systemBalance: 74825.50,
      difference: 25.00,
      status: 'Needs Review',
      dateCompleted: null
    }
  ]);

  const [transfers, setTransfers] = useState([
    {
      id: 'TRF001',
      fromAccount: 'Chase Bank - Business Checking',
      toAccount: 'Bank of America - Business Savings',
      amount: 10000.00,
      transferDate: '2024-08-10',
      notes: 'Monthly savings transfer',
      reference: 'TRF-2024-001',
      status: 'Completed'
    },
    {
      id: 'TRF002',
      fromAccount: 'Bank of America - Business Savings',
      toAccount: 'Wells Fargo - Money Market',
      amount: 5000.00,
      transferDate: '2024-08-05',
      notes: 'Investment allocation',
      reference: 'TRF-2024-002',
      status: 'Completed'
    }
  ]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Data is already set in state
      } catch (error) {
        console.error('Error loading banking data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Modal handlers
  const openModal = (modalName, editData = null) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
    if (modalName === 'bankAccount') setEditingAccount(editData);
    if (modalName === 'transaction') setEditingTransaction(editData);
    if (modalName === 'transfer') setEditingTransfer(editData);
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    if (modalName === 'bankAccount') setEditingAccount(null);
    if (modalName === 'transaction') setEditingTransaction(null);
    if (modalName === 'transfer') setEditingTransfer(null);
  };

  // Bank Account handlers
  const handleAccountSubmit = (accountData) => {
    if (editingAccount) {
      setBankAccounts(prev => prev.map(account => 
        account.id === editingAccount.id 
          ? { ...account, ...accountData }
          : account
      ));
    } else {
      const newAccount = {
        ...accountData,
        id: `BA${String(bankAccounts.length + 1).padStart(3, '0')}`,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      setBankAccounts(prev => [...prev, newAccount]);
    }
    closeModal('bankAccount');
  };

  const handleAccountToggleStatus = (account) => {
    setBankAccounts(prev => prev.map(acc => 
      acc.id === account.id 
        ? { ...acc, status: acc.status === 'Active' ? 'Inactive' : 'Active' }
        : acc
    ));
  };

  // Transaction handlers
  const handleTransactionSubmit = (transactionData) => {
    const bankAccount = bankAccounts.find(acc => acc.id === transactionData.bankAccount);
    
    if (editingTransaction) {
      setTransactions(prev => prev.map(txn => 
        txn.id === editingTransaction.id 
          ? { 
              ...txn, 
              ...transactionData,
              bankAccountName: `${bankAccount.bankName} - ${bankAccount.accountType}`
            }
          : txn
      ));
    } else {
      const newTransaction = {
        ...transactionData,
        id: `TXN${String(transactions.length + 1).padStart(3, '0')}`,
        bankAccountName: `${bankAccount.bankName} - ${bankAccount.accountType}`
      };
      setTransactions(prev => [...prev, newTransaction]);
    }
    closeModal('transaction');
  };

  const handleTransactionDelete = (transaction) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(txn => txn.id !== transaction.id));
    }
  };

  const handleTransactionCategorize = (transaction) => {
    // Open transaction form for editing category
    openModal('transaction', transaction);
  };

  // Transfer handlers
  const handleTransferSubmit = (transferData) => {
    const fromAccount = bankAccounts.find(acc => acc.id === transferData.fromAccount);
    const toAccount = bankAccounts.find(acc => acc.id === transferData.toAccount);
    
    if (editingTransfer) {
      setTransfers(prev => prev.map(transfer => 
        transfer.id === editingTransfer.id 
          ? { 
              ...transfer, 
              ...transferData,
              fromAccount: `${fromAccount.bankName} - ${fromAccount.accountType}`,
              toAccount: `${toAccount.bankName} - ${toAccount.accountType}`,
              status: 'Completed'
            }
          : transfer
      ));
    } else {
      const newTransfer = {
        ...transferData,
        id: `TRF${String(transfers.length + 1).padStart(3, '0')}`,
        fromAccount: `${fromAccount.bankName} - ${fromAccount.accountType}`,
        toAccount: `${toAccount.bankName} - ${toAccount.accountType}`,
        status: 'Completed'
      };
      setTransfers(prev => [...prev, newTransfer]);

      // Update account balances
      setBankAccounts(prev => prev.map(account => {
        if (account.id === transferData.fromAccount) {
          return { ...account, balance: account.balance - transferData.amount };
        }
        if (account.id === transferData.toAccount) {
          return { ...account, balance: account.balance + transferData.amount };
        }
        return account;
      }));
    }
    closeModal('transfer');
  };

  const handleTransferCancel = (transfer) => {
    if (confirm('Are you sure you want to cancel this transfer?')) {
      setTransfers(prev => prev.filter(t => t.id !== transfer.id));
    }
  };

  // Reconciliation handlers
  const handleReconciliationSubmit = (reconciliationData) => {
    const newReconciliation = {
      ...reconciliationData,
      id: `REC${String(reconciliations.length + 1).padStart(3, '0')}`,
      systemBalance: 0, // This would be calculated from actual transactions
      difference: reconciliationData.statementClosingBalance - 0, // Placeholder calculation
      status: 'In Progress',
      dateCompleted: null
    };
    setReconciliations(prev => [...prev, newReconciliation]);
    closeModal('reconciliation');
  };

  // Calculate summary statistics
  const summaryStats = {
    totalBalance: bankAccounts
      .filter(account => account.status === 'Active')
      .reduce((sum, account) => sum + account.balance, 0),
    activeAccounts: bankAccounts.filter(account => account.status === 'Active').length,
    pendingTransactions: transactions.filter(txn => txn.status === 'Pending').length,
    monthlyInflow: transactions
      .filter(txn => txn.amount > 0 && new Date(txn.date).getMonth() === new Date().getMonth())
      .reduce((sum, txn) => sum + txn.amount, 0),
    monthlyOutflow: Math.abs(transactions
      .filter(txn => txn.amount < 0 && new Date(txn.date).getMonth() === new Date().getMonth())
      .reduce((sum, txn) => sum + txn.amount, 0))
  };

  // Filter data based on search and filters
  const filteredAccounts = bankAccounts.filter(account => {
    const matchesSearch = account.bankName.toLowerCase().includes(searchTerms.accounts.toLowerCase()) ||
                         account.accountType.toLowerCase().includes(searchTerms.accounts.toLowerCase());
    const matchesStatus = !filters.accountStatus || account.status === filters.accountStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerms.transactions.toLowerCase()) ||
                         transaction.bankAccountName.toLowerCase().includes(searchTerms.transactions.toLowerCase());
    const matchesStatus = !filters.transactionStatus || transaction.status === filters.transactionStatus;
    const matchesCategory = !filters.transactionCategory || transaction.category === filters.transactionCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.fromAccount.toLowerCase().includes(searchTerms.transfers.toLowerCase()) ||
                         transfer.toAccount.toLowerCase().includes(searchTerms.transfers.toLowerCase()) ||
                         transfer.notes.toLowerCase().includes(searchTerms.transfers.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BuildingLibraryIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-4 text-2xl font-bold text-blue-600 dark:text-blue-400">
                Banking Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary">
                <PrinterIcon className="w-5 h-5 mr-2" />
                Print Reports
              </Button>
              <Button variant="secondary">
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Total Balance"
            value={formatCurrency(summaryStats.totalBalance)}
            icon={CurrencyDollarIcon}
            color="green"
            trend="up"
            trendValue="5.2% vs last month"
          />
          <StatsCard
            title="Active Accounts"
            value={summaryStats.activeAccounts}
            icon={BuildingLibraryIcon}
            color="blue"
            subtitle="Bank accounts"
          />
          <StatsCard
            title="Pending Transactions"
            value={summaryStats.pendingTransactions}
            icon={ClockIcon}
            color="yellow"
            subtitle="Awaiting clearance"
          />
          <StatsCard
            title="Monthly Inflow"
            value={formatCurrency(summaryStats.monthlyInflow)}
            icon={ArrowTrendingUpIcon}
            color="emerald"
            trend="up"
            trendValue="12.8% vs last month"
          />
          <StatsCard
            title="Monthly Outflow"
            value={formatCurrency(summaryStats.monthlyOutflow)}
            icon={ArrowTrendingDownIcon}
            color="red"
            trend="down"
            trendValue="3.4% vs last month"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultTab="accounts" onChange={setActiveTab}>
          {/* Bank Accounts Tab */}
          <TabPanel id="accounts" label="Bank Accounts">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Bank Accounts
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Manage your company's bank accounts and monitor balances
                  </p>
                </div>
                <Button onClick={() => openModal('bankAccount')}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Account
                </Button>
              </div>

              {/* Search and Filter */}
              <SearchAndFilter
                searchValue={searchTerms.accounts}
                onSearchChange={(value) => setSearchTerms(prev => ({ ...prev, accounts: value }))}
                filters={[
                  {
                    key: 'accountStatus',
                    label: 'Status',
                    value: filters.accountStatus,
                    options: [
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' },
                      { value: 'Pending', label: 'Pending' },
                      { value: 'Closed', label: 'Closed' }
                    ],
                    placeholder: 'All Statuses'
                  }
                ]}
                onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
                onReset={() => {
                  setSearchTerms(prev => ({ ...prev, accounts: '' }));
                  setFilters(prev => ({ ...prev, accountStatus: '' }));
                }}
                className="mb-6"
              />

              {/* Accounts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAccounts.map((account) => (
                  <BankAccountCard
                    key={account.id}
                    account={account}
                    onEdit={(account) => openModal('bankAccount', account)}
                    onToggleStatus={handleAccountToggleStatus}
                    onViewTransactions={(account) => {
                      setActiveTab('transactions');
                      setFilters(prev => ({ ...prev, bankAccount: account.id }));
                    }}
                  />
                ))}
              </div>

              {filteredAccounts.length === 0 && (
                <Card className="p-12 text-center">
                  <BuildingLibraryIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No bank accounts found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Get started by adding your first bank account
                  </p>
                  <Button onClick={() => openModal('bankAccount')}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Bank Account
                  </Button>
                </Card>
              )}
            </motion.div>
          </TabPanel>

          {/* Bank Transactions Tab */}
          <TabPanel id="transactions" label="Bank Transactions">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Bank Transactions
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    View and manage all bank transactions
                  </p>
                </div>
                <Button onClick={() => openModal('transaction')}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Transaction
                </Button>
              </div>

              {/* Search and Filter */}
              <SearchAndFilter
                searchValue={searchTerms.transactions}
                onSearchChange={(value) => setSearchTerms(prev => ({ ...prev, transactions: value }))}
                filters={[
                  {
                    key: 'transactionStatus',
                    label: 'Status',
                    value: filters.transactionStatus,
                    options: [
                      { value: 'Cleared', label: 'Cleared' },
                      { value: 'Pending', label: 'Pending' },
                      { value: 'Failed', label: 'Failed' }
                    ],
                    placeholder: 'All Statuses'
                  },
                  {
                    key: 'transactionCategory',
                    label: 'Category',
                    value: filters.transactionCategory,
                    options: [
                      { value: 'sales', label: 'Sales Revenue' },
                      { value: 'rent', label: 'Rent & Lease' },
                      { value: 'office_expenses', label: 'Office Expenses' },
                      { value: 'marketing', label: 'Marketing' },
                      { value: 'interest', label: 'Interest' }
                    ],
                    placeholder: 'All Categories'
                  }
                ]}
                onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
                onReset={() => {
                  setSearchTerms(prev => ({ ...prev, transactions: '' }));
                  setFilters(prev => ({ ...prev, transactionStatus: '', transactionCategory: '' }));
                }}
                className="mb-6"
              />

              {/* Transactions Table */}
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction Details</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        onEdit={(txn) => openModal('transaction', txn)}
                        onDelete={handleTransactionDelete}
                        onCategorize={handleTransactionCategorize}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Card>

              {filteredTransactions.length === 0 && (
                <Card className="p-12 text-center">
                  <CreditCardIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No transactions found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start by adding your first transaction
                  </p>
                  <Button onClick={() => openModal('transaction')}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Transaction
                  </Button>
                </Card>
              )}
            </motion.div>
          </TabPanel>

          {/* Bank Reconciliation Tab */}
          <TabPanel id="reconciliation" label="Bank Reconciliation">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Bank Reconciliation
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Reconcile bank statements with recorded transactions
                  </p>
                </div>
                <Button onClick={() => openModal('reconciliation')}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Start Reconciliation
                </Button>
              </div>

              {/* Reconciliation Summary */}
              <div className="space-y-6">
                {reconciliations.map((reconciliation) => (
                  <ReconciliationSummary
                    key={reconciliation.id}
                    reconciliation={reconciliation}
                    onViewDetails={(rec) => {
                      // Navigate to detailed reconciliation view
                      console.log('View reconciliation details:', rec);
                    }}
                  />
                ))}
              </div>

              {reconciliations.length === 0 && (
                <Card className="p-12 text-center">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No reconciliations found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start your first bank reconciliation to ensure accuracy
                  </p>
                  <Button onClick={() => openModal('reconciliation')}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Start Reconciliation
                  </Button>
                </Card>
              )}
            </motion.div>
          </TabPanel>

          {/* Transfer Funds Tab */}
          <TabPanel id="transfers" label="Transfer Funds">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Fund Transfers
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Transfer funds between your bank accounts
                  </p>
                </div>
                <Button onClick={() => openModal('transfer')}>
                  <ArrowsRightLeftIcon className="w-5 h-5 mr-2" />
                  New Transfer
                </Button>
              </div>

              {/* Search */}
              <SearchAndFilter
                searchValue={searchTerms.transfers}
                onSearchChange={(value) => setSearchTerms(prev => ({ ...prev, transfers: value }))}
                filters={[]}
                onFilterChange={() => {}}
                onReset={() => setSearchTerms(prev => ({ ...prev, transfers: '' }))}
                className="mb-6"
              />

              {/* Transfers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTransfers.map((transfer) => (
                  <TransferCard
                    key={transfer.id}
                    transfer={transfer}
                    onEdit={(transfer) => openModal('transfer', transfer)}
                    onCancel={handleTransferCancel}
                  />
                ))}
              </div>

              {filteredTransfers.length === 0 && (
                <Card className="p-12 text-center">
                  <ArrowsRightLeftIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No transfers found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Transfer funds between your accounts to optimize cash flow
                  </p>
                  <Button onClick={() => openModal('transfer')}>
                    <ArrowsRightLeftIcon className="w-5 h-5 mr-2" />
                    Create Transfer
                  </Button>
                </Card>
              )}
            </motion.div>
          </TabPanel>
        </Tabs>
      </main>

      {/* Modals */}
      <BankAccountForm
        isOpen={modals.bankAccount}
        onClose={() => closeModal('bankAccount')}
        onSubmit={handleAccountSubmit}
        initialData={editingAccount}
        loading={false}
      />

      <TransactionForm
        isOpen={modals.transaction}
        onClose={() => closeModal('transaction')}
        onSubmit={handleTransactionSubmit}
        initialData={editingTransaction}
        loading={false}
        bankAccounts={bankAccounts.filter(acc => acc.status === 'Active')}
      />

      <ReconciliationForm
        isOpen={modals.reconciliation}
        onClose={() => closeModal('reconciliation')}
        onSubmit={handleReconciliationSubmit}
        bankAccounts={bankAccounts.filter(acc => acc.status === 'Active')}
        loading={false}
      />

      <TransferForm
        isOpen={modals.transfer}
        onClose={() => closeModal('transfer')}
        onSubmit={handleTransferSubmit}
        initialData={editingTransfer}
        loading={false}
        bankAccounts={bankAccounts.filter(acc => acc.status === 'Active')}
      />
    </div>
  );
};

export default BankingManagement;