import { NextRequest, NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/dbAdapter";



// GET - Fetch all sales order items
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const salesOrderId = searchParams.get("Sales_Order_ID");

    const pool = await getDBConnection();
    let query = "SELECT * FROM sales_order_items";
    let params: any[] = [];

    if (salesOrderId) {
      query += " WHERE Sales_Order_ID = ?";
      params.push(salesOrderId);
    }

    query += " ORDER BY Sales_Order_Item_ID DESC";

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch sales order items" }, { status: 500 });
  }
}
