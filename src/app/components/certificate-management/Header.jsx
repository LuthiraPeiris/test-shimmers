import React from 'react';

const Header = ({ title, onSearch }) => {
    return (
        <header className="bg-indigo-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search certificates..."
                            aria-label="Search certificates"
                            className="bg-indigo-500 text-white placeholder-indigo-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 border-0"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                        <button className="absolute right-3 top-2 text-indigo-200 hover:text-white transition-colors" aria-label="Search">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
