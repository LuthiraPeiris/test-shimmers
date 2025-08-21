import React, { useState, useEffect } from 'react';
import SupplierInvoiceModal from './SupplierInvoiceModal';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/purchasePortalUtils';

const SupplierInvoiceSection = ({ 
  supplierInvoices = [], 
  onAddInvoice, 
  onEditInvoice, 
  onDeleteInvoice 
}) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch purchase orders for dropdown
  const fetchPurchaseOrders = async () => {
    try {
      const response = await fetch('/api/purchase-orders');
      const data = await response.json();
      console.log(data);
      setPurchaseOrders(data.purchaseOrders || []);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const handleAddInvoice = () => {
    setCurrentInvoice(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditInvoice = (invoiceData) => {
    setCurrentInvoice(invoiceData);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteInvoice = async (inNo) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      onDeleteInvoice(inNo);
    }
  };

  const handleSaveInvoice = async (invoiceData) => {
    onAddInvoice(invoiceData);
    setIsModalOpen(false);
  };

  // Calculate stats
  const paidInvoices = supplierInvoices.filter(inv => inv.Status === 'PAID').length;
  const overdueInvoices = supplierInvoices.filter(inv => inv.Status === 'OVERDUE').length;
  const totalInvoiceValue = supplierInvoices.reduce((sum, inv) => sum + (inv.Total_Amount || 0), 0);

  return (
    <div className="fade-in">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Supplier Invoices</h2>
            <p className="mt-2 text-gray-600">Manage invoices received from suppliers.</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* <input
              type="text"
              placeholder="Search invoices..."
              className="px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            /> */}
            <button
              onClick={handleAddInvoice}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span>New Supplier Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{paidInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{overdueInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invoice Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvoiceValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Supplier Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Id</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pack Size</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {supplierInvoices.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    No supplier invoices found.
                  </td>
                </tr>
              ) : (
                supplierInvoices.map((invoice) => (
                  <tr key={invoice.In_No} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.In_No}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.Po_Id || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.Supplier_Name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.Supplier_Id || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {invoice.Item_Name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.Item_Code || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.Pack_Size || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.Total_Amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.Status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(invoice.Created_Date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.In_No)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <SupplierInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvoice}
        invoiceData={currentInvoice}
        mode={modalMode}
        purchaseOrders={purchaseOrders}
      />
    </div>
  );
};

export default SupplierInvoiceSection;