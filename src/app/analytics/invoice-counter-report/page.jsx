"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaBoxOpen, 
  FaCalendarAlt, 
  FaUsers, 
  FaTruck, 
  FaChartBar, 
  FaFileInvoiceDollar,
  FaDollarSign,
  FaBarcode,
  FaTags,
  FaFilter,
  FaSync,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaDownload,
  FaFileCsv
} from "react-icons/fa";
import "../../globals.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function InvoiceCounterReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [invoiceData, setInvoiceData] = useState([]);
  const [invoiceCounts, setInvoiceCounts] = useState([]);

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (selectedStatus && selectedStatus !== "all") params.append("status", selectedStatus);

      const response = await fetch(`/api/reports/invoice_counter_report?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setInvoiceData(data.data);
        setInvoiceCounts(data.counts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const pendingInvoices = invoiceData.filter(item => item.status === "PENDING");
    const paidInvoices = invoiceData.filter(item => item.status === "PAID");
    const overdueInvoices = invoiceData.filter(item => item.status === "OVERDUE");
    
    const pendingTotal = pendingInvoices.reduce((acc, item) => acc + (Number(item.Grand_Total) || 0), 0);
    const paidTotal = paidInvoices.reduce((acc, item) => acc + (Number(item.Grand_Total) || 0), 0);
    const overdueTotal = overdueInvoices.reduce((acc, item) => acc + (Number(item.Grand_Total) || 0), 0);
    
    return {
      totalInvoices: invoiceData.length,
      pendingCount: pendingInvoices.length,
      paidCount: paidInvoices.length,
      overdueCount: overdueInvoices.length,
      pendingTotal: pendingTotal || 0,
      paidTotal: paidTotal || 0,
      overdueTotal: overdueTotal || 0,
      grandTotal: (pendingTotal || 0) + (paidTotal || 0) + (overdueTotal || 0)
    };
  }, [invoiceData]);

  // Export to CSV functionality
  const exportToCSV = () => {
    const headers = [
      "Invoice No",
      "Customer ID",
      "User ID",
      "Invoice Date",
      "Payment Terms",
      "Total Amount",
      "Tax Amount",
      "Grand Total",
      "Status",
      "Notes"
    ];

    const csvData = invoiceData.map(invoice => [
      invoice.Invoice_No || '',
      invoice.Customer_ID || '',
      invoice.User_ID || '',
      invoice.Invoice_Date || '',
      invoice.Payment_Terms || '',
              (Number(invoice.Total_Amount) || 0).toFixed(2),
              (Number(invoice.Tax_Amount) || 0).toFixed(2),
              (Number(invoice.Grand_Total) || 0).toFixed(2),
      invoice.status || '',
      invoice.Notes || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `invoice_counter_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export function
  const handleExportReport = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Invoice Counter Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);

    const tableData = invoiceData.map(invoice => [
      invoice.Invoice_No,
      invoice.Customer_ID,
      invoice.User_ID,
      invoice.Invoice_Date,
      invoice.Payment_Terms,
              `$${Number(invoice.Total_Amount).toFixed(2)}`,
              `$${Number(invoice.Tax_Amount).toFixed(2)}`,
              `$${Number(invoice.Grand_Total).toFixed(2)}`,
              invoice.status,
      invoice.Notes
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Invoice No", "Customer ID", "User ID", "Date", "Payment Terms", "Total Amount", "Tax Amount", "Grand Total", "Status", "Notes"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 8 }
    });

    doc.text(`Total Invoices: ${statistics.totalInvoices}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Pending Invoices: ${statistics.pendingCount} ($${Number(statistics.pendingTotal).toFixed(2)})`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Paid Invoices: ${statistics.paidCount} ($${Number(statistics.paidTotal).toFixed(2)})`, 14, doc.lastAutoTable.finalY + 22);
    doc.text(`Overdue Invoices: ${statistics.overdueCount} ($${Number(statistics.overdueTotal).toFixed(2)})`, 14, doc.lastAutoTable.finalY + 28);
    doc.text(`Grand Total Amount: $${Number(statistics.grandTotal).toFixed(2)}`, 14, doc.lastAutoTable.finalY + 34);

    doc.save(`invoice_counter_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Filter handler
  const handleApplyFilters = () => {
    fetchData();
  };

  // Reset filters
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedStatus("all");
    fetchData();
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "PAID": return <FaCheckCircle className="text-green-600" />;
      case "OVERDUE": return <FaExclamationTriangle className="text-red-600" />;
      case "PENDING": return <FaClock className="text-yellow-600" />;
      default: return <FaClock className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "PAID": return "bg-green-100 text-green-800";
      case "OVERDUE": return "bg-red-100 text-red-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Load initial data
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 min-h-screen text-black bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <motion.header
        className="mb-8 border-b border-gray-200 pb-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-5 rounded-md shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaFileInvoiceDollar /> Invoice Counter Report
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Track and analyze customer invoice counts by status
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button 
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
          >
            <FaFileCsv /> Export CSV
          </button>
          <button 
            onClick={handleExportReport}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
          >
            <FaDownload /> Download PDF
          </button>
        </div>
      </motion.header>

      {/* Filters */}
      <motion.div 
        className="mb-8 bg-white p-6 rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaFilter className="text-blue-600" /> Filters & Search
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Invoice Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleApplyFilters}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <FaSync className="animate-spin" /> : <FaFilter />}
              {loading ? "Loading..." : "Apply"}
            </button>
            <button
              onClick={handleResetFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Invoices</p>
              <p className="text-3xl font-bold">{statistics.totalInvoices}</p>
            </div>
            <FaFileInvoiceDollar className="text-4xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending Invoices</p>
              <p className="text-3xl font-bold">{statistics.pendingCount}</p>
            </div>
            <FaClock className="text-4xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Paid Invoices</p>
              <p className="text-3xl font-bold">{statistics.paidCount}</p>
            </div>
            <FaCheckCircle className="text-4xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Overdue Invoices</p>
              <p className="text-3xl font-bold">{statistics.overdueCount}</p>
            </div>
            <FaExclamationTriangle className="text-4xl opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Invoice Counts Summary */}
      <motion.div 
        className="mb-8 bg-white p-6 rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartBar className="text-blue-600" /> Invoice Count Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {invoiceCounts.map((count) => (
            <div key={count.status} className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    {getStatusIcon(count.status)}
                  </div>
                  <span className="font-medium capitalize">{count.status} Invoices</span>
                </div>
                <span className="text-2xl font-bold text-gray-700">
                  {count.InvoiceCount}
                </span>
              </div>
            </div>
          ))}
          
          {/* Total Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FaDollarSign className="text-blue-600" />
                </div>
                <span className="font-medium">Total Amount</span>
              </div>
              <span className="text-xl font-bold text-blue-700">
                ${statistics.grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Invoice Data Table */}
      <motion.div 
        className="overflow-x-auto bg-white rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaFileInvoiceDollar className="text-blue-600" /> 
            Invoice Details ({invoiceData.length} records)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Invoice No</th>
                <th className="px-4 py-3 font-semibold">Customer ID</th>
                <th className="px-4 py-3 font-semibold">
                  <FaUser className="inline mr-2" />User ID
                </th>
                <th className="px-4 py-3 font-semibold">
                  <FaCalendarAlt className="inline mr-2" />Invoice Date
                </th>
                <th className="px-4 py-3 font-semibold">Payment Terms</th>
                <th className="px-4 py-3 font-semibold">
                  <FaDollarSign className="inline mr-2" />Total Amount
                </th>
                <th className="px-4 py-3 font-semibold">
                  <FaDollarSign className="inline mr-2" />Tax Amount
                </th>
                <th className="px-4 py-3 font-semibold">
                  <FaDollarSign className="inline mr-2" />Grand Total
                </th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoiceData.map((invoice, index) => (
                <tr
                  key={`${invoice.Invoice_ID}-${index}`}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-blue-600">{invoice.Invoice_No}</td>
                  <td className="px-4 py-3">{invoice.Customer_ID}</td>
                  <td className="px-4 py-3">{invoice.User_ID}</td>
                  <td className="px-4 py-3">{invoice.Invoice_Date}</td>
                  <td className="px-4 py-3">{invoice.Payment_Terms}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    ${Number(invoice.Total_Amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-orange-600">
                    ${Number(invoice.Tax_Amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-bold text-green-600">
                    ${Number(invoice.Grand_Total).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate" title={invoice.Notes}>
                    {invoice.Notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoiceData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FaBoxOpen className="text-4xl mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No invoices found</p>
            <p className="text-sm">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </motion.div>

      {/* Summary Footer */}
      <motion.div
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-yellow-50 to-amber-100 p-6 rounded-md border border-amber-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-amber-700">
            <FaClock /> Pending Invoices Summary
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Count: <span className="font-semibold">{statistics.pendingCount}</span></p>
            <p className="text-sm">Total Amount: <span className="font-semibold text-yellow-600">${statistics.pendingTotal.toFixed(2)}</span></p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-md border border-emerald-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700">
            <FaCheckCircle /> Paid Invoices Summary
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Count: <span className="font-semibold">{statistics.paidCount}</span></p>
            <p className="text-sm">Total Amount: <span className="font-semibold text-green-600">${statistics.paidTotal.toFixed(2)}</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-rose-100 p-6 rounded-md border border-rose-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-rose-700">
            <FaExclamationTriangle /> Overdue Invoices Summary
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Count: <span className="font-semibold">{statistics.overdueCount}</span></p>
            <p className="text-sm">Total Amount: <span className="font-semibold text-red-600">${statistics.overdueTotal.toFixed(2)}</span></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
