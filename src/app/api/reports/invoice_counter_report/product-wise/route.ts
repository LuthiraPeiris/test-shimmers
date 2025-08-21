import { getDBConnection } from "../../../../../../lib/dbAdapter"; 
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

interface ProductInvoiceRow extends RowDataPacket {
  item_code: string;
  item_name: string;
  brand: string | null;
  size: string | null;
  total_orders: number;
  total_quantity: number;
  total_amount: number;
  avg_unit_price: number;
  first_invoice_date: string;
  last_invoice_date: string;
}

export async function GET(request: NextRequest) {
  try {
    const pool = await getDBConnection();
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const itemCode = searchParams.get("itemCode");

    let query = `
      SELECT 
        imd.Item_Code as item_code,
        imd.Item_Name as item_name,
        imd.Brand as brand,
        imd.Size as size,
        COUNT(DISTINCT ci.Invoice_ID) as total_orders,
        SUM(ii.Quantity) as total_quantity,
        SUM(ii.Total_Price) as total_amount,
        AVG(ii.Unit_Price) as avg_unit_price,
        MIN(ci.Invoice_Date) as first_invoice_date,
        MAX(ci.Invoice_Date) as last_invoice_date
      FROM item_master_data imd
      INNER JOIN invoice_items ii ON imd.Item_Code = ii.Item_Code
      INNER JOIN customer_invoices ci ON ii.Invoice_ID = ci.Invoice_ID
      WHERE 1=1
    `;

    const params: any[] = [];

    if (startDate && endDate) {
      query += " AND ci.Invoice_Date BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    if (itemCode) {
      query += " AND imd.Item_Code = ?";
      params.push(itemCode);
    }

    query += `
      GROUP BY imd.Item_Code, imd.Item_Name, imd.Brand, imd.Size
      ORDER BY total_amount DESC
    `;

    const [rows] = await pool.query(query,params) as [ProductInvoiceRow[],any];

    return NextResponse.json({
      success: true,
      data: rows,
      totalRecords: rows.length,
      summary: {
        totalOrders: rows.reduce((sum, row) => sum + row.total_orders, 0),
        totalQuantity: rows.reduce((sum, row) => sum + (row.total_quantity ?? 0), 0),
        totalAmount: rows.reduce((sum, row) => sum + (row.total_amount ?? 0), 0),
      },
    });
  } catch (error) {
    console.error("Error fetching product-wise invoice counter report:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product-wise invoice counter report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
