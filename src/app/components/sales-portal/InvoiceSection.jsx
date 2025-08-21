import React from "react";
import {
  formatCurrency,
  formatDate,
  getStatusBadge,
} from "../../utils/salesPortalUtils";

const InvoiceSection = ({
  invoices = [],
  onAddInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onViewItems,
  onViewInvoice,
}) => {
  // Status counts with case-insensitive matching and flexible field access
  const paidInvoices = invoices.filter((inv) => {
    const status = String(inv.Status || inv.status || "").toUpperCase();
    return status === "PAID" || status === "COMPLETED" || status === "SETTLED";
  }).length;

  const overdueInvoices = invoices.filter((inv) => {
    const status = String(inv.Status || inv.status || "").toUpperCase();
    return status === "OVERDUE";
  }).length;

  const pendingInvoices = invoices.filter((inv) => {
    const status = String(inv.Status || inv.status || "").toUpperCase();
    return status === "PENDING";
  }).length;

  const confirmedInvoices = invoices.filter((inv) => {
    const status = String(inv.Status || inv.status || "").toUpperCase();
    return status === "CONFIRMED";
  }).length;

  // Financial calculations with safe parsing and flexible status matching

  const totalRevenue = invoices
    .filter((inv) => {
      const status = String(inv.Status || inv.status || "").toUpperCase();
      return (
        status === "PAID" || status === "COMPLETED" || status === "SETTLED"
      );
    })
    .reduce((sum, inv) => {
      const amount = parseFloat(
        inv.Grand_Total ||
          inv.total_amount ||
          inv.Total_Amount ||
          inv.total ||
          0
      );
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

  // Active customers with safe ID extraction
  const activeCustomers = new Set(
    invoices.map((inv) => inv.Customer_ID || inv.customer_id).filter(Boolean)
  ).size;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Customer Invoices
            </h2>
            <p className="mt-2 text-gray-600">
              Manage customer invoices, payments, and billing information.
            </p>
          </div>
          <button
            onClick={onAddInvoice}
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
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Now in a 4-column grid like SalesOrderSection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Pending */}
        <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingInvoices}
              </p>
            </div>
          </div>
        </div>

        {/* Confirmed */}
        <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {confirmedInvoices}
              </p>
            </div>
          </div>
        </div>

        {/* Paid */}
        <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-gray-900">{paidInvoices}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Active Customers</p>
          <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Invoices
            </h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.Invoice_No} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.Invoice_No}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.Customer_Name || invoice.Customer_ID}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.Customer_ID}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(invoice.Invoice_Date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.Grand_Total || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onViewItems(invoice)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        View Items
                      </button>
                      <button
                        onClick={() => onEditInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteInvoice(invoice.Invoice_ID)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
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

export default InvoiceSection;
