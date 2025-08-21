"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBoxOpen, FaCalendarAlt, FaDollarSign, FaCubes, FaBarcode, FaDownload, FaFileCsv } from "react-icons/fa";
import "../../globals.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function InventoryValuationReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real data from API
  const fetchData = async (start = "", end = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (start) params.append("startDate", start);
      if (end) params.append("endDate", end);
      
      const response = await fetch(`/api/reports/inventory_valiation_report?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch inventory data");
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate total valuation using API data
  const totalValuation = useMemo(() => {
    return data.reduce((acc, item) => acc + (item.Total || 0), 0);
  }, [data]);

  // Export to CSV functionality - updated for API data
  const exportToCSV = () => {
    const headers = [
      "Item Code",
      "Item Name",
      "Available Stock",
      "Unit Price",
      "Total Value",
      "Created Date"
    ];

    const csvData = data.map(item => [
      item.Item_Code || '',
      item.Item_Name || '',
      item.Available_Stock || 0,
      (item.Unit_Price || 0).toFixed(2),
      (item.Total || 0).toFixed(2),
      item.Created_Date || ''
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
    link.setAttribute('download', `inventory_valuation_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export function - updated for API data
  const handleExportReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Inventory Valuation Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);

    // Table
    const tableData = data.map(item => [
      item.Item_Code,
      item.Item_Name,
      item.Available_Stock || 0,
      `Rs.${(item.Unit_Price || 0).toFixed(2)}`,
      `Rs.${(item.Total || 0).toFixed(2)}`,
      item.Created_Date
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Item Code", "Item Name", "Stock", "Unit Price", "Total Value", "Date"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    // Summary Section
    const totalStock = data.reduce((acc, item) => acc + (item.Available_Stock || 0), 0);
    const totalVal = data.reduce((acc, item) => acc + (item.Total || 0), 0);

    doc.text(`Total Items: ${data.length}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Stock Units: ${totalStock}`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Total Inventory Valuation: Rs.${totalVal.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 22);

    // Save PDF
    doc.save(`inventory_valuation_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Filter handler - now uses API with date range
  const handleApplyFilters = () => {
    fetchData(startDate, endDate);
  };

  // Reset filters - fetch all data
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    fetchData();
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
            📊 Inventory Valuation Report
          </h1>
          <p className="text-sm opacity-90 mt-1">
            View and filter stock valuation data easily
          </p>
        </div>
      </motion.header>

      {/* Filters */}
      <motion.div 
        className="mb-8 flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 mb-1">
            <FaCalendarAlt className="inline mr-1" />Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
          />
        </div>
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 mb-1">
            <FaCalendarAlt className="inline mr-1" />End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleApplyFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition duration-200"
          >
            Reset
          </button>
        </div>
      </motion.div>

      {/* Loading and Error States */}
      {loading && (
        <motion.div 
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading inventory data...</p>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div 
          className="bg-red-50 border border-red-200 rounded-md p-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-red-600">
            <FaBoxOpen className="mx-auto text-4xl mb-2" />
            <p className="font-semibold">Error Loading Data</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => fetchData()}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </motion.div>
      )}

      {!loading && !error && (
        <>
          {/* Summary Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white p-4 rounded-md shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-blue-600">{data.length}</p>
                </div>
                <FaBoxOpen className="text-3xl text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Stock Units</p>
                  <p className="text-2xl font-bold text-green-600">
                    {data.reduce((acc, item) => acc + (item.Available_Stock || 0), 0)}
                  </p>
                </div>
                <FaCubes className="text-3xl text-green-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Valuation</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    Rs.{totalValuation.toLocaleString()}
                  </p>
                </div>
                <FaDollarSign className="text-3xl text-emerald-500" />
              </div>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div 
            className="overflow-x-auto bg-white rounded-md shadow border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-3">
                    <FaBarcode className="inline mr-2" />Item Code
                  </th>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3">Available Stock</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Total Value</th>
                  <th className="px-4 py-3">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <motion.tr
                    key={item.Item_Code}
                    className="border-t hover:bg-blue-50 transition duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-4 py-3 font-medium text-blue-600">{item.Item_Code}</td>
                    <td className="px-4 py-3">{item.Item_Name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {item.Available_Stock || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">Rs.{(item.Unit_Price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 font-bold text-green-600">
                      Rs.{(item.Total || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{item.Created_Date}</td>
                  </motion.tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      <FaBoxOpen className="mx-auto text-4xl mb-2 opacity-50" />
                      <p>No data found for selected date range.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>

          {/* Total Valuation Summary */}
          <motion.div
            className="mt-6 bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-md border border-emerald-200 shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-800">
                  <FaDollarSign className="text-emerald-600" /> Total Inventory Valuation
                </h2>
                <p className="text-3xl font-extrabold mt-2 text-emerald-700">
                  Rs.{totalValuation.toLocaleString()}
                </p>
                <p className="text-sm text-emerald-600 mt-1">
                  Based on {data.length} items with {data.reduce((acc, item) => acc + (item.Available_Stock || 0), 0)} total units
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                <button 
                  onClick={exportToCSV}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-md shadow hover:bg-emerald-700 transition duration-200 flex items-center gap-2"
                >
                  <FaFileCsv /> Export CSV
                </button>
                <button 
                  onClick={handleExportReport}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-md shadow hover:bg-emerald-700 transition duration-200 flex items-center gap-2"
                >
                  <FaDownload /> Download PDF
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
