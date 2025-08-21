import { NextResponse } from "next/server";
import { getDBConnection } from '../../../../lib/dbAdapter';
import { NextRequest } from "next/server";
import { RowDataPacket } from 'mysql2';

// ========== Updated Interface ==========
interface SupplierInvoice {
  In_No: string;
  Po_Id: string;
  Supplier_Id: string;
  Supplier_Name: string;
  Item_Code: string;
  Item_Name: string;
  Pack_Size: string;
  Total_Amount: number;
  Status : string;
  Created_Date: string;

}

// ========== GET Request with optional search ==========
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").toLowerCase();

    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM supplier_invoice_data") as [SupplierInvoice[], any];

    let filtered = rows;
    if (search) {
      filtered = rows.filter((invoice) =>
        invoice.In_No?.toLowerCase().includes(search) ||
        invoice.Po_Id?.toLowerCase().includes(search) ||
        invoice.Supplier_Id?.toLowerCase().includes(search) ||
        invoice.Supplier_Name?.toLowerCase().includes(search) ||
        invoice.Item_Code?.toLowerCase().includes(search) ||
        invoice.Item_Name?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ supplierInvoices: filtered }, { status: 200 });
  } catch (error) {
    console.error("GET supplier invoice error:", error);
    return NextResponse.json(
      { error: "Failed to fetch supplier invoices", supplierInvoices: [] },
      { status: 500 }
    );
  }
}

// ========== POST Request to insert a new supplier invoice ==========
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { Po_Id, action, invoiceData } = body;

    // Validate Po_Id for both actions
    if (!Po_Id || typeof Po_Id !== "string" || Po_Id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Valid Po_Id is required",
          data: null,
          message: "Please provide a valid Purchase Order ID",
        },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // Handle autofill request
    if (action === "autofill") {
      // Fetch PO details
      const [rows] = (await pool.query(
        `SELECT 
           Po_Id,
           Created_Date,
           Location,
           Supplier_Id,
           Supplier_Name,
           Item_Code,
           Item_Name,
           Price,
           Quantity,
           DisValue,
           TotValue,
           Status
         FROM purchase_order
         WHERE Po_Id = ?
         LIMIT 1`,
        [Po_Id.trim()]
      )) as [RowDataPacket[], any];

      if (!rows || rows.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Purchase order not found",
            data: null,
            message: `No purchase order found with ID: ${Po_Id}`,
          },
          { status: 404 }
        );
      }

      const po = rows[0];

      // Calculate total amount
      const price = Number(po.Price) || 0;
      const qty = Number(po.Quantity) || 0;
      const discount = Number(po.DisValue) || 0;
      const totalAmount =
        po.TotValue !== null && po.TotValue !== undefined
          ? Number(po.TotValue)
          : Math.max(0, price * qty - discount);

      // Build autofill data
      const autofillData = {
        In_No: null, // will be generated when inserting
        Po_Id: po.Po_Id,
        Supplier_Id: po.Supplier_Id || null,
        Supplier_Name: po.Supplier_Name || null,
        Item_Code: po.Item_Code || null,
        Item_Name: po.Item_Name || "",
        Pack_Size: null, // not in purchase_order
        Total_Amount: totalAmount,
        Status: "PENDING",
        Created_Date: po.Created_Date
          ? new Date(po.Created_Date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      };

      return NextResponse.json(
        {
          success: true,
          data: autofillData,
          message: "Autofill data retrieved successfully",
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Handle invoice creation
    if (action === "create") {
      if (!invoiceData) {
        return NextResponse.json(
          {
            success: false,
            error: "Invoice data is required",
            data: null,
            message: "Please provide invoice data",
          },
          { status: 400 }
        );
      }

      const { Total_Amount, Status, Created_Date } = invoiceData;

      // Fetch PO details
      const [poRows] = (await pool.query(
        `SELECT Supplier_Id, Supplier_Name, Item_Code, Item_Name 
         FROM purchase_order 
         WHERE Po_Id = ?`,
        [Po_Id]
      )) as [RowDataPacket[], any];

      if (poRows.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Purchase Order with ID ${Po_Id} not found`,
            data: null,
          },
          { status: 404 }
        );
      }

      const { Supplier_Id, Supplier_Name, Item_Code, Item_Name } = poRows[0];

      // Auto-generate new Invoice No
      const [rows] = (await pool.query(
        `SELECT In_No FROM supplier_invoice_data ORDER BY In_No DESC LIMIT 1`
      )) as [RowDataPacket[], any];

      let newInNo = "SI0001";
      if (rows.length > 0) {
        const lastInNo = rows[0].In_No;
        const numericPart = parseInt(lastInNo.replace("SI", ""), 10);
        const nextNumber = numericPart + 1;
        newInNo = `SI${nextNumber.toString().padStart(4, "0")}`;
      }

      // Insert invoice
      await pool.execute(
        `INSERT INTO supplier_invoice_data 
          (In_No, Po_Id, Supplier_Id, Supplier_Name, Item_Code, Item_Name, Total_Amount, Status, Created_Date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newInNo,
          Po_Id,
          Supplier_Id,
          Supplier_Name,
          Item_Code,
          Item_Name,
          Number(Total_Amount),
          Status,
          Created_Date,
        ]
      );

      // Fetch the newly created invoice
      const [newInvoice] = (await pool.query(
        "SELECT * FROM supplier_invoice_data WHERE In_No = ?",
        [newInNo]
      )) as [RowDataPacket[], any];

      return NextResponse.json(
        {
          success: true,
          data: newInvoice[0],
          message: "Supplier invoice created successfully",
          timestamp: new Date().toISOString(),
        },
        { status: 201 }
      );
    }

    // If no valid action specified
    return NextResponse.json(
      {
        success: false,
        error: "Invalid action",
        data: null,
        message: "Please specify either 'autofill' or 'create' action",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("API Error:", error);

    let errorMessage = "Internal server error";
    let statusCode = 500;

    if (error.code === "ECONNREFUSED") {
      errorMessage = "Database connection failed";
    } else if (error.code === "ER_NO_SUCH_TABLE") {
      errorMessage = "Required database table not found";
    } else if (error.message?.includes("JSON")) {
      errorMessage = "Invalid request format";
      statusCode = 400;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
        data: null,
      },
      { status: statusCode }
    );
  }
}