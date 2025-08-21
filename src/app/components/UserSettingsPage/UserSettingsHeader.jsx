import React from 'react';

const UserSettingsHeader = ({ onSearch, onFilter, onAdd }) => {
  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold">User Settings</h1>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search settings..."
              className="px-4 py-2 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => onSearch(e.target.value)}
            />
            
            {/* Filter Dropdown */}
            <select
              className="px-4 py-2 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => onFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="profile">Profile</option>
              <option value="notification">Notification</option>
              <option value="privacy">Privacy</option>
              <option value="security">Security</option>
            </select>
            
            {/* Add New Button */}
            <button
              onClick={onAdd}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md transition-colors"
            >
              Add New Setting
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserSettingsHeader;
