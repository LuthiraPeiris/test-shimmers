"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaUndo, 
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
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTimesCircle,
  FaArrowLeft,
  FaPercent,
  FaExclamationCircle
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../globals.css";

export default function ReturnOrderReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data based on the updated database structure
  const mockReturnOrders = [
    {
      Return_Order_ID: "RET001",
      Sales_Order_ID: 1001,
      Customer_ID: 501,
      Customer_Name: "ABC Corporation",
      Return_Date: "2025-01-15",
      Return_Status: "Pending",
      Refund_Amount: 550.00,
      Created_At: "2025-01-15 10:30:00",
      Updated_At: "2025-01-15 10:30:00"
    },
    {
      Return_Order_ID: "RET002",
      Sales_Order_ID: 1002,
      Customer_ID: 502,
      Customer_Name: "XYZ Industries",
      Return_Date: "2025-01-16",
      Return_Status: "Approved",
      Refund_Amount: 275.50,
      Created_At: "2025-01-16 09:15:00",
      Updated_At: "2025-01-16 14:20:00"
    },
    {
      Return_Order_ID: "RET003",
      Sales_Order_ID: 1003,
      Customer_ID: 503,
      Customer_Name: "DEF Builders",
      Return_Date: "2025-01-17",
      Return_Status: "Completed",
      Refund_Amount: 99.00,
      Created_At: "2025-01-17 11:45:00",
      Updated_At: "2025-01-17 16:30:00"
    },
    {
      Return_Order_ID: "RET004",
      Sales_Order_ID: 1004,
      Customer_ID: 504,
      Customer_Name: "GHI Construction",
      Return_Date: "2025-01-18",
      Return_Status: "Rejected",
      Refund_Amount: 0.00,
      Created_At: "2025-01-18 08:20:00",
      Updated_At: "2025-01-18 13:45:00"
    },
    {
      Return_Order_ID: "RET005",
      Sales_Order_ID: 1005,
      Customer_ID: 505,
      Customer_Name: "JKL Enterprises",
      Return_Date: "2025-01-19",
      Return_Status: "Pending",
      Refund_Amount: 320.75,
      Created_At: "2025-01-19 12:10:00",
      Updated_At: "2025-01-19 12:10:00"
    },
    {
      Return_Order_ID: "RET006",
      Sales_Order_ID: 1006,
      Customer_ID: 506,
      Customer_Name: "MNO Developers",
      Return_Date: "2025-01-20",
      Return_Status: "Approved",
      Refund_Amount: 132.00,
      Created_At: "2025-01-20 15:30:00",
      Updated_At: "2025-01-20 17:15:00"
    },
    {
      Return_Order_ID: "RET007",
      Sales_Order_ID: 1007,
      Customer_ID: 507,
      Customer_Name: "PQR Holdings",
      Return_Date: "2025-01-21",
      Return_Status: "Completed",
      Refund_Amount: 450.25,
      Created_At: "2025-01-21 09:45:00",
      Updated_At: "2025-01-21 18:20:00"
    },
    {
      Return_Order_ID: "RET008",
      Sales_Order_ID: 1008,
      Customer_ID: 508,
      Customer_Name: "STU Contractors",
      Return_Date: "2025-01-22",
      Return_Status: "Cancelled",
      Refund_Amount: 0.00,
      Created_At: "2025-01-22 14:25:00",
      Updated_At: "2025-01-22 16:40:00"
    }
  ];

  const [returnOrders, setReturnOrders] = useState(mockReturnOrders);

  // Calculate statistics
  const statistics = useMemo(() => {
    const pendingReturns = returnOrders.filter(r => r.Return_Status === "Pending");
    const approvedReturns = returnOrders.filter(r => r.Return_Status === "Approved");
    const completedReturns = returnOrders.filter(r => r.Return_Status === "Completed");
    const rejectedReturns = returnOrders.filter(r => r.Return_Status === "Rejected");
    const cancelledReturns = returnOrders.filter(r => r.Return_Status === "Cancelled");
    
    const totalRefundAmount = returnOrders.reduce((acc, r) => acc + r.Refund_Amount, 0);
    const pendingAmount = pendingReturns.reduce((acc, r) => acc + r.Refund_Amount, 0);
    const completedAmount = completedReturns.reduce((acc, r) => acc + r.Refund_Amount, 0);
    const approvedAmount = approvedReturns.reduce((acc, r) => acc + r.Refund_Amount, 0);
    
    return {
      totalReturns: returnOrders.length,
      pendingCount: pendingReturns.length,
      approvedCount: approvedReturns.length,
      completedCount: completedReturns.length,
      rejectedCount: rejectedReturns.length,
      cancelledCount: cancelledReturns.length,
      totalRefundAmount,
      pendingAmount,
      completedAmount,
      approvedAmount
    };
  }, [returnOrders]);

  // Filter data based on search term and status
  const filteredData = useMemo(() => {
    let filtered = returnOrders;
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(r => r.Return_Status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.Return_Order_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.Customer_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.Sales_Order_ID.toString().includes(searchTerm.toLowerCase()) ||
        r.Customer_ID.toString().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [returnOrders, searchTerm, statusFilter]);

  // Fetch data based on date range
  const fetchReturnOrders = async () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let filtered = mockReturnOrders;
      
      // Apply date filter if both dates are provided
      if (startDate && endDate) {
        filtered = filtered.filter(
          (r) => r.Return_Date >= startDate && r.Return_Date <= endDate
        );
      }
      
      setReturnOrders(filtered);
      setLoading(false);
    }, 1000);
  };

  // Handle filter application
  const handleApplyFilters = () => {
    fetchReturnOrders();
  };

  // Reset filters
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setStatusFilter("all");
    setReturnOrders(mockReturnOrders);
  };

  // PDF Export Function
  const handleExportReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Return Order Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Records: ${filteredData.length}`, 14, 34);

    // Table
    const tableData = filteredData.map(item => [
      item.Return_Order_ID,
      item.Sales_Order_ID.toString(),
      item.Customer_ID.toString(),
      item.Customer_Name,
      item.Return_Date,
      item.Return_Status,
      `$${item.Refund_Amount.toFixed(2)}`,
      item.Created_At.split(' ')[0], // Just the date part
      item.Updated_At.split(' ')[0]  // Just the date part
    ]);

    autoTable(doc, {
      startY: 42,
      head: [["Return ID", "Sales Order", "Customer ID", "Customer Name", "Return Date", "Status", "Refund Amount", "Created", "Updated"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 35 },
        4: { cellWidth: 25 },
        5: { cellWidth: 20 },
        6: { cellWidth: 25 },
        7: { cellWidth: 20 },
        8: { cellWidth: 20 }
      }
    });

    // Summary Section
    const totalRefund = filteredData.reduce((acc, item) => acc + item.Refund_Amount, 0);
    const pendingCount = filteredData.filter(item => item.Return_Status === 'Pending').length;
    const completedCount = filteredData.filter(item => item.Return_Status === 'Completed').length;

    doc.text(`Total Returns: ${filteredData.length}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Refund Amount: $${totalRefund.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Pending Returns: ${pendingCount}`, 14, doc.lastAutoTable.finalY + 22);
    doc.text(`Completed Returns: ${completedCount}`, 14, doc.lastAutoTable.finalY + 28);

    // Save PDF
    doc.save(`return_order_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Return_Order_ID', 'Sales_Order_ID', 'Customer_ID', 'Customer_Name', 'Return_Date', 'Return_Status', 'Refund_Amount', 'Created_At', 'Updated_At'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => 
        [item.Return_Order_ID, item.Sales_Order_ID, item.Customer_ID, item.Customer_Name, item.Return_Date, item.Return_Status, item.Refund_Amount, item.Created_At, item.Updated_At].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'return_order_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
      case "completed":
        return { 
          color: "bg-green-100 text-green-800", 
          icon: <FaCheckCircle className="inline mr-1" /> 
        };
      case "rejected":
        return { 
          color: "bg-red-100 text-red-800", 
          icon: <FaTimesCircle className="inline mr-1" /> 
        };
      case "cancelled":
        return { 
          color: "bg-gray-100 text-gray-800", 
          icon: <FaTimesCircle className="inline mr-1" /> 
        };
      default:
        return { 
          color: "bg-gray-100 text-gray-800", 
          icon: <FaClock className="inline mr-1" /> 
        };
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
            <FaUndo /> Return Order Report
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Comprehensive return order tracking and refund management system
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button 
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
          >
            <FaDownload /> Export CSV
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
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
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by return ID, customer name..."
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

      {/* Return Orders Table */}
      <motion.div 
        className="overflow-x-auto bg-white rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaClipboardList className="text-blue-600" /> 
            Return Order Details ({filteredData.length} records)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Return No</th>
                <th className="px-4 py-3 font-semibold">Sales Order</th>
                <th className="px-4 py-3 font-semibold">Customer ID</th>
                <th className="px-4 py-3 font-semibold">Customer Name</th>
                <th className="px-4 py-3 font-semibold">
                  <FaCalendarAlt className="inline mr-2" />Return Date
                </th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">
                  <FaDollarSign className="inline mr-2" />Refund Amount
                </th>
                <th className="px-4 py-3 font-semibold">Created At</th>
                <th className="px-4 py-3 font-semibold">Updated At</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((returnOrder, index) => {
                const statusInfo = getStatusInfo(returnOrder.Return_Status);
                return (
                  <tr key={index} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-blue-600">{returnOrder.Return_Order_ID}</td>
                    <td className="px-4 py-3 font-medium text-purple-600">{returnOrder.Sales_Order_ID}</td>
                    <td className="px-4 py-3">{returnOrder.Customer_ID}</td>
                    <td className="px-4 py-3">{returnOrder.Customer_Name}</td>
                    <td className="px-4 py-3">{returnOrder.Return_Date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}{returnOrder.Return_Status}
                      </span>
                    </td>
                    <td className="px-4 py-3">${returnOrder.Refund_Amount.toFixed(2)}</td>
                    <td className="px-4 py-3">{returnOrder.Created_At.split(' ')[0]}</td>
                    <td className="px-4 py-3">{returnOrder.Updated_At.split(' ')[0]}</td>
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
            <p className="text-lg font-medium">No return orders found</p>
            <p className="text-sm">Try adjusting your filters or search terms to see more results.</p>
          </div>
        )}
      </motion.div>

      {/* Summary Footer */}
      <motion.div
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-md border border-blue-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-blue-700">
            <FaUndo /> Return Summary
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Total Returns: <span className="font-semibold">{statistics.totalReturns}</span></p>
            <p className="text-sm">Refund Amount: <span className="font-semibold text-blue-600">${statistics.totalRefundAmount.toLocaleString()}</span></p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-amber-100 p-6 rounded-md border border-amber-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-amber-700">
            <FaClock /> Pending Processing
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Count: <span className="font-semibold">{statistics.pendingCount}</span></p>
            <p className="text-sm">Value: <span className="font-semibold text-yellow-600">${statistics.pendingAmount.toLocaleString()}</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-md border border-emerald-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700">
            <FaCheckCircle /> Completed Returns
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Count: <span className="font-semibold">{statistics.completedCount}</span></p>
            <p className="text-sm">Refunded: <span className="font-semibold text-green-600">${statistics.completedAmount.toLocaleString()}</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-100 p-6 rounded-md border border-purple-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-purple-700">
            <FaBoxOpen /> Inventory Impact
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Items Returned: <span className="font-semibold">{statistics.totalQuantityReturned}</span></p>
            <p className="text-sm">Return Rate: <span className="font-semibold text-purple-600">{statistics.totalReturns > 0 ? Math.round((statistics.totalQuantityReturned / (statistics.totalReturns * 10)) * 100) : 0}%</span></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
