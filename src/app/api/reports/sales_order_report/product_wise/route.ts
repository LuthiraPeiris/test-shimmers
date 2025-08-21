import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../../lib/dbAdapter"; 

// GET Product-wise Sales Order Report with comprehensive data
export async function GET(req: Request) {
  try {
    const pool = await getDBConnection();
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const itemCode = searchParams.get("itemCode");

    let query = `
      SELECT 
        soi.Item_Code,
        soi.Item_Name,
        COUNT(DISTINCT so.Sales_Order_ID) as Total_Orders,
        SUM(soi.Quantity) as Total_Quantity,
        SUM(soi.Total_Price) as Total_Amount,
        AVG(soi.Unit_Price) as Average_Unit_Price,
        MIN(so.Order_Date) as First_Order_Date,
        MAX(so.Order_Date) as Last_Order_Date,
        GROUP_CONCAT(DISTINCT so.Status) as Order_Statuses,
        GROUP_CONCAT(DISTINCT soi.Remarks) as Remarks
      FROM sales_order_items soi
      INNER JOIN sales_orders so ON soi.Sales_Order_ID = so.Sales_Order_ID
    `;

    const params: any[] = [];

    // Add WHERE conditions
    const conditions: string[] = [];
    
    if (startDate && endDate) {
      conditions.push("so.Order_Date BETWEEN ? AND ?");
      params.push(startDate, endDate);
    }
    
    if (itemCode) {
      conditions.push("soi.Item_Code = ?");
      params.push(itemCode);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += `
      GROUP BY soi.Item_Code, soi.Item_Name
      ORDER BY Total_Amount DESC
    `;

    const [rows] = await pool.query(query, params);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating product-wise sales order report:", error);
    return NextResponse.json(
      { error: "Failed to generate product-wise sales order report" },
      { status: 500 }
    );
  }
}
