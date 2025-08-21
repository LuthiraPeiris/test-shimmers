import { useState, useEffect } from "react";

const SalesOrderModal = ({ isOpen, onClose, orderData, mode, onSave }) => {
  const [formData, setFormData] = useState({
    Sales_Order_ID: "",
    Customer_ID: "",
    Customer_Name: "",
    Customer_Address: "",
    Customer_Phone: "",
    Order_Date: new Date().toISOString().split("T")[0],
    Delivery_Date: "",
    Payment_Terms: "Net 30",
    Status: "Pending",
    Remarks: "",
    Discount_Amount: 0,
    items: [],
    User_ID: "",
  });

  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);

  // Dropdown state and search terms
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredItems, setFilteredItems] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState({});
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchCustomerTerm, setSearchCustomerTerm] = useState("");
  const [searchItemTerm, setSearchItemTerm] = useState({});
  const [searchUserTerm, setSearchUserTerm] = useState("");

  // Financial calculations
  const [financials, setFinancials] = useState({
    subtotal: 0,
    tax: 0,
    netAmount: 0,
  });
  const [taxRate, setTaxRate] = useState(10); // Default 10% tax rate

  // Load customers, items and users on mount
  useEffect(() => {
    fetchCustomers();
    fetchItems();
    fetchUsers();
  }, []);

  // Load order data if editing/viewing, or reset for create
  useEffect(() => {
    if (orderData) {
      setFormData({
        ...orderData,
        Discount_Amount: orderData.Discount_Amount || 0,
        items: orderData.items || [],
      });
      calculateTotals(orderData.items || [], orderData.Discount_Amount || 0);
      
      // Set tax rate from order data if it exists
      if (orderData.Tax_Rate) {
        setTaxRate(orderData.Tax_Rate);
      }
      
      // Fetch order items when editing
      if (mode === 'edit' && orderData.Sales_Order_ID) {
        fetchOrderItems(orderData.Sales_Order_ID);
      } else {
        calculateTotals(orderData.items || [], orderData.Discount_Amount || 0);
      }
    } else {
      resetForm();
      if (mode === "add") {
        fetchNextOrderId();
      }
    }
  }, [orderData, mode]);

  // Recalculate totals when tax rate changes
  useEffect(() => {
    calculateTotals(formData.items, formData.Discount_Amount);
  }, [taxRate]);

  // Fetch order items for editing
  const fetchOrderItems = async (salesOrderId) => {
    try {
      const res = await fetch(`/api/sales-order-items?Sales_Order_ID=${salesOrderId}`);
      const data = await res.json();
      
      // Ensure data is an array with defensive checks
      let itemsArray = [];
      
      if (Array.isArray(data)) {
        itemsArray = data;
      } else if (data && typeof data === 'object') {
        if (data.items && Array.isArray(data.items)) {
          itemsArray = data.items;
        } else if (data.data && Array.isArray(data.data)) {
          itemsArray = data.data;
        } else {
          itemsArray = [data];
        }
      } else {
        itemsArray = [];
      }
      
      // Transform the data to match the expected format
      const items = itemsArray.map(item => ({
        Item_Code: item?.Item_Code || item?.item_code || '',
        Item_Name: item?.Item_Name || item?.item_name || '',
        Quantity: item?.Quantity || item?.quantity || 0,
        Unit_Price: item?.Unit_Price || item?.unit_price || 0,
        Total_Price: item?.Total_Price || item?.total_price || 0,
        Remarks: item?.Remarks || item?.remarks || ''
      })).filter(item => item.Item_Code); // Filter out invalid entries
      
      setFormData(prev => {
        const updatedFormData = {
          ...prev,
          items: items
        };
        calculateTotals(items, updatedFormData.Discount_Amount || 0);
        return updatedFormData;
      });
    } catch (error) {
      console.error('Error fetching order items:', error);
      setFormData(prev => {
        const updatedFormData = {
          ...prev,
          items: []
        };
        calculateTotals([], updatedFormData.Discount_Amount || 0);
        return updatedFormData;
      });
    }
  };

  // Fetch next auto-generated Sales_Order_ID for create mode
  const fetchNextOrderId = async () => {
    try {
      const res = await fetch("/api/sales-order/next-id");
      const data = await res.json();
      setFormData((prev) => ({ ...prev, Sales_Order_ID: data.nextId || "" }));
    } catch (error) {
      console.error("Error fetching next order ID:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customer-management");
      const data = await response.json();
      
      // Ensure data is an array with defensive checks
      let customersArray = [];
      
      if (Array.isArray(data)) {
        customersArray = data;
      } else if (data && typeof data === 'object') {
        if (data.customers && Array.isArray(data.customers)) {
          customersArray = data.customers;
        } else if (data.data && Array.isArray(data.data)) {
          customersArray = data.data;
        } else {
          customersArray = [data];
        }
      } else {
        customersArray = [];
      }
      
      setCustomers(customersArray);
      setFilteredCustomers(customersArray);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
      setFilteredCustomers([]);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/item-master");
      const data = await response.json();
      
      // Ensure data is an array with defensive checks
      let itemsArray = [];
      
      if (Array.isArray(data)) {
        itemsArray = data;
      } else if (data && typeof data === 'object') {
        if (data.items && Array.isArray(data.items)) {
          itemsArray = data.items;
        } else if (data.data && Array.isArray(data.data)) {
          itemsArray = data.data;
        } else {
          itemsArray = [data];
        }
      } else {
        itemsArray = [];
      }
      
      setItems(itemsArray);
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
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

  const resetForm = () => {
    setFormData({
      Sales_Order_ID: "",
      Customer_ID: "",
      Customer_Name: "",
      Customer_Address: "",
      Customer_Phone: "",
      Order_Date: new Date().toISOString().split("T")[0],
      Delivery_Date: "",
      Payment_Terms: "",
      Status: "Pending",
      Remarks: "",
      Discount_Amount: 0,
      items: [],
      User_ID: "",
    });
    setFinancials({
      subtotal: 0,
      tax: 0,
      netAmount: 0,
    });
    setSearchCustomerTerm("");
    setFilteredCustomers(customers);
    setTaxRate(10); // Reset to default tax rate
  };

  // Handle customer dropdown search input
  const handleCustomerSearch = (e) => {
    const term = e.target.value;
    setSearchCustomerTerm(term);
    if (term.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (cust) =>
          cust.Customer_ID.toLowerCase().includes(term.toLowerCase()) ||
          cust.Name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
    setShowCustomerDropdown(true);
  };

  // Handle user dropdown search input
  const handleUserSearch = (e) => {
    const term = e.target.value;
    setSearchUserTerm(term);
    
    // Ensure users is always treated as an array
    const usersArray = Array.isArray(users) ? users : [];
    
    if (term.trim() === "") {
      setFilteredUsers(usersArray);
    } else {
      const filtered = usersArray.filter(
        (user) =>
          user?.User_ID?.toLowerCase().includes(term.toLowerCase()) ||
          user?.Name?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setShowUserDropdown(true);
  };

  // When user selected, autofill user details
const handleUserSelect = (user) => {
  setFormData((prev) => ({
    ...prev,
    User_ID: user.User_ID || user.user_id, // Handle case sensitivity
  }));
  setShowUserDropdown(false);
  setSearchUserTerm(user.User_ID || user.user_id || ""); // Set the search term to the selected user ID
};

  // When customer selected, autofill customer details
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

  // Handle item dropdown search input for specific item index
  const handleItemSearch = (index, term) => {
    setSearchItemTerm((prev) => ({ ...prev, [index]: term }));
    if (term.trim() === "") {
      setFilteredItems((prev) => ({ ...prev, [index]: items }));
    } else {
      const filtered = items.filter(
        (item) =>
          item.Item_Code.toLowerCase().includes(term.toLowerCase()) ||
          item.Item_Name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredItems((prev) => ({ ...prev, [index]: filtered }));
    }
    setShowItemDropdown((prev) => ({ ...prev, [index]: true }));
  };

  // When item selected, autofill item details including price, quantity = 1, total price
  const handleItemSelect = (index, selectedItem) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      Item_Code: selectedItem.Item_Code,
      Item_Name: selectedItem.Item_Name,
      Unit_Price: selectedItem.Unit_Price || 0,
      Quantity: 1,
      Total_Price: (selectedItem.Unit_Price || 0).toFixed(2),
      Remarks: newItems[index]?.Remarks || "",
    };
    setFormData((prev) => ({ ...prev, items: newItems }));
    setShowItemDropdown((prev) => ({ ...prev, [index]: false }));
    setSearchItemTerm((prev) => ({ ...prev, [index]: "" }));
    calculateTotals(newItems, formData.Discount_Amount);
  };

  // Handle input changes in main form
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For Discount_Amount parse float for calculations
    if (name === "Discount_Amount") {
      const discountValue = parseFloat(value) || 0;
      setFormData((prev) => ({ ...prev, [name]: discountValue }));
      calculateTotals(formData.items, discountValue);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Update specific item field and recalc total and totals
  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    // Recalculate total price per item if quantity or unit price changed
    if (field === "Quantity" || field === "Unit_Price") {
      const qty = parseFloat(newItems[index].Quantity) || 0;
      const price = parseFloat(newItems[index].Unit_Price) || 0;
      newItems[index].Total_Price = (qty * price).toFixed(2);
    }

    setFormData((prev) => ({ ...prev, items: newItems }));
    calculateTotals(newItems, formData.Discount_Amount);
  };

  // Add new blank order item
  const addOrderItem = () => {
    const newItem = {
      Item_Code: "",
      Item_Name: "",
      Quantity: 1,
      Unit_Price: 0,
      Total_Price: 0,
      Remarks: "",
    };
    setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  // Remove item from order items
  const removeOrderItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData((prev) => ({ ...prev, items: newItems }));
    calculateTotals(newItems, formData.Discount_Amount);
  };

  // Calculate subtotal, tax and net amount
  const calculateTotals = (items, discount) => {
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.Total_Price || 0),
      0
    );
    const discountAmount = parseFloat(discount) || 0;
    const taxableAmount = Math.max(subtotal - discountAmount, 0);
    const taxRateDecimal = parseFloat(taxRate) / 100; // Convert percentage to decimal
    const tax = taxableAmount * taxRateDecimal;
    const netAmount = taxableAmount + tax;

    setFinancials({
      subtotal,
      tax,
      netAmount,
    });
  };

  // Handle tax rate change
  const handleTaxRateChange = (e) => {
    const newRate = parseFloat(e.target.value) || 0;
    setTaxRate(newRate);
    // No need to call calculateTotals here because useEffect will trigger it
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderPayload = {
        Sales_Order_ID: formData.Sales_Order_ID, // Include the ID for updates
        Customer_ID: formData.Customer_ID,
        Customer_Name: formData.Customer_Name,
        Customer_Address: formData.Customer_Address,
        Customer_Phone: formData.Customer_Phone,
        Order_Date: formData.Order_Date,
        Delivery_Date: formData.Delivery_Date || null,
        Payment_Terms: formData.Payment_Terms,
        Status: formData.Status,
        Remarks: formData.Remarks,
        Discount_Amount: formData.Discount_Amount,
        User_ID: formData.User_ID,
        items: formData.items,
        Tax_Rate: taxRate,
      };
      
      // Calculate financial fields
      const subtotal = formData.items.reduce(
        (sum, item) => sum + (parseFloat(item.Total_Price) || 0),
        0
      );
      const discount = parseFloat(formData.Discount_Amount) || 0;
      const taxableAmount = Math.max(subtotal - discount, 0);
      const taxRateDecimal = taxRate / 100;
      
      orderPayload.Total_Amount = subtotal;
      orderPayload.Tax_Amount = taxableAmount * taxRateDecimal;
      orderPayload.Net_Amount = taxableAmount + orderPayload.Tax_Amount;
      
      await onSave(orderPayload);
      onClose();
    } catch (error) {
      console.error('Failed to save sales order:', error);
      alert('Failed to save sales order. Please check the console for details.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-2xl font-bold">
            {mode === "create" ? "Create" : mode === "edit" ? "Edit" : "View"}{" "}
            Sales Order
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
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

        <form onSubmit={handleSubmit} className="p-6">
          {/* Order & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order ID - Auto generated and readonly */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                name="Sales_Order_ID"
                value={formData.Sales_Order_ID}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                required
              />
            </div>

            {/* Customer ID with search dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer ID
              </label>
              <input
                type="text"
                name="Customer_ID"
                value={formData.Customer_ID}
                onChange={(e) => {
                  handleInputChange(e);
                  handleCustomerSearch(e);
                }}
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

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                name="Customer_Name"
                value={formData.Customer_Name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Phone
              </label>
              <input
                type="text"
                name="Customer_Phone"
                value={formData.Customer_Phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Order Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Date
              </label>
              <input
                type="date"
                name="Order_Date"
                value={formData.Order_Date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Delivery Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Date
              </label>
              <input
                type="date"
                name="Delivery_Date"
                value={formData.Delivery_Date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="Status"
                value={formData.Status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms
              </label>
              <input
                type="text"
                name="Payment_Terms"
                value={formData.Payment_Terms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Customer Address */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Address
            </label>
            <textarea
              name="Customer_Address"
              value={formData.Customer_Address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* User ID with dropdown like CustomerID */}
          <div className="mt-6 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
           <input
  type="text"
  name="User_ID"
  value={formData.User_ID}
  onChange={(e) => {
    handleInputChange(e);
    handleUserSearch(e);
  }}
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
                      <div className="text-sm text-gray-600">{user.Email}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">No users found</div>
                )}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-4">Order Items</h4>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-center p-4 border rounded-lg"
                >
                  {/* Item Code with dropdown */}
                  <div className="col-span-3 relative">
                    <input
                      type="text"
                      placeholder="Item Code"
                      value={item.Item_Code}
                      onChange={(e) => {
                        updateItem(index, "Item_Code", e.target.value);
                        handleItemSearch(index, e.target.value);
                      }}
                      onFocus={() =>
                        setShowItemDropdown((prev) => ({
                          ...prev,
                          [index]: true,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      autoComplete="off"
                    />
                    {showItemDropdown[index] && (
                      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {(filteredItems[index] || items).length > 0 ? (
                          (filteredItems[index] || items).map((it) => (
                            <div
                              key={it.Item_Code}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleItemSelect(index, it)}
                            >
                              <div className="font-medium">{it.Item_Code}</div>
                              <div className="text-sm text-gray-600">
                                {it.Item_Name}
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

                  {/* Item Name */}
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={item.Item_Name}
                      onChange={(e) =>
                        updateItem(index, "Item_Name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Quantity"
                      value={item.Quantity}
                      onChange={(e) =>
                        updateItem(index, "Quantity", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Unit Price"
                      value={item.Unit_Price}
                      onChange={(e) =>
                        updateItem(index, "Unit_Price", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Total Price (readonly) */}
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Total Price"
                      value={item.Total_Price}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Remove button */}
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeOrderItem(index)}
                      className="text-red-500 hover:text-red-700 font-bold text-xl"
                      title="Remove item"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addOrderItem}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Add Item
              </button>
            </div>
          </div>

          {/* Discount Amount */}
          <div className="mt-6 max-w-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Amount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="Discount_Amount"
              value={formData.Discount_Amount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Tax Rate Input */}
          <div className="mt-6 max-w-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={taxRate}
              onChange={handleTaxRateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Calculated Totals */}
          <div className="mt-6 space-y-1 max-w-sm">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span>{financials.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tax ({taxRate}%):</span>
              <span>{financials.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Net Amount:</span>
              <span>{financials.netAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Remarks */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              name="Remarks"
              value={formData.Remarks}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {mode === 'edit' ? 'Save Changes' : 'Add Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesOrderModal;