"use client";

import React, { useState, useEffect } from "react";
import "../globals.css";
import SalesPortalHeader from "../components/sales-portal/SalesPortalHeader";
import SalesPortalNav from "../components/sales-portal/SalesPortalNav";
import SalesOrderSection from "../components/sales-portal/SalesOrderSection";
import DeliverySection from "../components/sales-portal/DeliverySection";
import InvoiceSection from "../components/sales-portal/InvoiceSection";
import SalesOrderModal from "../components/sales-portal/SalesOrderModal";
import DeliveryModal from "../components/sales-portal/DeliveryModal";
import InvoiceModal from "../components/sales-portal/InvoiceModal";
import SalesOrderItemsModal from "../components/sales-portal/SalesOrderItemsModal";
import DeliveryItemsModal from "../components/sales-portal/DeliveryItemsModal";
import InvoiceItemsModal from "../components/sales-portal/InvoiceItemsModal";
import ItemModal from "../components/sales-portal/ItemModal";

const SalesPortalPage = () => {
  const [activeTab, setActiveTab] = useState("salesOrders");
  const [salesOrders, setSalesOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [salesOrderIdSearch, setSalesOrderIdSearch] = useState("");

  const [salesOrderItemsData, setSalesOrderItemsData] = useState({});
  const [deliveryItemsData, setDeliveryItemsData] = useState({});
  const [invoiceItemsData, setInvoiceItemsData] = useState({});

  const [isSalesOrderModalOpen, setIsSalesOrderModalOpen] = useState(false);
  const [currentSalesOrder, setCurrentSalesOrder] = useState(null);
  const [salesOrderModalMode, setSalesOrderModalMode] = useState("add");

  const [isSalesOrderItemsModalOpen, setIsSalesOrderItemsModalOpen] =
    useState(false);
  const [currentSalesOrderForItems, setCurrentSalesOrderForItems] =
    useState(null);

  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [deliveryModalMode, setDeliveryModalMode] = useState("add");

  const [isDeliveryItemsModalOpen, setIsDeliveryItemsModalOpen] = useState(false);
  const [currentDeliveryForItems, setCurrentDeliveryForItems] = useState(null);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [invoiceModalMode, setInvoiceModalMode] = useState("add");

  const [isInvoiceItemsModalOpen, setIsInvoiceItemsModalOpen] = useState(false);
  const [currentInvoiceForItems, setCurrentInvoiceForItems] = useState(null);

  // Fetch sales orders
  const fetchSalesOrders = async (search = "", salesOrderId = "") => {
    setLoading(true);
    try {
      let url = '/api/sales-order';
      const params = new URLSearchParams();
      
      if (search) {
        params.append('search', encodeURIComponent(search));
      }
      if (salesOrderId) {
        params.append('salesOrderId', encodeURIComponent(salesOrderId));
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      console.log("API response data", data); // Log the actual response data
      console.log("Response status:", res.status); // Log the response status
      
      // Handle the actual API response structure
      if (data.success && Array.isArray(data.salesOrders)) {
        setSalesOrders(data.salesOrders);
      } else if (Array.isArray(data.data)) {
        // Fallback for direct data array
        setSalesOrders(data.data);
      } else if (Array.isArray(data)) {
        // Fallback for direct array
        setSalesOrders(data);
      } else {
        setSalesOrders([]);
      }
    } catch (err) {
      console.error("Error fetching sales orders:", err);
      setSalesOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch deliveries
  const fetchDeliveries = async (search = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/deliveries${
          search ? `?search=${encodeURIComponent(search)}` : ""
        }`
      );
      const data = await res.json();
      setDeliveries(Array.isArray(data.deliveries) ? data.deliveries : []);
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch invoices
  const fetchInvoices = async (search = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/invoices/customer-invoices${
          search ? `?search=${encodeURIComponent(search)}` : ""
        }`
      );
      const data = await res.json();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customer-management");
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setCustomers([]);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/user-management");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  const fetchSalesOrderItems = async (salesOrderId) => {
    try {
      const res = await fetch(
        `/api/sales-order-items?Sales_Order_ID=${salesOrderId}`
      );
      const data = await res.json();
      setSalesOrderItemsData((prev) => ({ ...prev, [salesOrderId]: data }));

      // Find the sales order and open the modal
      const order = salesOrders.find((o) => o.Sales_Order_ID === salesOrderId);
      if (order) {
        setCurrentSalesOrderForItems(order);
        setIsSalesOrderItemsModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching sales order items:", err);
    }
  };

  const fetchDeliveryItems = async (deliveryId) => {
    try {
      const res = await fetch(
        `/api/deliveries/${deliveryId}`
      );
      const data = await res.json();
      console.log("Delivery Item Data",data);
      
      // Handle the response format - data is now the items array
      const items = Array.isArray(data) ? data : [];
      setDeliveryItemsData((prev) => ({ ...prev, [deliveryId]: items }));

      // Find the delivery and open the modal
      const delivery = deliveries.find((d) => d.Deliver_Id === deliveryId);
      if (delivery) {
        setCurrentDeliveryForItems(delivery);
        setIsDeliveryItemsModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching delivery items:", err);
      setDeliveryItemsData((prev) => ({ ...prev, [deliveryId]: [] }));
    }
  };

  const fetchInvoiceItems = async (invoiceId) => {
    try {
      const res = await fetch(
        `/api/invoices/customer-invoices/${invoiceId}`
      );
      const data = await res.json();
      
      // The API returns an object with invoice details and items
      // We need to separate the items from the invoice data
      const { invoice_items, ...invoiceDetails } = data;
      
      setInvoiceItemsData((prev) => ({ ...prev, [invoiceId]: invoice_items || [] }));

      // Use the invoice details from the API response
      setCurrentInvoiceForItems(invoiceDetails);
      setIsInvoiceItemsModalOpen(true);
    } catch (err) {
      console.error("Error fetching invoice items:", err);
      setInvoiceItemsData((prev) => ({ ...prev, [invoiceId]: [] }));
    }
  };

  const createSalesOrder = async (orderData) => {
    try {
      const res = await fetch("/api/sales-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const result = await res.json();
      if (res.ok) {
        fetchSalesOrders();
        return result;
      }
      throw new Error(
        result.error || result.details || "Failed to create sales order"
      );
    } catch (err) {
      console.error("Error creating sales order:", err);
      throw err;
    }
  };

  const updateSalesOrder = async (orderData) => {
    try {
      const res = await fetch(`/api/sales-order/${orderData.Sales_Order_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const result = await res.json();
      if (res.ok) {
        fetchSalesOrders();
        return result;
      }
      throw new Error(
        result.error || result.details || "Failed to update sales order"
      );
    } catch (err) {
      console.error("Error updating sales order:", err);
      throw err;
    }
  };

  const deleteSalesOrder = async (id) => {
    try {
      const res = await fetch(`/api/sales-order/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchSalesOrders();
      }
    } catch (err) {
      console.error("Error deleting sales order:", err);
    }
  };

  const createInvoice = async (formData) => {
    try {
      // Ensure Customer_ID is provided
      // if (!formData.Customer_ID) {
      //   throw new Error("Customer ID is required");
      // }

      const res = await fetch("/api/invoices/customer-invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Customer_ID: formData.Customer_ID,
          User_ID: formData.User_ID || 1,
          Invoice_Date:
            formData.Invoice_Date || new Date().toISOString().split("T")[0],
          Payment_Terms: formData.Payment_Terms || "Net 30",
          Total_Amount: parseFloat(formData.Total_Amount) || 0,
          Tax_Amount: parseFloat(formData.Tax_Amount) || 0,
          Grand_Total: parseFloat(formData.Grand_Total) || 0,
          Notes: formData.Notes || "",
          items: formData.invoice_items || [],
        }),
      });
      const result = await res.json();
      if (res.ok) {
        fetchInvoices();
        return result;
      }
      // throw new Error(
      //   result.error || result.details || "Failed to create invoice"
      // );
    } catch (err) {
      console.error("Error creating invoice:", err);
      throw err;
    }
  };

  const updateInvoice = async (formData) => {
    try {
      // if (!formData.Customer_ID) {
      //   throw new Error("Customer ID is required");
      // }

      const res = await fetch(
        `/api/invoices/customer-invoices/${formData.Invoice_ID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Customer_ID: formData.Customer_ID,
            User_ID: formData.User_ID,
            Invoice_Date: formData.Invoice_Date,
            Payment_Terms: formData.Payment_Terms,
            Total_Amount: formData.Total_Amount,
            Tax_Amount: formData.Tax_Amount,
            Grand_Total: formData.Grand_Total,
            Notes: formData.Notes,
            items: formData.invoice_items,
          }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        fetchInvoices();
        return result;
      }
      throw new Error(result.error || "Failed to update invoice");
    } catch (err) {
      console.error("Error updating invoice:", err);
      throw err;
    }
  };

  const deleteInvoice = async (id) => {
    try {
      const res = await fetch(`/api/invoices/customer-invoices/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchInvoices();
      }
    } catch (err) {
      console.error("Error deleting invoice:", err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const handleSalesOrderIdSearch = (salesOrderId) => {
    setSalesOrderIdSearch(salesOrderId);
  };

  useEffect(() => {
    if (activeTab === "salesOrders") {
      fetchSalesOrders(searchTerm, salesOrderIdSearch);
    } else if (activeTab === "deliveries") {
      fetchDeliveries(searchTerm);
    } else if (activeTab === "invoices") {
      fetchInvoices(searchTerm);
    }
  }, [activeTab, searchTerm, salesOrderIdSearch]);

  useEffect(() => {
    fetchCustomers();
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <SalesPortalHeader onSearch={handleSearch} />
      <SalesPortalNav activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center text-gray-500 py-10">
            <div className="loading-spinner mx-auto mb-4"></div>
            Loading data...
          </div>
        ) : (
          <>
            {activeTab === "salesOrders" && (
              <SalesOrderSection
                salesOrders={salesOrders}
                onAddOrder={() => {
                  setCurrentSalesOrder(null);
                  setSalesOrderModalMode("add");
                  setIsSalesOrderModalOpen(true);
                }}
                onEditOrder={(order) => {
                  setCurrentSalesOrder(order);
                  setSalesOrderModalMode("edit");
                  setIsSalesOrderModalOpen(true);
                }}
                onDeleteOrder={deleteSalesOrder}
                onViewItems={(order) =>
                  fetchSalesOrderItems(order.Sales_Order_ID)
                }
                onSalesOrderIdSearch={handleSalesOrderIdSearch}
              />
            )}
            {activeTab === "deliveries" && (
              <DeliverySection
                deliveries={deliveries}
                onAddDelivery={() => {
                  setCurrentDelivery(null);
                  setDeliveryModalMode("add");
                  setIsDeliveryModalOpen(true);
                }}
                onEditDelivery={(delivery) => {
                  setCurrentDelivery(delivery);
                  setDeliveryModalMode("edit");
                  setIsDeliveryModalOpen(true);
                }}
                onDeleteDelivery={(id) => console.log("Delete delivery", id)}
                onViewItems={(delivery) =>
                  fetchDeliveryItems(delivery.Deliver_Id)
                }
              />
            )}
            {activeTab === "invoices" && (
              <InvoiceSection
                invoices={invoices}
                onAddInvoice={() => {
                  setCurrentInvoice(null);
                  setInvoiceModalMode("add");
                  setIsInvoiceModalOpen(true);
                }}
                onEditInvoice={(invoice) => {
                  setCurrentInvoice(invoice);
                  setInvoiceModalMode("edit");
                  setIsInvoiceModalOpen(true);
                }}
                onDeleteInvoice={deleteInvoice}
                onViewItems={(invoice) =>
                  fetchInvoiceItems(invoice.Invoice_ID)
                }
                onViewInvoice={(invoice) => {
                  setCurrentInvoice(invoice);
                  setInvoiceModalMode("view");
                  setIsInvoiceModalOpen(true);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <SalesOrderModal
        isOpen={isSalesOrderModalOpen}
        onClose={() => setIsSalesOrderModalOpen(false)}
        onSave={
          salesOrderModalMode === "add" ? createSalesOrder : updateSalesOrder
        }
        orderData={currentSalesOrder}
        mode={salesOrderModalMode}
      />
      <DeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onSave={(data) => console.log("Save delivery", data)}
        deliveryData={currentDelivery}
        mode={deliveryModalMode}
      />
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={invoiceModalMode === "add" ? createInvoice : updateInvoice}
        invoiceData={currentInvoice}
        mode={invoiceModalMode}
        salesOrders={salesOrders}
        deliveries={deliveries}
        customers={customers}
        users={users}
      />

      {/* Items Modals */}
      <SalesOrderItemsModal
        isOpen={isSalesOrderItemsModalOpen}
        onClose={() => setIsSalesOrderItemsModalOpen(false)}
        salesOrder={currentSalesOrderForItems}
        items={salesOrderItemsData[currentSalesOrderForItems?.Sales_Order_ID] || []}
        onAddItem={() => console.log("Add sales order item")}
        onEditItem={() => console.log("Edit sales order item")}
        onDeleteItem={() => console.log("Delete sales order item")}
      />
      
      <DeliveryItemsModal
        isOpen={isDeliveryItemsModalOpen}
        onClose={() => setIsDeliveryItemsModalOpen(false)}
        delivery={currentDeliveryForItems}
        items={deliveryItemsData[currentDeliveryForItems?.Deliver_Id] || []}
        onAddItem={() => console.log("Add delivery item")}
        onEditItem={() => console.log("Edit delivery item")}
        onDeleteItem={() => console.log("Delete delivery item")}
      />
      
      <InvoiceItemsModal
        isOpen={isInvoiceItemsModalOpen}
        onClose={() => setIsInvoiceItemsModalOpen(false)}
        invoice={currentInvoiceForItems}
        items={invoiceItemsData[currentInvoiceForItems?.Invoice_ID] || []}
        onAddItem={() => console.log("Add invoice item")}
        onEditItem={() => console.log("Edit invoice item")}
        onDeleteItem={() => console.log("Delete invoice item")}
      />
    </div>
  );
};

export default SalesPortalPage;
