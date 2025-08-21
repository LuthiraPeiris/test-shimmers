import React, { useState, useEffect } from 'react';

const ItemModal = ({ isOpen, onClose, onSave, itemData, mode, parentEntityType }) => {
    const [formData, setFormData] = useState({
        Item_Code: '',
        Item_Name: '',
        Pack_Size: '',
        Quantity: 1,
        Unit_Price: 0,
        Total_Amount: 0,
        MF_Date: '',
        EX_Date: '',
        Batch_No: '',
        SR_No: '',
        Remarks: '',
        Status: 'PENDING' // For Delivery Items
    });

    const [itemOptions, setItemOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch item options when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchItemOptions();
        }
    }, [isOpen]);

    const fetchItemOptions = async () => {
        try {
            const response = await fetch('/api/item-master');
            const data = await response.json();
            setItemOptions(data);
        } catch (error) {
            console.error('Error fetching item options:', error);
        }
    };

    const fetchItemDetails = async (itemCode) => {
        if (!itemCode) return;
        
        setLoading(true);
        try {
            // Find item details from the already fetched options
            const selectedItem = itemOptions.find(item => item.Item_Code === itemCode);
            if (selectedItem) {
                setFormData(prev => ({
                    ...prev,
                    Item_Name: selectedItem.Item_Name || '',
                    Pack_Size: selectedItem.Pack_Size || '',
                    Unit_Price: selectedItem.Unit_Price || 0
                }));
            }
        } catch (error) {
            console.error('Error fetching item details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && itemData) {
                setFormData({
                    ...itemData,
                    MF_Date: itemData.MF_Date ? itemData.MF_Date.split('T')[0] : '',
                    EX_Date: itemData.EX_Date ? itemData.EX_Date.split('T')[0] : '',
                });
            } else {
                setFormData({
                    Item_Code: '',
                    Item_Name: '',
                    Pack_Size: '',
                    Quantity: 1,
                    Unit_Price: 0,
                    Total_Amount: 0,
                    MF_Date: '',
                    EX_Date: '',
                    Batch_No: '',
                    SR_No: '',
                    Remarks: '',
                    Status: 'PENDING'
                });
            }
        }
    }, [isOpen, itemData, mode]);

    useEffect(() => {
        const quantity = parseFloat(formData.Quantity) || 0;
        const unitPrice = parseFloat(formData.Unit_Price) || 0;
        setFormData(prev => ({
            ...prev,
            Total_Amount: (quantity * unitPrice).toFixed(2)
        }));
    }, [formData.Quantity, formData.Unit_Price]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        
        if (id === 'Item_Code') {
            setFormData(prev => ({ ...prev, [id]: value, Item_Name: '' }));
            fetchItemDetails(value);
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop z-60 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {mode === 'add' ? 'Add New Item' : 'Edit Item'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label" htmlFor="Item_Code">Item Code *</label>
                            <select 
                                id="Item_Code" 
                                name="Item_Code" 
                                value={formData.Item_Code} 
                                onChange={handleChange} 
                                required 
                                className="form-input"
                                disabled={loading}
                            >
                                <option value="">Select Item Code</option>
                                {itemOptions.map(item => (
                                    <option key={item.Item_Code} value={item.Item_Code}>
                                        {item.Item_Code} - {item.Item_Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="Item_Name">Item Name *</label>
                            <input 
                                type="text" 
                                id="Item_Name" 
                                name="Item_Name" 
                                value={formData.Item_Name} 
                                readOnly 
                                className="form-input bg-gray-100 cursor-not-allowed" 
                            />
                        </div>

                        {parentEntityType === 'salesOrder' && (
                            <>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="Pack_Size">Pack Size</label>
                                    <input type="text" id="Pack_Size" name="Pack_Size" value={formData.Pack_Size} onChange={handleChange} className="form-input" />
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="Quantity">Quantity *</label>
                            <input type="number" id="Quantity" name="Quantity" value={formData.Quantity} onChange={handleChange} required min="1" className="form-input" />
                        </div>

                        {(parentEntityType === 'salesOrder' || parentEntityType === 'invoice') && (
                            <>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="Unit_Price">Unit Price *</label>
                                    <input type="number" id="Unit_Price" name="Unit_Price" value={formData.Unit_Price} onChange={handleChange} required min="0" step="0.01" className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="Total_Amount">Total Amount</label>
                                    <input type="number" id="Total_Amount" name="Total_Amount" value={formData.Total_Amount} readOnly className="form-input bg-gray-100" />
                                </div>
                            </>
                        )}

                        {parentEntityType === 'salesOrder' && (
                            <>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="MF_Date">Manufacturing Date</label>
                                    <input type="date" id="MF_Date" name="MF_Date" value={formData.MF_Date} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="EX_Date">Expiry Date</label>
                                    <input type="date" id="EX_Date" name="EX_Date" value={formData.EX_Date} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="Batch_No">Batch Number</label>
                                    <input type="text" id="Batch_No" name="Batch_No" value={formData.Batch_No} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="SR_No">SR Number</label>
                                    <input type="text" id="SR_No" name="SR_No" value={formData.SR_No} onChange={handleChange} className="form-input" />
                                </div>
                            </>
                        )}

                        {parentEntityType === 'delivery' && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="Status">Delivery Status</label>
                                <select id="Status" name="Status" value={formData.Status} onChange={handleChange} className="form-input">
                                    <option value="PENDING">Pending</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {(parentEntityType === 'salesOrder' || parentEntityType === 'delivery') && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="Remarks">Remarks</label>
                            <textarea id="Remarks" name="Remarks" rows="3" value={formData.Remarks} onChange={handleChange} className="form-input"></textarea>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">{mode === 'add' ? 'Add Item' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemModal;
