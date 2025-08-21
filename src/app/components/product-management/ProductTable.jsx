import React from 'react';

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="table-container overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.itemCode} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.itemCode || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.itemName || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.brand || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.size || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      (product.stock || 0) > 20 ? 'bg-green-100 text-green-800' :
                      (product.stock || 0) > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {(product.stock || 0) > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">LKR {(product.price || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.country || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {product.createdDate ? new Date(product.createdDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        aria-label="Edit Product"
                        onClick={() => onEdit(product)}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 font-medium"
                        aria-label="Delete Product"
                        onClick={() => onDelete(product.itemCode)}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 font-medium" aria-label="View Product Details">
                          <i className="fas fa-eye"></i> View
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

export default ProductTable;
