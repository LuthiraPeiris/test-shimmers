// components/purchase-portal/GoodsReceiptSection.jsx
import React from "react";
import { formatDate, getStatusBadge } from "../../utils/purchasePortalUtils"; // We'll create this utility file

const GoodsReceiptSection = ({
  goodsReceipts,
  onAddReceipt,
  onEditReceipt,
  onDeleteReceipt,
  onNavigateToSupplierInvoices,
}) => {
  // Calculate stats (these would ideally come from an API endpoint)
  const completedGRs = goodsReceipts.filter(
    (receipt) => receipt.Status === "RECEIVED" || receipt.Status === "INSPECTED"
  ).length;
  const pendingGRs = goodsReceipts.filter(
    (receipt) => receipt.Status === "PENDING"
  ).length;
  const itemsReceived = goodsReceipts.reduce(
    (sum, receipt) => sum + (receipt.Quantity || 0),
    0
  ); // Assuming quantity is added to GR

  return (
    <div className="fade-in">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Goods Receipts</h2>
            <p className="mt-2 text-gray-600">
              Record and track incoming goods from suppliers.
            </p>
          </div>
          <div className="flex space-x-3">
            {/* <button
              onClick={onNavigateToSupplierInvoices}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>View Supplier Invoices</span>
            </button> */}
            <button
              onClick={onAddReceipt}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>New Goods Receipt</span>
            </button>
          </div>
        </div>
      </div>



      {/* Goods Receipts Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Goods Receipts
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GRN ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PO ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MFG Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th> */}
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {goodsReceipts.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No goods receipts found.
                  </td>
                </tr>
              ) : (
                goodsReceipts.map((receipt) => (
                  <tr key={receipt.GRN_ID}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {receipt.GRN_ID}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {receipt.Po_Id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {receipt.Item_Code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {receipt.Item_Name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {receipt.Quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {receipt.Unit_Price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {receipt.Total_Amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(receipt.MF_Date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(receipt.Ex_Date)}
                    </td>
                    {/* <td className="px-6 py-4">
                      {getStatusBadge(receipt.Status)}
                    </td> */}
                    <td className="px-6 py-4 text-sm font-medium">
                      {/* <button
                        onClick={() => onEditReceipt(receipt)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteReceipt(receipt.GRN_ID)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GoodsReceiptSection;
