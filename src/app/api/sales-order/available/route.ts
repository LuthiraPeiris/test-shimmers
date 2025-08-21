import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from "../../../../../lib/dbAdapter";

// GET: Fetch available sales orders for dropdown
export async function GET(request: NextRequest) {
  try {
    const db = await getDBConnection();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'Confirmed';
    
    const query = `
      SELECT 
        so.Sales_Order_ID,
        so.Customer_ID,
        so.Customer_Name,
        so.Customer_Address,
        so.Customer_Phone,
        so.Order_Date,
        so.Delivery_Date,
        so.Payment_Terms,
        so.Status,
        so.User_ID,
        COALESCE(SUM(soi.Total_Price), 0) as Total_Amount,
        COUNT(soi.Item_Code) as Item_Count
      FROM sales_orders so
      LEFT JOIN sales_order_items soi ON so.Sales_Order_ID = soi.Sales_Order_ID
      WHERE so.Status = ?
      GROUP BY so.Sales_Order_ID
      ORDER BY so.Order_Date DESC
    `;
    
    const [rows] = await db.execute(query, [status]);
    
    // Ensure rows is an array before processing
    const salesOrders = Array.isArray(rows) ? rows : [];
    
    // Handle empty results
    if (!salesOrders || salesOrders.length === 0) {
      return NextResponse.json([]);
    }
    
    const salesOrdersWithItems = [];
    
    for (const order of salesOrders) {
      try {
        const [items] = await db.execute(
          `SELECT 
            Item_Code,
            Item_Name,
            Quantity,
            Unit_Price,
            Total_Price,
            Remarks
          FROM sales_order_items 
          WHERE Sales_Order_ID = ?`,
          [order.Sales_Order_ID]
        );
        
        salesOrdersWithItems.push({
          ...order,
          items: Array.isArray(items) ? items : []
        });
      } catch (itemError) {
        console.error(`Error fetching items for order ${order.Sales_Order_ID}:`, itemError);
        salesOrdersWithItems.push({
          ...order,
          items: []
        });
      }
    }
    
    return NextResponse.json(salesOrdersWithItems);
  } catch (error) {
    console.error('Error fetching available sales orders:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch available sales orders', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
