// Utility functions for purchase portal
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount);
};

// Alternative format for LKR without currency symbol for more control
export const formatLKR = (amount) => {
  return `Rs. ${new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const generateId = (prefix) => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${random}`.toUpperCase();
};

export function getStatusBadge(status) {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status?.toUpperCase()) {
        case 'PAID':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>PAID</span>;
        case 'OVERDUE':
            return <span className={`${baseClasses} bg-red-100 text-red-800`}>OVERDUE</span>;
        case 'PENDING':
            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>PENDING</span>;
        default:
            return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status || "UNKNOWN"}</span>;
    }
}

// Validation functions
export const validateSupplierInvoice = (invoice) => {
  const errors = {};
  
  if (!invoice.Po_Id) errors.Po_Id = 'Purchase Order ID is required';
  if (!invoice.Supplier_Id) errors.Supplier_Id = 'Supplier ID is required';
  if (!invoice.Supplier_Name) errors.Supplier_Name = 'Supplier Name is required';
  if (!invoice.Item_Code) errors.Item_Code = 'Item Code is required';
  if (!invoice.Item_Name) errors.Item_Name = 'Item Name is required';
  if (!invoice.Pack_Size) errors.Pack_Size = 'Pack Size is required';
  if (!invoice.Total_Amount || invoice.Total_Amount <= 0) errors.Total_Amount = 'Total Amount must be greater than 0';
  if (!invoice.status) errors.status = 'Status is required';
  if (!invoice.Created_Date) errors.Created_Date = 'Created Date is required';
  
  return errors;
};

// API helper functions
export const fetchSupplierInvoices = async (search = '') => {
  try {
    const res = await fetch(`/api/supplier-invoices?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    return data.supplierInvoices || [];
  } catch (error) {
    console.error('Failed to fetch supplier invoices:', error);
    return [];
  }
};

export const createSupplierInvoice = async (invoice) => {
  try {
    const res = await fetch('/api/supplier-invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to create supplier invoice:', error);
    throw error;
  }
};

export const updateSupplierInvoice = async (id, invoice) => {
  try {
    const res = await fetch(`/api/supplier-invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to update supplier invoice:', error);
    throw error;
  }
};

export const deleteSupplierInvoice = async (id) => {
  try {
    const res = await fetch(`/api/supplier-invoices/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (error) {
    console.error('Failed to delete supplier invoice:', error);
    throw error;
  }
};
