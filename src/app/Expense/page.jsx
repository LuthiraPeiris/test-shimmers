'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCardIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  TruckIcon,
  ComputerDesktopIcon,
  PhoneIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

// ========== UI COMPONENTS (same as before) ==========
const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  };
 
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1 text-sm'
  };
 
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  className = '', 
  type = 'button',
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
 
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 disabled:bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-gray-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 dark:hover:bg-gray-700 dark:text-gray-300'
  };
 
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
 
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' } : {}}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${hover ? 'transition-all duration-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  className = '', 
  required = false, 
  value,
  onChange,
  placeholder,
  accept,
  ...props 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        accept={accept}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

const Select = ({ 
  label, 
  error, 
  options = [], 
  placeholder = 'Select an option', 
  className = '', 
  required = false,
  value,
  onChange,
  ...props 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
   
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden`}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
      />
      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
};

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300"
    >
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {trend && (
            <p className={`text-sm ${trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}%
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Table = ({ children, className = '' }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children }) => (
  <thead className="bg-gray-50 dark:bg-gray-700/50">
    {children}
  </thead>
);

const TableBody = ({ children }) => (
  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
    {children}
  </tbody>
);

const TableRow = ({ children, hover = true, ...props }) => (
  <motion.tr
    whileHover={hover ? { backgroundColor: 'rgba(59, 130, 246, 0.05)' } : {}}
    className="transition-colors duration-200"
    {...props}
  >
    {children}
  </motion.tr>
);

const TableHead = ({ children, className = '' }) => (
  <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${className}`}>
    {children}
  </td>
);

const Tabs = ({ defaultTab, children, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
 
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };
 
  return (
    <div>
      <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
        {children.map((child) => (
          <button
            key={child.props.id}
            onClick={() => handleTabChange(child.props.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === child.props.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            {child.props.label}
          </button>
        ))}
      </nav>
      <div className="mt-6">
        {children.find(child => child.props.id === activeTab)}
      </div>
    </div>
  );
};

const TabPanel = ({ id, label, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// ========== API SERVICE ==========
const apiService = {
  async fetchExpenses(params = {}) {
    const searchParams = new URLSearchParams({
      type: 'expenses',
      ...params
    });
    
    const response = await fetch(`/api/expense?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return response.json();
  },

  async fetchRecurringExpenses(params = {}) {
    const searchParams = new URLSearchParams({
      type: 'recurring',
      ...params
    });
    
    const response = await fetch(`/api/expense?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch recurring expenses');
    return response.json();
  },

  async createExpense(formData) {
    formData.append('type', 'expense');
    const response = await fetch('/api/expense', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to create expense');
    return response.json();
  },

  async createRecurringExpense(formData) {
    formData.append('type', 'recurring');
    const response = await fetch('/api/expense', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to create recurring expense');
    return response.json();
  },

  async updateExpense(id, formData) {
    formData.append('id', id);
    formData.append('type', 'expense');
    const response = await fetch('/api/expense', {
      method: 'PUT',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to update expense');
    return response.json();
  },

  async updateRecurringExpense(id, formData) {
    formData.append('id', id);
    formData.append('type', 'recurring');
    const response = await fetch('/api/expense', {
      method: 'PUT',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to update recurring expense');
    return response.json();
  },

  async deleteExpense(id) {
    const response = await fetch(`/api/expense?id=${id}&type=expense`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete expense');
    return response.json();
  },

  async deleteRecurringExpense(id) {
    const response = await fetch(`/api/expense?id=${id}&type=recurring`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete recurring expense');
    return response.json();
  },

  async fetchStats() {
    const response = await fetch('/api/expense/stats');
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  }
};

// ========== FORM COMPONENTS ==========
const ExpenseForm = ({ isOpen, onClose, onSubmit, expense = null }) => {
  const [formData, setFormData] = useState({
    expense_date: expense?.expense_date || new Date().toISOString().split('T')[0],
    payee_name: expense?.payee_name || '',
    expense_category: expense?.expense_category || '',
    payment_method: expense?.payment_method || '',
    amount: expense?.amount || '',
    notes: expense?.notes || '',
    receipt_attachment: null
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setFormData({
        expense_date: expense.expense_date || new Date().toISOString().split('T')[0],
        payee_name: expense.payee_name || '',
        expense_category: expense.expense_category || '',
        payment_method: expense.payment_method || '',
        amount: expense.amount || '',
        notes: expense.notes || '',
        receipt_attachment: null
      });
    }
  }, [expense]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.payee_name.trim()) newErrors.payee_name = 'Payee name is required';
    if (!formData.expense_category) newErrors.expense_category = 'Category is required';
    if (!formData.payment_method) newErrors.payment_method = 'Payment method is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.expense_date) newErrors.expense_date = 'Expense date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitFormData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitFormData.append(key, formData[key]);
        }
      });

      if (expense?.receipt_attachment) {
        submitFormData.append('existing_receipt_path', expense.receipt_attachment);
      }

      await onSubmit(expense ? expense.id : null, submitFormData);
      
      setFormData({
        expense_date: new Date().toISOString().split('T')[0],
        payee_name: '',
        expense_category: '',
        payment_method: '',
        amount: '',
        notes: '',
        receipt_attachment: null
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to save expense. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, receipt_attachment: file }));
  };

  const expenseCategoryOptions = [
    { value: 'TRAVEL', label: 'Travel' },
    { value: 'OFFICE_SUPPLIES', label: 'Office Supplies' },
    { value: 'UTILITIES', label: 'Utilities' },
    { value: 'RENT', label: 'Rent' },
    { value: 'MEALS', label: 'Meals & Entertainment' },
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'TECHNOLOGY', label: 'Technology' },
    { value: 'PROFESSIONAL_SERVICES', label: 'Professional Services' },
    { value: 'INSURANCE', label: 'Insurance' },
    { value: 'MAINTENANCE', label: 'Maintenance & Repairs' },
    { value: 'OTHER', label: 'Other' }
  ];

  const paymentMethodOptions = [
    { value: 'CASH', label: 'Cash' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'DEBIT_CARD', label: 'Debit Card' },
    { value: 'CHECK', label: 'Check' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'PAYPAL', label: 'PayPal' },
    { value: 'OTHER', label: 'Other' }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={expense ? 'Edit Expense' : 'Add New Expense'}
      size="lg"
    >
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Expense Date"
            type="date"
            value={formData.expense_date}
            onChange={(e) => handleChange('expense_date', e.target.value)}
            error={errors.expense_date}
            required
          />
          
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            error={errors.amount}
            required
            placeholder="0.00"
          />
          
          <Input
            label="Payee Name"
            value={formData.payee_name}
            onChange={(e) => handleChange('payee_name', e.target.value)}
            error={errors.payee_name}
            required
            placeholder="Vendor or service provider name"
          />
          
          <Select
            label="Expense Category"
            value={formData.expense_category}
            onChange={(e) => handleChange('expense_category', e.target.value)}
            options={expenseCategoryOptions}
            error={errors.expense_category}
            required
          />
          
          <Select
            label="Payment Method"
            value={formData.payment_method}
            onChange={(e) => handleChange('payment_method', e.target.value)}
            options={paymentMethodOptions}
            error={errors.payment_method}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Receipt Attachment
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.gif"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Supported: PDF, JPG, PNG (Max 5MB)</p>
            {expense?.receipt_attachment && (
              <p className="text-xs text-green-600 mt-1">Current: {expense.receipt_attachment}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Additional notes or description..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {expense ? 'Update Expense' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const RecurringExpenseForm = ({ isOpen, onClose, onSubmit, recurringExpense = null }) => {
  const [formData, setFormData] = useState({
    payee_name: recurringExpense?.payee_name || '',
    expense_category: recurringExpense?.expense_category || '',
    amount: recurringExpense?.amount || '',
    frequency: recurringExpense?.frequency || '',
    start_date: recurringExpense?.start_date || new Date().toISOString().split('T')[0],
    end_date: recurringExpense?.end_date || '',
    payment_method: recurringExpense?.payment_method || '',
    notes: recurringExpense?.notes || ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (recurringExpense) {
      setFormData({
        payee_name: recurringExpense.payee_name || '',
        expense_category: recurringExpense.expense_category || '',
        amount: recurringExpense.amount || '',
        frequency: recurringExpense.frequency || '',
        start_date: recurringExpense.start_date || new Date().toISOString().split('T')[0],
        end_date: recurringExpense.end_date || '',
        payment_method: recurringExpense.payment_method || '',
        notes: recurringExpense.notes || ''
      });
    }
  }, [recurringExpense]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.payee_name.trim()) newErrors.payee_name = 'Payee name is required';
    if (!formData.expense_category) newErrors.expense_category = 'Category is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.frequency) newErrors.frequency = 'Frequency is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.payment_method) newErrors.payment_method = 'Payment method is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitFormData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitFormData.append(key, formData[key]);
        }
      });

      await onSubmit(recurringExpense ? recurringExpense.id : null, submitFormData);
      
      setFormData({
        payee_name: '',
        expense_category: '',
        amount: '',
        frequency: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        payment_method: '',
        notes: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to save recurring expense. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const expenseCategoryOptions = [
    { value: 'RENT', label: 'Rent' },
    { value: 'UTILITIES', label: 'Utilities' },
    { value: 'INSURANCE', label: 'Insurance' },
    { value: 'SUBSCRIPTIONS', label: 'Subscriptions' },
    { value: 'LOAN_PAYMENTS', label: 'Loan Payments' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'OTHER', label: 'Other' }
  ];

  const frequencyOptions = [
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'BIWEEKLY', label: 'Bi-weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'QUARTERLY', label: 'Quarterly' },
    { value: 'ANNUALLY', label: 'Annually' }
  ];

  const paymentMethodOptions = [
    { value: 'ACH', label: 'ACH Transfer' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'CHECK', label: 'Check' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'OTHER', label: 'Other' }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={recurringExpense ? 'Edit Recurring Expense' : 'Setup Recurring Expense'}
      size="lg"
    >
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Payee Name"
            value={formData.payee_name}
            onChange={(e) => handleChange('payee_name', e.target.value)}
            error={errors.payee_name}
            required
            placeholder="e.g., AWS, Office Landlord"
          />
          
          <Select
            label="Expense Category"
            value={formData.expense_category}
            onChange={(e) => handleChange('expense_category', e.target.value)}
            options={expenseCategoryOptions}
            error={errors.expense_category}
            required
          />
          
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            error={errors.amount}
            required
            placeholder="0.00"
          />
          
          <Select
            label="Frequency"
            value={formData.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
            options={frequencyOptions}
            error={errors.frequency}
            required
          />
          
          <Input
            label="Start Date"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleChange('start_date', e.target.value)}
            error={errors.start_date}
            required
          />
          
          <Input
            label="End Date"
            type="date"
            value={formData.end_date}
            onChange={(e) => handleChange('end_date', e.target.value)}
            placeholder="Leave empty for indefinite"
          />
          
          <div className="md:col-span-2">
            <Select
              label="Payment Method"
              value={formData.payment_method}
              onChange={(e) => handleChange('payment_method', e.target.value)}
              options={paymentMethodOptions}
              error={errors.payment_method}
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Additional notes about this recurring expense..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {recurringExpense ? 'Update Recurring Expense' : 'Setup Recurring Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const ExpenseDetailsModal = ({ expense, isOpen, onClose }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'TRAVEL': TruckIcon,
      'OFFICE_SUPPLIES': BuildingOfficeIcon,
      'UTILITIES': HomeIcon,
      'TECHNOLOGY': ComputerDesktopIcon,
      'MEALS': BanknotesIcon,
      'OTHER': DocumentTextIcon
    };
    const IconComponent = icons[category] || DocumentTextIcon;
    return <IconComponent className="w-5 h-5" />;
  };

  if (!expense) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Expense Details" size="lg">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            {getCategoryIcon(expense.expense_category)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {expense.payee_name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {expense.expense_category?.replace('_', ' ')}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(expense.amount)}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(expense.expense_date)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expense ID</h4>
            <p className="text-gray-900 dark:text-gray-100">{expense.expense_id}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</h4>
            <p className="text-gray-900 dark:text-gray-100">{expense.payment_method?.replace('_', ' ')}</p>
          </div>
        </div>

        {expense.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</h4>
            <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              {expense.notes}
            </p>
          </div>
        )}

        {expense.receipt_attachment && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Receipt</h4>
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex items-center space-x-3">
              <PaperClipIcon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900 dark:text-gray-100">
                {expense.receipt_attachment.split('/').pop()}
              </span>
              <Button size="sm" variant="ghost" onClick={() => window.open(expense.receipt_attachment, '_blank')}>
                <EyeIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

// ========== MAIN COMPONENT ==========
const ExpenseManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState('expenses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedRecurringExpense, setSelectedRecurringExpense] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Modal states
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showRecurringExpenseForm, setShowRecurringExpenseForm] = useState(false);
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  
  // Data states
  const [expenses, setExpenses] = useState([]);
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Load data functions
  const loadExpenses = async (params = {}) => {
    try {
      setLoading(true);
      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        category: categoryFilter,
        startDate: dateRange.start,
        endDate: dateRange.end,
        ...params
      };

      // Remove empty filters
      Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
      });

      const result = await apiService.fetchExpenses(filters);
      setExpenses(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecurringExpenses = async (params = {}) => {
    try {
      setLoading(true);
      const filters = {
        page: 1,
        limit: 50,
        search: searchTerm,
        ...params
      };

      Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
      });

      const result = await apiService.fetchRecurringExpenses(filters);
      setRecurringExpenses(result.data);
    } catch (error) {
      console.error('Error loading recurring expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await apiService.fetchStats();
      setStats(result.summary);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    if (activeTab === 'expenses') {
      loadExpenses();
    } else {
      loadRecurringExpenses();
    }
  }, [activeTab, searchTerm, categoryFilter, dateRange, pagination.page]);

  useEffect(() => {
    loadStats();
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'APPROVED': { variant: 'success', label: 'Approved' },
      'PENDING': { variant: 'warning', label: 'Pending' },
      'REJECTED': { variant: 'danger', label: 'Rejected' },
      'ACTIVE': { variant: 'success', label: 'Active' },
      'INACTIVE': { variant: 'warning', label: 'Inactive' },
      'CANCELLED': { variant: 'danger', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      'TRAVEL': { variant: 'info', label: 'Travel' },
      'OFFICE_SUPPLIES': { variant: 'purple', label: 'Office Supplies' },
      'UTILITIES': { variant: 'warning', label: 'Utilities' },
      'RENT': { variant: 'danger', label: 'Rent' },
      'MEALS': { variant: 'success', label: 'Meals' },
      'MARKETING': { variant: 'info', label: 'Marketing' },
      'TECHNOLOGY': { variant: 'purple', label: 'Technology' },
      'INSURANCE': { variant: 'warning', label: 'Insurance' },
      'SUBSCRIPTIONS': { variant: 'info', label: 'Subscriptions' },
      'OTHER': { variant: 'default', label: 'Other' }
    };
    
    const config = categoryConfig[category] || { variant: 'default', label: category };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // CRUD operations
  const handleAddExpense = async (id, formData) => {
    try {
      await apiService.createExpense(formData);
      await loadExpenses();
      await loadStats();
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setShowExpenseForm(true);
  };

  const handleUpdateExpense = async (id, formData) => {
    try {
      await apiService.updateExpense(id, formData);
      await loadExpenses();
      await loadStats();
      setSelectedExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  };

  const handleDeleteExpense = async (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await apiService.deleteExpense(id);
        await loadExpenses();
        await loadStats();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleAddRecurringExpense = async (id, formData) => {
    try {
      await apiService.createRecurringExpense(formData);
      await loadRecurringExpenses();
      await loadStats();
    } catch (error) {
      console.error('Error adding recurring expense:', error);
      throw error;
    }
  };

  const handleEditRecurringExpense = (recurringExpense) => {
    setSelectedRecurringExpense(recurringExpense);
    setShowRecurringExpenseForm(true);
  };

  const handleUpdateRecurringExpense = async (id, formData) => {
    try {
      await apiService.updateRecurringExpense(id, formData);
      await loadRecurringExpenses();
      await loadStats();
      setSelectedRecurringExpense(null);
    } catch (error) {
      console.error('Error updating recurring expense:', error);
      throw error;
    }
  };

  const handleDeleteRecurringExpense = async (id) => {
    if (confirm('Are you sure you want to delete this recurring expense?')) {
      try {
        await apiService.deleteRecurringExpense(id);
        await loadRecurringExpenses();
        await loadStats();
      } catch (error) {
        console.error('Error deleting recurring expense:', error);
      }
    }
  };

  const handleViewExpenseDetails = (expense) => {
    setSelectedExpense(expense);
    setShowExpenseDetails(true);
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'TRAVEL', label: 'Travel' },
    { value: 'OFFICE_SUPPLIES', label: 'Office Supplies' },
    { value: 'UTILITIES', label: 'Utilities' },
    { value: 'RENT', label: 'Rent' },
    { value: 'MEALS', label: 'Meals & Entertainment' },
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'TECHNOLOGY', label: 'Technology' },
    { value: 'INSURANCE', label: 'Insurance' },
    { value: 'OTHER', label: 'Other' }
  ];

  if (loading && (!expenses.length && !recurringExpenses.length)) {
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
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <CreditCardIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-4 text-2xl font-bold text-green-600 dark:text-green-400">
                Expense Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search expenses..."
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Expenses"
            value={stats.totalExpenses || 0}
            icon={DocumentTextIcon}
            color="blue"
          />
          <StatsCard
            title="This Month"
            value={formatCurrency(stats.monthlyTotal)}
            icon={CreditCardIcon}
            color="green"
            trend={stats.monthlyChange?.trend}
            trendValue={Math.abs(stats.monthlyChange?.percentage || 0)}
          />
          <StatsCard
            title="Pending Approval"
            value={stats.pendingApproval || 0}
            icon={ClipboardDocumentListIcon}
            color="orange"
          />
          <StatsCard
            title="Monthly Recurring"
            value={formatCurrency(stats.recurringTotal)}
            icon={CalendarIcon}
            color="purple"
          />
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Category Filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categoryOptions}
            />
            <Input
              label="Start Date"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <Input
              label="End Date"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
            <div className="flex items-end">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setCategoryFilter('');
                  setDateRange({ start: '', end: '' });
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultTab="expenses" onChange={setActiveTab}>
          {/* Expense List Tab */}
          <TabPanel id="expenses" label="Expense List">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Expense Transactions
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Track and manage all business expenses
                  </p>
                </div>
                <Button onClick={() => setShowExpenseForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Expense
                </Button>
              </div>

              <Card>
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading expenses...</p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Expense ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Payee</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenses.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell className="font-medium">
                              {expense.expense_id}
                            </TableCell>
                            <TableCell>{formatDate(expense.expense_date)}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{expense.payee_name}</div>
                                {expense.receipt_attachment && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    <PaperClipIcon className="w-3 h-3 mr-1" />
                                    Receipt attached
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getCategoryBadge(expense.expense_category)}</TableCell>
                            <TableCell>{expense.payment_method?.replace('_', ' ')}</TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(expense.amount)}
                            </TableCell>
                            <TableCell>{getStatusBadge(expense.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleViewExpenseDetails(expense)}
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditExpense(expense)}
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteExpense(expense.id)}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={!pagination.hasPrev}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                          >
                            Previous
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={!pagination.hasNext}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </motion.div>
          </TabPanel>

          {/* Recurring Expenses Tab */}
          <TabPanel id="recurring" label="Recurring Expenses">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Recurring Expenses
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Manage automated recurring payments
                  </p>
                </div>
                <Button onClick={() => setShowRecurringExpenseForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Setup Recurring Expense
                </Button>
              </div>

              <Card>
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading recurring expenses...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Payee</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Next Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recurringExpenses.map((recurring) => (
                        <TableRow key={recurring.id}>
                          <TableCell className="font-medium">
                            {recurring.recurring_expense_id}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{recurring.payee_name}</div>
                            <div className="text-sm text-gray-500">
                              {recurring.payment_method?.replace('_', ' ')}
                            </div>
                          </TableCell>
                          <TableCell>{getCategoryBadge(recurring.expense_category)}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(recurring.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="info">{recurring.frequency}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(recurring.next_payment_date)}</TableCell>
                          <TableCell>{getStatusBadge(recurring.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleEditRecurringExpense(recurring)}
                              >
                                <PencilIcon className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleDeleteRecurringExpense(recurring.id)}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card>
            </motion.div>
          </TabPanel>
        </Tabs>
      </main>

      {/* Modals */}
      <ExpenseForm
        isOpen={showExpenseForm}
        onClose={() => {
          setShowExpenseForm(false);
          setSelectedExpense(null);
        }}
        onSubmit={selectedExpense ? handleUpdateExpense : handleAddExpense}
        expense={selectedExpense}
      />

      <RecurringExpenseForm
        isOpen={showRecurringExpenseForm}
        onClose={() => {
          setShowRecurringExpenseForm(false);
          setSelectedRecurringExpense(null);
        }}
        onSubmit={selectedRecurringExpense ? handleUpdateRecurringExpense : handleAddRecurringExpense}
        recurringExpense={selectedRecurringExpense}
      />

      <ExpenseDetailsModal
        expense={selectedExpense}
        isOpen={showExpenseDetails}
        onClose={() => {
          setShowExpenseDetails(false);
          setSelectedExpense(null);
        }}
      />
    </div>
  );
};

export default ExpenseManagement;