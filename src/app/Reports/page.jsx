// Complete Financial Reports Management System
'use client';
import "../globals.css"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BanknotesIcon,
  ShoppingCartIcon,
  ReceiptRefundIcon,
  UsersIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  PrinterIcon,
  ChartPieIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

// ========== UI COMPONENTS ==========

const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
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
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl'
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

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue', subtitle }) => {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    pink: 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
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
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-sm flex items-center mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <ArrowTrendingUpIcon className="w-4 h-4 mr-1" /> : <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />}
              {trendValue}
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
      <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {children.map((child) => (
          <button
            key={child.props.id}
            onClick={() => handleTabChange(child.props.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
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

// ========== REPORT FILTER COMPONENT ==========

const ReportFilters = ({ filters, onFiltersChange, reportType }) => {
  const periodOptions = [
    { value: 'current_month', label: 'Current Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'current_quarter', label: 'Current Quarter' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'current_year', label: 'Current Year' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          label="Report Period"
          value={filters.period}
          onChange={(e) => handleFilterChange('period', e.target.value)}
          options={periodOptions}
        />
        
        {filters.period === 'custom' && (
          <>
            <Input
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </>
        )}
        
        <div className="flex items-end space-x-2">
          <Button onClick={() => onFiltersChange(filters)}>
            <FunnelIcon className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
          <Button variant="secondary">
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </Card>
  );
};

// ========== MAIN REPORTS COMPONENT ==========

const ReportsManagement = () => {
  const [activeTab, setActiveTab] = useState('profitLoss');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    period: 'current_month',
    startDate: '',
    endDate: ''
  });

  // Mock data for all reports
  const [reportData, setReportData] = useState({
    profitLoss: {
      reportPeriod: 'Q3 2024',
      totalIncome: 2850000,
      totalExpenses: 1920000,
      netProfit: 930000,
      incomeDetails: [
        { category: 'Product Sales', amount: 1850000 },
        { category: 'Service Revenue', amount: 750000 },
        { category: 'Consulting', amount: 180000 },
        { category: 'Licensing', amount: 70000 }
      ],
      expenseDetails: [
        { category: 'Cost of Goods Sold', amount: 925000 },
        { category: 'Salaries & Benefits', amount: 485000 },
        { category: 'Marketing & Advertising', amount: 180000 },
        { category: 'Office Expenses', amount: 125000 },
        { category: 'Professional Services', amount: 95000 },
        { category: 'Utilities', amount: 45000 },
        { category: 'Insurance', amount: 35000 },
        { category: 'Other Expenses', amount: 30000 }
      ]
    },
    balanceSheet: {
      reportDate: '2024-09-30',
      assets: {
        current: [
          { item: 'Cash and Cash Equivalents', amount: 850000 },
          { item: 'Accounts Receivable', amount: 420000 },
          { item: 'Inventory', amount: 380000 },
          { item: 'Prepaid Expenses', amount: 65000 }
        ],
        nonCurrent: [
          { item: 'Property, Plant & Equipment', amount: 1250000 },
          { item: 'Intangible Assets', amount: 180000 },
          { item: 'Long-term Investments', amount: 320000 }
        ]
      },
      liabilities: {
        current: [
          { item: 'Accounts Payable', amount: 285000 },
          { item: 'Short-term Debt', amount: 150000 },
          { item: 'Accrued Expenses', amount: 95000 }
        ],
        nonCurrent: [
          { item: 'Long-term Debt', amount: 650000 },
          { item: 'Deferred Tax Liabilities', amount: 85000 }
        ]
      },
      equity: [
        { item: 'Share Capital', amount: 1000000 },
        { item: 'Retained Earnings', amount: 1200000 }
      ]
    },
    cashFlow: {
      reportPeriod: 'Q3 2024',
      operating: [
        { activity: 'Net Income', amount: 930000 },
        { activity: 'Depreciation & Amortization', amount: 125000 },
        { activity: 'Changes in Working Capital', amount: -85000 }
      ],
      investing: [
        { activity: 'Capital Expenditures', amount: -180000 },
        { activity: 'Asset Disposals', amount: 45000 },
        { activity: 'Investment Purchases', amount: -120000 }
      ],
      financing: [
        { activity: 'Debt Proceeds', amount: 200000 },
        { activity: 'Debt Repayments', amount: -150000 },
        { activity: 'Dividend Payments', amount: -285000 }
      ]
    },
    sales: {
      reportPeriod: 'Q3 2024',
      totalSales: 1850000,
      salesByProduct: [
        { product: 'Product A', amount: 650000, percentage: 35.1 },
        { product: 'Product B', amount: 485000, percentage: 26.2 },
        { product: 'Product C', amount: 380000, percentage: 20.5 },
        { product: 'Product D', amount: 235000, percentage: 12.7 },
        { product: 'Others', amount: 100000, percentage: 5.4 }
      ],
      salesByCustomer: [
        { customer: 'Enterprise Corp', amount: 420000, percentage: 22.7 },
        { customer: 'Global Industries', amount: 285000, percentage: 15.4 },
        { customer: 'Tech Solutions Ltd', amount: 180000, percentage: 9.7 },
        { customer: 'Innovation Inc', amount: 165000, percentage: 8.9 },
        { customer: 'Others', amount: 800000, percentage: 43.2 }
      ]
    },
    purchases: {
      reportPeriod: 'Q3 2024',
      totalPurchases: 925000,
      purchasesByVendor: [
        { vendor: 'Supplier Alpha', amount: 285000, percentage: 30.8 },
        { vendor: 'Manufacturing Plus', amount: 180000, percentage: 19.5 },
        { vendor: 'Components Direct', amount: 125000, percentage: 13.5 },
        { vendor: 'Global Supply Co', amount: 95000, percentage: 10.3 },
        { vendor: 'Others', amount: 240000, percentage: 25.9 }
      ],
      purchasesByCategory: [
        { category: 'Raw Materials', amount: 420000, percentage: 45.4 },
        { category: 'Finished Goods', amount: 285000, percentage: 30.8 },
        { category: 'Office Supplies', amount: 85000, percentage: 9.2 },
        { category: 'Equipment', amount: 65000, percentage: 7.0 },
        { category: 'Services', amount: 70000, percentage: 7.6 }
      ]
    },
    taxSummary: {
      reportPeriod: 'Q3 2024',
      totalTaxCollected: 185000,
      totalTaxPaid: 158000,
      netTaxLiability: 27000,
      taxDetails: [
        { taxType: 'Sales Tax', collected: 95000, paid: 0, net: 95000 },
        { taxType: 'Income Tax', collected: 0, paid: 125000, net: -125000 },
        { taxType: 'VAT', collected: 65000, paid: 0, net: 65000 },
        { taxType: 'Payroll Tax', collected: 0, paid: 33000, net: -33000 },
        { taxType: 'Property Tax', collected: 25000, paid: 0, net: 25000 }
      ]
    },
    payrollSummary: {
      reportPeriod: 'Q3 2024',
      totalGrossPay: 485000,
      totalDeductions: 125000,
      netPayTotal: 360000,
      payrollBreakdown: [
        { department: 'Engineering', grossPay: 185000, deductions: 45000, netPay: 140000 },
        { department: 'Sales', grossPay: 125000, deductions: 32000, netPay: 93000 },
        { department: 'Marketing', grossPay: 85000, deductions: 22000, netPay: 63000 },
        { department: 'Administration', grossPay: 90000, deductions: 26000, netPay: 64000 }
      ]
    },
    expenseBreakdown: {
      reportPeriod: 'Q3 2024',
      totalExpenses: 1920000,
      expenseCategories: [
        { category: 'Cost of Goods Sold', amount: 925000, percentage: 48.2 },
        { category: 'Salaries & Benefits', amount: 485000, percentage: 25.3 },
        { category: 'Marketing & Advertising', amount: 180000, percentage: 9.4 },
        { category: 'Office Expenses', amount: 125000, percentage: 6.5 },
        { category: 'Professional Services', amount: 95000, percentage: 4.9 },
        { category: 'Utilities', amount: 45000, percentage: 2.3 },
        { category: 'Insurance', amount: 35000, percentage: 1.8 },
        { category: 'Other Expenses', amount: 30000, percentage: 1.6 }
      ]
    }
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Data is already set in state
      } catch (error) {
        console.error('Error loading report data:', error);
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

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate summary stats
  const summaryStats = {
    totalRevenue: reportData.profitLoss.totalIncome,
    totalExpenses: reportData.profitLoss.totalExpenses,
    netProfit: reportData.profitLoss.netProfit,
    profitMargin: (reportData.profitLoss.netProfit / reportData.profitLoss.totalIncome) * 100
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
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-4 text-2xl font-bold text-blue-600 dark:text-blue-400">
                Financial Reports
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary">
                <PrinterIcon className="w-5 h-5 mr-2" />
                Print All
              </Button>
              <Button variant="secondary">
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(summaryStats.totalRevenue)}
            icon={CurrencyDollarIcon}
            color="green"
            trend="up"
            trendValue="12.5% vs last quarter"
          />
          <StatsCard
            title="Total Expenses"
            value={formatCurrency(summaryStats.totalExpenses)}
            icon={ChartBarIcon}
            color="red"
            trend="up"
            trendValue="8.2% vs last quarter"
          />
          <StatsCard
            title="Net Profit"
            value={formatCurrency(summaryStats.netProfit)}
            icon={ArrowTrendingUpIcon}
            color="emerald"
            trend="up"
            trendValue="18.7% vs last quarter"
          />
          <StatsCard
            title="Profit Margin"
            value={formatPercentage(summaryStats.profitMargin)}
            icon={ChartPieIcon}
            color="blue"
            trend="up"
            trendValue="2.1% vs last quarter"
          />
        </div>

        {/* Report Filters */}
        <ReportFilters
          filters={filters}
          onFiltersChange={setFilters}
          reportType={activeTab}
        />

        {/* Tabs */}
        <Tabs defaultTab="profitLoss" onChange={setActiveTab}>
          {/* Profit & Loss Report */}
          <TabPanel id="profitLoss" label="Profit & Loss">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Profit & Loss Statement
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    For the period: {reportData.profitLoss.reportPeriod}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income Section */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <PlusIcon className="w-5 h-5 mr-2 text-green-600" />
                    Revenue & Income
                  </h3>
                  <div className="space-y-3">
                    {reportData.profitLoss.incomeDetails.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-700 dark:text-gray-300">{item.category}</span>
                        <span className="font-semibold text-green-600">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 dark:border-gray-600 font-bold">
                      <span className="text-gray-900 dark:text-gray-100">Total Income</span>
                      <span className="text-green-600 text-lg">{formatCurrency(reportData.profitLoss.totalIncome)}</span>
                    </div>
                  </div>
                </Card>

                {/* Expenses Section */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <MinusIcon className="w-5 h-5 mr-2 text-red-600" />
                    Expenses
                  </h3>
                  <div className="space-y-3">
                    {reportData.profitLoss.expenseDetails.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-700 dark:text-gray-300">{item.category}</span>
                        <span className="font-semibold text-red-600">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 dark:border-gray-600 font-bold">
                      <span className="text-gray-900 dark:text-gray-100">Total Expenses</span>
                      <span className="text-red-600 text-lg">{formatCurrency(reportData.profitLoss.totalExpenses)}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Net Profit Summary */}
              <Card className="p-6 mt-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Net Profit Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.profitLoss.totalIncome)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(reportData.profitLoss.totalExpenses)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Net Profit</p>
                      <p className={`text-3xl font-bold ${reportData.profitLoss.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(reportData.profitLoss.netProfit)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Balance Sheet Report */}
          <TabPanel id="balanceSheet" label="Balance Sheet">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Balance Sheet
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    As of: {formatDate(reportData.balanceSheet.reportDate)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assets Section */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <BuildingOfficeIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Assets
                  </h3>
                  
                  {/* Current Assets */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Current Assets</h4>
                    <div className="space-y-2">
                      {reportData.balanceSheet.assets.current.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">{item.item}</span>
                          <span className="font-semibold">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2 font-semibold border-t border-gray-200 dark:border-gray-600">
                        <span>Total Current Assets</span>
                        <span>{formatCurrency(reportData.balanceSheet.assets.current.reduce((sum, item) => sum + item.amount, 0))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Non-Current Assets */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Non-Current Assets</h4>
                    <div className="space-y-2">
                      {reportData.balanceSheet.assets.nonCurrent.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">{item.item}</span>
                          <span className="font-semibold">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2 font-semibold border-t border-gray-200 dark:border-gray-600">
                        <span>Total Non-Current Assets</span>
                        <span>{formatCurrency(reportData.balanceSheet.assets.nonCurrent.reduce((sum, item) => sum + item.amount, 0))}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Liabilities & Equity Section */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <ReceiptRefundIcon className="w-5 h-5 mr-2 text-red-600" />
                    Liabilities & Equity
                  </h3>
                  
                  {/* Current Liabilities */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Current Liabilities</h4>
                    <div className="space-y-2">
                      {reportData.balanceSheet.liabilities.current.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">{item.item}</span>
                          <span className="font-semibold text-red-600">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2 font-semibold border-t border-gray-200 dark:border-gray-600">
                        <span>Total Current Liabilities</span>
                        <span className="text-red-600">{formatCurrency(reportData.balanceSheet.liabilities.current.reduce((sum, item) => sum + item.amount, 0))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Non-Current Liabilities */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Non-Current Liabilities</h4>
                    <div className="space-y-2">
                      {reportData.balanceSheet.liabilities.nonCurrent.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">{item.item}</span>
                          <span className="font-semibold text-red-600">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2 font-semibold border-t border-gray-200 dark:border-gray-600">
                        <span>Total Non-Current Liabilities</span>
                        <span className="text-red-600">{formatCurrency(reportData.balanceSheet.liabilities.nonCurrent.reduce((sum, item) => sum + item.amount, 0))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Equity */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Equity</h4>
                    <div className="space-y-2">
                      {reportData.balanceSheet.equity.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">{item.item}</span>
                          <span className="font-semibold text-green-600">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2 font-semibold border-t border-gray-200 dark:border-gray-600">
                        <span>Total Equity</span>
                        <span className="text-green-600">{formatCurrency(reportData.balanceSheet.equity.reduce((sum, item) => sum + item.amount, 0))}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Balance Verification */}
              <Card className="p-6 mt-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Balance Verification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Assets</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency([...reportData.balanceSheet.assets.current, ...reportData.balanceSheet.assets.nonCurrent].reduce((sum, item) => sum + item.amount, 0))}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Liabilities</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency([...reportData.balanceSheet.liabilities.current, ...reportData.balanceSheet.liabilities.nonCurrent].reduce((sum, item) => sum + item.amount, 0))}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Equity</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(reportData.balanceSheet.equity.reduce((sum, item) => sum + item.amount, 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Cash Flow Statement */}
          <TabPanel id="cashFlow" label="Cash Flow">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Cash Flow Statement
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    For the period: {reportData.cashFlow.reportPeriod}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Operating Activities */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <CurrencyDollarIcon className="w-5 h-5 mr-2 text-green-600" />
                    Operating Activities
                  </h3>
                  <div className="space-y-3">
                    {reportData.cashFlow.operating.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-700 dark:text-gray-300">{item.activity}</span>
                        <span className={`font-semibold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 dark:border-gray-600 font-bold">
                      <span className="text-gray-900 dark:text-gray-100">Net Cash from Operating Activities</span>
                      <span className="text-green-600 text-lg">
                        {formatCurrency(reportData.cashFlow.operating.reduce((sum, item) => sum + item.amount, 0))}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Investing Activities */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <ChartBarIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Investing Activities
                  </h3>
                  <div className="space-y-3">
                    {reportData.cashFlow.investing.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-700 dark:text-gray-300">{item.activity}</span>
                        <span className={`font-semibold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 dark:border-gray-600 font-bold">
                      <span className="text-gray-900 dark:text-gray-100">Net Cash from Investing Activities</span>
                      <span className="text-red-600 text-lg">
                        {formatCurrency(reportData.cashFlow.investing.reduce((sum, item) => sum + item.amount, 0))}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Financing Activities */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <BanknotesIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Financing Activities
                  </h3>
                  <div className="space-y-3">
                    {reportData.cashFlow.financing.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-700 dark:text-gray-300">{item.activity}</span>
                        <span className={`font-semibold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 dark:border-gray-600 font-bold">
                      <span className="text-gray-900 dark:text-gray-100">Net Cash from Financing Activities</span>
                      <span className="text-red-600 text-lg">
                        {formatCurrency(reportData.cashFlow.financing.reduce((sum, item) => sum + item.amount, 0))}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Net Change in Cash */}
                <Card className="p-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Net Change in Cash</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Operating</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(reportData.cashFlow.operating.reduce((sum, item) => sum + item.amount, 0))}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Investing</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatCurrency(reportData.cashFlow.investing.reduce((sum, item) => sum + item.amount, 0))}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Financing</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatCurrency(reportData.cashFlow.financing.reduce((sum, item) => sum + item.amount, 0))}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Net Change</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency([...reportData.cashFlow.operating, ...reportData.cashFlow.investing, ...reportData.cashFlow.financing].reduce((sum, item) => sum + item.amount, 0))}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </TabPanel>

          {/* Sales Report */}
          <TabPanel id="sales" label="Sales Report">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Sales Report
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    For the period: {reportData.sales.reportPeriod}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales by Product */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <ShoppingCartIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Sales by Product
                  </h3>
                  <div className="space-y-3">
                    {reportData.sales.salesByProduct.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">{item.product}</span>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(item.amount)}</div>
                            <div className="text-sm text-gray-500">{formatPercentage(item.percentage)}</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 dark:border-gray-600 font-bold">
                      <span className="text-gray-900 dark:text-gray-100">Total Sales</span>
                      <span className="text-blue-600 text-lg">{formatCurrency(reportData.sales.totalSales)}</span>
                    </div>
                  </div>
                </Card>

                {/* Sales by Customer */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <UsersIcon className="w-5 h-5 mr-2 text-green-600" />
                    Sales by Customer
                  </h3>
                  <div className="space-y-3">
                    {reportData.sales.salesByCustomer.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">{item.customer}</span>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(item.amount)}</div>
                            <div className="text-sm text-gray-500">{formatPercentage(item.percentage)}</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sales Summary */}
              <Card className="p-6 mt-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Sales Performance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Sales</p>
                      <p className="text-3xl font-bold text-green-600">{formatCurrency(reportData.sales.totalSales)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Top Product</p>
                      <p className="text-xl font-bold text-blue-600">{reportData.sales.salesByProduct[0].product}</p>
                      <p className="text-sm text-gray-500">{formatPercentage(reportData.sales.salesByProduct[0].percentage)} of total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Top Customer</p>
                      <p className="text-xl font-bold text-purple-600">{reportData.sales.salesByCustomer[0].customer}</p>
                      <p className="text-sm text-gray-500">{formatPercentage(reportData.sales.salesByCustomer[0].percentage)} of total</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Purchase Report */}
          <TabPanel id="purchases" label="Purchase Report">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Purchase Report
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    For the period: {reportData.purchases.reportPeriod}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Purchases by Vendor */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <BuildingOfficeIcon className="w-5 h-5 mr-2 text-indigo-600" />
                    Purchases by Vendor
                  </h3>
                  <div className="space-y-3">
                    {reportData.purchases.purchasesByVendor.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">{item.vendor}</span>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(item.amount)}</div>
                            <div className="text-sm text-gray-500">{formatPercentage(item.percentage)}</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 dark:border-gray-600 font-bold">
                      <span className="text-gray-900 dark:text-gray-100">Total Purchases</span>
                      <span className="text-indigo-600 text-lg">{formatCurrency(reportData.purchases.totalPurchases)}</span>
                    </div>
                  </div>
                </Card>

                {/* Purchases by Category */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <ChartPieIcon className="w-5 h-5 mr-2 text-orange-600" />
                    Purchases by Category
                  </h3>
                  <div className="space-y-3">
                    {reportData.purchases.purchasesByCategory.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">{item.category}</span>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(item.amount)}</div>
                            <div className="text-sm text-gray-500">{formatPercentage(item.percentage)}</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Purchase Summary */}
              <Card className="p-6 mt-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Purchase Performance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Purchases</p>
                      <p className="text-3xl font-bold text-indigo-600">{formatCurrency(reportData.purchases.totalPurchases)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Top Vendor</p>
                      <p className="text-xl font-bold text-orange-600">{reportData.purchases.purchasesByVendor[0].vendor}</p>
                      <p className="text-sm text-gray-500">{formatPercentage(reportData.purchases.purchasesByVendor[0].percentage)} of total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Top Category</p>
                      <p className="text-xl font-bold text-purple-600">{reportData.purchases.purchasesByCategory[0].category}</p>
                      <p className="text-sm text-gray-500">{formatPercentage(reportData.purchases.purchasesByCategory[0].percentage)} of total</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Tax Summary Report */}
          <TabPanel id="taxSummary" label="Tax Summary">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Tax Summary Report
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    For the period: {reportData.taxSummary.reportPeriod}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Tax Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatsCard
                  title="Total Tax Collected"
                  value={formatCurrency(reportData.taxSummary.totalTaxCollected)}
                  icon={PlusIcon}
                  color="green"
                  subtitle="Taxes collected from customers"
                />
                <StatsCard
                  title="Total Tax Paid"
                  value={formatCurrency(reportData.taxSummary.totalTaxPaid)}
                  icon={MinusIcon}
                  color="red"
                  subtitle="Taxes paid to authorities"
                />
                <StatsCard
                  title="Net Tax Liability"
                  value={formatCurrency(reportData.taxSummary.netTaxLiability)}
                  icon={ReceiptRefundIcon}
                  color={reportData.taxSummary.netTaxLiability >= 0 ? 'yellow' : 'blue'}
                  subtitle={reportData.taxSummary.netTaxLiability >= 0 ? 'Amount owed' : 'Amount refundable'}
                />
              </div>

              {/* Tax Details Table */}
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Tax Breakdown by Type</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tax Type</TableHead>
                        <TableHead>Tax Collected</TableHead>
                        <TableHead>Tax Paid</TableHead>
                        <TableHead>Net Position</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.taxSummary.taxDetails.map((tax, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{tax.taxType}</TableCell>
                          <TableCell className="text-green-600">{formatCurrency(tax.collected)}</TableCell>
                          <TableCell className="text-red-600">{formatCurrency(tax.paid)}</TableCell>
                          <TableCell className={`font-medium ${tax.net >= 0 ? 'text-yellow-600' : 'text-blue-600'}`}>
                            {formatCurrency(Math.abs(tax.net))}
                          </TableCell>
                          <TableCell>
                            {tax.net > 0 && <Badge variant="warning">Owed</Badge>}
                            {tax.net < 0 && <Badge variant="info">Refundable</Badge>}
                            {tax.net === 0 && <Badge variant="success">Balanced</Badge>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Tax Compliance Status */}
              <Card className="p-6 mt-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Tax Compliance Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <ReceiptRefundIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-lg font-semibold text-green-800 dark:text-green-400">Compliant</p>
                      <p className="text-sm text-green-600 dark:text-green-500">All tax filings up to date</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-lg font-semibold text-blue-800 dark:text-blue-400">Next Filing Due</p>
                      <p className="text-sm text-blue-600 dark:text-blue-500">October 15, 2024</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Payroll Summary Report */}
          <TabPanel id="payrollSummary" label="Payroll Summary">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Payroll Summary Report
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    For the period: {reportData.payrollSummary.reportPeriod}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Payroll Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatsCard
                  title="Total Gross Pay"
                  value={formatCurrency(reportData.payrollSummary.totalGrossPay)}
                  icon={CurrencyDollarIcon}
                  color="green"
                  subtitle="Before deductions"
                />
                <StatsCard
                  title="Total Deductions"
                  value={formatCurrency(reportData.payrollSummary.totalDeductions)}
                  icon={MinusIcon}
                  color="red"
                  subtitle="Taxes, benefits, etc."
                />
                <StatsCard
                  title="Net Pay Total"
                  value={formatCurrency(reportData.payrollSummary.netPayTotal)}
                  icon={UsersIcon}
                  color="blue"
                  subtitle="Take-home pay"
                />
              </div>

              {/* Payroll by Department */}
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Payroll Breakdown by Department</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead>Gross Pay</TableHead>
                        <TableHead>Deductions</TableHead>
                        <TableHead>Net Pay</TableHead>
                        <TableHead>Deduction Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.payrollSummary.payrollBreakdown.map((dept, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{dept.department}</TableCell>
                          <TableCell className="text-green-600">{formatCurrency(dept.grossPay)}</TableCell>
                          <TableCell className="text-red-600">{formatCurrency(dept.deductions)}</TableCell>
                          <TableCell className="font-medium text-blue-600">{formatCurrency(dept.netPay)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="text-sm mr-2">{formatPercentage((dept.deductions / dept.grossPay) * 100)}</span>
                              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-orange-600 h-2 rounded-full"
                                  style={{ width: `${(dept.deductions / dept.grossPay) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Payroll Analysis */}
              <Card className="p-6 mt-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Payroll Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Average Gross Pay</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(reportData.payrollSummary.totalGrossPay / reportData.payrollSummary.payrollBreakdown.length)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Average Deductions</p>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(reportData.payrollSummary.totalDeductions / reportData.payrollSummary.payrollBreakdown.length)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Average Net Pay</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(reportData.payrollSummary.netPayTotal / reportData.payrollSummary.payrollBreakdown.length)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Overall Deduction Rate</p>
                      <p className="text-xl font-bold text-orange-600">
                        {formatPercentage((reportData.payrollSummary.totalDeductions / reportData.payrollSummary.totalGrossPay) * 100)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Expense Breakdown Report */}
          <TabPanel id="expenseBreakdown" label="Expense Breakdown">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Expense Breakdown Report
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    For the period: {reportData.expenseBreakdown.reportPeriod}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Total Expenses Overview */}
              <Card className="p-6 mb-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Total Expenses</h3>
                  <p className="text-4xl font-bold text-red-600">{formatCurrency(reportData.expenseBreakdown.totalExpenses)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Across all categories</p>
                </div>
              </Card>

              {/* Expense Categories */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Expense Categories Breakdown</h3>
                <div className="space-y-4">
                  {reportData.expenseBreakdown.expenseCategories.map((category, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${
                            index === 0 ? 'bg-red-500' :
                            index === 1 ? 'bg-blue-500' :
                            index === 2 ? 'bg-green-500' :
                            index === 3 ? 'bg-yellow-500' :
                            index === 4 ? 'bg-purple-500' :
                            index === 5 ? 'bg-pink-500' :
                            index === 6 ? 'bg-indigo-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatCurrency(category.amount)}</div>
                          <div className="text-sm text-gray-500">{formatPercentage(category.percentage)}</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            index === 0 ? 'bg-red-500' :
                            index === 1 ? 'bg-blue-500' :
                            index === 2 ? 'bg-green-500' :
                            index === 3 ? 'bg-yellow-500' :
                            index === 4 ? 'bg-purple-500' :
                            index === 5 ? 'bg-pink-500' :
                            index === 6 ? 'bg-indigo-500' : 'bg-gray-500'
                          }`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Expense Analysis */}
              <Card className="p-6 mt-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Expense Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Largest Expense Category</p>
                      <p className="text-xl font-bold text-red-600">{reportData.expenseBreakdown.expenseCategories[0].category}</p>
                      <p className="text-sm text-gray-500">{formatPercentage(reportData.expenseBreakdown.expenseCategories[0].percentage)} of total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Average Category Expense</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(reportData.expenseBreakdown.totalExpenses / reportData.expenseBreakdown.expenseCategories.length)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expense vs Revenue</p>
                      <p className="text-xl font-bold text-purple-600">
                        {formatPercentage((reportData.expenseBreakdown.totalExpenses / summaryStats.totalRevenue) * 100)}
                      </p>
                      <p className="text-sm text-gray-500">of total revenue</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabPanel>
        </Tabs>
      </main>
    </div>
  );
};

export default ReportsManagement;