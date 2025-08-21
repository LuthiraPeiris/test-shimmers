'use client';

import React, { useState, useEffect } from 'react';
import '../globals.css';
import PurchasePortalHeader from '../components/purchase-portal/PurchasePortalHeader';
import PurchasePortalNav from '../components/purchase-portal/PurchasePortalNav';
import PurchaseOrderSection from '../components/purchase-portal/PurchaseOrderSection';
import GoodsReceiptSection from '../components/purchase-portal/GoodsReceiptSection';
import SupplierInvoiceSection from '../components/purchase-portal/SupplierInvoiceSection';
import PurchaseOrderModal from '../components/purchase-portal/PurchaseOrderModal';
import GoodsReceiptModal from '../components/purchase-portal/GoodsReceiptModal';
import SupplierInvoiceModal from '../components/purchase-portal/SupplierInvoiceModal';
import { generateId } from '../utils/purchasePortalUtils';

const PurchasePortalPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('purchaseOrders');
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [goodsReceipts, setGoodsReceipts] = useState([]);
  const [supplierInvoices, setSupplierInvoices] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState({
    purchaseOrders: false,
    goodsReceipts: false,
    supplierInvoices: false,
  });

  // Modal states
  const [isPurchaseOrderModalOpen, setIsPurchaseOrderModalOpen] = useState(false);
  const [currentPurchaseOrder, setCurrentPurchaseOrder] = useState(null);
  const [purchaseOrderModalMode, setPurchaseOrderModalMode] = useState('add');

  const [isGoodsReceiptModalOpen, setIsGoodsReceiptModalOpen] = useState(false);
  const [currentGoodsReceipt, setCurrentGoodsReceipt] = useState(null);
  const [goodsReceiptModalMode, setGoodsReceiptModalMode] = useState('add');

  const [isSupplierInvoiceModalOpen, setIsSupplierInvoiceModalOpen] = useState(false);
  const [currentSupplierInvoice, setCurrentSupplierInvoice] = useState(null);
  const [supplierInvoiceModalMode, setSupplierInvoiceModalMode] = useState('add');

  // Notification functions
  const showNotification = (message) => {
    // Replace with your preferred notification system
    alert(message);
  };

  const showErrorNotification = (message) => {
    // Replace with your preferred error notification system
    alert(`Error: ${message}`);
  };

  // Data fetching functions
  const fetchPurchaseOrders = async (search = '') => {
    setLoading(prev => ({ ...prev, purchaseOrders: true }));
    try {
      const res = await fetch(`/api/purchase-orders?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setPurchaseOrders(data.purchaseOrders || []);
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
      showErrorNotification('Failed to load purchase orders');
      setPurchaseOrders([]);
    } finally {
      setLoading(prev => ({ ...prev, purchaseOrders: false }));
    }
  };

  const fetchGoodsReceipts = async (search = '') => {
    setLoading(prev => ({ ...prev, goodsReceipts: true }));
    try {
      const res = await fetch(`/api/goods-receipts?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setGoodsReceipts(data.goodsReceipts || []);
    } catch (err) {
      console.error('Error fetching goods receipts:', err);
      showErrorNotification('Failed to load goods receipts');
      setGoodsReceipts([]);
    } finally {
      setLoading(prev => ({ ...prev, goodsReceipts: false }));
    }
  };

  const fetchSupplierInvoices = async (search = '') => {
    setLoading(prev => ({ ...prev, supplierInvoices: true }));
    try {
      const res = await fetch(`/api/supplier-invoices?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setSupplierInvoices(data.supplierInvoices || []);
    } catch (err) {
      console.error('Error fetching supplier invoices:', err);
      showErrorNotification('Failed to load supplier invoices');
      setSupplierInvoices([]);
    } finally {
      setLoading(prev => ({ ...prev, supplierInvoices: false }));
    }
  };

  const fetchItemOptions = async () => {
    try {
      const res = await fetch('/api/item-master');
      const data = await res.json();
      setItemOptions(data || []);
    } catch (err) {
      console.error('Error fetching item options:', err);
      showErrorNotification('Failed to load items');
      setItemOptions([]);
    }
  };

  // Effect hooks for data loading
  useEffect(() => {
    if (activeTab === 'purchaseOrders') fetchPurchaseOrders(searchTerm);
    if (activeTab === 'goodsReceipts') fetchGoodsReceipts(searchTerm);
    if (activeTab === 'supplierInvoices') fetchSupplierInvoices(searchTerm);
  }, [activeTab, searchTerm]);

  useEffect(() => {
    fetchItemOptions();
  }, []);

  // Event handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  // Purchase Order handlers
  const handleAddPurchaseOrder = () => {
    setCurrentPurchaseOrder(null);
    setPurchaseOrderModalMode('add');
    setIsPurchaseOrderModalOpen(true);
  };

  const handleEditPurchaseOrder = (order) => {
    setCurrentPurchaseOrder(order);
    setPurchaseOrderModalMode('edit');
    setIsPurchaseOrderModalOpen(true);
  };

  const handleDeletePurchaseOrder = async (id) => {
    if (window.confirm(`Are you sure you want to delete Purchase Order ${id}?`)) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/purchase-orders/${id}`, { 
          method: 'DELETE' 
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete purchase order');
        }
        
        fetchPurchaseOrders(searchTerm);
        showNotification('Purchase order deleted successfully');
      } catch (err) {
        console.error('Error deleting purchase order:', err);
        showErrorNotification(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSavePurchaseOrder = async (formData) => {
    try {
      setIsLoading(true);
      
      if (purchaseOrderModalMode === 'add') {
        if (!formData.Po_Id) formData.Po_Id = generateId('PO');
        const response = await fetch('/api/purchase-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create purchase order');
        }
        
        showNotification('Purchase order created successfully');
      } else {
        const response = await fetch(`/api/purchase-orders/${formData.Po_Id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update purchase order');
        }
        
        showNotification('Purchase order updated successfully');
      }
      
      setIsPurchaseOrderModalOpen(false);
      fetchPurchaseOrders(searchTerm);
    } catch (err) {
      console.error('Error saving purchase order:', err);
      showErrorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Goods Receipt handlers
  const handleAddGoodsReceipt = () => {
    setCurrentGoodsReceipt(null);
    setGoodsReceiptModalMode('add');
    setIsGoodsReceiptModalOpen(true);
  };

  const handleEditGoodsReceipt = (receipt) => {
    setCurrentGoodsReceipt(receipt);
    setGoodsReceiptModalMode('edit');
    setIsGoodsReceiptModalOpen(true);
  };

  const handleDeleteGoodsReceipt = async (id) => {
    if (window.confirm(`Are you sure you want to delete Goods Receipt ${id}?`)) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/goods-receipts/${id}`, { 
          method: 'DELETE' 
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete goods receipt');
        }
        
        fetchGoodsReceipts(searchTerm);
        showNotification('Goods receipt deleted successfully');
      } catch (err) {
        console.error('Error deleting goods receipt:', err);
        showErrorNotification(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveGoodsReceipt = async (formData) => {
    try {
      setIsLoading(true);
      
      if (goodsReceiptModalMode === 'add') {
        const response = await fetch('/api/goods-receipts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create goods receipt');
        }
        
        showNotification('Goods receipt created successfully');
      } else {
        const response = await fetch(`/api/goods-receipts/${formData.GRN_ID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update goods receipt');
        }
        
        showNotification('Goods receipt updated successfully');
      }
      
      setIsGoodsReceiptModalOpen(false);
      fetchGoodsReceipts(searchTerm);
      if (formData.Po_Id) fetchPurchaseOrders();
    } catch (err) {
      console.error('Error saving goods receipt:', err);
      showErrorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Supplier Invoice handlers
  const handleAddSupplierInvoice = () => {
    setCurrentSupplierInvoice(null);
    setSupplierInvoiceModalMode('add');
    setIsSupplierInvoiceModalOpen(true);
  };

  const handleEditSupplierInvoice = (invoice) => {
    setCurrentSupplierInvoice(invoice);
    setSupplierInvoiceModalMode('edit');
    setIsSupplierInvoiceModalOpen(true);
  };

  const handleDeleteSupplierInvoice = async (id) => {
    if (window.confirm(`Are you sure you want to delete Invoice ${id}?`)) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/supplier-invoices/${id}`, { 
          method: 'DELETE' 
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete supplier invoice');
        }
        
        fetchSupplierInvoices(searchTerm);
        showNotification('Supplier invoice deleted successfully');
      } catch (err) {
        console.error('Error deleting supplier invoice:', err);
        showErrorNotification(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveSupplierInvoice = async (formData) => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      const requiredFields = ['Po_Id', 'Supplier_Id', 'Supplier_Name', 'Item_Code', 
                            'Item_Name', 'Pack_Size', 'Total_Amount', 'Status', 'Created_Date'];
      const missingFields = requiredFields.filter(field => !formData[field] && formData[field] !== 0);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Prepare the invoice data
      const invoiceData = {
        ...formData,
        Total_Amount: Number(formData.Total_Amount) || 0
      };

      let response;
      
      if (supplierInvoiceModalMode === 'add') {
        response = await fetch('/api/supplier-invoices/autofill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoiceData),
        });
      } else {
        if (!invoiceData.In_No) {
          throw new Error('Invoice number is required for editing');
        }
        
        response = await fetch(`/api/supplier-invoices/${invoiceData.In_No}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoiceData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save invoice');
      }

      setIsSupplierInvoiceModalOpen(false);
      fetchSupplierInvoices(searchTerm);
      
      // Refresh related data if needed
      if (invoiceData.Po_Id) {
        fetchPurchaseOrders();
      }
      
      showNotification(`Invoice ${supplierInvoiceModalMode === 'add' ? 'created' : 'updated'} successfully`);
    } catch (err) {
      console.error('Error saving supplier invoice:', err);
      showErrorNotification(err.message || 'Failed to save invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToSupplierInvoices = () => {
    setActiveTab('supplierInvoices');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <PurchasePortalHeader onSearch={handleSearch} />
      <PurchasePortalNav activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading[activeTab] ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'purchaseOrders' && (
              <PurchaseOrderSection
                purchaseOrders={purchaseOrders}
                onAddOrder={handleAddPurchaseOrder}
                onEditOrder={handleEditPurchaseOrder}
                onDeleteOrder={handleDeletePurchaseOrder}
              />
            )}
            
            {activeTab === 'goodsReceipts' && (
              <GoodsReceiptSection
                goodsReceipts={goodsReceipts}
                onAddReceipt={handleAddGoodsReceipt}
                onEditReceipt={handleEditGoodsReceipt}
                onDeleteReceipt={handleDeleteGoodsReceipt}
                onNavigateToSupplierInvoices={handleNavigateToSupplierInvoices}
              />
            )}
            
            {activeTab === 'supplierInvoices' && (
              <SupplierInvoiceSection
                supplierInvoices={supplierInvoices}
                onAddInvoice={handleAddSupplierInvoice}
                onEditInvoice={handleEditSupplierInvoice}
                onDeleteInvoice={handleDeleteSupplierInvoice}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <PurchaseOrderModal
        isOpen={isPurchaseOrderModalOpen}
        onClose={() => setIsPurchaseOrderModalOpen(false)}
        onSave={handleSavePurchaseOrder}
        orderData={currentPurchaseOrder}
        mode={purchaseOrderModalMode}
        isLoading={isLoading}
      />
      
      <GoodsReceiptModal
        isOpen={isGoodsReceiptModalOpen}
        onClose={() => setIsGoodsReceiptModalOpen(false)}
        onSave={handleSaveGoodsReceipt}
        receiptData={currentGoodsReceipt}
        mode={goodsReceiptModalMode}
        itemOptions={itemOptions}
        purchaseOrders={purchaseOrders}
        isLoading={isLoading}
      />
      
      <SupplierInvoiceModal
        isOpen={isSupplierInvoiceModalOpen}
        onClose={() => setIsSupplierInvoiceModalOpen(false)}
        onSave={handleSaveSupplierInvoice}
        invoiceData={currentSupplierInvoice}
        mode={supplierInvoiceModalMode}
        purchaseOrders={purchaseOrders}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PurchasePortalPage;