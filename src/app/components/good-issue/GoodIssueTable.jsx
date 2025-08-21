import React from 'react';

const GoodIssueTable = ({ issues, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="table-container overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Good Issue ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {issues.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  No issues found.
                </td>
              </tr>
            ) : (
              issues.map((issue) => (
                <tr key={issue.goodIssueId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{issue.goodIssueId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{issue.itemCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{issue.itemName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{issue.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{issue.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{issue.createdDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        aria-label="Edit Issue"
                        onClick={() => onEdit(issue)}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 font-medium"
                        aria-label="Delete Issue"
                        onClick={() => onDelete(issue.goodIssueId)}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div> */}
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

export default GoodIssueTable;
