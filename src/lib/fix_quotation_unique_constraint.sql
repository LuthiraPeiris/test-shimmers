-- Fix for the quotation unique constraint issue
-- This script removes the UNIQUE constraint from Item_Code in quatation_data table
-- This allows multiple quotations to have the same Item_Code

ALTER TABLE `quatation_data` DROP INDEX `Item_Code`;
ALTER TABLE `quatation_data` ADD INDEX `idx_item_code` (`Item_Code`);
