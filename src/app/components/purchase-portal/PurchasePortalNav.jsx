// components/purchase-portal/PurchasePortalNav.jsx
import React from 'react';

const PurchasePortalNav = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'purchaseOrders', label: 'Purchase Orders' },
        { id: 'goodsReceipts', label: 'Goods Receipts' },
        { id: 'supplierInvoices', label: 'Supplier Invoices' },
    ];

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`tab-button py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default PurchasePortalNav;
