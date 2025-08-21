'use client';
import '../globals.css';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import CustomerHeader from '../../app/components/customer-management/CustomerHeader';
import CustomerToolbar from '../../app/components/customer-management/CustomerToolbar';
import CustomerTable from '../../app/components/customer-management/CustomerTable';
import CustomerModal from '../../app/components/customer-management/CustomerModal';

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch customers from API
  const fetchCustomers = async (search = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/customer-management?search=${encodeURIComponent(search)}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const responseData = await res.json();
      console.log('API response:', responseData);
      
      // Handle the response structure properly
      let customersData = [];
      
      if (responseData.customers && Array.isArray(responseData.customers)) {
        // Handle the correct response format from backend
        customersData = responseData.customers;
      } else if (Array.isArray(responseData)) {
        // Handle direct array response
        customersData = responseData;
      } else {
        customersData = [];
      }
      
      // Map the data to consistent format
      const mappedCustomers = customersData.map((c, index) => ({
        id: c.Customer_ID || c.customer_id || c.id || `temp-${index}`,
        name: c.Name || c.name || 'N/A',
        email: c.Email || c.email || 'N/A',
        phone: c.Phone || c.phone || 'N/A',
        address: c.Address || c.address || 'N/A',
        // Keep original data for reference
        originalId: c.Customer_ID || c.customer_id || c.id
      })).filter(c => c.name !== 'N/A'); // Only filter out if name is missing
      
      setCustomers(mappedCustomers);
      
    } catch (err) {
      console.error('Error fetching customers:', err);
      toast.error('Failed to load customers: ' + err.message);
      setCustomers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, []);

  const handleAddCustomer = () => {
    setCurrentCustomer(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setCurrentCustomer(customer);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    toast((t) => (
      <div>
        <p className="font-medium">Delete customer {customerId}?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const response = await fetch(`/api/customer-management/${customerId}`, { method: 'DELETE' });
              if (response.ok) {
                toast.success('Customer deleted successfully');
                fetchCustomers(searchTerm);
              } else {
                toast.error('Failed to delete customer');
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            No
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (modalMode === 'add') {
        const res = await fetch('/api/customer-management', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData)
        });
        if (res.ok) {
          toast.success('Customer added successfully');
        } else {
          throw new Error();
        }
      } else if (modalMode === 'edit') {
        const res = await fetch(`/api/customer-management/${customerData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: customerData.Name,
            email: customerData.Email,
            phone: customerData.Phone,
            address: customerData.Address
          })
        });
        if (res.ok) {
          toast.success('Customer updated successfully');
        } else {
          throw new Error();
        }
      }
    } catch {
      toast.error('Failed to save customer');
    }
    setIsModalOpen(false);
    fetchCustomers(searchTerm);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchCustomers(term);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      <CustomerHeader onSearch={handleSearch} />
      <main className="container mx-auto p-6">
        <CustomerToolbar onAddCustomer={handleAddCustomer} />
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : (
          <CustomerTable
            customers={customers}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        )}
      </main>
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customerData={currentCustomer}
        mode={modalMode}
        onSave={handleSaveCustomer}
      />
    </div>
  );
};

export default CustomerManagementPage;
