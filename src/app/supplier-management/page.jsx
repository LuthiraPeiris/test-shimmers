"use client";

import React, { useState, useEffect } from "react";
import "../../app/globals.css";
import SupplierHeader from "../components/supplier-management/SupplierHeader";
import SupplierToolbar from "../components/supplier-management/SupplierToolbar";
import SupplierTable from "../components/supplier-management/SupplierTable";
import SupplierModal from "../components/supplier-management/SupplierModal";

const SupplierManagementPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  // Fetch suppliers from API with pagination and search
  const fetchSuppliers = async (search = "", status = "", page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(status && { status }),
      });

      const res = await fetch(`/api/supplier-management?${params}`);
      const data = await res.json();
      console.log("API response data", data);

      if (data.success) {
        // Fix: Use data.suppliers instead of data.data to match API response
        setSuppliers(data.suppliers || []);
        
        // Fix: Calculate totalPages based on total and limit
        const total = data.total || 0;
        const limit = pagination.limit || 20;
        const totalPages = Math.ceil(total / limit) || 1;
        
        setPagination({
          page: data.page || 1,
          limit: limit,
          total: total,
          totalPages: totalPages,
        });
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setSuppliers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers(searchTerm, statusFilter, pagination.page);
  }, [pagination.page, pagination.limit, searchTerm, statusFilter]);

  const handleAddSupplier = () => {
    setCurrentSupplier(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEditSupplier = (supplier) => {
    setCurrentSupplier(supplier);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (!supplierId) {
      console.error("No supplier ID provided for deletion");
      return;
    }

    // Get supplier details for better confirmation message
    const supplier = suppliers.find(s => s.Supplier_Id === supplierId);
    const supplierName = supplier ? supplier.Supplier_Name : supplierId;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete supplier "${supplierName}" (ID: ${supplierId})?`
    );
    if (!confirmDelete) return;

    try {
      console.log(`Attempting to delete supplier ${supplierId}...`);
      
      // Fix: Use the correct DELETE endpoint format
      const res = await fetch(`/api/supplier-management/${supplierId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`Delete response status: ${res.status}`);

      let responseData;
      try {
        responseData = await res.json();
        console.log("Delete response data:", responseData);
      } catch (parseError) {
        console.error("Failed to parse response JSON:", parseError);
        throw new Error(`Server returned ${res.status} but response was not valid JSON`);
      }

      if (res.ok && responseData.success) {
        console.log("Supplier deleted successfully");
        // Refresh the current page of suppliers
        await fetchSuppliers(searchTerm, statusFilter, pagination.page);
        
        // If this was the last item on the page, go to previous page
        if (suppliers.length === 1 && pagination.page > 1) {
          setPagination(prev => ({ ...prev, page: prev.page - 1 }));
        }
      } else {
        // Handle specific error cases
        let errorMessage = responseData.error || "Failed to delete supplier";
        
        // Handle foreign key constraint errors
        if (errorMessage.includes("purchase order") || errorMessage.includes("supplier invoice")) {
          errorMessage = `Cannot delete supplier: ${errorMessage}`;
        } else if (errorMessage.includes("not found")) {
          errorMessage = "Supplier not found. It may have already been deleted.";
        }
        
        console.error("Delete failed:", errorMessage);
        alert(`Error: ${errorMessage}`);
      }
    } catch (err) {
      console.error("Network or other error during deletion:", err);
      alert(`Error deleting supplier: ${err.message || "Network error. Please check your connection and try again."}`);
    }
  };


const handleSaveSupplier = async (supplierData) => {
    console.log("Saving supplier data:", supplierData); // Debugging log
    try {
      const url =
        modalMode === "add"
          ? "/api/supplier-management"
          : `/api/supplier-management/${supplierData.Supplier_Id}`;

      const method = modalMode === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierData),
      });

      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        fetchSuppliers(searchTerm, statusFilter, pagination.page);
      }
    } catch (err) {
      console.error("Error saving supplier:", err);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchSuppliers(term, statusFilter, 1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchSuppliers(searchTerm, status, 1);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchSuppliers(searchTerm, statusFilter, newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SupplierHeader
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        statusFilter={statusFilter}
      />
      <main className="container mx-auto p-6">
        <SupplierToolbar onAddSupplier={handleAddSupplier} />
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <SupplierTable
              suppliers={suppliers}
              onEdit={handleEditSupplier}
              onDelete={handleDeleteSupplier}
            />
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplierData={currentSupplier}
        mode={modalMode}
        onSave={handleSaveSupplier}
      />
    </div>
  );
};

export default SupplierManagementPage;
