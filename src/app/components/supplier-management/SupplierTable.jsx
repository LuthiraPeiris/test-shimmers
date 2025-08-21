import React from 'react';

const SupplierTable = ({ suppliers, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  No suppliers found.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier.Supplier_Id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.Supplier_Id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.Supplier_Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.Country || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.Email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.Phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.Address || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        supplier.Status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {supplier.Status || 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => onEdit(supplier)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => onDelete(supplier.Supplier_Id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierTable;
