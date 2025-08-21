"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
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
  FaChartBar
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../globals.css";

export default function FastSlowMovingItems() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [movementData, setMovementData] = useState([]);

  useEffect(() => {
    fetchMovementData();
  }, []);

    const fetchMovementData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/reports/fast&slow_moving_item_report');
            if (!response.ok) {
                throw new Error('Failed to fetch movement data');
            }
            const data = await response.json();
            
            // Handle both old and new API response formats
            if (data.success && Array.isArray(data.reports)) {
                setMovementData(data.reports);
            } else if (Array.isArray(data)) {
                // Fallback for direct array response
                setMovementData(data);
            } else {
                console.error('Unexpected API response format:', data);
                setMovementData([]);
            }
        } catch (error) {
            console.error('Error fetching movement data:', error);
            setMovementData([]);
        } finally {
            setLoading(false);
        }
    };

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalItems = movementData.length;
    const fastItems = movementData.filter(item => item.Category === "Fast").length;
    const slowItems = movementData.filter(item => item.Category === "Slow").length;
    const totalMovement = movementData.reduce((acc, item) => acc + item.Total_Movement, 0);

    return {
      totalItems,
      fastItems,
      slowItems,
      totalMovement
    };
  }, [movementData]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    return movementData.filter(item =>
      item.Item_Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Item_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Deliver_Id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movementData, searchTerm]);

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
    setMovementData(mockMovementData);
  };

  // PDF Export Function
  const handleExportReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Item Movement Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Records: ${filteredData.length}`, 14, 34);

    // Table
    const tableData = filteredData.map(item => [
      item.Report_Id,
      item.Item_Code,
      item.Deliver_Id,
      item.Item_Name,
      item.Total_Movement.toString(),
      item.Last_Movement_Date,
      item.Days_Since_Movement.toString(),
      item.Category,
      item.Report_Date
    ]);

    autoTable(doc, {
      startY: 42,
      head: [["Report ID", "Item Code", "Deliver ID", "Item Name", "Total Movement", "Last Movement", "Days Since", "Category", "Report Date"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 40 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 },
        6: { cellWidth: 20 },
        7: { cellWidth: 20 },
        8: { cellWidth: 25 }
      }
    });

    // Summary Section
    const totalMovement = filteredData.reduce((acc, item) => acc + item.Total_Movement, 0);
    const fastMovingCount = filteredData.filter(item => item.Category === 'Fast').length;
    const slowMovingCount = filteredData.filter(item => item.Category === 'Slow').length;

    doc.text(`Total Items: ${filteredData.length}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Movement: ${totalMovement}`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Fast Moving Items: ${fastMovingCount}`, 14, doc.lastAutoTable.finalY + 22);
    doc.text(`Slow Moving Items: ${slowMovingCount}`, 14, doc.lastAutoTable.finalY + 28);

    // Save PDF
    doc.save(`item_movement_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Report_Id', 'Item_Code', 'Deliver_Id', 'Item_Name', 'Total_Movement', 'Last_Movement_Date', 'Days_Since_Movement', 'Category', 'Report_Date'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => 
        [item.Report_Id, item.Item_Code, item.Deliver_Id, item.Item_Name, item.Total_Movement, item.Last_Movement_Date, item.Days_Since_Movement, item.Category, item.Report_Date].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'item_movement_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get category status styles
  const getCategoryStatus = (category) => {
    if (category === "Fast") {
      return {
        color: "bg-green-100 text-green-800",
        label: "Fast Moving"
      };
    } else {
      return {
        color: "bg-yellow-100 text-yellow-800",
        label: "Slow Moving"
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
            <FaChartBar /> Fast & Slow Moving Items
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Analysis of fast and slow moving inventory items
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

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <p className="text-sm opacity-90">Total Items</p>
          <p className="text-2xl font-bold">{statistics.totalItems}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <p className="text-sm opacity-90">Fast Moving</p>
          <p className="text-2xl font-bold">{statistics.fastItems}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
          <p className="text-sm opacity-90">Slow Moving</p>
          <p className="text-2xl font-bold">{statistics.slowItems}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <p className="text-sm opacity-90">Total Movement</p>
          <p className="text-2xl font-bold">{statistics.totalMovement}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by item code, name, or deliver ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md p-2 pl-10 w-full"
            />
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

      {/* Table */}
      <motion.div
        className="overflow-x-auto bg-white rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaClipboardList className="text-blue-600" /> 
            Movement Report ({filteredData.length} records)
          </h3>
        </div>
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <tr>
              <th className="px-4 py-3">Report ID</th>
              <th className="px-4 py-3"><FaBarcode className="inline mr-2" />Item Code</th>
              <th className="px-4 py-3">Deliver ID</th>
              <th className="px-4 py-3"><FaTags className="inline mr-2" />Item Name</th>
              <th className="px-4 py-3">Total Movement</th>
              <th className="px-4 py-3">Last Movement Date</th>
              <th className="px-4 py-3">Days Since Movement</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Report Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => {
              const statusInfo = getCategoryStatus(item.Category);
              return (
                <tr key={index} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-blue-600">{item.Report_Id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.Item_Code}</td>
                  <td className="px-4 py-3 text-gray-700">{item.Deliver_Id}</td>
                  <td className="px-4 py-3 text-gray-900">{item.Item_Name}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{item.Total_Movement}</td>
                  <td className="px-4 py-3 text-gray-700">{item.Last_Movement_Date}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${
                      item.Days_Since_Movement <= 7 
                        ? "text-green-600" 
                        : item.Days_Since_Movement <= 30 
                        ? "text-yellow-600" 
                        : "text-red-600"
                    }`}>
                      {item.Days_Since_Movement} days
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{item.Report_Date}</td>
                  <td className="px-4 py-3">
                    <button 
                      className="text-blue-600 hover:text-blue-800 transition" 
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredData.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <FaExclamationTriangle className="w-full h-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No movement data found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No items match your current search criteria.
            </p>
            <div className="mt-6">
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center">
              <FaSync className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" />
              <span className="text-gray-600">Loading movement data...</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Summary Section */}
      <motion.div
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {/* Movement Analysis */}
        <div className="bg-white p-6 rounded-md shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaChartBar className="text-blue-600" /> Movement Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Movement:</span>
              <span className="font-semibold">
                {filteredData.length > 0 
                  ? Math.round(statistics.totalMovement / filteredData.length) 
                  : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fast Moving Percentage:</span>
              <span className="font-semibold text-green-600">
                {filteredData.length > 0 
                  ? Math.round((statistics.fastItems / filteredData.length) * 100) 
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Slow Moving Percentage:</span>
              <span className="font-semibold text-yellow-600">
                {filteredData.length > 0 
                  ? Math.round((statistics.slowItems / filteredData.length) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-md shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-600" /> Recent Activity
          </h3>
          <div className="space-y-3">
            {filteredData
              .sort((a, b) => new Date(b.Last_Movement_Date) - new Date(a.Last_Movement_Date))
              .slice(0, 3)
              .map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">{item.Item_Code}</span>
                    <p className="text-sm text-gray-500">{item.Item_Name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{item.Last_Movement_Date}</span>
                    <p className="text-xs text-gray-500">{item.Days_Since_Movement} days ago</p>
                  </div>
                </div>
              ))}
            {filteredData.length === 0 && (
              <p className="text-gray-500 text-sm">No recent activity to display</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <motion.div
          className="mt-6 flex items-center justify-between bg-white px-4 py-3 rounded-md shadow border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredData.length}</span> of{" "}
            <span className="font-medium">{filteredData.length}</span> results
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <motion.footer
        className="mt-12 pt-8 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="text-center text-sm text-gray-500">
          <p>Fast & Slow Moving Items Report - Generated on {new Date().toLocaleDateString()}</p>
          <p className="mt-1">Total records processed: {statistics.totalItems}</p>
        </div>
      </motion.footer>
    </div>
  );
}
