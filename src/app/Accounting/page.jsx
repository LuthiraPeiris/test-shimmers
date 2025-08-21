// 'use client';
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   CalculatorIcon,
//   ArrowDownTrayIcon,
//   PlusIcon,
//   PencilIcon,
//   TrashIcon,
//   EyeIcon,
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
//   FolderIcon,
//   DocumentDuplicateIcon,
//   ChartBarIcon,
//   GlobeAltIcon,
//   LockClosedIcon,
//   CalendarDaysIcon
// } from '@heroicons/react/24/outline';

// // Import components
// import {
//   Badge,
//   Button,
//   Card,
//   Input,
//   Select,
//   SearchBar,
//   StatsCard,
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
//   Tabs,
//   TabPanel
// } from '../components/Accounting/ui/index';

// import {
//   ChartOfAccountsForm,
//   CurrencyForm,
//   JournalEntryForm,
//   ReconciliationForm,
//   OpeningBalanceForm
// } from '../components/Accounting/Forms/index';

// import { mockData } from '../components/Accounting/data/mockdata';

// const AccountingManagement = () => {
//   const [activeTab, setActiveTab] = useState('chartOfAccounts');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
  
//   // Modal states
//   const [showAccountForm, setShowAccountForm] = useState(false);
//   const [showJournalEntryForm, setShowJournalEntryForm] = useState(false);
//   const [showCurrencyForm, setShowCurrencyForm] = useState(false);
//   const [showReconciliationForm, setShowReconciliationForm] = useState(false);
//   const [showOpeningBalanceForm, setShowOpeningBalanceForm] = useState(false);
//   const [selectedAccount, setSelectedAccount] = useState(null);
//   const [selectedJournalEntry, setSelectedJournalEntry] = useState(null);
//   const [selectedCurrency, setSelectedCurrency] = useState(null);
//   const [selectedReconciliation, setSelectedReconciliation] = useState(null);
//   const [selectedOpeningBalance, setSelectedOpeningBalance] = useState(null);
  
//   // Data states
//   const [chartOfAccounts, setChartOfAccounts] = useState([]);
//   const [accountRegisters, setAccountRegisters] = useState([]);
//   const [journalEntries, setJournalEntries] = useState([]);
//   const [reconciliations, setReconciliations] = useState([]);
//   const [closingPeriods, setClosingPeriods] = useState([]);
//   const [openingBalances, setOpeningBalances] = useState([]);
//   const [currencies, setCurrencies] = useState([]);

//   // Load data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         // Simulate API delay
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         // Set mock data
//         setChartOfAccounts(mockData.chartOfAccounts);
//         setAccountRegisters(mockData.accountRegisters);
//         setJournalEntries(mockData.journalEntries);
//         setReconciliations(mockData.reconciliations);
//         setClosingPeriods(mockData.closingPeriods);
//         setOpeningBalances(mockData.openingBalances);
//         setCurrencies(mockData.currencies);
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Filter functions
//   const filteredAccounts = chartOfAccounts.filter(account => 
//     account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     account.account_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     account.account_type.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredJournalEntries = journalEntries.filter(entry =>
//     entry.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     entry.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredCurrencies = currencies.filter(currency =>
//     currency.currency_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     currency.currency_code.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Utility functions
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount || 0);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       'ACTIVE': { variant: 'success', label: 'Active' },
//       'INACTIVE': { variant: 'warning', label: 'Inactive' },
//       'POSTED': { variant: 'success', label: 'Posted' },
//       'DRAFT': { variant: 'warning', label: 'Draft' },
//       'COMPLETED': { variant: 'success', label: 'Completed' },
//       'IN_PROGRESS': { variant: 'warning', label: 'In Progress' },
//       'PENDING': { variant: 'info', label: 'Pending' },
//       'CLOSED': { variant: 'danger', label: 'Closed' },
//       'OPEN': { variant: 'success', label: 'Open' },
//       'FINAL': { variant: 'success', label: 'Final' }
//     };
    
//     const config = statusConfig[status] || { variant: 'default', label: status };
//     return <Badge variant={config.variant}>{config.label}</Badge>;
//   };

//   // CRUD operations
//   const handleAddAccount = async (accountData) => {
//     try {
//       const newAccount = {
//         id: chartOfAccounts.length + 1,
//         account_id: `ACC${String(chartOfAccounts.length + 1).padStart(3, '0')}`,
//         ...accountData,
//         created_date: new Date().toISOString().split('T')[0],
//         balance: 0
//       };
//       setChartOfAccounts([...chartOfAccounts, newAccount]);
//     } catch (error) {
//       console.error('Error adding account:', error);
//     }
//   };

//   const handleEditAccount = (account) => {
//     setSelectedAccount(account);
//     setShowAccountForm(true);
//   };

//   const handleUpdateAccount = async (accountData) => {
//     try {
//       const updatedAccounts = chartOfAccounts.map(acc => 
//         acc.id === selectedAccount.id 
//           ? { ...acc, ...accountData }
//           : acc
//       );
//       setChartOfAccounts(updatedAccounts);
//       setSelectedAccount(null);
//     } catch (error) {
//       console.error('Error updating account:', error);
//     }
//   };

//   const handleDeleteAccount = async (id) => {
//     if (confirm('Are you sure you want to delete this account?')) {
//       try {
//         setChartOfAccounts(chartOfAccounts.filter(acc => acc.id !== id));
//       } catch (error) {
//         console.error('Error deleting account:', error);
//       }
//     }
//   };

//   const handleAddJournalEntry = async (entryData) => {
//     try {
//       const newEntry = {
//         id: journalEntries.length + 1,
//         journal_entry_id: `JE${String(journalEntries.length + 1).padStart(3, '0')}`,
//         ...entryData,
//         status: 'DRAFT',
//         created_by: 'Current User',
//         total_debits: entryData.entries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0),
//         total_credits: entryData.entries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0)
//       };
//       setJournalEntries([...journalEntries, newEntry]);
//     } catch (error) {
//       console.error('Error adding journal entry:', error);
//     }
//   };

//   const handleAddCurrency = async (currencyData) => {
//     try {
//       const newCurrency = {
//         id: currencies.length + 1,
//         currency_id: `CUR${String(currencies.length + 1).padStart(3, '0')}`,
//         ...currencyData,
//         rate_date: new Date().toISOString().split('T')[0]
//       };
//       setCurrencies([...currencies, newCurrency]);
//     } catch (error) {
//       console.error('Error adding currency:', error);
//     }
//   };

//   // Journal Entry operations
//   const handleViewJournalEntry = (entry) => {
//     setSelectedJournalEntry(entry);
//     setShowJournalEntryForm(true);
//   };

//   const handleEditJournalEntry = (entry) => {
//     setSelectedJournalEntry(entry);
//     setShowJournalEntryForm(true);
//   };

//   const handleDeleteJournalEntry = async (id) => {
//     if (confirm('Are you sure you want to delete this journal entry?')) {
//       try {
//         setJournalEntries(journalEntries.filter(entry => entry.id !== id));
//       } catch (error) {
//         console.error('Error deleting journal entry:', error);
//       }
//     }
//   };

//   const handleUpdateJournalEntry = async (entryData) => {
//     try {
//       const updatedEntries = journalEntries.map(entry => 
//         entry.id === selectedJournalEntry.id 
//           ? { ...entry, ...entryData }
//           : entry
//       );
//       setJournalEntries(updatedEntries);
//       setSelectedJournalEntry(null);
//     } catch (error) {
//       console.error('Error updating journal entry:', error);
//     }
//   };

//   // Currency operations
//   const handleEditCurrency = (currency) => {
//     setSelectedCurrency(currency);
//     setShowCurrencyForm(true);
//   };

//   const handleDeleteCurrency = async (id) => {
//     if (confirm('Are you sure you want to delete this currency?')) {
//       try {
//         setCurrencies(currencies.filter(curr => curr.id !== id));
//       } catch (error) {
//         console.error('Error deleting currency:', error);
//       }
//     }
//   };

//   const handleUpdateCurrency = async (currencyData) => {
//     try {
//       const updatedCurrencies = currencies.map(curr => 
//         curr.id === selectedCurrency.id 
//           ? { ...curr, ...currencyData }
//           : curr
//       );
//       setCurrencies(updatedCurrencies);
//       setSelectedCurrency(null);
//     } catch (error) {
//       console.error('Error updating currency:', error);
//     }
//   };

//   // Reconciliation operations
//   const handleViewReconciliation = (reconciliation) => {
//     setSelectedReconciliation(reconciliation);
//     setShowReconciliationForm(true);
//   };

//   const handleEditReconciliation = (reconciliation) => {
//     setSelectedReconciliation(reconciliation);
//     setShowReconciliationForm(true);
//   };

//   const handleAddReconciliation = async (reconciliationData) => {
//     try {
//       const newReconciliation = {
//         id: reconciliations.length + 1,
//         ...reconciliationData,
//         reconciliation_status: 'IN_PROGRESS'
//       };
//       setReconciliations([...reconciliations, newReconciliation]);
//     } catch (error) {
//       console.error('Error adding reconciliation:', error);
//     }
//   };

//   const handleUpdateReconciliation = async (reconciliationData) => {
//     try {
//       const updatedReconciliations = reconciliations.map(recon => 
//         recon.id === selectedReconciliation.id 
//           ? { ...recon, ...reconciliationData }
//           : recon
//       );
//       setReconciliations(updatedReconciliations);
//       setSelectedReconciliation(null);
//     } catch (error) {
//       console.error('Error updating reconciliation:', error);
//     }
//   };

//   // Opening Balance operations
//   const handleEditOpeningBalance = (balance) => {
//     setSelectedOpeningBalance(balance);
//     setShowOpeningBalanceForm(true);
//   };

//   const handleAddOpeningBalance = async (balanceData) => {
//     try {
//       const newBalance = {
//         id: openingBalances.length + 1,
//         ...balanceData,
//         status: 'ACTIVE'
//       };
//       setOpeningBalances([...openingBalances, newBalance]);
//     } catch (error) {
//       console.error('Error adding opening balance:', error);
//     }
//   };

//   const handleUpdateOpeningBalance = async (balanceData) => {
//     try {
//       const updatedBalances = openingBalances.map(bal => 
//         bal.id === selectedOpeningBalance.id 
//           ? { ...bal, ...balanceData }
//           : bal
//       );
//       setOpeningBalances(updatedBalances);
//       setSelectedOpeningBalance(null);
//     } catch (error) {
//       console.error('Error updating opening balance:', error);
//     }
//   };

//   const handleDeleteOpeningBalance = async (id) => {
//     if (confirm('Are you sure you want to delete this opening balance?')) {
//       try {
//         setOpeningBalances(openingBalances.filter(balance => balance.id !== id));
//       } catch (error) {
//         console.error('Error deleting opening balance:', error);
//       }
//     }
//   };

//   // Calculate summary stats
//   const summaryStats = {
//     totalAccounts: chartOfAccounts.length,
//     activeAccounts: chartOfAccounts.filter(acc => acc.status === 'ACTIVE').length,
//     totalAssets: chartOfAccounts.filter(acc => acc.account_type === 'ASSET').reduce((sum, acc) => sum + (acc.balance || 0), 0),
//     totalLiabilities: chartOfAccounts.filter(acc => acc.account_type === 'LIABILITY').reduce((sum, acc) => sum + (acc.balance || 0), 0),
//     pendingJournalEntries: journalEntries.filter(entry => entry.status === 'DRAFT').length,
//     activeCurrencies: currencies.filter(curr => curr.status === 'ACTIVE').length
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//                 <CalculatorIcon className="w-6 h-6 text-white" />
//               </div>
//               <h1 className="ml-4 text-2xl font-bold text-blue-600 dark:text-blue-400">
//                 Accounting Management
//               </h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <SearchBar
//                 value={searchTerm}
//                 onChange={setSearchTerm}
//                 placeholder="Search accounts, entries..."
//                 className="w-64"
//               />
//               <Button variant="secondary">
//                 <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
//                 Export
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Summary Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
//           <StatsCard
//             title="Total Accounts"
//             value={summaryStats.totalAccounts}
//             icon={FolderIcon}
//             color="blue"
//           />
//           <StatsCard
//             title="Active Accounts"
//             value={summaryStats.activeAccounts}
//             icon={CheckCircleIcon}
//             color="green"
//           />
//           <StatsCard
//             title="Total Assets"
//             value={formatCurrency(summaryStats.totalAssets)}
//             icon={ChartBarIcon}
//             color="emerald"
//           />
//           <StatsCard
//             title="Total Liabilities"
//             value={formatCurrency(summaryStats.totalLiabilities)}
//             icon={ExclamationTriangleIcon}
//             color="red"
//           />
//           <StatsCard
//             title="Pending Entries"
//             value={summaryStats.pendingJournalEntries}
//             icon={DocumentDuplicateIcon}
//             color="yellow"
//           />
//           <StatsCard
//             title="Active Currencies"
//             value={summaryStats.activeCurrencies}
//             icon={GlobeAltIcon}
//             color="purple"
//           />
//         </div>

//         {/* Tabs */}
//         <Tabs defaultTab="chartOfAccounts" onChange={setActiveTab}>
//           {/* Chart of Accounts */}
//           <TabPanel id="chartOfAccounts" label="Chart of Accounts">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                     Chart of Accounts
//                   </h2>
//                   <p className="mt-2 text-gray-600 dark:text-gray-400">
//                     Master list of all accounts used in the accounting system
//                   </p>
//                 </div>
//                 <Button onClick={() => setShowAccountForm(true)}>
//                   <PlusIcon className="w-5 h-5 mr-2" />
//                   Add Account
//                 </Button>
//               </div>

//               <Card>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Account Code</TableHead>
//                       <TableHead>Account Name</TableHead>
//                       <TableHead>Type</TableHead>
//                       <TableHead>Subtype</TableHead>
//                       <TableHead>Balance</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredAccounts.map((account) => (
//                       <TableRow key={account.id}>
//                         <TableCell className="font-medium">
//                           {account.account_code}
//                         </TableCell>
//                         <TableCell>
//                           <div>
//                             <div className="font-medium">{account.account_name}</div>
//                             <div className="text-sm text-gray-500">{account.description}</div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="info">{account.account_type}</Badge>
//                         </TableCell>
//                         <TableCell>{account.account_subtype}</TableCell>
//                         <TableCell className="font-medium">
//                           {formatCurrency(account.balance)}
//                         </TableCell>
//                         <TableCell>{getStatusBadge(account.status)}</TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={() => handleEditAccount(account)}
//                             >
//                               <PencilIcon className="w-4 h-4" />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={() => handleDeleteAccount(account.id)}
//                             >
//                               <TrashIcon className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Card>
//             </motion.div>
//           </TabPanel>

//           {/* Account Registers */}
//           <TabPanel id="accountRegisters" label="Account Registers">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                     Account Registers
//                   </h2>
//                   <p className="mt-2 text-gray-600 dark:text-gray-400">
//                     Detailed transaction history for individual accounts
//                   </p>
//                 </div>
//               </div>

//               <Card>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Account</TableHead>
//                       <TableHead>Reference</TableHead>
//                       <TableHead>Description</TableHead>
//                       <TableHead>Debit</TableHead>
//                       <TableHead>Credit</TableHead>
//                       <TableHead>Balance</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {accountRegisters.map((register) => (
//                       <TableRow key={register.id}>
//                         <TableCell>{formatDate(register.date)}</TableCell>
//                         <TableCell className="font-medium">
//                           {register.account_name}
//                         </TableCell>
//                         <TableCell>{register.reference_number}</TableCell>
//                         <TableCell>{register.description}</TableCell>
//                         <TableCell className="text-green-600">
//                           {register.debit_amount > 0 ? formatCurrency(register.debit_amount) : '-'}
//                         </TableCell>
//                         <TableCell className="text-red-600">
//                           {register.credit_amount > 0 ? formatCurrency(register.credit_amount) : '-'}
//                         </TableCell>
//                         <TableCell className="font-medium">
//                           {formatCurrency(register.running_balance)}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Card>
//             </motion.div>
//           </TabPanel>

//           {/* Journal Entries */}
//           <TabPanel id="journalEntries" label="Journal Entries">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                     Journal Entries
//                   </h2>
//                   <p className="mt-2 text-gray-600 dark:text-gray-400">
//                     Manual accounting entries following double-entry bookkeeping
//                   </p>
//                 </div>
//                 <Button onClick={() => setShowJournalEntryForm(true)}>
//                   <PlusIcon className="w-5 h-5 mr-2" />
//                   Add Journal Entry
//                 </Button>
//               </div>

//               <Card>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Reference</TableHead>
//                       <TableHead>Description</TableHead>
//                       <TableHead>Total Debits</TableHead>
//                       <TableHead>Total Credits</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Created By</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredJournalEntries.map((entry) => (
//                       <TableRow key={entry.id}>
//                         <TableCell>{formatDate(entry.date)}</TableCell>
//                         <TableCell className="font-medium">
//                           {entry.reference_number}
//                         </TableCell>
//                         <TableCell>{entry.description}</TableCell>
//                         <TableCell className="text-green-600">
//                           {formatCurrency(entry.total_debits)}
//                         </TableCell>
//                         <TableCell className="text-red-600">
//                           {formatCurrency(entry.total_credits)}
//                         </TableCell>
//                         <TableCell>{getStatusBadge(entry.status)}</TableCell>
//                         <TableCell>{entry.created_by}</TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button 
//                               size="sm" 
//                               variant="ghost"
//                               onClick={() => handleViewJournalEntry(entry)}
//                             >
//                               <EyeIcon className="w-4 h-4" />
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="ghost"
//                               onClick={() => handleEditJournalEntry(entry)}
//                             >
//                               <PencilIcon className="w-4 h-4" />
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="ghost"
//                               onClick={() => handleDeleteJournalEntry(entry.id)}
//                             >
//                               <TrashIcon className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Card>
//             </motion.div>
//           </TabPanel>

//           {/* Account Reconciliation */}
//           <TabPanel id="reconciliation" label="Account Reconciliation">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                     Account Reconciliation
//                   </h2>
//                   <p className="mt-2 text-gray-600 dark:text-gray-400">
//                     Match account balances with external statements
//                   </p>
//                 </div>
//                 <Button onClick={() => setShowReconciliationForm(true)}>
//                   <PlusIcon className="w-5 h-5 mr-2" />
//                   New Reconciliation
//                 </Button>
//               </div>

//               <Card>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Account Name</TableHead>
//                       <TableHead>Statement Date</TableHead>
//                       <TableHead>Beginning Balance</TableHead>
//                       <TableHead>Ending Balance</TableHead>
//                       <TableHead>Reconciled Transactions</TableHead>
//                       <TableHead>Outstanding Items</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {reconciliations.map((reconciliation) => (
//                       <TableRow key={reconciliation.id}>
//                         <TableCell className="font-medium">
//                           {reconciliation.account_name}
//                         </TableCell>
//                         <TableCell>{formatDate(reconciliation.statement_date)}</TableCell>
//                         <TableCell>{formatCurrency(reconciliation.beginning_balance)}</TableCell>
//                         <TableCell>{formatCurrency(reconciliation.ending_balance)}</TableCell>
//                         <TableCell>{reconciliation.reconciled_transactions}</TableCell>
//                         <TableCell>{reconciliation.outstanding_items}</TableCell>
//                         <TableCell>{getStatusBadge(reconciliation.reconciliation_status)}</TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button 
//                               size="sm" 
//                               variant="ghost"
//                               onClick={() => handleViewReconciliation(reconciliation)}
//                             >
//                               <EyeIcon className="w-4 h-4" />
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="ghost"
//                               onClick={() => handleEditReconciliation(reconciliation)}
//                             >
//                               <PencilIcon className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Card>
//             </motion.div>
//           </TabPanel>

//           {/* Close the Books */}
//           <TabPanel id="closeBooks" label="Close the Books">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                     Close the Books
//                   </h2>
//                   <p className="mt-2 text-gray-600 dark:text-gray-400">
//                     Finalize accounting periods and lock historical data
//                   </p>
//                 </div>
//                 <Button variant="danger">
//                   <LockClosedIcon className="w-5 h-5 mr-2" />
//                   Close Current Period
//                 </Button>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//                 <StatsCard
//                   title="Current Period"
//                   value="Aug 2024"
//                   icon={CalendarDaysIcon}
//                   color="blue"
//                   subtitle="Open for transactions"
//                 />
//                 <StatsCard
//                   title="Last Closed Period"
//                   value="Jul 2024"
//                   icon={LockClosedIcon}
//                   color="red"
//                   subtitle="Closed on Aug 05, 2024"
//                 />
//                 <StatsCard
//                   title="Pending Entries"
//                   value={summaryStats.pendingJournalEntries}
//                   icon={ExclamationTriangleIcon}
//                   color="yellow"
//                   subtitle="Must be posted before closing"
//                 />
//               </div>

//               <Card>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Period</TableHead>
//                       <TableHead>Closing Date</TableHead>
//                       <TableHead>Revenue Total</TableHead>
//                       <TableHead>Expense Total</TableHead>
//                       <TableHead>Net Income</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Closed By</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {closingPeriods.map((period) => (
//                       <TableRow key={period.id}>
//                         <TableCell className="font-medium">
//                           {period.closing_period}
//                         </TableCell>
//                         <TableCell>
//                           {period.closing_date ? formatDate(period.closing_date) : '-'}
//                         </TableCell>
//                         <TableCell className="text-green-600">
//                           {formatCurrency(period.revenue_total)}
//                         </TableCell>
//                         <TableCell className="text-red-600">
//                           {formatCurrency(period.expense_total)}
//                         </TableCell>
//                         <TableCell className={`font-medium ${period.net_income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                           {formatCurrency(period.net_income)}
//                         </TableCell>
//                         <TableCell>{getStatusBadge(period.status)}</TableCell>
//                         <TableCell>{period.closed_by || '-'}</TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             {period.status === 'OPEN' ? (
//                               <Button size="sm" variant="danger">
//                                 <LockClosedIcon className="w-4 h-4" />
//                               </Button>
//                             ) : (
//                               <Button size="sm" variant="ghost">
//                                 <EyeIcon className="w-4 h-4" />
//                               </Button>
//                             )}
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Card>
//             </motion.div>
//           </TabPanel>

//           {/* Opening Balances */}
//           <TabPanel id="openingBalances" label="Opening Balances">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                     Opening Balances
//                   </h2>
//                   <p className="mt-2 text-gray-600 dark:text-gray-400">
//                     Initial account balances for new fiscal year or system setup
//                   </p>
//                 </div>
//                 <Button onClick={() => setShowOpeningBalanceForm(true)}>
//                   <PlusIcon className="w-5 h-5 mr-2" />
//                   Add Opening Balance
//                 </Button>
//               </div>

//               <Card>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Account Name</TableHead>
//                       <TableHead>Opening Date</TableHead>
//                       <TableHead>Debit Balance</TableHead>
//                       <TableHead>Credit Balance</TableHead>
//                       <TableHead>Reference</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {openingBalances.map((balance) => (
//                       <TableRow key={balance.id}>
//                         <TableCell className="font-medium">
//                           {balance.account_name}
//                         </TableCell>
//                         <TableCell>{formatDate(balance.opening_balance_date)}</TableCell>
//                         <TableCell className="text-green-600">
//                           {balance.debit_balance > 0 ? formatCurrency(balance.debit_balance) : '-'}
//                         </TableCell>
//                         <TableCell className="text-red-600">
//                           {balance.credit_balance > 0 ? formatCurrency(balance.credit_balance) : '-'}
//                         </TableCell>
//                         <TableCell>{balance.reference}</TableCell>
//                         <TableCell>{getStatusBadge(balance.status)}</TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button 
//                               size="sm" 
//                               variant="ghost"
//                               onClick={() => handleEditOpeningBalance(balance)}
//                             >
//                               <PencilIcon className="w-4 h-4" />
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="ghost"
//                               onClick={() => handleDeleteOpeningBalance(balance.id)}
//                             >
//                               <TrashIcon className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Card>

//               {/* Opening Balance Summary */}
//               <Card className="p-6 mt-6">
//                 <div className="text-center">
//                   <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Opening Balance Summary</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className="text-center">
//                       <p className="text-sm text-gray-600 dark:text-gray-400">Total Debits</p>
//                       <p className="text-2xl font-bold text-green-600">
//                         {formatCurrency(openingBalances.reduce((sum, balance) => sum + (balance.debit_balance || 0), 0))}
//                       </p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-sm text-gray-600 dark:text-gray-400">Total Credits</p>
//                       <p className="text-2xl font-bold text-red-600">
//                         {formatCurrency(openingBalances.reduce((sum, balance) => sum + (balance.credit_balance || 0), 0))}
//                       </p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
//                       <p className={`text-2xl font-bold ${
//                         Math.abs(openingBalances.reduce((sum, balance) => sum + (balance.debit_balance || 0), 0) - 
//                         openingBalances.reduce((sum, balance) => sum + (balance.credit_balance || 0), 0)) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
//                         {formatCurrency(Math.abs(
//                           openingBalances.reduce((sum, balance) => sum + (balance.debit_balance || 0), 0) - 
//                           openingBalances.reduce((sum, balance) => sum + (balance.credit_balance || 0), 0)
//                         ))}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             </motion.div>
//           </TabPanel>

//           {/* Currencies */}
//           <TabPanel id="currencies" label="Currencies">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                     Currencies
//                   </h2>
//                   <p className="mt-2 text-gray-600 dark:text-gray-400">
//                     Manage multiple currencies and exchange rates
//                   </p>
//                 </div>
//                 <Button onClick={() => setShowCurrencyForm(true)}>
//                   <PlusIcon className="w-5 h-5 mr-2" />
//                   Add Currency
//                 </Button>
//               </div>

//               <Card>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Currency Code</TableHead>
//                       <TableHead>Currency Name</TableHead>
//                       <TableHead>Symbol</TableHead>
//                       <TableHead>Exchange Rate</TableHead>
//                       <TableHead>Rate Date</TableHead>
//                       <TableHead>Default</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredCurrencies.map((currency) => (
//                       <TableRow key={currency.id}>
//                         <TableCell className="font-medium">
//                           {currency.currency_code}
//                         </TableCell>
//                         <TableCell>{currency.currency_name}</TableCell>
//                         <TableCell className="font-mono text-lg">
//                           {currency.symbol}
//                         </TableCell>
//                         <TableCell className="font-medium">
//                           {parseFloat(currency.exchange_rate || 0).toFixed(4)}
//                         </TableCell>
//                         <TableCell>{formatDate(currency.rate_date)}</TableCell>
//                         <TableCell>
//                           {currency.default_currency && <Badge variant="success">Default</Badge>}
//                         </TableCell>
//                         <TableCell>{getStatusBadge(currency.status)}</TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button 
//                               size="sm" 
//                               variant="ghost"
//                               onClick={() => handleEditCurrency(currency)}
//                             >
//                               <PencilIcon className="w-4 h-4" />
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="ghost"
//                               onClick={() => handleDeleteCurrency(currency.id)}
//                             >
//                               <TrashIcon className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Card>

//               {/* Currency Conversion Calculator */}
//               <Card className="p-6 mt-6">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
//                   Currency Conversion Calculator
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <Input
//                     label="Amount"
//                     type="number"
//                     placeholder="100.00"
//                   />
//                   <Select
//                     label="From Currency"
//                     options={currencies.map(c => ({ value: c.currency_code, label: `${c.currency_code} - ${c.currency_name}` }))}
//                   />
//                   <Select
//                     label="To Currency"
//                     options={currencies.map(c => ({ value: c.currency_code, label: `${c.currency_code} - ${c.currency_name}` }))}
//                   />
//                   <div className="flex items-end">
//                     <Button className="w-full">
//                       Convert
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             </motion.div>
//           </TabPanel>
//         </Tabs>
//       </main>

//       {/* Modals */}
//       <ChartOfAccountsForm
//         isOpen={showAccountForm}
//         onClose={() => {
//           setShowAccountForm(false);
//           setSelectedAccount(null);
//         }}
//         onSubmit={selectedAccount ? handleUpdateAccount : handleAddAccount}
//         account={selectedAccount}
//       />

//       <JournalEntryForm
//         isOpen={showJournalEntryForm}
//         onClose={() => {
//           setShowJournalEntryForm(false);
//           setSelectedJournalEntry(null);
//         }}
//         onSubmit={selectedJournalEntry ? handleUpdateJournalEntry : handleAddJournalEntry}
//         entry={selectedJournalEntry}
//       />

//       <CurrencyForm
//         isOpen={showCurrencyForm}
//         onClose={() => {
//           setShowCurrencyForm(false);
//           setSelectedCurrency(null);
//         }}
//         onSubmit={selectedCurrency ? handleUpdateCurrency : handleAddCurrency}
//         currency={selectedCurrency}
//       />

//       <ReconciliationForm
//         isOpen={showReconciliationForm}
//         onClose={() => {
//           setShowReconciliationForm(false);
//           setSelectedReconciliation(null);
//         }}
//         onSubmit={selectedReconciliation ? handleUpdateReconciliation : handleAddReconciliation}
//         reconciliation={selectedReconciliation}
//       />

//       <OpeningBalanceForm
//         isOpen={showOpeningBalanceForm}
//         onClose={() => {
//           setShowOpeningBalanceForm(false);
//           setSelectedOpeningBalance(null);
//         }}
//         onSubmit={selectedOpeningBalance ? handleUpdateOpeningBalance : handleAddOpeningBalance}
//         balance={selectedOpeningBalance}
//       />
//     </div>
//   );
// };

// export default AccountingManagement;
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalculatorIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FolderIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  GlobeAltIcon,
  LockClosedIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

// Import components
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  SearchBar,
  StatsCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabPanel
} from '../components/Accounting/ui/index';

import {
  ChartOfAccountsForm,
  CurrencyForm,
  JournalEntryForm,
  ReconciliationForm,
  OpeningBalanceForm
} from '../components/Accounting/Forms/index';

const AccountingManagement = () => {
  const [activeTab, setActiveTab] = useState('chartOfAccounts');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showJournalEntryForm, setShowJournalEntryForm] = useState(false);
  const [showCurrencyForm, setShowCurrencyForm] = useState(false);
  const [showReconciliationForm, setShowReconciliationForm] = useState(false);
  const [showOpeningBalanceForm, setShowOpeningBalanceForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedJournalEntry, setSelectedJournalEntry] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedReconciliation, setSelectedReconciliation] = useState(null);
  const [selectedOpeningBalance, setSelectedOpeningBalance] = useState(null);
  
  // Data states
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [accountRegisters, setAccountRegisters] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [reconciliations, setReconciliations] = useState([]);
  const [closingPeriods, setClosingPeriods] = useState([]);
  const [openingBalances, setOpeningBalances] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [summaryStats, setSummaryStats] = useState({});

  // API Helper Functions
  const apiCall = async (endpoint, method = 'GET', data = null) => {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(endpoint, options);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'API call failed');
      }

      return result;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  // Load data functions
  const loadChartOfAccounts = async () => {
    try {
      const result = await apiCall('/api/accounting?type=chart-of-accounts');
      setChartOfAccounts(result.data || []);
    } catch (error) {
      console.error('Error loading chart of accounts:', error);
    }
  };

  const loadAccountRegisters = async () => {
    try {
      const result = await apiCall('/api/accounting?type=account-registers');
      setAccountRegisters(result.data || []);
    } catch (error) {
      console.error('Error loading account registers:', error);
    }
  };

  const loadJournalEntries = async () => {
    try {
      const result = await apiCall('/api/accounting?type=journal-entries');
      setJournalEntries(result.data || []);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const loadReconciliations = async () => {
    try {
      const result = await apiCall('/api/accounting?type=reconciliations');
      setReconciliations(result.data || []);
    } catch (error) {
      console.error('Error loading reconciliations:', error);
    }
  };

  const loadClosingPeriods = async () => {
    try {
      const result = await apiCall('/api/accounting?type=closing-periods');
      setClosingPeriods(result.data || []);
    } catch (error) {
      console.error('Error loading closing periods:', error);
    }
  };

  const loadOpeningBalances = async () => {
    try {
      const result = await apiCall('/api/accounting?type=opening-balances');
      setOpeningBalances(result.data || []);
    } catch (error) {
      console.error('Error loading opening balances:', error);
    }
  };

  const loadCurrencies = async () => {
    try {
      const result = await apiCall('/api/accounting?type=currencies');
      setCurrencies(result.data || []);
    } catch (error) {
      console.error('Error loading currencies:', error);
    }
  };

  const loadStats = async () => {
    try {
      const result = await apiCall('/api/accounting?type=stats');
      setSummaryStats(result.data || {});
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadChartOfAccounts(),
          loadAccountRegisters(),
          loadJournalEntries(),
          loadReconciliations(),
          loadClosingPeriods(),
          loadOpeningBalances(),
          loadCurrencies(),
          loadStats()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Filter functions
  const filteredAccounts = chartOfAccounts.filter(account => 
    account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.account_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.account_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJournalEntries = journalEntries.filter(entry =>
    entry.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCurrencies = currencies.filter(currency =>
    currency.currency_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.currency_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ACTIVE': { variant: 'success', label: 'Active' },
      'INACTIVE': { variant: 'warning', label: 'Inactive' },
      'POSTED': { variant: 'success', label: 'Posted' },
      'DRAFT': { variant: 'warning', label: 'Draft' },
      'COMPLETED': { variant: 'success', label: 'Completed' },
      'IN_PROGRESS': { variant: 'warning', label: 'In Progress' },
      'PENDING': { variant: 'info', label: 'Pending' },
      'CLOSED': { variant: 'danger', label: 'Closed' },
      'OPEN': { variant: 'success', label: 'Open' },
      'FINAL': { variant: 'success', label: 'Final' }
    };
    
    const config = statusConfig[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // CRUD operations for Chart of Accounts
  const handleAddAccount = async (accountData) => {
    try {
      await apiCall('/api/accounting', 'POST', {
        type: 'chart-of-accounts',
        ...accountData
      });
      await loadChartOfAccounts();
      await loadStats();
      setShowAccountForm(false);
    } catch (error) {
      console.error('Error adding account:', error);
      alert('Error adding account: ' + error.message);
    }
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setShowAccountForm(true);
  };

  const handleUpdateAccount = async (accountData) => {
    try {
      await apiCall('/api/accounting', 'PUT', {
        type: 'chart-of-accounts',
        id: selectedAccount.id,
        ...accountData
      });
      await loadChartOfAccounts();
      await loadStats();
      setSelectedAccount(null);
      setShowAccountForm(false);
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Error updating account: ' + error.message);
    }
  };

  const handleDeleteAccount = async (id) => {
    if (confirm('Are you sure you want to delete this account?')) {
      try {
        await apiCall(`/api/accounting?type=chart-of-accounts&id=${id}`, 'DELETE');
        await loadChartOfAccounts();
        await loadStats();
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account: ' + error.message);
      }
    }
  };

  // CRUD operations for Journal Entries
  const handleAddJournalEntry = async (entryData) => {
    try {
      await apiCall('/api/accounting', 'POST', {
        type: 'journal-entry',
        ...entryData,
        created_by: 'Current User'
      });
      await loadJournalEntries();
      await loadAccountRegisters();
      await loadStats();
      setShowJournalEntryForm(false);
    } catch (error) {
      console.error('Error adding journal entry:', error);
      alert('Error adding journal entry: ' + error.message);
    }
  };

  const handleViewJournalEntry = (entry) => {
    setSelectedJournalEntry(entry);
    setShowJournalEntryForm(true);
  };

  const handleEditJournalEntry = (entry) => {
    setSelectedJournalEntry(entry);
    setShowJournalEntryForm(true);
  };

  const handleUpdateJournalEntry = async (entryData) => {
    try {
      await apiCall('/api/accounting', 'PUT', {
        type: 'journal-entry',
        id: selectedJournalEntry.id,
        ...entryData
      });
      await loadJournalEntries();
      await loadAccountRegisters();
      setSelectedJournalEntry(null);
      setShowJournalEntryForm(false);
    } catch (error) {
      console.error('Error updating journal entry:', error);
      alert('Error updating journal entry: ' + error.message);
    }
  };

  const handleDeleteJournalEntry = async (id) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await apiCall(`/api/accounting?type=journal-entry&id=${id}`, 'DELETE');
        await loadJournalEntries();
        await loadStats();
      } catch (error) {
        console.error('Error deleting journal entry:', error);
        alert('Error deleting journal entry: ' + error.message);
      }
    }
  };

  // CRUD operations for Currencies
  const handleAddCurrency = async (currencyData) => {
    try {
      await apiCall('/api/accounting', 'POST', {
        type: 'currency',
        ...currencyData
      });
      await loadCurrencies();
      await loadStats();
      setShowCurrencyForm(false);
    } catch (error) {
      console.error('Error adding currency:', error);
      alert('Error adding currency: ' + error.message);
    }
  };

  const handleEditCurrency = (currency) => {
    setSelectedCurrency(currency);
    setShowCurrencyForm(true);
  };

  const handleUpdateCurrency = async (currencyData) => {
    try {
      await apiCall('/api/accounting', 'PUT', {
        type: 'currency',
        id: selectedCurrency.id,
        ...currencyData
      });
      await loadCurrencies();
      setSelectedCurrency(null);
      setShowCurrencyForm(false);
    } catch (error) {
      console.error('Error updating currency:', error);
      alert('Error updating currency: ' + error.message);
    }
  };

  const handleDeleteCurrency = async (id) => {
    if (confirm('Are you sure you want to delete this currency?')) {
      try {
        await apiCall(`/api/accounting?type=currency&id=${id}`, 'DELETE');
        await loadCurrencies();
        await loadStats();
      } catch (error) {
        console.error('Error deleting currency:', error);
        alert('Error deleting currency: ' + error.message);
      }
    }
  };

  // CRUD operations for Reconciliations
  const handleAddReconciliation = async (reconciliationData) => {
    try {
      await apiCall('/api/accounting', 'POST', {
        type: 'reconciliation',
        ...reconciliationData
      });
      await loadReconciliations();
      setShowReconciliationForm(false);
    } catch (error) {
      console.error('Error adding reconciliation:', error);
      alert('Error adding reconciliation: ' + error.message);
    }
  };

  const handleViewReconciliation = (reconciliation) => {
    setSelectedReconciliation(reconciliation);
    setShowReconciliationForm(true);
  };

  const handleEditReconciliation = (reconciliation) => {
    setSelectedReconciliation(reconciliation);
    setShowReconciliationForm(true);
  };

  const handleUpdateReconciliation = async (reconciliationData) => {
    try {
      await apiCall('/api/accounting', 'PUT', {
        type: 'reconciliation',
        id: selectedReconciliation.id,
        ...reconciliationData
      });
      await loadReconciliations();
      setSelectedReconciliation(null);
      setShowReconciliationForm(false);
    } catch (error) {
      console.error('Error updating reconciliation:', error);
      alert('Error updating reconciliation: ' + error.message);
    }
  };

  // CRUD operations for Opening Balances
  const handleAddOpeningBalance = async (balanceData) => {
    try {
      await apiCall('/api/accounting', 'POST', {
        type: 'opening-balance',
        ...balanceData
      });
      await loadOpeningBalances();
      setShowOpeningBalanceForm(false);
    } catch (error) {
      console.error('Error adding opening balance:', error);
      alert('Error adding opening balance: ' + error.message);
    }
  };

  const handleEditOpeningBalance = (balance) => {
    setSelectedOpeningBalance(balance);
    setShowOpeningBalanceForm(true);
  };

  const handleUpdateOpeningBalance = async (balanceData) => {
    try {
      await apiCall('/api/accounting', 'PUT', {
        type: 'opening-balance',
        id: selectedOpeningBalance.id,
        ...balanceData
      });
      await loadOpeningBalances();
      setSelectedOpeningBalance(null);
      setShowOpeningBalanceForm(false);
    } catch (error) {
      console.error('Error updating opening balance:', error);
      alert('Error updating opening balance: ' + error.message);
    }
  };

  const handleDeleteOpeningBalance = async (id) => {
    if (confirm('Are you sure you want to delete this opening balance?')) {
      try {
        await apiCall(`/api/accounting?type=opening-balance&id=${id}`, 'DELETE');
        await loadOpeningBalances();
      } catch (error) {
        console.error('Error deleting opening balance:', error);
        alert('Error deleting opening balance: ' + error.message);
      }
    }
  };

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
                <CalculatorIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-4 text-2xl font-bold text-blue-600 dark:text-blue-400">
                Accounting Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search accounts, entries..."
                className="w-64"
              />
              <Button variant="secondary">
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <StatsCard
            title="Total Accounts"
            value={summaryStats.totalAccounts || 0}
            icon={FolderIcon}
            color="blue"
          />
          <StatsCard
            title="Active Accounts"
            value={summaryStats.activeAccounts || 0}
            icon={CheckCircleIcon}
            color="green"
          />
          <StatsCard
            title="Total Assets"
            value={formatCurrency(summaryStats.totalAssets || 0)}
            icon={ChartBarIcon}
            color="emerald"
          />
          <StatsCard
            title="Total Liabilities"
            value={formatCurrency(summaryStats.totalLiabilities || 0)}
            icon={ExclamationTriangleIcon}
            color="red"
          />
          <StatsCard
            title="Pending Entries"
            value={summaryStats.pendingJournalEntries || 0}
            icon={DocumentDuplicateIcon}
            color="yellow"
          />
          <StatsCard
            title="Active Currencies"
            value={summaryStats.activeCurrencies || 0}
            icon={GlobeAltIcon}
            color="purple"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultTab="chartOfAccounts" onChange={setActiveTab}>
          {/* Chart of Accounts */}
          <TabPanel id="chartOfAccounts" label="Chart of Accounts">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Chart of Accounts
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Master list of all accounts used in the accounting system
                  </p>
                </div>
                <Button onClick={() => setShowAccountForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Account
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Code</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Subtype</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">
                          {account.account_code}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{account.account_name}</div>
                            <div className="text-sm text-gray-500">{account.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="info">{account.account_type}</Badge>
                        </TableCell>
                        <TableCell>{account.account_subtype || '-'}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(account.balance)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {account.currency_code} {account.currency_symbol}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(account.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditAccount(account)}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteAccount(account.id)}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Account Registers */}
          <TabPanel id="accountRegisters" label="Account Registers">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Account Registers
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Detailed transaction history for individual accounts
                  </p>
                </div>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Debit</TableHead>
                      <TableHead>Credit</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountRegisters.map((register) => (
                      <TableRow key={register.id}>
                        <TableCell>{formatDate(register.date)}</TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div>{register.account_name}</div>
                            <div className="text-sm text-gray-500">{register.account_type}</div>
                          </div>
                        </TableCell>
                        <TableCell>{register.reference_number}</TableCell>
                        <TableCell>{register.description}</TableCell>
                        <TableCell className="text-green-600">
                          {register.debit_amount > 0 ? formatCurrency(register.debit_amount) : '-'}
                        </TableCell>
                        <TableCell className="text-red-600">
                          {register.credit_amount > 0 ? formatCurrency(register.credit_amount) : '-'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(register.running_balance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Journal Entries */}
          <TabPanel id="journalEntries" label="Journal Entries">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Journal Entries
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Manual accounting entries following double-entry bookkeeping
                  </p>
                </div>
                <Button onClick={() => setShowJournalEntryForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Journal Entry
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Total Debits</TableHead>
                      <TableHead>Total Credits</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJournalEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{formatDate(entry.date)}</TableCell>
                        <TableCell className="font-medium">
                          {entry.reference_number}
                        </TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell className="text-green-600">
                          {formatCurrency(entry.total_debits)}
                        </TableCell>
                        <TableCell className="text-red-600">
                          {formatCurrency(entry.total_credits)}
                        </TableCell>
                        <TableCell>{getStatusBadge(entry.status)}</TableCell>
                        <TableCell>{entry.created_by}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleViewJournalEntry(entry)}
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleEditJournalEntry(entry)}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeleteJournalEntry(entry.id)}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Account Reconciliation */}
          <TabPanel id="reconciliation" label="Account Reconciliation">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Account Reconciliation
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Match account balances with external statements
                  </p>
                </div>
                <Button onClick={() => setShowReconciliationForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  New Reconciliation
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Statement Date</TableHead>
                      <TableHead>Beginning Balance</TableHead>
                      <TableHead>Ending Balance</TableHead>
                      <TableHead>Reconciled Items</TableHead>
                      <TableHead>Outstanding Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reconciliations.map((reconciliation) => (
                      <TableRow key={reconciliation.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{reconciliation.account_name}</div>
                            <div className="text-sm text-gray-500">{reconciliation.account_type}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(reconciliation.statement_date)}</TableCell>
                        <TableCell>{formatCurrency(reconciliation.beginning_balance)}</TableCell>
                        <TableCell>{formatCurrency(reconciliation.ending_balance)}</TableCell>
                        <TableCell>{reconciliation.reconciled_transactions}</TableCell>
                        <TableCell>{reconciliation.outstanding_items}</TableCell>
                        <TableCell>{getStatusBadge(reconciliation.reconciliation_status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleViewReconciliation(reconciliation)}
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleEditReconciliation(reconciliation)}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Close the Books */}
          <TabPanel id="closeBooks" label="Close the Books">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Close the Books
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Finalize accounting periods and lock historical data
                  </p>
                </div>
                <Button variant="danger">
                  <LockClosedIcon className="w-5 h-5 mr-2" />
                  Close Current Period
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <StatsCard
                  title="Current Period"
                  value="Aug 2024"
                  icon={CalendarDaysIcon}
                  color="blue"
                  subtitle="Open for transactions"
                />
                <StatsCard
                  title="Last Closed Period"
                  value="Jul 2024"
                  icon={LockClosedIcon}
                  color="red"
                  subtitle="Closed on Aug 05, 2024"
                />
                <StatsCard
                  title="Pending Entries"
                  value={summaryStats.pendingJournalEntries || 0}
                  icon={ExclamationTriangleIcon}
                  color="yellow"
                  subtitle="Must be posted before closing"
                />
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Closing Date</TableHead>
                      <TableHead>Revenue Total</TableHead>
                      <TableHead>Expense Total</TableHead>
                      <TableHead>Net Income</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Closed By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {closingPeriods.map((period) => (
                      <TableRow key={period.id}>
                        <TableCell className="font-medium">
                          {period.closing_period}
                        </TableCell>
                        <TableCell>
                          {period.closing_date ? formatDate(period.closing_date) : '-'}
                        </TableCell>
                        <TableCell className="text-green-600">
                          {formatCurrency(period.revenue_total)}
                        </TableCell>
                        <TableCell className="text-red-600">
                          {formatCurrency(period.expense_total)}
                        </TableCell>
                        <TableCell className={`font-medium ${period.net_income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(period.net_income)}
                        </TableCell>
                        <TableCell>{getStatusBadge(period.status)}</TableCell>
                        <TableCell>{period.closed_by || '-'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {period.status === 'OPEN' ? (
                              <Button size="sm" variant="danger">
                                <LockClosedIcon className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button size="sm" variant="ghost">
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Opening Balances */}
          <TabPanel id="openingBalances" label="Opening Balances">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Opening Balances
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Initial account balances for new fiscal year or system setup
                  </p>
                </div>
                <Button onClick={() => setShowOpeningBalanceForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Opening Balance
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Opening Date</TableHead>
                      <TableHead>Debit Balance</TableHead>
                      <TableHead>Credit Balance</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openingBalances.map((balance) => (
                      <TableRow key={balance.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{balance.account_name}</div>
                            <div className="text-sm text-gray-500">{balance.account_type}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(balance.opening_balance_date)}</TableCell>
                        <TableCell className="text-green-600">
                          {balance.debit_balance > 0 ? formatCurrency(balance.debit_balance) : '-'}
                        </TableCell>
                        <TableCell className="text-red-600">
                          {balance.credit_balance > 0 ? formatCurrency(balance.credit_balance) : '-'}
                        </TableCell>
                        <TableCell>{balance.reference}</TableCell>
                        <TableCell>{getStatusBadge(balance.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleEditOpeningBalance(balance)}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeleteOpeningBalance(balance.id)}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              {/* Opening Balance Summary */}
              <Card className="p-6 mt-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Opening Balance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Debits</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(openingBalances.reduce((sum, balance) => sum + (balance.debit_balance || 0), 0))}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Credits</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(openingBalances.reduce((sum, balance) => sum + (balance.credit_balance || 0), 0))}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                      <p className={`text-2xl font-bold ${
                        Math.abs(openingBalances.reduce((sum, balance) => sum + (balance.debit_balance || 0), 0) - 
                        openingBalances.reduce((sum, balance) => sum + (balance.credit_balance || 0), 0)) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(Math.abs(
                          openingBalances.reduce((sum, balance) => sum + (balance.debit_balance || 0), 0) - 
                          openingBalances.reduce((sum, balance) => sum + (balance.credit_balance || 0), 0)
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Currencies */}
          <TabPanel id="currencies" label="Currencies">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Currencies
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Manage multiple currencies and exchange rates
                  </p>
                </div>
                <Button onClick={() => setShowCurrencyForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Currency
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Currency Code</TableHead>
                      <TableHead>Currency Name</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Exchange Rate</TableHead>
                      <TableHead>Rate Date</TableHead>
                      <TableHead>Default</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCurrencies.map((currency) => (
                      <TableRow key={currency.id}>
                        <TableCell className="font-medium">
                          {currency.currency_code}
                        </TableCell>
                        <TableCell>{currency.currency_name}</TableCell>
                        <TableCell className="font-mono text-lg">
                          {currency.symbol}
                        </TableCell>
                        <TableCell className="font-medium">
                          {parseFloat(currency.exchange_rate || 0).toFixed(4)}
                        </TableCell>
                        <TableCell>{formatDate(currency.rate_date)}</TableCell>
                        <TableCell>
                          {currency.default_currency && <Badge variant="success">Default</Badge>}
                        </TableCell>
                        <TableCell>{getStatusBadge(currency.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleEditCurrency(currency)}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeleteCurrency(currency.id)}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              {/* Currency Conversion Calculator */}
              <Card className="p-6 mt-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Currency Conversion Calculator
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    label="Amount"
                    type="number"
                    placeholder="100.00"
                  />
                  <Select
                    label="From Currency"
                    options={currencies.map(c => ({ value: c.currency_code, label: `${c.currency_code} - ${c.currency_name}` }))}
                  />
                  <Select
                    label="To Currency"
                    options={currencies.map(c => ({ value: c.currency_code, label: `${c.currency_code} - ${c.currency_name}` }))}
                  />
                  <div className="flex items-end">
                    <Button className="w-full">
                      Convert
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabPanel>
        </Tabs>
      </main>

      {/* Modals */}
      <ChartOfAccountsForm
        isOpen={showAccountForm}
        onClose={() => {
          setShowAccountForm(false);
          setSelectedAccount(null);
        }}
        onSubmit={selectedAccount ? handleUpdateAccount : handleAddAccount}
        account={selectedAccount}
      />

      <JournalEntryForm
        isOpen={showJournalEntryForm}
        onClose={() => {
          setShowJournalEntryForm(false);
          setSelectedJournalEntry(null);
        }}
        onSubmit={selectedJournalEntry ? handleUpdateJournalEntry : handleAddJournalEntry}
        entry={selectedJournalEntry}
      />

      <CurrencyForm
        isOpen={showCurrencyForm}
        onClose={() => {
          setShowCurrencyForm(false);
          setSelectedCurrency(null);
        }}
        onSubmit={selectedCurrency ? handleUpdateCurrency : handleAddCurrency}
        currency={selectedCurrency}
      />

      <ReconciliationForm
        isOpen={showReconciliationForm}
        onClose={() => {
          setShowReconciliationForm(false);
          setSelectedReconciliation(null);
        }}
        onSubmit={selectedReconciliation ? handleUpdateReconciliation : handleAddReconciliation}
        reconciliation={selectedReconciliation}
      />

      <OpeningBalanceForm
        isOpen={showOpeningBalanceForm}
        onClose={() => {
          setShowOpeningBalanceForm(false);
          setSelectedOpeningBalance(null);
        }}
        onSubmit={selectedOpeningBalance ? handleUpdateOpeningBalance : handleAddOpeningBalance}
        balance={selectedOpeningBalance}
      />
    </div>
  );
};

export default AccountingManagement;