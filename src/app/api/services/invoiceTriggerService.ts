import { getDBConnection } from "../../../../lib/dbAdapter"; 

interface InvoiceItem {
  item_code: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface CustomerInvoice {
  customer_id: string;
  user_id: string;
  invoice_date: string;
  payment_terms: string;
  total_amount: number;
  tax_amount: number;
  grand_total: number;
  notes?: string;
  items: InvoiceItem[];
}

interface DeliveryRecord {
  Sales_Order_ID?: string;
  item_code: string;
  item_name: string;
  quantity: number;
  date: string;
  status: string;
}

export class InvoiceTriggerService {
  /**
   * Get next sequence number safely
   */
  private async getNextSequence(connection: any, sequenceName: string): Promise<number> {
    const [updateResult] = await connection.execute(
      "UPDATE sequences SET next_id = LAST_INSERT_ID(next_id + 1) WHERE name = ?",
      [sequenceName]
    );
    
    if (updateResult.affectedRows === 0) {
      throw new Error(`Sequence '${sequenceName}' not found`);
    }
    
    const [res] = await connection.query("SELECT LAST_INSERT_ID() as next_id");
    return res[0].next_id;
  }

  /**
   * Process customer invoice creation and generate delivery records
   */
  async processCustomerInvoice(invoice: CustomerInvoice): Promise<{ invoiceId: number; invoiceNo: string }> {
    const connection = await getDBConnection();
    
    try {
      // Start transaction
      await connection.execute('START TRANSACTION');
      
      // 1. Generate new Invoice_No using sequence
      const nextInvNum = await this.getNextSequence(connection, 'invoice_no');
      const newInvoiceNo = "INV" + String(nextInvNum).padStart(4, "0");

      // 2. Insert customer invoice
      const [invoiceResult] = await connection.execute(
        `INSERT INTO customer_invoices 
         (Invoice_No, Customer_ID, User_ID, Invoice_Date, Payment_Terms, Total_Amount, Tax_Amount, Grand_Total, Notes, Created_At) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          newInvoiceNo,
          invoice.customer_id ?? null,
          invoice.user_id ?? null,
          invoice.invoice_date ?? null,
          invoice.payment_terms ?? null,
          invoice.total_amount ?? 0,
          invoice.tax_amount ?? 0,
          invoice.grand_total ?? 0,
          invoice.notes || null
        ]
      );
      
      const invoiceId = (invoiceResult as any).insertId;

      // 3. Insert invoice items and create delivery records
      for (const item of invoice.items) {
        // Insert invoice item
        await connection.execute(
          `INSERT INTO invoice_items 
           (Invoice_ID, Item_Code, Item_Name, Quantity, Unit_Price, Total_Price) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            invoiceId, 
            item.item_code ?? null, 
            item.item_name ?? null, 
            item.quantity ?? 0, 
            item.unit_price ?? 0, 
            item.total_price ?? 0
          ]
        );

        // Create delivery record
        await this.createDeliveryRecord(connection, {
          item_code: item.item_code,
          item_name: item.item_name,
          quantity: item.quantity,
          date: invoice.invoice_date,
          status: 'Pending'
        });
      }

      // 4. Log the transaction
      await connection.execute(
        `INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, created_at) 
         VALUES ('customer_invoices', ?, 'INSERT', NULL, ?, NOW())`,
        [invoiceId, JSON.stringify({...invoice, invoice_no: newInvoiceNo})]
      );

      // Commit transaction
      await connection.execute('COMMIT');
      
      return { invoiceId, invoiceNo: newInvoiceNo };
      
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

  /**
   * Create delivery record and update product stock
   */
  private async createDeliveryRecord(connection: any, delivery: DeliveryRecord): Promise<void> {
    // Check product availability
    const [productRows] = await connection.query(
      'SELECT Available_Stock FROM item_master_data WHERE Item_Code = ?',
      [delivery.item_code]
    );

    if (productRows.length === 0) {
      throw new Error(`Product ${delivery.item_code} not found`);
    }

    const currentStock = productRows[0].Available_Stock;

    if (currentStock < delivery.quantity) {
      throw new Error(`Insufficient stock for ${delivery.item_code}. Available: ${currentStock}, Requested: ${delivery.quantity}`);
    }

    // Generate new Deliver_Id using sequence
    const nextDeliverNum = await this.getNextSequence(connection, 'deliver_id');
    const newDeliverId = "D" + String(nextDeliverNum).padStart(4, "0");

    // Create delivery record
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

    // Update product quantity
    await connection.execute(
      'UPDATE item_master_data SET Available_Stock = Available_Stock - ? WHERE Item_Code = ?',
      [delivery.quantity, delivery.item_code]
    );

    // Log the delivery creation and stock update
    await connection.execute(
      `INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, created_at) 
       VALUES ('deliver_data', ?, 'INSERT', NULL, ?, NOW())`,
      [newDeliverId, JSON.stringify(delivery)]
    );
  }
}
