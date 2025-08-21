// Banking Module Forms
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingLibraryIcon,
  CreditCardIcon,
  ArrowsRightLeftIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button, Input, Select, Card, Modal } from '../ui/index.js';

// ========== BANK ACCOUNT FORM ==========

export const BankAccountForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountType: '',
    routingNumber: '',
    balance: 0,
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        bankName: '',
        accountNumber: '',
        accountType: '',
        routingNumber: '',
        balance: 0,
        status: 'Active'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const accountTypeOptions = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'money_market', label: 'Money Market' },
    { value: 'business_checking', label: 'Business Checking' },
    { value: 'business_savings', label: 'Business Savings' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Pending', label: 'Pending Verification' },
    { value: 'Closed', label: 'Closed' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (formData.accountNumber.length < 8) {
      newErrors.accountNumber = 'Account number must be at least 8 digits';
    }

    if (!formData.accountType) {
      newErrors.accountType = 'Account type is required';
    }

    if (!formData.routingNumber.trim()) {
      newErrors.routingNumber = 'Routing number is required';
    } else if (!/^\d{9}$/.test(formData.routingNumber)) {
      newErrors.routingNumber = 'Routing number must be exactly 9 digits';
    }

    if (isNaN(formData.balance)) {
      newErrors.balance = 'Balance must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        balance: parseFloat(formData.balance) || 0
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Bank Account' : 'Add Bank Account'}
      size="lg"
    >
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Bank Name"
            required
            value={formData.bankName}
            onChange={(e) => handleChange('bankName', e.target.value)}
            error={errors.bankName}
            placeholder="Enter bank name"
          />

          <Select
            label="Account Type"
            required
            value={formData.accountType}
            onChange={(e) => handleChange('accountType', e.target.value)}
            options={accountTypeOptions}
            error={errors.accountType}
            placeholder="Select account type"
          />

          <Input
            label="Account Number"
            required
            value={formData.accountNumber}
            onChange={(e) => handleChange('accountNumber', e.target.value)}
            error={errors.accountNumber}
            placeholder="Enter account number"
            type="text"
          />

          <Input
            label="Routing Number"
            required
            value={formData.routingNumber}
            onChange={(e) => handleChange('routingNumber', e.target.value)}
            error={errors.routingNumber}
            placeholder="9-digit routing number"
            maxLength={9}
          />

          <Input
            label="Initial Balance"
            type="number"
            step="0.01"
            value={formData.balance}
            onChange={(e) => handleChange('balance', e.target.value)}
            error={errors.balance}
            placeholder="0.00"
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={statusOptions}
            placeholder="Select status"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            <CheckIcon className="w-4 h-4 mr-2" />
            {initialData ? 'Update Account' : 'Add Account'}
          </Button>
        </div>
      </motion.form>
    </Modal>
  );
};

// ========== TRANSACTION FORM ==========

export const TransactionForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  loading = false,
  bankAccounts = []
}) => {
  const [formData, setFormData] = useState({
    bankAccount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'debit',
    category: '',
    status: 'Pending',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        bankAccount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        type: 'debit',
        category: '',
        status: 'Pending',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const typeOptions = [
    { value: 'debit', label: 'Debit (Money Out)' },
    { value: 'credit', label: 'Credit (Money In)' }
  ];

  const categoryOptions = [
    { value: 'office_expenses', label: 'Office Expenses' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'travel', label: 'Travel & Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'rent', label: 'Rent & Lease' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'professional_services', label: 'Professional Services' },
    { value: 'equipment', label: 'Equipment & Software' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'sales', label: 'Sales Revenue' },
    { value: 'consulting', label: 'Consulting Revenue' },
    { value: 'interest', label: 'Interest Income' },
    { value: 'other_income', label: 'Other Income' },
    { value: 'uncategorized', label: 'Uncategorized' }
  ];

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Cleared', label: 'Cleared' },
    { value: 'Failed', label: 'Failed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bankAccount) {
      newErrors.bankAccount = 'Bank account is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const amount = parseFloat(formData.amount);
      onSubmit({
        ...formData,
        amount: formData.type === 'debit' ? -Math.abs(amount) : Math.abs(amount)
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Transaction' : 'Add Transaction'}
      size="lg"
    >
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Bank Account"
            required
            value={formData.bankAccount}
            onChange={(e) => handleChange('bankAccount', e.target.value)}
            options={bankAccounts.map(account => ({
              value: account.id,
              label: `${account.bankName} - ${account.accountType} (****${account.accountNumber.slice(-4)})`
            }))}
            error={errors.bankAccount}
            placeholder="Select bank account"
          />

          <Input
            label="Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            error={errors.date}
          />

          <div className="md:col-span-2">
            <Input
              label="Description"
              required
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={errors.description}
              placeholder="Enter transaction description"
            />
          </div>

          <Select
            label="Transaction Type"
            required
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            options={typeOptions}
            error={errors.type}
          />

          <Input
            label="Amount"
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            error={errors.amount}
            placeholder="0.00"
          />

          <Select
            label="Category"
            required
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            options={categoryOptions}
            error={errors.category}
            placeholder="Select category"
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={statusOptions}
            placeholder="Select status"
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes about this transaction..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            <CheckIcon className="w-4 h-4 mr-2" />
            {initialData ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </div>
      </motion.form>
    </Modal>
  );
};

// ========== RECONCILIATION FORM ==========

export const ReconciliationForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  bankAccounts = [],
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    bankAccount: '',
    statementStartDate: '',
    statementEndDate: '',
    statementOpeningBalance: '',
    statementClosingBalance: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Set default dates (current month)
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      setFormData({
        bankAccount: '',
        statementStartDate: startOfMonth.toISOString().split('T')[0],
        statementEndDate: endOfMonth.toISOString().split('T')[0],
        statementOpeningBalance: '',
        statementClosingBalance: '',
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bankAccount) {
      newErrors.bankAccount = 'Bank account is required';
    }

    if (!formData.statementStartDate) {
      newErrors.statementStartDate = 'Start date is required';
    }

    if (!formData.statementEndDate) {
      newErrors.statementEndDate = 'End date is required';
    }

    if (formData.statementStartDate && formData.statementEndDate) {
      if (new Date(formData.statementStartDate) >= new Date(formData.statementEndDate)) {
        newErrors.statementEndDate = 'End date must be after start date';
      }
    }

    if (!formData.statementOpeningBalance || isNaN(parseFloat(formData.statementOpeningBalance))) {
      newErrors.statementOpeningBalance = 'Opening balance is required and must be a number';
    }

    if (!formData.statementClosingBalance || isNaN(parseFloat(formData.statementClosingBalance))) {
      newErrors.statementClosingBalance = 'Closing balance is required and must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        statementOpeningBalance: parseFloat(formData.statementOpeningBalance),
        statementClosingBalance: parseFloat(formData.statementClosingBalance)
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Start Bank Reconciliation"
      size="lg"
    >
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Select
              label="Bank Account"
              required
              value={formData.bankAccount}
              onChange={(e) => handleChange('bankAccount', e.target.value)}
              options={bankAccounts.map(account => ({
                value: account.id,
                label: `${account.bankName} - ${account.accountType} (****${account.accountNumber.slice(-4)})`
              }))}
              error={errors.bankAccount}
              placeholder="Select bank account to reconcile"
            />
          </div>

          <Input
            label="Statement Start Date"
            type="date"
            required
            value={formData.statementStartDate}
            onChange={(e) => handleChange('statementStartDate', e.target.value)}
            error={errors.statementStartDate}
          />

          <Input
            label="Statement End Date"
            type="date"
            required
            value={formData.statementEndDate}
            onChange={(e) => handleChange('statementEndDate', e.target.value)}
            error={errors.statementEndDate}
          />

          <Input
            label="Statement Opening Balance"
            type="number"
            step="0.01"
            required
            value={formData.statementOpeningBalance}
            onChange={(e) => handleChange('statementOpeningBalance', e.target.value)}
            error={errors.statementOpeningBalance}
            placeholder="0.00"
          />

          <Input
            label="Statement Closing Balance"
            type="number"
            step="0.01"
            required
            value={formData.statementClosingBalance}
            onChange={(e) => handleChange('statementClosingBalance', e.target.value)}
            error={errors.statementClosingBalance}
            placeholder="0.00"
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes about this reconciliation..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex">
            <DocumentTextIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400">Reconciliation Process</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                After starting the reconciliation, you'll be able to match transactions from your bank statement 
                with recorded transactions to identify any discrepancies.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            <CheckIcon className="w-4 h-4 mr-2" />
            Start Reconciliation
          </Button>
        </div>
      </motion.form>
    </Modal>
  );
};

// ========== TRANSFER FUNDS FORM ==========

export const TransferForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  loading = false,
  bankAccounts = []
}) => {
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    transferDate: new Date().toISOString().split('T')[0],
    notes: '',
    reference: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        transferDate: initialData.transferDate ? 
          new Date(initialData.transferDate).toISOString().split('T')[0] : 
          new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        transferDate: new Date().toISOString().split('T')[0],
        notes: '',
        reference: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fromAccount) {
      newErrors.fromAccount = 'Source account is required';
    }

    if (!formData.toAccount) {
      newErrors.toAccount = 'Destination account is required';
    }

    if (formData.fromAccount === formData.toAccount) {
      newErrors.toAccount = 'Destination account must be different from source account';
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.transferDate) {
      newErrors.transferDate = 'Transfer date is required';
    }

    // Check if source account has sufficient balance
    const sourceAccount = bankAccounts.find(acc => acc.id === formData.fromAccount);
    if (sourceAccount && parseFloat(formData.amount) > sourceAccount.balance) {
      newErrors.amount = 'Insufficient funds in source account';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const availableToAccounts = bankAccounts.filter(account => 
    account.id !== formData.fromAccount && account.status === 'Active'
  );

  const selectedFromAccount = bankAccounts.find(acc => acc.id === formData.fromAccount);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Transfer' : 'Transfer Funds'}
      size="lg"
    >
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="From Account"
            required
            value={formData.fromAccount}
            onChange={(e) => handleChange('fromAccount', e.target.value)}
            options={bankAccounts
              .filter(account => account.status === 'Active')
              .map(account => ({
                value: account.id,
                label: `${account.bankName} - ${account.accountType} (****${account.accountNumber.slice(-4)}) - ${account.balance.toFixed(2)}`
              }))}
            error={errors.fromAccount}
            placeholder="Select source account"
          />

          <Select
            label="To Account"
            required
            value={formData.toAccount}
            onChange={(e) => handleChange('toAccount', e.target.value)}
            options={availableToAccounts.map(account => ({
              value: account.id,
              label: `${account.bankName} - ${account.accountType} (****${account.accountNumber.slice(-4)})`
            }))}
            error={errors.toAccount}
            placeholder="Select destination account"
            disabled={!formData.fromAccount}
          />

          <Input
            label="Amount"
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            error={errors.amount}
            placeholder="0.00"
          />

          <Input
            label="Transfer Date"
            type="date"
            required
            value={formData.transferDate}
            onChange={(e) => handleChange('transferDate', e.target.value)}
            error={errors.transferDate}
          />

          <Input
            label="Reference Number (Optional)"
            value={formData.reference}
            onChange={(e) => handleChange('reference', e.target.value)}
            placeholder="Enter reference number"
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes about this transfer..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {selectedFromAccount && (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Available Balance:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                ${selectedFromAccount.balance.toFixed(2)}
              </span>
            </div>
            {formData.amount && (
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">Remaining Balance:</span>
                <span className={`font-medium ${(selectedFromAccount.balance - parseFloat(formData.amount || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(selectedFromAccount.balance - parseFloat(formData.amount || 0)).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            <ArrowsRightLeftIcon className="w-4 h-4 mr-2" />
            {initialData ? 'Update Transfer' : 'Transfer Funds'}
          </Button>
        </div>
      </motion.form>
    </Modal>
  );
};