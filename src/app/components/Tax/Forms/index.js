'use client';
import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  TrashIcon,
  DocumentIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Modal, Input, Select, Button, Badge, Alert } from '../ui';

// ========== TAX CONFIGURATION FORM ==========
export const TaxConfigurationForm = ({ isOpen, onClose, onSubmit, taxCode = null }) => {
  const [formData, setFormData] = useState({
    tax_code_name: taxCode?.tax_code_name || '',
    tax_type: taxCode?.tax_type || '',
    tax_rate: taxCode?.tax_rate || '',
    tax_authority: taxCode?.tax_authority || '',
    jurisdiction: taxCode?.jurisdiction || '',
    effective_start_date: taxCode?.effective_start_date || '',
    effective_end_date: taxCode?.effective_end_date || '',
    tax_base: taxCode?.tax_base || '',
    compound_tax_flag: taxCode?.compound_tax_flag || false,
    recoverable_flag: taxCode?.recoverable_flag || false,
    status: taxCode?.status || 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (taxCode) {
      setFormData({
        tax_code_name: taxCode.tax_code_name || '',
        tax_type: taxCode.tax_type || '',
        tax_rate: taxCode.tax_rate || '',
        tax_authority: taxCode.tax_authority || '',
        jurisdiction: taxCode.jurisdiction || '',
        effective_start_date: taxCode.effective_start_date || '',
        effective_end_date: taxCode.effective_end_date || '',
        tax_base: taxCode.tax_base || '',
        compound_tax_flag: taxCode.compound_tax_flag || false,
        recoverable_flag: taxCode.recoverable_flag || false,
        status: taxCode.status || 'ACTIVE'
      });
    }
  }, [taxCode]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tax_code_name.trim()) {
      newErrors.tax_code_name = 'Tax code name is required';
    }
    
    if (!formData.tax_type) {
      newErrors.tax_type = 'Tax type is required';
    }
    
    if (!formData.tax_rate || formData.tax_rate < 0 || formData.tax_rate > 100) {
      newErrors.tax_rate = 'Tax rate must be between 0 and 100';
    }
    
    if (!formData.tax_authority.trim()) {
      newErrors.tax_authority = 'Tax authority is required';
    }
    
    if (!formData.jurisdiction) {
      newErrors.jurisdiction = 'Jurisdiction is required';
    }
    
    if (!formData.effective_start_date) {
      newErrors.effective_start_date = 'Effective start date is required';
    }
    
    if (formData.effective_end_date && formData.effective_start_date && 
        new Date(formData.effective_end_date) <= new Date(formData.effective_start_date)) {
      newErrors.effective_end_date = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        tax_code_name: '',
        tax_type: '',
        tax_rate: '',
        tax_authority: '',
        jurisdiction: '',
        effective_start_date: '',
        effective_end_date: '',
        tax_base: '',
        compound_tax_flag: false,
        recoverable_flag: false,
        status: 'ACTIVE'
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const taxTypeOptions = [
    { value: 'VAT', label: 'Value Added Tax (VAT)' },
    { value: 'GST', label: 'Goods and Services Tax (GST)' },
    { value: 'SALES_TAX', label: 'Sales Tax' },
    { value: 'USE_TAX', label: 'Use Tax' },
    { value: 'INCOME_TAX', label: 'Income Tax' },
    { value: 'WITHHOLDING_TAX', label: 'Withholding Tax' },
    { value: 'EXCISE_TAX', label: 'Excise Tax' },
    { value: 'PROPERTY_TAX', label: 'Property Tax' },
    { value: 'DIGITAL_SERVICES_TAX', label: 'Digital Services Tax' }
  ];

  const jurisdictionOptions = [
    { value: 'FEDERAL', label: 'Federal' },
    { value: 'STATE', label: 'State' },
    { value: 'PROVINCIAL', label: 'Provincial' },
    { value: 'LOCAL', label: 'Local' },
    { value: 'MUNICIPAL', label: 'Municipal' },
    { value: 'COUNTY', label: 'County' }
  ];

  const taxBaseOptions = [
    { value: 'GROSS', label: 'Gross Amount' },
    { value: 'NET', label: 'Net Amount' },
    { value: 'EXCLUSIVE', label: 'Tax Exclusive' },
    { value: 'INCLUSIVE', label: 'Tax Inclusive' }
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'PENDING', label: 'Pending Approval' },
    { value: 'EXPIRED', label: 'Expired' },
    { value: 'SUSPENDED', label: 'Suspended' }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={taxCode ? 'Edit Tax Configuration' : 'Add Tax Configuration'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tax Code Name"
              value={formData.tax_code_name}
              onChange={(e) => handleChange('tax_code_name', e.target.value)}
              required
              placeholder="e.g., UK VAT Standard Rate"
              error={errors.tax_code_name}
            />
            
            <Select
              label="Tax Type"
              value={formData.tax_type}
              onChange={(e) => handleChange('tax_type', e.target.value)}
              options={taxTypeOptions}
              required
              error={errors.tax_type}
            />
            
            <Input
              label="Tax Rate (%)"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.tax_rate}
              onChange={(e) => handleChange('tax_rate', e.target.value)}
              required
              placeholder="20.00"
              error={errors.tax_rate}
            />
            
            <Input
              label="Tax Authority"
              value={formData.tax_authority}
              onChange={(e) => handleChange('tax_authority', e.target.value)}
              required
              placeholder="e.g., HM Revenue & Customs"
              error={errors.tax_authority}
            />
          </div>
        </div>

        {/* Jurisdiction & Tax Base */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Jurisdiction & Tax Base
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Jurisdiction"
              value={formData.jurisdiction}
              onChange={(e) => handleChange('jurisdiction', e.target.value)}
              options={jurisdictionOptions}
              required
              error={errors.jurisdiction}
            />
            
            <Select
              label="Tax Base"
              value={formData.tax_base}
              onChange={(e) => handleChange('tax_base', e.target.value)}
              options={taxBaseOptions}
              required
            />
          </div>
        </div>

        {/* Effective Dates */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Effective Period
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Effective Start Date"
              type="date"
              value={formData.effective_start_date}
              onChange={(e) => handleChange('effective_start_date', e.target.value)}
              required
              error={errors.effective_start_date}
            />
            
            <Input
              label="Effective End Date"
              type="date"
              value={formData.effective_end_date}
              onChange={(e) => handleChange('effective_end_date', e.target.value)}
              error={errors.effective_end_date}
            />
          </div>
        </div>

        {/* Tax Flags */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Tax Properties
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.compound_tax_flag}
                    onChange={(e) => handleChange('compound_tax_flag', e.target.checked)}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Compound Tax</span>
                    <p className="text-xs text-gray-500">Tax calculated on tax (tax on tax)</p>
                  </div>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.recoverable_flag}
                    onChange={(e) => handleChange('recoverable_flag', e.target.checked)}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recoverable Tax</span>
                    <p className="text-xs text-gray-500">Tax can be claimed back from authorities</p>
                  </div>
                </label>
              </div>
              
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                options={statusOptions}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {taxCode ? 'Update Tax Code' : 'Create Tax Code'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ========== TAX AUTHORITY FORM ==========
export const TaxAuthorityForm = ({ isOpen, onClose, onSubmit, authority = null }) => {
  const [formData, setFormData] = useState({
    authority_name: authority?.authority_name || '',
    jurisdiction_type: authority?.jurisdiction_type || '',
    country: authority?.country || '',
    tax_registration_number: authority?.tax_registration_number || '',
    contact_email: authority?.contact_email || '',
    contact_phone: authority?.contact_phone || '',
    contact_address: authority?.contact_address || '',
    website_url: authority?.website_url || '',
    filing_frequency: authority?.filing_frequency || '',
    payment_terms: authority?.payment_terms || '',
    electronic_filing_required: authority?.electronic_filing_required || false,
    api_integration_available: authority?.api_integration_available || false,
    status: authority?.status || 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (authority) {
      setFormData({
        authority_name: authority.authority_name || '',
        jurisdiction_type: authority.jurisdiction_type || '',
        country: authority.country || '',
        tax_registration_number: authority.tax_registration_number || '',
        contact_email: authority.contact_email || '',
        contact_phone: authority.contact_phone || '',
        contact_address: authority.contact_address || '',
        website_url: authority.website_url || '',
        filing_frequency: authority.filing_frequency || '',
        payment_terms: authority.payment_terms || '',
        electronic_filing_required: authority.electronic_filing_required || false,
        api_integration_available: authority.api_integration_available || false,
        status: authority.status || 'ACTIVE'
      });
    }
  }, [authority]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.authority_name.trim()) {
      newErrors.authority_name = 'Authority name is required';
    }
    
    if (!formData.jurisdiction_type) {
      newErrors.jurisdiction_type = 'Jurisdiction type is required';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    if (formData.contact_email && !/\S+@\S+\.\S+/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }
    
    if (!formData.filing_frequency) {
      newErrors.filing_frequency = 'Filing frequency is required';
    }
    
    if (!formData.payment_terms) {
      newErrors.payment_terms = 'Payment terms are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const jurisdictionTypeOptions = [
    { value: 'FEDERAL', label: 'Federal' },
    { value: 'STATE', label: 'State' },
    { value: 'PROVINCIAL', label: 'Provincial' },
    { value: 'LOCAL', label: 'Local' },
    { value: 'MUNICIPAL', label: 'Municipal' },
    { value: 'REGIONAL', label: 'Regional' }
  ];

  const filingFrequencyOptions = [
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'QUARTERLY', label: 'Quarterly' },
    { value: 'SEMI_ANNUALLY', label: 'Semi-Annually' },
    { value: 'ANNUALLY', label: 'Annually' },
    { value: 'ON_DEMAND', label: 'On Demand' }
  ];

  const paymentTermsOptions = [
    { value: 'IMMEDIATE', label: 'Immediate' },
    { value: '7_DAYS', label: '7 Days' },
    { value: '15_DAYS', label: '15 Days' },
    { value: '30_DAYS', label: '30 Days' },
    { value: '45_DAYS', label: '45 Days' },
    { value: '60_DAYS', label: '60 Days' },
    { value: '90_DAYS', label: '90 Days' }
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'PENDING', label: 'Pending Setup' },
    { value: 'SUSPENDED', label: 'Suspended' }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={authority ? 'Edit Tax Authority' : 'Add Tax Authority'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Authority Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Authority Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Authority Name"
              value={formData.authority_name}
              onChange={(e) => handleChange('authority_name', e.target.value)}
              required
              placeholder="e.g., Internal Revenue Service"
              error={errors.authority_name}
            />
            
            <Select
              label="Jurisdiction Type"
              value={formData.jurisdiction_type}
              onChange={(e) => handleChange('jurisdiction_type', e.target.value)}
              options={jurisdictionTypeOptions}
              required
              error={errors.jurisdiction_type}
            />
            
            <Input
              label="Country"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              required
              placeholder="e.g., United States"
              error={errors.country}
            />
            
            <Input
              label="Tax Registration Number"
              value={formData.tax_registration_number}
              onChange={(e) => handleChange('tax_registration_number', e.target.value)}
              placeholder="e.g., 123456789"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              placeholder="contact@taxauthority.gov"
              error={errors.contact_email}
            />
            
            <Input
              label="Contact Phone"
              type="tel"
              value={formData.contact_phone}
              onChange={(e) => handleChange('contact_phone', e.target.value)}
              placeholder="+1-800-555-0123"
            />
            
            <Input
              label="Website URL"
              type="url"
              value={formData.website_url}
              onChange={(e) => handleChange('website_url', e.target.value)}
              placeholder="https://www.taxauthority.gov"
            />
            
            <div className="md:col-span-1">
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                options={statusOptions}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Address
              </label>
              <textarea
                value={formData.contact_address}
                onChange={(e) => handleChange('contact_address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Full mailing address..."
              />
            </div>
          </div>
        </div>

        {/* Filing & Payment Terms */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Filing & Payment Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Filing Frequency"
              value={formData.filing_frequency}
              onChange={(e) => handleChange('filing_frequency', e.target.value)}
              options={filingFrequencyOptions}
              required
              error={errors.filing_frequency}
            />
            
            <Select
              label="Payment Terms"
              value={formData.payment_terms}
              onChange={(e) => handleChange('payment_terms', e.target.value)}
              options={paymentTermsOptions}
              required
              error={errors.payment_terms}
            />
          </div>
        </div>

        {/* System Integration */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            System Integration
          </h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.electronic_filing_required}
                onChange={(e) => handleChange('electronic_filing_required', e.target.checked)}
                className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Electronic Filing Required</span>
                <p className="text-xs text-gray-500">This authority requires electronic submission of returns</p>
              </div>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.api_integration_available}
                onChange={(e) => handleChange('api_integration_available', e.target.checked)}
                className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">API Integration Available</span>
                <p className="text-xs text-gray-500">Direct API integration is available for automated filing</p>
              </div>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {authority ? 'Update Authority' : 'Add Authority'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ========== TAX RETURN FORM ==========
export const TaxReturnForm = ({ isOpen, onClose, onSubmit, taxReturn = null }) => {
  const [formData, setFormData] = useState({
    tax_authority: taxReturn?.tax_authority || '',
    return_type: taxReturn?.return_type || '',
    filing_period_start: taxReturn?.filing_period_start || '',
    filing_period_end: taxReturn?.filing_period_end || '',
    due_date: taxReturn?.due_date || '',
    total_tax_due: taxReturn?.total_tax_due || '',
    total_tax_paid: taxReturn?.total_tax_paid || '',
    filing_method: taxReturn?.filing_method || '',
    filing_status: taxReturn?.filing_status || 'DRAFT',
    notes: taxReturn?.notes || ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tax_authority.trim()) {
      newErrors.tax_authority = 'Tax authority is required';
    }
    
    if (!formData.return_type) {
      newErrors.return_type = 'Return type is required';
    }
    
    if (!formData.filing_period_start) {
      newErrors.filing_period_start = 'Filing period start date is required';
    }
    
    if (!formData.filing_period_end) {
      newErrors.filing_period_end = 'Filing period end date is required';
    }
    
    if (formData.filing_period_start && formData.filing_period_end && 
        new Date(formData.filing_period_end) <= new Date(formData.filing_period_start)) {
      newErrors.filing_period_end = 'End date must be after start date';
    }
    
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }
    
    if (!formData.filing_method) {
      newErrors.filing_method = 'Filing method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const returnTypeOptions = [
    { value: 'VAT', label: 'VAT Return' },
    { value: 'GST', label: 'GST Return' },
    { value: 'INCOME_TAX', label: 'Income Tax Return' },
    { value: 'PAYROLL_TAX', label: 'Payroll Tax Return' },
    { value: 'SALES_TAX', label: 'Sales Tax Return' },
    { value: 'USE_TAX', label: 'Use Tax Return' },
    { value: 'EXCISE_TAX', label: 'Excise Tax Return' },
    { value: 'PROPERTY_TAX', label: 'Property Tax Return' }
  ];

  const filingMethodOptions = [
    { value: 'ELECTRONIC', label: 'Electronic Filing' },
    { value: 'PAPER', label: 'Paper Filing' },
    { value: 'ONLINE_PORTAL', label: 'Online Portal' },
    { value: 'API_INTEGRATION', label: 'API Integration' },
    { value: 'THIRD_PARTY', label: 'Third Party Service' }
  ];

  const filingStatusOptions = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'FILED', label: 'Filed' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'AMENDED', label: 'Amended' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  const balanceDueRefund = (formData.total_tax_due || 0) - (formData.total_tax_paid || 0);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={taxReturn ? 'Edit Tax Return' : 'Create Tax Return'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Return Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Return Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tax Authority"
              value={formData.tax_authority}
              onChange={(e) => handleChange('tax_authority', e.target.value)}
              required
              placeholder="e.g., HM Revenue & Customs"
              error={errors.tax_authority}
            />
            
            <Select
              label="Return Type"
              value={formData.return_type}
              onChange={(e) => handleChange('return_type', e.target.value)}
              options={returnTypeOptions}
              required
              error={errors.return_type}
            />
          </div>
        </div>

        {/* Filing Period */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Filing Period
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Period Start Date"
              type="date"
              value={formData.filing_period_start}
              onChange={(e) => handleChange('filing_period_start', e.target.value)}
              required
              error={errors.filing_period_start}
            />
            
            <Input
              label="Period End Date"
              type="date"
              value={formData.filing_period_end}
              onChange={(e) => handleChange('filing_period_end', e.target.value)}
              required
              error={errors.filing_period_end}
            />
            
            <Input
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
              required
              error={errors.due_date}
            />
          </div>
        </div>

        {/* Tax Amounts */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Tax Amounts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Total Tax Due"
              type="number"
              step="0.01"
              min="0"
              value={formData.total_tax_due}
              onChange={(e) => handleChange('total_tax_due', e.target.value)}
              placeholder="0.00"
            />
            
            <Input
              label="Total Tax Paid"
              type="number"
              step="0.01"
              min="0"
              value={formData.total_tax_paid}
              onChange={(e) => handleChange('total_tax_paid', e.target.value)}
              placeholder="0.00"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Balance Due/Refund
              </label>
              <div className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                balanceDueRefund > 0 ? 'bg-red-50 border-red-200 text-red-700' : 
                balanceDueRefund < 0 ? 'bg-green-50 border-green-200 text-green-700' : 
                'bg-gray-50 border-gray-200 text-gray-700'
              }`}>
                {balanceDueRefund > 0 ? `${balanceDueRefund.toFixed(2)} Due` : 
                 balanceDueRefund < 0 ? `${Math.abs(balanceDueRefund).toFixed(2)} Refund` : 
                 '$0.00 Balanced'}
              </div>
            </div>
          </div>
        </div>

        {/* Filing Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Filing Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Filing Method"
              value={formData.filing_method}
              onChange={(e) => handleChange('filing_method', e.target.value)}
              options={filingMethodOptions}
              required
              error={errors.filing_method}
            />
            
            <Select
              label="Filing Status"
              value={formData.filing_status}
              onChange={(e) => handleChange('filing_status', e.target.value)}
              options={filingStatusOptions}
            />
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Additional notes about this tax return..."
              />
            </div>
          </div>
        </div>

        {/* Status Alert */}
        {balanceDueRefund !== 0 && (
          <Alert variant={balanceDueRefund > 0 ? 'warning' : 'success'}>
            {balanceDueRefund > 0 ? (
              <span><strong>Payment Required:</strong> This return has a balance due of ${balanceDueRefund.toFixed(2)}.</span>
            ) : (
              <span><strong>Refund Expected:</strong> This return shows a refund of ${Math.abs(balanceDueRefund).toFixed(2)}.</span>
            )}
          </Alert>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {taxReturn ? 'Update Return' : 'Create Return'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ========== TAX EXEMPTION FORM ==========
export const TaxExemptionForm = ({ isOpen, onClose, onSubmit, exemption = null }) => {
  const [formData, setFormData] = useState({
    customer_vendor_id: exemption?.customer_vendor_id || '',
    customer_vendor_name: exemption?.customer_vendor_name || '',
    exemption_type: exemption?.exemption_type || '',
    exemption_certificate_number: exemption?.exemption_certificate_number || '',
    issuing_authority: exemption?.issuing_authority || '',
    valid_from_date: exemption?.valid_from_date || '',
    valid_to_date: exemption?.valid_to_date || '',
    applicable_tax_types: exemption?.applicable_tax_types || [],
    exemption_percentage: exemption?.exemption_percentage || '100',
    geographic_scope: exemption?.geographic_scope || '',
    supporting_documents: exemption?.supporting_documents || [],
    renewal_reminder_days: exemption?.renewal_reminder_days || '30',
    status: exemption?.status || 'VALID'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customer_vendor_id.trim()) {
      newErrors.customer_vendor_id = 'Customer/Vendor ID is required';
    }
    
    if (!formData.exemption_type) {
      newErrors.exemption_type = 'Exemption type is required';
    }
    
    if (!formData.exemption_certificate_number.trim()) {
      newErrors.exemption_certificate_number = 'Certificate number is required';
    }
    
    if (!formData.issuing_authority.trim()) {
      newErrors.issuing_authority = 'Issuing authority is required';
    }
    
    if (!formData.valid_from_date) {
      newErrors.valid_from_date = 'Valid from date is required';
    }
    
    if (formData.valid_to_date && formData.valid_from_date && 
        new Date(formData.valid_to_date) <= new Date(formData.valid_from_date)) {
      newErrors.valid_to_date = 'End date must be after start date';
    }
    
    if (!formData.exemption_percentage || formData.exemption_percentage < 0 || formData.exemption_percentage > 100) {
      newErrors.exemption_percentage = 'Exemption percentage must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleTaxTypeChange = (taxType, checked) => {
    const updatedTypes = checked 
      ? [...formData.applicable_tax_types, taxType]
      : formData.applicable_tax_types.filter(type => type !== taxType);
    
    setFormData(prev => ({ ...prev, applicable_tax_types: updatedTypes }));
  };

  const exemptionTypeOptions = [
    { value: 'NON_PROFIT', label: 'Non-Profit Organization' },
    { value: 'GOVERNMENT', label: 'Government Entity' },
    { value: 'DIPLOMATIC', label: 'Diplomatic Exemption' },
    { value: 'RELIGIOUS', label: 'Religious Organization' },
    { value: 'EDUCATIONAL', label: 'Educational Institution' },
    { value: 'CHARITABLE', label: 'Charitable Organization' },
    { value: 'RESALE', label: 'Resale Exemption' },
    { value: 'MANUFACTURING', label: 'Manufacturing Exemption' },
    { value: 'AGRICULTURE', label: 'Agricultural Exemption' },
    { value: 'MEDICAL', label: 'Medical Exemption' },
    { value: 'EXPORT', label: 'Export Exemption' },
    { value: 'OTHER', label: 'Other' }
  ];

  const taxTypeOptions = [
    { value: 'VAT', label: 'Value Added Tax' },
    { value: 'GST', label: 'Goods and Services Tax' },
    { value: 'SALES_TAX', label: 'Sales Tax' },
    { value: 'USE_TAX', label: 'Use Tax' },
    { value: 'EXCISE_TAX', label: 'Excise Tax' },
    { value: 'PROPERTY_TAX', label: 'Property Tax' }
  ];

  const statusOptions = [
    { value: 'VALID', label: 'Valid' },
    { value: 'EXPIRED', label: 'Expired' },
    { value: 'REVOKED', label: 'Revoked' },
    { value: 'PENDING', label: 'Pending Approval' },
    { value: 'SUSPENDED', label: 'Suspended' }
  ];

  const isExpiringSoon = formData.valid_to_date && 
    new Date(formData.valid_to_date) <= new Date(Date.now() + (formData.renewal_reminder_days * 24 * 60 * 60 * 1000));

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={exemption ? 'Edit Tax Exemption' : 'Add Tax Exemption'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer/Vendor Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Customer/Vendor Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Customer/Vendor ID"
              value={formData.customer_vendor_id}
              onChange={(e) => handleChange('customer_vendor_id', e.target.value)}
              required
              placeholder="e.g., CUST001"
              error={errors.customer_vendor_id}
            />
            
            <Input
              label="Customer/Vendor Name"
              value={formData.customer_vendor_name}
              onChange={(e) => handleChange('customer_vendor_name', e.target.value)}
              placeholder="e.g., ABC Non-Profit Organization"
            />
          </div>
        </div>

        {/* Exemption Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Exemption Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Exemption Type"
              value={formData.exemption_type}
              onChange={(e) => handleChange('exemption_type', e.target.value)}
              options={exemptionTypeOptions}
              required
              error={errors.exemption_type}
            />
            
            <Input
              label="Certificate Number"
              value={formData.exemption_certificate_number}
              onChange={(e) => handleChange('exemption_certificate_number', e.target.value)}
              required
              placeholder="e.g., EX-123456789"
              error={errors.exemption_certificate_number}
            />
            
            <Input
              label="Issuing Authority"
              value={formData.issuing_authority}
              onChange={(e) => handleChange('issuing_authority', e.target.value)}
              required
              placeholder="e.g., State Department of Revenue"
              error={errors.issuing_authority}
            />
            
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              options={statusOptions}
            />
          </div>
        </div>

        {/* Validity Period */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Validity Period
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Valid From Date"
              type="date"
              value={formData.valid_from_date}
              onChange={(e) => handleChange('valid_from_date', e.target.value)}
              required
              error={errors.valid_from_date}
            />
            
            <Input
              label="Valid To Date"
              type="date"
              value={formData.valid_to_date}
              onChange={(e) => handleChange('valid_to_date', e.target.value)}
              error={errors.valid_to_date}
            />
            
            <Input
              label="Renewal Reminder (Days)"
              type="number"
              min="1"
              max="365"
              value={formData.renewal_reminder_days}
              onChange={(e) => handleChange('renewal_reminder_days', e.target.value)}
              placeholder="30"
            />
          </div>
          
          {isExpiringSoon && (
            <Alert variant="warning" className="mt-4">
              <strong>Expiring Soon:</strong> This exemption expires within {formData.renewal_reminder_days} days. 
              Consider renewing the certificate soon.
            </Alert>
          )}
        </div>

        {/* Tax Types and Percentage */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Applicable Tax Types
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Applicable Tax Types
              </label>
              <div className="space-y-2">
                {taxTypeOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.applicable_tax_types.includes(option.value)}
                      onChange={(e) => handleTaxTypeChange(option.value, e.target.checked)}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Exemption Percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.exemption_percentage}
                onChange={(e) => handleChange('exemption_percentage', e.target.value)}
                placeholder="100.00"
                error={errors.exemption_percentage}
              />
              
              <Input
                label="Geographic Scope"
                value={formData.geographic_scope}
                onChange={(e) => handleChange('geographic_scope', e.target.value)}
                placeholder="e.g., California, USA"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {exemption ? 'Update Exemption' : 'Add Exemption'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ========== TAX PAYMENT FORM ==========
export const TaxPaymentForm = ({ isOpen, onClose, onSubmit, payment = null }) => {
  const [formData, setFormData] = useState({
    tax_authority: payment?.tax_authority || '',
    payment_type: payment?.payment_type || '',
    payment_date: payment?.payment_date || new Date().toISOString().split('T')[0],
    payment_method: payment?.payment_method || '',
    payment_amount: payment?.payment_amount || '',
    reference_number: payment?.reference_number || '',
    bank_account_used: payment?.bank_account_used || '',
    related_return_id: payment?.related_return_id || '',
    payment_description: payment?.payment_description || '',
    payment_status: payment?.payment_status || 'PENDING'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tax_authority.trim()) {
      newErrors.tax_authority = 'Tax authority is required';
    }
    
    if (!formData.payment_type) {
      newErrors.payment_type = 'Payment type is required';
    }
    
    if (!formData.payment_date) {
      newErrors.payment_date = 'Payment date is required';
    }
    
    if (!formData.payment_method) {
      newErrors.payment_method = 'Payment method is required';
    }
    
    if (!formData.payment_amount || formData.payment_amount <= 0) {
      newErrors.payment_amount = 'Payment amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const paymentTypeOptions = [
    { value: 'ESTIMATED', label: 'Estimated Tax Payment' },
    { value: 'FINAL', label: 'Final Tax Payment' },
    { value: 'PENALTY', label: 'Penalty Payment' },
    { value: 'INTEREST', label: 'Interest Payment' },
    { value: 'EXTENSION', label: 'Extension Payment' },
    { value: 'AMENDED', label: 'Amended Return Payment' },
    { value: 'ADVANCE', label: 'Advance Payment' },
    { value: 'REFUND_OFFSET', label: 'Refund Offset' }
  ];

  const paymentMethodOptions = [
    { value: 'ELECTRONIC', label: 'Electronic Transfer (ACH)' },
    { value: 'WIRE_TRANSFER', label: 'Wire Transfer' },
    { value: 'CHECK', label: 'Check' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'DEBIT_CARD', label: 'Debit Card' },
    { value: 'ONLINE_PORTAL', label: 'Online Tax Portal' },
    { value: 'CASH', label: 'Cash' },
    { value: 'MONEY_ORDER', label: 'Money Order' }
  ];

  const paymentStatusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'PROCESSED', label: 'Processed' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'REFUNDED', label: 'Refunded' }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={payment ? 'Edit Tax Payment' : 'Record Tax Payment'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Payment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tax Authority"
              value={formData.tax_authority}
              onChange={(e) => handleChange('tax_authority', e.target.value)}
              required
              placeholder="e.g., Internal Revenue Service"
              error={errors.tax_authority}
            />
            
            <Select
              label="Payment Type"
              value={formData.payment_type}
              onChange={(e) => handleChange('payment_type', e.target.value)}
              options={paymentTypeOptions}
              required
              error={errors.payment_type}
            />
            
            <Input
              label="Payment Date"
              type="date"
              value={formData.payment_date}
              onChange={(e) => handleChange('payment_date', e.target.value)}
              required
              error={errors.payment_date}
            />
            
            <Select
              label="Payment Method"
              value={formData.payment_method}
              onChange={(e) => handleChange('payment_method', e.target.value)}
              options={paymentMethodOptions}
              required
              error={errors.payment_method}
            />
          </div>
        </div>

        {/* Amount and Reference */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Amount and Reference Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Payment Amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.payment_amount}
              onChange={(e) => handleChange('payment_amount', e.target.value)}
              required
              placeholder="0.00"
              error={errors.payment_amount}
            />
            
            <Input
              label="Reference Number"
              value={formData.reference_number}
              onChange={(e) => handleChange('reference_number', e.target.value)}
              placeholder="e.g., TXN123456789"
            />
            
            <Input
              label="Bank Account Used"
              value={formData.bank_account_used}
              onChange={(e) => handleChange('bank_account_used', e.target.value)}
              placeholder="e.g., Business Checking - ***1234"
            />
            
            <Input
              label="Related Return ID"
              value={formData.related_return_id}
              onChange={(e) => handleChange('related_return_id', e.target.value)}
              placeholder="e.g., VAT001"
            />
          </div>
        </div>

        {/* Payment Status and Description */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Status and Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Payment Status"
              value={formData.payment_status}
              onChange={(e) => handleChange('payment_status', e.target.value)}
              options={paymentStatusOptions}
            />
            
            <div></div> {/* Empty cell for spacing */}
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Description/Notes
              </label>
              <textarea
                value={formData.payment_description}
                onChange={(e) => handleChange('payment_description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Additional details about this payment..."
              />
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Payment Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-600 dark:text-blue-400">Authority:</span>
              <span className="ml-2 text-blue-800 dark:text-blue-200">{formData.tax_authority || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-400">Amount:</span>
              <span className="ml-2 text-blue-800 dark:text-blue-200 font-medium">
                ${formData.payment_amount ? parseFloat(formData.payment_amount).toFixed(2) : '0.00'}
              </span>
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-400">Method:</span>
              <span className="ml-2 text-blue-800 dark:text-blue-200">{formData.payment_method || 'Not selected'}</span>
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-400">Status:</span>
              <span className="ml-2">
                <Badge variant={formData.payment_status === 'COMPLETED' ? 'success' : 'warning'}>
                  {formData.payment_status || 'PENDING'}
                </Badge>
              </span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {payment ? 'Update Payment' : 'Record Payment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};