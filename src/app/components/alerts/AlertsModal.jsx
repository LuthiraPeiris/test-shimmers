import React, { useState, useEffect } from 'react';

const AlertsModal = ({ isOpen, onClose, alertData, mode, alertType, onSave }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (isOpen) setFormData(alertData || {});
    }, [isOpen, alertData]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Object.values(formData).some(val => val === '' || val === undefined)) {
            alert('Please fill in all fields.');
            return;
        }
        onSave(formData, alertType);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen) return null;

    const getModalTitle = () => {
        const typeName = alertType ? alertType.replace(/([A-Z])/g, ' $1').toLowerCase() : 'Alert';
        return mode === 'add' ? `Add ${typeName}` : `Edit ${typeName}`;
    };

    const renderFormFields = () => {
        switch (alertType) {
            case 'itemExpiry':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="itemCode">Item Code</label>
                            <input type="text" id="itemCode" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 bg-white" value={formData.itemCode || ''} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="itemName">Item Name</label>
                            <input type="text" id="itemName" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 bg-white" value={formData.itemName || ''} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">Quantity</label>
                            <input type="number" id="quantity" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 bg-white" value={formData.quantity || ''} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expiryDate">Expiry Date</label>
                            <input type="date" id="expiryDate" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 bg-white" value={formData.expiryDate || ''} onChange={handleChange} required />
                        </div>
                    </>
                );
            case 'lowStock':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="itemCode">Item Code</label>
                            <input type="text" id="itemCode" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 bg-white" value={formData.itemCode || ''} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="itemName">Item Name</label>
                            <input type="text" id="itemName" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 bg-white" value={formData.itemName || ''} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="currentQuantity">Current Quantity</label>
                            <input type="number" id="currentQuantity" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 bg-white" value={formData.currentQuantity || ''} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reorderLevel">Reorder Level</label>
                            <input type="number" id="reorderLevel" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 bg-white" value={formData.reorderLevel || ''} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notificationDate">Notification Date</label>
                            <input type="date" id="notificationDate" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 bg-white" value={formData.notificationDate || ''} onChange={handleChange} required />
                        </div>
                    </>
                );
            case 'certificationExpiry':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="registrationId">Registration ID</label>
                            <input type="text" id="registrationId" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 bg-white" value={formData.registrationId || ''} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="certificationName">Certification Name</label>
                            <input type="text" id="certificationName" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 bg-white" value={formData.certificationName || ''} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expiryDate">Expiry Date</label>
                            <input type="date" id="expiryDate" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 bg-white" value={formData.expiryDate || ''} onChange={handleChange} required />
                        </div>
                    </>
                );
            default:
                return <p>Select an alert type to add/edit.</p>;
        }
    };

    return (
        <div
            id="alertsModal"
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900" id="modalTitle">
                            {getModalTitle()}
                        </h2>
                        <button
                            id="closeModal"
                            className="text-gray-400 hover:text-gray-700 text-xl"
                            aria-label="Close Modal"
                            onClick={onClose}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {mode === 'edit' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="id">Notification ID</label>
                                    <input
                                        type="text"
                                        id="id"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                        value={formData.id || ''}
                                        readOnly
                                        disabled
                                    />
                                </div>
                            )}
                            {renderFormFields()}
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Save Alert
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AlertsModal;
