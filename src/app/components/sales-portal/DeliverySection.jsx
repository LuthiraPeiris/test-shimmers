import React from 'react';
import { formatDate } from '../../utils/salesPortalUtils';

const DeliverySection = ({ deliveries, onAddDelivery, onEditDelivery, onDeleteDelivery, onViewItems }) => {
    const deliveredCount = deliveries.filter(d => d.Status === 'DELIVERED').length;
    const inTransitCount = deliveries.filter(d => d.Status === 'IN_TRANSIT').length;
    const pendingCount = deliveries.filter(d => d.Status === 'PENDING').length;

    return (
        <div className="fade-in">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Deliveries</h2>
                        <p className="mt-2 text-gray-600">Manage delivery notifications and track item shipments.</p>
                    </div>
                    <button onClick={onAddDelivery} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        <span>New Delivery</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Delivered</p>
                            <p className="text-2xl font-bold text-gray-900">{deliveredCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">In Transit</p>
                            <p className="text-2xl font-bold text-gray-900">{inTransitCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Deliveries</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery ID</th>
                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {deliveries.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                        No deliveries found.
                                    </td>
                                </tr>
                            ) : (
                                deliveries.map((delivery) => (
                                    <tr key={delivery.Deliver_Id} className="table-row">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.Deliver_Id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.Sales_Order_ID}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{delivery.Item_Code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{delivery.Item_Name}</div>
                                            {delivery.So_Id && <div className="text-xs text-gray-400">SO: {delivery.So_Id}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{delivery.Quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(delivery.Date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => onViewItems(delivery)} className="text-green-600 hover:text-green-900 mr-3">View Items</button>
                                            {/* <button onClick={() => onEditDelivery(delivery)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                            <button onClick={() => onDeleteDelivery(delivery.Deliver_Id)} className="text-red-600 hover:text-red-900">Delete</button> */}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DeliverySection;