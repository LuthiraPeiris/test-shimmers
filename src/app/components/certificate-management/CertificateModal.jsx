import React, { useState, useEffect } from "react";

const CertificateModal = ({
  isOpen,
  onClose,
  certificateData,
  mode,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    regId: "",
    certificateName: "",
    itemCode: "",
    itemName: "",
    expiryDate: "",
    pdfImport: null,
  });
  
  const [itemOptions, setItemOptions] = useState([]);

  useEffect(() => {
    if (isOpen && certificateData) {
      setFormData({
        regId: certificateData.regId || "",
        certificateName: certificateData.certificateName || "",
        itemCode: certificateData.itemCode || "",
        itemName: certificateData.itemName || "",
        expiryDate: certificateData.expiryDate || "",
        pdfImport: null,
      });
    } else if (isOpen && !certificateData && mode === "add") {
      setFormData({
        regId: "",
        certificateName: "",
        itemCode: "",
        itemName: "",
        expiryDate: "",
        pdfImport: null,
      });
    }
  }, [isOpen, certificateData, mode]);

  // Fetch item options when modal opens
  useEffect(() => {
    const fetchItems = async () => {
      if (isOpen) {
        try {
          const res = await fetch("/api/item-master");
          const data = await res.json();
          setItemOptions(data);
        } catch (err) {
          console.error("Error fetching item list:", err);
        }
      }
    };

    fetchItems();
  }, [isOpen]);

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    if (id === "itemCode") {
      const selectedItem = itemOptions.find((item) => item.Item_Code === value);
      setFormData((prev) => ({
        ...prev,
        itemCode: value,
        itemName: selectedItem ? selectedItem.Item_Name : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: type === "file" ? files[0] : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.regId ||
      !formData.certificateName ||
      !formData.itemCode ||
      !formData.itemName ||
      !formData.expiryDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Call the onSave function passed from parent
    onSave(formData);
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isReadOnly = mode === "view";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === "add"
                ? "Add Certificate"
                : mode === "edit"
                ? "Edit Certificate"
                : "Certificate Details"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close Modal"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="regId"
                  >
                    Reg ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="regId"
                    className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                      isReadOnly || mode === "edit"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={formData.regId}
                    onChange={handleChange}
                    readOnly={isReadOnly || mode === "edit"}
                    required
                    placeholder="Enter registration ID"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="certificateName"
                  >
                    Certificate Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="certificateName"
                    className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                      isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={formData.certificateName}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                    placeholder="Enter certificate name"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="itemCode"
                  >
                    Item Code <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="itemCode"
                    value={formData.itemCode}
                    onChange={handleChange}
                    required
                    disabled={isReadOnly}
                    className={`w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                      isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  >
                    <option className="text-black" value="">
                      -- Select Item Code --
                    </option>
                    {itemOptions.map((item) => (
                      <option key={item.Item_Code} value={item.Item_Code} className="text-black">
                        {item.Item_Code} - {item.Item_Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="itemName"
                  >
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                      isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={formData.itemName}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="expiryDate"
                  >
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                      isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={formData.expiryDate}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="pdfImport"
                  >
                    Import PDF{" "}
                    {mode === "add" && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="file"
                    id="pdfImport"
                    accept="application/pdf"
                    className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                      isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  />
                  {mode === "view" && certificateData?.pdfUrl && (
                    <a
                      href={certificateData.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mt-2 block"
                    >
                      View PDF
                    </a>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  onClick={onClose}
                >
                  Cancel
                </button>
                {!isReadOnly && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {mode === "add" ? "Add Certificate" : "Save Changes"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
