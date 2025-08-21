"use client";

import "../../globals.css";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, eachMonthOfInterval, startOfMonth, endOfMonth, differenceInDays } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Function to determine certificate status based on expiry date
const getCertificateStatus = (expiryDate) => {
  const today = new Date();
  const expiry = parseISO(expiryDate);
  const daysUntilExpiry = differenceInDays(expiry, today);

  if (daysUntilExpiry < 0) {
    return "Expired";
  } else if (daysUntilExpiry <= 30) {
    return "Expiring Soon";
  } else {
    return "Active";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Expired":
      return "bg-red-100 text-red-800";
    case "Expiring Soon":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const CertificateExpiryReport = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load certificates data from API
  const loadCertificates = async () => {
    setLoading(true);
    try {
      const url = `/api/reports/certification_expiry_report?startDate=${startDate}&endDate=${endDate}`;
      console.log('Fetching from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch certificates: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Invalid data format:', data);
        throw new Error('Invalid data format received');
      }
      
      setCertificates(data);
      applyFilters(data, statusFilter, searchTerm);
    } catch (error) {
      console.error('Error loading certificates:', error);
      setCertificates([]);
      setFilteredCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  // Load and filter by date
  useEffect(() => {
    loadCertificates();
  }, [startDate, endDate]);

  useEffect(() => {
    applyFilters(certificates, statusFilter, searchTerm);
  }, [statusFilter, searchTerm, certificates]);

  const applyFilters = (data, status, search) => {
    let filtered = data.map(cert => ({
      ...cert,
      status: getCertificateStatus(cert.Expiry_Date)
    }));

    if (status !== "All") {
      filtered = filtered.filter((cert) => cert.status === status);
    }
    
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (cert) => 
          cert.Certificate_Name.toLowerCase().includes(lowerSearch) ||
          cert.Item_Name.toLowerCase().includes(lowerSearch) ||
          cert.Item_Code.toLowerCase().includes(lowerSearch) ||
          cert.Reg_Id.toLowerCase().includes(lowerSearch)
      );
    }
    
    setFilteredCertificates(filtered);
    prepareChartData(filtered);
  };

  const prepareChartData = (data) => {
    if (data.length === 0) {
      setChartData([]);
      return;
    }

    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const months = eachMonthOfInterval({ start, end });

    const expiryCounts = months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const count = data.filter((cert) => {
        const expiry = parseISO(cert.Expiry_Date);
        return expiry >= monthStart && expiry <= monthEnd;
      }).length;
      return { month: format(month, "MMM yyyy"), expiries: count };
    });

    setChartData(expiryCounts);
  };

  const handleApplyFilters = () => {
    loadCertificates();
  };

  const exportToCSV = () => {
    const headers = ['Reg_Id', 'Certificate_Name', 'Item_Code', 'Item_Name', 'Expiry_Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredCertificates.map(cert => 
        [cert.Reg_Id, cert.Certificate_Name, cert.Item_Code, cert.Item_Name, cert.Expiry_Date, cert.status].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificate_expiry_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Certificate Expiry Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${format(new Date(), "MMM dd, yyyy 'at' HH:mm")}`, 14, 28);
    doc.text(`Date Range: ${format(parseISO(startDate), "MMM dd, yyyy")} - ${format(parseISO(endDate), "MMM dd, yyyy")}`, 14, 34);

    const tableData = filteredCertificates.map(cert => {
      const daysUntilExpiry = differenceInDays(parseISO(cert.Expiry_Date), new Date());
      const daysText = daysUntilExpiry < 0 
        ? `${Math.abs(daysUntilExpiry)} days ago`
        : `${daysUntilExpiry} days`;
      
      return [
        cert.Reg_Id,
        cert.Certificate_Name,
        cert.Item_Code,
        cert.Item_Name,
        format(parseISO(cert.Expiry_Date), "MMM dd, yyyy"),
        cert.status,
        daysText
      ];
    });

    autoTable(doc, {
      startY: 42,
      head: [["Reg ID", "Certificate Name", "Item Code", "Item Name", "Expiry Date", "Status", "Days Until Expiry"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    doc.save(`certificate_expiry_report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <header className="mb-8 border-b border-gray-300 pb-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 rounded-md shadow-sm">
        <h1 className="text-3xl font-bold">Certificate Expiry Report</h1>
        <p className="text-sm opacity-90 mt-1">Monitor and manage certificate expirations across your organization</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Certificates</h3>
          <p className="text-2xl font-bold text-gray-900">{filteredCertificates.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active</h3>
          <p className="text-2xl font-bold text-green-600">
            {filteredCertificates.filter(cert => cert.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Expiring Soon</h3>
          <p className="text-2xl font-bold text-amber-600">
            {filteredCertificates.filter(cert => cert.status === 'Expiring Soon').length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Expired</h3>
          <p className="text-2xl font-bold text-red-600">
            {filteredCertificates.filter(cert => cert.status === 'Expired').length}
          </p>
        </div>
      </div>

      <div className="mb-8 flex flex-col lg:flex-row gap-4 items-end">
        <div className="flex flex-col w-full lg:w-auto">
          <label className="text-sm font-medium text-black mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-400 rounded-md p-2 focus:border-blue-500 text-black"
          />
        </div>

        <div className="flex flex-col w-full lg:w-auto">
          <label className="text-sm font-medium text-black mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-400 rounded-md p-2 focus:border-blue-500 text-black"
          />
        </div>

        <div className="flex flex-col w-full lg:w-auto">
          <label className="text-sm font-medium text-black mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-400 rounded-md p-2 focus:border-blue-500 text-black"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <div className="flex flex-col w-full lg:w-auto lg:min-w-[250px]">
          <label className="text-sm font-medium text-black mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search certificates..."
            className="border border-gray-400 rounded-md p-2 focus:border-blue-500 text-black"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 shadow-sm disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Apply Filters'}
          </button>
          
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 shadow-sm"
          >
            Export CSV
          </button>

          <button
            onClick={handleExportReport}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 shadow-sm ml-2"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="mb-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Certificate Expirations by Month</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fill: "#374151" }} />
              <YAxis tick={{ fill: "#374151" }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px"
                }} 
              />
              <Legend wrapperStyle={{ color: "#1f2937" }} />
              <Bar dataKey="expiries" fill="#3b82f6" name="Certificate Expirations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Registration ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Certificate Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Item Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Days Until Expiry
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCertificates.map((cert, index) => {
              const daysUntilExpiry = differenceInDays(parseISO(cert.Expiry_Date), new Date());
              return (
                <tr
                  key={cert.Reg_Id}
                  className={`hover:bg-blue-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cert.Reg_Id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cert.Certificate_Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cert.Item_Code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cert.Item_Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(parseISO(cert.Expiry_Date), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        cert.status
                      )}`}
                    >
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`font-medium ${
                        daysUntilExpiry < 0
                          ? "text-red-600"
                          : daysUntilExpiry <= 30
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}
                    >
                      {daysUntilExpiry < 0
                        ? `${Math.abs(daysUntilExpiry)} days ago`
                        : `${daysUntilExpiry} days`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
            {filteredCertificates.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {certificates.length === 0 ? 'No certificates in database' : 'No certificates match filters'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {certificates.length === 0 
                    ? 'The certification_report table appears to be empty. Please add some certificate data.' 
                    : 'Try adjusting your date range or search criteria.'}
                </p>
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => {
                      const date = new Date();
                      date.setMonth(date.getMonth() - 6);
                      setStartDate(date.toISOString().split('T')[0]);
                      const future = new Date();
                      future.setFullYear(future.getFullYear() + 1);
                      setEndDate(future.toISOString().split('T')[0]);
                      setStatusFilter("All");
                      setSearchTerm("");
                      handleApplyFilters();
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reset to Default Range
                  </button>
                  <div className="text-xs text-gray-400">
                    Date range: {startDate} to {endDate}
                  </div>
                </div>
              </div>
            )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-600">Loading certificates...</span>
            </div>
          </div>
        )}
      </div>

      {filteredCertificates.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredCertificates.length}</span> of{" "}
            <span className="font-medium">{filteredCertificates.length}</span> results
          </div>
        </div>
      )}

      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center text-sm text-gray-500">
          <p>Certificate Expiry Report - Last updated: {format(new Date(), "MMM dd, yyyy 'at' HH:mm")}</p>
        </div>
      </footer>
    </div>
  );
};

export default CertificateExpiryReport;
