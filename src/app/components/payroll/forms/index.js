import { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, Card, formatCurrency, formatDate, generateMonthOptions, generateYearOptions } from '../ui';

// ========== EMPLOYEE FORM ==========

export const EmployeeForm = ({ isOpen, onClose, onSubmit, employee = null, departments = [] }) => {
  const [formData, setFormData] = useState({
    employee_id: employee?.employee_id || '',
    first_name: employee?.first_name || '',
    last_name: employee?.last_name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    address: employee?.address || '',
    job_title: employee?.job_title || '',
    department_id: employee?.department_id || '',
    joining_date: employee?.joining_date || '',
    bank_account_number: employee?.bank_account_number || '',
    bank_name: employee?.bank_name || '',
    bank_branch: employee?.bank_branch || '',
    tax_id: employee?.tax_id || '',
    social_security_number: employee?.social_security_number || '',
    emergency_contact_name: employee?.emergency_contact_name || '',
    emergency_contact_phone: employee?.emergency_contact_phone || '',
    status: employee?.status || 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        employee_id: employee.employee_id || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        address: employee.address || '',
        job_title: employee.job_title || '',
        department_id: employee.department_id || '',
        joining_date: employee.joining_date || '',
        bank_account_number: employee.bank_account_number || '',
        bank_name: employee.bank_name || '',
        bank_branch: employee.bank_branch || '',
        tax_id: employee.tax_id || '',
        social_security_number: employee.social_security_number || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
        status: employee.status || 'ACTIVE'
      });
    }
  }, [employee]);

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

  const departmentOptions = departments.map(dept => ({
    value: dept.id,
    label: dept.name
  }));

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'TERMINATED', label: 'Terminated' }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={employee ? 'Edit Employee' : 'Add New Employee'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Basic Information</h4>
          </div>
          
          <Input
            label="Employee ID"
            value={formData.employee_id}
            onChange={(e) => handleChange('employee_id', e.target.value)}
            required
            placeholder="EMP001"
          />
          
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={statusOptions}
          />
          
          <Input
            label="First Name"
            value={formData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            required
          />
          
          <Input
            label="Last Name"
            value={formData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
          
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          
          <div className="md:col-span-2">
            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          <div className="md:col-span-2 mt-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Job Information</h4>
          </div>
          
          <Input
            label="Job Title"
            value={formData.job_title}
            onChange={(e) => handleChange('job_title', e.target.value)}
            required
          />
          
          <Select
            label="Department"
            value={formData.department_id}
            onChange={(e) => handleChange('department_id', e.target.value)}
            options={departmentOptions}
            required
          />
          
          <Input
            label="Joining Date"
            type="date"
            value={formData.joining_date}
            onChange={(e) => handleChange('joining_date', e.target.value)}
            required
          />

          <div className="md:col-span-2 mt-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Bank Information</h4>
          </div>
          
          <Input
            label="Bank Account Number"
            value={formData.bank_account_number}
            onChange={(e) => handleChange('bank_account_number', e.target.value)}
          />
          
          <Input
            label="Bank Name"
            value={formData.bank_name}
            onChange={(e) => handleChange('bank_name', e.target.value)}
          />
          
          <Input
            label="Bank Branch"
            value={formData.bank_branch}
            onChange={(e) => handleChange('bank_branch', e.target.value)}
          />

          <div className="md:col-span-2 mt-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Legal Information</h4>
          </div>
          
          <Input
            label="Tax ID"
            value={formData.tax_id}
            onChange={(e) => handleChange('tax_id', e.target.value)}
          />
          
          <Input
            label="Social Security Number"
            value={formData.social_security_number}
            onChange={(e) => handleChange('social_security_number', e.target.value)}
          />

          <div className="md:col-span-2 mt-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Emergency Contact</h4>
          </div>
          
          <Input
            label="Emergency Contact Name"
            value={formData.emergency_contact_name}
            onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
          />
          
          <Input
            label="Emergency Contact Phone"
            value={formData.emergency_contact_phone}
            onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {employee ? 'Update Employee' : 'Add Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ========== PAYROLL RUN FORM ==========

export const PayrollRunForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    payment_date: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        payment_date: '',
        notes: ''
      });
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
      title="Create New Monthly Payroll Run"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Month"
            value={formData.month}
            onChange={(e) => handleChange('month', parseInt(e.target.value))}
            options={generateMonthOptions()}
            required
          />
          
          <Select
            label="Year"
            value={formData.year}
            onChange={(e) => handleChange('year', parseInt(e.target.value))}
            options={generateYearOptions()}
            required
          />
        </div>
       
        <Input
          label="Payment Date"
          type="date"
          value={formData.payment_date}
          onChange={(e) => handleChange('payment_date', e.target.value)}
          required
        />
       
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Optional notes for this payroll run..."
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Payroll Run
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ========== EARNING GROUP FORM ==========

export const EarningGroupForm = ({ isOpen, onClose, onSubmit, earningGroup = null }) => {
  const [formData, setFormData] = useState({
    code: earningGroup?.code || '',
    name: earningGroup?.name || '',
    description: earningGroup?.description || '',
    is_taxable: earningGroup?.is_taxable ?? true,
    status: earningGroup?.status || 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (earningGroup) {
      setFormData({
        code: earningGroup.code || '',
        name: earningGroup.name || '',
        description: earningGroup.description || '',
        is_taxable: earningGroup.is_taxable ?? true,
        status: earningGroup.status || 'ACTIVE'
      });
    }
  }, [earningGroup]);

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
      title={earningGroup ? 'Edit Earning Group' : 'Add New Earning Group'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Code"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value)}
          required
          placeholder="BASIC_SALARY"
        />
        
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          placeholder="Basic Salary"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Description of this earning type..."
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_taxable}
              onChange={(e) => handleChange('is_taxable', e.target.checked)}
              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Taxable</span>
          </label>
        </div>
        
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={statusOptions}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {earningGroup ? 'Update Earning Group' : 'Add Earning Group'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ========== RECOVERY GROUP FORM ==========

export const RecoveryGroupForm = ({ isOpen, onClose, onSubmit, recoveryGroup = null }) => {
  const [formData, setFormData] = useState({
    code: recoveryGroup?.code || '',
    name: recoveryGroup?.name || '',
    description: recoveryGroup?.description || '',
    status: recoveryGroup?.status || 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recoveryGroup) {
      setFormData({
        code: recoveryGroup.code || '',
        name: recoveryGroup.name || '',
        description: recoveryGroup.description || '',
        status: recoveryGroup.status || 'ACTIVE'
      });
    }
  }, [recoveryGroup]);

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
      title={recoveryGroup ? 'Edit Recovery Group' : 'Add New Recovery Group'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Code"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value)}
          required
          placeholder="INCOME_TAX"
        />
        
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          placeholder="Income Tax"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Description of this recovery type..."
          />
        </div>
        
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={statusOptions}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {recoveryGroup ? 'Update Recovery Group' : 'Add Recovery Group'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ========== SALARY ENTRY FORM ==========

export const SalaryEntryForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  employee, 
  earningGroups = [], 
  recoveryGroups = [],
  payrollRun 
}) => {
  const [earnings, setEarnings] = useState([]);
  const [recoveries, setRecoveries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Initialize with basic salary earning
      setEarnings([
        { earning_group_id: '', amount: 0 }
      ]);
      setRecoveries([
        { recovery_group_id: '', amount: 0 }
      ]);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = {
        employee_id: employee.id,
        payroll_run_id: payrollRun.id,
        earnings: earnings.filter(e => e.earning_group_id && e.amount > 0),
        recoveries: recoveries.filter(r => r.recovery_group_id && r.amount > 0)
      };
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEarning = () => {
    setEarnings([...earnings, { earning_group_id: '', amount: 0 }]);
  };

  const removeEarning = (index) => {
    setEarnings(earnings.filter((_, i) => i !== index));
  };

  const updateEarning = (index, field, value) => {
    const updated = [...earnings];
    updated[index] = { ...updated[index], [field]: value };
    setEarnings(updated);
  };

  const addRecovery = () => {
    setRecoveries([...recoveries, { recovery_group_id: '', amount: 0 }]);
  };

  const removeRecovery = (index) => {
    setRecoveries(recoveries.filter((_, i) => i !== index));
  };

  const updateRecovery = (index, field, value) => {
    const updated = [...recoveries];
    updated[index] = { ...updated[index], [field]: value };
    setRecoveries(updated);
  };

  const calculateTotalEarnings = () => {
    return earnings.reduce((sum, earning) => sum + (parseFloat(earning.amount) || 0), 0);
  };

  const calculateTotalRecoveries = () => {
    return recoveries.reduce((sum, recovery) => sum + (parseFloat(recovery.amount) || 0), 0);
  };

  const calculateNetPay = () => {
    return calculateTotalEarnings() - calculateTotalRecoveries();
  };

  const earningOptions = earningGroups.map(group => ({
    value: group.id,
    label: group.name
  }));

  const recoveryOptions = recoveryGroups.map(group => ({
    value: group.id,
    label: group.name
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Salary Entry - ${employee?.first_name} ${employee?.last_name}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Info */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Employee Information</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {employee?.employee_id} - {employee?.first_name} {employee?.last_name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {employee?.job_title} • {employee?.department}
          </p>
        </div>

        {/* Earnings Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Earnings</h4>
            <Button type="button" size="sm" onClick={addEarning}>
              Add Earning
            </Button>
          </div>
          
          <div className="space-y-3">
            {earnings.map((earning, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-6">
                  <Select
                    label="Earning Type"
                    value={earning.earning_group_id}
                    onChange={(e) => updateEarning(index, 'earning_group_id', e.target.value)}
                    options={earningOptions}
                    required
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={earning.amount}
                    onChange={(e) => updateEarning(index, 'amount', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeEarning(index)}
                    disabled={earnings.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-right">
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Total Earnings: {formatCurrency(calculateTotalEarnings())}
            </span>
          </div>
        </div>

        {/* Recoveries Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recoveries</h4>
            <Button type="button" size="sm" onClick={addRecovery}>
              Add Recovery
            </Button>
          </div>
          
          <div className="space-y-3">
            {recoveries.map((recovery, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-6">
                  <Select
                    label="Recovery Type"
                    value={recovery.recovery_group_id}
                    onChange={(e) => updateRecovery(index, 'recovery_group_id', e.target.value)}
                    options={recoveryOptions}
                    required
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={recovery.amount}
                    onChange={(e) => updateRecovery(index, 'amount', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeRecovery(index)}
                    disabled={recoveries.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-right">
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Total Recoveries: {formatCurrency(calculateTotalRecoveries())}
            </span>
          </div>
        </div>

        {/* Net Pay Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Net Pay</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(calculateNetPay())}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Salary Entry
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ========== PAY SLIP PREVIEW COMPONENT ==========

export const PaySlipPreview = ({ paySlip, employee, payrollRun }) => {
  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pay Slip</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {payrollRun?.month_name} {payrollRun?.year}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Employee Information</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Employee ID:</span> {employee?.employee_id}</p>
            <p><span className="font-medium">Name:</span> {employee?.first_name} {employee?.last_name}</p>
            <p><span className="font-medium">Job Title:</span> {employee?.job_title}</p>
            <p><span className="font-medium">Department:</span> {employee?.department}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Payment Information</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Pay Slip ID:</span> {paySlip?.pay_slip_id}</p>
            <p><span className="font-medium">Payment Date:</span> {formatDate(payrollRun?.payment_date)}</p>
            <p><span className="font-medium">Payment Method:</span> {paySlip?.payment_method || 'Bank Transfer'}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Earnings</h3>
            <div className="space-y-2 text-sm">
              {paySlip?.earnings?.map((earning, index) => (
                <div key={index} className="flex justify-between">
                  <span>{earning.earning_name}:</span>
                  <span>{formatCurrency(earning.amount)}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-medium flex justify-between">
                <span>Gross Pay:</span>
                <span>{formatCurrency(paySlip?.gross_pay)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recoveries</h3>
            <div className="space-y-2 text-sm">
              {paySlip?.recoveries?.map((recovery, index) => (
                <div key={index} className="flex justify-between">
                  <span>{recovery.recovery_name}:</span>
                  <span>{formatCurrency(recovery.amount)}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-medium flex justify-between">
                <span>Total Recoveries:</span>
                <span>{formatCurrency(paySlip?.total_recoveries)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Net Pay:</span>
            <span className="text-green-600 dark:text-green-400">{formatCurrency(paySlip?.net_pay)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};