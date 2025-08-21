import React from 'react';

const SupplierHeader = ({ onSearch }) => {
  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Supplier Management System</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search suppliers..."
              aria-label="Search suppliers"
              className="bg-white text-gray-900 placeholder-gray-500 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-gray-300"
              onChange={(e) => onSearch(e.target.value)}
            />
            <button className="absolute right-3 top-2 text-gray-500 hover:text-gray-700" aria-label="Search">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SupplierHeader;
