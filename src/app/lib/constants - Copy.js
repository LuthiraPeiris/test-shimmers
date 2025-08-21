export const EMPLOYEE_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    TERMINATED: 'TERMINATED'
  }
  
  export const SALARY_TYPE = {
    HOURLY: 'HOURLY',
    MONTHLY: 'MONTHLY',
    ANNUAL: 'ANNUAL'
  }
  
  export const PAYROLL_STATUS = {
    DRAFT: 'DRAFT',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
  }
  
  export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED'
  }
  
  export const PAYMENT_METHOD = {
    BANK_TRANSFER: 'BANK_TRANSFER',
    CASH: 'CASH',
    CHECK: 'CHECK'
  }
  
  export const TAX_TYPE = {
    INCOME_TAX: 'INCOME_TAX',
    SOCIAL_SECURITY: 'SOCIAL_SECURITY',
    MEDICARE: 'MEDICARE',
    STATE_TAX: 'STATE_TAX',
    EPF: 'EPF',
    ETF: 'ETF'
  }
  
  export const STATUS_COLORS = {
    [EMPLOYEE_STATUS.ACTIVE]: 'success',
    [EMPLOYEE_STATUS.INACTIVE]: 'warning',
    [EMPLOYEE_STATUS.TERMINATED]: 'danger',
    [PAYROLL_STATUS.DRAFT]: 'default',
    [PAYROLL_STATUS.PROCESSING]: 'warning',
    [PAYROLL_STATUS.COMPLETED]: 'success',
    [PAYROLL_STATUS.CANCELLED]: 'danger',
    [PAYMENT_STATUS.PENDING]: 'warning',
    [PAYMENT_STATUS.PAID]: 'success',
    [PAYMENT_STATUS.FAILED]: 'danger'
  }
  
  export const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100
  }
  
  export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    INPUT: 'yyyy-MM-dd',
    FULL: 'EEEE, MMMM do, yyyy',
    TIME: 'HH:mm:ss'
  }
  
  export const CURRENCY_CONFIG = {
    USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
    EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
    GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
    LKR: { symbol: 'Rs.', code: 'LKR', name: 'Sri Lankan Rupee' }
  }