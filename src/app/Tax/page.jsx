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
  DocumentTextIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ClockIcon,
  ChartBarIcon,
  BanknotesIcon,
  DocumentDuplicateIcon,
  ScaleIcon,
  BuildingOfficeIcon,
  FolderOpenIcon
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
  TabPanel,
  Alert
} from '../components/Tax/ui/index';

import {
  TaxConfigurationForm,
  TaxAuthorityForm,
  TaxReturnForm,
  TaxExemptionForm,
  TaxPaymentForm
} from '../components/Tax/Forms/index';

import { taxMockData } from '../components/Tax/data/MockData';

const TaxManagement = () => {
  const [activeTab, setActiveTab] = useState('taxConfiguration');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showTaxConfigForm, setShowTaxConfigForm] = useState(false);
  const [showTaxAuthorityForm, setShowTaxAuthorityForm] = useState(false);
  const [showTaxReturnForm, setShowTaxReturnForm] = useState(false);
  const [showTaxExemptionForm, setShowTaxExemptionForm] = useState(false);
  const [showTaxPaymentForm, setShowTaxPaymentForm] = useState(false);
  
  // Selected items for editing
  const [selectedTaxConfig, setSelectedTaxConfig] = useState(null);
  const [selectedTaxAuthority, setSelectedTaxAuthority] = useState(null);
  const [selectedTaxReturn, setSelectedTaxReturn] = useState(null);
  const [selectedTaxExemption, setSelectedTaxExemption] = useState(null);
  const [selectedTaxPayment, setSelectedTaxPayment] = useState(null);
  
  // Data states
  const [taxConfiguration, setTaxConfiguration] = useState([]);
  const [taxAuthorities, setTaxAuthorities] = useState([]);
  const [taxReturns, setTaxReturns] = useState([]);
  const [taxCalculations, setTaxCalculations] = useState([]);
  const [taxAuditTrail, setTaxAuditTrail] = useState([]);
  const [taxExemptions, setTaxExemptions] = useState([]);
  const [internationalTaxCompliance, setInternationalTaxCompliance] = useState([]);
  const [taxPayments, setTaxPayments] = useState([]);
  const [taxReporting, setTaxReporting] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({});

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock data
        setTaxConfiguration(taxMockData.taxConfiguration);
        setTaxAuthorities(taxMockData.taxAuthorities);
        setTaxReturns(taxMockData.taxReturns);
        setTaxCalculations(taxMockData.taxCalculations);
        setTaxAuditTrail(taxMockData.taxAuditTrail);
        setTaxExemptions(taxMockData.taxExemptions);
        setInternationalTaxCompliance(taxMockData.internationalTaxCompliance);
        setTaxPayments(taxMockData.taxPayments);
        setTaxReporting(taxMockData.taxReporting);
        setDashboardMetrics(taxMockData.taxDashboardMetrics);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter functions
  const filteredTaxConfiguration = taxConfiguration.filter(config => 
    config.tax_code_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.tax_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.tax_authority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTaxAuthorities = taxAuthorities.filter(authority =>
    authority.authority_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    authority.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTaxReturns = taxReturns.filter(taxReturn =>
    taxReturn.tax_authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
    taxReturn.return_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTaxExemptions = taxExemptions.filter(exemption =>
    exemption.customer_vendor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exemption.exemption_type.toLowerCase().includes(searchTerm.toLowerCase())
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

  const formatPercentage = (rate) => {
    return `${rate}%`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ACTIVE': { variant: 'success', label: 'Active' },
      'INACTIVE': { variant: 'warning', label: 'Inactive' },
      'PENDING': { variant: 'warning', label: 'Pending' },
      'EXPIRED': { variant: 'danger', label: 'Expired' },
      'DRAFT': { variant: 'info', label: 'Draft' },
      'FILED': { variant: 'success', label: 'Filed' },
      'ACCEPTED': { variant: 'success', label: 'Accepted' },
      'REJECTED': { variant: 'danger', label: 'Rejected' },
      'COMPLETED': { variant: 'success', label: 'Completed' },
      'PROCESSED': { variant: 'info', label: 'Processed' },
      'FAILED': { variant: 'danger', label: 'Failed' },
      'CANCELLED': { variant: 'warning', label: 'Cancelled' },
      'VALID': { variant: 'success', label: 'Valid' },
      'REVOKED': { variant: 'danger', label: 'Revoked' },
      'COMPLIANT': { variant: 'success', label: 'Compliant' },
      'NON_COMPLIANT': { variant: 'danger', label: 'Non-Compliant' },
      'APPROVED': { variant: 'success', label: 'Approved' },
      'CURRENT': { variant: 'success', label: 'Current' }
    };
    
    const config = statusConfig[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRiskBadge = (risk) => {
    const riskConfig = {
      'LOW': { variant: 'success', label: 'Low Risk' },
      'MEDIUM': { variant: 'warning', label: 'Medium Risk' },
      'HIGH': { variant: 'danger', label: 'High Risk' }
    };
    
    const config = riskConfig[risk] || { variant: 'default', label: risk };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // CRUD operations
  const handleAddTaxConfig = async (configData) => {
    try {
      const newConfig = {
        id: taxConfiguration.length + 1,
        tax_code_id: `TAX${String(taxConfiguration.length + 1).padStart(3, '0')}`,
        ...configData
      };
      setTaxConfiguration([...taxConfiguration, newConfig]);
    } catch (error) {
      console.error('Error adding tax configuration:', error);
    }
  };

  const handleAddTaxAuthority = async (authorityData) => {
    try {
      const newAuthority = {
        id: taxAuthorities.length + 1,
        authority_id: `AUTH${String(taxAuthorities.length + 1).padStart(3, '0')}`,
        ...authorityData
      };
      setTaxAuthorities([...taxAuthorities, newAuthority]);
    } catch (error) {
      console.error('Error adding tax authority:', error);
    }
  };

  const handleAddTaxReturn = async (returnData) => {
    try {
      const newReturn = {
        id: taxReturns.length + 1,
        return_id: `RET${String(taxReturns.length + 1).padStart(3, '0')}`,
        ...returnData,
        balance_due_refund: (returnData.total_tax_due || 0) - (returnData.total_tax_paid || 0),
        confirmation_number: null
      };
      setTaxReturns([...taxReturns, newReturn]);
    } catch (error) {
      console.error('Error adding tax return:', error);
    }
  };

  const handleAddTaxExemption = async (exemptionData) => {
    try {
      const newExemption = {
        id: taxExemptions.length + 1,
        exemption_id: `EX${String(taxExemptions.length + 1).padStart(3, '0')}`,
        ...exemptionData
      };
      setTaxExemptions([...taxExemptions, newExemption]);
    } catch (error) {
      console.error('Error adding tax exemption:', error);
    }
  };

  const handleAddTaxPayment = async (paymentData) => {
    try {
      const newPayment = {
        id: taxPayments.length + 1,
        payment_id: `PAY${String(taxPayments.length + 1).padStart(3, '0')}`,
        ...paymentData,
        confirmation_receipt: `RCP${String(taxPayments.length + 1).padStart(3, '0')}.pdf`
      };
      setTaxPayments([...taxPayments, newPayment]);
    } catch (error) {
      console.error('Error adding tax payment:', error);
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
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <ScaleIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-4 text-2xl font-bold text-green-600 dark:text-green-400">
                Tax Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search tax records..."
                className="w-64"
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
        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <StatsCard
            title="Total Tax Collected"
            value={formatCurrency(dashboardMetrics.totalTaxCollected)}
            icon={CurrencyDollarIcon}
            color="green"
            trend="up"
            trendValue="+12%"
          />
          <StatsCard
            title="Tax Paid"
            value={formatCurrency(dashboardMetrics.totalTaxPaid)}
            icon={BanknotesIcon}
            color="blue"
          />
          <StatsCard
            title="Net Tax Position"
            value={formatCurrency(dashboardMetrics.netTaxPosition)}
            icon={ChartBarIcon}
            color="purple"
          />
          <StatsCard
            title="Active Exemptions"
            value={dashboardMetrics.activeExemptions}
            icon={ShieldCheckIcon}
            color="orange"
          />
          <StatsCard
            title="Pending Returns"
            value={dashboardMetrics.pendingReturns}
            icon={DocumentTextIcon}
            color="yellow"
          />
          <StatsCard
            title="Compliance Score"
            value={`${dashboardMetrics.complianceScore}%`}
            icon={CheckCircleIcon}
            color="emerald"
            subtitle="Excellent standing"
          />
        </div>

        {/* Compliance Alert */}
        {dashboardMetrics.nextFilingDue && (
          <Alert variant="warning" className="mb-6">
            <strong>Upcoming Filing Due:</strong> Next tax return is due on {formatDate(dashboardMetrics.nextFilingDue)}. 
            Estimated liability: {formatCurrency(dashboardMetrics.estimatedQuarterlyLiability)}.
          </Alert>
        )}

        {/* Tabs */}
        <Tabs defaultTab="taxConfiguration" onChange={setActiveTab}>
          {/* Tax Configuration */}
          <TabPanel id="taxConfiguration" label="Tax Configuration">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Tax Configuration
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Central configuration for all tax codes used across the system
                  </p>
                </div>
                <Button onClick={() => setShowTaxConfigForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Tax Code
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tax Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Authority</TableHead>
                      <TableHead>Jurisdiction</TableHead>
                      <TableHead>Effective Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTaxConfiguration.map((config) => (
                      <TableRow key={config.id}>
                        <TableCell className="font-medium">
                          {config.tax_code_id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{config.tax_code_name}</div>
                            <div className="text-sm text-gray-500">
                              {config.recoverable_flag && <span className="mr-2">Recoverable</span>}
                              {config.compound_tax_flag && <span>Compound</span>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="info">{config.tax_type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPercentage(config.tax_rate)}
                        </TableCell>
                        <TableCell>{config.tax_authority}</TableCell>
                        <TableCell>
                          <Badge variant="purple">{config.jurisdiction}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(config.effective_start_date)}</div>
                            <div className="text-gray-500">to {formatDate(config.effective_end_date)}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(config.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedTaxConfig(config);
                                setShowTaxConfigForm(true);
                              }}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
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

          {/* Tax Authorities */}
          <TabPanel id="taxAuthorities" label="Tax Authorities">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Tax Authorities
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Manage relationships with various tax authorities
                  </p>
                </div>
                <Button onClick={() => setShowTaxAuthorityForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Authority
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Authority Name</TableHead>
                      <TableHead>Jurisdiction</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Registration</TableHead>
                      <TableHead>Filing Frequency</TableHead>
                      <TableHead>Payment Terms</TableHead>
                      <TableHead>E-Filing</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTaxAuthorities.map((authority) => (
                      <TableRow key={authority.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{authority.authority_name}</div>
                            <div className="text-sm text-gray-500">{authority.contact_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="info">{authority.jurisdiction_type}</Badge>
                        </TableCell>
                        <TableCell>{authority.country}</TableCell>
                        <TableCell className="font-medium">
                          {authority.tax_registration_number}
                        </TableCell>
                        <TableCell>
                          <Badge variant="purple">{authority.filing_frequency}</Badge>
                        </TableCell>
                        <TableCell>{authority.payment_terms.replace('_', ' ')}</TableCell>
                        <TableCell>
                          {authority.electronic_filing_required ? (
                            <Badge variant="success">Required</Badge>
                          ) : (
                            <Badge variant="warning">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(authority.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedTaxAuthority(authority);
                                setShowTaxAuthorityForm(true);
                              }}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
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

          {/* Tax Returns */}
          <TabPanel id="taxReturns" label="Tax Returns">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Tax Returns
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Prepare and track tax returns for various authorities
                  </p>
                </div>
                <Button onClick={() => setShowTaxReturnForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Return
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Return ID</TableHead>
                      <TableHead>Authority</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Filing Period</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Tax Due</TableHead>
                      <TableHead>Tax Paid</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTaxReturns.map((taxReturn) => (
                      <TableRow key={taxReturn.id}>
                        <TableCell className="font-medium">
                          {taxReturn.return_id}
                        </TableCell>
                        <TableCell>{taxReturn.tax_authority}</TableCell>
                        <TableCell>
                          <Badge variant="info">{taxReturn.return_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(taxReturn.filing_period_start)}</div>
                            <div className="text-gray-500">to {formatDate(taxReturn.filing_period_end)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`text-sm ${new Date(taxReturn.due_date) < new Date() ? 'text-red-600' : ''}`}>
                            {formatDate(taxReturn.due_date)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-red-600">
                          {formatCurrency(taxReturn.total_tax_due)}
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(taxReturn.total_tax_paid)}
                        </TableCell>
                        <TableCell className={`font-medium ${taxReturn.balance_due_refund > 0 ? 'text-red-600' : taxReturn.balance_due_refund < 0 ? 'text-green-600' : ''}`}>
                          {formatCurrency(Math.abs(taxReturn.balance_due_refund))}
                          {taxReturn.balance_due_refund < 0 && ' (Refund)'}
                        </TableCell>
                        <TableCell>{getStatusBadge(taxReturn.filing_status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedTaxReturn(taxReturn);
                                setShowTaxReturnForm(true);
                              }}
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

          {/* Tax Calculation Engine */}
          <TabPanel id="taxCalculations" label="Tax Calculation Engine">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Tax Calculation Engine
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Automatically calculate taxes for transactions based on rules
                  </p>
                </div>
                <Button>
                  <CalculatorIcon className="w-5 h-5 mr-2" />
                  Manual Calculation
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Calculation ID</TableHead>
                      <TableHead>Transaction Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Taxable Amount</TableHead>
                      <TableHead>Tax Code</TableHead>
                      <TableHead>Calculated Tax</TableHead>
                      <TableHead>Jurisdiction</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Override</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxCalculations.map((calculation) => (
                      <TableRow key={calculation.id}>
                        <TableCell className="font-medium">
                          {calculation.calculation_id}
                        </TableCell>
                        <TableCell>
                          <Badge variant={calculation.transaction_type === 'SALE' ? 'success' : 'info'}>
                            {calculation.transaction_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(calculation.transaction_date)}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(calculation.taxable_amount)}
                        </TableCell>
                        <TableCell>{calculation.tax_code_applied}</TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(calculation.calculated_tax_amount)}
                        </TableCell>
                        <TableCell>{calculation.tax_jurisdiction}</TableCell>
                        <TableCell>
                          <Badge variant="purple">{calculation.calculation_method}</Badge>
                        </TableCell>
                        <TableCell>
                          {calculation.override_flag ? (
                            <Badge variant="warning">Override</Badge>
                          ) : (
                            <Badge variant="success">Standard</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Tax Reporting Dashboard */}
          <TabPanel id="taxReporting" label="Tax Reporting">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Tax Reporting Dashboard
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Comprehensive tax reporting and analytics
                  </p>
                </div>
                <Button>
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  Generate Report
                </Button>
              </div>

              {/* Reporting Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {taxReporting.map((report) => (
                  <Card key={report.id} className="p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {report.report_period}
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Tax Collected</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(report.tax_collected)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Tax Paid</p>
                          <p className="text-xl font-bold text-red-600">
                            {formatCurrency(report.tax_paid)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Net Position</p>
                          <p className="text-xl font-bold text-blue-600">
                            {formatCurrency(report.net_tax_position)}
                          </p>
                        </div>
                        <div className="pt-2">
                          {getStatusBadge(report.compliance_status)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Detailed Reporting Table */}
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Detailed Tax Analysis
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Compliance Status</TableHead>
                        <TableHead>Outstanding Returns</TableHead>
                        <TableHead>Penalty Assessments</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taxReporting.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.report_period}</TableCell>
                          <TableCell>{getStatusBadge(report.compliance_status)}</TableCell>
                          <TableCell>
                            <Badge variant={report.outstanding_returns > 0 ? 'warning' : 'success'}>
                              {report.outstanding_returns} Returns
                            </Badge>
                          </TableCell>
                          <TableCell className="text-red-600">
                            {formatCurrency(report.penalty_assessments)}
                          </TableCell>
                          <TableCell>{getStatusBadge(report.payment_status)}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost">
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </motion.div>
          </TabPanel>

          {/* Tax Audit Trail */}
          <TabPanel id="taxAuditTrail" label="Tax Audit Trail">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Tax Audit Trail
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Complete audit trail of all tax-related changes
                  </p>
                </div>
                <Button>
                  <FolderOpenIcon className="w-5 h-5 mr-2" />
                  Export Audit Log
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audit ID</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Original Amount</TableHead>
                      <TableHead>Adjusted Amount</TableHead>
                      <TableHead>Adjustment Reason</TableHead>
                      <TableHead>Adjusted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Approval Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxAuditTrail.map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell className="font-medium">
                          {audit.audit_trail_id}
                        </TableCell>
                        <TableCell>{audit.transaction_id}</TableCell>
                        <TableCell className="text-red-600">
                          {formatCurrency(audit.original_tax_amount)}
                        </TableCell>
                        <TableCell className="text-green-600">
                          {formatCurrency(audit.adjusted_tax_amount)}
                        </TableCell>
                        <TableCell>{audit.adjustment_reason}</TableCell>
                        <TableCell>{audit.adjusted_by}</TableCell>
                        <TableCell>{formatDate(audit.adjustment_date)}</TableCell>
                        <TableCell>{getStatusBadge(audit.approval_status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <DocumentDuplicateIcon className="w-4 h-4" />
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

          {/* Tax Exemption Management */}
          <TabPanel id="taxExemptions" label="Tax Exemptions">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Tax Exemption Management
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Manage tax exemptions for customers and vendors
                  </p>
                </div>
                <Button onClick={() => setShowTaxExemptionForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Exemption
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exemption ID</TableHead>
                      <TableHead>Customer/Vendor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Certificate Number</TableHead>
                      <TableHead>Issuing Authority</TableHead>
                      <TableHead>Valid Period</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Geographic Scope</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTaxExemptions.map((exemption) => (
                      <TableRow key={exemption.id}>
                        <TableCell className="font-medium">
                          {exemption.exemption_id}
                        </TableCell>
                        <TableCell>{exemption.customer_vendor_id}</TableCell>
                        <TableCell>
                          <Badge variant="info">{exemption.exemption_type.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {exemption.exemption_certificate_number}
                        </TableCell>
                        <TableCell>{exemption.issuing_authority}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(exemption.valid_from_date)}</div>
                            <div className="text-gray-500">to {formatDate(exemption.valid_to_date)}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPercentage(exemption.exemption_percentage)}
                        </TableCell>
                        <TableCell>{exemption.geographic_scope}</TableCell>
                        <TableCell>{getStatusBadge(exemption.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedTaxExemption(exemption);
                                setShowTaxExemptionForm(true);
                              }}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
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

          {/* International Tax Compliance */}
          <TabPanel id="internationalTax" label="International Tax">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    International Tax Compliance
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Manage compliance with international tax obligations
                  </p>
                </div>
                <Button>
                  <GlobeAltIcon className="w-5 h-5 mr-2" />
                  Add Jurisdiction
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Compliance ID</TableHead>
                      <TableHead>Country/Jurisdiction</TableHead>
                      <TableHead>Tax Treaty</TableHead>
                      <TableHead>Withholding Rate</TableHead>
                      <TableHead>Filing Deadline</TableHead>
                      <TableHead>Local Representative</TableHead>
                      <TableHead>Compliance Status</TableHead>
                      <TableHead>Risk Assessment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {internationalTaxCompliance.map((compliance) => (
                      <TableRow key={compliance.id}>
                        <TableCell className="font-medium">
                          {compliance.compliance_id}
                        </TableCell>
                        <TableCell>{compliance.country_jurisdiction}</TableCell>
                        <TableCell>{compliance.tax_treaty_information}</TableCell>
                        <TableCell className="font-medium">
                          {formatPercentage(compliance.withholding_tax_rates)}
                        </TableCell>
                        <TableCell>{formatDate(compliance.filing_deadlines)}</TableCell>
                        <TableCell>{compliance.local_representative_details}</TableCell>
                        <TableCell>{getStatusBadge(compliance.compliance_status)}</TableCell>
                        <TableCell>{getRiskBadge(compliance.risk_assessment_score)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
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

          {/* Tax Payment Management */}
          <TabPanel id="taxPayments" label="Tax Payments">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Tax Payment Management
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Track all tax payments made to authorities
                  </p>
                </div>
                <Button onClick={() => setShowTaxPaymentForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Record Payment
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Tax Authority</TableHead>
                      <TableHead>Payment Type</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Bank Account</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.payment_id}
                        </TableCell>
                        <TableCell>{payment.tax_authority}</TableCell>
                        <TableCell>
                          <Badge variant="info">{payment.payment_type}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(payment.payment_date)}</TableCell>
                        <TableCell>
                          <Badge variant="purple">{payment.payment_method}</Badge>
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(payment.payment_amount)}
                        </TableCell>
                        <TableCell>{payment.reference_number}</TableCell>
                        <TableCell>{payment.bank_account_used}</TableCell>
                        <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedTaxPayment(payment);
                                setShowTaxPaymentForm(true);
                              }}
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
        </Tabs>
      </main>

      {/* Modals */}
      <TaxConfigurationForm
        isOpen={showTaxConfigForm}
        onClose={() => {
          setShowTaxConfigForm(false);
          setSelectedTaxConfig(null);
        }}
        onSubmit={handleAddTaxConfig}
        taxCode={selectedTaxConfig}
      />

      <TaxAuthorityForm
        isOpen={showTaxAuthorityForm}
        onClose={() => {
          setShowTaxAuthorityForm(false);
          setSelectedTaxAuthority(null);
        }}
        onSubmit={handleAddTaxAuthority}
        authority={selectedTaxAuthority}
      />

      <TaxReturnForm
        isOpen={showTaxReturnForm}
        onClose={() => {
          setShowTaxReturnForm(false);
          setSelectedTaxReturn(null);
        }}
        onSubmit={handleAddTaxReturn}
        taxReturn={selectedTaxReturn}
      />

      <TaxExemptionForm
        isOpen={showTaxExemptionForm}
        onClose={() => {
          setShowTaxExemptionForm(false);
          setSelectedTaxExemption(null);
        }}
        onSubmit={handleAddTaxExemption}
        exemption={selectedTaxExemption}
      />

      <TaxPaymentForm
        isOpen={showTaxPaymentForm}
        onClose={() => {
          setShowTaxPaymentForm(false);
          setSelectedTaxPayment(null);
        }}
        onSubmit={handleAddTaxPayment}
        payment={selectedTaxPayment}
      />
    </div>
  );
};

export default TaxManagement;