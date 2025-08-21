import React from 'react';

const QuotationTable = ({ quotations, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="table-container overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotation ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grand Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quotations.length === 0 ? (
              <tr>
                <td colSpan="12" className="px-6 py-4 text-center text-gray-500">
                  No quotations found.
                </td>
              </tr>
            ) : (
              quotations.map((quotation) => (
                <tr key={quotation.quotationId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-black">{quotation.quotationId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{quotation.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{quotation.dateCreated}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{quotation.validUntil}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{quotation.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{quotation.Item_Code || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{quotation.Item_Name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{quotation.Quantity || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">LKR {Number(quotation.totalAmount || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">LKR {Number(quotation.discount || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">LKR {Number(quotation.grandTotal || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => onEdit(quotation)}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 font-medium"
                        onClick={() => onDelete(quotation.quotationId)}
                      >
                        <i className="fas fa-trash"></i> Delete
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

export default QuotationTable;
