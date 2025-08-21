'use client';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// ========== BADGE COMPONENT ==========
export const Badge = ({ children, variant = 'default', size = 'md' }) => {
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

// ========== BUTTON COMPONENT ==========
export const Button = ({ 
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
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 dark:hover:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 disabled:bg-green-300',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500 disabled:bg-yellow-300'
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

// ========== CARD COMPONENT ==========
export const Card = ({ children, className = '', hover = false, ...props }) => {
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

// ========== INPUT COMPONENT ==========
export const Input = ({ 
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

// ========== SELECT COMPONENT ==========
export const Select = ({ 
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

// ========== MODAL COMPONENT ==========
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
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

// ========== SEARCH BAR COMPONENT ==========
export const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
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

// ========== STATS CARD COMPONENT ==========
export const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue', subtitle }) => {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    pink: 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 h-full"
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 break-words">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <ArrowTrendingUpIcon className="w-4 h-4 mr-1 flex-shrink-0" /> : <ArrowTrendingDownIcon className="w-4 h-4 mr-1 flex-shrink-0" />}
              <span className="truncate">{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ========== ALERT COMPONENT ==========
export const Alert = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-800 dark:text-blue-200'
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: CheckCircleIcon,
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-800 dark:text-green-200'
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      textColor: 'text-yellow-800 dark:text-yellow-200'
    },
    danger: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-red-600 dark:text-red-400',
      textColor: 'text-red-800 dark:text-red-200'
    }
  };

  const config = variants[variant];
  const IconComponent = config.icon;

  return (
    <div className={`border rounded-lg p-4 ${config.bg} ${config.border} ${className}`}>
      <div className="flex">
        <IconComponent className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />
        <div className={`ml-3 text-sm ${config.textColor}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ========== TABLE COMPONENTS ==========
export const Table = ({ children, className = '' }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-50 dark:bg-gray-700/50">
    {children}
  </thead>
);

export const TableBody = ({ children }) => (
  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
    {children}
  </tbody>
);

export const TableRow = ({ children, hover = true, ...props }) => (
  <motion.tr
    whileHover={hover ? { backgroundColor: 'rgba(59, 130, 246, 0.05)' } : {}}
    className="transition-colors duration-200"
    {...props}
  >
    {children}
  </motion.tr>
);

export const TableHead = ({ children, className = '' }) => (
  <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${className}`}>
    {children}
  </td>
);

// ========== TABS COMPONENTS ==========
export const Tabs = ({ defaultTab, children, onChange }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab);
 
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

export const TabPanel = ({ id, label, children }) => {
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