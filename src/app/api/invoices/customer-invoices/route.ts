import { NextRequest, NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/dbAdapter";

// ============================
// GET - Fetch all invoices + items
// ============================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").toLowerCase();

    const db = await getDBConnection();

    let query = `
      SELECT 
        ci.Invoice_ID,
        ci.Invoice_No,
        ci.Sales_Order_ID,
        ci.Customer_ID,
        ci.User_ID,
        ci.Invoice_Date,
        ci.Payment_Terms,
        ci.Total_Amount,
        ci.Tax_Amount,
        ci.Grand_Total,
        ci.Notes,
        ci.status,
        ci.Created_At,
        c.Name AS Customer_Name,
        c.Email,
        c.Phone,
        c.Address AS Customer_Address
      FROM customer_invoices ci
      LEFT JOIN customer_data c ON ci.Customer_ID = c.Customer_ID
    `;

    let params: any[] = [];

    if (search) {
      query += ` WHERE (ci.Invoice_No LIKE ? OR c.Name LIKE ? OR ci.Customer_ID LIKE ?)`;
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern, searchPattern];
    }

    query += ` ORDER BY ci.Invoice_Date DESC`;

    const [invoices] = await db.query(query, params) as [any[], any];

    // Fetch items for invoices
    const invoiceIds = invoices.map(inv => inv.Invoice_ID);
    let items: any[] = [];

    if (invoiceIds.length > 0) {
      const placeholders = invoiceIds.map(() => "?").join(",");
      [items] = await db.query(
        `SELECT * FROM invoice_items WHERE Invoice_ID IN (${placeholders})`,
        invoiceIds
      ) as [any[], any];
    }

    const result = invoices.map(inv => ({
      ...inv,
      invoice_items: items.filter(it => it.Invoice_ID === inv.Invoice_ID),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error fetching invoices:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch invoices",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ============================
// POST - Create invoice + delivery + stock update
// ============================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDBConnection();

    try {
      // Get latest invoice number
      const [rows] = await db.query(
        `SELECT Invoice_No FROM customer_invoices ORDER BY Invoice_ID DESC LIMIT 1`
      );

      let newInvoiceNo = "INV0001";
      if ((rows as any[]).length > 0) {
        const lastId = (rows as any[])[0].Invoice_No;
        const numeric = parseInt(lastId.replace("INV", ""), 10);
        newInvoiceNo = "INV" + String(numeric + 1).padStart(4, "0");
      }

      // Insert invoice
      const [result] = await db.query(
        `INSERT INTO customer_invoices 
         (Invoice_No, Sales_Order_ID, Customer_ID, User_ID, Invoice_Date, Payment_Terms, Total_Amount, Tax_Amount, Grand_Total, Notes, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newInvoiceNo,
          body.Sales_Order_ID || null,
          body.Customer_ID,
          body.User_ID,
          body.Invoice_Date,
          body.Payment_Terms || "Net 30",
          body.Total_Amount || 0,
          body.Tax_Amount || 0,
          body.Grand_Total || 0,
          body.Notes || "",
          body.status || "PENDING",
        ]
      );

      const invoiceId = (result as any).insertId;

      // Insert items + auto delivery + stock update
      if (body.items && Array.isArray(body.items)) {
        for (const item of body.items) {
          // Check stock in item_master_data
          const [stockRows]: any = await db.query(
            `SELECT Available_Stock FROM item_master_data WHERE Item_Code = ?`,
            [item.Item_Code]
          );

          if (stockRows.length === 0) {
            throw new Error(`Item ${item.Item_Code} not found in item_master_data.`);
          }

          const currentStock = stockRows[0].Available_Stock;
          if (currentStock < item.Quantity) {
            throw new Error(
              `Insufficient stock for ${item.Item_Code}! Available: ${currentStock}, Requested: ${item.Quantity}`
            );
          }

          // 1. Insert invoice item
          await db.query(
            `INSERT INTO invoice_items 
             (Invoice_ID, Item_Code, Item_Name, Quantity, Unit_Price, Total_Price, SR_No, MF_Date, Ex_Date, Batch_No) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              invoiceId,
              item.Item_Code,
              item.Item_Name,
              item.Quantity,
              item.Unit_Price,
              item.Total_Price,
              item.SR_No || null,
              item.MF_Date || null,
              item.Ex_Date || null,
              item.Batch_No || null,
            ]
          );

          // 2. Insert into deliver_data
          await db.query(
            `INSERT INTO deliver_data 
             (Deliver_Id, Sales_Order_ID, Item_Code, Item_Name, Quantity, Date, Status) 
             VALUES (?, ?, ?, ?, ?, CURDATE(), 'Pending')`,
            [
              "DEL" + String(Date.now()).slice(-6), // auto generate deliver id
              body.Sales_Order_ID || null,
              item.Item_Code,
              item.Item_Name,
              item.Quantity,
            ]
          );

          // 3. Update stock
          const [updateResult]: any = await db.query(
            `UPDATE item_master_data 
             SET Available_Stock = Available_Stock - ? 
             WHERE Item_Code = ? AND Available_Stock >= ?`,
            [item.Quantity, item.Item_Code, item.Quantity]
          );

          if (updateResult.affectedRows === 0) {
            throw new Error(
              `Stock update failed for ${item.Item_Code}.`
            );
          }
        }
      }

      return NextResponse.json(
        {
          message: "✅ Invoice created with delivery & stock updates",
          invoiceNo: newInvoiceNo,
          invoiceId: invoiceId,
        },
        { status: 201 }
      );
    } catch (err) {
      throw err;
    }
  } catch (error) {
    console.error("❌ Error creating invoice:", error);
    return NextResponse.json(
      {
        error: "Failed to create invoice",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
