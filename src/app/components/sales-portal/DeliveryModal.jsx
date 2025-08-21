// components/sales-portal/DeliveryModal.jsx
import React, { useState, useEffect } from 'react';

const DeliveryModal = ({ isOpen, onClose, onSave, deliveryData, mode, salesOrders }) => {
    const [formData, setFormData] = useState({
        ex_not_id: '',
        sales_order_id: '',
        item_code: '',
        item_name: '',
        quantity: 1,
        ex_not_date: '',
        status: 'PENDING', // Added status for deliveries
        invoice_created: false,
    });

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && deliveryData) {
                setFormData({
                    ...deliveryData,
                    ex_not_date: deliveryData.ex_not_date || new Date().toISOString().split('T')[0],
                });
            } else {
                setFormData({
                    ex_not_id: '',
                    sales_order_id: '',
                    item_code: '',
                    item_name: '',
                    quantity: 1,
                    ex_not_date: new Date().toISOString().split('T')[0],
                    status: 'PENDING',
                    invoice_created: false,
                });
            }
        }
    }, [isOpen, deliveryData, mode]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{mode === 'add' ? 'Add New Delivery' : 'Edit Delivery'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sales_order_id">Related Sales Order</label>
                        <select id="sales_order_id" value={formData.sales_order_id} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900">
                            <option value="">None</option>
                            {salesOrders.map(order => (
                                <option key={order.so_id} value={order.so_id}>{order.so_id} - {order.customer_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="item_code">Item Code</label>
                        <input type="text" id="item_code" value={formData.item_code} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="item_name">Item Name</label>
                        <input type="text" id="item_name" value={formData.item_name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="quantity">Quantity</label>
                        <input type="number" id="quantity" value={formData.quantity} onChange={handleChange} required min="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="ex_not_date">Delivery Date</label>
                        <input type="date" id="ex_not_date" value={formData.ex_not_date} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="status">Status</label>
                        <select id="status" value={formData.status} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900">
                            <option value="PENDING">Pending</option>
                            <option value="IN_TRANSIT">In Transit</option>
                            <option value="DELIVERED">Delivered</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{mode === 'add' ? 'Add Delivery' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeliveryModal;