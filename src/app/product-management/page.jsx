'use client';

import React, { useState, useEffect } from 'react';
import '../../app/globals.css';
import ProductHeader from '../components/product-management/ProductHeader';
import ProductToolbar from '../components/product-management/ProductToolbar';
import ProductTable from '../components/product-management/ProductTable';
import ProductModal from '../components/product-management/ProductModal';
import toast, { Toaster } from 'react-hot-toast';

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products from API
  const fetchProducts = async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/product-management?search=${encodeURIComponent(search)}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorData.error || 'Unknown error'}`);
      }

      const data = await res.json();
      console.log('Fetched products:', data);

      const products = Array.isArray(data) ? data : data.products || [];
      setProducts(products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(`Failed to load products: ${err.message}`);
      setProducts([]);
      toast.error(`Failed to load products: ${err.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (itemCode) => {
    if (window.confirm(`Are you sure you want to delete product ${itemCode}?`)) {
      try {
        const res = await fetch(`/api/product-management/${itemCode}`, { method: 'DELETE' });

        if (res.ok) {
          const data = await res.json();
          toast.success(data.message || 'Product deleted successfully');
          fetchProducts(searchTerm);
        } else {
          const errorData = await res.json();
          toast.error(`Failed to delete product: ${errorData.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        toast.error(`Failed to delete product: ${err.message}`);
      }
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      let res;
      if (modalMode === 'add') {
        res = await fetch('/api/product-management', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } else if (modalMode === 'edit') {
        res = await fetch(`/api/product-management/${productData.itemCode}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }

      if (res && res.ok) {
        setIsModalOpen(false);
        fetchProducts(searchTerm);
        toast.success(modalMode === 'add' ? 'Product added successfully!' : 'Product updated successfully!');
      } else {
        const errorData = await res.json();
        toast.error(`Failed to save product: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error(`Failed to save product: ${err.message}`);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchProducts(term);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      <ProductHeader onSearch={handleSearch} />
      <main className="container mx-auto p-6">
        <ProductToolbar 
          onAddProduct={handleAddProduct} 
          products={products}
          statistics={{
            expiredItems: products.filter(p => p.expired).length || 0,
            expiringItems: products.filter(p => p.expiringSoon).length || 0
          }}
        />
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        )}
      </main>
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productData={currentProduct}
        mode={modalMode}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default ProductManagementPage;
