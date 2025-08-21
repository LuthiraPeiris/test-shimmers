import React, { useState } from 'react';

const QuotationHeader = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quotation Management System</h1>
        
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search quotations..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-4 py-2 rounded-lg text-gray-800 bg-blue-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:text-indigo-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default QuotationHeader;
