'use client';
import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  TrashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Modal, Input, Select, Button } from '../ui';

// ========== CHART OF ACCOUNTS FORM ==========
export const ChartOfAccountsForm = ({ isOpen, onClose, onSubmit, account = null }) => {
  const [formData, setFormData] = useState({
    account_code: account?.account_code || '',
    account_name: account?.account_name || '',
    account_type: account?.account_type || '',
    account_subtype: account?.account_subtype || '',
    parent_account: account?.parent_account || '',
    description: account?.description || '',
    tax_code: account?.tax_code || '',
    status: account?.status || 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setFormData({
        account_code: account.account_code || '',
        account_name: account.account_name || '',
        account_type: account.account_type || '',
        account_subtype: account.account_subtype || '',
        parent_account: account.parent_account || '',
        description: account.description || '',
        tax_code: account.tax_code || '',
        status: account.status || 'ACTIVE'
      });
    }
  }, [account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const accountTypeOptions = [
    { value: 'ASSET', label: 'Asset' },
    { value: 'LIABILITY', label: 'Liability' },
    { value: 'EQUITY', label: 'Equity' },
    { value: 'INCOME', label: 'Income' },
    { value: 'EXPENSE', label: 'Expense' }
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={account ? 'Edit Account' : 'Add New Account'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Account Code"
            value={formData.account_code}
            onChange={(e) => handleChange('account_code', e.target.value)}
            required
            placeholder="1000"
          />
          
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={statusOptions}
          />
          
          <div className="md:col-span-2">
            <Input
              label="Account Name"
              value={formData.account_name}
              onChange={(e) => handleChange('account_name', e.target.value)}
              required
              placeholder="Cash and Bank"
            />
          </div>
          
          <Select
            label="Account Type"
            value={formData.account_type}
            onChange={(e) => handleChange('account_type', e.target.value)}
            options={accountTypeOptions}
            required
          />
          
          <Input
            label="Account Subtype"
            value={formData.account_subtype}
            onChange={(e) => handleChange('account_subtype', e.target.value)}
            placeholder="Current Assets"
          />
          
          <Input
            label="Parent Account"
            value={formData.parent_account}
            onChange={(e) => handleChange('parent_account', e.target.value)}
            placeholder="1000"
          />
          
          <Input
            label="Tax Code"
            value={formData.tax_code}
            onChange={(e) => handleChange('tax_code', e.target.value)}
            placeholder="TAX001"
          />
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Account description..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {account ? 'Update Account' : 'Add Account'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ========== CURRENCY FORM ==========
export const CurrencyForm = ({ isOpen, onClose, onSubmit, currency = null }) => {
  const [formData, setFormData] = useState({
    currency_code: currency?.currency_code || '',
    currency_name: currency?.currency_name || '',
    symbol: currency?.symbol || '',
    exchange_rate: currency?.exchange_rate || '',
    default_currency: currency?.default_currency || false,
    status: currency?.status || 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currency) {
      setFormData({
        currency_code: currency.currency_code || '',
        currency_name: currency.currency_name || '',
        symbol: currency.symbol || '',
        exchange_rate: currency.exchange_rate || '',
        default_currency: currency.default_currency || false,
        status: currency.status || 'ACTIVE'
      });
    }
  }, [currency]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={currency ? 'Edit Currency' : 'Add New Currency'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Currency Code"
            value={formData.currency_code}
            onChange={(e) => handleChange('currency_code', e.target.value)}
            required
            placeholder="USD"
            maxLength={3}
          />
          
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={statusOptions}
          />
          
          <div className="md:col-span-2">
            <Input
              label="Currency Name"
              value={formData.currency_name}
              onChange={(e) => handleChange('currency_name', e.target.value)}
              required
              placeholder="US Dollar"
            />
          </div>
          
          <Input
            label="Symbol"
            value={formData.symbol}
            onChange={(e) => handleChange('symbol', e.target.value)}
            required
            placeholder="$"
          />
          
          <Input
            label="Exchange Rate"
            type="number"
            step="0.0001"
            value={formData.exchange_rate}
            onChange={(e) => handleChange('exchange_rate', e.target.value)}
            required
            placeholder="1.0000"
          />
          
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.default_currency}
                onChange={(e) => handleChange('default_currency', e.target.checked)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Set as default currency</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {currency ? 'Update Currency' : 'Add Currency'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ========== JOURNAL ENTRY FORM ==========
export const JournalEntryForm = ({ isOpen, onClose, onSubmit, entry = null }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    reference_number: entry?.reference_number || '',
    description: entry?.description || '',
    entries: entry?.entries || [{ account: '', debit: '', credit: '' }]
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date || new Date().toISOString().split('T')[0],
        reference_number: entry.reference_number || '',
        description: entry.description || '',
        entries: entry.entries || [{ account: '', debit: '', credit: '' }]
      });
    }
  }, [entry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        reference_number: '',
        description: '',
        entries: [{ account: '', debit: '', credit: '' }]
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...formData.entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setFormData(prev => ({ ...prev, entries: newEntries }));
  };

  const addEntry = () => {
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, { account: '', debit: '', credit: '' }]
    }));
  };

  const removeEntry = (index) => {
    if (formData.entries.length > 1) {
      const newEntries = formData.entries.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, entries: newEntries }));
    }
  };

  const totalDebits = formData.entries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
  const totalCredits = formData.entries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={entry ? 'Edit Journal Entry' : 'Add New Journal Entry'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Reference Number"
            value={formData.reference_number}
            onChange={(e) => handleChange('reference_number', e.target.value)}
            required
            placeholder="JE-001"
          />
          
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />
          
          <div className="md:col-span-2">
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              placeholder="Journal entry description"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Journal Entries</h4>
            <Button type="button" onClick={addEntry} size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.entries.map((entry, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="col-span-5">
                  <Input
                    label="Account"
                    value={entry.account}
                    onChange={(e) => handleEntryChange(index, 'account', e.target.value)}
                    placeholder="Select account"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    label="Debit"
                    type="number"
                    step="0.01"
                    value={entry.debit}
                    onChange={(e) => handleEntryChange(index, 'debit', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    label="Credit"
                    type="number"
                    step="0.01"
                    value={entry.credit}
                    onChange={(e) => handleEntryChange(index, 'credit', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeEntry(index)}
                    disabled={formData.entries.length === 1}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Debits</p>
                <p className="text-lg font-bold text-green-600">${totalDebits.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Credits</p>
                <p className="text-lg font-bold text-red-600">${totalCredits.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Difference</p>
                <p className={`text-lg font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(totalDebits - totalCredits).toFixed(2)}
                </p>
                {isBalanced && <CheckCircleIcon className="w-5 h-5 text-green-600 mx-auto mt-1" />}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!isBalanced}>
            {entry ? 'Update Entry' : 'Save Entry'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ========== RECONCILIATION FORM ==========
export const ReconciliationForm = ({ isOpen, onClose, onSubmit, reconciliation = null }) => {
  const [formData, setFormData] = useState({
    account_name: reconciliation?.account_name || '',
    statement_date: reconciliation?.statement_date || new Date().toISOString().split('T')[0],
    beginning_balance: reconciliation?.beginning_balance || '',
    ending_balance: reconciliation?.ending_balance || '',
    reconciled_transactions: reconciliation?.reconciled_transactions || 0,
    outstanding_items: reconciliation?.outstanding_items || 0
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reconciliation) {
      setFormData({
        account_name: reconciliation.account_name || '',
        statement_date: reconciliation.statement_date || new Date().toISOString().split('T')[0],
        beginning_balance: reconciliation.beginning_balance || '',
        ending_balance: reconciliation.ending_balance || '',
        reconciled_transactions: reconciliation.reconciled_transactions || 0,
        outstanding_items: reconciliation.outstanding_items || 0
      });
    }
  }, [reconciliation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={reconciliation ? 'Edit Reconciliation' : 'New Reconciliation'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Account Name"
            value={formData.account_name}
            onChange={(e) => handleChange('account_name', e.target.value)}
            required
            placeholder="Checking Account"
          />
          
          <Input
            label="Statement Date"
            type="date"
            value={formData.statement_date}
            onChange={(e) => handleChange('statement_date', e.target.value)}
            required
          />
          
          <Input
            label="Beginning Balance"
            type="number"
            step="0.01"
            value={formData.beginning_balance}
            onChange={(e) => handleChange('beginning_balance', e.target.value)}
            required
            placeholder="0.00"
          />
          
          <Input
            label="Ending Balance"
            type="number"
            step="0.01"
            value={formData.ending_balance}
            onChange={(e) => handleChange('ending_balance', e.target.value)}
            required
            placeholder="0.00"
          />
          
          <Input
            label="Reconciled Transactions"
            type="number"
            value={formData.reconciled_transactions}
            onChange={(e) => handleChange('reconciled_transactions', e.target.value)}
            placeholder="0"
          />
          
          <Input
            label="Outstanding Items"
            type="number"
            value={formData.outstanding_items}
            onChange={(e) => handleChange('outstanding_items', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {reconciliation ? 'Update Reconciliation' : 'Save Reconciliation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ========== OPENING BALANCE FORM ==========
export const OpeningBalanceForm = ({ isOpen, onClose, onSubmit, balance = null }) => {
  const [formData, setFormData] = useState({
    account_name: balance?.account_name || '',
    opening_balance_date: balance?.opening_balance_date || new Date().toISOString().split('T')[0],
    debit_balance: balance?.debit_balance || '',
    credit_balance: balance?.credit_balance || '',
    reference: balance?.reference || '',
    status: balance?.status || 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (balance) {
      setFormData({
        account_name: balance.account_name || '',
        opening_balance_date: balance.opening_balance_date || new Date().toISOString().split('T')[0],
        debit_balance: balance.debit_balance || '',
        credit_balance: balance.credit_balance || '',
        reference: balance.reference || '',
        status: balance.status || 'ACTIVE'
      });
    }
  }, [balance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={balance ? 'Edit Opening Balance' : 'Add Opening Balance'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Account Name"
            value={formData.account_name}
            onChange={(e) => handleChange('account_name', e.target.value)}
            required
            placeholder="Cash Account"
          />
          
          <Input
            label="Opening Date"
            type="date"
            value={formData.opening_balance_date}
            onChange={(e) => handleChange('opening_balance_date', e.target.value)}
            required
          />
          
          <Input
            label="Debit Balance"
            type="number"
            step="0.01"
            value={formData.debit_balance}
            onChange={(e) => handleChange('debit_balance', e.target.value)}
            placeholder="0.00"
          />
          
          <Input
            label="Credit Balance"
            type="number"
            step="0.01"
            value={formData.credit_balance}
            onChange={(e) => handleChange('credit_balance', e.target.value)}
            placeholder="0.00"
          />
          
          <Input
            label="Reference"
            value={formData.reference}
            onChange={(e) => handleChange('reference', e.target.value)}
            placeholder="REF001"
          />
          
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={statusOptions}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {balance ? 'Update Balance' : 'Save Balance'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};