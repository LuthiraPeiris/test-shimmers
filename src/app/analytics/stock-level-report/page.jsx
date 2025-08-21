"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaSearch,
  FaDownload,
  FaClipboardList,
  FaFilter,
  FaSync,
  FaFileCsv,
  FaFilePdf
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../globals.css";

export default function StockLevelReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryData, setInventoryData] = useState([]);

  const fetchStockLevelData = async (startDate, endDate) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(
        `/api/reports/stock_level_report?${params.toString()}`
      );

      if (!response.ok) throw new Error("Failed to fetch stock level data");

      const data = await response.json();
      setInventoryData(data);
    } catch (error) {
      console.error("Error fetching stock level data:", error);
      setInventoryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockLevelData();
  }, []);

  const filteredData = useMemo(() => {
    let filtered = inventoryData;

    if (startDate && endDate) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.Created_Date) >= new Date(startDate) &&
          new Date(item.Created_Date) <= new Date(endDate)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.Item_Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Item_Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [inventoryData, startDate, endDate, searchTerm]);

  const totalStockValue = filteredData.reduce(
    (sum, item) => sum + Number(item.Total || 0),
    0
  );

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "Item Code",
      "Item Name",
      "Available Stock",
      "Unit Price",
      "Total Value",
      "Created Date"
    ];

    const rows = filteredData.map((item) => [
      item.Item_Code,
      item.Item_Name,
      item.Available_Stock,
      item.Unit_Price,
      item.Total,
      item.Created_Date
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stock_level_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Stock Level Report", 14, 10);
    doc.autoTable({
      head: [
        [
          "Item Code",
          "Item Name",
          "Available Stock",
          "Unit Price",
          "Total Value",
          "Created Date"
        ]
      ],
      body: filteredData.map((item) => [
        item.Item_Code,
        item.Item_Name,
        item.Available_Stock,
        item.Unit_Price,
        item.Total,
        item.Created_Date
      ]),
      startY: 20,
    });

    doc.save("stock_level_report.pdf");
  };

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    fetchStockLevelData();
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
            <FaBoxOpen /> Stock Level Report
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Comprehensive inventory valuation report
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            onClick={exportCSV}
            className="bg-white bg-opacity-20 px-4 py-2 rounded-md hover:bg-opacity-30 transition flex items-center gap-2"
          >
            <FaFileCsv /> Export CSV
          </button>
          <button
            onClick={exportPDF}
            className="bg-white bg-opacity-20 px-4 py-2 rounded-md hover:bg-opacity-30 transition flex items-center gap-2"
          >
            <FaFilePdf /> Export PDF
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
            <label className="text-sm font-medium mb-1">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md p-2 pl-10 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
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

      {/* Inventory Table */}
      <motion.div
        className="overflow-x-auto bg-white rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaClipboardList className="text-blue-600" />
            Inventory Valuation Report ({filteredData.length} records)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Item Code</th>
                <th className="px-4 py-3 font-semibold">Item Name</th>
                <th className="px-4 py-3 font-semibold">Available Stock</th>
                <th className="px-4 py-3 font-semibold">Unit Price</th>
                <th className="px-4 py-3 font-semibold">Total Value</th>
                <th className="px-4 py-3 font-semibold">
                  <FaCalendarAlt className="inline mr-2" /> Created Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr
                  key={`${item.Item_Code}-${index}`}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-blue-600">
                    {item.Item_Code}
                  </td>
                  <td className="px-4 py-3">{item.Item_Name}</td>
                  <td className="px-4 py-3 text-center">
                    {item.Available_Stock}
                  </td>
                  <td className="px-4 py-3">${item.Unit_Price}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">
                    ${item.Total}
                  </td>
                  <td className="px-4 py-3">{item.Created_Date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Stock Value */}
        <div className="p-4 border-t bg-gray-50 text-right font-bold text-lg text-blue-700">
          Total Stock Value: ${totalStockValue.toFixed(2)}
        </div>

        {filteredData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FaBoxOpen className="text-4xl mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No inventory items found</p>
            <p className="text-sm">
              Try adjusting your filters or search terms to see more results.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
