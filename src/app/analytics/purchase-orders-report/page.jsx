"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaShoppingCart, 
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
  FaFileCsv
} from "react-icons/fa";
import "../../globals.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PurchaseOrderReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Export PDF functionality
  const handleExportReport = () => {
    const safeFilteredData = Array.isArray(filteredData) ? filteredData : [];
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Purchase Order Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);

    // Table
    const tableData = safeFilteredData.map(item => [
      item?.po_id || '',
      item?.created_date || '',
      item?.location || '',
      item?.supplier_name || '',
      item?.item_code || '',
      item?.item_name || '',
      item?.quantity || 0,
      `$${(item?.price || 0).toFixed(2)}`,
      `$${(item?.dis_value || 0).toFixed(2)}`,
      `$${(item?.tot_value || 0).toFixed(2)}`,
      item?.status || ''
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["PO ID", "Created Date", "Location", "Supplier", "Item Code", "Item Name", "Quantity", "Unit Price", "Discount", "Total Value", "Status"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    // Summary Section
    const totalOrders = filteredData.length;
    const totalValue = filteredData.reduce((acc, item) => acc + item.tot_value, 0);
    const totalQuantity = filteredData.reduce((acc, item) => acc + item.quantity, 0);

    doc.text(`Total Orders: ${totalOrders}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Quantity: ${totalQuantity}`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Total Order Value: $${totalValue.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 22);

    // Save PDF
    doc.save(`purchase_order_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Export CSV function
  const handleExportCSV = () => {
    const safeFilteredData = Array.isArray(filteredData) ? filteredData : [];
    const csvData = [];

    // Add headers
    csvData.push([
      'PO ID',
      'Created Date',
      'Location',
      'Supplier',
      'Item Code',
      'Item Name',
      'Quantity',
      'Unit Price',
      'Discount',
      'Total Value',
      'Status'
    ]);

    // Add data rows
    safeFilteredData.forEach(item => {
      csvData.push([
        item?.po_id || '',
        item?.created_date || '',
        item?.location || '',
        item?.supplier_name || '',
        item?.item_code || '',
        item?.item_name || '',
        item?.quantity || 0,
        (item?.price || 0).toFixed(2),
        (item?.dis_value || 0).toFixed(2),
        (item?.tot_value || 0).toFixed(2),
        item?.status || ''
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
      link.setAttribute('download', `purchase_order_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const safePurchaseOrders = Array.isArray(purchaseOrders) ? purchaseOrders : [];
    
    const pendingOrders = safePurchaseOrders.filter(po => po?.status === "Pending");
    const completedOrders = safePurchaseOrders.filter(po => po?.status === "Completed");
    const rejectedOrders = safePurchaseOrders.filter(po => po?.status === "Rejected");
    
    const totalAmount = safePurchaseOrders.reduce((acc, po) => acc + (po?.tot_value || 0), 0);
    const pendingAmount = pendingOrders.reduce((acc, po) => acc + (po?.tot_value || 0), 0);
    const completedAmount = completedOrders.reduce((acc, po) => acc + (po?.tot_value || 0), 0);
    
    return {
      totalOrders: safePurchaseOrders.length,
      pendingCount: pendingOrders.length,
      completedCount: completedOrders.length,
      rejectedCount: rejectedOrders.length,
      totalAmount,
      pendingAmount,
      completedAmount
    };
  }, [purchaseOrders]);

  // Filter data based on search term and status
  const filteredData = useMemo(() => {
    let filtered = Array.isArray(purchaseOrders) ? purchaseOrders : [];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(po => po?.status?.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(po => 
        po?.po_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po?.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po?.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po?.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [purchaseOrders, searchTerm, statusFilter]);

  // Fetch data based on date range
  const fetchPurchaseOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/reports/purchase_orders_report?${params}`);
      const data = await response.json();
      console.log(data);
      
      if (data.success && Array.isArray(data.data)) {
        setPurchaseOrders(data.data);
      } else {
        setPurchaseOrders([]);
        setError(data.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Error fetching purchase orders');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter application
  const handleApplyFilters = () => {
    fetchPurchaseOrders();
  };

  // Reset filters
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setStatusFilter("all");
    fetchPurchaseOrders();
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { 
          color: "bg-yellow-100 text-yellow-800", 
          icon: <FaClock className="inline mr-1" /> 
        };
      case "completed":
        return { 
          color: "bg-green-100 text-green-800", 
          icon: <FaCheckCircle className="inline mr-1" /> 
        };
      case "rejected":
        return { 
          color: "bg-red-100 text-red-800", 
          icon: <FaExclamationTriangle className="inline mr-1" /> 
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
    fetchPurchaseOrders();
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
            <FaShoppingCart /> Purchase Order Report
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Comprehensive purchase order tracking and management system
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
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaFileCsv /> Export CSV
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
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
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
              <p className="text-sm opacity-90">Total Orders</p>
              <p className="text-2xl font-bold">{statistics.totalOrders}</p>
            </div>
            <FaShoppingCart className="text-3xl opacity-80" />
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

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Completed</p>
              <p className="text-2xl font-bold">{statistics.completedCount}</p>
            </div>
            <FaCheckCircle className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Rejected</p>
              <p className="text-2xl font-bold">{statistics.rejectedCount}</p>
            </div>
            <FaExclamationTriangle className="text-3xl opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Status Summary */}
      <motion.div 
        className="mb-8 bg-white p-6 rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartBar className="text-blue-600" /> Status Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <FaClock className="text-yellow-600" />
                </div>
                <div>
                  <span className="font-medium">Pending Orders</span>
                  <p className="text-sm text-gray-600">${statistics.pendingAmount.toLocaleString()}</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-yellow-700">
                {statistics.pendingCount}
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <FaCheckCircle className="text-green-600" />
                </div>
                <div>
                  <span className="font-medium">Completed Orders</span>
                  <p className="text-sm text-gray-600">${statistics.completedAmount.toLocaleString()}</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-700">
                {statistics.completedCount}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <FaExclamationTriangle className="text-red-600" />
                </div>
                <div>
                  <span className="font-medium">Rejected Orders</span>
                  <p className="text-sm text-gray-600">Need Review</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-red-700">
                {statistics.rejectedCount}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Purchase Orders Table */}
      <motion.div 
        className="overflow-x-auto bg-white rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaClipboardList className="text-blue-600" /> 
            Purchase Order Details ({filteredData.length} records)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">PO ID</th>
                <th className="px-4 py-3 font-semibold">
                  <FaCalendarAlt className="inline mr-2" />Created Date
                </th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Supplier</th>
                <th className="px-4 py-3 font-semibold">
                  <FaBarcode className="inline mr-2" />Item Code
                </th>
                <th className="px-4 py-3 font-semibold">
                  <FaTags className="inline mr-2" />Item Name
                </th>
                <th className="px-4 py-3 font-semibold">Quantity</th>
                <th className="px-4 py-3 font-semibold">Unit Price</th>
                <th className="px-4 py-3 font-semibold">Discount</th>
                <th className="px-4 py-3 font-semibold">
                  <FaDollarSign className="inline mr-2" />Total Value
                </th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((po, index) => {
                const statusInfo = getStatusInfo(po.status);
                return (
                  <tr
                    key={`${po.po_id}-${index}`}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-blue-600">{po.po_id}</td>
                    <td className="px-4 py-3">{po.created_date}</td>
                    <td className="px-4 py-3">{po.location}</td>
                    <td className="px-4 py-3 font-medium">{po.supplier_name}</td>
                    <td className="px-4 py-3 font-mono text-sm">{po.item_code}</td>
                    <td className="px-4 py-3">{po.item_name}</td>
                    <td className="px-4 py-3 text-center">{po.quantity}</td>
                    <td className="px-4 py-3">${(po.price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">${(po.dis_value || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      ${(po.tot_value || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}{po.status}
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
            <p className="text-lg font-medium">No purchase orders found</p>
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
            <FaShoppingCart /> Order Summary
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Total Orders: <span className="font-semibold">{statistics.totalOrders}</span></p>
            <p className="text-sm">Total Value: <span className="font-semibold text-blue-600">${statistics.totalAmount.toLocaleString()}</span></p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-amber-100 p-6 rounded-md border border-amber-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-amber-700">
            <FaClock /> Pending Orders
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Count: <span className="font-semibold">{statistics.pendingCount}</span></p>
            <p className="text-sm">Value: <span className="font-semibold text-yellow-600">${statistics.pendingAmount.toLocaleString()}</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-md border border-emerald-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700">
            <FaCheckCircle /> Completed Orders
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Completed: <span className="font-semibold">{statistics.completedCount}</span></p>
            <p className="text-sm">Success Rate: <span className="font-semibold text-green-600">{statistics.totalOrders > 0 ? Math.round((statistics.completedCount / statistics.totalOrders) * 100) : 0}%</span></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
