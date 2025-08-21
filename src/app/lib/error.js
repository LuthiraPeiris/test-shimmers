
// 'use client';
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   UsersIcon,
//   CurrencyDollarIcon,
//   DocumentTextIcon,
//   CogIcon,
//   ClipboardDocumentListIcon,
//   PlusIcon,
//   PencilIcon,
//   TrashIcon,
//   EyeIcon,
//   ArrowDownTrayIcon,
//   XMarkIcon,
//   MagnifyingGlassIcon
// } from '@heroicons/react/24/outline';

// // ========== UI COMPONENTS ==========

// const Badge = ({ children, variant = 'default', size = 'md' }) => {
//   const variants = {
//     default: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
//     success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
//     warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
//     danger: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
//     info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
//   };
 
//   const sizes = {
//     sm: 'px-2 py-0.5 text-xs',
//     md: 'px-2 py-1 text-xs',
//     lg: 'px-3 py-1 text-sm'
//   };
 
//   return (
//     <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
//       {children}
//     </span>
//   );
// };

// const Button = ({ 
//   children, 
//   variant = 'primary', 
//   size = 'md', 
//   disabled = false, 
//   loading = false, 
//   className = '', 
//   type = 'button',
//   onClick,
//   ...props 
// }) => {
//   const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
 
//   const variants = {
//     primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-300',
//     secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 disabled:bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-gray-100',
//     danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-300',
//     ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 dark:hover:bg-gray-700 dark:text-gray-300'
//   };
 
//   const sizes = {
//     sm: 'px-3 py-1.5 text-sm',
//     md: 'px-4 py-2 text-sm',
//     lg: 'px-6 py-3 text-base'
//   };
 
//   return (
//     <motion.button
//       whileHover={{ scale: disabled ? 1 : 1.02 }}
//       whileTap={{ scale: disabled ? 1 : 0.98 }}
//       className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
//       disabled={disabled || loading}
//       type={type}
//       onClick={onClick}
//       {...props}
//     >
//       {loading && (
//         <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
//           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//         </svg>
//       )}
//       {children}
//     </motion.button>
//   );
// };

// const Card = ({ children, className = '', hover = false, ...props }) => {
//   return (
//     <motion.div
//       whileHover={hover ? { y: -2, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' } : {}}
//       className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${hover ? 'transition-all duration-300' : ''} ${className}`}
//       {...props}
//     >
//       {children}
//     </motion.div>
//   );
// };

// const Input = ({ 
//   label, 
//   error, 
//   type = 'text', 
//   className = '', 
//   required = false, 
//   value,
//   onChange,
//   placeholder,
//   ...props 
// }) => {
//   return (
//     <div className="space-y-1">
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}
//       <input
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className={`w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${className}`}
//         {...props}
//       />
//       {error && <p className="text-sm text-red-600">{error}</p>}
//     </div>
//   );
// };

// const Select = ({ 
//   label, 
//   error, 
//   options = [], 
//   placeholder = 'Select an option', 
//   className = '', 
//   required = false,
//   value,
//   onChange,
//   ...props 
// }) => {
//   return (
//     <div className="space-y-1">
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}
//       <select
//         value={value}
//         onChange={onChange}
//         className={`w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${className}`}
//         {...props}
//       >
//         <option value="">{placeholder}</option>
//         {options.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//       {error && <p className="text-sm text-red-600">{error}</p>}
//     </div>
//   );
// };

// const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }
   
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [isOpen]);

//   const sizes = {
//     sm: 'max-w-md',
//     md: 'max-w-lg',
//     lg: 'max-w-2xl',
//     xl: 'max-w-4xl'
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50"
//             onClick={onClose}
//           />
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden`}
//           >
//             <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                 {title}
//               </h3>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//               >
//                 <XMarkIcon className="w-6 h-6" />
//               </button>
//             </div>
//             <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
//               {children}
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };

// const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
//   return (
//     <div className={`relative ${className}`}>
//       <input
//         type="text"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
//       />
//       <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//     </div>
//   );
// };

// const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
//   const colors = {
//     blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
//     green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
//     yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
//     red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
//     purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
//   };

//   return (
//     <motion.div
//       whileHover={{ y: -2, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
//       className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300"
//     >
//       <div className="flex items-center">
//         <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
//           <Icon className="w-6 h-6" />
//         </div>
//         <div className="ml-4 flex-1">
//           <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
//           <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
//           {trend && (
//             <p className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
//               {trend === 'up' ? '↑' : '↓'} {trendValue}
//             </p>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const Table = ({ children, className = '' }) => {
//   return (
//     <div className="overflow-x-auto">
//       <table className={`w-full ${className}`}>
//         {children}
//       </table>
//     </div>
//   );
// };

// const TableHeader = ({ children }) => (
//   <thead className="bg-gray-50 dark:bg-gray-700/50">
//     {children}
//   </thead>
// );

// const TableBody = ({ children }) => (
//   <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//     {children}
//   </tbody>
// );

// const TableRow = ({ children, hover = true, ...props }) => (
//   <motion.tr
//     whileHover={hover ? { backgroundColor: 'rgba(59, 130, 246, 0.05)' } : {}}
//     className="transition-colors duration-200"
//     {...props}
//   >
//     {children}
//   </motion.tr>
// );

// const TableHead = ({ children, className = '' }) => (
//   <th className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}>
//     {children}
//   </th>
// );

// const TableCell = ({ children, className = '' }) => (
//   <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${className}`}>
//     {children}
//   </td>
// );

// const Tabs = ({ defaultTab, children, onChange }) => {
//   const [activeTab, setActiveTab] = useState(defaultTab);
 
//   const handleTabChange = (tabId) => {
//     setActiveTab(tabId);
//     onChange?.(tabId);
//   };
 
//   return (
//     <div>
//       <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
//         {children.map((child) => (
//           <button
//             key={child.props.id}
//             onClick={() => handleTabChange(child.props.id)}
//             className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
//               activeTab === child.props.id
//                 ? 'border-blue-500 text-blue-600 dark:text-blue-400'
//                 : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
//             }`}
//           >
//             {child.props.label}
//           </button>
//         ))}
//       </nav>
//       <div className="mt-6">
//         {children.find(child => child.props.id === activeTab)}
//       </div>
//     </div>
//   );
// };

// const TabPanel = ({ id, label, children }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       {children}
//     </motion.div>
//   );
// };

// // ========== FORM COMPONENTS ==========

// const EmployeeForm = ({ isOpen, onClose, onSubmit, employee = null, departments = [] }) => {
//   const [formData, setFormData] = useState({
//     employee_id: employee?.employee_id || '',
//     first_name: employee?.first_name || '',
//     last_name: employee?.last_name || '',
//     email: employee?.email || '',
//     phone: employee?.phone || '',
//     address: employee?.address || '',
//     job_title: employee?.job_title || '',
//     department_id: employee?.department_id || '',
//     joining_date: employee?.joining_date || '',
//     salary_amount: employee?.salary_amount || '',
//     salary_type: employee?.salary_type || 'MONTHLY',
//     bank_account_number: employee?.bank_account_number || '',
//     bank_name: employee?.bank_name || '',
//     bank_branch: employee?.bank_branch || '',
//     tax_id: employee?.tax_id || '',
//     social_security_number: employee?.social_security_number || '',
//     emergency_contact_name: employee?.emergency_contact_name || '',
//     emergency_contact_phone: employee?.emergency_contact_phone || '',
//     status: employee?.status || 'ACTIVE'
//   });

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (employee) {
//       setFormData({
//         employee_id: employee.employee_id || '',
//         first_name: employee.first_name || '',
//         last_name: employee.last_name || '',
//         email: employee.email || '',
//         phone: employee.phone || '',
//         address: employee.address || '',
//         job_title: employee.job_title || '',
//         department_id: employee.department_id || '',
//         joining_date: employee.joining_date || '',
//         salary_amount: employee.salary_amount || '',
//         salary_type: employee.salary_type || 'MONTHLY',
//         bank_account_number: employee.bank_account_number || '',
//         bank_name: employee.bank_name || '',
//         bank_branch: employee.bank_branch || '',
//         tax_id: employee.tax_id || '',
//         social_security_number: employee.social_security_number || '',
//         emergency_contact_name: employee.emergency_contact_name || '',
//         emergency_contact_phone: employee.emergency_contact_phone || '',
//         status: employee.status || 'ACTIVE'
//       });
//     }
//   }, [employee]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await onSubmit(formData);
//       onClose();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const departmentOptions = departments.map(dept => ({
//     value: dept.id,
//     label: dept.name
//   }));

//   const salaryTypeOptions = [
//     { value: 'HOURLY', label: 'Hourly' },
//     { value: 'MONTHLY', label: 'Monthly' },
//     { value: 'ANNUAL', label: 'Annual' }
//   ];

//   const statusOptions = [
//     { value: 'ACTIVE', label: 'Active' },
//     { value: 'INACTIVE', label: 'Inactive' },
//     { value: 'TERMINATED', label: 'Terminated' }
//   ];

//   return (
//     <Modal 
//       isOpen={isOpen} 
//       onClose={onClose} 
//       title={employee ? 'Edit Employee' : 'Add New Employee'}
//       size="xl"
//     >
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="md:col-span-2">
//             <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Basic Information</h4>
//           </div>
          
//           <Input
//             label="Employee ID"
//             value={formData.employee_id}
//             onChange={(e) => handleChange('employee_id', e.target.value)}
//             required
//             placeholder="EMP001"
//           />
          
//           <Select
//             label="Status"
//             value={formData.status}
//             onChange={(e) => handleChange('status', e.target.value)}
//             options={statusOptions}
//           />
          
//           <Input
//             label="First Name"
//             value={formData.first_name}
//             onChange={(e) => handleChange('first_name', e.target.value)}
//             required
//           />
          
//           <Input
//             label="Last Name"
//             value={formData.last_name}
//             onChange={(e) => handleChange('last_name', e.target.value)}
//             required
//           />
          
//           <Input
//             label="Email"
//             type="email"
//             value={formData.email}
//             onChange={(e) => handleChange('email', e.target.value)}
//             required
//           />
          
//           <Input
//             label="Phone"
//             value={formData.phone}
//             onChange={(e) => handleChange('phone', e.target.value)}
//           />
          
//           <div className="md:col-span-2">
//             <Input
//               label="Address"
//               value={formData.address}
//               onChange={(e) => handleChange('address', e.target.value)}
//             />
//           </div>

//           <div className="md:col-span-2 mt-6">
//             <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Job Information</h4>
//           </div>
          
//           <Input
//             label="Job Title"
//             value={formData.job_title}
//             onChange={(e) => handleChange('job_title', e.target.value)}
//             required
//           />
          
//           <Select
//             label="Department"
//             value={formData.department_id}
//             onChange={(e) => handleChange('department_id', e.target.value)}
//             options={departmentOptions}
//             required
//           />
          
//           <Input
//             label="Joining Date"
//             type="date"
//             value={formData.joining_date}
//             onChange={(e) => handleChange('joining_date', e.target.value)}
//             required
//           />

//           <div className="md:col-span-2 mt-6">
//             <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Salary Information</h4>
//           </div>
          
//           <Input
//             label="Salary Amount"
//             type="number"
//             step="0.01"
//             value={formData.salary_amount}
//             onChange={(e) => handleChange('salary_amount', e.target.value)}
//             required
//           />
          
//           <Select
//             label="Salary Type"
//             value={formData.salary_type}
//             onChange={(e) => handleChange('salary_type', e.target.value)}
//             options={salaryTypeOptions}
//           />

//           <div className="md:col-span-2 mt-6">
//             <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Bank Information</h4>
//           </div>
          
//           <Input
//             label="Bank Account Number"
//             value={formData.bank_account_number}
//             onChange={(e) => handleChange('bank_account_number', e.target.value)}
//           />
          
//           <Input
//             label="Bank Name"
//             value={formData.bank_name}
//             onChange={(e) => handleChange('bank_name', e.target.value)}
//           />
          
//           <Input
//             label="Bank Branch"
//             value={formData.bank_branch}
//             onChange={(e) => handleChange('bank_branch', e.target.value)}
//           />

//           <div className="md:col-span-2 mt-6">
//             <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Tax & Legal Information</h4>
//           </div>
          
//           <Input
//             label="Tax ID"
//             value={formData.tax_id}
//             onChange={(e) => handleChange('tax_id', e.target.value)}
//           />
          
//           <Input
//             label="Social Security Number"
//             value={formData.social_security_number}
//             onChange={(e) => handleChange('social_security_number', e.target.value)}
//           />

//           <div className="md:col-span-2 mt-6">
//             <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Emergency Contact</h4>
//           </div>
          
//           <Input
//             label="Emergency Contact Name"
//             value={formData.emergency_contact_name}
//             onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
//           />
          
//           <Input
//             label="Emergency Contact Phone"
//             value={formData.emergency_contact_phone}
//             onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
//           />
//         </div>

//         <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
//           <Button type="button" variant="secondary" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button type="submit" loading={loading}>
//             {employee ? 'Update Employee' : 'Add Employee'}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// const PayrollRunForm = ({ isOpen, onClose, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     pay_period_start: '',
//     pay_period_end: '',
//     payment_date: '',
//     notes: ''
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await onSubmit(formData);
//       setFormData({
//         pay_period_start: '',
//         pay_period_end: '',
//         payment_date: '',
//         notes: ''
//       });
//       onClose();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Create New Payroll Run"
//       size="md"
//     >
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           label="Pay Period Start"
//           type="date"
//           value={formData.pay_period_start}
//           onChange={(e) => handleChange('pay_period_start', e.target.value)}
//           required
//         />
       
//         <Input
//           label="Pay Period End"
//           type="date"
//           value={formData.pay_period_end}
//           onChange={(e) => handleChange('pay_period_end', e.target.value)}
//           required
//         />
       
//         <Input
//           label="Payment Date"
//           type="date"
//           value={formData.payment_date}
//           onChange={(e) => handleChange('payment_date', e.target.value)}
//           required
//         />
       
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Notes
//           </label>
//           <textarea
//             value={formData.notes}
//             onChange={(e) => handleChange('notes', e.target.value)}
//             rows={3}
//             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//             placeholder="Optional notes for this payroll run..."
//           />
//         </div>
//         <div className="flex justify-end space-x-3 pt-4">
//           <Button type="button" variant="secondary" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button type="submit" loading={loading}>
//             Create Payroll Run
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// const TaxSettingForm = ({ isOpen, onClose, onSubmit, taxSetting = null }) => {
//   const [formData, setFormData] = useState({
//     tax_id: taxSetting?.tax_id || '',
//     tax_name: taxSetting?.tax_name || '',
//     tax_type: taxSetting?.tax_type || '',
//     tax_rate: taxSetting?.tax_rate || '',
//     is_percentage: taxSetting?.is_percentage ?? true,
//     flat_amount: taxSetting?.flat_amount || '',
//     min_salary: taxSetting?.min_salary || '',
//     max_salary: taxSetting?.max_salary || '',
//     effective_date: taxSetting?.effective_date || '',
//     end_date: taxSetting?.end_date || '',
//     status: taxSetting?.status || 'ACTIVE',
//     description: taxSetting?.description || ''
//   });

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (taxSetting) {
//       setFormData({
//         tax_id: taxSetting.tax_id || '',
//         tax_name: taxSetting.tax_name || '',
//         tax_type: taxSetting.tax_type || '',
//         tax_rate: taxSetting.tax_rate || '',
//         is_percentage: taxSetting.is_percentage ?? true,
//         flat_amount: taxSetting.flat_amount || '',
//         min_salary: taxSetting.min_salary || '',
//         max_salary: taxSetting.max_salary || '',
//         effective_date: taxSetting.effective_date || '',
//         end_date: taxSetting.end_date || '',
//         status: taxSetting.status || 'ACTIVE',
//         description: taxSetting.description || ''
//       });
//     }
//   }, [taxSetting]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await onSubmit(formData);
//       onClose();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const taxTypeOptions = [
//     { value: 'INCOME_TAX', label: 'Income Tax' },
//     { value: 'SOCIAL_SECURITY', label: 'Social Security' },
//     { value: 'MEDICARE', label: 'Medicare' },
//     { value: 'STATE_TAX', label: 'State Tax' },
//     { value: 'EPF', label: 'Employee Provident Fund' },
//     { value: 'ETF', label: 'Employee Trust Fund' }
//   ];

//   const statusOptions = [
//     { value: 'ACTIVE', label: 'Active' },
//     { value: 'INACTIVE', label: 'Inactive' }
//   ];

//   return (
//     <Modal 
//       isOpen={isOpen} 
//       onClose={onClose} 
//       title={taxSetting ? 'Edit Tax Setting' : 'Add New Tax Setting'}
//       size="lg"
//     >
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="Tax ID"
//             value={formData.tax_id}
//             onChange={(e) => handleChange('tax_id', e.target.value)}
//             required
//             placeholder="TAX001"
//           />
          
//           <Select
//             label="Status"
//             value={formData.status}
//             onChange={(e) => handleChange('status', e.target.value)}
//             options={statusOptions}
//           />
          
//           <div className="md:col-span-2">
//             <Input
//               label="Tax Name"
//               value={formData.tax_name}
//               onChange={(e) => handleChange('tax_name', e.target.value)}
//               required
//               placeholder="Federal Income Tax"
//             />
//           </div>
          
//           <Select
//             label="Tax Type"
//             value={formData.tax_type}
//             onChange={(e) => handleChange('tax_type', e.target.value)}
//             options={taxTypeOptions}
//             required
//           />
          
//           <div className="flex items-center space-x-4">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={formData.is_percentage}
//                 onChange={(e) => handleChange('is_percentage', e.target.checked)}
//                 className="mr-2"
//               />
//               <span className="text-sm text-gray-700 dark:text-gray-300">Percentage Rate</span>
//             </label>
//           </div>
          
//           {formData.is_percentage ? (
//             <Input
//               label="Tax Rate (%)"
//               type="number"
//               step="0.0001"
//               min="0"
//               max="100"
//               value={formData.tax_rate ? formData.tax_rate * 100 : ''}
//               onChange={(e) => handleChange('tax_rate', e.target.value / 100)}
//               required
//               placeholder="15.00"
//             />
//           ) : (
//             <Input
//               label="Flat Amount"
//               type="number"
//               step="0.01"
//               min="0"
//               value={formData.flat_amount}
//               onChange={(e) => handleChange('flat_amount', e.target.value)}
//               required
//             />
//           )}
          
//           <Input
//             label="Minimum Salary"
//             type="number"
//             step="0.01"
//             min="0"
//             value={formData.min_salary}
//             onChange={(e) => handleChange('min_salary', e.target.value)}
//             placeholder="0.00"
//           />
          
//           <Input
//             label="Maximum Salary"
//             type="number"
//             step="0.01"
//             min="0"
//             value={formData.max_salary}
//             onChange={(e) => handleChange('max_salary', e.target.value)}
//             placeholder="Leave empty for no limit"
//           />
          
//           <Input
//             label="Effective Date"
//             type="date"
//             value={formData.effective_date}
//             onChange={(e) => handleChange('effective_date', e.target.value)}
//             required
//           />
          
//           <Input
//             label="End Date"
//             type="date"
//             value={formData.end_date}
//             onChange={(e) => handleChange('end_date', e.target.value)}
//             placeholder="Leave empty for indefinite"
//           />
          
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Description
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => handleChange('description', e.target.value)}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//               placeholder="Description of this tax setting..."
//             />
//           </div>
//         </div>

//         <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
//           <Button type="button" variant="secondary" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button type="submit" loading={loading}>
//             {taxSetting ? 'Update Tax Setting' : 'Add Tax Setting'}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// const PaySlipPreview = ({ paySlip, employee, payrollRun }) => {
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount || 0);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   return (
//     <Card className="p-8 max-w-2xl mx-auto">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pay Slip</h2>
//         <p className="text-gray-600 dark:text-gray-400">
//           Pay Period: {formatDate(payrollRun?.pay_period_start)} - {formatDate(payrollRun?.pay_period_end)}
//         </p>
//       </div>

//       <div className="grid grid-cols-2 gap-8 mb-8">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Employee Information</h3>
//           <div className="space-y-2 text-sm">
//             <p><span className="font-medium">Employee ID:</span> {employee?.employee_id}</p>
//             <p><span className="font-medium">Name:</span> {employee?.first_name} {employee?.last_name}</p>
//             <p><span className="font-medium">Job Title:</span> {employee?.job_title}</p>
//             <p><span className="font-medium">Department:</span> {employee?.department}</p>
//           </div>
//         </div>
        
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Payment Information</h3>
//           <div className="space-y-2 text-sm">
//             <p><span className="font-medium">Pay Slip ID:</span> {paySlip?.pay_slip_id}</p>
//             <p><span className="font-medium">Payment Date:</span> {formatDate(payrollRun?.payment_date)}</p>
//             <p><span className="font-medium">Payment Method:</span> {paySlip?.payment_method || 'Bank Transfer'}</p>
//           </div>
//         </div>
//       </div>

//       <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
//         <div className="grid grid-cols-2 gap-8">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Earnings</h3>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span>Basic Salary:</span>
//                 <span>{formatCurrency(paySlip?.basic_salary)}</span>
//               </div>
//               {paySlip?.overtime_pay > 0 && (
//                 <div className="flex justify-between">
//                   <span>Overtime Pay:</span>
//                   <span>{formatCurrency(paySlip?.overtime_pay)}</span>
//                 </div>
//               )}
//               {paySlip?.allowances > 0 && (
//                 <div className="flex justify-between">
//                   <span>Allowances:</span>
//                   <span>{formatCurrency(paySlip?.allowances)}</span>
//                 </div>
//               )}
//               {paySlip?.bonuses > 0 && (
//                 <div className="flex justify-between">
//                   <span>Bonuses:</span>
//                   <span>{formatCurrency(paySlip?.bonuses)}</span>
//                 </div>
//               )}
//               <div className="border-t pt-2 font-medium flex justify-between">
//                 <span>Gross Pay:</span>
//                 <span>{formatCurrency(paySlip?.gross_pay)}</span>
//               </div>
//             </div>
//           </div>
          
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Deductions</h3>
//             <div className="space-y-2 text-sm">
//               {paySlip?.deductions?.map((deduction, index) => (
//                 <div key={index} className="flex justify-between">
//                   <span>{deduction.deduction_name}:</span>
//                   <span>{formatCurrency(deduction.amount)}</span>
//                 </div>
//               ))}
//               <div className="border-t pt-2 font-medium flex justify-between">
//                 <span>Total Deductions:</span>
//                 <span>{formatCurrency(paySlip?.total_deductions)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
//           <div className="flex justify-between items-center text-xl font-bold">
//             <span>Net Pay:</span>
//             <span className="text-green-600 dark:text-green-400">{formatCurrency(paySlip?.net_pay)}</span>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// // ========== MAIN COMPONENT ==========

// const PayrollManagement = () => {
//   // State management
//   const [activeTab, setActiveTab] = useState('employees');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [selectedPayrollRun, setSelectedPayrollRun] = useState(null);
//   const [selectedTaxSetting, setSelectedTaxSetting] = useState(null);
//   const [selectedPaySlip, setSelectedPaySlip] = useState(null);
  
//   // Modal states
//   const [showEmployeeForm, setShowEmployeeForm] = useState(false);
//   const [showPayrollRunForm, setShowPayrollRunForm] = useState(false);
//   const [showTaxSettingForm, setShowTaxSettingForm] = useState(false);
//   const [showPaySlipPreview, setShowPaySlipPreview] = useState(false);
  
//   // Data states
//   const [employees, setEmployees] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [payrollRuns, setPayrollRuns] = useState([]);
//   const [taxSettings, setTaxSettings] = useState([]);
//   const [paySlips, setPaySlips] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Mock data - In real app, this would come from API
//   const mockData = {
//     employees: [
//       {
//         id: 1,
//         employee_id: 'EMP001',
//         first_name: 'John',
//         last_name: 'Doe',
//         email: 'john.doe@company.com',
//         phone: '+1-555-0123',
//         job_title: 'Software Engineer',
//         department_id: 2,
//         department: 'Information Technology',
//         joining_date: '2024-01-15',
//         salary_amount: 75000.00,
//         salary_type: 'ANNUAL',
//         status: 'ACTIVE',
//         bank_account_number: '1234567890',
//         bank_name: 'Chase Bank',
//         tax_id: 'TAX001234'
//       },
//       {
//         id: 2,
//         employee_id: 'EMP002',
//         first_name: 'Jane',
//         last_name: 'Smith',
//         email: 'jane.smith@company.com',
//         phone: '+1-555-0124',
//         job_title: 'HR Manager',
//         department_id: 1,
//         department: 'Human Resources',
//         joining_date: '2023-08-20',
//         salary_amount: 6500.00,
//         salary_type: 'MONTHLY',
//         status: 'ACTIVE',
//         bank_account_number: '0987654321',
//         bank_name: 'Bank of America',
//         tax_id: 'TAX001235'
//       },
//       {
//         id: 3,
//         employee_id: 'EMP003',
//         first_name: 'Mike',
//         last_name: 'Johnson',
//         email: 'mike.johnson@company.com',
//         phone: '+1-555-0125',
//         job_title: 'Sales Representative',
//         department_id: 4,
//         department: 'Sales',
//         joining_date: '2024-03-10',
//         salary_amount: 4200.00,
//         salary_type: 'MONTHLY',
//         status: 'ACTIVE',
//         bank_account_number: '1122334455',
//         bank_name: 'Wells Fargo',
//         tax_id: 'TAX001236'
//       },
//       {
//         id: 4,
//         employee_id: 'EMP004',
//         first_name: 'Sarah',
//         last_name: 'Williams',
//         email: 'sarah.williams@company.com',
//         phone: '+1-555-0126',
//         job_title: 'Financial Analyst',
//         department_id: 3,
//         department: 'Finance',
//         joining_date: '2023-11-05',
//         salary_amount: 68000.00,
//         salary_type: 'ANNUAL',
//         status: 'ACTIVE',
//         bank_account_number: '5566778899',
//         bank_name: 'Citibank',
//         tax_id: 'TAX001237'
//       },
//       {
//         id: 5,
//         employee_id: 'EMP005',
//         first_name: 'David',
//         last_name: 'Brown',
//         email: 'david.brown@company.com',
//         phone: '+1-555-0127',
//         job_title: 'Marketing Specialist',
//         department_id: 4,
//         department: 'Sales',
//         joining_date: '2024-02-12',
//         salary_amount: 3800.00,
//         salary_type: 'MONTHLY',
//         status: 'ACTIVE',
//         bank_account_number: '9988776655',
//         bank_name: 'TD Bank',
//         tax_id: 'TAX001238'
//       }
//     ],
//     departments: [
//       { id: 1, name: 'Human Resources', code: 'HR' },
//       { id: 2, name: 'Information Technology', code: 'IT' },
//       { id: 3, name: 'Finance', code: 'FIN' },
//       { id: 4, name: 'Sales', code: 'SALES' },
//       { id: 5, name: 'Operations', code: 'OPS' }
//     ],
//     payrollRuns: [
//       {
//         id: 1,
//         payroll_run_id: 'PR2024001',
//         pay_period_start: '2024-06-01',
//         pay_period_end: '2024-06-30',
//         payment_date: '2024-07-05',
//         status: 'COMPLETED',
//         total_employees: 245,
//         total_gross_pay: 1250000.00,
//         total_deductions: 312500.00,
//         total_net_pay: 937500.00
//       },
//       {
//         id: 2,
//         payroll_run_id: 'PR2024002',
//         pay_period_start: '2024-07-01',
//         pay_period_end: '2024-07-31',
//         payment_date: '2024-08-05',
//         status: 'PROCESSING',
//         total_employees: 248,
//         total_gross_pay: 1275000.00,
//         total_deductions: 318750.00,
//         total_net_pay: 956250.00
//       },
//       {
//         id: 3,
//         payroll_run_id: 'PR2024003',
//         pay_period_start: '2024-08-01',
//         pay_period_end: '2024-08-31',
//         payment_date: '2024-09-05',
//         status: 'DRAFT',
//         total_employees: 250,
//         total_gross_pay: 0,
//         total_deductions: 0,
//         total_net_pay: 0
//       }
//     ],
//     taxSettings: [
//       {
//         id: 1,
//         tax_id: 'TAX001',
//         tax_name: 'Federal Income Tax',
//         tax_type: 'INCOME_TAX',
//         tax_rate: 0.22,
//         is_percentage: true,
//         effective_date: '2024-01-01',
//         status: 'ACTIVE'
//       },
//       {
//         id: 2,
//         tax_id: 'TAX002',
//         tax_name: 'Social Security',
//         tax_type: 'SOCIAL_SECURITY',
//         tax_rate: 0.062,
//         is_percentage: true,
//         effective_date: '2024-01-01',
//         status: 'ACTIVE'
//       },
//       {
//         id: 3,
//         tax_id: 'TAX003',
//         tax_name: 'Medicare',
//         tax_type: 'MEDICARE',
//         tax_rate: 0.0145,
//         is_percentage: true,
//         effective_date: '2024-01-01',
//         status: 'ACTIVE'
//       },
//       {
//         id: 4,
//         tax_id: 'TAX004',
//         tax_name: 'State Tax',
//         tax_type: 'STATE_TAX',
//         tax_rate: 0.05,
//         is_percentage: true,
//         effective_date: '2024-01-01',
//         status: 'ACTIVE'
//       }
//     ],
//     paySlips: [
//       {
//         id: 1,
//         pay_slip_id: 'PS2024001',
//         employee_id: 1,
//         payroll_run_id: 1,
//         basic_salary: 6250.00,
//         overtime_pay: 0,
//         allowances: 500.00,
//         bonuses: 0,
//         gross_pay: 6750.00,
//         total_deductions: 1687.50,
//         net_pay: 5062.50,
//         payment_status: 'PAID',
//         deductions: [
//           { deduction_name: 'Federal Income Tax', amount: 1485.00 },
//           { deduction_name: 'Social Security', amount: 418.50 },
//           { deduction_name: 'Medicare', amount: 97.88 },
//           { deduction_name: 'State Tax', amount: 337.50 }
//         ]
//       },
//       {
//         id: 2,
//         pay_slip_id: 'PS2024002',
//         employee_id: 2,
//         payroll_run_id: 1,
//         basic_salary: 6500.00,
//         overtime_pay: 200.00,
//         allowances: 300.00,
//         bonuses: 0,
//         gross_pay: 7000.00,
//         total_deductions: 1750.00,
//         net_pay: 5250.00,
//         payment_status: 'PAID',
//         deductions: [
//           { deduction_name: 'Federal Income Tax', amount: 1540.00 },
//           { deduction_name: 'Social Security', amount: 434.00 },
//           { deduction_name: 'Medicare', amount: 101.50 },
//           { deduction_name: 'State Tax', amount: 350.00 }
//         ]
//       }
//     ]
//   };

//   // Load data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         // Simulate API delay
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         // In real app, these would be API calls
//         setEmployees(mockData.employees);
//         setDepartments(mockData.departments);
//         setPayrollRuns(mockData.payrollRuns);
//         setTaxSettings(mockData.taxSettings);
//         setPaySlips(mockData.paySlips);
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Filter functions
//   const filteredEmployees = employees.filter(emp => 
//     emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     emp.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredPayrollRuns = payrollRuns.filter(run =>
//     run.payroll_run_id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredTaxSettings = taxSettings.filter(tax =>
//     tax.tax_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     tax.tax_id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredPaySlips = paySlips.filter(slip =>
//     slip.pay_slip_id.toLowerCase().includes(searchTerm.toLowerCase())
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
//       'TERMINATED': { variant: 'danger', label: 'Terminated' },
//       'COMPLETED': { variant: 'success', label: 'Completed' },
//       'PROCESSING': { variant: 'warning', label: 'Processing' },
//       'DRAFT': { variant: 'default', label: 'Draft' },
//       'PAID': { variant: 'success', label: 'Paid' },
//       'PENDING': { variant: 'warning', label: 'Pending' },
//       'FAILED': { variant: 'danger', label: 'Failed' }
//     };
    
//     const config = statusConfig[status] || { variant: 'default', label: status };
//     return <Badge variant={config.variant}>{config.label}</Badge>;
//   };

//   // CRUD operations
//   const handleAddEmployee = async (employeeData) => {
//     try {
//       // In real app, this would be an API call
//       const newEmployee = {
//         id: employees.length + 1,
//         ...employeeData,
//         department: departments.find(d => d.id == employeeData.department_id)?.name
//       };
//       setEmployees([...employees, newEmployee]);
//     } catch (error) {
//       console.error('Error adding employee:', error);
//     }
//   };

//   const handleEditEmployee = (employee) => {
//     setSelectedEmployee(employee);
//     setShowEmployeeForm(true);
//   };

//   const handleUpdateEmployee = async (employeeData) => {
//     try {
//       const updatedEmployees = employees.map(emp => 
//         emp.id === selectedEmployee.id 
//           ? { ...emp, ...employeeData, department: departments.find(d => d.id == employeeData.department_id)?.name }
//           : emp
//       );
//       setEmployees(updatedEmployees);
//       setSelectedEmployee(null);
//     } catch (error) {
//       console.error('Error updating employee:', error);
//     }
//   };

//   const handleDeleteEmployee = async (id) => {
//     if (confirm('Are you sure you want to delete this employee?')) {
//       try {
//         setEmployees(employees.filter(emp => emp.id !== id));
//       } catch (error) {
//         console.error('Error deleting employee:', error);
//       }
//     }
//   };

//   const handleCreatePayrollRun = async (payrollData) => {
//     try {
//       const newPayrollRun = {
//         id: payrollRuns.length + 1,
//         payroll_run_id: `PR${new Date().getFullYear()}${String(payrollRuns.length + 1).padStart(3, '0')}`,
//         ...payrollData,
//         status: 'DRAFT',
//         total_employees: 0,
//         total_gross_pay: 0,
//         total_deductions: 0,
//         total_net_pay: 0
//       };
//       setPayrollRuns([...payrollRuns, newPayrollRun]);
//     } catch (error) {
//       console.error('Error creating payroll run:', error);
//     }
//   };

//   const handleAddTaxSetting = async (taxData) => {
//     try {
//       const newTaxSetting = {
//         id: taxSettings.length + 1,
//         ...taxData
//       };
//       setTaxSettings([...taxSettings, newTaxSetting]);
//     } catch (error) {
//       console.error('Error adding tax setting:', error);
//     }
//   };

//   const handleViewPaySlip = (paySlip) => {
//     const employee = employees.find(emp => emp.id === paySlip.employee_id);
//     const payrollRun = payrollRuns.find(run => run.id === paySlip.payroll_run_id);
//     setSelectedPaySlip({ ...paySlip, employee, payrollRun });
//     setShowPaySlipPreview(true);
//   };

//   // Calculate stats
//   const stats = {
//     totalEmployees: employees.length,
//     activeEmployees: employees.filter(emp => emp.status === 'ACTIVE').length,
//     totalPayroll: payrollRuns.filter(run => run.status === 'COMPLETED')
//       .reduce((sum, run) => sum + run.total_net_pay, 0),
//     avgSalary: employees.length > 0 
//       ? employees.reduce((sum, emp) => sum + (emp.salary_amount || 0), 0) / employees.length 
//       : 0
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
//                 <CurrencyDollarIcon className="w-6 h-6 text-white" />
//               </div>
//               <h1 className="ml-4 text-2xl font-bold text-blue-600 dark:text-blue-400">
//                 Payroll Management
//               </h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <SearchBar
//                 value={searchTerm}
//                 onChange={setSearchTerm}
//                 placeholder="Search..."
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
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <StatsCard
//             title="Total Employees"
//             value={stats.totalEmployees}
//             icon={UsersIcon}
//             color="blue"
//           />
//           <StatsCard
//             title="Active Employees"
//             value={stats.activeEmployees}
//             icon={UsersIcon}
//             color="green"
//           />
//           <StatsCard
//             title="Total Payroll"
//             value={formatCurrency(stats.totalPayroll)}
//             icon={CurrencyDollarIcon}
//             color="purple"
//           />
//           <StatsCard
//             title="Average Salary"
//             value={formatCurrency(stats.avgSalary)}
//             icon={CurrencyDollarIcon}
//             color="yellow"
//           />
//         </div>

//         {/* Tabs */}
//         <Tabs defaultTab="employees" onChange={setActiveTab}>
//           {/* Employee List Tab */}
//           <TabPanel id="employees" label="Employee List">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                     Employee List
//                   </h2>
//                   <p className="mt-2 text-gray-600 dark:text-gray-400">
//                     Manage employee information and records
//                   </p>
//                 </div>
//                 <Button onClick={() => setShowEmployeeForm(true)}>
//                   <PlusIcon className="w-5 h-5 mr-2" />
//                   Add Employee
//                 </Button>
//               </div>

//               <Card>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Employee ID</TableHead>
//                       <TableHead>Name</TableHead>
//                       <TableHead>Job Title</TableHead>
//                       <TableHead>Department</TableHead>
//                       <TableHead>Email</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredEmployees.map((employee) => (
//                       <TableRow key={employee.id}>
//                         <TableCell className="font-medium">
//                           {employee.employee_id}
//                         </TableCell>
//                         <TableCell>
//                           <div>
//                             <div className="font-medium">
//                               {employee.first_name} {employee.last_name}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               {employee.phone}
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>{employee.job_title}</TableCell>
//                         <TableCell>{employee.department}</TableCell>
//                         <TableCell>{employee.email}</TableCell>
//                         <TableCell>{getStatusBadge(employee.status)}</TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={() => handleEditEmployee(employee)}
//                             >
//                               <PencilIcon className="w-4 h-4" />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={() => handleDeleteEmployee(employee.id)}
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

//           {/* Payroll Runs Tab */}
//           <TabPanel id="payrollRuns" label="Payroll Runs">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                     Payroll Runs
//                   </h2>
//                   <p className="mt-2 text-gray-600 dark:text-gray-400">
//                     Process payroll for pay periods
//                   </p>
//                 </div>
//                 <Button onClick={() => setShowPayrollRunForm(true)}>
//                   <PlusIcon className="w-5 h-5 mr-2" />
//                   New Payroll Run
//                 </Button>
//               </div>

//               <Card>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Payroll Run ID</TableHead>
//                       <TableHead>Pay Period</TableHead>
//                       <TableHead>Payment Date</TableHead>
//                       <TableHead>Employees</TableHead>
//                       <TableHead>Total Net Pay</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredPayrollRuns.map((run) => (
//                       <TableRow key={run.id}>
//                         <TableCell className="font-medium">
//                           {run.payroll_run_id}
//                         </TableCell>
//                         <TableCell>
//                           {formatDate(run.pay_period_start)} - {formatDate(run.pay_period_end)}
//                         </TableCell>
//                         <TableCell>{formatDate(run.payment_date)}</TableCell>
//                         <TableCell>{run.total_employees}</TableCell>
//                         <TableCell className="font-medium">
//                           {formatCurrency(run.total_net_pay)}
//                         </TableCell>
//                         <TableCell>{getStatusBadge(run.status)}</TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button size="sm" variant="ghost">
//                               <EyeIcon className="w-4 h-4" />
//                             </Button>
//                             <Button size="sm" variant="ghost">
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

//           {/* Tax Settings Tab */}
//           <TabPanel id="taxSettings" label="Tax Settings">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                     Tax Settings
//                   </h2>
//                   <p className="mt-2 text-gray-600 dark:text-gray-400">
//                     Configure tax rates and deductions
//                   </p>
//                 </div>
//                 <Button onClick={() => setShowTaxSettingForm(true)}>
//                   <PlusIcon className="w-5 h-5 mr-2" />
//                   Add Tax Setting
//                 </Button>
//               </div>

//               <Card>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Tax ID</TableHead>
//                       <TableHead>Tax Name</TableHead>
//                       <TableHead>Type</TableHead>
//                       <TableHead>Rate</TableHead>
//                       <TableHead>Effective Date</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredTaxSettings.map((tax) => (
//                       <TableRow key={tax.id}>
//                         <TableCell className="font-medium">{tax.tax_id}</TableCell>
//                         <TableCell>{tax.tax_name}</TableCell>
//                         <TableCell>
//                           <Badge variant="info">
//                             {tax.tax_type.replace('_', ' ')}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           {tax.is_percentage 
//                             ? `${(tax.tax_rate * 100).toFixed(2)}%`
//                             : formatCurrency(tax.flat_amount)
//                           }
//                         </TableCell>
//                         <TableCell>{formatDate(tax.effective_date)}</TableCell>
//                         <TableCell>{getStatusBadge(tax.status)}</TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button size="sm" variant="ghost">
//                               <PencilIcon className="w-4 h-4" />
//                             </Button>
//                             <Button size="sm" variant="ghost">
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

//           {/* Pay Slips Tab */}
//           <TabPanel id="paySlips" label="Pay Slips">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                     Pay Slips
//                   </h2>
//                   <p className="mt-2 text-gray-600 dark:text-gray-400">
//                     View and manage employee pay slips
//                   </p>
//                 </div>
//               </div>

//               <Card>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Pay Slip ID</TableHead>
//                       <TableHead>Employee</TableHead>
//                       <TableHead>Gross Pay</TableHead>
//                       <TableHead>Deductions</TableHead>
//                       <TableHead>Net Pay</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredPaySlips.map((slip) => {
//                       const employee = employees.find(emp => emp.id === slip.employee_id);
//                       return (
//                         <TableRow key={slip.id}>
//                           <TableCell className="font-medium">
//                             {slip.pay_slip_id}
//                           </TableCell>
//                           <TableCell>
//                             <div>
//                               <div className="font-medium">
//                                 {employee?.first_name} {employee?.last_name}
//                               </div>
//                               <div className="text-sm text-gray-500">
//                                 {employee?.employee_id}
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell className="font-medium">
//                             {formatCurrency(slip.gross_pay)}
//                           </TableCell>
//                           <TableCell>{formatCurrency(slip.total_deductions)}</TableCell>
//                           <TableCell className="font-medium text-green-600">
//                             {formatCurrency(slip.net_pay)}
//                           </TableCell>
//                           <TableCell>{getStatusBadge(slip.payment_status)}</TableCell>
//                           <TableCell>
//                             <div className="flex space-x-2">
//                               <Button
//                                 size="sm"
//                                 variant="ghost"
//                                 onClick={() => handleViewPaySlip(slip)}
//                               >
//                                 <EyeIcon className="w-4 h-4" />
//                               </Button>
//                               <Button size="sm" variant="ghost">
//                                 <ArrowDownTrayIcon className="w-4 h-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </Card>
//             </motion.div>
//           </TabPanel>
//         </Tabs>
//       </main>

//       {/* Modals */}
//       <EmployeeForm
//         isOpen={showEmployeeForm}
//         onClose={() => {
//           setShowEmployeeForm(false);
//           setSelectedEmployee(null);
//         }}
//         onSubmit={selectedEmployee ? handleUpdateEmployee : handleAddEmployee}
//         employee={selectedEmployee}
//         departments={departments}
//       />

//       <PayrollRunForm
//         isOpen={showPayrollRunForm}
//         onClose={() => setShowPayrollRunForm(false)}
//         onSubmit={handleCreatePayrollRun}
//       />

//       <TaxSettingForm
//         isOpen={showTaxSettingForm}
//         onClose={() => {
//           setShowTaxSettingForm(false);
//           setSelectedTaxSetting(null);
//         }}
//         onSubmit={selectedTaxSetting ? () => {} : handleAddTaxSetting}
//         taxSetting={selectedTaxSetting}
//       />

//       {showPaySlipPreview && selectedPaySlip && (
//         <Modal
//           isOpen={showPaySlipPreview}
//           onClose={() => {
//             setShowPaySlipPreview(false);
//             setSelectedPaySlip(null);
//           }}
//           title="Pay Slip Preview"
//           size="xl"
//         >
//           <PaySlipPreview
//             paySlip={selectedPaySlip}
//             employee={selectedPaySlip.employee}
//             payrollRun={selectedPaySlip.payrollRun}
//           />
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default PayrollManagement;