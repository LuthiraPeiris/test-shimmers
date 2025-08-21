'use client'
import React from "react";

const CustomerHeader = ({ onSearch }) => {
  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <div className="flex items-center space-x-4">
          <form role="search" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="customerSearch" className="sr-only">
              Search Customers
            </label>
            <input
              id="customerSearch"
              type="text"
              placeholder="Search by Customer ID, Name, Email, Phone, Address..."
              className="border border-gray-300 px-4 py-2 rounded-lg bg-gray-100 text-gray-800 outline-blue-400 focus:ring-2 focus:ring-blue-200"
              onChange={(e) => onSearch(e.target.value)}
            />
          </form>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;