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
  FaDollarSign,
  FaChartBar,
  FaFileCsv
} from "react-icons/fa";
import "../../globals.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AgingInventoryReport() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [agingData, setAgingData] = useState([]);

  // Fetch real data from API
  useEffect(() => {
    fetchAgingData();
  }, []);

  const fetchAgingData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports/aging_inventory_report');
      if (!response.ok) {
        throw new Error('Failed to fetch aging inventory data');
      }
      const data = await response.json();
      setAgingData(data);
    } catch (error) {
      console.error('Error fetching aging inventory data:', error);
      // Fallback to empty array on error
      setAgingData([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate aging duration
  const calculateAgingDuration = (mfDate, exDate) => {
    const today = new Date();
    const expiry = new Date(exDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Expired ${Math.abs(diffDays)} days ago`;
    } else if (diffDays === 0) {
      return "Expires today";
    } else if (diffDays <= 30) {
      return `Expires in ${diffDays} days`;
    } else if (diffDays <= 90) {
      return `Expires in ${Math.ceil(diffDays / 30)} months`;
    } else {
      return `Expires in ${Math.ceil(diffDays / 365)} years`;
    }
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalItems = agingData.length;
    const today = new Date();
    
    const expiredItems = agingData.filter(item => {
      const expiryDate = new Date(item.Ex_Date);
      return expiryDate < today;
    }).length;
    
    const expiringItems = agingData.filter(item => {
      const expiryDate = new Date(item.Ex_Date);
      const diffTime = expiryDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 90;
    }).length;
    
    const healthyItems = totalItems - expiredItems - expiringItems;

    return {
      totalItems,
      expiredItems,
      expiringItems,
      healthyItems
    };
  }, [agingData]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    return agingData.filter(item => 
      item.Item_Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Item_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agingData, searchTerm]);

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
    fetchAgingData();
  };

  // Export to CSV functionality
  const exportToCSV = () => {
    const headers = [
      "Item Code",
      "Item Name", 
      "Brand",
      "Size",
      "Available Stock",
      "Price",
      "Country",
      "Manufacturing Date",
      "Expiry Date",
      "Aging Status",
      "Status"
    ];

    const csvData = filteredData.map(item => [
      item.Item_Code || '',
      item.Item_Name || '',
      item.Brand || '',
      item.Size || '',
      item.Available_Stock || 0,
      (item.Price || 0).toFixed(2),
      item.Country || '',
      item.MF_Date || '',
      item.Ex_Date || '',
      calculateAgingDuration(item.MF_Date, item.Ex_Date),
      item.Status || ''
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
    link.setAttribute('download', `aging_inventory_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF functionality
  const handleExportReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Aging Inventory Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);

    // Table
    const tableData = filteredData.map(item => [
      item.Item_Code || '',
      item.Item_Name || '',
      item.Brand || '',
      item.Size || '',
      item.Available_Stock || 0,
      `$${(item.Price || 0).toFixed(2)}`,
      item.MF_Date || '',
      item.Ex_Date || '',
      calculateAgingDuration(item.MF_Date, item.Ex_Date)
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Item Code", "Item Name", "Brand", "Size", "Stock", "Unit Price", "MF Date", "Expiry Date", "Aging Status"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    // Summary Section with null checks
    const totalStock = filteredData.reduce((acc, item) => acc + (item.Available_Stock || 0), 0);
    const totalVal = filteredData.reduce((acc, item) => acc + ((item.Available_Stock || 0) * (item.Price || 0)), 0);

    doc.text(`Total Items: ${filteredData.length}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Stock Units: ${totalStock}`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Expired Items: ${statistics.expiredItems}`, 14, doc.lastAutoTable.finalY + 22);
    doc.text(`Expiring Soon: ${statistics.expiringItems}`, 14, doc.lastAutoTable.finalY + 28);
    doc.text(`Total Inventory Value: $${totalVal.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 34);

    // Save PDF
    doc.save(`aging_inventory_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Get expiry status color
  const getExpiryStatus = (exDate) => {
    const today = new Date();
    const expiryDate = new Date(exDate);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        status: "Expired", 
        color: "bg-red-100 text-red-800",
        icon: <FaExclamationTriangle className="inline mr-1" />
      };
    } else if (diffDays <= 90) {
      return { 
        status: "Expiring Soon", 
        color: "bg-yellow-100 text-yellow-800",
        icon: <FaExclamationTriangle className="inline mr-1" />
      };
    } else {
      return { 
        status: "Good", 
        color: "bg-green-100 text-green-800",
        icon: <FaCalendarAlt className="inline mr-1" />
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
            <FaCalendarAlt /> Aging Inventory Report
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Comprehensive inventory aging and expiry analysis
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

      {/* Statistics Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
              <p className="text-sm opacity-90">Expired Items</p>
              <p className="text-2xl font-bold">{statistics.expiredItems}</p>
            </div>
            <FaExclamationTriangle className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Expiring Soon</p>
              <p className="text-2xl font-bold">{statistics.expiringItems}</p>
            </div>
            <FaCalendarAlt className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Healthy Items</p>
              <p className="text-2xl font-bold">{statistics.healthyItems}</p>
            </div>
            <FaChartBar className="text-3xl opacity-80" />
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
                placeholder="Search by item code, name, or brand..."
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

      {/* Aging Summary */}
      <motion.div 
        className="mb-8 bg-white p-6 rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartBar className="text-blue-600" /> Aging Analysis Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <FaExclamationTriangle className="text-red-600" />
                </div>
                <div>
                  <span className="font-medium">Expired Items</span>
                  <p className="text-sm text-gray-600">Immediate Action Required</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-red-700">
                {statistics.expiredItems}
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <FaCalendarAlt className="text-yellow-600" />
                </div>
                <div>
                  <span className="font-medium">Expiring Soon</span>
                  <p className="text-sm text-gray-600">Within 3 Months</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-yellow-700">
                {statistics.expiringItems}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <FaChartBar className="text-green-600" />
                </div>
                <div>
                  <span className="font-medium">Healthy Items</span>
                  <p className="text-sm text-gray-600">Good Condition</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-700">
                {statistics.healthyItems}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Aging Inventory Table */}
      <motion.div 
        className="overflow-x-auto bg-white rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaClipboardList className="text-blue-600" /> 
            Aging Inventory Report ({filteredData.length} records)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  <FaBarcode className="inline mr-2" />Item Code
                </th>
                <th className="px-4 py-3 font-semibold">
                  <FaTags className="inline mr-2" />Item Name
                </th>
                <th className="px-4 py-3 font-semibold">
                  <FaCalendarAlt className="inline mr-2" />Manufacturing Date
                </th>
                <th className="px-4 py-3 font-semibold">
                  <FaCalendarAlt className="inline mr-2" />Expiry Date
                </th>
                <th className="px-4 py-3 font-semibold">Expiry Duration</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item, index) => {
                const statusInfo = getExpiryStatus(item.Ex_Date);
                return (
                  <tr key={`${item.Item_Code}-${index}`} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-blue-600">{item.Item_Code}</td>
                    <td className="px-4 py-3 font-medium">{item.Item_Name}</td>
                    <td className="px-4 py-3">{item.MF_Date}</td>
                    <td className="px-4 py-3">{item.Ex_Date}</td>
                    <td className="px-4 py-3 font-medium">{calculateAgingDuration(item.MF_Date, item.Ex_Date)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}{statusInfo.status}
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
            <p className="text-lg font-medium">No aging inventory items found</p>
            <p className="text-sm">Try adjusting your search terms to see more results.</p>
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
            <FaBoxOpen /> Inventory Overview
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Total Items: <span className="font-semibold">{statistics.totalItems}</span></p>
            <p className="text-sm">Health Rate: <span className="font-semibold text-blue-600">{statistics.totalItems > 0 ? Math.round((statistics.healthyItems / statistics.totalItems) * 100) : 0}%</span></p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-md border border-red-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-red-700">
            <FaExclamationTriangle /> Critical Items
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Expired: <span className="font-semibold">{statistics.expiredItems}</span></p>
            <p className="text-sm">Expiring Soon: <span className="font-semibold text-red-600">{statistics.expiringItems}</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-md border border-emerald-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700">
            <FaChartBar /> Good Condition
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Healthy Items: <span className="font-semibold">{statistics.healthyItems}</span></p>
            <p className="text-sm">Percentage: <span className="font-semibold text-green-600">{statistics.totalItems > 0 ? Math.round((statistics.healthyItems / statistics.totalItems) * 100) : 0}%</span></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
