import React from 'react';

const CustomerTable = ({ customers, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
    <div className="table-container overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Customer ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
              >
                No customers found.
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {customer.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {customer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {customer.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {customer.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      aria-label="Edit Customer"
                      onClick={() => onEdit(customer)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 font-medium"
                      aria-label="Delete Customer"
                      onClick={() => onDelete(customer.id)}
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

export default CustomerTable;
