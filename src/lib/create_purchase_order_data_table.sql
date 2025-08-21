-- Create the missing purchase_order_data table
CREATE TABLE IF NOT EXISTS purchase_order_data (
    Po_Id VARCHAR(50) NOT NULL,
    Supplier_Id VARCHAR(50),
    Supplier_Name VARCHAR(255),
    Item_Code VARCHAR(50),
    Item_Name VARCHAR(255),
    Pack_Size VARCHAR(50),
    Price DECIMAL(10,2),
    Quantity INT,
    DisValue DECIMAL(10,2),
    TotValue DECIMAL(10,2),
    Created_Date DATE,
    Status VARCHAR(50) DEFAULT 'Pending'
);

-- Insert sample data for P0001
INSERT INTO purchase_order_data (Po_Id, Supplier_Id, Supplier_Name, Item_Code, Item_Name, Pack_Size, Price, Quantity, DisValue, TotValue, Created_Date, Status) VALUES
('P0001', 'SUP001', 'ABC Suppliers', 'ITM001', 'Premium Widget', 'Box of 10', 25.50, 50, 0, 1275.00, '2024-01-15', 'Pending'),
('P0001', 'SUP001', 'ABC Suppliers', 'ITM002', 'Standard Widget', 'Box of 20', 15.75, 30, 0, 472.50, '2024-01-15', 'Pending');
