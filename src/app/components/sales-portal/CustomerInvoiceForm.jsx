import { useState, useEffect } from "react";

const CustomerInvoiceForm = ({ isOpen, onClose, invoiceData, mode, onSave }) => {
  const [formData, setFormData] = useState({
    Invoice_ID: "",
    Invoice_No: "",
    Customer_ID: "",
    User_ID: "",
    Sales_Order_ID: "",
    Invoice_Date: new Date().toISOString().split("T")[0],
    Payment_Terms: "Net 30",
    Total_Amount: 0,
    Tax_Amount: 0,
    Grand_Total: 0,
    Notes: "",
    Status: "PENDING",
    items: []
  });

  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredSalesOrders, setFilteredSalesOrders] = useState([]);
  const [searchUserTerm, setSearchUserTerm] = useState("");
  const [searchSalesOrderTerm, setSearchSalesOrderTerm] = useState("");

  // Fetch data on mount
  useEffect(() => {
    fetchCustomers();
    fetchUsers();
    fetchSalesOrders();
  }, []);

  // Load data for edit mode
  useEffect(() => {
    if (invoiceData) {
      setFormData({
        ...invoiceData,
        items: invoiceData.items || []
      });
    }
  }, [invoiceData]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customer-management");
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user-management");
      const data = await response.json();
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchSalesOrders = async () => {
    try {
      const response = await fetch("/api/sales-order/available");
      const data = await response.json();
      setSalesOrders(data || []);
      setFilteredSalesOrders(data || []);
    } catch (error) {
      console.error("Error fetching sales orders:", error);
    }
  };

  const handleUserSearch = (term) => {
    setSearchUserTerm(term);
    if (term.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.User_ID?.toLowerCase().includes(term.toLowerCase()) ||
          user.Name?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleSalesOrderSearch = (term) => {
    setSearchSalesOrderTerm(term);
    if (term.trim() === "") {
      setFilteredSalesOrders(salesOrders);
    } else {
      const filtered = salesOrders.filter(
        (order) =>
          order.Sales_Order_ID?.toLowerCase().includes(term.toLowerCase()) ||
          order.Customer_Name?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredSalesOrders(filtered);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save invoice:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {mode === "create" ? "Create" : "Edit"} Customer Invoice
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Selection */}
            <div>
              <label className="block text-sm font-medium">Customer</label>
              <select
                name="Customer_ID"
                value={formData.Customer_ID}
                onChange={(e) => setFormData({...formData, Customer_ID: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.Customer_ID} value={customer.Customer_ID}>
                    {customer.Name} ({customer.Customer_ID})
                  </option>
                ))}
              </select>
            </div>

            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium">User</label>
              <select
                name="User_ID"
                value={formData.User_ID}
                onChange={(e) => setFormData({...formData, User_ID: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select User</option>
                {filteredUsers.map(user => (
                  <option key={user.User_ID} value={user.User_ID}>
                    {user.Name || user.User_ID}
                  </option>
                ))}
              </select>
            </div>

            {/* Sales Order Selection */}
            <div>
              <label className="block text-sm font-medium">Sales Order</label>
              <select
                name="Sales_Order_ID"
                value={formData.Sales_Order_ID}
                onChange={(e) => setFormData({...formData, Sales_Order_ID: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Sales Order</option>
                {filteredSalesOrders.map(order => (
                  <option key={order.Sales_Order_ID} value={order.Sales_Order_ID}>
                    {order.Sales_Order_ID} - {order.Customer_Name}
                  </option>
                ))}
              </select>
            </div>

            {/* Other form fields */}
            <div>
              <label className="block text-sm font-medium">Invoice Date</label>
              <input
                type="date"
                name="Invoice_Date"
                value={formData.Invoice_Date}
                onChange={(e) => setFormData({...formData, Invoice_Date: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Total Amount</label>
              <input
                type="number"
                name="Total_Amount"
                value={formData.Total_Amount}
                onChange={(e) => setFormData({...formData, Total_Amount: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Notes</label>
              <textarea
                name="Notes"
                value={formData.Notes}
                onChange={(e) => setFormData({...formData, Notes: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {mode === 'create' ? 'Create Invoice' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerInvoiceForm;
