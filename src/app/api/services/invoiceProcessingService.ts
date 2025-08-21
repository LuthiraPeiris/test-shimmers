import { getDBConnection } from "../../../../lib/dbAdapter"; 

export interface InvoiceProcessingResult {
  success: boolean;
  message: string;
  deliveryUpdates: number;
  productUpdates: number;
  errors?: string[];
}

export interface SalesOrderItem {
  Sales_Order_ID: string;
  Item_Code: string;
  Item_Name: string;
  Quantity: number;
}

export class InvoiceProcessingService {
  /**
   * Process automatic updates when a customer invoice is created
   * @param salesOrderId The Sales_Order_ID from the invoice
   * @param invoiceNo The Invoice_No that was created
   * @returns Promise<InvoiceProcessingResult>
   */
  async processInvoiceCreation(salesOrderId: string, invoiceNo: string): Promise<InvoiceProcessingResult> {
    const connection = await getDBConnection();
    
    try {
      // Start transaction
      await connection.execute('START TRANSACTION');
      
      const result: InvoiceProcessingResult = {
        success: true,
        message: "Invoice processing completed successfully",
        deliveryUpdates: 0,
        productUpdates: 0,
        errors: []
      };

      // 1. Get sales order items
      const salesOrderItems = await this.getSalesOrderItems(connection, salesOrderId);
      
      if (salesOrderItems.length === 0) {
        await connection.execute('ROLLBACK');
        throw new Error(`No items found for sales order: ${salesOrderId}`);
      }

      // 2. Update delivery table for each item
      const deliveryUpdates = await this.updateDeliveryTable(connection, salesOrderId, salesOrderItems, invoiceNo);
      result.deliveryUpdates = deliveryUpdates;

      // 3. Decrease product quantities
      const productUpdates = await this.decreaseProductQuantities(connection, salesOrderItems);
      result.productUpdates = productUpdates;

      // Commit transaction
      await connection.execute('COMMIT');
      
      return result;

    } catch (error) {
      // Rollback on any error
      try {
        await connection.execute('ROLLBACK');
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError);
      }
      
      console.error("Error processing invoice:", error);
      return {
        success: false,
        message: `Failed to process invoice: ${error instanceof Error ? error.message : String(error)}`,
        deliveryUpdates: 0,
        productUpdates: 0,
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  /**
   * Get sales order items for a given sales order
   */
  private async getSalesOrderItems(connection: any, salesOrderId: string): Promise<SalesOrderItem[]> {
    const [rows] = await connection.query(
      `SELECT Sales_Order_ID, Item_Code, Item_Name, Quantity 
       FROM sales_order_items 
       WHERE Sales_Order_ID = ?`,
      [salesOrderId]
    );
    
    return rows as SalesOrderItem[];
  }

  /**
   * Update delivery table based on sales order items
   */
  private async updateDeliveryTable(
    connection: any, 
    salesOrderId: string, 
    items: SalesOrderItem[],
    invoiceNo: string
  ): Promise<number> {
    let updatedCount = 0;

    for (const item of items) {
      // Check if delivery already exists for this item
      const [existingDelivery] = await connection.query(
        `SELECT Deliver_Id FROM deliver_data 
         WHERE Sales_Order_ID = ? AND Item_Code = ?`,
        [salesOrderId, item.Item_Code]
      );

      if (existingDelivery.length === 0) {
        // Generate new delivery ID
        const [maxIdResult] = await connection.query(
          "SELECT MAX(CAST(SUBSTRING(Deliver_Id, 4) AS UNSIGNED)) as max_id FROM deliver_data WHERE Deliver_Id LIKE 'DEL%'"
        );
        
        let newDeliveryId = "DEL001";
        if (maxIdResult[0].max_id) {
          newDeliveryId = `DEL${(maxIdResult[0].max_id + 1).toString().padStart(3, '0')}`;
        }

        // Insert new delivery record
        await connection.execute(
          `INSERT INTO deliver_data (Deliver_Id, Sales_Order_ID, Item_Code, Item_Name, Date, Status, Invoice_No) 
           VALUES (?, ?, ?, ?, NOW(), 'Pending', ?)`,
          [newDeliveryId, salesOrderId, item.Item_Code, item.Item_Name, invoiceNo]
        );
        
        updatedCount++;
      } else {
        // Update existing delivery record
        await connection.execute(
          `UPDATE deliver_data 
           SET Status = 'Updated', Invoice_No = ? 
           WHERE Sales_Order_ID = ? AND Item_Code = ?`,
          [invoiceNo, salesOrderId, item.Item_Code]
        );
        updatedCount++;
      }
    }

    return updatedCount;
  }

  /**
   * Decrease product quantities in item_master_data
   */
  private async decreaseProductQuantities(connection: any, items: SalesOrderItem[]): Promise<number> {
    let updatedCount = 0;

    for (const item of items) {
      // Check current stock
      const [productRows] = await connection.query(
        "SELECT Available_Stock FROM item_master_data WHERE Item_Code = ?",
        [item.Item_Code]
      );

      if (productRows.length === 0) {
        throw new Error(`Product not found: ${item.Item_Code}`);
      }

      const currentStock = productRows[0].Available_Stock;
      
      if (currentStock < item.Quantity) {
        throw new Error(`Insufficient stock for item ${item.Item_Code}. Available: ${currentStock}, Required: ${item.Quantity}`);
      }

      // Decrease stock
      await connection.execute(
        "UPDATE item_master_data SET Available_Stock = Available_Stock - ? WHERE Item_Code = ?",
        [item.Quantity, item.Item_Code]
      );

      updatedCount++;
    }

    return updatedCount;
  }
}
