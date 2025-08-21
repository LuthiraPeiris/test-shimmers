"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaFileAlt, 
  FaCalendarAlt, 
  FaChartBar, 
  FaDollarSign,
  FaBarcode,
  FaTags,
  FaFilter,
  FaSync,
  FaBoxOpen,
  FaDownload,
  FaSearch,
  FaEye,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaQuoteLeft,
  FaTag,
  FaHandshake
} from "react-icons/fa";
import "../../globals.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function QuotationReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [quotations, setQuotations] = useState([]);
  const [error, setError] = useState(null);

  // Export functionality
  const handleExportReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Quotation Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);

    // Table
    const tableData = filteredData.map(item => [
      item.Quotation_ID,
      item.Customer_Name,
      item.Date_Created,
      item.Valid_Until,
      item.Item_Code,
      item.Item_Name,
      item.Quantity,
      `$${item.Total_Amount.toFixed(2)}`,
      `$${item.Discount.toFixed(2)}`,
      `$${item.Grand_Total.toFixed(2)}`,
      item.Status
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Quotation ID", "Customer Name", "Date Created", "Valid Until", "Item Code", "Item Name", "Quantity", "Total Amount", "Discount", "Grand Total", "Status"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    // Summary Section
    const totalQuotations = filteredData.length;
    const totalValue = filteredData.reduce((acc, item) => acc + item.Grand_Total, 0);
    const totalQuantity = filteredData.reduce((acc, item) => acc + item.Quantity, 0);

    doc.text(`Total Quotations: ${totalQuotations}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Quantity: ${totalQuantity}`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Total Order Value: $${totalValue.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 22);

    // Save PDF
    doc.save(`quotation_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // CSV Export functionality
  const handleExportCSV = () => {
    const headers = [
      "Quotation ID", "Customer Name", "Date Created", "Valid Until", 
      "Item Code", "Item Name", "Quantity", "Total Amount", 
      "Discount", "Grand Total", "Status"
    ];
    
    const csvContent = [
      headers.join(","),
      ...filteredData.map(item => [
        `"${item.Quotation_ID}"`,
        `"${item.Customer_Name}"`,
        `"${item.Date_Created}"`,
        `"${item.Valid_Until}"`,
        `"${item.Item_Code}"`,
        `"${item.Item_Name}"`,
        item.Quantity,
        item.Total_Amount.toFixed(2),
        item.Discount.toFixed(2),
        item.Grand_Total.toFixed(2),
        `"${item.Status}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `quotation_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const pendingQuotations = quotations.filter(q => q.Status === "Pending");
    const approvedQuotations = quotations.filter(q => q.Status === "Approved");
    const convertedQuotations = quotations.filter(q => q.Status === "Converted");
    const rejectedQuotations = quotations.filter(q => q.Status === "Rejected");
    
    const totalAmount = quotations.reduce((acc, q) => acc + q.Grand_Total, 0);
    const pendingAmount = pendingQuotations.reduce((acc, q) => acc + q.Grand_Total, 0);
    const approvedAmount = approvedQuotations.reduce((acc, q) => acc + q.Grand_Total, 0);
    const convertedAmount = convertedQuotations.reduce((acc, q) => acc + q.Grand_Total, 0);
    
    const conversionRate = quotations.length > 0 ? Math.round((convertedQuotations.length / quotations.length) * 100) : 0;
    
    return {
      totalQuotations: quotations.length,
      pendingCount: pendingQuotations.length,
      approvedCount: approvedQuotations.length,
      convertedCount: convertedQuotations.length,
      rejectedCount: rejectedQuotations.length,
      totalAmount,
      pendingAmount,
      approvedAmount,
      convertedAmount,
      conversionRate
    };
  }, [quotations]);

  // Filter data based on search term and status
  const filteredData = useMemo(() => {
    let filtered = quotations;
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(q => q.Status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.Quotation_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.Customer_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.Item_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.Status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [quotations, searchTerm, statusFilter]);

  // Fetch data based on date range and filters
  const fetchQuotations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/reports/quatation_report?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quotations');
      }
      const data = await response.json();
      setQuotations(data);
    } catch (err) {
      setError(err.message || 'Error fetching quotations');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter application
  const handleApplyFilters = () => {
    fetchQuotations();
  };

  // Reset filters
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setStatusFilter("all");
    fetchQuotations();
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { 
          color: "bg-yellow-100 text-yellow-800", 
          icon: <FaClock className="inline mr-1" /> 
        };
      case "approved":
        return { 
          color: "bg-blue-100 text-blue-800", 
          icon: <FaCheckCircle className="inline mr-1" /> 
        };
      case "converted":
        return { 
          color: "bg-green-100 text-green-800", 
          icon: <FaHandshake className="inline mr-1" /> 
        };
      case "rejected":
        return { 
          color: "bg-red-100 text-red-800", 
          icon: <FaExclamationTriangle className="inline mr-1" /> 
        };
      case "expired":
        return { 
          color: "bg-gray-100 text-gray-800", 
          icon: <FaClock className="inline mr-1" /> 
        };
      default:
        return { 
          color: "bg-gray-100 text-gray-800", 
          icon: <FaClock className="inline mr-1" /> 
        };
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchQuotations();
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
            <FaQuoteLeft /> Quotation Report
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Comprehensive quotation tracking and management system
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button 
            onClick={handleExportReport}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
          >
            <FaDownload /> Download PDF
          </button>
          <button 
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaDownload /> Export CSV
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
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
            <label className="text-sm font-medium mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="converted">Converted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search quotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md p-2 pl-10 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full"
              />
            </div>
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
              <p className="text-sm opacity-90">Total Quotations</p>
              <p className="text-2xl font-bold">{statistics.totalQuotations}</p>
            </div>
            <FaQuoteLeft className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending</p>
              <p className="text-2xl font-bold">{statistics.pendingCount}</p>
            </div>
            <FaClock className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Approved</p>
              <p className="text-2xl font-bold">{statistics.approvedCount}</p>
            </div>
            <FaCheckCircle className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Converted</p>
              <p className="text-2xl font-bold">{statistics.convertedCount}</p>
            </div>
            <FaHandshake className="text-3xl opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Quotations Table */}
      <motion.div 
        className="overflow-x-auto bg-white rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaClipboardList className="text-blue-600" /> 
            Quotation Details ({filteredData.length} records)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Quotation No</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">
                  <FaCalendarAlt className="inline mr-2" />Date Created
                </th>
                <th className="px-4 py-3 font-semibold">
                  <FaCalendarAlt className="inline mr-2" />Valid Until
                </th>
                <th className="px-4 py-3 font-semibold">
                  <FaBarcode className="inline mr-2" />Item Code
                </th>
                <th className="px-4 py-3 font-semibold">Item Name</th>
                <th className="px-4 py-3 font-semibold">Quantity</th>
                <th className="px-4 py-3 font-semibold">Total Amount</th>
                <th className="px-4 py-3 font-semibold">Discount</th>
                <th className="px-4 py-3 font-semibold">
                  <FaDollarSign className="inline mr-2" />Grand Total
                </th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((quotation, index) => {
                const statusInfo = getStatusInfo(quotation.Status);
                return (
                  <tr
                    key={`${quotation.Quotation_ID}-${index}`}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-blue-600">{quotation.Quotation_ID}</td>
                    <td className="px-4 py-3">{quotation.Customer_Name}</td>
                    <td className="px-4 py-3">{quotation.Date_Created}</td>
                    <td className="px-4 py-3">{quotation.Valid_Until}</td>
                    <td className="px-4 py-3 font-mono text-sm">{quotation.Item_Code}</td>
                    <td className="px-4 py-3">{quotation.Item_Name}</td>
                    <td className="px-4 py-3 text-center">{quotation.Quantity}</td>
                    <td className="px-4 py-3">${quotation.Total_Amount.toFixed(2)}</td>
                    <td className="px-4 py-3">${quotation.Discount.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      ${quotation.Grand_Total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}{quotation.Status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-800 transition" title="View Details">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FaBoxOpen className="text-4xl mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No quotations found</p>
            <p className="text-sm">Try adjusting your filters or search terms to see more results.</p>
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-md border border-blue-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-blue-700">
            <FaQuoteLeft /> Quotation Summary
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Total Quotations: <span className="font-semibold">{statistics.totalQuotations}</span></p>
            <p className="text-sm">Total Value: <span className="font-semibold text-blue-600">${statistics.totalAmount.toLocaleString()}</span></p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-amber-100 p-6 rounded-md border border-amber-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-amber-700">
            <FaClock /> Pending Quotations
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Count: <span className="font-semibold">{statistics.pendingCount}</span></p>
            <p className="text-sm">Value: <span className="font-semibold text-yellow-600">${statistics.pendingAmount.toLocaleString()}</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-md border border-emerald-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700">
            <FaCheckCircle /> Converted Quotations
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Count: <span className="font-semibold">{statistics.convertedCount}</span></p>
            <p className="text-sm">Value: <span className="font-semibold text-green-600">${statistics.convertedAmount.toLocaleString()}</span></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
