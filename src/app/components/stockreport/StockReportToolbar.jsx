import React from 'react';

const StockReportToolbar = ({
  timeRange,
  onTimeRangeChange,
  categoryFilter,
  onCategoryFilter,
  onExport
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Time Range:</span>
          <select
            className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Category:</span>
          <select
            className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={categoryFilter}
            onChange={(e) => onCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="furniture">Furniture</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-3 py-1 rounded-md text-sm transition-colors flex items-center"
          onClick={onExport}
        >
          Export Report
        </button>
      </div>
    </div>
  );
};

export default StockReportToolbar;
