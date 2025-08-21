"use client";
import "../app/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTachometerAlt,
  FaBell,
  FaChartLine,
  FaCertificate,
  FaUsers,
  FaShippingFast,
  FaBox,
  FaShoppingCart,
  FaFileInvoice,
  FaCashRegister,
  FaTruck,
  FaDollarSign,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaStar,
  FaClipboardList,
  FaWarehouse,
  FaShieldAlt,
  FaCalendarTimes,
  FaClock,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaClipboardCheck,
  FaSync,
  FaDownload,
  FaFilter,
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt,
  FaCreditCard,
  FaCalculator,
  FaUniversity,
  FaSun,
  FaMoon
} from "react-icons/fa";

interface DashboardData {
  totalProducts: number;
  lowStockAlerts: number;
  inventoryValue: number;
  ordersToday: number;
  activeSuppliers: number;
  pendingApprovals: number;
  timestamp: string;
}

interface AlertItem {
  id: number;
  name: string;
  expiry?: string;
  sku?: string;
  days?: number;
  severity: string;
  current?: number;
  minimum?: number;
  company?: string;
}

interface AlertsData {
  expiryAlerts: AlertItem[];
  lowStockAlerts: AlertItem[];
  certificationAlerts: AlertItem[];
}

interface StatsData {
  topProducts: Array<{ name: string; units: number }>;
  topSuppliers: Array<{ name: string; rating: number }>;
  orderStatus: Array<{ status: string; count: number; color: string }>;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  type: string;
  icon: string;
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    lowStockAlerts: 0,
    inventoryValue: 0,
    ordersToday: 0,
    activeSuppliers: 0,
    pendingApprovals: 0,
    timestamp: new Date().toISOString()
  });

  const [alertsData, setAlertsData] = useState<AlertsData>({
    expiryAlerts: [],
    lowStockAlerts: [],
    certificationAlerts: []
  });

  const [statsData, setStatsData] = useState<StatsData>({
    topProducts: [],
    topSuppliers: [],
    orderStatus: []
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: FaTachometerAlt, active: true, path: "/" },
    { name: "Analytics", icon: FaChartLine, path: "/analytics" },
    { name: "Alerts", icon: FaBell, path: "/alerts" },
    { name: "Certificate Management", icon: FaCertificate, path: "/certificate-management" },
    { name: "Customer Management", icon: FaUsers, path: "/customer-management" },
    { name: "Goods Issue", icon: FaShippingFast, path: "/GoodIssuePage" },
    { name: "Product Management", icon: FaBox, path: "/product-management" },
    { name: "Purchase Portal", icon: FaShoppingCart, path: "/PurchasePortalPage" },
    { name: "Quotations", icon: FaFileInvoice, path: "/QuotationPage"},
    { name: "Sales Portal", icon: FaCashRegister, path: "/SalesPortalPage" },
    { name: "Supplier Management", icon: FaTruck, path: "/supplier-management"},
    { name: "HR & Payroll", icon: FaUsers, path: "/Payroll" },
    { name: "Financial Reports", icon: FaDollarSign, path: "/Reports" },
    { name: "Expenses", icon: FaCreditCard, path: "/Expense" },
    { name: "Accounting", icon: FaCalculator, path: "/Accounting" },
    { name: "Banking", icon: FaUniversity, path: "/Banking" },
  ];

  // Report categories
  const reportCategories = [
    {
      name: "Analytics Reports",
      icon: FaChartLine,
      color: "bg-white dark:bg-gray-800",
      borderColor: "border-gray-200 dark:border-gray-700",
      iconBg: "bg-blue-500",
      titleColor: "text-gray-900 dark:text-white",
      reports: [
        { name: "Aging Inventory", description: "Track inventory aging patterns", path: "/analytics" },
        { name: "Dead Stock Report", description: "Identify non-moving items", path: "/analytics" },
        { name: "Stock Level Report", description: "Current availability status", path: "/analytics"},
        { name: "Sales Orders", description: "Analyze sales patterns", path: "/analytics" },
        { name: "Return Orders", description: "Monitor return processing", path: "/analytics" }
      ]
    },
    {
      name: "Financial Reports",
      icon: FaDollarSign,
      color: "bg-white dark:bg-gray-800",
      borderColor: "border-gray-200 dark:border-gray-700",
      iconBg: "bg-green-500",
      titleColor: "text-gray-900 dark:text-white",
      reports: [
        { name: "Profit & Loss", description: "Revenue and expense analysis", path: "/Reports" },
        { name: "Balance Sheet", description: "Assets and liabilities", path: "/Reports" },
        { name: "Cash Flow", description: "Track cash movements", path: "/Reports" },
        { name: "Budget vs Actual", description: "Compare planned vs actual", path: "/Reports" },
        { name: "Expense Reports", description: "Detailed expense breakdown", path: "/Reports" }
      ]
    }
  ];

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDarkMode(savedTheme === 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call with mock data
        const mockData = {
          success: true,
          dashboardData: {
            totalProducts: 1245,
            lowStockAlerts: 23,
            inventoryValue: 2.8,
            ordersToday: 42,
            activeSuppliers: 18,
            pendingApprovals: 7,
            timestamp: new Date().toISOString()
          },
          alertsData: {
            expiryAlerts: [
              { id: 1, name: "Antibiotic Ointment", expiry: "2023-12-15", sku: "MED-AB-100", days: 5, severity: "critical" },
              { id: 2, name: "Pain Relief Tablets", expiry: "2023-12-20", sku: "MED-PR-205", days: 10, severity: "warning" },
              { id: 3, name: "Vitamin C Supplements", expiry: "2024-01-05", sku: "NUT-VC-300", days: 25, severity: "info" }
            ],
            lowStockAlerts: [
              { id: 1, name: "Surgical Masks", current: 12, minimum: 50, severity: "critical" },
              { id: 2, name: "Disposable Gloves", current: 45, minimum: 100, severity: "warning" },
              { id: 3, name: "Hand Sanitizer", current: 78, minimum: 150, severity: "info" }
            ],
            certificationAlerts: [
              { id: 1, name: "ISO 13485 Certification", expiry: "2024-03-15", company: "MediSafe Inc.", days: 95, severity: "warning" },
              { id: 2, name: "FDA Approval", expiry: "2024-06-30", company: "HealthPlus Ltd.", days: 200, severity: "info" }
            ]
          },
          statsData: {
            topProducts: [
              { name: "N95 Respirator Masks", units: 1250 },
              { name: "Disposable Face Shields", units: 980 },
              { name: "Protective Gowns", units: 750 },
              { name: "Medical Gloves", units: 620 },
              { name: "Hand Sanitizer", units: 580 }
            ],
            topSuppliers: [
              { name: "MediSafe Supplies", rating: 98 },
              { name: "HealthGuard Products", rating: 95 },
              { name: "SafeCare Medical", rating: 93 },
              { name: "FirstAid Solutions", rating: 90 },
              { name: "MediQuick Distributors", rating: 88 }
            ],
            orderStatus: [
              { status: "Completed", count: 28, color: "text-green-600" },
              { status: "Processing", count: 9, color: "text-blue-600" },
              { status: "Pending", count: 5, color: "text-yellow-600" },
              { status: "Cancelled", count: 2, color: "text-red-600" }
            ]
          },
          notifications: [
            { id: 1, message: "New order received from City Hospital", time: "10 mins ago", type: "info", icon: "FaShoppingCart" },
            { id: 2, message: "Low stock alert for Surgical Masks", time: "25 mins ago", type: "warning", icon: "FaExclamationTriangle" },
            { id: 3, message: "Certificate expiring in 5 days", time: "1 hour ago", type: "critical", icon: "FaCertificate" }
          ]
        };

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setDashboardData(mockData.dashboardData);
        setAlertsData(mockData.alertsData);
        setStatsData(mockData.statsData);
        setNotifications(mockData.notifications);
        
        // Load user data from localStorage
        const storedUser = localStorage.getItem("user") || JSON.stringify({
          Name: "Admin User",
          Email: "admin@shimmers.com",
          Profile_Picture: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e80b206b-d44b-45d5-8245-238aac4171dd.png'
        });
        setUser(JSON.parse(storedUser));
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get severity styling
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-100 text-red-600';
      case 'warning':
        return 'bg-orange-50 border-orange-100 text-orange-600';
      case 'info':
        return 'bg-yellow-50 border-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-50 border-gray-100 text-gray-600';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 font-medium";
      case "warning":
        return "text-orange-600 font-medium";
      case "info":
        return "text-yellow-600 font-medium";
      default:
        return "text-gray-600";
    }
  };

  const handleNavClick = (path: string) => {
    router.push(path);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/loginPage");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-slate-900 dark:via-gray-900 dark:to-blue-900 min-h-screen transition-all duration-500">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {sidebarOpen ? <FaTimes className="text-gray-600 dark:text-gray-300 text-lg" /> : <FaBars className="text-gray-600 dark:text-gray-300 text-lg" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-40 overflow-y-auto transition-colors duration-300"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg mr-2">
              <FaBox />
            </span>
            Shimmers
          </h1>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    item.active
                      ? 'text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3" />
                  <span className="text-left">{item.name}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </nav>

      </motion.div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 transition-colors duration-300">
          <div className="flex items-center justify-between px-20 lg:px-6 py-4">
            <div className="lg:block">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
              </button>
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white relative transition-colors"
                >
                  <FaBell className="text-xl" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                <AnimatePresence>
                  {notificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                    >
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <button className="text-xs text-blue-600 hover:text-blue-800">Mark all as read</button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notification.type === 'critical' ? 'bg-red-500' :
                                notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 font-medium">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-200 text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <img 
                    src={user?.Profile_Picture} 
                    alt="User avatar" 
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                  <div className="hidden md:block text-left">
                    <span className="text-gray-700 font-medium">{user?.Name}</span>
                    <p className="text-sm text-gray-500">{user?.Email}</p>
                  </div>
                  <FaChevronDown className={`text-gray-400 transition-transform ${profileMenuOpen ? 'transform rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Key Metrics Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Profit Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/Reports')}
            >
              <div className="relative">
                <div className="absolute top-0 right-0 w-10 h-10 bg-green-500 rounded-lg shadow-md flex items-center justify-center">
                  <FaDollarSign className="text-sm text-white" />
                </div>
                <div className="pr-12">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">Profit</p>
                  <motion.p 
                    className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
                    key="450000"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    $450K
                  </motion.p>
                  <div className="flex items-center mt-3">
                    <FaArrowUp className="text-green-500 mr-1" />
                    <span className="text-sm text-green-500 font-medium">+15% from last month</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Total Revenue Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/Reports')}
            >
              <div className="relative">
                <div className="absolute top-0 right-0 w-10 h-10 bg-blue-500 rounded-lg shadow-md flex items-center justify-center">
                  <FaChartLine className="text-sm text-white" />
                </div>
                <div className="pr-12">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">Total Revenue</p>
                  <motion.p 
                    className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
                    key="1250000"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    $1.25M
                  </motion.p>
                  <div className="flex items-center mt-3">
                    <FaArrowUp className="text-green-500 mr-1" />
                    <span className="text-sm text-green-500 font-medium">+12% from last month</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Total Employees Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/Payroll')}
            >
              <div className="relative">
                <div className="absolute top-0 right-0 w-10 h-10 bg-indigo-500 rounded-lg shadow-md flex items-center justify-center">
                  <FaUsers className="text-sm text-white" />
                </div>
                <div className="pr-12">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">Total Employees</p>
                  <motion.p 
                    className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
                    key="48"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    48
                  </motion.p>
                  <div className="flex items-center mt-3">
                    <FaArrowUp className="text-green-500 mr-1" />
                    <span className="text-sm text-green-500 font-medium">+3 new hires</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Last Month Payroll Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/Payroll')}
            >
              <div className="relative">
                <div className="absolute top-0 right-0 w-10 h-10 bg-purple-500 rounded-lg shadow-md flex items-center justify-center">
                  <FaCreditCard className="text-sm text-white" />
                </div>
                <div className="pr-12">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">Last Month Payroll</p>
                  <motion.p 
                    className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
                    key="95000"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    $95K
                  </motion.p>
                  <div className="flex items-center mt-3">
                    <FaArrowUp className="text-green-500 mr-1" />
                    <span className="text-sm text-green-500 font-medium">On schedule</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Average Month Payroll Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/Payroll')}
            >
              <div className="relative">
                <div className="absolute top-0 right-0 w-10 h-10 bg-teal-500 rounded-lg shadow-md flex items-center justify-center">
                  <FaCalculator className="text-sm text-white" />
                </div>
                <div className="pr-12">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">Average Month Payroll</p>
                  <motion.p 
                    className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
                    key="92000"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    $92K
                  </motion.p>
                  <div className="flex items-center mt-3">
                    <FaCalculator className="text-blue-500 mr-1" />
                    <span className="text-sm text-blue-500 font-medium">6 month average</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Total Value of Expenses Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/Expense')}
            >
              <div className="relative">
                <div className="absolute top-0 right-0 w-10 h-10 bg-red-500 rounded-lg shadow-md flex items-center justify-center">
                  <FaCreditCard className="text-sm text-white" />
                </div>
                <div className="pr-12">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">Total Expenses</p>
                  <motion.p 
                    className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
                    key="185000"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    $185K
                  </motion.p>
                  <div className="flex items-center mt-3">
                    <FaArrowDown className="text-red-500 mr-1" />
                    <span className="text-sm text-red-500 font-medium">This month</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Second Row of Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {/* Count of Expenses Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/Expense')}
            >
              <div className="relative">
                <div className="absolute top-0 right-0 w-10 h-10 bg-orange-500 rounded-lg shadow-md flex items-center justify-center">
                  <FaClipboardList className="text-sm text-white" />
                </div>
                <div className="pr-12">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">Count of Expenses</p>
                  <motion.p 
                    className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
                    key="127"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    127
                  </motion.p>
                  <div className="flex items-center mt-3">
                    <FaClipboardList className="text-orange-500 mr-1" />
                    <span className="text-sm text-orange-500 font-medium">This month</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Total Assets Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/Accounting')}
            >
              <div className="relative">
                <div className="absolute top-0 right-0 w-10 h-10 bg-emerald-500 rounded-lg shadow-md flex items-center justify-center">
                  <FaUniversity className="text-sm text-white" />
                </div>
                <div className="pr-12">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">Total Assets</p>
                  <motion.p 
                    className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
                    key="2800000"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    $2.8M
                  </motion.p>
                  <div className="flex items-center mt-3">
                    <FaArrowUp className="text-green-500 mr-1" />
                    <span className="text-sm text-green-500 font-medium">+8% growth</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Total Liabilities Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/Accounting')}
            >
              <div className="relative">
                <div className="absolute top-0 right-0 w-10 h-10 bg-yellow-500 rounded-lg shadow-md flex items-center justify-center">
                  <FaExclamationTriangle className="text-sm text-white" />
                </div>
                <div className="pr-12">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">Total Liabilities</p>
                  <motion.p 
                    className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
                    key="850000"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    $850K
                  </motion.p>
                  <div className="flex items-center mt-3">
                    <FaArrowDown className="text-red-500 mr-1" />
                    <span className="text-sm text-red-500 font-medium">-5% decrease</span>
                  </div>
                </div>
              </div>
            </motion.div>


            {/* Total Products Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/product-management')}
            >
              <div className="relative">
                <div className="absolute top-0 right-0 w-10 h-10 bg-slate-500 rounded-lg shadow-md flex items-center justify-center">
                  <FaBox className="text-sm text-white" />
                </div>
                <div className="pr-12">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">Total Products</p>
                  <motion.p 
                    className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
                    key={dashboardData.totalProducts}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {dashboardData.totalProducts.toLocaleString()}
                  </motion.p>
                  <div className="flex items-center mt-3">
                    <FaArrowUp className="text-green-500 mr-1" />
                    <span className="text-sm text-green-500 font-medium">+12% from last month</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Inventory Value Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/product-management')}
            >
              <div className="relative">
                <div className="absolute top-0 right-0 w-10 h-10 bg-blue-500 rounded-lg shadow-md flex items-center justify-center">
                  <FaDollarSign className="text-sm text-white" />
                </div>
                <div className="pr-12">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">Inventory Value</p>
                  <motion.p 
                    className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
                    key={dashboardData.inventoryValue}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    ${dashboardData.inventoryValue.toFixed(1)}M
                  </motion.p>
                  <div className="flex items-center mt-3">
                    <FaArrowUp className="text-green-500 mr-1" />
                    <span className="text-sm text-green-500 font-medium">+8.2% this month</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Low Stock Alerts Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/product-management')}
            >
              <div className="relative">
                <div className="absolute top-0 right-0 w-10 h-10 bg-red-500 rounded-lg shadow-md flex items-center justify-center">
                  <FaExclamationTriangle className="text-sm text-white" />
                </div>
                <div className="pr-12">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">Low Stock Alerts</p>
                  <motion.p 
                    className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
                    key={dashboardData.lowStockAlerts}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {dashboardData.lowStockAlerts}
                  </motion.p>
                  <div className="flex items-center mt-3">
                    <FaExclamationTriangle className="text-red-500 mr-1" />
                    <span className="text-sm text-red-500 font-medium">Requires attention</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>


          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md mr-3">
                    <FaStar className="text-white" />
                  </div>
                  Top Products
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {statsData.topProducts.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 p-3 rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{product.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1.5 rounded-full shadow-md">
                      {product.units.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md mr-3">
                    <FaTruck className="text-white" />
                  </div>
                  Top Suppliers
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {statsData.topSuppliers.map((supplier, index) => (
                  <motion.div
                    key={supplier.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 p-3 rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{supplier.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-emerald-600 mr-3">{supplier.rating}%</span>
                      <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2.5 rounded-full shadow-sm" 
                          style={{ width: `${supplier.rating}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                  <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg shadow-md mr-3">
                    <FaClipboardList className="text-white" />
                  </div>
                  Orders Status
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {statsData.orderStatus.map((status, index) => (
                  <motion.div
                    key={status.status}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900/20 dark:hover:to-purple-900/20 p-3 rounded-lg transition-all duration-200"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{status.status}</span>
                    <span className={`text-sm font-bold px-3 py-1.5 rounded-full shadow-md ${
                      status.status === 'Completed' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' :
                      status.status === 'Processing' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' :
                      status.status === 'Pending' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white' :
                      'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                    }`}>
                      {status.count}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Reports Section */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 gap-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <div className="p-2 bg-gray-600 rounded-xl shadow-md mr-3">
                  <FaChartLine className="text-white text-lg sm:text-xl" />
                </div>
                <span className="text-sm sm:text-base md:text-lg">Combined Reports Dashboard</span>
              </h3>
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                <button className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 flex items-center">
                  <FaSync className="mr-1 sm:mr-2" /> <span className="hidden xs:inline">Refresh</span>
                </button>
                <button className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 flex items-center">
                  <FaDownload className="mr-1 sm:mr-2" /> <span className="hidden xs:inline">Export</span>
                </button>
              </div>
            </div>
            
            {/* Reports Grid */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {reportCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * categoryIndex }}
                  className={`${category.color} rounded-xl p-4 sm:p-6 border ${category.borderColor} transform hover:scale-[1.02] transition-transform cursor-pointer h-full shadow-md hover:shadow-lg`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    if (category.name === "Analytics Reports") {
                      router.push('/analytics');
                    } else if (category.name === "Financial Reports") {
                      router.push('/Reports');
                    } else {
                      router.push(`/analytics/${category.name.toLowerCase().replace(' ', '-')}`);
                    }
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-2 sm:p-3 ${category.iconBg} rounded-lg shadow-sm flex-shrink-0`}>
                      <category.icon className="text-white text-lg sm:text-xl" />
                    </div>
                    <h4 className={`text-base sm:text-lg font-bold ${category.titleColor} ml-3 sm:ml-4 leading-tight`}>{category.name}</h4>
                  </div>
                  <div className="space-y-3">
                    {category.reports.map((report, reportIndex) => (
                      <motion.a
                        key={report.name}
                        href={report.path || "#"}
                        onClick={(e) => {
                          if (report.path) {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(report.path);
                          }
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * reportIndex }}
                        className="block p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 transform hover:scale-[1.01]"
                        whileHover={{ scale: 1.01 }}
                      >
                        <h5 className="font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm leading-tight">{report.name}</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{report.description}</p>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}