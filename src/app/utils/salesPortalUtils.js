import React from 'react';

export function generateId(prefix) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return prefix + timestamp + random;
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR'
    }).format(amount);
}


export function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function getStatusBadge(status) {
    const statusClasses = {
        'CONFIRMED': 'bg-green-100 text-green-800',
        'PENDING': 'bg-yellow-100 text-yellow-800',
        'SHIPPED': 'bg-blue-100 text-blue-800',
        'DELIVERED': 'bg-purple-100 text-purple-800',
        'IN_TRANSIT': 'bg-blue-100 text-blue-800',
        'PAID': 'bg-green-100 text-green-800',
        'OVERDUE': 'bg-red-100 text-red-800',
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full status-badge ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
}
