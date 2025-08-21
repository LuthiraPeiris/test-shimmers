'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function QuotationModal({ isOpen, onClose, quotation, mode, onSave, itemOptions = [] }) {
  const [formData, setFormData] = useState({
    Quatation_Id: '',
    Customer_Name: '',
    Date_Created: new Date().toISOString().split('T')[0],
    Valid_Until: '',
    Status: 'Pending',
    Item_Code: '',
    Item_Name: '',
    Quantity: 1,
    Total_Amount: 0,
    Discount: 0,
    Grand_Total: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fill form for edit or reset for add
  useEffect(() => {
    if (isOpen && quotation) {
      setFormData({
        Quatation_Id: quotation.Quatation_Id || quotation.quotationId || '',
        Customer_Name: quotation.Customer_Name || quotation.customerName || '',
        Date_Created: quotation.Date_Created || quotation.dateCreated || new Date().toISOString().split('T')[0],
        Valid_Until: quotation.Valid_Until || quotation.validUntil || '',
        Status: quotation.Status || quotation.status || 'Pending',
        Item_Code: quotation.Item_Code || quotation.itemCode || '',
        Item_Name: quotation.Item_Name || quotation.itemName || '',
        Quantity: quotation.Quantity || quotation.quantity || 1,
        Total_Amount: quotation.Total_Amount || quotation.totalAmount || 0,
        Discount: quotation.Discount || quotation.discount || 0,
        Grand_Total: quotation.Grand_Total || quotation.grandTotal || 0,
      });
    } else if (isOpen && !quotation && mode === 'add') {
      setFormData({
        Quatation_Id: '',
        Customer_Name: '',
        Date_Created: new Date().toISOString().split('T')[0],
        Valid_Until: '',
        Status: 'Pending',
        Item_Code: '',
        Item_Name: '',
        Quantity: 1,
        Total_Amount: 0,
        Discount: 0,
        Grand_Total: 0,
      });
    }
  }, [isOpen, quotation, mode]);

  // Handle changes and auto-fill
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      // Auto-fill item name from dropdown
      if (name === 'Item_Code') {
        const selectedItem = itemOptions.find(item => item.Item_Code === value);
        updated.Item_Name = selectedItem ? selectedItem.Item_Name : '';
      }

      // Auto-calculate grand total
      if (['Total_Amount', 'Discount', 'Quantity'].includes(name)) {
        const total = parseFloat(updated.Total_Amount) || 0;
        const discount = parseFloat(updated.Discount) || 0;
        const quantity = parseInt(updated.Quantity) || 1;
        updated.Grand_Total = (total * quantity) - discount;
      }

      return updated;
    });

    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Customer_Name.trim()) newErrors.Customer_Name = 'Customer name is required';
    if (!formData.Date_Created) newErrors.Date_Created = 'Date created is required';
    if (!formData.Valid_Until) newErrors.Valid_Until = 'Valid until date is required';
    if (!formData.Item_Code.trim()) newErrors.Item_Code = 'Item code is required';
    if (!formData.Item_Name.trim()) newErrors.Item_Name = 'Item name is required';
    if (formData.Quantity < 1) newErrors.Quantity = 'Quantity must be at least 1';
    if (formData.Total_Amount < 0) newErrors.Total_Amount = 'Total amount must be positive';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        Quantity: parseInt(formData.Quantity),
        Total_Amount: parseFloat(formData.Total_Amount),
        Discount: parseFloat(formData.Discount),
        Grand_Total: parseFloat(formData.Grand_Total),
      };

      await onSave(payload);
      toast.success(mode === 'add' ? 'Quotation created successfully' : 'Quotation updated successfully');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save quotation');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
            {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">{mode === 'add' ? 'Create New Quotation' : 'Edit Quotation'}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Item Code Dropdown */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Item Code *</label>
              <select
                name="Item_Code"
                value={formData.Item_Code}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              >
                <option value="">-- Select Item Code --</option>
                {itemOptions.map(item => (
                  <option key={item.Item_Code} value={item.Item_Code} className="text-black">
                    {item.Item_Code}
                  </option>
                ))}
              </select>
              {errors.Item_Code && <p className="text-red-500 text-xs mt-1">{errors.Item_Code}</p>}
            </div>

            {/* Auto-filled Item Name */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Item Name *</label>
              <input
                type="text"
                name="Item_Name"
                value={formData.Item_Name}
                readOnly
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-black"
              />
              {errors.Item_Name && <p className="text-red-500 text-xs mt-1">{errors.Item_Name}</p>}
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Customer Name *</label>
                <input
                  type="text"
                  name="Customer_Name"
                  value={formData.Customer_Name}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2 ${errors.Customer_Name ? 'border-red-500' : 'border-gray-300'} text-black`}
                  placeholder="Enter customer name"
                />
                {errors.Customer_Name && <p className="text-red-500 text-xs mt-1">{errors.Customer_Name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Status</label>
                <select
                  name="Status"
                  value={formData.Status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Date Created *</label>
                <input
                  type="date"
                  name="Date_Created"
                  value={formData.Date_Created}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2 ${errors.Date_Created ? 'border-red-500' : 'border-gray-300'} text-black`}
                />
                {errors.Date_Created && <p className="text-red-500 text-xs mt-1">{errors.Date_Created}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Valid Until *</label>
                <input
                  type="date"
                  name="Valid_Until"
                  value={formData.Valid_Until}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2 ${errors.Valid_Until ? 'border-red-500' : 'border-gray-300'} text-black`}
                />
                {errors.Valid_Until && <p className="text-red-500 text-xs mt-1">{errors.Valid_Until}</p>}
              </div>
            </div>

            {/* Quantity, Price, Discount */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Quantity *</label>
                <input
                  type="number"
                  name="Quantity"
                  value={formData.Quantity}
                  onChange={handleChange}
                  min="1"
                  className={`w-full rounded-lg border px-3 py-2 ${errors.Quantity ? 'border-red-500' : 'border-gray-300'} text-black`}
                />
                {errors.Quantity && <p className="text-red-500 text-xs mt-1">{errors.Quantity}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Unit Price *</label>
                <input
                  type="number"
                  name="Total_Amount"
                  value={formData.Total_Amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full rounded-lg border px-3 py-2 ${errors.Total_Amount ? 'border-red-500' : 'border-gray-300'} text-black`}
                />
                {errors.Total_Amount && <p className="text-red-500 text-xs mt-1">{errors.Total_Amount}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Discount</label>
                <input
                  type="number"
                  name="Discount"
                  value={formData.Discount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Grand Total</label>
                <input
                  type="number"
                  value={formData.Grand_Total}
                  readOnly
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-black"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    {mode === 'add' ? 'Create Quotation' : 'Update Quotation'}
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
