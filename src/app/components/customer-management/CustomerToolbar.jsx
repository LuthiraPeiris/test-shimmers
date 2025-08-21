import React from 'react';

const CustomerToolbar = ({ onAddCustomer }) => (
  <div className="mb-4 flex justify-end">
    <button
      className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 transition"
      onClick={onAddCustomer}
    >
      + Add Customer
    </button>
  </div>
);

export default CustomerToolbar;
