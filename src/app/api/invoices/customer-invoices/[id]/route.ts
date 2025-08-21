import { NextRequest, NextResponse } from "next/server";
import { getDBConnection } from "../../../../../../lib/dbAdapter";

// ===== GET: Fetch a single invoice with items =====
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pool = await getDBConnection();

    if (!id) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
    }

    // Fetch invoice with customer details
    const [invoiceRows] = await pool.query(
      `SELECT 
        ci.*, 
        c.Name AS Customer_Name,
        c.Email,
        c.Phone,
        c.Address AS Customer_Address
       FROM customer_invoices ci
       LEFT JOIN customer_data c ON ci.Customer_ID = c.Customer_ID
       WHERE ci.Invoice_ID = ?`,
      [id]
    );

    const invoice = (invoiceRows as any[])[0];
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Fetch invoice items
    const [itemsRows] = await pool.query(
      `SELECT * FROM invoice_items WHERE Invoice_ID = ?`,
      [id]
    );

    return NextResponse.json({
      ...invoice,
      invoice_items: itemsRows
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}

// ===== PUT: Update invoice and items =====
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const pool = await getDBConnection();

    if (!id) return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });

    // Update invoice
    await pool.query(
      `UPDATE customer_invoices SET 
        Customer_ID = ?,
        User_ID = ?,
        Invoice_Date = ?,
        Payment_Terms = ?,
        Total_Amount = ?,
        Tax_Amount = ?,
        Grand_Total = ?,
        Notes = ?,
        status = ?
       WHERE Invoice_ID = ?`,
      [
        body.Customer_ID || null,
        body.User_ID || null,
        body.Invoice_Date || new Date().toISOString().split("T")[0],
        body.Payment_Terms || "Net 30",
        body.Total_Amount || 0,
        body.Tax_Amount || 0,
        body.Grand_Total || 0,
        body.Notes || "",
        body.status || "PENDING",
        id
      ]
    );

    // Delete existing items
    await pool.query(`DELETE FROM invoice_items WHERE Invoice_ID = ?`, [id]);

    // Insert new items
    if (Array.isArray(body.items)) {
      const insertQuery = `INSERT INTO invoice_items 
        (Invoice_ID, Item_Code, Item_Name, Quantity, Unit_Price, Total_Price, SR_No, MF_Date, Ex_Date, Batch_No)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      for (const item of body.items) {
        await pool.query(insertQuery, [
          id,
          item.Item_Code || "",
          item.Item_Name || "",
          item.Quantity || 0,
          item.Unit_Price || 0,
          item.Total_Price || 0,
          item.SR_No || null,
          item.MF_Date || null,
          item.Ex_Date || null,
          item.Batch_No || null
        ]);
      }
    }

    return NextResponse.json({ message: "Invoice updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

// ===== DELETE: Delete invoice and related items =====
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pool = await getDBConnection();

    if (!id) return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });

    // Delete items first
    await pool.query('DELETE FROM invoice_items WHERE Invoice_ID = ?', [id]);

    // Delete invoice
    await pool.query('DELETE FROM customer_invoices WHERE Invoice_ID = ?', [id]);

    return NextResponse.json({ message: "Invoice deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
