// 'use client';

// import React, { useState, useEffect } from 'react';

// const TestDBConnection = () => {
//   const [connectionStatus, setConnectionStatus] = useState('Testing...');
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const testConnection = async () => {
//       try {
//         // Test database connection
//         const res = await fetch('/api/product-management?limit=5');
        
//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(`API Error: ${errorData.error || 'Unknown error'}`);
//         }
        
//         const data = await res.json();
//         setConnectionStatus('Connected successfully!');
//         setProducts(data.products || []);
//         setError(null);
//       } catch (err) {
//         console.error('Connection test failed:', err);
//         setConnectionStatus('Connection failed');
//         setError(err.message);
//       }
//     };

//     testConnection();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">Database Connection Test</h1>
        
//         <div className={`p-6 rounded-lg mb-6 ${error ? 'bg-red-100 border border-red-400' : 'bg-green-100 border border-green-400'}`}>
//           <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
//           <p className={`text-lg ${error ? 'text-red-700' : 'text-green-700'}`}>
//             {connectionStatus}
//           </p>
//           {error && (
//             <div className="mt-4">
//               <h3 className="font-medium text-red-700">Error Details:</h3>
//               <p className="text-red-600">{error}</p>
//             </div>
//           )}
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Sample Products</h2>
//           {products.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {products.map((product) => (
//                     <tr key={product.itemCode}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.itemCode}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.itemName}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.brand}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No products found or connection failed.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestDBConnection;
