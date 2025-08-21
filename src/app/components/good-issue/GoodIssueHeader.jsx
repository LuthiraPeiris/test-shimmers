import React, { useState } from 'react';

const GoodIssueHeader = ({ searchTerm, onSearchChange }) => {
  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Good Issue Management System</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg bg-indigo-500 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-64"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-indigo-200"
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default GoodIssueHeader;
