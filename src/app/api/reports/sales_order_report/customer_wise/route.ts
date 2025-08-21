import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../../lib/dbAdapter"; 

// GET Customer-wise Sales Order Report with comprehensive data
export async function GET(req: Request) {
  try {
    const pool = await getDBConnection();
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const customerId = searchParams.get("customerId");

    let query = `
      SELECT 
        so.Customer_ID,
        so.Customer_Name,
        so.Customer_Address,
        so.Customer_Phone,
        COUNT(DISTINCT so.Sales_Order_ID) as Total_Orders,
        SUM(soi.Quantity) as Total_Quantity,
        SUM(soi.Total_Price) as Total_Amount,
        SUM(so.Tax_Amount) as Total_Tax,
        SUM(so.Discount_Amount) as Total_Discount,
        SUM(so.Net_Amount) as Total_Net_Amount,
        MIN(so.Order_Date) as First_Order_Date,
        MAX(so.Order_Date) as Last_Order_Date,
        GROUP_CONCAT(DISTINCT so.Status) as Order_Statuses
      FROM sales_orders so
      INNER JOIN sales_order_items soi ON so.Sales_Order_ID = soi.Sales_Order_ID
    `;

    const params: any[] = [];

    // Add WHERE conditions
    const conditions: string[] = [];
    
    if (startDate && endDate) {
      conditions.push("so.Order_Date BETWEEN ? AND ?");
      params.push(startDate, endDate);
    }
    
    if (customerId) {
      conditions.push("so.Customer_ID = ?");
      params.push(customerId);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += `
      GROUP BY so.Customer_ID, so.Customer_Name, so.Customer_Address, so.Customer_Phone
      ORDER BY Total_Net_Amount DESC
    `;

    const [rows] = await pool.query(query, params);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating customer-wise sales order report:", error);
    return NextResponse.json(
      { error: "Failed to generate customer-wise sales order report" },
      { status: 500 }
    );
  }
}
