import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ProductToolbar = ({ onAddProduct, products = [], statistics = { expiredItems: 0, expiringItems: 0 } }) => {
  
  const handleExportCSV = () => {
    const headers = ["Item Code", "Item Name", "Brand", "Size", "Stock", "Price", "Country"];
    const csvData = products.map(item => [
      item.Item_Code || "",
      item.Item_Name || "",
      item.Brand || "",
      item.Size || "",
      item.Available_Stock || 0,
      (item.Price || 0).toFixed(2),
      item.Country || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `product_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Product Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    const tableData = products.map(item => [
      item.Item_Code || "",
      item.Item_Name || "",
      item.Brand || "",
      item.Size || "",
      item.Available_Stock || 0,
      `$${(item.Price || 0).toFixed(2)}`,
      item.Country || "",
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Item Code", "Item Name", "Brand", "Size", "Stock", "Price", "Country"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 },
    });

    const totalStock = products.reduce((acc, item) => acc + (item.Available_Stock || 0), 0);
    const totalValue = products.reduce((acc, item) => acc + ((item.Available_Stock || 0) * (item.Price || 0)), 0);

    let y = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Items: ${products.length}`, 14, y);
    doc.text(`Total Stock: ${totalStock}`, 14, (y += 6));
    doc.text(`Expired Items: ${statistics.expiredItems}`, 14, (y += 6));
    doc.text(`Expiring Soon: ${statistics.expiringItems}`, 14, (y += 6));
    doc.text(`Total Inventory Value: $${totalValue.toLocaleString()}`, 14, (y += 6));

    doc.save(`product_report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between mb-6">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          onClick={onAddProduct}
        >
          <i className="fas fa-plus mr-2"></i> Add Product
        </button>

        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          onClick={handleExportCSV}
        >
          <i className="fas fa-download mr-2"></i> Export CSV
        </button>

        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          onClick={handleExportPDF}
        >
          <i className="fas fa-file-pdf mr-2"></i> Download PDF
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">1-20 of {products.length} products</span>
        <button className="p-2 rounded-lg hover:bg-gray-200" aria-label="Previous Page">
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-200" aria-label="Next Page">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ProductToolbar;