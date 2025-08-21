import React, { useState, useEffect } from "react";

const InvoiceModal = ({ isOpen, onClose, onSave, invoiceData, mode }) => {
  // ===========================
  // 1️⃣ Form State
  // ===========================
  const [formData, setFormData] = useState({
    Invoice_ID: "",
    Invoice_No: "",
    Customer_ID: "",
    Customer_Name: "",
    Customer_Address: "",
    Customer_Phone: "",
    User_ID: "",
    Invoice_Date: new Date().toISOString().split("T")[0],
    Payment_Terms: "",
    Notes: "",
    Status: "PENDING",
    Total_Amount: 0,
    Tax_Amount: 0,
    Grand_Total: 0,
    invoice_items: [],
    Sales_Order_ID: "",
    Tax_Rate: 10,
  });

  // ===========================
  // 2️⃣ Data State
  // ===========================
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ===========================
  // 3️⃣ Filtered Data & UI State
  // ===========================
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredItems, setFilteredItems] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredSalesOrders, setFilteredSalesOrders] = useState([]);

  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState({});
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSalesOrderDropdown, setShowSalesOrderDropdown] = useState(false);

  const [searchCustomerTerm, setSearchCustomerTerm] = useState("");
  const [searchUserTerm, setSearchUserTerm] = useState("");
  const [searchItemTerm, setSearchItemTerm] = useState({});
  const [searchSalesOrderTerm, setSearchSalesOrderTerm] = useState("");

  // ===========================
  // 4️⃣ Initialize Form When Modal Opens
  // ===========================
  useEffect(() => {
    if (!isOpen) return;

    // Reset success state when modal opens
    setSaveSuccess(false);

    if (mode === "edit" && invoiceData) {
      setFormData({
        Invoice_ID: invoiceData.Invoice_ID || "",
        Invoice_No: invoiceData.Invoice_No || "",
        Customer_ID: invoiceData.Customer_ID || "",
        Customer_Name: invoiceData.Customer_Name || "",
        Customer_Address: invoiceData.Customer_Address || "",
        Customer_Phone: invoiceData.Customer_Phone || "",
        User_ID: invoiceData.User_ID || "",
        Invoice_Date:
          invoiceData.Invoice_Date || new Date().toISOString().split("T")[0],
        Payment_Terms: invoiceData.Payment_Terms || "",
        Notes: invoiceData.Notes || "",
        Status: invoiceData.Status || "PENDING",
        Total_Amount: invoiceData.Total_Amount || 0,
        Tax_Amount: invoiceData.Tax_Amount || 0,
        Grand_Total: invoiceData.Grand_Total || 0,
        invoice_items: invoiceData.invoice_items || [],
        Sales_Order_ID: invoiceData.Sales_Order_ID || "",
        Tax_Rate: invoiceData.Tax_Rate || 10,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        Invoice_ID: "",
        Invoice_No: "",
        Customer_ID: "",
        Customer_Name: "",
        Customer_Address: "",
        Customer_Phone: "",
        User_ID: "",
        Invoice_Date: new Date().toISOString().split("T")[0],
        Payment_Terms: "",
        Notes: "",
        Status: "PENDING",
        Total_Amount: 0,
        Tax_Amount: 0,
        Grand_Total: 0,
        invoice_items: [],
        Sales_Order_ID: "",
        Tax_Rate: 10,
      }));
      fetchNextInvoiceNo();
    }

    fetchCustomers();
    fetchItems();
    fetchUsers();
    fetchSalesOrders();
  }, [isOpen, mode, invoiceData]);

  // ===========================
  // 5️⃣ API Fetch Functions
  // ===========================
  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customer-management");
      const data = await res.json();
      setCustomers(data.customers || []);
      setFilteredCustomers(data.customers || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/product-management");
      const data = await res.json();

      const normalizedItems = (data.products || data || []).map((item) => ({
        Item_Code: item.Item_Code || item.itemCode || "",
        Item_Name: item.Item_Name || item.itemName || "",
        Unit_Price: item.Unit_Price || item.price || 0,
        Brand: item.Brand || item.brand || "",
        Size: item.Size || item.size || "",
        Available_Stock: item.Available_Stock || item.stock || 0,
      }));

      setItems(normalizedItems);

      const initialFilteredItems = {};
      formData.invoice_items.forEach((_, idx) => {
        initialFilteredItems[idx] = normalizedItems;
      });
      setFilteredItems(initialFilteredItems);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

const fetchUsers = async () => {
  try {
    const response = await fetch("/api/user-management");
    const data = await response.json();
    console.log("User data", data);
    
    // Ensure data is an array before using map
    let usersArray = [];
    
    if (Array.isArray(data)) {
      // If data is already an array, use it directly
      usersArray = data;
    } else if (data && typeof data === 'object') {
      // If data is an object, check for common array properties
      if (data.users && Array.isArray(data.users)) {
        usersArray = data.users;
      } else if (data.data && Array.isArray(data.data)) {
        usersArray = data.data;
      } else if (data.items && Array.isArray(data.items)) {
        usersArray = data.items;
      } else {
        // If it's a single object, wrap it in an array
        usersArray = [data];
      }
    } else {
      // Fallback to empty array
      usersArray = [];
    }
    
    // Transform data with defensive checks
    const transformedUsers = usersArray.map(user => ({
      User_ID: user?.user_id || user?.User_ID || '',
      Name: user?.name || user?.Name || 'Unknown',
      Email: user?.email || user?.Email || ''
    })).filter(user => user.User_ID); // Filter out invalid entries
    
    setUsers(transformedUsers);
    setFilteredUsers(transformedUsers);
    
  } catch (error) {
    console.error("Error fetching users:", error);
    // Set empty arrays on error
    setUsers([]);
    setFilteredUsers([]);
  }
};
  const fetchNextInvoiceNo = async () => {
    try {
      const res = await fetch("/api/invoices/next-no");
      const data = await res.json();
      setFormData((prev) => ({ ...prev, Invoice_No: data.nextNo || "" }));
    } catch (err) {
      console.error("Error fetching next invoice number:", err);
    }
  };

const fetchSalesOrders = async () => {
  try {
    const response = await fetch("/api/sales-order");
    const data = await response.json();
    console.log("Salesorder available", data);
    
    // Ensure data is an array before using map
    let salesOrdersArray = [];
    
    if (Array.isArray(data)) {
      // If data is already an array, use it directly
      salesOrdersArray = data;
    } else if (data && typeof data === 'object') {
      // If data is an object, check for common array properties
      if (data.salesOrders && Array.isArray(data.salesOrders)) {
        salesOrdersArray = data.salesOrders;
      } else if (data.data && Array.isArray(data.data)) {
        salesOrdersArray = data.data;
      } else if (data.items && Array.isArray(data.items)) {
        salesOrdersArray = data.items;
      } else {
        // If it's a single object, wrap it in an array
        salesOrdersArray = [data];
      }
    } else {
      // Fallback to empty array
      salesOrdersArray = [];
    }
    
    // Transform data with defensive checks
    const transformedSalesOrders = salesOrdersArray.map(order => ({
      Sales_Order_ID: order?.Sales_Order_ID || order?.sales_order_id || '',
      Customer_ID: order?.Customer_ID || order?.customer_id || '',
      Customer_Name: order?.Customer_Name || order?.customer_name || 'Unknown',
      Order_Date: order?.Order_Date || order?.order_date || '',
      Status: order?.Status || order?.status || 'Pending',
      Total_Amount: order?.Total_Amount || order?.total_amount || 0
    })).filter(order => order.Sales_Order_ID); // Filter out invalid entries
    
    setSalesOrders(transformedSalesOrders);
    setFilteredSalesOrders(transformedSalesOrders);
    
  } catch (error) {
    console.error("Error fetching sales orders:", error);
    // Set empty arrays on error
    setSalesOrders([]);
    setFilteredSalesOrders([]);
  }
};

  // ===========================
  // 6️⃣ Input Handlers
  // ===========================
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    
    if (id === "Tax_Rate") {
      calculateTotals(formData.invoice_items, parseFloat(value) || 0);
    }
  };

  const handleCustomerSearch = (e) => {
    const term = e.target.value;
    setSearchCustomerTerm(term);
    if (!term.trim()) {
      setFilteredCustomers(customers);
    } else {
      setFilteredCustomers(
        customers.filter(
          (c) =>
            c.Customer_ID.toLowerCase().includes(term.toLowerCase()) ||
            c.Name.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    setShowCustomerDropdown(true);
  };

  const handleCustomerSelect = (customer) => {
    setFormData((prev) => ({
      ...prev,
      Customer_ID: customer.Customer_ID,
      Customer_Name: customer.Name,
      Customer_Address: customer.Address || "",
      Customer_Phone: customer.Phone || "",
    }));
    setShowCustomerDropdown(false);
    setSearchCustomerTerm("");
  };

  const handleUserSearch = (e) => {
    const term = e.target.value;
    setSearchUserTerm(term);
    if (!term.trim()) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          (u) =>
            u.User_ID.toLowerCase().includes(term.toLowerCase()) ||
            u.Name.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    setShowUserDropdown(true);
  };

  const handleUserSelect = (user) => {
    setFormData((prev) => ({
      ...prev,
      User_ID: user.User_ID,
    }));
    setShowUserDropdown(false);
    setSearchUserTerm("");
  };

  const handleItemSearch = (index, term) => {
    setSearchItemTerm((prev) => ({ ...prev, [index]: term }));
    if (!term.trim()) {
      setFilteredItems((prev) => ({ ...prev, [index]: items }));
    } else {
      setFilteredItems((prev) => ({
        ...prev,
        [index]: items.filter(
          (i) =>
            i.Item_Code?.toLowerCase().includes(term.toLowerCase()) ||
            i.Item_Name?.toLowerCase().includes(term.toLowerCase())
        ),
      }));
    }
    setShowItemDropdown((prev) => ({ ...prev, [index]: true }));
  };

  const handleItemSelect = (index, selectedItem) => {
    const updatedItems = [...formData.invoice_items];

    updatedItems[index] = {
      ...updatedItems[index],
      Item_Code: selectedItem.Item_Code,
      Item_Name: selectedItem.Item_Name,
      Unit_Price: parseFloat(selectedItem.Unit_Price),
      Quantity: updatedItems[index]?.Quantity || 1,
      Total_Price:
        parseFloat(selectedItem.Unit_Price) *
        (updatedItems[index]?.Quantity || 1),
    };

    setFormData((prev) => ({ ...prev, invoice_items: updatedItems }));
    setShowItemDropdown((prev) => ({ ...prev, [index]: false }));
    setSearchItemTerm((prev) => ({ ...prev, [index]: "" }));
    calculateTotals(updatedItems, formData.Tax_Rate);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.invoice_items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (field === "Quantity" || field === "Unit_Price") {
      const qty = parseFloat(updatedItems[index].Quantity) || 0;
      const price = parseFloat(updatedItems[index].Unit_Price) || 0;
      updatedItems[index].Total_Price = (qty * price).toFixed(2);
    }

    setFormData((prev) => ({ ...prev, invoice_items: updatedItems }));
    calculateTotals(updatedItems, formData.Tax_Rate);
  };

  const calculateTotals = (items, taxRate = formData.Tax_Rate) => {
    const total = items.reduce(
      (sum, item) => sum + parseFloat(item.Total_Price || 0),
      0
    );
    const tax = total * (taxRate / 100);
    const grand = total + tax;
    setFormData((prev) => ({
      ...prev,
      Total_Amount: total.toFixed(2),
      Tax_Amount: tax.toFixed(2),
      Grand_Total: grand.toFixed(2),
    }));
  };

  const handleSalesOrderSelect = (salesOrderId) => {
    const selectedOrder = salesOrders.find(
      (order) => order.Sales_Order_ID === salesOrderId
    );
    
    if (selectedOrder) {
      setFormData((prev) => ({
        ...prev,
        Sales_Order_ID: salesOrderId,
        Customer_ID: selectedOrder.Customer_ID,
        Customer_Name: selectedOrder.Customer_Name,
        Customer_Address: selectedOrder.Customer_Address || "",
        Customer_Phone: selectedOrder.Customer_Phone || "",
        Payment_Terms: selectedOrder.Payment_Terms || "",
        User_ID: selectedOrder.User_ID || "",
      }));

      if (selectedOrder.items && selectedOrder.items.length > 0) {
        const invoiceItems = selectedOrder.items.map((item) => ({
          Invoice_Item_ID: "",
          Item_Code: item.Item_Code,
          Item_Name: item.Item_Name,
          Quantity: item.Quantity,
          Unit_Price: parseFloat(item.Unit_Price),
          Total_Price: parseFloat(item.Total_Price).toFixed(2),
          Sales_Order_ID: salesOrderId,
          SR_No: "",
          MF_Date: "",
          Ex_Date: "",
          Batch_No: "",
          Remarks: item.Remarks || "",
        }));
        
        setFormData((prev) => ({
          ...prev,
          invoice_items: invoiceItems,
        }));
        
        calculateTotals(invoiceItems, formData.Tax_Rate);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isOutside = !e.target.closest(".item-dropdown-container");
      if (isOutside) {
        setShowItemDropdown({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addNewItem = () => {
    const newItem = {
      Invoice_Item_ID: "",
      Item_Code: "",
      Item_Name: "",
      Quantity: 1,
      Unit_Price: 0,
      Total_Price: 0,
      SR_No: "",
      MF_Date: "",
      Ex_Date: "",
      Batch_No: "",
      Sales_Order_ID: formData.Sales_Order_ID || "",
    };

    setFormData((prev) => ({
      ...prev,
      invoice_items: [...prev.invoice_items, newItem],
    }));

    const initialFilteredItems = {};
    formData.invoice_items.forEach((_, idx) => {
      initialFilteredItems[idx] = items;
    });
    setFilteredItems(initialFilteredItems);
  };

  const removeItem = (index) => {
    const updatedItems = formData.invoice_items.filter((_, i) => i !== index);
    const updatedFilteredItems = { ...filteredItems };
    delete updatedFilteredItems[index];

    setFormData((prev) => ({ ...prev, invoice_items: updatedItems }));
    setFilteredItems(updatedFilteredItems);
    calculateTotals(updatedItems, formData.Tax_Rate);
  };

  // ===========================
  // 7️⃣ Submit Handler
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.invoice_items.length) {
      alert("Add at least one item.");
      return;
    }

    if (!formData.Customer_ID) {
      alert("Please select a customer.");
      return;
    }

    if (!formData.User_ID) {
      alert("Please select a user.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        Customer_ID: formData.Customer_ID,
        User_ID: formData.User_ID,
        Invoice_Date: formData.Invoice_Date,
        Payment_Terms: formData.Payment_Terms || "Net 30",
        Total_Amount: parseFloat(formData.Total_Amount) || 0,
        Tax_Amount: parseFloat(formData.Tax_Amount) || 0,
        Grand_Total: parseFloat(formData.Grand_Total) || 0,
        Notes: formData.Notes || "",
        Tax_Rate: parseFloat(formData.Tax_Rate) || 10,
        Sales_Order_ID: formData.Sales_Order_ID || "",
        status: formData.Status || "PENDING",
        items: formData.invoice_items.map((item) => ({
          Item_Code: item.Item_Code,
          Item_Name: item.Item_Name,
          Quantity: parseFloat(item.Quantity) || 0,
          Unit_Price: parseFloat(item.Unit_Price) || 0,
          Total_Price: parseFloat(item.Total_Price) || 0,
          SR_No: item.SR_No || "",
          MF_Date: item.MF_Date || null,
          Ex_Date: item.Ex_Date || null,
          Batch_No: item.Batch_No || "",
          Sales_Order_ID: item.Sales_Order_ID || "",
        })),
      };

      const url =
        mode === "edit"
          ? `/api/invoices/customer-invoices/${formData.Invoice_ID}`
          : "/api/invoices/customer-invoices";

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save invoice");
      }

      const result = await res.json();
      console.log(result)
      // Set success state and call onSave with the result
      setSaveSuccess(true);
      onSave(result);
      
      // Only close the modal if this is a new invoice (edit mode stays open)
      if (mode !== "edit") {
        onClose();
      }
    } catch (err) {
      console.error("Error saving invoice:", err);
      alert(`Error saving invoice: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ===========================
  // 8️⃣ Render
  // ===========================
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">
            {mode === "edit" ? "Edit Invoice" : "Add New Invoice"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Success message */}
          {saveSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              Invoice {mode === "edit" ? "updated" : "created"} successfully!
            </div>
          )}

          {/* Invoice No & Sales Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="Invoice_No"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Invoice No
              </label>
              <input
                type="text"
                id="Invoice_No"
                value={formData.Invoice_No}
                onChange={handleInputChange}
                readOnly
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sales Order ID
              </label>
              <input
                type="text"
                value={searchSalesOrderTerm || formData.Sales_Order_ID}
                onChange={(e) => {
                  const term = e.target.value;
                  setSearchSalesOrderTerm(term);
                  if (!term.trim()) {
                    setFilteredSalesOrders(salesOrders);
                  } else {
                    setFilteredSalesOrders(
                      salesOrders.filter(
                        (order) =>
                          order.Sales_Order_ID.toLowerCase().includes(term.toLowerCase()) ||
                          (order.Customer_Name && order.Customer_Name.toLowerCase().includes(term.toLowerCase()))
                      )
                    );
                  }
                  setShowSalesOrderDropdown(true);
                }}
                onFocus={() => setShowSalesOrderDropdown(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Search Sales Order ID..."
                autoComplete="off"
              />
              {showSalesOrderDropdown && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredSalesOrders.length > 0 ? (
                    filteredSalesOrders.map((order) => (
                      <div
                        key={order.Sales_Order_ID}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleSalesOrderSelect(order.Sales_Order_ID);
                          setShowSalesOrderDropdown(false);
                          setSearchSalesOrderTerm("");
                        }}
                      >
                        <div className="font-medium">
                          {order.Sales_Order_ID} - {order.Customer_Name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Date: {order.Order_Date} | Total: {order.Total_Amount}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500">
                      No sales orders found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Invoice Date */}
          <div>
            <label
              htmlFor="Invoice_Date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Invoice Date
            </label>
            <input
              type="date"
              id="Invoice_Date"
              value={formData.Invoice_Date}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Customer Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer ID
              </label>
              <input
                type="text"
                value={searchCustomerTerm || formData.Customer_ID}
                onChange={handleCustomerSearch}
                onFocus={() => setShowCustomerDropdown(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                autoComplete="off"
              />
              {showCustomerDropdown && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <div
                        key={customer.Customer_ID}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        <div className="font-medium">
                          {customer.Customer_ID} - {customer.Name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {customer.Address}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500">
                      No customers found
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={searchUserTerm || formData.User_ID}
                onChange={handleUserSearch}
                onFocus={() => setShowUserDropdown(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                autoComplete="off"
              />
              {showUserDropdown && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user.User_ID}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="font-medium">
                          {user.User_ID} - {user.Name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.Email}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500">
                      No users found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={formData.Customer_Name}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Phone
              </label>
              <input
                type="text"
                value={formData.Customer_Phone}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Address
            </label>
            <input
              type="text"
              value={formData.Customer_Address}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Payment Terms */}
          <div>
            <label
              htmlFor="Payment_Terms"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Payment Terms
            </label>
            <input
              id="Payment_Terms"
              type="text"
              value={formData.Payment_Terms}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g. Net 30"
            />
          </div>

          {/* Tax Rate */}
          <div>
            <label
              htmlFor="Tax_Rate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tax Rate (%)
            </label>
            <input
              type="number"
              id="Tax_Rate"
              value={formData.Tax_Rate}
              onChange={handleInputChange}
              min="0"
              max="100"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter tax rate"
            />
          </div>

          {/* Invoice Items Table */}
          <div>
            <h4 className="text-md font-semibold mb-2">Invoice Items</h4>
            <table className="w-full border border-gray-300 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1 text-left">Item Code</th>
                  <th className="border px-2 py-1 text-left">Item Name</th>
                  <th className="border px-2 py-1 text-right">Quantity</th>
                  <th className="border px-2 py-1 text-right">Unit Price</th>
                  <th className="border px-2 py-1 text-right">Total Price</th>
                  <th className="border px-2 py-1 text-left">Sales Order ID</th>
                  <th className="border px-2 py-1 text-left">SR No</th>
                  <th className="border px-2 py-1 text-left">MF Date</th>
                  <th className="border px-2 py-1 text-left">Ex Date</th>
                  <th className="border px-2 py-1 text-left">Batch No</th>
                  <th className="border px-2 py-1 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.invoice_items.length === 0 && (
                  <tr>
                    <td colSpan={11} className="text-center py-4 text-gray-500">
                      No items added.
                    </td>
                  </tr>
                )}
                {formData.invoice_items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">
                      <div className="relative item-dropdown-container">
                        <input
                          type="text"
                          value={item.Item_Code}
                          onChange={(e) => {
                            handleItemChange(idx, "Item_Code", e.target.value);
                            handleItemSearch(idx, e.target.value);
                          }}
                          onFocus={() => {
                            handleItemSearch(idx, item.Item_Code || "");
                            setShowItemDropdown((prev) => ({
                              ...prev,
                              [idx]: true,
                            }));
                          }}
                          className="w-full px-1 py-1 border rounded"
                          required
                          placeholder="Select item..."
                        />
                        {showItemDropdown[idx] && (
                          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {(filteredItems[idx] || []).length > 0 ? (
                              (filteredItems[idx] || []).map((it) => (
                                <div
                                  key={it.Item_Code}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleItemSelect(idx, it)}
                                >
                                  <div className="font-medium">
                                    {it.Item_Code} - {it.Item_Name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Price: {it.Unit_Price}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-gray-500">
                                No items found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="text"
                        value={item.Item_Name}
                        readOnly
                        className="w-full px-1 py-1 border rounded bg-gray-100 cursor-not-allowed"
                      />
                    </td>

                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={item.Quantity}
                        onChange={(e) =>
                          handleItemChange(idx, "Quantity", e.target.value)
                        }
                        className="w-full px-1 py-1 border rounded text-right"
                        min="1"
                        step="1"
                        required
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={item.Unit_Price}
                        onChange={(e) =>
                          handleItemChange(idx, "Unit_Price", e.target.value)
                        }
                        className="w-full px-1 py-1 border rounded text-right"
                        min="0"
                        step="0.01"
                        required
                      />
                    </td>
                    <td className="border px-2 py-1 text-right">
                      {parseFloat(item.Total_Price || 0).toFixed(2)}
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="text"
                        value={item.Sales_Order_ID || formData.Sales_Order_ID}
                        onChange={(e) =>
                          handleItemChange(idx, "Sales_Order_ID", e.target.value)
                        }
                        className="w-full px-1 py-1 border rounded"
                        placeholder="SO-"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="text"
                        value={item.SR_No}
                        onChange={(e) =>
                          handleItemChange(idx, "SR_No", e.target.value)
                        }
                        className="w-full px-1 py-1 border rounded"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="date"
                        value={item.MF_Date || ""}
                        onChange={(e) =>
                          handleItemChange(idx, "MF_Date", e.target.value)
                        }
                        className="w-full px-1 py-1 border rounded"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="date"
                        value={item.Ex_Date || ""}
                        onChange={(e) =>
                          handleItemChange(idx, "Ex_Date", e.target.value)
                        }
                        className="w-full px-1 py-1 border rounded"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="text"
                        value={item.Batch_No}
                        onChange={(e) =>
                          handleItemChange(idx, "Batch_No", e.target.value)
                        }
                        className="w-full px-1 py-1 border rounded"
                      />
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                        disabled={isLoading}
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={addNewItem}
              className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={isLoading}
            >
              + Add Item
            </button>
          </div>

          {/* Totals */}
          <div className="max-w-md mx-auto bg-gray-50 p-4 rounded-lg space-y-2 text-right">
            <div>
              <span className="font-medium mr-4">Total Amount:</span>
              <span>{parseFloat(formData.Total_Amount).toFixed(2)}</span>
            </div>
            <div>
              <span className="font-medium mr-4">Tax ({formData.Tax_Rate}%):</span>
              <span>{parseFloat(formData.Tax_Amount).toFixed(2)}</span>
            </div>
            <div className="text-lg font-bold border-t pt-2 mt-2">
              <span className="mr-4">Grand Total:</span>
              <span>{parseFloat(formData.Grand_Total).toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="Notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              id="Notes"
              value={formData.Notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="Status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="Status"
              value={formData.Status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isLoading}
            >
              {isLoading ? (
                "Processing..."
              ) : mode === "edit" ? (
                "Save Changes"
              ) : (
                "Add Invoice"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModal;