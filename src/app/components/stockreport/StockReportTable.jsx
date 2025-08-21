import React from 'react';

const StockReportTable = ({ data }) => {
  const getStockStatusClass = (quantity) => {
    if (quantity > 50) return 'bg-green-100 text-green-800';
    if (quantity > 20) return 'bg-blue-100 text-blue-800';
    if (quantity > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="table-container overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Current Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Avg Weekly Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock Alert
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Last Ordered
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.productCode} className="hover:bg-gray-50">
                <td className="px-6 py-4">{item.productCode}</td>
                <td className="px-6 py-4">{item.productName}</td>
                <td className="px-6 py-4 capitalize">{item.category}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStockStatusClass(
                      item.currentStock
                    )}`}
                  >
                    {item.currentStock} units
                  </span>
                </td>
                <td className="px-6 py-4">{item.avgWeeklySales} units</td>
                <td className="px-6 py-4">
                  {item.stockAlert ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Low Stock
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      OK
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">{item.lastOrdered || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockReportTable;
