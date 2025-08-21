// Centralized service for fetching report data
const API_BASE_URL = window.location.origin;

class ReportsService {
  // Aging Inventory Report
  async getAgingInventoryReport(days = 30) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/aging-inventory?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch aging inventory data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching aging inventory:', error);
      throw error;
    }
  }

  // Stock Level Report
  async getStockLevelReport() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/stock-level`);
      if (!response.ok) throw new Error('Failed to fetch stock level data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stock level:', error);
      throw error;
    }
  }

  // Dead Stock Report
  async getDeadStockReport(days = 90) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/dead-stock?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch dead stock data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching dead stock:', error);
      throw error;
    }
  }

  // Invoice Report
  async getInvoiceReport(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        startDate: startDate || '',
        endDate: endDate || ''
      });
      const response = await fetch(`${API_BASE_URL}/api/reports/invoices?${params}`);
      if (!response.ok) throw new Error('Failed to fetch invoice data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching invoice report:', error);
      throw error;
    }
  }

  // Sales Order Report
  async getSalesOrderReport(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        startDate: startDate || '',
        endDate: endDate || ''
      });
      const response = await fetch(`${API_BASE_URL}/api/reports/sales-orders?${params}`);
      if (!response.ok) throw new Error('Failed to fetch sales order data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sales order report:', error);
      throw error;
    }
  }

  // Purchase Orders Report
  async getPurchaseOrdersReport(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        startDate: startDate || '',
        endDate: endDate || ''
      });
      const response = await fetch(`${API_BASE_URL}/api/reports/purchase-orders?${params}`);
      if (!response.ok) throw new Error('Failed to fetch purchase orders data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      throw error;
    }
  }

  // Return Order Report
  async getReturnOrderReport(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        startDate: startDate || '',
        endDate: endDate || ''
      });
      const response = await fetch(`${API_BASE_URL}/api/reports/return-orders?${params}`);
      if (!response.ok) throw new Error('Failed to fetch return orders data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching return orders:', error);
      throw error;
    }
  }

  // Quotation Report
  async getQuotationReport(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        startDate: startDate || '',
        endDate: endDate || ''
      });
      const response = await fetch(`${API_BASE_URL}/api/reports/quotations?${params}`);
      if (!response.ok) throw new Error('Failed to fetch quotations data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching quotations:', error);
      throw error;
    }
  }
}

export default new ReportsService();
