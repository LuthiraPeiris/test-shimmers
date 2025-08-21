import React from 'react';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/salesPortalUtils';

const SalesOrderSection = ({ salesOrders, onAddOrder, onEditOrder, onDeleteOrder, onViewItems, onSalesOrderIdSearch }) => {
    // Ensure we handle case-insensitive status matching and all possible status values
    const confirmedOrders = salesOrders.filter(order => 
        String(order.Status || order.status || '').toUpperCase() === 'CONFIRMED'
    ).length;
    
    const pendingOrders = salesOrders.filter(order => 
        String(order.Status || order.status || '').toUpperCase() === 'PENDING'
    ).length;
    
    const totalRevenue = salesOrders.reduce((sum, order) => {
        const amount = parseFloat(order.Total_Amount || order.total_amount || order.calculated_total || 0);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    const activeCustomers = new Set(
        salesOrders.map(order => order.Customer_ID || order.customer_id).filter(Boolean)
    ).size;

    return (
        <div className="fade-in">
            <div className="mb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Sales Orders</h2>
                    <p className="mt-2 text-gray-600">List of all sales orders. Track status, customers, products, and more.</p>
                </div>
                <button onClick={onAddOrder} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    <span>New Sales Order</span>
                </button>
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Confirmed Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{confirmedOrders}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 card-hover">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Customers</p>
                            <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Sales Orders</h3>
                        {/* <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Search by Sales Order ID..."
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => {
                                    const searchValue = e.target.value;
                                    if (onSalesOrderIdSearch) {
                                        onSalesOrderIdSearch(searchValue);
                                    }
                                }}
                            />
                        </div> */}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {salesOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                        No sales orders found.
                                    </td>
                                </tr>
                            ) : (
                                salesOrders.map((order) => (
                                <tr key={order.Sales_Order_ID} className="table-row">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.Sales_Order_ID}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{order.Customer_Name}</div>
                                        <div className="text-sm text-gray-500">{order.Customer_ID}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(order.Order_Date)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.Status)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(order.Total_Amount || order.calculated_total || 0)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => onViewItems(order)} className="text-green-600 hover:text-green-900 mr-3">View Items</button>
                                            <button onClick={() => onEditOrder(order)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                            <button onClick={() => onDeleteOrder(order.Sales_Order_ID)} className="text-red-600 hover:text-red-900">Delete</button>
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

export default SalesOrderSection;
