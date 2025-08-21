import React from 'react';

const GoodIssueToolbar = ({ onAddIssue }) => {
  return (
    <div className="flex flex-wrap items-center justify-between mb-6">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          aria-label="Add Issue"
          onClick={onAddIssue}
        >
          <i className="fas fa-plus mr-2"></i> Add Issue
        </button>
      </div>
    </div>
  );
};

export default GoodIssueToolbar;
