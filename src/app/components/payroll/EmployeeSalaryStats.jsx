import { useState } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell, 
  Badge,
  formatCurrency, 
  getMonthName, 
  generateMonthOptions, 
  generateYearOptions,
  getStatusBadge 
} from '../../components/payroll/ui';
import { EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const EmployeeSalaryStats = ({ 
  employees = [],
  paySlips = [],
  payrollRuns = [],
  onViewPaySlip,
  onDownloadPaySlip
}) => {
  // State management
  const [selectedEmployeeForStats, setSelectedEmployeeForStats] = useState('');
  const [salaryStatsMonth, setSalaryStatsMonth] = useState(new Date().getMonth() + 1);
  const [salaryStatsYear, setSalaryStatsYear] = useState(new Date().getFullYear());
  const [salaryStatsViewType, setSalaryStatsViewType] = useState('monthly');

  // Enhanced employee salary statistics functions
  const getEmployeeSalaryStats = (employeeId, viewType = 'monthly', year = null, month = null) => {
    const employeePaySlips = paySlips
      .filter(slip => slip.employee_id === employeeId)
      .map(slip => {
        const payrollRun = payrollRuns.find(run => run.id === slip.payroll_run_id);
        return { ...slip, payrollRun };
      })
      .filter(slip => slip.payrollRun && slip.payrollRun.status === 'COMPLETED');
    
    let filteredPaySlips = employeePaySlips;
    
    if (viewType === 'monthly' && year && month) {
      filteredPaySlips = employeePaySlips.filter(slip => 
        slip.payrollRun.year === year && slip.payrollRun.month === month
      );
    } else if (viewType === 'yearly' && year) {
      filteredPaySlips = employeePaySlips.filter(slip => 
        slip.payrollRun.year === year
      );
    }
    
    const stats = {
      totalGrossPay: filteredPaySlips.reduce((sum, slip) => sum + slip.gross_pay, 0),
      totalRecoveries: filteredPaySlips.reduce((sum, slip) => sum + slip.total_recoveries, 0),
      totalNetPay: filteredPaySlips.reduce((sum, slip) => sum + slip.net_pay, 0),
      paySlipCount: filteredPaySlips.length,
      averageGrossPay: 0,
      averageNetPay: 0,
      highestPay: 0,
      lowestPay: 0,
      paySlips: filteredPaySlips.sort((a, b) => {
        if (a.payrollRun.year !== b.payrollRun.year) {
          return b.payrollRun.year - a.payrollRun.year;
        }
        return b.payrollRun.month - a.payrollRun.month;
      })
    };
    
    if (filteredPaySlips.length > 0) {
      stats.averageGrossPay = stats.totalGrossPay / filteredPaySlips.length;
      stats.averageNetPay = stats.totalNetPay / filteredPaySlips.length;
      stats.highestPay = Math.max(...filteredPaySlips.map(slip => slip.net_pay));
      stats.lowestPay = Math.min(...filteredPaySlips.map(slip => slip.net_pay));
    }
    
    return stats;
  };

  const getEmployeeYearlyBreakdown = (employeeId, year) => {
    const months = [];
    for (let month = 1; month <= 12; month++) {
      const monthStats = getEmployeeSalaryStats(employeeId, 'monthly', year, month);
      if (monthStats.paySlipCount > 0) {
        months.push({
          month,
          monthName: getMonthName(month),
          ...monthStats
        });
      }
    }
    return months;
  };

  const getEmployeeYearlySummary = (employeeId) => {
    const employeePaySlips = paySlips
      .filter(slip => slip.employee_id === employeeId)
      .map(slip => {
        const payrollRun = payrollRuns.find(run => run.id === slip.payroll_run_id);
        return { ...slip, payrollRun };
      })
      .filter(slip => slip.payrollRun && slip.payrollRun.status === 'COMPLETED');
    
    const yearlyData = {};
    employeePaySlips.forEach(slip => {
      const year = slip.payrollRun.year;
      if (!yearlyData[year]) {
        yearlyData[year] = {
          year,
          totalGrossPay: 0,
          totalRecoveries: 0,
          totalNetPay: 0,
          paySlipCount: 0
        };
      }
      yearlyData[year].totalGrossPay += slip.gross_pay;
      yearlyData[year].totalRecoveries += slip.total_recoveries;
      yearlyData[year].totalNetPay += slip.net_pay;
      yearlyData[year].paySlipCount += 1;
    });
    
    return Object.values(yearlyData)
      .map(yearData => ({
        ...yearData,
        averageGrossPay: yearData.totalGrossPay / yearData.paySlipCount,
        averageNetPay: yearData.totalNetPay / yearData.paySlipCount
      }))
      .sort((a, b) => b.year - a.year);
  };

  // Computed values
  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeForStats);
  const salaryStats = selectedEmployeeForStats 
    ? getEmployeeSalaryStats(selectedEmployeeForStats, salaryStatsViewType, salaryStatsYear, salaryStatsMonth)
    : null;
  const yearlyBreakdown = (selectedEmployeeForStats && salaryStatsViewType === 'yearly') 
    ? getEmployeeYearlyBreakdown(selectedEmployeeForStats, salaryStatsYear)
    : [];
  const yearlySummary = (selectedEmployeeForStats && salaryStatsViewType === 'all') 
    ? getEmployeeYearlySummary(selectedEmployeeForStats)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Employee Salary Statistics
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Comprehensive salary analysis and statistics for individual employees
            </p>
          </div>
        </div>
        
        {/* Enhanced Filtering Controls */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-indigo-900 dark:text-indigo-100 mb-4">
            Employee Salary Analysis Controls
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">
                Select Employee
              </label>
              <select
                value={selectedEmployeeForStats}
                onChange={(e) => setSelectedEmployeeForStats(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-300 rounded-lg bg-white dark:bg-gray-700 text-indigo-900 dark:text-indigo-100 text-sm"
              >
                <option value="">Choose an employee...</option>
                {employees
                  .filter(emp => emp.status === 'ACTIVE')
                  .sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`))
                  .map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.first_name} {employee.last_name} ({employee.employee_id})
                    </option>
                  ))
                }
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">
                View Type
              </label>
              <select
                value={salaryStatsViewType}
                onChange={(e) => setSalaryStatsViewType(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-300 rounded-lg bg-white dark:bg-gray-700 text-indigo-900 dark:text-indigo-100 text-sm"
              >
                <option value="monthly">Monthly View</option>
                <option value="yearly">Yearly View</option>
                <option value="all">All Time</option>
              </select>
            </div>
            {(salaryStatsViewType === 'monthly' || salaryStatsViewType === 'yearly') && (
              <>
                {salaryStatsViewType === 'monthly' && (
                  <div>
                    <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">
                      Month
                    </label>
                    <select
                      value={salaryStatsMonth}
                      onChange={(e) => setSalaryStatsMonth(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-indigo-300 rounded-lg bg-white dark:bg-gray-700 text-indigo-900 dark:text-indigo-100 text-sm"
                    >
                      {generateMonthOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">
                    Year
                  </label>
                  <select
                    value={salaryStatsYear}
                    onChange={(e) => setSalaryStatsYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-indigo-300 rounded-lg bg-white dark:bg-gray-700 text-indigo-900 dark:text-indigo-100 text-sm"
                  >
                    {generateYearOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div className="flex items-end">
              <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                {selectedEmployeeForStats ? (
                  <div>
                    <div>Selected Employee:</div>
                    <div className="font-bold">
                      {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">No employee selected</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Salary Statistics Display */}
      {selectedEmployeeForStats && salaryStats ? (
        <div className="space-y-6">
          {/* Employee Information Header */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 mt-1">
                    {selectedEmployee?.employee_id} • {selectedEmployee?.job_title} • {selectedEmployee?.department}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-600 dark:text-blue-400">Analysis Period</div>
                  <div className="font-semibold text-blue-800 dark:text-blue-200">
                    {salaryStatsViewType === 'monthly' 
                      ? `${getMonthName(salaryStatsMonth)} ${salaryStatsYear}`
                      : salaryStatsViewType === 'yearly'
                      ? `${salaryStatsYear} (Full Year)`
                      : 'All Time'
                    }
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Statistics Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(salaryStats.totalGrossPay)}
                </div>
                <div className="text-sm text-green-600 mt-1">Total Gross Pay</div>
                {salaryStats.paySlipCount > 1 && (
                  <div className="text-xs text-gray-500 mt-2">
                    Avg: {formatCurrency(salaryStats.averageGrossPay)}
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {formatCurrency(salaryStats.totalRecoveries)}
                </div>
                <div className="text-sm text-red-600 mt-1">Total Recoveries</div>
                {salaryStats.paySlipCount > 1 && (
                  <div className="text-xs text-gray-500 mt-2">
                    Avg: {formatCurrency(salaryStats.totalRecoveries / salaryStats.paySlipCount)}
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(salaryStats.totalNetPay)}
                </div>
                <div className="text-sm text-blue-600 mt-1">Total Net Pay</div>
                {salaryStats.paySlipCount > 1 && (
                  <div className="text-xs text-gray-500 mt-2">
                    Avg: {formatCurrency(salaryStats.averageNetPay)}
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {salaryStats.paySlipCount}
                </div>
                <div className="text-sm text-purple-600 mt-1">Pay Periods</div>
                {salaryStats.paySlipCount > 1 && (
                  <div className="text-xs text-gray-500 mt-2">
                    Range: {formatCurrency(salaryStats.lowestPay)} - {formatCurrency(salaryStats.highestPay)}
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          {/* Detailed Breakdown Based on View Type */}
          {salaryStatsViewType === 'yearly' && yearlyBreakdown.length > 0 && (
            <Card>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Monthly Breakdown for {salaryStatsYear}
                </h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Gross Pay</TableHead>
                        <TableHead>Recoveries</TableHead>
                        <TableHead>Net Pay</TableHead>
                        <TableHead>Pay Slips</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyBreakdown.map((monthData) => (
                        <TableRow key={monthData.month}>
                          <TableCell className="font-medium">{monthData.monthName}</TableCell>
                          <TableCell className="font-medium text-green-600">
                            {formatCurrency(monthData.totalGrossPay)}
                          </TableCell>
                          <TableCell className="font-medium text-red-600">
                            {formatCurrency(monthData.totalRecoveries)}
                          </TableCell>
                          <TableCell className="font-medium text-blue-600">
                            {formatCurrency(monthData.totalNetPay)}
                          </TableCell>
                          <TableCell>{monthData.paySlipCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          )}
          
          {salaryStatsViewType === 'all' && yearlySummary.length > 0 && (
            <Card>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Yearly Summary (All Time)
                </h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Total Gross Pay</TableHead>
                        <TableHead>Total Recoveries</TableHead>
                        <TableHead>Total Net Pay</TableHead>
                        <TableHead>Average Monthly</TableHead>
                        <TableHead>Pay Periods</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlySummary.map((yearData) => (
                        <TableRow key={yearData.year}>
                          <TableCell className="font-medium">{yearData.year}</TableCell>
                          <TableCell className="font-medium text-green-600">
                            {formatCurrency(yearData.totalGrossPay)}
                          </TableCell>
                          <TableCell className="font-medium text-red-600">
                            {formatCurrency(yearData.totalRecoveries)}
                          </TableCell>
                          <TableCell className="font-medium text-blue-600">
                            {formatCurrency(yearData.totalNetPay)}
                          </TableCell>
                          <TableCell className="font-medium text-purple-600">
                            {formatCurrency(yearData.averageNetPay)}
                          </TableCell>
                          <TableCell>{yearData.paySlipCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          )}
          
          {/* Detailed Pay Slips for Selected Period */}
          {salaryStats.paySlips.length > 0 && (
            <Card>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Detailed Pay Slips
                </h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pay Slip ID</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Gross Pay</TableHead>
                        <TableHead>Recoveries</TableHead>
                        <TableHead>Net Pay</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salaryStats.paySlips.map((slip) => (
                        <TableRow key={slip.id}>
                          <TableCell className="font-medium">{slip.pay_slip_id}</TableCell>
                          <TableCell>
                            {slip.payrollRun?.month_name} {slip.payrollRun?.year}
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
                            <div className="flex space-x-1 relative">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onViewPaySlip(slip)}
                                title="View Pay Slip"
                                className="relative z-10"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => onDownloadPaySlip(slip)}
                                title="Download Pay Slip"
                                className="relative z-10"
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
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Select an Employee
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Choose an employee from the dropdown above to view their comprehensive salary statistics and analysis.
            </p>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default EmployeeSalaryStats;