import React from 'react';

const Toolbar = ({ onAddCertificate, currentPage, totalPages, totalCertificates, onPreviousPage, onNextPage }) => {
    const startRange = (currentPage - 1) * 20 + 1;
    const endRange = Math.min(currentPage * 20, totalCertificates);

    return (
        <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                    aria-label="Add Certificate"
                    onClick={onAddCertificate}
                >
                    <i className="fas fa-plus mr-2"></i> Add Certificate
                </button>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{`${startRange}-${endRange} of ${totalCertificates} certificates`}</span>
                <button
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300"
                    aria-label="Previous Page"
                    onClick={onPreviousPage}
                    disabled={currentPage === 1}
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                <button
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300"
                    aria-label="Next Page"
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
