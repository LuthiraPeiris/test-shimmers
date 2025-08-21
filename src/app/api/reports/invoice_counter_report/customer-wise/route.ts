import { getDBConnection } from "../../../../../../lib/dbAdapter"; 
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

interface CustomerInvoiceRow extends RowDataPacket {
  customer_id: string;         // varchar(10)
  customer_name: string;       // Name
  email: string;
  phone: string;
  address: string;
  total_orders: number;
  total_quantity: number;
  total_amount: number;
  avg_invoice_amount: number;
  first_invoice_date: string;
  last_invoice_date: string;
}

export async function GET(request: NextRequest) {
  try {
    const pool = await getDBConnection();
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const customerId = searchParams.get("customerId");

    let query = `
      SELECT 
        c.Customer_ID as customer_id,
        c.Name as customer_name,
        c.Email as email,
        c.Phone as phone,
        c.Address as address,
        COUNT(DISTINCT i.Invoice_ID) as total_orders,
        SUM(ii.Quantity) as total_quantity,
        SUM(ii.Total_Price) as total_amount,
        AVG(ii.Total_Price) as avg_invoice_amount,
        MIN(i.Invoice_Date) as first_invoice_date,
        MAX(i.Invoice_Date) as last_invoice_date
      FROM customer_data c
      INNER JOIN customer_invoices i ON c.Customer_ID = i.Customer_ID
      INNER JOIN invoice_items ii ON i.Invoice_ID = ii.Invoice_ID
      WHERE 1=1
    `;

    const params: any[] = [];

    if (startDate && endDate) {
      query += " AND i.Invoice_Date BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    if (customerId) {
      query += " AND c.Customer_ID = ?";
      params.push(customerId);
    }

    query += `
      GROUP BY c.Customer_ID, c.Name, c.Email, c.Phone, c.Address
      ORDER BY total_amount DESC
    `;

    const [rows] = await pool.query(query, params) as [CustomerInvoiceRow[], any];

    return NextResponse.json({
      success: true,
      data: rows,
      totalRecords: rows.length,
      summary: {
        totalInvoices: rows.reduce((sum: number, row: CustomerInvoiceRow) => sum + row.total_orders, 0),
        totalQuantity: rows.reduce((sum: number, row: CustomerInvoiceRow) => sum + (row.total_quantity ?? 0), 0),
        totalAmount: rows.reduce((sum: number, row: CustomerInvoiceRow) => sum + (row.total_amount ?? 0), 0),
      }
    });

  } catch (error) {
    console.error("Error fetching customer-wise invoice counter report:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customer-wise invoice counter report",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
