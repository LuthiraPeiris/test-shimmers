import React from 'react';
import { formatCurrency, formatDate } from '../../utils/salesPortalUtils';

const InvoiceItemsModal = ({ isOpen, onClose, invoice, items, onAddItem, onEditItem, onDeleteItem }) => {
    if (!isOpen || !invoice) return null;

    // Ensure items is always an array
    const safeItems = Array.isArray(items) ? items : [];
    const totalAmount = safeItems.reduce((sum, item) => sum + (item.Total_Price || item.Total_Amount || 0), 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Invoice Details</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Invoice ID: {invoice.Invoice_No} - Customer ID: {invoice.Customer_ID}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {/* <button onClick={onAddItem} className="btn-primary flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            <span>Add Item</span>
                        </button> */}
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Invoice Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-gray-600">Invoice ID:</span>
                                <span className="ml-2 text-sm text-gray-900">{invoice.Invoice_No}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Customer ID:</span>
                                <span className="ml-2 text-sm text-gray-900">{invoice.Customer_ID}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Date:</span>
                                <span className="ml-2 text-sm text-gray-900">{formatDate(invoice.Invoice_Date)}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Status:</span>
                                <span className="ml-2 text-sm text-gray-900">{invoice.status || 'PENDING'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {safeItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                            No items found for this invoice.
                                            <br />
                                            {/* <button onClick={onAddItem} className="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                                                Add the first item
                                            </button> */}
                                        </td>
                                    </tr>
                                ) : (
                                    safeItems.map((item) => (
                                        <tr key={item.Item_Code || Math.random()} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.Item_Code || item.item_code || ''}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.Item_Name || item.item_name || ''}</div>
                                        {item.Remarks && <div className="text-xs text-gray-500">{item.Remarks}</div>}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.Quantity || item.quantity || 0}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatCurrency(item.Unit_Price || item.unit_price || 0)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatCurrency(item.Total_Price || item.total_price || item.Total_Amount || 0)}
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

export default InvoiceItemsModal;
