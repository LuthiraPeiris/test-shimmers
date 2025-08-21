import { getDBConnection } from "../../../../lib/dbAdapter"; 

interface DeliveryRecord {
  deliver_id?: string;
  Sales_Order_ID?: string;
  item_code: string;
  item_name: string;
  quantity: number;
  date: string;
  status: string;
}

export class DeliveryService {
  /**
   * Create delivery record and update product stock
   */
  async createDelivery(delivery: DeliveryRecord): Promise<{ deliverId: string }> {
    const connection = await getDBConnection();
    
    try {
      // Start transaction
      await connection.execute('START TRANSACTION');
      
      // 1. Check product availability
      const [productRows] = await connection.query(
        'SELECT Available_Stock FROM item_master_data WHERE Item_Code = ?',
        [delivery.item_code]
      );
      
      if (productRows.length === 0) {
        await connection.execute('ROLLBACK');
        throw new Error(`Product ${delivery.item_code} not found`);
      }
      
      const currentStock = productRows[0].Available_Stock;
      
      if (currentStock < delivery.quantity) {
        await connection.execute('ROLLBACK');
        throw new Error(`Insufficient stock for ${delivery.item_code}. Available: ${currentStock}, Requested: ${delivery.quantity}`);
      }
      
      // 2. Generate new Deliver_Id using sequence
      const [sequenceResult] = await connection.query(
        'SELECT next_id FROM sequences WHERE name = ?',
        ['deliver_id']
      );
      
      if (sequenceResult.length === 0) {
        await connection.execute('ROLLBACK');
        throw new Error('Sequence for deliver_id not found');
      }
      
      const nextId = sequenceResult[0].next_id;
      const newDeliverId = "D" + String(nextId).padStart(4, "0");
      
      // Update sequence
      await connection.execute(
        'UPDATE sequences SET next_id = next_id + 1 WHERE name = ?',
        ['deliver_id']
      );
      
      // 3. Create delivery record
      await connection.execute(
        `INSERT INTO deliver_data 
         (Deliver_Id, Sales_Order_ID, Item_Code, Item_Name, Quantity, Date, Status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          newDeliverId,
          delivery.Sales_Order_ID || 'SO0000',
          delivery.item_code,
          delivery.item_name,
          delivery.quantity,
          delivery.date,
          delivery.status
        ]
      );
      
      // 4. Update product quantity
      await connection.execute(
        'UPDATE item_master_data SET Available_Stock = Available_Stock - ? WHERE Item_Code = ?',
        [delivery.quantity, delivery.item_code]
      );
      
      // 5. Log the transaction
      await connection.execute(
        `INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, created_at) 
         VALUES ('deliver_data', ?, 'INSERT', NULL, ?, NOW())`,
        [newDeliverId, JSON.stringify(delivery)]
      );
      
      // Commit transaction
      await connection.execute('COMMIT');
      
      return { deliverId: newDeliverId };
      
    } catch (error) {
      // Rollback on any error
      try {
        await connection.execute('ROLLBACK');
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError);
      }
      throw error;
    }
  }
}
