"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaFileAlt, 
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
  FaUser,
  FaProductHunt,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../globals.css";

export default function SalesOrderReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState("customer"); // "customer" or "product"
  const [statusFilter, setStatusFilter] = useState("all");

  const [salesOrders, setSalesOrders] = useState([]);

  // Calculate statistics based on current view
  const statistics = useMemo(() => {
    let data = salesOrders;
    
    if (viewType === "customer") {
      const completedOrders = data.filter(order => order.Status === "Completed");
      const processingOrders = data.filter(order => order.Status === "Processing");
      const shippedOrders = data.filter(order => order.Status === "Shipped");
      const pendingOrders = data.filter(order => order.Status === "PENDING");
      const cancelledOrders = data.filter(order => order.Status === "Cancelled");
      
      const totalAmount = data.reduce((acc, order) => acc + (order.Total_Amount || 0), 0);
      const totalTax = data.reduce((acc, order) => acc + (order.Tax_Amount || 0), 0);
      const totalDiscount = data.reduce((acc, order) => acc + (order.Discount_Amount || 0), 0);
      const totalNet = data.reduce((acc, order) => acc + (order.Net_Amount || 0), 0);
      
      return {
        totalOrders: data.length,
        completedCount: completedOrders.length,
        processingCount: processingOrders.length,
        shippedCount: shippedOrders.length,
        pendingCount: pendingOrders.length,
        cancelledCount: cancelledOrders.length,
        totalAmount,
        totalTax,
        totalDiscount,
        totalNet,
        uniqueCustomers: new Set(data.map(order => order.Customer_ID)).size
      };
    } else {
      const completedOrders = data.filter(order => order.Status === "Completed");
      const processingOrders = data.filter(order => order.Status === "Processing");
      const shippedOrders = data.filter(order => order.Status === "Shipped");
      const pendingOrders = data.filter(order => order.Status === "PENDING");
      const cancelledOrders = data.filter(order => order.Status === "Cancelled");
      
      const totalAmount = data.reduce((acc, order) => acc + (order.Total_Price || 0), 0);
      const totalQuantity = data.reduce((acc, order) => acc + (order.Quantity || 0), 0);
      
      return {
        totalOrders: data.length,
        completedCount: completedOrders.length,
        processingCount: processingOrders.length,
        shippedCount: shippedOrders.length,
        pendingCount: pendingOrders.length,
        cancelledCount: cancelledOrders.length,
        totalAmount,
        totalQuantity,
        uniqueProducts: new Set(data.map(order => order.Item_Code)).size
      };
    }
  }, [salesOrders, viewType]);

  // Filter data based on search term and status
  const filteredData = useMemo(() => {
    let filtered = salesOrders;
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.Status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Apply search filter
    if (searchTerm) {
      if (viewType === "customer") {
        filtered = filtered.filter(order => 
          order.Sales_Order_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.Customer_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.Customer_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.Status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.Customer_Phone.includes(searchTerm)
        );
      } else {
        filtered = filtered.filter(order => 
          order.Sales_Order_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.Item_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.Item_Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.Status.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }
    
    return filtered;
  }, [salesOrders, searchTerm, statusFilter, viewType]);

  // Fetch data based on view type and date range
  const fetchSalesOrders = async () => {
    setLoading(true);
    
    try {
      const endpoint = viewType === "customer" 
        ? "/api/reports/sales_order_report/customer_wise"
        : "/api/reports/sales_order_report/product_wise";
      
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      
      const url = `${endpoint}?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      // Transform API data to match expected format
      const transformedData = data.map((item, index) => {
        if (viewType === "customer") {
          return {
            Sales_Order_ID: `CUST${index + 1}`,
            Customer_ID: item.Customer_ID,
            Customer_Name: item.Customer_Name,
            Customer_Address: item.Customer_Address || 'N/A',
            Customer_Phone: item.Customer_Phone || 'N/A',
            Order_Date: item.First_Order_Date || new Date().toISOString().split('T')[0],
            Delivery_Date: item.Last_Order_Date || null,
            Payment_Terms: 'Net 30',
            Total_Amount: parseFloat(item.Total_Amount || 0),
            Tax_Amount: parseFloat(item.Total_Tax || 0),
            Discount_Amount: parseFloat(item.Total_Discount || 0),
            Net_Amount: parseFloat(item.Total_Net_Amount || 0),
            Status: 'Completed',
            Remarks: `Total Orders: ${item.Total_Orders || 0}`
          };
        } else {
          return {
            Sales_Order_Item_ID: index + 1,
            Sales_Order_ID: `PROD${index + 1}`,
            Item_Code: item.Item_Code,
            Item_Name: item.Item_Name,
            Quantity: parseInt(item.Total_Quantity || 0),
            Unit_Price: parseFloat(item.Average_Unit_Price || 0),
            Total_Price: parseFloat(item.Total_Amount || 0),
            Remarks: item.Remarks || 'N/A',
            Order_Date: item.First_Order_Date || new Date().toISOString().split('T')[0],
            Status: 'Completed'
          };
        }
      });
      
      setSalesOrders(transformedData);
    } catch (error) {
      console.error('Error fetching sales orders:', error);
      setSalesOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle view type change
  const handleViewTypeChange = (newViewType) => {
    setViewType(newViewType);
    setSearchTerm("");
    setStatusFilter("all");
  };

  // Handle filter application
  const handleApplyFilters = () => {
    fetchSalesOrders();
  };

  // Reset filters
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setStatusFilter("all");
    fetchSalesOrders();
  };

  // Export Customer-wise Report to PDF
  const handleExportCustomerReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Customer-wise Sales Order Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);

    // Table for customer-wise data
    const tableData = filteredData.map(order => [
      order.Sales_Order_ID,
      order.Customer_ID,
      order.Customer_Name,
      order.Customer_Phone,
      order.Order_Date,
      order.Delivery_Date || 'N/A',
      order.Payment_Terms,
      `$${order.Total_Amount.toFixed(2)}`,
      `$${order.Tax_Amount.toFixed(2)}`,
      `$${order.Discount_Amount.toFixed(2)}`,
      `$${order.Net_Amount.toFixed(2)}`,
      order.Status
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Order ID", "Customer ID", "Customer Name", "Phone", "Order Date", "Delivery Date", "Payment Terms", "Total Amount", "Tax", "Discount", "Net Amount", "Status"]],
      body: tableData,
      theme: "grid",
            headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 8 }
    });

    // Summary Section for Customer Report
    const totalAmount = filteredData.reduce((acc, order) => acc + order.Total_Amount, 0);
    const totalTax = filteredData.reduce((acc, order) => acc + order.Tax_Amount, 0);
    const totalDiscount = filteredData.reduce((acc, order) => acc + order.Discount_Amount, 0);
    const totalNet = filteredData.reduce((acc, order) => acc + order.Net_Amount, 0);

    doc.text(`Total Orders: ${filteredData.length}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Amount: $${totalAmount.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Total Tax: $${totalTax.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 22);
    doc.text(`Total Discount: $${totalDiscount.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 28);
    doc.text(`Net Amount: $${totalNet.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 34);

    // Save PDF
    doc.save(`customer_wise_sales_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Export Product-wise Report to PDF
  const handleExportProductReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Product-wise Sales Order Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);

    // Table for product-wise data
    const tableData = filteredData.map(order => [
      order.Sales_Order_ID,
      order.Item_Code,
      order.Item_Name,
      order.Quantity,
      `$${order.Unit_Price.toFixed(2)}`,
      `$${order.Total_Price.toFixed(2)}`,
      order.Order_Date,
      order.Status,
      order.Remarks || 'N/A'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Order ID", "Item Code", "Item Name", "Quantity", "Unit Price", "Total Price", "Order Date", "Status", "Remarks"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 8 }
    });

    // Summary Section for Product Report
    const totalQuantity = filteredData.reduce((acc, order) => acc + order.Quantity, 0);
    const totalAmount = filteredData.reduce((acc, order) => acc + order.Total_Price, 0);

    doc.text(`Total Items: ${filteredData.length}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Quantity: ${totalQuantity.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Total Amount: $${totalAmount.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 22);
    doc.text(`Unique Products: ${statistics.uniqueProducts}`, 14, doc.lastAutoTable.finalY + 28);

    // Save PDF
    doc.save(`product_wise_sales_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Load initial data
  useEffect(() => {
    fetchSalesOrders();
  }, [viewType]);

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return { 
          color: "bg-green-100 text-green-800", 
          icon: <FaCheckCircle className="inline mr-1" /> 
        };
      case "processing":
        return { 
          color: "bg-blue-100 text-blue-800", 
          icon: <FaSync className="inline mr-1" /> 
        };
      case "shipped":
        return { 
          color: "bg-purple-100 text-purple-800", 
          icon: <FaTruck className="inline mr-1" /> 
        };
      case "pending":
        return { 
          color: "bg-yellow-100 text-yellow-800", 
          icon: <FaClock className="inline mr-1" /> 
        };
      case "cancelled":
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

  // Safe number formatting function
  const formatCurrency = (value) => {
    return (value || 0).toLocaleString();
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
            <FaFileAlt /> Sales Order Report
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Comprehensive sales order analysis - {viewType === "customer" ? "Customer-wise" : "Product-wise"} view
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button 
            onClick={viewType === "customer" ? handleExportCustomerReport : handleExportProductReport}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition flex items-center gap-2 shadow-md"
          >
            <FaDownload /> Export PDF
          </button>
        </div>
      </motion.header>

      {/* View Type Toggle */}
      <motion.div 
        className="mb-8 bg-white p-6 rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartBar className="text-blue-600" /> Report View Selection
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => handleViewTypeChange("customer")}
            className={`flex items-center gap-2 px-6 py-3 rounded-md transition ${
              viewType === "customer" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaUser /> Customer-wise View
          </button>
          <button
            onClick={() => handleViewTypeChange("product")}
            className={`flex items-center gap-2 px-6 py-3 rounded-md transition ${
              viewType === "product" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaProductHunt /> Product-wise View
          </button>
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
            <label className="text-sm font-medium mb-1">Order Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${viewType === "customer" ? "customers" : "products"}...`}
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Orders</p>
              <p className="text-2xl font-bold">{statistics.totalOrders}</p>
            </div>
            <FaFileAlt className="text-3xl opacity-80" />
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

        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Processing</p>
              <p className="text-2xl font-bold">{statistics.processingCount}</p>
            </div>
            <FaSync className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Shipped</p>
              <p className="text-2xl font-bold">{statistics.shippedCount}</p>
            </div>
            <FaTruck className="text-3xl opacity-80" />
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

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Amount</p>
              <p className="text-xl font-bold">LKR{formatCurrency(statistics.totalAmount)}</p>
            </div>
                     <FaDollarSign className="text-3xl opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Additional Statistics */}
      <motion.div 
        className="mb-8 bg-white p-6 rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartBar className="text-blue-600" /> 
          {viewType === "customer" ? "Customer" : "Product"} Analysis Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {viewType === "customer" ? (
            <>
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-full">
                      <FaDollarSign className="text-emerald-600" />
                    </div>
                    <div>
                      <span className="font-medium">Total Revenue</span>
                      <p className="text-sm text-gray-600">Gross Amount</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-emerald-700">
                    LKR {formatCurrency(statistics.totalAmount)}
                  </span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FaTags className="text-blue-600" />
                    </div>
                    <div>
                      <span className="font-medium">Total Tax</span>
                      <p className="text-sm text-gray-600">Tax Amount</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-blue-700">
                    LKR {formatCurrency(statistics.totalTax)}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <FaTags className="text-orange-600" />
                    </div>
                    <div>
                      <span className="font-medium">Total Discounts</span>
                      <p className="text-sm text-gray-600">Amount Saved</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-orange-700">
                    LKR {formatCurrency(statistics.totalDiscount)}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <FaUsers className="text-purple-600" />
                    </div>
                    <div>
                      <span className="font-medium">Unique Customers</span>
                      <p className="text-sm text-gray-600">Active Count</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-purple-700">
                    {statistics.uniqueCustomers}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-full">
                      <FaDollarSign className="text-emerald-600" />
                    </div>
                    <div>
                      <span className="font-medium">Total Revenue</span>
                      <p className="text-sm text-gray-600">Product Sales</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-emerald-700">
                    LKR {formatCurrency(statistics.totalAmount)}
                  </span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FaBoxOpen className="text-blue-600" />
                    </div>
                    <div>
                      <span className="font-medium">Total Quantity</span>
                      <p className="text-sm text-gray-600">Items Sold</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-blue-700">
                    {formatCurrency(statistics.totalQuantity)}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <FaProductHunt className="text-orange-600" />
                    </div>
                    <div>
                      <span className="font-medium">Unique Products</span>
                      <p className="text-sm text-gray-600">Product Count</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-orange-700">
                    {statistics.uniqueProducts}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <FaChartBar className="text-purple-600" />
                    </div>
                    <div>
                      <span className="font-medium">Avg. Order Value</span>
                      <p className="text-sm text-gray-600">Per Item</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-purple-700">
                    LKR {statistics.totalOrders > 0 ? (statistics.totalAmount / statistics.totalOrders).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Sales Orders Table */}
      <motion.div 
        className="overflow-x-auto bg-white rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaClipboardList className="text-blue-600" /> 
            {viewType === "customer" ? "Customer-wise" : "Product-wise"} Sales Orders ({filteredData.length} records)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Order ID</th>
                {viewType === "customer" ? (
                  <>
                    <th className="px-4 py-3 font-semibold">
                      <FaUser className="inline mr-2" />Customer ID
                    </th>
                    <th className="px-4 py-3 font-semibold">Customer Name</th>
                    <th className="px-4 py-3 font-semibold">
                      <FaPhone className="inline mr-2" />Phone
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      <FaMapMarkerAlt className="inline mr-2" />Address
                    </th>
                    <th className="px-4 py-3 font-semibold">Payment Terms</th>
                    <th className="px-4 py-3 font-semibold">Total Amount</th>
                    <th className="px-4 py-3 font-semibold">Tax Amount</th>
                    <th className="px-4 py-3 font-semibold">Discount</th>
                    <th className="px-4 py-3 font-semibold">Net Amount</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3 font-semibold">
                      <FaBarcode className="inline mr-2" />Item Code
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      <FaTags className="inline mr-2" />Item Name
                    </th>
                    <th className="px-4 py-3 font-semibold">Quantity</th>
                    <th className="px-4 py-3 font-semibold">Unit Price</th>
                    <th className="px-4 py-3 font-semibold">Total Price</th>
                    <th className="px-4 py-3 font-semibold">Remarks</th>
                  </>
                )}
                <th className="px-4 py-3 font-semibold">
                  <FaCalendarAlt className="inline mr-2" />Order Date
                </th>
                <th className="px-4 py-3 font-semibold">
                  <FaCalendarAlt className="inline mr-2" />Delivery Date
                </th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((order, index) => {
                const statusInfo = getStatusInfo(order.Status);
                return (
                  <tr
                    key={`${order.Sales_Order_ID}-${index}`}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-blue-600">{order.Sales_Order_ID}</td>
                    {viewType === "customer" ? (
                      <>
                        <td className="px-4 py-3">{order.Customer_ID}</td>
                        <td className="px-4 py-3 font-medium">{order.Customer_Name}</td>
                        <td className="px-4 py-3">{order.Customer_Phone}</td>
                        <td className="px-4 py-3 text-sm">{order.Customer_Address}</td>
                        <td className="px-4 py-3">{order.Payment_Terms}</td>
                        <td className="px-4 py-3 font-semibold text-green-600">
                          ${formatCurrency(order.Total_Amount)}
                        </td>
                        <td className="px-4 py-3">LKR {formatCurrency(order.Tax_Amount)}</td>
                        <td className="px-4 py-3">LKR {formatCurrency(order.Discount_Amount)}</td>
                        <td className="px-4 py-3 font-semibold text-purple-600">
                          ${formatCurrency(order.Net_Amount)}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-mono text-sm">{order.Item_Code}</td>
                        <td className="px-4 py-3 font-medium">{order.Item_Name}</td>
                        <td className="px-4 py-3 text-center">{order.Quantity}</td>
                        <td className="px-4 py-3">LKR {formatCurrency(order.Unit_Price)}</td>
                        <td className="px-4 py-3 font-semibold text-green-600">
                          LKR {formatCurrency(order.Total_Price)}
                        </td>
                        <td className="px-4 py-3 text-sm">{order.Remarks || 'N/A'}</td>
                      </>
                    )}
                    <td className="px-4 py-3">{order.Order_Date}</td>
                    <td className="px-4 py-3">{viewType === "customer" ? (order.Delivery_Date || 'N/A') : 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}{order.Status}
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
            <p className="text-lg font-medium">No sales orders found</p>
            <p className="text-sm">Try adjusting your filters or search terms to see more results.</p>
          </div>
        )}
      </motion.div>

      {/* Summary Footer */}
      <motion.div
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-md border border-blue-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-blue-700">
            <FaFileAlt /> Order Summary
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Total Orders: <span className="font-semibold">{statistics.totalOrders}</span></p>
            <p className="text-sm">Revenue: <span className="font-semibold text-blue-600">LKR {formatCurrency(statistics.totalAmount)}</span></p>
            {viewType === "customer" && (
              <p className="text-sm">Net Amount: <span className="font-semibold text-blue-600">LKR {formatCurrency(statistics.totalNet)}</span></p>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-md border border-emerald-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-700">
            <FaCheckCircle /> Completed Orders
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Count: <span className="font-semibold">{statistics.completedCount}</span></p>
            <p className="text-sm">Success Rate: <span className="font-semibold text-green-600">{statistics.totalOrders > 0 ? Math.round((statistics.completedCount / statistics.totalOrders) * 100) : 0}%</span></p>
            <p className="text-sm">Processing: <span className="font-semibold text-blue-600">{statistics.processingCount}</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-amber-100 p-6 rounded-md border border-amber-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-amber-700">
            <FaTruck /> Delivery Status
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">Shipped: <span className="font-semibold">{statistics.shippedCount}</span></p>
            <p className="text-sm">Pending: <span className="font-semibold text-yellow-600">{statistics.pendingCount}</span></p>
            <p className="text-sm">Cancelled: <span className="font-semibold text-red-600">{statistics.cancelledCount}</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-100 p-6 rounded-md border border-purple-200 shadow">
          <h3 className="text-lg font-bold flex items-center gap-2 text-purple-700">
            {viewType === "customer" ? <FaUsers /> : <FaProductHunt />} 
            {viewType === "customer" ? "Customer Insights" : "Product Insights"}
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              {viewType === "customer" ? "Unique Customers" : "Unique Products"}: 
              <span className="font-semibold"> {viewType === "customer" ? statistics.uniqueCustomers : statistics.uniqueProducts}</span>
            </p>
            {viewType === "customer" ? (
              <>
                <p className="text-sm">Total Tax: <span className="font-semibold text-purple-600">LKR {formatCurrency(statistics.totalTax)}</span></p>
                <p className="text-sm">Total Discount: <span className="font-semibold text-orange-600">LKR {formatCurrency(statistics.totalDiscount)}</span></p>
              </>
            ) : (
              <>
                <p className="text-sm">Total Quantity: <span className="font-semibold text-purple-600">{formatCurrency(statistics.totalQuantity)}</span></p>
                <p className="text-sm">Avg. Order Value: <span className="font-semibold text-green-600">LKR {statistics.totalOrders > 0 ? (statistics.totalAmount / statistics.totalOrders).toFixed(2) : '0.00'}</span></p>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div 
        className="mt-8 bg-white p-6 rounded-md shadow border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartBar className="text-blue-600" /> Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {statistics.totalOrders > 0 ? Math.round((statistics.completedCount / statistics.totalOrders) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Order Completion Rate</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${statistics.totalOrders > 0 ? (statistics.completedCount / statistics.totalOrders) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {viewType === "customer" 
                ? `$${statistics.totalOrders > 0 ? (statistics.totalAmount / statistics.totalOrders).toFixed(0) : '0'}`
                : `${statistics.totalOrders > 0 ? Math.round(statistics.totalQuantity / statistics.totalOrders) : 0}`
              }
            </div>
            <div className="text-sm text-gray-600">
              {viewType === "customer" ? "Average Order Value" : "Average Quantity per Order"}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {viewType === "customer" ? "Per Customer Order" : "Items per Order"}
            </div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {statistics.totalOrders > 0 ? Math.round(((statistics.shippedCount + statistics.completedCount) / statistics.totalOrders) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Fulfillment Rate</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${statistics.totalOrders > 0 ? ((statistics.shippedCount + statistics.completedCount) / statistics.totalOrders) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">
                <strong>Most Active Status:</strong> {
                  Object.entries({
                    'Completed': statistics.completedCount,
                    'Processing': statistics.processingCount,
                    'Shipped': statistics.shippedCount,
                    'Pending': statistics.pendingCount,
                    'Cancelled': statistics.cancelledCount
                  }).reduce((a, b) => a[1] > b[1] ? a : b)[0]
                }
              </p>
              {viewType === "customer" && (
                <p className="text-gray-600">
                  <strong>Average Tax Rate:</strong> {
                    statistics.totalAmount > 0 
                      ? ((statistics.totalTax / statistics.totalAmount) * 100).toFixed(1)
                      : '0'
                  }%
                </p>
              )}
            </div>
            <div>
              <p className="text-gray-600">
                <strong>Data Range:</strong> {
                  filteredData.length > 0 
                    ? `${Math.min(...filteredData.map(o => new Date(o.Order_Date).getTime()))} - ${Math.max(...filteredData.map(o => new Date(o.Order_Date).getTime()))}`
                    : 'No data'
                }
              </p>
              {viewType === "customer" && (
                <p className="text-gray-600">
                  <strong>Average Discount:</strong> {
                    statistics.totalAmount > 0 
                      ? ((statistics.totalDiscount / statistics.totalAmount) * 100).toFixed(1)
                      : '0'
                  }%
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}