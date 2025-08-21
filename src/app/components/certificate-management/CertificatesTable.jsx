import React from 'react';

const CertificatesTable = ({ certificates, onEdit, onDelete, onView }) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="table-container overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {certificates.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 bg-white">No certificates found.</td>
                            </tr>
                        ) : (
                            certificates.map((cert) => (
                                <tr key={cert.regId} className="hover:bg-gray-50 bg-white transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{cert.regId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{cert.certificateName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{cert.itemCode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{cert.itemName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{cert.expiryDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                                                aria-label="Edit Certificate"
                                                onClick={() => onEdit(cert)}
                                            >
                                                <i className="fas fa-edit mr-1"></i> Edit
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800 transition-colors font-medium"
                                                aria-label="Delete Certificate"
                                                onClick={() => onDelete(cert.regId)}
                                            >
                                                <i className="fas fa-trash mr-1"></i> Delete
                                            </button>
                                            <button
                                                className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
                                                aria-label="View Certificate"
                                                onClick={() => onView(cert)}
                                            >
                                                <i className="fas fa-eye mr-1"></i> View
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CertificatesTable;
