import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from "../../../../../lib/dbAdapter";

export async function POST(request: NextRequest) {
  try {
    const db = await getDBConnection();
    const { salesOrderId } = await request.json();

    if (!salesOrderId) {
      return NextResponse.json({ error: 'Sales Order ID is required' }, { status: 400 });
    }

    // Fetch sales order details
    const [salesOrderRows] = await db.execute(
      `SELECT 
        so.Sales_Order_ID,
        so.Customer_ID,
        c.Name as Customer_Name,
        c.Address as Customer_Address,
        c.Phone as Customer_Phone,
        so.Order_Date,
        so.Delivery_Date,
        so.Payment_Terms,
        so.User_ID
      FROM sales_orders so
      LEFT JOIN customers c ON so.Customer_ID = c.Customer_ID
      WHERE so.Sales_Order_ID = ?`,
      [salesOrderId]
    );

    if ((salesOrderRows as any[]).length === 0) {
      return NextResponse.json({ error: 'Sales order not found' }, { status: 404 });
    }

    const salesOrder = (salesOrderRows as any[])[0];

    // Fetch sales order items
    const [itemsRows] = await db.execute(
      `SELECT 
        soi.Item_Code,
        p.Item_Name,
        soi.Quantity,
        soi.Unit_Price,
        soi.Total_Price,
        soi.SR_No,
        soi.MF_Date,
        soi.Ex_Date,
        soi.Batch_No
      FROM sales_order_items soi
      LEFT JOIN products p ON soi.Item_Code = p.Item_Code
      WHERE soi.Sales_Order_ID = ?`,
      [salesOrderId]
    );

    const items = (itemsRows as any[]).map(item => ({
      Item_Code: item.Item_Code,
      Item_Name: item.Item_Name,
      Quantity: item.Quantity,
      Unit_Price: item.Unit_Price,
      Total_Price: item.Total_Price,
      SR_No: item.SR_No || '',
      MF_Date: item.MF_Date || '',
      Ex_Date: item.Ex_Date || '',
      Batch_No: item.Batch_No || ''
    }));

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.Total_Price || 0), 0);
    const tax = subtotal * 0.1; // 10% tax
    const grandTotal = subtotal + tax;

    return NextResponse.json({
      salesOrder: {
        Sales_Order_ID: salesOrder.Sales_Order_ID,
        Customer_ID: salesOrder.Customer_ID,
        Customer_Name: salesOrder.Customer_Name,
        Customer_Address: salesOrder.Customer_Address,
        Customer_Phone: salesOrder.Customer_Phone,
        User_ID: salesOrder.User_ID,
        Invoice_Date: salesOrder.Order_Date,
        Payment_Terms: salesOrder.Payment_Terms
      },
      items,
      totals: {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        grandTotal: grandTotal.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error fetching autofill data:', error);
    return NextResponse.json({ error: 'Failed to fetch autofill data' }, { status: 500 });
  }
}
