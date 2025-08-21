// components/purchase-portal/PurchaseOrderModal.jsx
import React, { useState, useEffect } from 'react';

const PurchaseOrderModal = ({ isOpen, onClose, onSave, orderData, mode }) => {
    const [formData, setFormData] = useState({
        Po_Id: '',
        Created_Date: '',
        Location: '',
        Supplier_Id: '',
        Supplier_Name: '',
        Item_Code: '',
        Item_Name: '',
        Price: 0,
        Quantity: 1,
        DisValue: 0,
        TotValue: 0,
        Status: 'Pending',
        gr_created: false,
        si_created: false,
    });

    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [showItemDropdown, setShowItemDropdown] = useState(false);
    const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
    const [supplierSearchTerm, setSupplierSearchTerm] = useState('');

    // Fetch items and suppliers
    useEffect(() => {
        if (isOpen) {
            fetchItems();
            fetchSuppliers();
        }
    }, [isOpen]);

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/item-master');
            const data = await res.json();
            setItems(data || []);
            setFilteredItems(data || []);
        } catch (err) {
            console.error('Error fetching items:', err);
            setItems([]);
            setFilteredItems([]);
        }
    };

   const fetchSuppliers = async () => {
  try {
    const res = await fetch('/api/supplier-management');
    const data = await res.json();
    console.log("Raw supplier response:", data);

    // Normalize response into array
    let suppliersArray = [];
    if (Array.isArray(data)) {
      suppliersArray = data; // API directly returned an array
    } else if (Array.isArray(data.data)) {
      suppliersArray = data.data; // API returned { data: [...] }
    } else if (Array.isArray(data.suppliers)) {
      suppliersArray = data.suppliers; // API returned { suppliers: [...] }
    } else {
      suppliersArray = []; // fallback
    }

    console.log("Normalized suppliers:", suppliersArray);
    setSuppliers(suppliersArray);
    setFilteredSuppliers(suppliersArray);
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    setSuppliers([]);
    setFilteredSuppliers([]);
  }
};


    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && orderData) {
                setFormData({
                    ...orderData,
                    Created_Date: orderData.Created_Date || new Date().toISOString().split('T')[0],
                    Price: orderData.Price || 0,
                    Quantity: orderData.Quantity || 1,
                    DisValue: orderData.DisValue || 0,
                });
                setSupplierSearchTerm(orderData.Supplier_Name || '');
            } else {
                setFormData({
                    Po_Id: '',
                    Created_Date: new Date().toISOString().split('T')[0],
                    Location: '',
                    Supplier_Id: '',
                    Supplier_Name: '',
                    Item_Code: '',
                    Item_Name: '',
                    Price: 0,
                    Quantity: 1,
                    DisValue: 0,
                    TotValue: 0,
                    Status: 'Pending',
                    gr_created: false,
                    si_created: false,
                });
                setSupplierSearchTerm('');
            }
        }
    }, [isOpen, orderData, mode]);

    // Auto-calculate total value
    useEffect(() => {
        const price = parseFloat(formData.Price) || 0;
        const quantity = parseInt(formData.Quantity) || 0;
        const disValue = parseFloat(formData.DisValue) || 0;
        const total = (price * quantity) - disValue;
        setFormData(prev => ({ ...prev, TotValue: Math.max(0, total) }));
    }, [formData.Price, formData.Quantity, formData.DisValue]);

    // Filter suppliers based on search term
    useEffect(() => {
        if (supplierSearchTerm) {
            const filtered = suppliers.filter(supplier => 
                (supplier.Supplier_Name && supplier.Supplier_Name.toLowerCase().includes(supplierSearchTerm.toLowerCase())) ||
                (supplier.Supplier_Id && supplier.Supplier_Id.toLowerCase().includes(supplierSearchTerm.toLowerCase()))
            );
            setFilteredSuppliers(filtered);
        } else {
            setFilteredSuppliers(suppliers);
        }
    }, [supplierSearchTerm, suppliers]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleItemSelect = (item) => {
        setFormData(prev => ({
            ...prev,
            Item_Code: item.Item_Code,
            Item_Name: item.Item_Name,
        }));
        setShowItemDropdown(false);
    };

    const handleSupplierSelect = (supplier) => {
        setFormData(prev => ({
            ...prev,
            Supplier_Id: supplier.Supplier_Id,
            Supplier_Name: supplier.Supplier_Name,
        }));
        setSupplierSearchTerm(supplier.Supplier_Name);
        setShowSupplierDropdown(false);
    };

    const handleItemCodeChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, Item_Code: value }));
        
        if (value) {
            const filtered = items.filter(item => 
                item.Item_Code.toLowerCase().includes(value.toLowerCase()) ||
                item.Item_Name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredItems(filtered);
            setShowItemDropdown(true);
        } else {
            setFilteredItems(items);
            setShowItemDropdown(false);
        }
    };

    const handleSupplierSearch = (e) => {
        const value = e.target.value;
        setSupplierSearchTerm(value);
        setShowSupplierDropdown(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.Item_Code || !formData.Item_Name) {
            alert('Please select an item');
            return;
        }
        if (!formData.Supplier_Id || !formData.Supplier_Name) {
            alert('Please select a supplier');
            return;
        }
        if (!formData.Price || formData.Price <= 0) {
            alert('Please enter a valid price');
            return;
        }
        if (!formData.Quantity || formData.Quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }
        
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {mode === 'add' ? 'Add New Purchase Order' : 'Edit Purchase Order'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Created_Date">Date</label>
                            <input 
                                type="date" 
                                id="Created_Date" 
                                value={formData.Created_Date} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Location">Location</label>
                            <input 
                                type="text" 
                                id="Location" 
                                value={formData.Location} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Supplier_Name">Supplier</label>
                        <input 
                            type="text" 
                            id="Supplier_Name" 
                            value={supplierSearchTerm}
                            onChange={handleSupplierSearch}
                            onFocus={() => setShowSupplierDropdown(true)}
                            placeholder="Search supplier by name or ID..."
                            required 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        />
                        {showSupplierDropdown && filteredSuppliers.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredSuppliers.map(supplier => (
                                    <div 
                                        key={supplier.Supplier_Id}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSupplierSelect(supplier)}
                                    >
                                        <div className="font-medium">{supplier.Supplier_Name}</div>
                                        <div className="text-sm text-gray-500">ID: {supplier.Supplier_Id}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Item_Code">Item Code</label>
                        <input 
                            type="text" 
                            id="Item_Code" 
                            value={formData.Item_Code} 
                            onChange={handleItemCodeChange}
                            onFocus={() => setShowItemDropdown(true)}
                            placeholder="Search item by code or name..."
                            required 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        />
                        {showItemDropdown && filteredItems.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredItems.map(item => (
                                    <div 
                                        key={item.Item_Code}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleItemSelect(item)}
                                    >
                                        <div className="font-medium">{item.Item_Code}</div>
                                        <div className="text-sm text-gray-500">{item.Item_Name}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Item_Name">Item Name</label>
                        <input 
                            type="text" 
                            id="Item_Name" 
                            value={formData.Item_Name} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Price">Price</label>
                            <input 
                                type="number" 
                                id="Price" 
                                value={formData.Price} 
                                onChange={handleChange} 
                                required 
                                min="0" 
                                step="0.01" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Quantity">Quantity</label>
                            <input 
                                type="number" 
                                id="Quantity" 
                                value={formData.Quantity} 
                                onChange={handleChange} 
                                required 
                                min="1" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="DisValue">Discount Value</label>
                            <input 
                                type="number" 
                                id="DisValue" 
                                value={formData.DisValue} 
                                onChange={handleChange} 
                                min="0" 
                                step="0.01" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="TotValue">Total Value</label>
                            <input 
                                type="number" 
                                id="TotValue" 
                                value={formData.TotValue} 
                                readOnly 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="Status">Status</label>
                        <select 
                            id="Status" 
                            value={formData.Status} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                        >
                            {mode === 'add' ? 'Add Purchase Order' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PurchaseOrderModal;