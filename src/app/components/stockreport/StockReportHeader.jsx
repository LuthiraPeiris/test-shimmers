import React from 'react';

const StockReportHeader = () => {
  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">Stock Level Report</h1>
        <p className="text-indigo-100 mt-1">
          Track and analyze your inventory levels
        </p>
      </div>
    </header>
  );
};

export default StockReportHeader;
