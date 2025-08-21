// components/purchase-portal/PurchaseOrderSection.jsx
import React from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlusCircle,
  FaClipboardList,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const PurchaseOrderSection = ({
  purchaseOrders,
  onAddOrder,
  onEditOrder,
  onDeleteOrder,
  onViewOrder, // ✅ added back
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaClipboardList className="text-white" />
          Purchase Orders
        </h2>
        <button
          onClick={onAddOrder}
          className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-blue-50 transition"
        >
          <FaPlusCircle /> Add New PO
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "PO ID",
                "Date",
                "Supplier",
                "Item",
                "Price",
                "Qty",
                "Discount",
                "Total",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchaseOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="px-6 py-8 text-center text-gray-500 italic"
                >
                  No purchase orders found
                </td>
              </tr>
            ) : (
              purchaseOrders.map((order) => (
                <tr
                  key={order.Po_Id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.Po_Id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.Created_Date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {order.Supplier_Name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.Item_Name || order.Item_Code || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(order.Price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.Quantity || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(order.DisValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(order.TotValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        order.Status
                      )}`}
                    >
                      {order.Status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      {/* <button
                        onClick={() => onViewOrder(order)}
                        data-tooltip-id="tooltip"
                        data-tooltip-content="View Order"
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <FaEye size={18} />
                      </button> */}
                      <button
                        onClick={() => onEditOrder(order)}
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Edit Order"
                        className="text-green-600 hover:text-green-800 transition"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => onDeleteOrder(order.Po_Id)}
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Delete Order"
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tooltip Component */}
      <Tooltip id="tooltip" place="top" effect="solid" className="z-50" />
    </div>
  );
};

export default PurchaseOrderSection;
