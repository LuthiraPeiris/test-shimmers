"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaFileInvoiceDollar, 
  FaCalendarAlt, 
  FaUsers, 
  FaTruck, 
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
  FaUser,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStickyNote,
  FaFileCsv
} from "react-icons/fa";
import "../../globals.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function InvoiceReport() {
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidCount: 0,
    pendingCount: 0,
    overdueCount: 0,
    paidTotal: 0,
    pendingTotal: 0,
    overdueTotal: 0,
    grandTotal: 0,
    totalItems: 0
  });

  // Transform API data to match expected format
  const transformApiData = (data) => {
    if (!data || !data.invoiceDetails) return [];
    
    const invoiceMap = new Map();
    
    data.invoiceDetails.forEach(item => {
      const invoiceKey = item.Invoice_ID;
      
      if (!invoiceMap.has(invoiceKey)) {
        invoiceMap.set(invoiceKey, {
          Invoice_ID: item.Invoice_ID,
          Invoice_No: item.Invoice_No,
          Customer_ID: item.Customer_ID,
          User_ID: item.User_ID || "U0001",
          Invoice_Date: item.Invoice_Date,
          Payment_Terms: item.Payment_Terms || "Net 30",
          Total_Amount: parseFloat(item.Total_Amount) || 0,
          Tax_Amount: parseFloat(item.Tax_Amount) || 0,
          Grand_Total: parseFloat(item.Grand_Total) || 0,
          Notes: item.Notes || "",
          Created_At: item.Invoice_Date,
          status: "PENDING",
          items: []
        });
      }
      
      if (item.Item_Code) {
        invoiceMap.get(invoiceKey).items.push({
          Invoice_Item_ID: item.Invoice_Item_ID || Math.random(),
          Item_Code: item.Item_Code,
          Item_Name: item.Item_Name || item.Item_Code,
          Quantity: parseFloat(item.Quantity) || 0,
          Unit_Price: parseFloat(item.Unit_Price) || 0,
          Total_Price: parseFloat(item.Total_Price) || 0,
          SR_No: item.SR_No || null,
          MF_Date: item.MF_Date || null,
          Ex_Date: item.Ex_Date || null,
          Batch_No: item.Batch_No || null
        });
      }
    });
    
    return Array.from(invoiceMap.values());
  };

  // Fetch real data from API
  const fetchInvoiceData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reports/invoice_report');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const transformedData = transformApiData(data);
        setInvoiceData(transformedData);
        
        // Calculate summary statistics
        const newSummary = {
          totalInvoices: data.summary?.totalInvoices || 0,
          totalAmount: data.summary?.totalAmount || 0,
          paidCount: 0,
          pendingCount: 0,
          overdueCount: 0,
          paidTotal: 0,
          pendingTotal: 0,
          overdueTotal: 0,
          grandTotal: data.summary?.totalAmount || 0,
          totalItems: transformedData.reduce((acc, invoice) => acc + invoice.items.length, 0)
        };
        
        // Calculate status-based counts
        transformedData.forEach(invoice => {
          if (invoice.status === "PAID") {
            newSummary.paidCount++;
            newSummary.paidTotal += invoice.Grand_Total;
          } else if (invoice.status === "OVERDUE") {
            newSummary.overdueCount++;
            newSummary.overdueTotal += invoice.Grand_Total;
          } else {
            newSummary.pendingCount++;
            newSummary.pendingTotal += invoice.Grand_Total;
          }
        });
        
        setSummary(newSummary);
      } else {
        throw new Error(data.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching invoice data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics based on filtered data
  const statistics = useMemo(() => {
    let filtered = invoiceData;
    
    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter(invoice => invoice.status === status);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.Invoice_No.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.Customer_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.User_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.Payment_Terms.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.Notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.items.some(item => 
          item.Item_Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Item_Name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    const paidInvoices = filtered.filter(item => item.status === "PAID");
    const pendingInvoices = filtered.filter(item => item.status === "PENDING");
    const overdueInvoices = filtered.filter(item => item.status === "OVERDUE");
    
    const paidTotal = paidInvoices.reduce((acc, item) => acc + item.Grand_Total, 0);
    const pendingTotal = pendingInvoices.reduce((acc, item) => acc + item.Grand_Total, 0);
    const overdueTotal = overdueInvoices.reduce((acc, item) => acc + item.Grand_Total, 0);
    
    return {
      totalInvoices: filtered.length,
      paidCount: paidInvoices.length,
      pendingCount: pendingInvoices.length,
      overdueCount: overdueInvoices.length,
      paidTotal,
      pendingTotal,
      overdueTotal,
      grandTotal: paidTotal + pendingTotal + overdueTotal,
      totalItems: filtered.reduce((acc, invoice) => acc + invoice.items.length, 0)
    };
  }, [invoiceData, status, searchTerm]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    let filtered = invoiceData;
    
    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter(invoice => invoice.status === status);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.Invoice_No.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.Customer_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.User_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.Payment_Terms.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.Notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.items.some(item => 
          item.Item_Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Item_Name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    return filtered;
  }, [invoiceData, status, searchTerm]);

  // Export PDF function
  const handleExportReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Customer Invoice Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);

    // Table
    const tableData = filteredData.map(invoice => [
      invoice.Invoice_No,
      invoice.Customer_ID,
      invoice.User_ID,
      invoice.Invoice_Date,
      invoice.Payment_Terms,
      `$${invoice.Total_Amount.toFixed(2)}`,
      `$${invoice.Tax_Amount.toFixed(2)}`,
      `$${invoice.Grand_Total.toFixed(2)}`,
      invoice.status,
      invoice.Notes
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Invoice No", "Customer ID", "User ID", "Date", "Payment Terms", "Total Amount", "Tax Amount", "Grand Total", "Status", "Notes"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    // Summary Section
    doc.text(`Total Invoices: ${statistics.totalInvoices}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Paid Invoices: ${statistics.paidCount} ($${statistics.paidTotal.toFixed(2)})`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Pending Invoices: ${statistics.pendingCount} ($${statistics.pendingTotal.toFixed(2)})`, 14, doc.lastAutoTable.finalY + 22);
    doc.text(`Overdue Invoices: ${statistics.overdueCount} ($${statistics.overdueTotal.toFixed(2)})`, 14, doc.lastAutoTable.finalY + 28);
    doc.text(`Grand Total Amount: $${statistics.grandTotal.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 34);

    // Save PDF
    doc.save(`customer_invoice_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Export CSV function
  const handleExportCSV = () => {
    const csvData = [];
    
    // Add headers
    csvData.push([
      'Invoice No',
      'Customer ID',
      'User ID',
      'Invoice Date',
      'Payment Terms',
      'Total Amount',
      'Tax Amount',
      'Grand Total',
      'Status',
      'Notes'
    ]);

    // Add data rows
    filteredData.forEach(invoice => {
      csvData.push([
        invoice.Invoice_No,
        invoice.Customer_ID,
        invoice.User_ID,
        invoice.Invoice_Date,
        invoice.Payment_Terms,
        invoice.Total_Amount.toFixed(2),
        invoice.Tax_Amount.toFixed(2),
        invoice.Grand_Total.toFixed(2),
        invoice.status,
        invoice.Notes
      ]);
    });

    // Convert to CSV string
    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `customer_invoice_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setSearchTerm("");
  };

  // Apply filters
  useEffect(() => {
    fetchInvoiceData();
  }, []);

  // Get status color and icon
  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return <FaCheckCircle className="text-green-600" />;
      case "PENDING":
        return <FaClock className="text-yellow-600" />;
      case "OVERDUE":
        return <FaExclamationTriangle className="text-red-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

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
            <FaFileInvoiceDollar /> Customer Invoice Report
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Comprehensive customer invoice management and reporting system
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
            <FaFileCsv /> Export CSV
          </button>
        </div>
      </motion.header>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"
        >
          <div className="flex items-center gap-2">
            <FaExclamationTriangle />
            <span>Error: {error}</span>
          </div>
          <button 
            onClick={fetchInvoiceData}
            className="mt-2 text-sm underline hover:text-red-900"
          >
            Try again
          </button>
        </motion.div>
      )}

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Invoice Status</label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md p-2 pl-10 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchInvoiceData}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <FaSync className="animate-spin" /> : <FaSync />}
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-8"
        >
          <FaSync className="text-4xl text-blue-600 animate-spin mb-4" />
          <p className="text-lg font-medium">Loading invoice data...</p>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && invoiceData.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-8 text-gray-500"
        >
          <FaBoxOpen className="text-6xl mb-4 opacity-50" />
          <p className="text-xl font-medium">No invoice data available</p>
          <p className="text-sm mt-2">Click refresh to load data from the server</p>
        </motion.div>
      )}

      {/* Statistics Cards */}
      {!loading && invoiceData.length > 0 && (
        <>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Invoices</p>
                  <p className="text-2xl font-bold">{statistics.totalInvoices}</p>
                </div>
                <FaFileInvoiceDollar className="text-3xl opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Paid</p>
                  <p className="text-2xl font-bold">{statistics.paidCount}</p>
                </div>
                <FaCheckCircle className="text-3xl opacity-80" />
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

            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Overdue</p>
                  <p className="text-2xl font-bold">{statistics.overdueCount}</p>
                </div>
                <FaExclamationTriangle className="text-3xl opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Amount</p>
                  <p className="text-xl font-bold">${statistics.grandTotal.toLocaleString()}</p>
                </div>
                <FaDollarSign className="text-3xl opacity-80" />
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
                Invoice Details ({filteredData.length} records)
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Invoice No</th>
                    <th className="px-4 py-3 font-semibold">Customer ID</th>
                    <th className="px-4 py-3 font-semibold">User ID</th>
                    <th className="px-4 py-3 font-semibold">Invoice Date</th>
                    <th className="px-4 py-3 font-semibold">Payment Terms</th>
                    <th className="px-4 py-3 font-semibold">Total Amount</th>
                    <th className="px-4 py-3 font-semibold">Tax Amount</th>
                    <th className="px-4 py-3 font-semibold">Grand Total</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Notes</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((invoice, index) => (
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
                        ${invoice.Total_Amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-orange-600">
                        ${invoice.Tax_Amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-bold text-green-600">
                        ${invoice.Grand_Total.toFixed(2)}
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
                      <td className="px-4 py-3">
                        <button className="text-blue-600 hover:text-blue-800 transition">
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <FaBoxOpen className="text-4xl mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No invoices found</p>
                <p className="text-sm">Try adjusting your filters or search terms to see more results.</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
