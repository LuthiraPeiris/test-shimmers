-- Database optimization script for purchase_order table
-- This script adds indexes to improve query performance for the autofill endpoint

-- Add index on Po_Id for faster lookups
CREATE INDEX idx_purchase_order_po_id ON purchase_order(Po_Id);

-- Add composite index for common query patterns
CREATE INDEX idx_purchase_order_supplier ON purchase_order(Supplier_Id, Supplier_Name);

-- Add index for item-related queries
CREATE INDEX idx_purchase_order_item ON purchase_order(Item_Code, Item_Name);

-- Add index for date-based queries
CREATE INDEX idx_purchase_order_date ON purchase_order(Created_Date);

-- Analyze table to update statistics
ANALYZE TABLE purchase_order;

-- Check table health
CHECK TABLE purchase_order;

-- Optional: Add full-text search index for item names
-- ALTER TABLE purchase_order ADD FULLTEXT(Item_Name);
