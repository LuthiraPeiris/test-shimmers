
'use client';
import { useState, useEffect, useMemo } from 'react';
import EmployeeSalaryStats from '../components/payroll/EmployeeSalaryStats';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CalendarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

// Import UI Components
import {
  Badge,
  Button,
  Card,
  SearchBar,
  StatsCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabPanel,
  Modal,
  Input,
  Select,
  formatCurrency,
  formatDate,
  getStatusBadge,
  getMonthName,
  generateMonthOptions,
  generateYearOptions
} from '../components/payroll/ui/index';

// Import Form Components
import {
  EmployeeForm,
  PayrollRunForm,
  EarningGroupForm,
  RecoveryGroupForm,
  SalaryEntryForm,
  PaySlipPreview
} from '../components/payroll/forms/index';

const HRPayrollManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedPayrollRun, setSelectedPayrollRun] = useState(null);
  const [selectedEarningGroup, setSelectedEarningGroup] = useState(null);
  const [selectedRecoveryGroup, setSelectedRecoveryGroup] = useState(null);
  const [selectedPaySlip, setSelectedPaySlip] = useState(null);
  const [selectedEmployeeForHistory, setSelectedEmployeeForHistory] = useState(null);
  const [showEmployeePayrollHistory, setShowEmployeePayrollHistory] = useState(false);
  const [payrollProcessingMonth, setPayrollProcessingMonth] = useState(new Date().getMonth() + 1);
  const [payrollProcessingYear, setPayrollProcessingYear] = useState(new Date().getFullYear());
  
  // Modal states
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showPayrollRunForm, setShowPayrollRunForm] = useState(false);
  const [showEarningGroupForm, setShowEarningGroupForm] = useState(false);
  const [showRecoveryGroupForm, setShowRecoveryGroupForm] = useState(false);
  const [showSalaryEntryForm, setShowSalaryEntryForm] = useState(false);
  const [showPaySlipPreview, setShowPaySlipPreview] = useState(false);
  const [showPayrollProcessModal, setShowPayrollProcessModal] = useState(false);
  const [showBulkSalaryModal, setShowBulkSalaryModal] = useState(false);
  
  // Sorting and filtering states for groups
  const [earningGroupSortBy, setEarningGroupSortBy] = useState('name');
  const [earningGroupSortOrder, setEarningGroupSortOrder] = useState('asc');
  const [earningGroupFilterMonth, setEarningGroupFilterMonth] = useState(new Date().getMonth() + 1);
  const [earningGroupFilterYear, setEarningGroupFilterYear] = useState(new Date().getFullYear());
  
  const [recoveryGroupSortBy, setRecoveryGroupSortBy] = useState('name');
  const [recoveryGroupSortOrder, setRecoveryGroupSortOrder] = useState('asc');
  const [recoveryGroupFilterMonth, setRecoveryGroupFilterMonth] = useState(new Date().getMonth() + 1);
  const [recoveryGroupFilterYear, setRecoveryGroupFilterYear] = useState(new Date().getFullYear());
  
  // Data states
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [payrollRuns, setPayrollRuns] = useState([]);
  const [earningGroups, setEarningGroups] = useState([]);
  const [recoveryGroups, setRecoveryGroups] = useState([]);
  const [paySlips, setPaySlips] = useState([]);
  const [salaryEntries, setSalaryEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayroll, setProcessingPayroll] = useState(false);

  // Enhanced Mock data with more comprehensive information
  const mockData = {
    employees: [
      {
        id: 1,
        employee_id: 'EMP001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1-555-0123',
        job_title: 'Software Engineer',
        department_id: 2,
        department: 'Information Technology',
        joining_date: '2024-01-15',
        status: 'ACTIVE',
        bank_account_number: '1234567890',
        bank_name: 'Chase Bank',
        tax_id: 'TAX001234',
        basic_salary: 6000.00
      },
      {
        id: 2,
        employee_id: 'EMP002',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@company.com',
        phone: '+1-555-0124',
        job_title: 'HR Manager',
        department_id: 1,
        department: 'Human Resources',
        joining_date: '2023-08-20',
        status: 'ACTIVE',
        bank_account_number: '0987654321',
        bank_name: 'Bank of America',
        tax_id: 'TAX001235',
        basic_salary: 6500.00
      },
      {
        id: 3,
        employee_id: 'EMP003',
        first_name: 'Mike',
        last_name: 'Johnson',
        email: 'mike.johnson@company.com',
        phone: '+1-555-0125',
        job_title: 'Sales Representative',
        department_id: 4,
        department: 'Sales',
        joining_date: '2024-03-10',
        status: 'ACTIVE',
        bank_account_number: '1122334455',
        bank_name: 'Wells Fargo',
        tax_id: 'TAX001236',
        basic_salary: 4200.00
      },
      {
        id: 4,
        employee_id: 'EMP004',
        first_name: 'Sarah',
        last_name: 'Williams',
        email: 'sarah.williams@company.com',
        phone: '+1-555-0126',
        job_title: 'Financial Analyst',
        department_id: 3,
        department: 'Finance',
        joining_date: '2023-11-05',
        status: 'ACTIVE',
        bank_account_number: '5566778899',
        bank_name: 'Citibank',
        tax_id: 'TAX001237',
        basic_salary: 5800.00
      },
      {
        id: 5,
        employee_id: 'EMP005',
        first_name: 'David',
        last_name: 'Brown',
        email: 'david.brown@company.com',
        phone: '+1-555-0127',
        job_title: 'Marketing Specialist',
        department_id: 4,
        department: 'Sales',
        joining_date: '2024-02-12',
        status: 'INACTIVE',
        bank_account_number: '9988776655',
        bank_name: 'TD Bank',
        tax_id: 'TAX001238',
        basic_salary: 3800.00
      }
    ],
    departments: [
      { id: 1, name: 'Human Resources', code: 'HR' },
      { id: 2, name: 'Information Technology', code: 'IT' },
      { id: 3, name: 'Finance', code: 'FIN' },
      { id: 4, name: 'Sales', code: 'SALES' },
      { id: 5, name: 'Operations', code: 'OPS' }
    ],
    payrollRuns: [
      {
        id: 1,
        payroll_run_id: 'PR2024008',
        month: 8,
        month_name: 'August',
        year: 2024,
        payment_date: '2024-08-31',
        status: 'COMPLETED',
        total_employees: 4,
        total_gross_pay: 28750.00,
        total_recoveries: 7187.50,
        total_net_pay: 21562.50,
        notes: 'Regular August payroll processing'
      },
      {
        id: 2,
        payroll_run_id: 'PR2024009',
        month: 9,
        month_name: 'September',
        year: 2024,
        payment_date: '2024-09-30',
        status: 'PROCESSING',
        total_employees: 4,
        total_gross_pay: 28750.00,
        total_recoveries: 7187.50,
        total_net_pay: 21562.50,
        notes: 'September payroll in progress'
      },
      {
        id: 3,
        payroll_run_id: 'PR2024010',
        month: 10,
        month_name: 'October',
        year: 2024,
        payment_date: '2024-10-31',
        status: 'DRAFT',
        total_employees: 4,
        total_gross_pay: 0,
        total_recoveries: 0,
        total_net_pay: 0,
        notes: 'October payroll draft'
      },
      {
        id: 4,
        payroll_run_id: 'PR2025007',
        month: 7,
        month_name: 'July',
        year: 2025,
        payment_date: '2025-07-31',
        status: 'COMPLETED',
        total_employees: 4,
        total_gross_pay: 31250.00,
        total_recoveries: 7812.50,
        total_net_pay: 23437.50,
        notes: 'July 2025 payroll processing'
      },
      {
        id: 5,
        payroll_run_id: 'PR2025008',
        month: 8,
        month_name: 'August',
        year: 2025,
        payment_date: '2025-08-31',
        status: 'COMPLETED',
        total_employees: 4,
        total_gross_pay: 32500.00,
        total_recoveries: 8125.00,
        total_net_pay: 24375.00,
        notes: 'August 2025 payroll processing'
      }
    ],
    earningGroups: [
      {
        id: 1,
        code: 'BASIC_SALARY',
        name: 'Basic Salary',
        description: 'Monthly basic salary payment',
        is_taxable: true,
        status: 'ACTIVE',
        monthly_total: 22500.00,
        yearly_total: 270000.00
      },
      {
        id: 2,
        code: 'OVERTIME',
        name: 'Overtime Pay',
        description: 'Overtime hours payment at 1.5x rate',
        is_taxable: true,
        status: 'ACTIVE',
        monthly_total: 1200.00,
        yearly_total: 14400.00
      },
      {
        id: 3,
        code: 'SPECIAL_ALLOWANCE',
        name: 'Special Allowance',
        description: 'Special monthly allowance for performance',
        is_taxable: true,
        status: 'ACTIVE',
        monthly_total: 2800.00,
        yearly_total: 33600.00
      },
      {
        id: 4,
        code: 'TRANSPORT_ALLOWANCE',
        name: 'Transport Allowance',
        description: 'Monthly transport allowance (non-taxable)',
        is_taxable: false,
        status: 'ACTIVE',
        monthly_total: 2250.00,
        yearly_total: 27000.00
      },
      {
        id: 5,
        code: 'MEAL_ALLOWANCE',
        name: 'Meal Allowance',
        description: 'Daily meal allowance',
        is_taxable: false,
        status: 'ACTIVE',
        monthly_total: 0,
        yearly_total: 0
      }
    ],
    recoveryGroups: [
      {
        id: 1,
        code: 'INCOME_TAX',
        name: 'Income Tax',
        description: 'Monthly income tax deduction',
        status: 'ACTIVE',
        monthly_total: 4312.50,
        yearly_total: 51750.00
      },
      {
        id: 2,
        code: 'EPF',
        name: 'Employee Provident Fund',
        description: 'EPF contribution deduction',
        status: 'ACTIVE',
        monthly_total: 1800.00,
        yearly_total: 21600.00
      },
      {
        id: 3,
        code: 'ETF',
        name: 'Employee Trust Fund',
        description: 'ETF contribution deduction',
        status: 'ACTIVE',
        monthly_total: 675.00,
        yearly_total: 8100.00
      },
      {
        id: 4,
        code: 'ADVANCE_INCOME_TAX',
        name: 'Advance Income Tax',
        description: 'Advance payment of income tax',
        status: 'ACTIVE',
        monthly_total: 400.00,
        yearly_total: 4800.00
      },
      {
        id: 5,
        code: 'INSURANCE',
        name: 'Health Insurance',
        description: 'Monthly health insurance premium',
        status: 'ACTIVE',
        monthly_total: 0,
        yearly_total: 0
      }
    ],
    paySlips: [
      {
        id: 1,
        pay_slip_id: 'PS2024001',
        employee_id: 1,
        payroll_run_id: 1,
        gross_pay: 7250.00,
        total_recoveries: 1812.50,
        net_pay: 5437.50,
        payment_status: 'PAID',
        payment_method: 'Bank Transfer',
        earnings: [
          { earning_name: 'Basic Salary', amount: 6000.00 },
          { earning_name: 'Transport Allowance', amount: 750.00 },
          { earning_name: 'Special Allowance', amount: 500.00 }
        ],
        recoveries: [
          { recovery_name: 'Income Tax', amount: 1087.50 },
          { recovery_name: 'EPF', amount: 480.00 },
          { recovery_name: 'ETF', amount: 180.00 },
          { recovery_name: 'Health Insurance', amount: 65.00 }
        ]
      },
      {
        id: 2,
        pay_slip_id: 'PS2024002',
        employee_id: 2,
        payroll_run_id: 1,
        gross_pay: 7700.00,
        total_recoveries: 1925.00,
        net_pay: 5775.00,
        payment_status: 'PAID',
        payment_method: 'Bank Transfer',
        earnings: [
          { earning_name: 'Basic Salary', amount: 6500.00 },
          { earning_name: 'Special Allowance', amount: 700.00 },
          { earning_name: 'Transport Allowance', amount: 500.00 }
        ],
        recoveries: [
          { recovery_name: 'Income Tax', amount: 1155.00 },
          { recovery_name: 'EPF', amount: 520.00 },
          { recovery_name: 'ETF', amount: 195.00 },
          { recovery_name: 'Health Insurance', amount: 55.00 }
        ]
      },
      {
        id: 3,
        pay_slip_id: 'PS2024003',
        employee_id: 3,
        payroll_run_id: 1,
        gross_pay: 5200.00,
        total_recoveries: 1300.00,
        net_pay: 3900.00,
        payment_status: 'PAID',
        payment_method: 'Bank Transfer',
        earnings: [
          { earning_name: 'Basic Salary', amount: 4200.00 },
          { earning_name: 'Transport Allowance', amount: 500.00 },
          { earning_name: 'Overtime Pay', amount: 500.00 }
        ],
        recoveries: [
          { recovery_name: 'Income Tax', amount: 780.00 },
          { recovery_name: 'EPF', amount: 336.00 },
          { recovery_name: 'ETF', amount: 126.00 },
          { recovery_name: 'Health Insurance', amount: 58.00 }
        ]
      },
      {
        id: 4,
        pay_slip_id: 'PS2024004',
        employee_id: 4,
        payroll_run_id: 1,
        gross_pay: 6800.00,
        total_recoveries: 1700.00,
        net_pay: 5100.00,
        payment_status: 'PAID',
        payment_method: 'Bank Transfer',
        earnings: [
          { earning_name: 'Basic Salary', amount: 5800.00 },
          { earning_name: 'Transport Allowance', amount: 500.00 },
          { earning_name: 'Special Allowance', amount: 500.00 }
        ],
        recoveries: [
          { recovery_name: 'Income Tax', amount: 1020.00 },
          { recovery_name: 'EPF', amount: 464.00 },
          { recovery_name: 'ETF', amount: 174.00 },
          { recovery_name: 'Health Insurance', amount: 42.00 }
        ]
      },
      // July 2025 pay slips (payroll_run_id: 4)
      {
        id: 5,
        pay_slip_id: 'PS2025001',
        employee_id: 1,
        payroll_run_id: 4,
        gross_pay: 7750.00,
        total_recoveries: 1937.50,
        net_pay: 5812.50,
        payment_status: 'PAID',
        payment_method: 'Bank Transfer',
        earnings: [
          { earning_name: 'Basic Salary', amount: 6000.00 },
          { earning_name: 'Transport Allowance', amount: 750.00 },
          { earning_name: 'Special Allowance', amount: 750.00 },
          { earning_name: 'Overtime Pay', amount: 250.00 }
        ],
        recoveries: [
          { recovery_name: 'Income Tax', amount: 1162.50 },
          { recovery_name: 'EPF', amount: 480.00 },
          { recovery_name: 'ETF', amount: 180.00 },
          { recovery_name: 'Health Insurance', amount: 65.00 },
          { recovery_name: 'Advance Income Tax', amount: 50.00 }
        ]
      },
      {
        id: 6,
        pay_slip_id: 'PS2025002',
        employee_id: 2,
        payroll_run_id: 4,
        gross_pay: 8200.00,
        total_recoveries: 2050.00,
        net_pay: 6150.00,
        payment_status: 'PAID',
        payment_method: 'Bank Transfer',
        earnings: [
          { earning_name: 'Basic Salary', amount: 6500.00 },
          { earning_name: 'Special Allowance', amount: 900.00 },
          { earning_name: 'Transport Allowance', amount: 500.00 },
          { earning_name: 'Overtime Pay', amount: 300.00 }
        ],
        recoveries: [
          { recovery_name: 'Income Tax', amount: 1230.00 },
          { recovery_name: 'EPF', amount: 520.00 },
          { recovery_name: 'ETF', amount: 195.00 },
          { recovery_name: 'Health Insurance', amount: 55.00 },
          { recovery_name: 'Advance Income Tax', amount: 50.00 }
        ]
      },
      {
        id: 7,
        pay_slip_id: 'PS2025003',
        employee_id: 3,
        payroll_run_id: 4,
        gross_pay: 5500.00,
        total_recoveries: 1375.00,
        net_pay: 4125.00,
        payment_status: 'PAID',
        payment_method: 'Bank Transfer',
        earnings: [
          { earning_name: 'Basic Salary', amount: 4200.00 },
          { earning_name: 'Transport Allowance', amount: 500.00 },
          { earning_name: 'Overtime Pay', amount: 600.00 },
          { earning_name: 'Special Allowance', amount: 200.00 }
        ],
        recoveries: [
          { recovery_name: 'Income Tax', amount: 825.00 },
          { recovery_name: 'EPF', amount: 336.00 },
          { recovery_name: 'ETF', amount: 126.00 },
          { recovery_name: 'Health Insurance', amount: 58.00 },
          { recovery_name: 'Advance Income Tax', amount: 30.00 }
        ]
      },
      {
        id: 8,
        pay_slip_id: 'PS2025004',
        employee_id: 4,
        payroll_run_id: 4,
        gross_pay: 7200.00,
        total_recoveries: 1800.00,
        net_pay: 5400.00,
        payment_status: 'PAID',
        payment_method: 'Bank Transfer',
        earnings: [
          { earning_name: 'Basic Salary', amount: 5800.00 },
          { earning_name: 'Transport Allowance', amount: 500.00 },
          { earning_name: 'Special Allowance', amount: 650.00 },
          { earning_name: 'Overtime Pay', amount: 250.00 }
        ],
        recoveries: [
          { recovery_name: 'Income Tax', amount: 1080.00 },
          { recovery_name: 'EPF', amount: 464.00 },
          { recovery_name: 'ETF', amount: 174.00 },
          { recovery_name: 'Health Insurance', amount: 42.00 },
          { recovery_name: 'Advance Income Tax', amount: 40.00 }
        ]
      },
      // August 2025 pay slips (payroll_run_id: 5)
      {
        id: 9,
        pay_slip_id: 'PS2025005',
        employee_id: 1,
        payroll_run_id: 5,
        gross_pay: 8000.00,
        total_recoveries: 2000.00,
        net_pay: 6000.00,
        payment_status: 'PAID',
        payment_method: 'Bank Transfer',
        earnings: [
          { earning_name: 'Basic Salary', amount: 6000.00 },
          { earning_name: 'Transport Allowance', amount: 750.00 },
          { earning_name: 'Special Allowance', amount: 800.00 },
          { earning_name: 'Overtime Pay', amount: 450.00 }
        ],
        recoveries: [
          { recovery_name: 'Income Tax', amount: 1200.00 },
          { recovery_name: 'EPF', amount: 480.00 },
          { recovery_name: 'ETF', amount: 180.00 },
          { recovery_name: 'Health Insurance', amount: 65.00 },
          { recovery_name: 'Advance Income Tax', amount: 75.00 }
        ]
      },
      {
        id: 10,
        pay_slip_id: 'PS2025006',
        employee_id: 2,
        payroll_run_id: 5,
        gross_pay: 8500.00,
        total_recoveries: 2125.00,
        net_pay: 6375.00,
        payment_status: 'PAID',
        payment_method: 'Bank Transfer',
        earnings: [
          { earning_name: 'Basic Salary', amount: 6500.00 },
          { earning_name: 'Special Allowance', amount: 1000.00 },
          { earning_name: 'Transport Allowance', amount: 500.00 },
          { earning_name: 'Overtime Pay', amount: 500.00 }
        ],
        recoveries: [
          { recovery_name: 'Income Tax', amount: 1275.00 },
          { recovery_name: 'EPF', amount: 520.00 },
          { recovery_name: 'ETF', amount: 195.00 },
          { recovery_name: 'Health Insurance', amount: 55.00 },
          { recovery_name: 'Advance Income Tax', amount: 80.00 }
        ]
      },
      {
        id: 11,
        pay_slip_id: 'PS2025007',
        employee_id: 3,
        payroll_run_id: 5,
        gross_pay: 5800.00,
        total_recoveries: 1450.00,
        net_pay: 4350.00,
        payment_status: 'PAID',
        payment_method: 'Bank Transfer',
        earnings: [
          { earning_name: 'Basic Salary', amount: 4200.00 },
          { earning_name: 'Transport Allowance', amount: 500.00 },
          { earning_name: 'Overtime Pay', amount: 800.00 },
          { earning_name: 'Special Allowance', amount: 300.00 }
        ],
        recoveries: [
          { recovery_name: 'Income Tax', amount: 870.00 },
          { recovery_name: 'EPF', amount: 336.00 },
          { recovery_name: 'ETF', amount: 126.00 },
          { recovery_name: 'Health Insurance', amount: 58.00 },
          { recovery_name: 'Advance Income Tax', amount: 60.00 }
        ]
      },
      {
        id: 12,
        pay_slip_id: 'PS2025008',
        employee_id: 4,
        payroll_run_id: 5,
        gross_pay: 7500.00,
        total_recoveries: 1875.00,
        net_pay: 5625.00,
        payment_status: 'PAID',
        payment_method: 'Bank Transfer',
        earnings: [
          { earning_name: 'Basic Salary', amount: 5800.00 },
          { earning_name: 'Transport Allowance', amount: 500.00 },
          { earning_name: 'Special Allowance', amount: 800.00 },
          { earning_name: 'Overtime Pay', amount: 400.00 }
        ],
        recoveries: [
          { recovery_name: 'Income Tax', amount: 1125.00 },
          { recovery_name: 'EPF', amount: 464.00 },
          { recovery_name: 'ETF', amount: 174.00 },
          { recovery_name: 'Health Insurance', amount: 42.00 },
          { recovery_name: 'Advance Income Tax', amount: 70.00 }
        ]
      }
    ],
    salaryEntries: [
      {
        id: 1,
        employee_id: 1,
        payroll_run_id: 2,
        earnings: [
          { earning_group_id: 1, amount: 6000.00 },
          { earning_group_id: 4, amount: 750.00 },
          { earning_group_id: 3, amount: 500.00 }
        ],
        recoveries: [
          { recovery_group_id: 1, amount: 1087.50 },
          { recovery_group_id: 2, amount: 480.00 },
          { recovery_group_id: 3, amount: 180.00 }
        ]
      }
    ]
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setEmployees(mockData.employees);
        setDepartments(mockData.departments);
        setPayrollRuns(mockData.payrollRuns);
        setEarningGroups(mockData.earningGroups);
        setRecoveryGroups(mockData.recoveryGroups);
        setPaySlips(mockData.paySlips);
        setSalaryEntries(mockData.salaryEntries);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Enhanced filter functions
  const filteredEmployees = employees.filter(emp => 
    emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayrollRuns = payrollRuns.filter(run =>
    run.payroll_run_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    run.month_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    run.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Move these function calls after the calculation functions are defined
  // We'll define filteredEarningGroups later

  // Move these function calls after the calculation functions are defined
  // We'll define filteredRecoveryGroups later

  // Remove old filtered pay slips - now handled in Employee Salary Stats component
  
  const getEmployeePayrollHistory = (employeeId) => {
    return paySlips
      .filter(slip => slip.employee_id === employeeId)
      .map(slip => {
        const payrollRun = payrollRuns.find(run => run.id === slip.payroll_run_id);
        return { ...slip, payrollRun };
      })
      .sort((a, b) => {
        if (a.payrollRun.year !== b.payrollRun.year) {
          return b.payrollRun.year - a.payrollRun.year;
        }
        return b.payrollRun.month - a.payrollRun.month;
      });
  };

  // Enhanced CRUD operations
  const handleAddEmployee = async (employeeData) => {
    try {
      const newEmployee = {
        id: employees.length + 1,
        ...employeeData,
        department: departments.find(d => d.id == employeeData.department_id)?.name,
        basic_salary: 0
      };
      setEmployees([...employees, newEmployee]);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleUpdateEmployee = async (employeeData) => {
    try {
      const updatedEmployees = employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, ...employeeData, department: departments.find(d => d.id == employeeData.department_id)?.name }
          : emp
      );
      setEmployees(updatedEmployees);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleCreatePayrollRun = async (payrollData) => {
    try {
      const existingRun = payrollRuns.find(run => 
        run.month === payrollData.month && run.year === payrollData.year
      );
      
      if (existingRun) {
        alert('A payroll run for this month and year already exists!');
        return;
      }

      const newPayrollRun = {
        id: payrollRuns.length + 1,
        payroll_run_id: `PR${payrollData.year}${String(payrollData.month).padStart(3, '0')}`,
        month: payrollData.month,
        month_name: getMonthName(payrollData.month),
        year: payrollData.year,
        payment_date: payrollData.payment_date,
        status: 'DRAFT',
        total_employees: employees.filter(emp => emp.status === 'ACTIVE').length,
        total_gross_pay: 0,
        total_recoveries: 0,
        total_net_pay: 0,
        notes: payrollData.notes
      };
      setPayrollRuns([...payrollRuns, newPayrollRun]);
    } catch (error) {
      console.error('Error creating payroll run:', error);
    }
  };

  const handleAddEarningGroup = async (earningData) => {
    try {
      const existingGroup = earningGroups.find(group => 
        group.code.toLowerCase() === earningData.code.toLowerCase()
      );
      
      if (existingGroup) {
        alert('An earning group with this code already exists!');
        return;
      }

      const newEarningGroup = {
        id: earningGroups.length + 1,
        ...earningData,
        monthly_total: 0,
        yearly_total: 0
      };
      setEarningGroups([...earningGroups, newEarningGroup]);
    } catch (error) {
      console.error('Error adding earning group:', error);
    }
  };

  const handleEditEarningGroup = (group) => {
    setSelectedEarningGroup(group);
    setShowEarningGroupForm(true);
  };

  const handleUpdateEarningGroup = async (earningData) => {
    try {
      const updatedGroups = earningGroups.map(group =>
        group.id === selectedEarningGroup.id ? { ...group, ...earningData } : group
      );
      setEarningGroups(updatedGroups);
      setSelectedEarningGroup(null);
    } catch (error) {
      console.error('Error updating earning group:', error);
    }
  };

  const handleDeleteEarningGroup = async (id) => {
    if (confirm('Are you sure you want to delete this earning group?')) {
      try {
        setEarningGroups(earningGroups.filter(group => group.id !== id));
      } catch (error) {
        console.error('Error deleting earning group:', error);
      }
    }
  };

  const handleAddRecoveryGroup = async (recoveryData) => {
    try {
      const existingGroup = recoveryGroups.find(group => 
        group.code.toLowerCase() === recoveryData.code.toLowerCase()
      );
      
      if (existingGroup) {
        alert('A recovery group with this code already exists!');
        return;
      }

      const newRecoveryGroup = {
        id: recoveryGroups.length + 1,
        ...recoveryData,
        monthly_total: 0,
        yearly_total: 0
      };
      setRecoveryGroups([...recoveryGroups, newRecoveryGroup]);
    } catch (error) {
      console.error('Error adding recovery group:', error);
    }
  };

  const handleEditRecoveryGroup = (group) => {
    setSelectedRecoveryGroup(group);
    setShowRecoveryGroupForm(true);
  };

  const handleUpdateRecoveryGroup = async (recoveryData) => {
    try {
      const updatedGroups = recoveryGroups.map(group =>
        group.id === selectedRecoveryGroup.id ? { ...group, ...recoveryData } : group
      );
      setRecoveryGroups(updatedGroups);
      setSelectedRecoveryGroup(null);
    } catch (error) {
      console.error('Error updating recovery group:', error);
    }
  };

  const handleDeleteRecoveryGroup = async (id) => {
    if (confirm('Are you sure you want to delete this recovery group?')) {
      try {
        setRecoveryGroups(recoveryGroups.filter(group => group.id !== id));
      } catch (error) {
        console.error('Error deleting recovery group:', error);
      }
    }
  };

  const handleSalaryEntry = (employee, payrollRun) => {
    setSelectedEmployee(employee);
    setSelectedPayrollRun(payrollRun);
    setShowSalaryEntryForm(true);
  };

  const handleSaveSalaryEntry = async (salaryData) => {
    try {
      // Check if entry already exists
      const existingEntry = salaryEntries.find(entry => 
        entry.employee_id === salaryData.employee_id && 
        entry.payroll_run_id === salaryData.payroll_run_id
      );

      if (existingEntry) {
        // Update existing entry
        const updatedEntries = salaryEntries.map(entry =>
          entry.employee_id === salaryData.employee_id && 
          entry.payroll_run_id === salaryData.payroll_run_id
            ? { ...entry, ...salaryData }
            : entry
        );
        setSalaryEntries(updatedEntries);
      } else {
        // Add new entry
        const newEntry = {
          id: salaryEntries.length + 1,
          ...salaryData
        };
        setSalaryEntries([...salaryEntries, newEntry]);
      }

      // Update payroll run totals
      const updatedRuns = payrollRuns.map(run => {
        if (run.id === salaryData.payroll_run_id) {
          const entriesForRun = salaryEntries.filter(entry => entry.payroll_run_id === run.id);
          const totalGross = entriesForRun.reduce((sum, entry) => 
            sum + entry.earnings.reduce((earningSum, earning) => earningSum + parseFloat(earning.amount || 0), 0), 0
          );
          const totalRecoveries = entriesForRun.reduce((sum, entry) => 
            sum + entry.recoveries.reduce((recoverySum, recovery) => recoverySum + parseFloat(recovery.amount || 0), 0), 0
          );
          
          return {
            ...run,
            total_gross_pay: totalGross,
            total_recoveries: totalRecoveries,
            total_net_pay: totalGross - totalRecoveries
          };
        }
        return run;
      });
      setPayrollRuns(updatedRuns);

      setSelectedEmployee(null);
      setSelectedPayrollRun(null);
    } catch (error) {
      console.error('Error saving salary entry:', error);
    }
  };

  const handleViewPaySlip = (paySlip) => {
    const employee = employees.find(emp => emp.id === paySlip.employee_id);
    const payrollRun = payrollRuns.find(run => run.id === paySlip.payroll_run_id);
    setSelectedPaySlip({ ...paySlip, employee, payrollRun });
    setShowPaySlipPreview(true);
  };

  const handleProcessPayroll = async (payrollRun) => {
    setProcessingPayroll(true);
    try {
      // Simulate payroll processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update payroll run status
      const updatedRuns = payrollRuns.map(run =>
        run.id === payrollRun.id ? { ...run, status: 'COMPLETED' } : run
      );
      setPayrollRuns(updatedRuns);
      
      // Generate pay slips for all employees with salary entries
      const newPaySlips = [];
      const entriesForRun = salaryEntries.filter(entry => entry.payroll_run_id === payrollRun.id);
      
              entriesForRun.forEach(entry => {
        const employee = employees.find(emp => emp.id === entry.employee_id);
        const grossPay = entry.earnings.reduce((sum, earning) => sum + parseFloat(earning.amount || 0), 0);
        const totalRecoveries = entry.recoveries.reduce((sum, recovery) => sum + parseFloat(recovery.amount || 0), 0);
        
        const newPaySlip = {
          id: paySlips.length + newPaySlips.length + 1,
          pay_slip_id: `PS${payrollRun.year}${String(payrollRun.month).padStart(2, '0')}${String(entry.employee_id).padStart(3, '0')}`,
          employee_id: entry.employee_id,
          payroll_run_id: payrollRun.id,
          gross_pay: grossPay,
          total_recoveries: totalRecoveries,
          net_pay: grossPay - totalRecoveries,
          payment_status: 'PAID',
          payment_method: 'Bank Transfer',
          earnings: entry.earnings.map(earning => {
            const earningGroup = earningGroups.find(group => group.id === earning.earning_group_id);
            return {
              earning_name: earningGroup?.name || 'Unknown',
              amount: parseFloat(earning.amount || 0)
            };
          }),
          recoveries: entry.recoveries.map(recovery => {
            const recoveryGroup = recoveryGroups.find(group => group.id === recovery.recovery_group_id);
            return {
              recovery_name: recoveryGroup?.name || 'Unknown',
              amount: parseFloat(recovery.amount || 0)
            };
          })
        };
        
        newPaySlips.push(newPaySlip);
      });
      
      setPaySlips([...paySlips, ...newPaySlips]);
      alert('Payroll processed successfully!');
      
    } catch (error) {
      console.error('Error processing payroll:', error);
      alert('Error processing payroll. Please try again.');
    } finally {
      setProcessingPayroll(false);
    }
  };

  const handleDownloadAllPaySlips = (payrollRun) => {
    const paySlipsForRun = paySlips.filter(slip => slip.payroll_run_id === payrollRun.id);
    
    if (paySlipsForRun.length === 0) {
      alert('No pay slips found for this payroll run.');
      return;
    }
    
    // Enhanced payroll report with group totals
    const earningGroupTotals = {};
    const recoveryGroupTotals = {};
    
    earningGroups.forEach(group => {
      earningGroupTotals[group.name] = calculateEarningGroupTotals(group.id, 'monthly', payrollRun.year, payrollRun.month);
    });
    
    recoveryGroups.forEach(group => {
      recoveryGroupTotals[group.name] = calculateRecoveryGroupTotals(group.id, 'monthly', payrollRun.year, payrollRun.month);
    });
    
    // Create comprehensive payroll report
    const reportData = {
      payrollRun,
      summary: {
        totalEmployees: paySlipsForRun.length,
        totalGrossPay: paySlipsForRun.reduce((sum, slip) => sum + slip.gross_pay, 0),
        totalRecoveries: paySlipsForRun.reduce((sum, slip) => sum + slip.total_recoveries, 0),
        totalNetPay: paySlipsForRun.reduce((sum, slip) => sum + slip.net_pay, 0),
        earningGroupTotals,
        recoveryGroupTotals
      },
      paySlips: paySlipsForRun.map(slip => {
        const employee = employees.find(emp => emp.id === slip.employee_id);
        return { ...slip, employee };
      })
    };
    
    // Simulate comprehensive PDF generation
    console.log('Generating comprehensive payroll report:', reportData);
    
    // Create downloadable content
    const csvContent = generatePayrollCSV(reportData);
    downloadFile(csvContent, `Payroll_Report_${payrollRun.payroll_run_id}.csv`, 'text/csv');
    
    alert(`Generated comprehensive payroll report with ${paySlipsForRun.length} pay slips for ${payrollRun.payroll_run_id}`);
  };
  
  const generatePayrollCSV = (reportData) => {
    let csv = 'Payroll Report\n\n';
    csv += `Payroll Run ID,${reportData.payrollRun.payroll_run_id}\n`;
    csv += `Period,${reportData.payrollRun.month_name} ${reportData.payrollRun.year}\n`;
    csv += `Payment Date,${reportData.payrollRun.payment_date}\n\n`;
    
    csv += 'Summary\n';
    csv += `Total Employees,${reportData.summary.totalEmployees}\n`;
    csv += `Total Gross Pay,${reportData.summary.totalGrossPay}\n`;
    csv += `Total Recoveries,${reportData.summary.totalRecoveries}\n`;
    csv += `Total Net Pay,${reportData.summary.totalNetPay}\n\n`;
    
    csv += 'Earning Group Totals\n';
    Object.entries(reportData.summary.earningGroupTotals).forEach(([name, total]) => {
      csv += `${name},${total}\n`;
    });
    
    csv += '\nRecovery Group Totals\n';
    Object.entries(reportData.summary.recoveryGroupTotals).forEach(([name, total]) => {
      csv += `${name},${total}\n`;
    });
    
    csv += '\n\nEmployee Details\n';
    csv += 'Employee ID,Name,Job Title,Department,Gross Pay,Total Recoveries,Net Pay\n';
    
    reportData.paySlips.forEach(slip => {
      csv += `${slip.employee.employee_id},"${slip.employee.first_name} ${slip.employee.last_name}",${slip.employee.job_title},${slip.employee.department},${slip.gross_pay},${slip.total_recoveries},${slip.net_pay}\n`;
    });
    
    return csv;
  };
  
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadSinglePaySlip = (paySlip) => {
    const employee = employees.find(emp => emp.id === paySlip.employee_id);
    const payrollRun = payrollRuns.find(run => run.id === paySlip.payroll_run_id);
    
    // Simulate PDF generation for single pay slip
    console.log('Generating single pay slip PDF:', { paySlip, employee, payrollRun });
    alert(`Downloaded pay slip for ${employee?.first_name} ${employee?.last_name}`);
  };

  const handleBulkSalaryEntry = async (bulkData) => {
    try {
      const { payroll_run_id, salary_entries } = bulkData;
      
      // Process bulk salary entries
      const newEntries = [];
      salary_entries.forEach(entry => {
        const newEntry = {
          id: salaryEntries.length + newEntries.length + 1,
          employee_id: entry.employee_id,
          payroll_run_id: payroll_run_id,
          earnings: entry.earnings,
          recoveries: entry.recoveries
        };
        newEntries.push(newEntry);
      });
      
      setSalaryEntries([...salaryEntries, ...newEntries]);
      alert(`Successfully added salary entries for ${newEntries.length} employees`);
      
    } catch (error) {
      console.error('Error with bulk salary entry:', error);
      alert('Error processing bulk salary entries. Please try again.');
    }
  };

  // Enhanced payroll calculation functions
  const calculateEarningGroupTotals = (groupId, type = 'monthly', year = null, month = null) => {
    let filteredPaySlips = paySlips;
    
    if (type === 'monthly' && year && month) {
      const targetRuns = payrollRuns.filter(run => run.year === year && run.month === month && run.status === 'COMPLETED');
      filteredPaySlips = paySlips.filter(slip => targetRuns.some(run => run.id === slip.payroll_run_id));
    } else if (type === 'yearly' && year) {
      const targetRuns = payrollRuns.filter(run => run.year === year && run.status === 'COMPLETED');
      filteredPaySlips = paySlips.filter(slip => targetRuns.some(run => run.id === slip.payroll_run_id));
    }
    
    const earningGroup = earningGroups.find(group => group.id === groupId);
    if (!earningGroup) return 0;
    
    return filteredPaySlips.reduce((sum, slip) => {
      const earning = slip.earnings?.find(e => e.earning_name === earningGroup.name);
      return sum + (earning?.amount || 0);
    }, 0);
  };
  
  const calculateRecoveryGroupTotals = (groupId, type = 'monthly', year = null, month = null) => {
    let filteredPaySlips = paySlips;
    
    if (type === 'monthly' && year && month) {
      const targetRuns = payrollRuns.filter(run => run.year === year && run.month === month && run.status === 'COMPLETED');
      filteredPaySlips = paySlips.filter(slip => targetRuns.some(run => run.id === slip.payroll_run_id));
    } else if (type === 'yearly' && year) {
      const targetRuns = payrollRuns.filter(run => run.year === year && run.status === 'COMPLETED');
      filteredPaySlips = paySlips.filter(slip => targetRuns.some(run => run.id === slip.payroll_run_id));
    }
    
    const recoveryGroup = recoveryGroups.find(group => group.id === groupId);
    if (!recoveryGroup) return 0;
    
    return filteredPaySlips.reduce((sum, slip) => {
      const recovery = slip.recoveries?.find(r => r.recovery_name === recoveryGroup.name);
      return sum + (recovery?.amount || 0);
    }, 0);
  };
  
  const calculateTotalEarningsWithoutGroups = (type = 'monthly', year = null, month = null) => {
    let filteredPaySlips = paySlips;
    
    if (type === 'monthly' && year && month) {
      const targetRuns = payrollRuns.filter(run => run.year === year && run.month === month && run.status === 'COMPLETED');
      filteredPaySlips = paySlips.filter(slip => targetRuns.some(run => run.id === slip.payroll_run_id));
    } else if (type === 'yearly' && year) {
      const targetRuns = payrollRuns.filter(run => run.year === year && run.status === 'COMPLETED');
      filteredPaySlips = paySlips.filter(slip => targetRuns.some(run => run.id === slip.payroll_run_id));
    }
    
    return filteredPaySlips.reduce((sum, slip) => sum + slip.gross_pay, 0);
  };
  
  const calculateTotalRecoveriesWithoutGroups = (type = 'monthly', year = null, month = null) => {
    let filteredPaySlips = paySlips;
    
    if (type === 'monthly' && year && month) {
      const targetRuns = payrollRuns.filter(run => run.year === year && run.month === month && run.status === 'COMPLETED');
      filteredPaySlips = paySlips.filter(slip => targetRuns.some(run => run.id === slip.payroll_run_id));
    } else if (type === 'yearly' && year) {
      const targetRuns = payrollRuns.filter(run => run.year === year && run.status === 'COMPLETED');
      filteredPaySlips = paySlips.filter(slip => targetRuns.some(run => run.id === slip.payroll_run_id));
    }
    
    return filteredPaySlips.reduce((sum, slip) => sum + slip.total_recoveries, 0);
  };
  
  // Enhanced calculation functions for yearly averages
  const calculateEarningGroupYearlyAverage = (groupId, year) => {
    const completedMonths = payrollRuns.filter(run => 
      run.year === year && run.status === 'COMPLETED'
    ).map(run => run.month);
    
    if (completedMonths.length === 0) return 0;
    
    const totalForYear = calculateEarningGroupTotals(groupId, 'yearly', year);
    return totalForYear / completedMonths.length;
  };
  
  const calculateRecoveryGroupYearlyAverage = (groupId, year) => {
    const completedMonths = payrollRuns.filter(run => 
      run.year === year && run.status === 'COMPLETED'
    ).map(run => run.month);
    
    if (completedMonths.length === 0) return 0;
    
    const totalForYear = calculateRecoveryGroupTotals(groupId, 'yearly', year);
    return totalForYear / completedMonths.length;
  };

  // Enhanced sorting functions for groups (defined after calculation functions)
  const getSortedEarningGroups = () => {
    let groups = earningGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Add calculated totals to each group
    groups = groups.map(group => ({
      ...group,
      monthlySpecificTotal: calculateEarningGroupTotals(group.id, 'monthly', earningGroupFilterYear, earningGroupFilterMonth),
      yearlySpecificTotal: calculateEarningGroupTotals(group.id, 'yearly', earningGroupFilterYear),
      yearlyAverage: calculateEarningGroupYearlyAverage(group.id, earningGroupFilterYear)
    }));
    
    // Sort based on selected criteria
    groups.sort((a, b) => {
      let aValue, bValue;
      
      switch (earningGroupSortBy) {
        case 'monthlySpecific':
          aValue = a.monthlySpecificTotal;
          bValue = b.monthlySpecificTotal;
          break;
        case 'yearlySpecific':
          aValue = a.yearlySpecificTotal;
          bValue = b.yearlySpecificTotal;
          break;
        case 'yearlyAverage':
          aValue = a.yearlyAverage;
          bValue = b.yearlyAverage;
          break;
        case 'code':
          aValue = a.code.toLowerCase();
          bValue = b.code.toLowerCase();
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }
      
      if (typeof aValue === 'string') {
        return earningGroupSortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return earningGroupSortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
    
    return groups;
  };
  
  const getSortedRecoveryGroups = () => {
    let groups = recoveryGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Add calculated totals to each group
    groups = groups.map(group => ({
      ...group,
      monthlySpecificTotal: calculateRecoveryGroupTotals(group.id, 'monthly', recoveryGroupFilterYear, recoveryGroupFilterMonth),
      yearlySpecificTotal: calculateRecoveryGroupTotals(group.id, 'yearly', recoveryGroupFilterYear),
      yearlyAverage: calculateRecoveryGroupYearlyAverage(group.id, recoveryGroupFilterYear)
    }));
    
    // Sort based on selected criteria
    groups.sort((a, b) => {
      let aValue, bValue;
      
      switch (recoveryGroupSortBy) {
        case 'monthlySpecific':
          aValue = a.monthlySpecificTotal;
          bValue = b.monthlySpecificTotal;
          break;
        case 'yearlySpecific':
          aValue = a.yearlySpecificTotal;
          bValue = b.yearlySpecificTotal;
          break;
        case 'yearlyAverage':
          aValue = a.yearlyAverage;
          bValue = b.yearlyAverage;
          break;
        case 'code':
          aValue = a.code.toLowerCase();
          bValue = b.code.toLowerCase();
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }
      
      if (typeof aValue === 'string') {
        return recoveryGroupSortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return recoveryGroupSortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
    
    return groups;
  };

  // Use React useMemo to ensure proper dependency handling
  const filteredEarningGroups = useMemo(() => {
    return getSortedEarningGroups();
  }, [earningGroups, searchTerm, earningGroupSortBy, earningGroupSortOrder, earningGroupFilterMonth, earningGroupFilterYear, paySlips, payrollRuns]);
  
  const filteredRecoveryGroups = useMemo(() => {
    return getSortedRecoveryGroups();
  }, [recoveryGroups, searchTerm, recoveryGroupSortBy, recoveryGroupSortOrder, recoveryGroupFilterMonth, recoveryGroupFilterYear, paySlips, payrollRuns]);

  // Calculate enhanced dashboard stats
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  
  const completedPayrollsThisYear = payrollRuns.filter(run => run.year === currentYear && run.status === 'COMPLETED');
  const averageMonthlyPayroll = completedPayrollsThisYear.length > 0 
    ? completedPayrollsThisYear.reduce((sum, run) => sum + run.total_net_pay, 0) / completedPayrollsThisYear.length
    : 0;
  
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.status === 'ACTIVE').length,
    inactiveEmployees: employees.filter(emp => emp.status === 'INACTIVE').length,
    terminatedEmployees: employees.filter(emp => emp.status === 'TERMINATED').length,
    lastMonthPayroll: payrollRuns
      .filter(run => run.year === lastMonthYear && run.month === lastMonth && run.status === 'COMPLETED')
      .reduce((sum, run) => sum + run.total_net_pay, 0),
    averageMonthlyPayroll: averageMonthlyPayroll,
    totalEarningGroups: earningGroups.filter(group => group.status === 'ACTIVE').length,
    totalRecoveryGroups: recoveryGroups.filter(group => group.status === 'ACTIVE').length,
    pendingPayrolls: payrollRuns.filter(run => run.status === 'DRAFT').length,
    processingPayrolls: payrollRuns.filter(run => run.status === 'PROCESSING').length,
    completedPayrolls: payrollRuns.filter(run => run.status === 'COMPLETED').length,
    monthlyEarnings: earningGroups.reduce((sum, group) => sum + (group.monthly_total || 0), 0),
    monthlyRecoveries: recoveryGroups.reduce((sum, group) => sum + (group.monthly_total || 0), 0),
    yearlyEarnings: earningGroups.reduce((sum, group) => sum + (group.yearly_total || 0), 0),
    yearlyRecoveries: recoveryGroups.reduce((sum, group) => sum + (group.yearly_total || 0), 0)
  };

  // Payroll Run Processing Modal Component
  const PayrollProcessModal = ({ isOpen, onClose, payrollRun }) => {
    const [processing, setProcessing] = useState(false);

    const handleProcess = async () => {
      setProcessing(true);
      await handleProcessPayroll(payrollRun);
      setProcessing(false);
      onClose();
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Process Payroll Run" size="md">
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Confirm Payroll Processing
                </h4>
                <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                  This action will process the payroll for {payrollRun?.month_name} {payrollRun?.year} 
                  and generate pay slips for all employees. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Payroll Summary</h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>Payroll Run ID: <span className="font-medium">{payrollRun?.payroll_run_id}</span></p>
              <p>Period: <span className="font-medium">{payrollRun?.month_name} {payrollRun?.year}</span></p>
              <p>Total Employees: <span className="font-medium">{payrollRun?.total_employees}</span></p>
              <p>Total Gross Pay: <span className="font-medium">{formatCurrency(payrollRun?.total_gross_pay)}</span></p>
              <p>Total Net Pay: <span className="font-medium">{formatCurrency(payrollRun?.total_net_pay)}</span></p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={processing}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleProcess} 
              loading={processing}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Process Payroll'}
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  // Employee Payroll History Modal Component
  const EmployeePayrollHistoryModal = ({ isOpen, onClose, employee }) => {
    if (!employee) return null;
    
    const employeeHistory = getEmployeePayrollHistory(employee.id);
    
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Payroll History - ${employee.first_name} ${employee.last_name}`} size="xl">
        <div className="space-y-6">
          {/* Employee Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Employee ID</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{employee.employee_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Job Title</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{employee.job_title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Pay Slips</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{employeeHistory.length}</p>
              </div>
            </div>
          </div>
          
          {/* History Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(employeeHistory.reduce((sum, slip) => sum + slip.gross_pay, 0))}
              </div>
              <div className="text-sm text-green-600">Total Gross Pay</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(employeeHistory.reduce((sum, slip) => sum + slip.total_recoveries, 0))}
              </div>
              <div className="text-sm text-red-600">Total Recoveries</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(employeeHistory.reduce((sum, slip) => sum + slip.net_pay, 0))}
              </div>
              <div className="text-sm text-blue-600">Total Net Pay</div>
            </div>
          </div>
          
          {/* History Table */}
          {employeeHistory.length > 0 ? (
            <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Pay Slip ID</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Recoveries</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeHistory.map((slip) => (
                    <TableRow key={slip.id}>
                      <TableCell>
                        {slip.payrollRun?.month_name} {slip.payrollRun?.year}
                      </TableCell>
                      <TableCell className="font-medium">
                        {slip.pay_slip_id}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(slip.gross_pay)}
                      </TableCell>
                      <TableCell className="font-medium text-red-600">
                        {formatCurrency(slip.total_recoveries)}
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {formatCurrency(slip.net_pay)}
                      </TableCell>
                      <TableCell>{getStatusBadge(slip.payment_status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              handleViewPaySlip(slip);
                              onClose();
                            }}
                            title="View Pay Slip"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDownloadSinglePaySlip(slip)}
                            title="Download Pay Slip"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No payroll history found for this employee.</p>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  // Bulk Salary Entry Modal Component
  const BulkSalaryModal = ({ isOpen, onClose }) => {
    const [selectedPayrollRun, setSelectedPayrollRun] = useState('');
    const [csvData, setCsvData] = useState('');

    const handleBulkSubmit = () => {
      if (!selectedPayrollRun || !csvData.trim()) {
        alert('Please select a payroll run and enter CSV data');
        return;
      }

      // Parse CSV data (simplified)
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',');
      const entries = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const entry = {
          employee_id: parseInt(values[0]),
          earnings: [
            { earning_group_id: 1, amount: parseFloat(values[1]) || 0 },
            { earning_group_id: 4, amount: parseFloat(values[2]) || 0 }
          ],
          recoveries: [
            { recovery_group_id: 1, amount: parseFloat(values[3]) || 0 },
            { recovery_group_id: 2, amount: parseFloat(values[4]) || 0 }
          ]
        };
        entries.push(entry);
      }

      handleBulkSalaryEntry({
        payroll_run_id: parseInt(selectedPayrollRun),
        salary_entries: entries
      });

      setCsvData('');
      setSelectedPayrollRun('');
      onClose();
    };

    const draftPayrollRuns = payrollRuns.filter(run => run.status === 'DRAFT');

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Bulk Salary Entry" size="lg">
        <div className="space-y-4">
          <Select
            label="Select Payroll Run"
            value={selectedPayrollRun}
            onChange={(e) => setSelectedPayrollRun(e.target.value)}
            options={draftPayrollRuns.map(run => ({
              value: run.id,
              label: `${run.payroll_run_id} - ${run.month_name} ${run.year}`
            }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CSV Data
            </label>
            <textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="employee_id,basic_salary,transport_allowance,income_tax,epf
1,6000,750,1087.50,480
2,6500,500,1155,520"
            />
            <p className="mt-1 text-sm text-gray-500">
              Format: employee_id,basic_salary,transport_allowance,income_tax,epf
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleBulkSubmit}>
              Process Bulk Entry
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading HR & Payroll Management...</p>
        </div>
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
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-4 text-2xl font-bold text-blue-600 dark:text-blue-400">
                HR and Payroll Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search employees, payrolls, groups..."
                className="w-80"
              />
              <Button variant="secondary">
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Export Reports
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <Tabs defaultTab="dashboard" onChange={setActiveTab}>
          {/* Enhanced Dashboard Tab */}
          <TabPanel id="dashboard" label="Dashboard">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Dashboard Overview
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Comprehensive view of HR and payroll statistics
                </p>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Total Employees"
                  value={stats.totalEmployees}
                  icon={UsersIcon}
                  color="blue"
                  trend="up"
                  trendValue="2 this month"
                />
                <StatsCard
                  title="Active Employees"
                  value={stats.activeEmployees}
                  icon={UserGroupIcon}
                  color="green"
                />
                <StatsCard
                  title="Last Month Payroll"
                  value={formatCurrency(stats.lastMonthPayroll)}
                  icon={CurrencyDollarIcon}
                  color="purple"
                  trend="up"
                  trendValue={`${getMonthName(lastMonth)} ${lastMonthYear}`}
                />
                <StatsCard
                  title="Average Monthly Payroll"
                  value={formatCurrency(stats.averageMonthlyPayroll)}
                  icon={BanknotesIcon}
                  color="yellow"
                  trend="up"
                  trendValue={`${completedPayrollsThisYear.length} months this year`}
                />
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                <StatsCard
                  title="Earning Groups"
                  value={stats.totalEarningGroups}
                  icon={ChartBarIcon}
                  color="green"
                />
                <StatsCard
                  title="Recovery Groups"
                  value={stats.totalRecoveryGroups}
                  icon={ClipboardDocumentListIcon}
                  color="red"
                />
                <StatsCard
                  title="Pending Payrolls"
                  value={stats.pendingPayrolls}
                  icon={CalendarIcon}
                  color="yellow"
                />
                <StatsCard
                  title="Processing"
                  value={stats.processingPayrolls}
                  icon={ArrowPathIcon}
                  color="blue"
                />
                <StatsCard
                  title="Completed"
                  value={stats.completedPayrolls}
                  icon={CheckCircleIcon}
                  color="green"
                />
                <StatsCard
                  title="Inactive Employees"
                  value={stats.inactiveEmployees}
                  icon={ExclamationTriangleIcon}
                  color="red"
                />
              </div>

              {/* Enhanced Summary Cards for Sorting */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Current Month Earnings</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(calculateTotalEarningsWithoutGroups('monthly', currentYear, currentMonth))}
                  </div>
                  <p className="text-xs text-gray-500">{getMonthName(currentMonth)} {currentYear}</p>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Current Month Recoveries</h4>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(calculateTotalRecoveriesWithoutGroups('monthly', currentYear, currentMonth))}
                  </div>
                  <p className="text-xs text-gray-500">{getMonthName(currentMonth)} {currentYear}</p>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Year-to-Date Earnings</h4>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(calculateTotalEarningsWithoutGroups('yearly', currentYear))}
                  </div>
                  <p className="text-xs text-gray-500">{currentYear} Total</p>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Year-to-Date Recoveries</h4>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(calculateTotalRecoveriesWithoutGroups('yearly', currentYear))}
                  </div>
                  <p className="text-xs text-gray-500">{currentYear} Total</p>
                </Card>
              </div>

              {/* Dashboard Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Recent Payroll Runs */}
                <Card>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Recent Payroll Runs
                      </h3>
                      <Button size="sm" variant="ghost" onClick={() => setActiveTab('payrollRuns')}>
                        View All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {payrollRuns.slice(0, 5).map((run) => (
                        <div key={run.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {run.payroll_run_id}
                            </p>
                            <p className="text-sm text-gray-500">
                              {run.month_name} {run.year} • {run.total_employees} employees
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(run.status)}
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                              {formatCurrency(run.total_net_pay)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Employee Distribution */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Employee Distribution
                    </h3>
                    <div className="space-y-4">
                      {departments.map((dept) => {
                        const deptEmployees = employees.filter(emp => emp.department_id === dept.id);
                        const percentage = employees.length > 0 ? (deptEmployees.length / employees.length) * 100 : 0;
                        
                        return (
                          <div key={dept.id}>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">{dept.name}</span>
                              <span className="font-medium">{deptEmployees.length}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Earning and Recovery Groups Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Top Earning Groups
                      </h3>
                      <Button size="sm" variant="ghost" onClick={() => setActiveTab('earningGroups')}>
                        Manage
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {earningGroups
                        .filter(group => group.status === 'ACTIVE')
                        .sort((a, b) => (b.monthly_total || 0) - (a.monthly_total || 0))
                        .slice(0, 5)
                        .map((group) => (
                          <div key={group.id} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {group.name}
                              </p>
                              <p className="text-sm text-gray-500">{group.code}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-green-600">
                                {formatCurrency(group.monthly_total || 0)}
                              </p>
                              <p className="text-xs text-gray-500">this month</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Top Recovery Groups
                      </h3>
                      <Button size="sm" variant="ghost" onClick={() => setActiveTab('recoveryGroups')}>
                        Manage
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {recoveryGroups
                        .filter(group => group.status === 'ACTIVE')
                        .sort((a, b) => (b.monthly_total || 0) - (a.monthly_total || 0))
                        .slice(0, 5)
                        .map((group) => (
                          <div key={group.id} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {group.name}
                              </p>
                              <p className="text-sm text-gray-500">{group.code}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-red-600">
                                {formatCurrency(group.monthly_total || 0)}
                              </p>
                              <p className="text-xs text-gray-500">this month</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </TabPanel>

          {/* Enhanced Employee List Tab */}
          <TabPanel id="employees" label="Employee List">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Employee Management
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Manage employee information and records ({filteredEmployees.length} employees)
                  </p>
                </div>
                <Button onClick={() => setShowEmployeeForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Employee
                </Button>
              </div>

              {/* Employee Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.activeEmployees}</div>
                  <div className="text-sm text-green-600">Active</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.inactiveEmployees}</div>
                  <div className="text-sm text-yellow-600">Inactive</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.terminatedEmployees}</div>
                  <div className="text-sm text-red-600">Terminated</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{departments.length}</div>
                  <div className="text-sm text-blue-600">Departments</div>
                </div>
              </div>

              <Card>
                <div className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            {employee.employee_id}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {employee.first_name} {employee.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Joined: {formatDate(employee.joining_date)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{employee.job_title}</TableCell>
                          <TableCell>
                            <Badge variant="info">{employee.department}</Badge>
                          </TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.phone}</TableCell>
                          <TableCell>{getStatusBadge(employee.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1 relative">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditEmployee(employee)}
                                title="Edit Employee"
                                className="relative z-10"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteEmployee(employee.id)}
                                title="Delete Employee"
                                className="relative z-10"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Enhanced Payroll Runs Tab */}
          <TabPanel id="payrollRuns" label="Payroll Runs">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Monthly Payroll Runs
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Process monthly payroll for employees ({filteredPayrollRuns.length} runs)
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="secondary"
                    onClick={() => setShowBulkSalaryModal(true)}
                  >
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    Bulk Entry
                  </Button>
                  <Button onClick={() => setShowPayrollRunForm(true)}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    New Payroll Run
                  </Button>
                </div>
              </div>

              {/* Payroll Status Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{stats.pendingPayrolls}</div>
                  <div className="text-sm text-gray-600">Draft</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.processingPayrolls}</div>
                  <div className="text-sm text-yellow-600">Processing</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.completedPayrolls}</div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
              </div>

              <Card>
                <div className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payroll Run ID</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Employees</TableHead>
                        <TableHead>Total Gross Pay</TableHead>
                        <TableHead>Total Net Pay</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayrollRuns.map((run) => (
                        <TableRow key={run.id}>
                          <TableCell className="font-medium">
                            {run.payroll_run_id}
                          </TableCell>
                          <TableCell>
                            {run.month_name} {run.year}
                          </TableCell>
                          <TableCell>{formatDate(run.payment_date)}</TableCell>
                          <TableCell>{run.total_employees}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(run.total_gross_pay)}
                          </TableCell>
                          <TableCell className="font-medium text-green-600">
                            {formatCurrency(run.total_net_pay)}
                          </TableCell>
                          <TableCell>{getStatusBadge(run.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1 relative">
                              {run.status === 'DRAFT' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedPayrollRun(run);
                                    setShowPayrollProcessModal(true);
                                  }}
                                  disabled={processingPayroll}
                                  title="Process Payroll"
                                  className="relative z-10"
                                >
                                  <PlayIcon className="w-4 h-4" />
                                </Button>
                              )}
                              {run.status === 'COMPLETED' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDownloadAllPaySlips(run)}
                                  title="Download All Pay Slips"
                                  className="relative z-10"
                                >
                                  <ArrowDownTrayIcon className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  console.log('Viewing payroll details:', run);
                                  alert(`Viewing details for ${run.payroll_run_id}`);
                                }}
                                title="View Details"
                                className="relative z-10"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                disabled={run.status === 'COMPLETED'}
                                title={run.status === 'COMPLETED' ? 'Cannot edit completed payroll' : 'Edit Payroll'}
                                className="relative z-10"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Enhanced Salary Management Tab */}
          <TabPanel id="salaryManagement" label="Salary Management">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Salary Management
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Enter and manage employee salaries for payroll runs
                </p>
              </div>

              {/* Period Selection */}
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-100">
                      Select Payroll Period
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Choose the month and year for salary entry
                    </p>
                  </div>
                  <div className="flex space-x-3 ml-auto">
                    <select
                      value={payrollProcessingMonth}
                      onChange={(e) => setPayrollProcessingMonth(parseInt(e.target.value))}
                      className="px-3 py-2 border border-blue-300 rounded-lg bg-white text-blue-900"
                    >
                      {generateMonthOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={payrollProcessingYear}
                      onChange={(e) => setPayrollProcessingYear(parseInt(e.target.value))}
                      className="px-3 py-2 border border-blue-300 rounded-lg bg-white text-blue-900"
                    >
                      {generateYearOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Salary Entry Interface */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Employees for Salary Entry */}
                <Card>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Active Employees
                      </h3>
                      <Badge variant="info">
                        {employees.filter(emp => emp.status === 'ACTIVE').length} employees
                      </Badge>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {employees
                        .filter(emp => emp.status === 'ACTIVE')
                        .map((employee) => {
                          const draftRun = payrollRuns.find(r => 
                            r.status === 'DRAFT' && 
                            r.month === payrollProcessingMonth && 
                            r.year === payrollProcessingYear
                          );
                          
                          const hasEntry = salaryEntries.some(entry => 
                            entry.employee_id === employee.id && 
                            entry.payroll_run_id === draftRun?.id
                          );

                          return (
                            <div
                              key={employee.id}
                              className={`flex justify-between items-center p-3 border rounded-lg ${
                                hasEntry 
                                  ? 'border-green-200 bg-green-50 dark:border-green-600 dark:bg-green-900/20'
                                  : 'border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {employee.first_name} {employee.last_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {employee.employee_id} • {employee.job_title}
                                </p>
                                <p className="text-sm text-blue-600">
                                  {employee.department}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {hasEntry && (
                                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                )}
                                <Button
                                  size="sm"
                                  variant={hasEntry ? 'secondary' : 'primary'}
                                  onClick={() => handleSalaryEntry(employee, draftRun)}
                                  disabled={!draftRun}
                                >
                                  {hasEntry ? 'Edit Salary' : 'Enter Salary'}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </Card>

                {/* Payroll Run Status */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Payroll Run Status
                    </h3>
                    
                    {(() => {
                      const currentRun = payrollRuns.find(run => 
                        run.month === payrollProcessingMonth && 
                        run.year === payrollProcessingYear
                      );

                      if (!currentRun) {
                        return (
                          <div className="text-center py-8">
                            <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              No payroll run found for {getMonthName(payrollProcessingMonth)} {payrollProcessingYear}
                            </p>
                            <Button onClick={() => setShowPayrollRunForm(true)}>
                              Create Payroll Run
                            </Button>
                          </div>
                        );
                      }

                      const entriesCount = salaryEntries.filter(entry => entry.payroll_run_id === currentRun.id).length;
                      const totalEmployees = employees.filter(emp => emp.status === 'ACTIVE').length;

                      return (
                        <div className="space-y-4">
                          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {currentRun.payroll_run_id}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {currentRun.month_name} {currentRun.year}
                                </p>
                              </div>
                              {getStatusBadge(currentRun.status)}
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Payment Date: {formatDate(currentRun.payment_date)}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Salary Entries:</span>
                              <span className="font-medium">{entriesCount} / {totalEmployees}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${totalEmployees > 0 ? (entriesCount / totalEmployees) * 100 : 0}%` }}
                              ></div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="text-lg font-bold text-green-600">
                                  {formatCurrency(currentRun.total_gross_pay)}
                                </div>
                                <div className="text-sm text-green-600">Gross Pay</div>
                              </div>
                              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="text-lg font-bold text-blue-600">
                                  {formatCurrency(currentRun.total_net_pay)}
                                </div>
                                <div className="text-sm text-blue-600">Net Pay</div>
                              </div>
                            </div>

                            {currentRun.status === 'DRAFT' && entriesCount === totalEmployees && (
                              <Button
                                className="w-full mt-4"
                                onClick={() => {
                                  setSelectedPayrollRun(currentRun);
                                  setShowPayrollProcessModal(true);
                                }}
                              >
                                <PlayIcon className="w-5 h-5 mr-2" />
                                Process Payroll
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </Card>
              </div>
            </motion.div>
          </TabPanel>

          {/* Enhanced Earning Groups Tab */}
          <TabPanel id="earningGroups" label="Earning Groups">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      Earning Groups
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Manage earning types and categories ({filteredEarningGroups.length} groups)
                    </p>
                  </div>
                  <Button onClick={() => setShowEarningGroupForm(true)}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Earning Group
                  </Button>
                </div>
                
                {/* Advanced Sorting and Filtering Controls */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
                    Sorting & Filtering Options
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                        Sort By
                      </label>
                      <select
                        value={earningGroupSortBy}
                        onChange={(e) => setEarningGroupSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-100 text-sm"
                      >
                        <option value="name">Name</option>
                        <option value="code">Code</option>
                        <option value="monthlySpecific">Monthly Total (Selected)</option>
                        <option value="yearlySpecific">Yearly Total (Selected)</option>
                        <option value="yearlyAverage">Monthly Average (Selected Year)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                        Order
                      </label>
                      <select
                        value={earningGroupSortOrder}
                        onChange={(e) => setEarningGroupSortOrder(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-100 text-sm"
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                        Filter Month
                      </label>
                      <select
                        value={earningGroupFilterMonth}
                        onChange={(e) => setEarningGroupFilterMonth(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-100 text-sm"
                      >
                        {generateMonthOptions().map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                        Filter Year
                      </label>
                      <select
                        value={earningGroupFilterYear}
                        onChange={(e) => setEarningGroupFilterYear(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-100 text-sm"
                      >
                        {generateYearOptions().map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                        View Period
                      </label>
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium pt-2">
                        {getMonthName(earningGroupFilterMonth)} {earningGroupFilterYear}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Earning Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(calculateTotalEarningsWithoutGroups('monthly', earningGroupFilterYear, earningGroupFilterMonth))}
                  </div>
                  <div className="text-xs text-green-600">
                    {getMonthName(earningGroupFilterMonth)} {earningGroupFilterYear} Total
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">
                    {formatCurrency(calculateTotalEarningsWithoutGroups('yearly', earningGroupFilterYear))}
                  </div>
                  <div className="text-xs text-blue-600">{earningGroupFilterYear} Yearly Total</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    {formatCurrency(calculateTotalEarningsWithoutGroups('yearly', earningGroupFilterYear) / Math.max(1, payrollRuns.filter(run => run.year === earningGroupFilterYear && run.status === 'COMPLETED').length))}
                  </div>
                  <div className="text-xs text-purple-600">Monthly Average {earningGroupFilterYear}</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <div className="text-xl font-bold text-yellow-600">
                    {filteredEarningGroups.length}
                  </div>
                  <div className="text-xs text-yellow-600">Active Groups</div>
                </div>
              </div>

              <Card>
                <div className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Taxable</TableHead>
                        <TableHead>
                          <div className="text-center">
                            <div>Period Total</div>
                            <div className="text-xs font-normal text-gray-500">
                              {getMonthName(earningGroupFilterMonth)} {earningGroupFilterYear}
                            </div>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="text-center">
                            <div>Year Total</div>
                            <div className="text-xs font-normal text-gray-500">{earningGroupFilterYear}</div>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="text-center">
                            <div>Monthly Avg</div>
                            <div className="text-xs font-normal text-gray-500">{earningGroupFilterYear}</div>
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEarningGroups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell className="font-medium">{group.code}</TableCell>
                          <TableCell>{group.name}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {group.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant={group.is_taxable ? 'warning' : 'success'}>
                              {group.is_taxable ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-green-600 text-center">
                            {formatCurrency(group.monthlySpecificTotal || 0)}
                          </TableCell>
                          <TableCell className="font-medium text-blue-600 text-center">
                            {formatCurrency(group.yearlySpecificTotal || 0)}
                          </TableCell>
                          <TableCell className="font-medium text-purple-600 text-center">
                            {formatCurrency(group.yearlyAverage || 0)}
                          </TableCell>
                          <TableCell>{getStatusBadge(group.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1 relative">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditEarningGroup(group)}
                                title="Edit Earning Group"
                                className="relative z-10"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteEarningGroup(group.id)}
                                title="Delete Earning Group"
                                className="relative z-10"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Enhanced Recovery Groups Tab */}
          <TabPanel id="recoveryGroups" label="Recovery Groups">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      Recovery Groups
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Manage deduction types and tax categories ({filteredRecoveryGroups.length} groups)
                    </p>
                  </div>
                  <Button onClick={() => setShowRecoveryGroupForm(true)}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Recovery Group
                  </Button>
                </div>
                
                {/* Advanced Sorting and Filtering Controls */}
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-3">
                    Sorting & Filtering Options
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                        Sort By
                      </label>
                      <select
                        value={recoveryGroupSortBy}
                        onChange={(e) => setRecoveryGroupSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-red-300 rounded-lg bg-white dark:bg-gray-700 text-red-900 dark:text-red-100 text-sm"
                      >
                        <option value="name">Name</option>
                        <option value="code">Code</option>
                        <option value="monthlySpecific">Monthly Total (Selected)</option>
                        <option value="yearlySpecific">Yearly Total (Selected)</option>
                        <option value="yearlyAverage">Monthly Average (Selected Year)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                        Order
                      </label>
                      <select
                        value={recoveryGroupSortOrder}
                        onChange={(e) => setRecoveryGroupSortOrder(e.target.value)}
                        className="w-full px-3 py-2 border border-red-300 rounded-lg bg-white dark:bg-gray-700 text-red-900 dark:text-red-100 text-sm"
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                        Filter Month
                      </label>
                      <select
                        value={recoveryGroupFilterMonth}
                        onChange={(e) => setRecoveryGroupFilterMonth(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-red-300 rounded-lg bg-white dark:bg-gray-700 text-red-900 dark:text-red-100 text-sm"
                      >
                        {generateMonthOptions().map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                        Filter Year
                      </label>
                      <select
                        value={recoveryGroupFilterYear}
                        onChange={(e) => setRecoveryGroupFilterYear(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-red-300 rounded-lg bg-white dark:bg-gray-700 text-red-900 dark:text-red-100 text-sm"
                      >
                        {generateYearOptions().map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                        View Period
                      </label>
                      <div className="text-sm text-red-600 dark:text-red-400 font-medium pt-2">
                        {getMonthName(recoveryGroupFilterMonth)} {recoveryGroupFilterYear}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Recovery Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="text-xl font-bold text-red-600">
                    {formatCurrency(calculateTotalRecoveriesWithoutGroups('monthly', recoveryGroupFilterYear, recoveryGroupFilterMonth))}
                  </div>
                  <div className="text-xs text-red-600">
                    {getMonthName(recoveryGroupFilterMonth)} {recoveryGroupFilterYear} Total
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">
                    {formatCurrency(calculateTotalRecoveriesWithoutGroups('yearly', recoveryGroupFilterYear))}
                  </div>
                  <div className="text-xs text-orange-600">{recoveryGroupFilterYear} Yearly Total</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    {formatCurrency(calculateTotalRecoveriesWithoutGroups('yearly', recoveryGroupFilterYear) / Math.max(1, payrollRuns.filter(run => run.year === recoveryGroupFilterYear && run.status === 'COMPLETED').length))}
                  </div>
                  <div className="text-xs text-purple-600">Monthly Average {recoveryGroupFilterYear}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-xl font-bold text-gray-600">
                    {filteredRecoveryGroups.length}
                  </div>
                  <div className="text-xs text-gray-600">Active Groups</div>
                </div>
              </div>

              <Card>
                <div className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>
                          <div className="text-center">
                            <div>Period Total</div>
                            <div className="text-xs font-normal text-gray-500">
                              {getMonthName(recoveryGroupFilterMonth)} {recoveryGroupFilterYear}
                            </div>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="text-center">
                            <div>Year Total</div>
                            <div className="text-xs font-normal text-gray-500">{recoveryGroupFilterYear}</div>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="text-center">
                            <div>Monthly Avg</div>
                            <div className="text-xs font-normal text-gray-500">{recoveryGroupFilterYear}</div>
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecoveryGroups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell className="font-medium">{group.code}</TableCell>
                          <TableCell>{group.name}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {group.description}
                          </TableCell>
                          <TableCell className="font-medium text-red-600 text-center">
                            {formatCurrency(group.monthlySpecificTotal || 0)}
                          </TableCell>
                          <TableCell className="font-medium text-orange-600 text-center">
                            {formatCurrency(group.yearlySpecificTotal || 0)}
                          </TableCell>
                          <TableCell className="font-medium text-purple-600 text-center">
                            {formatCurrency(group.yearlyAverage || 0)}
                          </TableCell>
                          <TableCell>{getStatusBadge(group.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1 relative">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditRecoveryGroup(group)}
                                title="Edit Recovery Group"
                                className="relative z-10"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteRecoveryGroup(group.id)}
                                title="Delete Recovery Group"
                                className="relative z-10"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Enhanced Pay Slips Tab */}
          <TabPanel id="employee-salary-stats" label="Employee Salary Stats">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EmployeeSalaryStats
                employees={employees}
                paySlips={paySlips}
                payrollRuns={payrollRuns}
                onViewPaySlip={handleViewPaySlip}
                onDownloadPaySlip={handleDownloadSinglePaySlip}
              />
            </motion.div>
          </TabPanel>
        </Tabs>
      </main>

      {/* All Modals */}
      <EmployeeForm
        isOpen={showEmployeeForm}
        onClose={() => {
          setShowEmployeeForm(false);
          setSelectedEmployee(null);
        }}
        onSubmit={selectedEmployee ? handleUpdateEmployee : handleAddEmployee}
        employee={selectedEmployee}
        departments={departments}
      />

      <PayrollRunForm
        isOpen={showPayrollRunForm}
        onClose={() => setShowPayrollRunForm(false)}
        onSubmit={handleCreatePayrollRun}
      />

      <EarningGroupForm
        isOpen={showEarningGroupForm}
        onClose={() => {
          setShowEarningGroupForm(false);
          setSelectedEarningGroup(null);
        }}
        onSubmit={selectedEarningGroup ? handleUpdateEarningGroup : handleAddEarningGroup}
        earningGroup={selectedEarningGroup}
      />

      <RecoveryGroupForm
        isOpen={showRecoveryGroupForm}
        onClose={() => {
          setShowRecoveryGroupForm(false);
          setSelectedRecoveryGroup(null);
        }}
        onSubmit={selectedRecoveryGroup ? handleUpdateRecoveryGroup : handleAddRecoveryGroup}
        recoveryGroup={selectedRecoveryGroup}
      />

      <SalaryEntryForm
        isOpen={showSalaryEntryForm}
        onClose={() => {
          setShowSalaryEntryForm(false);
          setSelectedEmployee(null);
          setSelectedPayrollRun(null);
        }}
        onSubmit={handleSaveSalaryEntry}
        employee={selectedEmployee}
        earningGroups={earningGroups}
        recoveryGroups={recoveryGroups}
        payrollRun={selectedPayrollRun}
      />

      <PayrollProcessModal
        isOpen={showPayrollProcessModal}
        onClose={() => {
          setShowPayrollProcessModal(false);
          setSelectedPayrollRun(null);
        }}
        payrollRun={selectedPayrollRun}
      />

      <BulkSalaryModal
        isOpen={showBulkSalaryModal}
        onClose={() => setShowBulkSalaryModal(false)}
      />

      <EmployeePayrollHistoryModal
        isOpen={showEmployeePayrollHistory}
        onClose={() => {
          setShowEmployeePayrollHistory(false);
          setSelectedEmployeeForHistory(null);
        }}
        employee={selectedEmployeeForHistory}
      />

      {showPaySlipPreview && selectedPaySlip && (
        <Modal
          isOpen={showPaySlipPreview}
          onClose={() => {
            setShowPaySlipPreview(false);
            setSelectedPaySlip(null);
          }}
          title="Pay Slip Preview"
          size="xl"
        >
          <PaySlipPreview
            paySlip={selectedPaySlip}
            employee={selectedPaySlip.employee}
            payrollRun={selectedPaySlip.payrollRun}
          />
        </Modal>
      )}
    </div>
  );
};

export default HRPayrollManagement;