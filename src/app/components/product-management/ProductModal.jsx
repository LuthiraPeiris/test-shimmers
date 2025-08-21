import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductModal = ({ isOpen, onClose, productData, mode, onSave }) => {
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    brand: "",
    size: "Small",
    stock: "",
    price: "",
    country: "USA",
    createdDate: "",
  });

  useEffect(() => {
    if (isOpen && productData) {
      setFormData({
        itemCode: productData.itemCode || "",
        itemName: productData.itemName || "",
        brand: productData.brand || "",
        size: productData.size || "Small",
        stock: productData.stock || "",
        price: productData.price || "",
        country: productData.country || "USA",
        createdDate: productData.createdDate || "",
      });
    } else if (isOpen && !productData && mode === "add") {
      setFormData({
        itemCode: "",
        itemName: "",
        brand: "",
        size: "Small",
        stock: "",
        price: "",
        country: "USA",
        createdDate: "",
      });
    }
  }, [isOpen, productData, mode]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.itemCode ||
      !formData.itemName ||
      !formData.brand ||
      !formData.size ||
      !formData.stock ||
      !formData.price ||
      !formData.country ||
      !formData.createdDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave(formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/20"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 drop-shadow-sm">
                {mode === "add" ? "Add New Product" : "Edit Product"}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-800 transition"
                onClick={onClose}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: "itemCode", label: "Item Code", type: "text" },
                  { id: "itemName", label: "Item Name", type: "text" },
                  { id: "brand", label: "Brand", type: "text" },
                  { id: "size", label: "Size", type: "text" },
                  { id: "stock", label: "Available Stock", type: "number" },
                  { id: "price", label: "Price", type: "number", step: "0.01" },
                  { id: "country", label: "Country", type: "text" },
                  { id: "createdDate", label: "Created Date", type: "date" },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      step={field.step}
                      id={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      className={`w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm ${
                        mode === "edit" && field.id === "itemCode"
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                      required
                      readOnly={mode === "edit" && field.id === "itemCode"}
                    />
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end gap-3 border-t border-gray-200/50 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-500/30 transition"
                >
                  {mode === "add" ? "Add Product" : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
