import React, { useState, useEffect } from 'react';

const GoodIssueModal = ({ isOpen, onClose, issueData, mode, onSave }) => {
  const [formData, setFormData] = useState({
    goodIssueId: '',
    itemCode: '',
    itemName: '',
    quantity: '',
    createdDate: new Date().toISOString().split('T')[0],
  });

  const [itemOptions, setItemOptions] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/item-master');
        const data = await res.json();
        setItemOptions(data);
      } catch (err) {
        console.error('Error fetching item list:', err);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    if (isOpen && issueData) {
      setFormData({
        goodIssueId: issueData.goodIssueId || '',
        itemCode: issueData.itemCode || '',
        itemName: issueData.itemName || '',
        quantity: issueData.quantity || '',
        Reason:issueData.reason || '',
        createdDate: issueData.createdDate || new Date().toISOString().split('T')[0],
      });
    } else if (isOpen && !issueData && mode === 'add') {
      setFormData({
        goodIssueId: '',
        itemCode: '',
        itemName: '',
        quantity: '',
        reason: '',
        createdDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [isOpen, issueData, mode]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    // If itemCode changed, auto-fill itemName
    if (id === 'itemCode') {
      const selectedItem = itemOptions.find(item => item.Item_Code === value);
      setFormData((prev) => ({
        ...prev,
        itemCode: value,
        itemName: selectedItem ? selectedItem.Item_Name : '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const quantity = parseInt(formData.quantity, 10);
    if (!formData.itemCode || !formData.itemName || !formData.quantity || isNaN(quantity) || quantity <= 0) {
      alert('Please fill in all required fields correctly.');
      return;
    }
    const formattedData = {
      ...formData,
      quantity,
      createdDate: formData.createdDate || new Date().toISOString().split('T')[0],
    };
    onSave(formattedData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-black">{mode === 'add' ? 'Add Good Issue' : 'Edit Good Issue'}</h2>
            <button className="text-black hover:text-gray-700 text-xl" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Item Code dropdown */}
            <div>
              <label htmlFor="itemCode" className="block text-sm font-medium text-black mb-1">Item Code</label>
              <select
                id="itemCode"
                value={formData.itemCode}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              >
                <option className='text-black' value="">-- Select Item Code --</option>
                {itemOptions.map((item) => (
                  <option key={item.Item_Code} value={item.Item_Code} className="text-black">
                    {item.Item_Code}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-filled Item Name (readonly) */}
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium text-black mb-1">Item Name</label>
              <input
                type="text"
                id="itemName"
                value={formData.itemName}
                readOnly
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-black"
              />
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-black mb-1">Quantity</label>
              <input
                type="number"
                id="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black"
              />
            </div>
                      <div>
              <label htmlFor="reason" className="block text-sm font-medium text-black mb-1">Reason</label>
              <input
                type="text"
                id="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-black"
              />
            </div>


            {/* Created Date */}
            <div>
              <label htmlFor="createdDate" className="block text-sm font-medium text-black mb-1">Created Date</label>
              <input
                type="date"
                id="createdDate"
                value={formData.createdDate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black"
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-black bg-white rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoodIssueModal;
