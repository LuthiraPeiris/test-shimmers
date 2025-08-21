import React from 'react';

const AlertsTable = ({ type, alerts, onEdit, onDelete }) => {
    const getHeaders = () => {
        switch (type) {
            case 'itemExpiry':
                return ['Notification ID', 'Item Code', 'Item Name', 'Quantity', 'Expiry Date', 'Actions'];
            case 'lowStock':
                return ['Notification ID', 'Item Code', 'Item Name', 'Current Quantity', 'Reorder Level', 'Notification Date', 'Actions'];
            case 'certificationExpiry':
                return ['Notification ID', 'Registration ID', 'Certification Name', 'Expiry Date', 'Actions'];
            default:
                return [];
        }
    };

    const renderRow = (alert) => {
        switch (type) {
            case 'itemExpiry':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">{alert.id || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">{alert.itemCode || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">{alert.itemName || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">{alert.quantity || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-red-600">{alert.expiryDate || 'N/A'}</td>
                    </>
                );
            case 'lowStock':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">{alert.id || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">{alert.itemCode || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">{alert.itemName || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-yellow-600">{alert.currentQuantity || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">{alert.reorderLevel || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">{alert.notificationDate || 'N/A'}</td>
                    </>
                );
            case 'certificationExpiry':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">{alert.id || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">{alert.registrationId || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">{alert.certificationName || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-600">{alert.expiryDate || 'N/A'}</td>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="card rounded-lg shadow-md border border-gray-200 overflow-hidden bg-white">
            <div className="table-container overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {getHeaders().map((header, index) => (
                                <th key={index} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {alerts.length === 0 ? (
                            <tr>
                                <td colSpan={getHeaders().length} className="px-6 py-4 whitespace-nowrap text-center text-gray-400">
                                    No {type.replace(/([A-Z])/g, ' $1').toLowerCase()} alerts found.
                                </td>
                            </tr>
                        ) : (
                            alerts.map((alert) => (
                                <tr key={alert.id} className="hover:bg-gray-50" data-id={alert.id}>
                                    {renderRow(alert)}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            {/* Uncomment to enable editing */}
                                            {/* <button
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                aria-label="Edit Alert"
                                                onClick={() => onEdit(alert, type)}
                                            >
                                                <i className="fas fa-edit"></i> Edit
                                            </button> */}
                                            <button
                                                className="text-red-600 hover:text-red-800 font-medium"
                                                aria-label="Delete Notification"
                                                onClick={() => onDelete(alert.id)}
                                            >
                                                <i className="fas fa-trash"></i> Delete
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

export default AlertsTable;
