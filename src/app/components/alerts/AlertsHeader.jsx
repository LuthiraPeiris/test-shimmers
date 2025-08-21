import React from 'react';

const AlertsHeader = ({ onSearch }) => {
    return (
        <header className="bg-red-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Alerts Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search alerts..."
                            aria-label="Search alerts"
                            className="bg-red-500 text-white placeholder-red-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                        <button className="absolute right-3 top-2 text-red-200 hover:text-white" aria-label="Search">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AlertsHeader;
