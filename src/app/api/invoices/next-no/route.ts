import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from "../../../../../lib/dbAdapter";

// GET - Generate next invoice number
export async function GET() {
  try {
    const pool = await getDBConnection();
    
    // Get the last invoice number
    const [rows] = await pool.query(
      `SELECT Invoice_No FROM customer_invoices ORDER BY Invoice_No ASC LIMIT 1`
    );

    let newInvoiceNo = "INV0001"; // default initial ID
    if ((rows as any[]).length > 0) {
      const lastId = (rows as any[])[0].Invoice_No;
      const numeric = parseInt(lastId.replace("INV", ""), 10);
      newInvoiceNo = "INV" + String(numeric + 1).padStart(4, "0");
    }

    return NextResponse.json({ nextNo: newInvoiceNo });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate next invoice number' }, { status: 500 });
  }
}
