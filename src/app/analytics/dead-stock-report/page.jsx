"use client";
import React, { useState, useMemo, useEffect } from "react";
import "../../globals.css";
import { motion } from "framer-motion";
import { 
  FaBoxOpen, 
  FaSearch, 
  FaDownload, 
  FaClipboardList,
  FaFilter,
  FaSync,
  FaExclamationTriangle,
  FaEye,
  FaBarcode,
  FaTags,
  FaCalendarAlt,
  FaChartBar,
  FaClock,
  FaWarehouse,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFileCsv
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DeadStockReport() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // Fetch real data from API
  useEffect(() => {
    fetchDeadStockData();
  }, []);

  const fetchDeadStockData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports/dead_stock_report');
      if (!response.ok) {
        throw new Error('Failed to fetch dead stock data');
      }
      const result = await response.json();
      
      // Transform API data to match expected format
      const transformedData = result.map(item => ({
        Item_Code: item.Item_Code,
        Item_Name: item.Item_Name,
        Available_Stock: item.Quantity || 0,
        Price: 0, // Default price since API doesn't provide it
        Brand: 'N/A', // Default brand since API doesn't provide it
        Size: 'N/A', // Default size since API doesn't provide it
        Country: 'N/A', // Default country since API doesn't provide it
        Created_Date: 'N/A', // Default date since API doesn't provide it
        Last_Delivery_Date: item.Last_Delivery_Date,
        Days_Since_Movement: item.Days_Since_Movement || 0
      }));
      
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching dead stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics based on real data
  const statistics = useMemo(() => {
    const totalItems = data.length;
    const noMovementCount = data.filter((item) => !item.Last_Delivery_Date).length;
    const over180DaysCount = data.filter(
      (item) => item.Days_Since_Movement > 180
    ).length;
    const activeItems = totalItems - noMovementCount - over180DaysCount;
    const totalQuantity = data.reduce((sum, item) => sum + item.Available_Stock, 0);
    const deadStockValue = data.filter(item => 
      !item.Last_Delivery_Date || item.Days_Since_Movement > 180
    ).reduce((sum, item) => sum + item.Available_Stock, 0);

    return {
      totalItems,
      noMovementCount,
      over180DaysCount,
      activeItems,
      totalQuantity,
      deadStockValue
    };
  }, [data]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => 
      item.Item_Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Item_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [data, searchTerm, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="opacity-50" />;
    return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  // Handle filter application
  const handleApplyFilters = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSortField("");
    setSortDirection("asc");
    fetchDeadStockData();
  };

  // Export to CSV functionality
  const exportToCSV = () => {
    const headers = [
      "Item Code",
      "Item Name",
      "Available Stock",
      "Last Delivery Date",
      "Days Since Movement"
    ];

    const csvData = data.map(item => [
      item.Item_Code || '',
      item.Item_Name || '',
      item.Available_Stock || 0,
      item.Last_Delivery_Date || 'Never',
      item.Days_Since_Movement || 'N/A'
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dead_stock_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export functionality
  const handleExportReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Dead Stock Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);

    // Table
    const tableData = data.map(item => [
      item.Item_Code,
      item.Item_Name,
      item.Available_Stock,
      item.Last_Delivery_Date || 'Never',
      item.Days_Since_Movement || 'N/A'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Item Code", "Item Name", "Stock", "Last Delivery", "Days Since Movement"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    // Summary Section
    const totalStock = data.reduce((acc, item) => acc + item.Available_Stock, 0);

    doc.text(`Total Items: ${data.length}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Stock Units: ${totalStock}`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Dead Stock Items: ${statistics.noMovementCount + statistics.over180DaysCount}`, 14, doc.lastAutoTable.finalY + 22);

    // Save PDF
    doc.save(`dead_stock_report_${new Date().toISOString().split('T')[0]}.pdf`);
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
            <FaBoxOpen /> Dead Stock Report
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Comprehensive dead stock and inventory movement analysis
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
          <button 
            onClick={fetchDeadStockData}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
          >
            <FaSync /> Refresh
          </button>
        </div>
      </motion.header>

      {/* Statistics Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Items</p>
              <p className="text-2xl font-bold">{statistics.totalItems}</p>
            </div>
            <FaBoxOpen className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">No Movement</p>
              <p className="text-2xl font-bold">{statistics.noMovementCount}</p>
            </div>
            <FaExclamationTriangle className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Over 180 Days</p>
              <p className="text-2xl font-bold">{statistics.over180DaysCount}</p>
            </div>
            <FaClock className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Items</p>
              <p className="text-2xl font-bold">{statistics.activeItems}</p>
            </div>
            <FaChartBar className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Quantity</p>
              <p className="text-2xl font-bold">{statistics.totalQuantity}</p>
            </div>
            <FaWarehouse className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Dead Stock Qty</p>
              <p className="text-2xl font-bold">{statistics.deadStockValue}</p>
            </div>
            <FaExclamationTriangle className="text-3xl opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="mb-8 bg-white p-6 rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaFilter className="text-blue-600" /> Filters & Search
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Search Items</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by item code or name..."
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
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <FaSync className="animate-spin" /> : <FaFilter />}
              {loading ? "Loading..." : "Apply"}
            </button>
            <button
              onClick={handleResetFilters}
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </motion.div>

      {/* Dead Stock Table */}
      <motion.div 
        className="overflow-x-auto bg-white rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaClipboardList className="text-blue-600" /> 
            Dead Stock Report ({filteredAndSortedData.length} records)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th 
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-blue-700 transition"
                  onClick={() => handleSort("Item_Code")}
                >
                  <div className="flex items-center gap-2">
                    <FaBarcode className="inline mr-1" />Item Code
                    {getSortIcon("Item_Code")}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-blue-700 transition"
                  onClick={() => handleSort("Item_Name")}
                >
                  <div className="flex items-center gap-2">
                    <FaTags className="inline mr-1" />Item Name
                    {getSortIcon("Item_Name")}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-blue-700 transition"
                  onClick={() => handleSort("Available_Stock")}
                >
                  <div className="flex items-center gap-2">
                    <FaWarehouse className="inline mr-1" />Available Stock
                    {getSortIcon("Available_Stock")}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-blue-700 transition"
                  onClick={() => handleSort("Last_Delivery_Date")}
                >
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="inline mr-1" />Last Delivery Date
                    {getSortIcon("Last_Delivery_Date")}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-blue-700 transition"
                  onClick={() => handleSort("Days_Since_Movement")}
                >
                  <div className="flex items-center gap-2">
                    <FaClock className="inline mr-1" />Days Since Movement
                    {getSortIcon("Days_Since_Movement")}
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedData.map((item, index) => (
                <tr key={`${item.Item_Code}-${index}`} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-blue-600">{item.Item_Code}</td>
                  <td className="px-4 py-3 font-medium">{item.Item_Name}</td>
                  <td className="px-4 py-3 font-bold">{item.Available_Stock}</td>
                  <td className="px-4 py-3">
                    {item.Last_Delivery_Date ? new Date(item.Last_Delivery_Date).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.Days_Since_Movement > 180 ? 'bg-red-100 text-red-800' :
                      item.Days_Since_Movement > 90 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.Days_Since_Movement} days
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 transition p-1" title="View Details">
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FaBoxOpen className="text-4xl mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm">Try adjusting your search terms to see more results.</p>
          </div>
        )}
      </motion.div>

      <motion.div
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-md border border-blue-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-blue-700">
            <FaBoxOpen /> Inventory Overview
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Total Items: <span className="font-semibold">{statistics.totalItems}</span></p>
            <p className="text-sm">Total Quantity: <span className="font-semibold">{statistics.totalQuantity}</span></p>
            <p className="text-sm">Dead Stock Items: <span className="font-semibold text-blue-600">{statistics.noMovementCount + statistics.over180DaysCount}</span></p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-md border border-red-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-red-700">
            <FaExclamationTriangle /> Stock Analysis
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Items with No Movement: <span className="font-semibold">{statistics.noMovementCount}</span></p>
            <p className="text-sm">Items Over 180 Days: <span className="font-semibold text-red-600">{statistics.over180DaysCount}</span></p>
            <p className="text-sm">Active Items: <span className="font-semibold text-green-600">{statistics.activeItems}</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-md border border-emerald-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700">
            <FaChartBar /> Performance Metrics
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Highest Stock: <span className="font-semibold">{data.length > 0 ? Math.max(...data.map(item => item.Available_Stock)) : 0}</span></p>
            <p className="text-sm">Lowest Stock: <span className="font-semibold text-green-600">{data.length > 0 ? Math.min(...data.map(item => item.Available_Stock)) : 0}</span></p>
            <p className="text-sm">Average Days Since Movement: <span className="font-semibold text-green-600">
              {data.length > 0 ? Math.round(data.reduce((acc, item) => acc + item.Days_Since_Movement, 0) / data.length) : 0} days
            </span></p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
