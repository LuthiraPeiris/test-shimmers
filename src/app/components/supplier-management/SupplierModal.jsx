import React, { useState, useEffect } from 'react';

const SupplierModal = ({ isOpen, onClose, supplierData, mode, onSave }) => {
  const [formData, setFormData] = useState({
    Supplier_Id: '',
    Supplier_Name: '',
    Country: 'USA',
    Email: '',
    Phone: '',
    Address: '',
    Status: 'Active',
  });

  useEffect(() => {
    if (isOpen && supplierData) {
      setFormData({
        Supplier_Id: supplierData.Supplier_Id || '',
        Supplier_Name: supplierData.Supplier_Name || '',
        Country: supplierData.Country || 'USA',
        Email: supplierData.Email || '',
        Phone: supplierData.Phone || '',
        Address: supplierData.Address || '',
        Status: supplierData.Status || 'Active',
      });
    } else if (isOpen && !supplierData && mode === 'add') {
      setFormData({
        Supplier_Id: '',
        Supplier_Name: '',
        Country: 'USA',
        Email: '',
        Phone: '',
        Address: '',
        Status: 'Active',
      });
    }
  }, [isOpen, supplierData, mode]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { Supplier_Name, Country, Email, Phone, Address, Status } = formData;
    if (!Supplier_Name || !Country || !Email || !Phone || !Address || !Status) {
      alert('Please fill in all required fields.');
      return;
    }
    onSave(formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="supplierModal"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900" id="modalTitle">
              {mode === 'add' ? 'Add Supplier' : 'Edit Supplier'}
            </h2>
            <button
              id="closeModal"
              className="text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close Modal"
              onClick={onClose}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Supplier_Id">
                  Supplier ID
                </label>
                <input
                  type="text"
                  id="Supplier_Id"
                  className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`}
                  value={formData.Supplier_Id}
                  disabled={mode === 'edit'}
                  readOnly={mode === 'edit'}
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Supplier_Name">
                  Supplier Name
                </label>
                <input
                  type="text"
                  id="Supplier_Name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.Supplier_Name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Country">
                  Country
                </label>
                <select
                  id="Country"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.Country}
                  onChange={handleChange}
                  required
                >
                  <option>USA</option>
                  <option>Germany</option>
                  <option>China</option>
                  <option>Japan</option>
                  <option>UK</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Email">
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Phone">
                  Phone
                </label>
                <input
                  type="text"
                  id="Phone"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.Phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Address">
                  Address
                </label>
                <input
                  type="text"
                  id="Address"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.Address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Status">
                  Status
                </label>
                <select
                  id="Status"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.Status}
                  onChange={handleChange}
                  required
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Save Supplier
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal;
