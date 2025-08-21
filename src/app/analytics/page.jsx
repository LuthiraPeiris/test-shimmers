'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../globals.css';
import {
    FaChartBar,
    FaFileAlt,
    FaClipboardList,
    FaRocket,
    FaMoneyBillWave,
    FaFileInvoice,
    FaShoppingCart,
    FaComments,
    FaUndo,
    FaChartLine,
    FaBoxOpen,
    FaBox,
    FaCertificate,
    FaDollarSign,
    FaChartPie,
    FaStore,
    FaDatabase,
    FaSearch,
    FaFilter,
    FaEye,
    FaArrowRight,
    FaCalendarAlt,
    FaClock
} from 'react-icons/fa';

const AnalyticsPage = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid');

    // Report data with enhanced metadata
    const reports = [
        {
            id: 'aging-inventory-report',
            title: "Aging Inventory Report",
            description: "Track inventory aging patterns and identify slow-moving items to optimize stock levels",
            icon: FaChartBar,
            category: "Inventory",
            path: "/analytics/aging-inventory-report",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            lastUpdated: "2 hours ago",
            status: "active"
        },
        {
            id: 'certification-expiry-report',
            title: "Certification Expiry Report",
            description: "Monitor certification expiry dates and maintain compliance status across all products",
            icon: FaCertificate,
            category: "Compliance",
            path: "/analytics/certification-expiry-report",
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            lastUpdated: "1 hour ago",
            status: "active"
        },
        {
            id: 'dead-stock-report',
            title: "Dead Stock Report",
            description: "Identify non-moving inventory items and optimize warehouse space utilization",
            icon: FaClipboardList,
            category: "Inventory",
            path: "/analytics/dead-stock-report",
            color: "from-red-500 to-red-600",
            bgColor: "bg-red-50 dark:bg-red-900/20",
            iconColor: "text-red-600 dark:text-red-400",
            lastUpdated: "3 hours ago",
            status: "active"
        },
        {
            id: 'fast-slow-moving-item-report',
            title: "Fast/Slow Moving Items",
            description: "Analyze product velocity and movement patterns for better inventory planning",
            icon: FaRocket,
            category: "Inventory",
            path: "/analytics/fast-slow-moving-item-report",
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            iconColor: "text-purple-600 dark:text-purple-400",
            lastUpdated: "30 minutes ago",
            status: "active"
        },
        {
            id: 'inventory-valuation-report',
            title: "Inventory Valuation Report",
            description: "Calculate comprehensive inventory value and perform detailed cost analysis",
            icon: FaMoneyBillWave,
            category: "Financial",
            path: "/analytics/inventory-valuation-report",
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-900/20",
            iconColor: "text-amber-600 dark:text-amber-400",
            lastUpdated: "45 minutes ago",
            status: "active"
        },
        {
            id: 'invoice-counter-report',
            title: "Invoice Counter Report",
            description: "Track invoice generation metrics with detailed customer and product insights",
            icon: FaChartBar,
            category: "Sales",
            path: "/analytics/invoice-counter-report",
            color: "from-teal-500 to-teal-600",
            bgColor: "bg-teal-50 dark:bg-teal-900/20",
            iconColor: "text-teal-600 dark:text-teal-400",
            lastUpdated: "1 hour ago",
            status: "active"
        },
        {
            id: 'invoice-report',
            title: "Invoice Report",
            description: "Comprehensive invoice analysis and tracking with revenue insights",
            icon: FaFileInvoice,
            category: "Sales",
            path: "/analytics/invoice-report",
            color: "from-indigo-500 to-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
            iconColor: "text-indigo-600 dark:text-indigo-400",
            lastUpdated: "2 hours ago",
            status: "active"
        },
        {
            id: 'purchase-orders-report',
            title: "Purchase Orders Report",
            description: "Monitor and analyze purchase order activities and supplier performance",
            icon: FaShoppingCart,
            category: "Procurement",
            path: "/analytics/purchase-orders-report",
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
            iconColor: "text-orange-600 dark:text-orange-400",
            lastUpdated: "4 hours ago",
            status: "active"
        },
        {
            id: 'quotation-report',
            title: "Quotation Report",
            description: "Track quotation requests and analyze conversion rates for better sales insights",
            icon: FaComments,
            category: "Sales",
            path: "/analytics/quatation-report",
            color: "from-pink-500 to-pink-600",
            bgColor: "bg-pink-50 dark:bg-pink-900/20",
            iconColor: "text-pink-600 dark:text-pink-400",
            lastUpdated: "1 hour ago",
            status: "active"
        },
        {
            id: 'return-order-report',
            title: "Return Order Report",
            description: "Analyze return orders, refund processing, and customer satisfaction metrics",
            icon: FaUndo,
            category: "Sales",
            path: "/analytics/return-order-report",
            color: "from-rose-500 to-rose-600",
            bgColor: "bg-rose-50 dark:bg-rose-900/20",
            iconColor: "text-rose-600 dark:text-rose-400",
            lastUpdated: "3 hours ago",
            status: "active"
        },
        {
            id: 'sales-order-report',
            title: "Sales Order Report",
            description: "Comprehensive sales analysis with customer behavior and product performance insights",
            icon: FaChartLine,
            category: "Sales",
            path: "/analytics/sales-order-report",
            color: "from-cyan-500 to-cyan-600",
            bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
            iconColor: "text-cyan-600 dark:text-cyan-400",
            lastUpdated: "30 minutes ago",
            status: "active"
        },
        {
            id: 'stock-report',
            title: "Stock Level Report",
            description: "Monitor current stock levels and availability status across all locations",
            icon: FaBoxOpen,
            category: "Inventory",
            path: "/analytics/stock-level-report",
            color: "from-slate-500 to-slate-600",
            bgColor: "bg-slate-50 dark:bg-slate-900/20",
            iconColor: "text-slate-600 dark:text-slate-400",
            lastUpdated: "15 minutes ago",
            status: "active"
        }
    ];

    // Categories for filtering
    const categories = [
        { name: 'All', icon: FaChartPie, count: reports.length },
        { name: 'Inventory', icon: FaBox, count: reports.filter(r => r.category === 'Inventory').length },
        { name: 'Sales', icon: FaChartLine, count: reports.filter(r => r.category === 'Sales').length },
        { name: 'Financial', icon: FaDollarSign, count: reports.filter(r => r.category === 'Financial').length },
        { name: 'Compliance', icon: FaCertificate, count: reports.filter(r => r.category === 'Compliance').length },
        { name: 'Procurement', icon: FaStore, count: reports.filter(r => r.category === 'Procurement').length }
    ];

    // Filter reports based on search term and category
    const filteredReports = reports.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            report.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Group reports by category
    const groupedReports = filteredReports.reduce((acc, report) => {
        if (!acc[report.category]) {
            acc[report.category] = [];
        }
        acc[report.category].push(report);
        return acc;
    }, {});

    const handleReportClick = (reportPath) => {
        router.push(reportPath);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
    };

    const scrollToSection = (category) => {
        const element = document.getElementById(category.toLowerCase());
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-gray-900 dark:to-blue-900 transition-all duration-500">
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Analytics <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dashboard</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Comprehensive business intelligence and reporting suite for data-driven decisions
                        </p>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            {/* Search Input */}
                            <div className="relative flex-1 w-full">
                                <input
                                    type="text"
                                    placeholder="Search reports, analytics, and insights..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                            </div>

                            {/* Filter Button */}
                            <button className="flex items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                                <FaFilter className="mr-2" />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-3 justify-center mb-8">
                        {categories.map((category) => (
                            <button
                                key={category.name}
                                onClick={() => handleCategoryFilter(category.name)}
                                className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                                    selectedCategory === category.name
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                                }`}
                            >
                                <category.icon className="mr-2" />
                                {category.name}
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                    selectedCategory === category.name
                                        ? 'bg-white bg-opacity-20 text-white'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                }`}>
                                    {category.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reports Grid */}
                {filteredReports.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center">
                            <FaFileAlt className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No reports found</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Try adjusting your search criteria or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredReports.map((report) => (
                            <div
                                key={report.id}
                                onClick={() => handleReportClick(report.path)}
                                className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
                                    {/* Card Header */}
                                    <div className={`${report.bgColor} p-6 relative overflow-hidden`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                                        <div className="relative z-10 flex items-start justify-between">
                                            <div className={`w-14 h-14 ${report.bgColor} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <report.icon className={`${report.iconColor} text-2xl`} />
                                            </div>
                                            <div className="text-right">
                                                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${report.iconColor} ${report.bgColor}`}>
                                                    <FaClock className="mr-1" />
                                                    {report.lastUpdated}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6">
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                                {report.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${report.iconColor} ${report.bgColor}`}>
                                                    {report.category}
                                                </span>
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">LIVE</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                                            {report.description}
                                        </p>

                                        {/* Action Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <FaDatabase className="mr-2" />
                                                Real-time data
                                            </div>
                                            <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105">
                                                <FaEye className="mr-2" />
                                                View Report
                                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Stats */}
                {filteredReports.length > 0 && (
                    <div className="mt-16 text-center">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                        {filteredReports.length}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                                        Available Reports
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                        Real-time
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                                        Data Updates
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                        {Object.keys(groupedReports).length}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                                        Report Categories
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AnalyticsPage;