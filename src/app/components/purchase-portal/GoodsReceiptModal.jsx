import React, { useState, useEffect } from 'react';

const GoodsReceiptModal = ({ isOpen, onClose, onSave, receiptData, mode, itemOptions, purchaseOrders }) => {
  const [formData, setFormData] = useState({
    GRN_ID: '',
    Po_Id: '',
    Item_Code: '',
    Item_Name: '',
    Quantity: 0,
    Unit_Price: 0,
    Total_Amount: 0,
    MF_Date: '',
    Ex_Date: '',
    Status: 'RECEIVED',
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && receiptData) {
        setFormData({
          ...receiptData,
          MF_Date: receiptData.MF_Date || new Date().toISOString().split('T')[0],
          Ex_Date: receiptData.Ex_Date || '',
          Quantity: receiptData.Quantity || 0,
          Unit_Price: receiptData.Unit_Price || 0,
          Total_Amount: receiptData.Total_Amount || 0,
        });
      } else {
        setFormData({
          GRN_ID: '',
          Po_Id: '',
          Item_Code: '',
          Item_Name: '',
          Quantity: 0,
          Unit_Price: 0,
          Total_Amount: 0,
          MF_Date: new Date().toISOString().split('T')[0],
          Ex_Date: '',
          Status: 'RECEIVED',
        });
      }
    }
  }, [isOpen, receiptData, mode]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === 'Item_Code') {
      const selectedItem = itemOptions.find(item => item.Item_Code === value);
      setFormData((prev) => ({
        ...prev,
        Item_Code: value,
        Item_Name: selectedItem ? selectedItem.Item_Name : '',
      }));
      return;
    }

    if (id === 'Po_Id') {
      setFormData((prev) => ({
        ...prev,
        Po_Id: value,
      }));
      return;
    }

    setFormData((prev) => {
      const updated = { ...prev, [id]: value };

      if (id === 'Quantity' || id === 'Unit_Price') {
        const quantity = id === 'Quantity' ? parseFloat(value) : parseFloat(prev.Quantity);
        const unitPrice = id === 'Unit_Price' ? parseFloat(value) : parseFloat(prev.Unit_Price);
        if (!isNaN(quantity) && !isNaN(unitPrice)) {
          updated.Total_Amount = (quantity * unitPrice).toFixed(2);
        }
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      Ex_Date: formData.Ex_Date || formData.MF_Date
    };
    
    onSave(submissionData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {mode === 'add' ? 'Add New Goods Receipt' : 'Edit Goods Receipt'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'edit' && (
            <div>
              <label htmlFor="GRN_ID" className="block text-sm font-medium text-gray-700 mb-2">GRN ID</label>
              <input
                type="text"
                id="GRN_ID"
                value={formData.GRN_ID}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
              />
            </div>
          )}

          <div>
            <label htmlFor="Po_Id" className="block text-sm font-medium text-gray-700 mb-2">Purchase Order ID</label>
            <select
              id="Po_Id"
              value={formData.Po_Id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="-">-- Select PO ID --</option>
              {purchaseOrders && purchaseOrders.map(order => (
                <option key={order.Po_Id} value={order.Po_Id}>
                  {order.Po_Id} - {order.Item_Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="Item_Code" className="block text-sm font-medium text-gray-700 mb-2">Item Code</label>
            <select
              id="Item_Code"
              value={formData.Item_Code}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Select Item Code --</option>
              {itemOptions.map(item => (
                <option key={item.Item_Code} value={item.Item_Code}>
                  {item.Item_Code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="Item_Name" className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
            <input
              type="text"
              id="Item_Name"
              value={formData.Item_Name}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="Quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                id="Quantity"
                value={formData.Quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="Unit_Price" className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
              <input
                type="number"
                id="Unit_Price"
                value={formData.Unit_Price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label htmlFor="Total_Amount" className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
            <input
              type="number"
              id="Total_Amount"
              value={formData.Total_Amount}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="MF_Date" className="block text-sm font-medium text-gray-700 mb-2">Manufacturing Date</label>
            <input
              type="date"
              id="MF_Date"
              value={formData.MF_Date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="Ex_Date" className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              type="date"
              id="Ex_Date"
              value={formData.Ex_Date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* <div>
            <label htmlFor="Status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              id="Status"
              value={formData.Status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="RECEIVED">Received</option>
              <option value="INSPECTED">Inspected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div> */}

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {mode === 'add' ? 'Add GR' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoodsReceiptModal;
