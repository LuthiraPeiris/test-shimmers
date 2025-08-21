import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const StockReportChart = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Stock Levels vs Sales</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="productName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="currentStock" fill="#4f46e5" name="Current Stock" />
          <Bar dataKey="avgWeeklySales" fill="#6366f1" name="Avg Weekly Sales" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockReportChart;
