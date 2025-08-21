'use client';

import React, { useState, useEffect } from 'react';
import '../../app/globals.css';
import toast, { Toaster } from 'react-hot-toast';
import QuotationHeader from '../components/quotation/QuotationHeader';
import QuotationToolbar from '../components/quotation/QuotationToolbar';
import QuotationTable from '../components/quotation/QuotationTable';
import QuotationModal from '../components/quotation/QuotationModal';

// Map API response fields to camelCase for UI
const mapQuotationData = (data) => {
  return data.map(q => ({
    quotationId: q.Quatation_Id,
    customerName: q.Customer_Name,
    dateCreated: q.Date_Created,
    validUntil: q.Valid_Until,
    status: q.Status,
    Item_Code: q.Item_Code,
    Item_Name: q.Item_Name,
    Quantity: q.Quantity,
    totalAmount: q.Total_Amount,
    discount: q.Discount,
    grandTotal: q.Grand_Total,
  }));
};

const QuotationPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuotation, setCurrentQuotation] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [itemOptions, setItemOptions] = useState([]);

  // Fetch quotations from API
  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quotations');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const mappedData = Array.isArray(data) ? mapQuotationData(data) : [];
      setQuotations(mappedData);
    } catch (err) {
      console.error('Error fetching quotations:', err);
      toast.error('Failed to load quotations');
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch item options for dropdown
  const fetchItemOptions = async () => {
    try {
      const res = await fetch('/api/item-master');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setItemOptions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching item options:', err);
      toast.error('Failed to load item options');
      setItemOptions([]);
    }
  };

  useEffect(() => {
    fetchQuotations();
    fetchItemOptions();
  }, []);

  const handleAddQuotation = () => {
    setCurrentQuotation(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditQuotation = (quotation) => {
    setCurrentQuotation(quotation);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteQuotation = async (quotationId) => {
    if (window.confirm(`Are you sure you want to delete quotation ${quotationId}?`)) {
      try {
        const res = await fetch(`/api/quotations?Quatation_Id=${quotationId}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Quotation deleted successfully');
          fetchQuotations();
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || 'Failed to delete quotation');
        }
      } catch (err) {
        console.error('Error deleting quotation:', err);
        toast.error('Failed to delete quotation');
      }
    }
  };

  const handleSaveQuotation = async (quotationData) => {
    try {
      const payload = {
        Customer_Name: quotationData.Customer_Name || quotationData.customerName,
        Date_Created: quotationData.Date_Created || quotationData.dateCreated,
        Valid_Until: quotationData.Valid_Until || quotationData.validUntil,
        Status: quotationData.Status || quotationData.status,
        Item_Code: quotationData.Item_Code,
        Item_Name: quotationData.Item_Name,
        Quantity: parseInt(quotationData.Quantity) || 1,
        Total_Amount: parseFloat(quotationData.Total_Amount) || 0,
        Discount: parseFloat(quotationData.Discount) || 0,
        Grand_Total: parseFloat(quotationData.Grand_Total) || 0,
      };

      let res;
      if (modalMode === 'add') {
        res = await fetch('/api/quotations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else if (modalMode === 'edit') {
        res = await fetch('/api/quotations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, Quatation_Id: quotationData.Quatation_Id || quotationData.quotationId }),
        });
      }

      if (res && res.ok) {
        setIsModalOpen(false);
        fetchQuotations();
        toast.success(modalMode === 'add' ? 'Quotation added successfully' : 'Quotation updated successfully');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to save quotation');
      }
    } catch (err) {
      console.error('Error saving quotation:', err);
      toast.error('Failed to save quotation');
    }
  };

  // Filter quotations
  const filteredQuotations = quotations.filter(q => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      q.quotationId?.toLowerCase().includes(searchLower) ||
      q.customerName?.toLowerCase().includes(searchLower);
    const matchesStatus = filterStatus === 'all' || q.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      <QuotationHeader />
      <main className="container mx-auto p-6">
        <QuotationToolbar
          onAddQuotation={handleAddQuotation}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <QuotationTable
            quotations={filteredQuotations}
            onEdit={handleEditQuotation}
            onDelete={handleDeleteQuotation}
          />
        )}
      </main>
      <QuotationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        quotation={currentQuotation}
        mode={modalMode}
        onSave={handleSaveQuotation}
        itemOptions={itemOptions}
      />
    </div>
  );
};

export default QuotationPage;
