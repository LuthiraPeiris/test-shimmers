'use client'
import React, { useState, useEffect } from 'react';

const CustomerModal = ({
  isOpen,
  onClose,
  customerData,
  mode,
  onSave
}) => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Address: ''
  });

  useEffect(() => {
    if (isOpen && customerData && mode === 'edit') {
      setFormData({
        Name: customerData.name || '',
        Email: customerData.email || '',
        Phone: customerData.phone || '',
        Address: customerData.address || ''
      });
    } else if (isOpen && mode === 'add') {
      setFormData({
        Name: '',
        Email: '',
        Phone: '',
        Address: ''
      });
    }
  }, [customerData, isOpen, mode]);

  if (!isOpen) return null;

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (mode === 'edit') {
      onSave({ ...customerData, ...formData });
    } else {
      onSave(formData);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
          onClick={onClose}
          aria-label="Close Modal"
        >
          ×
        </button>
        <div className="mb-4 text-xl font-bold text-gray-800">
          {mode === 'edit' ? 'Edit Customer' : 'Add Customer'}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'edit' && (
            <div>
              <label className="block text-gray-700">Customer ID</label>
              <input
                type="text"
                name="id"
                className="mt-1 px-3 py-2 border rounded-lg w-full bg-gray-100 text-gray-800"
                value={customerData?.id || ''}
                disabled
                readOnly
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="Name"
              required
              className="mt-1 px-3 py-2 border rounded-lg w-full bg-gray-50 text-gray-800 focus:ring focus:ring-blue-100"
              value={formData.Name}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="Email"
              required
              className="mt-1 px-3 py-2 border rounded-lg w-full bg-gray-50 text-gray-800 focus:ring focus:ring-blue-100"
              value={formData.Email}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="Phone"
              required
              className="mt-1 px-3 py-2 border rounded-lg w-full bg-gray-50 text-gray-800 focus:ring focus:ring-blue-100"
              value={formData.Phone}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="Address"
              required
              className="mt-1 px-3 py-2 border rounded-lg w-full bg-gray-50 text-gray-800 focus:ring focus:ring-blue-100"
              value={formData.Address}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="flex mt-6 space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              {mode === 'edit' ? 'Save Changes' : 'Add Customer'}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
