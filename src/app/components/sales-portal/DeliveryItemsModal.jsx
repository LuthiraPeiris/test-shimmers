import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '../../utils/salesPortalUtils';

const DeliveryItemsModal = ({ isOpen, onClose, delivery, items, onAddItem, onEditItem, onDeleteItem }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [displayItems, setDisplayItems] = useState([]);

    useEffect(() => {
        if (isOpen && delivery) {
            setDisplayItems(Array.isArray(items) ? items : []);
            setError(null);
        }
    }, [isOpen, delivery, items]);

    if (!isOpen) return null;

    const safeItems = Array.isArray(displayItems) ? displayItems : [];
    
    const totalAmount = safeItems.reduce((sum, item) => {
        try {
            const itemTotal = parseFloat(item?.Total_Amount || (item?.Quantity * item?.Unit_Price) || 0);
            return sum + (isNaN(itemTotal) ? 0 : itemTotal);
        } catch (error) {
            console.error('Error calculating item total:', error, item);
            return sum;
        }
    }, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Delivery Details</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Delivery ID: {delivery.Deliver_Id} - Sales Order: {delivery.Sales_Order_ID}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Delivery Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-gray-600">Delivery ID:</span>
                                <span className="ml-2 text-sm text-gray-900">{delivery.Deliver_Id}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Sales Order ID:</span>
                                <span className="ml-2 text-sm text-gray-900">{delivery.Sales_Order_ID}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Date:</span>
                                <span className="ml-2 text-sm text-gray-900">{formatDate(delivery.Date)}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Status:</span>
                                <span className="ml-2 text-sm text-gray-900">{delivery.Status || 'PENDING'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pack Size</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Info</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center">
                                            <div className="flex justify-center items-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                <span className="ml-2">Loading items...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : safeItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                            <div className="space-y-2">
                                                <p>No items found for this delivery.</p>
                                                <p className="text-sm text-gray-400">
                                                    Delivery ID: {delivery?.Deliver_Id}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    safeItems.map((item, index) => (
                                        <tr key={item?.Item_ID || index} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item?.Item_Code || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{item?.Item_Name || 'N/A'}</div>
                                                {item?.Remarks && <div className="text-xs text-gray-500">{item.Remarks}</div>}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item?.Pack_Size || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item?.Quantity || 0}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(item?.Unit_Price || 0)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(item?.Total_Amount || (item?.Quantity * item?.Unit_Price) || 0)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="space-y-1">
                                                    {item?.Batch_No && <div>Batch: {item.Batch_No}</div>}
                                                    {item?.SR_No && <div>SR: {item.SR_No}</div>}
                                                    {item?.MF_Date && <div>MF: {formatDate(item.MF_Date)}</div>}
                                                    {item?.EX_Date && <div>EX: {formatDate(item.EX_Date)}</div>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {safeItems.length > 0 && (
                        <div className="mt-6 bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Total Items: {safeItems.length}</span>
                                <span className="text-lg font-bold text-gray-900">
                                    Total Amount: {formatCurrency(totalAmount)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryItemsModal;