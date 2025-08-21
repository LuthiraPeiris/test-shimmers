import React, { useState, useEffect, useRef } from 'react';

const SupplierInvoiceModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  invoiceData, 
  mode, 
  purchaseOrders 
}) => {
  const [formData, setFormData] = useState({
    In_No: '',
    Po_Id: '',
    Supplier_Id: '',
    Supplier_Name: '',
    Item_Code: '',
    Item_Name: '',
    Pack_Size: '',
    Total_Amount: 0,
    Status: 'PENDING',
    Created_Date: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingPo, setIsFetchingPo] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      if (mode === 'edit' && invoiceData) {
        setFormData({
          In_No: invoiceData.In_No || '',
          Po_Id: invoiceData.Po_Id || '',
          Supplier_Id: invoiceData.Supplier_Id || '',
          Supplier_Name: invoiceData.Supplier_Name || '',
          Item_Code: invoiceData.Item_Code || '',
          Item_Name: invoiceData.Item_Name || '',
          Pack_Size: invoiceData.Pack_Size || '',
          Total_Amount: invoiceData.Total_Amount || 0,
          Status: invoiceData.Status || 'PENDING',
          Created_Date: invoiceData.Created_Date || new Date().toISOString().split('T')[0]
        });
      } else {
        setFormData({
          In_No: '',
          Po_Id: '',
          Supplier_Id: '',
          Supplier_Name: '',
          Item_Code: '',
          Item_Name: '',
          Pack_Size: '',
          Total_Amount: 0,
          Status: 'PENDING',
          Created_Date: new Date().toISOString().split('T')[0]
        });
      }
      initializedRef.current = true;
    }

    if (!isOpen) {
      initializedRef.current = false;
    }
  }, [isOpen, invoiceData, mode]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [id]: id === 'Total_Amount' ? parseFloat(value) || 0 : value 
    }));
  };

  const handlePoChange = async (e) => {
    const poId = e.target.value;
    setIsFetchingPo(true);
    
    if (!poId) {
      setFormData(prev => ({
        ...prev,
        Po_Id: '',
        Supplier_Id: '',
        Supplier_Name: '',
        Item_Code: '',
        Item_Name: '',
        Pack_Size: '',
        Total_Amount: 0
      }));
      setIsFetchingPo(false);
      return;
    }

    try {
      // First try to fetch from API
      const response = await fetch('/api/supplier-invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'autofill',
          Po_Id: poId 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("purchase data".data);
        if (data.success && data.data) {
          setFormData(prev => ({
            ...prev,
            Po_Id: poId,
            ...data.data
          }));
          setIsFetchingPo(false);
          return;
        }
      }

      // Fallback to local data if API fails
      const selectedPo = purchaseOrders.find(po => po.Po_Id === poId);
      if (selectedPo) {
        setFormData(prev => ({
          ...prev,
          Po_Id: poId,
          Supplier_Id: selectedPo.Supplier_Id,
          Supplier_Name: selectedPo.Supplier_Name,
          Item_Code: selectedPo.Item_Code,
          Item_Name: selectedPo.Item_Name,
          Pack_Size: selectedPo.Pack_Size || '',
          Total_Amount: (selectedPo.Price * selectedPo.Quantity) - (selectedPo.DisValue || 0)
        }));
      }
    } catch (error) {
      console.error('Error fetching autofill data:', error);
      // Fallback to local data on error
      const selectedPo = purchaseOrders.find(po => po.Po_Id === poId);
      if (selectedPo) {
        setFormData(prev => ({
          ...prev,
          Po_Id: poId,
          Supplier_Id: selectedPo.Supplier_Id,
          Supplier_Name: selectedPo.Supplier_Name,
          Item_Code: selectedPo.Item_Code,
          Item_Name: selectedPo.Item_Name,
          Pack_Size: selectedPo.Pack_Size || '',
          Total_Amount: (selectedPo.Price * selectedPo.Quantity) - (selectedPo.DisValue || 0)
        }));
      }
    } finally {
      setIsFetchingPo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate required fields
    const requiredFields = ['Po_Id', 'Supplier_Id', 'Supplier_Name', 'Item_Code', 'Item_Name', 'Total_Amount', 'Status', 'Created_Date'];
    const missingFields = requiredFields.filter(field => !formData[field] && formData[field] !== 0);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        Total_Amount: Number(formData.Total_Amount) || 0,
        Pack_Size: formData.Pack_Size || '' // Ensure Pack_Size is at least empty string
      };
      
      // Remove In_No for new invoices (it will be auto-generated by API)
      if (mode === 'add') {
        delete submitData.In_No;
      }
      
      await onSave(submitData);
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {mode === 'add' ? 'Add New Supplier Invoice' : 'Edit Supplier Invoice'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Po_Id">
              Related Purchase Order *
            </label>
            <select 
              id="Po_Id" 
              value={formData.Po_Id} 
              onChange={handlePoChange} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              disabled={isSubmitting || isFetchingPo}
            >
              <option value="">Select PO</option>
              {purchaseOrders.map(po => (
                <option key={po.Po_Id} value={po.Po_Id}>
                  {po.Po_Id} - {po.Item_Name} ({po.Supplier_Name})
                </option>
              ))}
            </select>
            {isFetchingPo && (
              <div className="mt-1 text-sm text-blue-600">Loading PO details...</div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Supplier_Id">
                Supplier ID *
              </label>
              <input 
                type="text" 
                id="Supplier_Id" 
                value={formData.Supplier_Id || ''} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Supplier_Name">
                Supplier Name *
              </label>
              <input 
                type="text" 
                id="Supplier_Name" 
                value={formData.Supplier_Name || ''} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Item_Code">
                Item Code *
              </label>
              <input 
                type="text" 
                id="Item_Code" 
                value={formData.Item_Code || ''} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Item_Name">
                Item Name *
              </label>
              <input 
                type="text" 
                id="Item_Name" 
                value={formData.Item_Name || ''} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Pack_Size">
                Pack Size
              </label>
              <input 
                type="text" 
                id="Pack_Size" 
                value={formData.Pack_Size || ''} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Total_Amount">
                Total Amount *
              </label>
              <input 
                type="number" 
                id="Total_Amount" 
                value={formData.Total_Amount || 0} 
                onChange={handleChange} 
                required 
                min="0" 
                step="0.01" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Status">
                Status *
              </label>
              <select 
                id="Status" 
                value={formData.Status} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                disabled={isSubmitting}
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Created_Date">
                Invoice Date *
              </label>
              <input 
                type="date" 
                id="Created_Date" 
                value={formData.Created_Date || ''} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'add' ? 'Adding...' : 'Saving...'}
                </span>
              ) : (
                mode === 'add' ? 'Add Invoice' : 'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierInvoiceModal;