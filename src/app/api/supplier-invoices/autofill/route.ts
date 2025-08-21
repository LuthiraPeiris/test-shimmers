import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/dbAdapter";
import { RowDataPacket } from "mysql2";

// ✅ POST /api/supplier-invoices/autofill
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { Po_Id } = body;

    // ✅ Validate Po_Id
    if (!Po_Id || typeof Po_Id !== "string" || Po_Id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Valid Po_Id is required",
          autofillData: null,
          message: "Please provide a valid Purchase Order ID",
        },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // ✅ Fetch PO details
    const [rows] = await pool.query(
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
    ) as [RowDataPacket[], any];

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Purchase order not found",
          autofillData: null,
          message: `No purchase order found with ID: ${Po_Id}`,
        },
        { status: 404 }
      );
    }

    const po = rows[0];

    // ✅ Calculate total amount (TotValue if exists, else Price*Quantity - Discount)
    const price = Number(po.Price) || 0;
    const qty = Number(po.Quantity) || 0;
    const discount = Number(po.DisValue) || 0;
    const totalAmount =
      po.TotValue !== null && po.TotValue !== undefined
        ? Number(po.TotValue)
        : Math.max(0, price * qty - discount);

    // ✅ Build autofill data (must match supplier_invoice_data schema)
    const autofillData = {
      In_No: null, // will be generated when inserting into supplier_invoice_data
      Po_Id: po.Po_Id,
      Supplier_Id: po.Supplier_Id || null,
      Supplier_Name: po.Supplier_Name || null,
      Item_Code: po.Item_Code || null,
      Item_Name: po.Item_Name || "",
      Pack_Size: null, // not in purchase_order, stays null
      Total_Amount: totalAmount,
      Status: "PENDING",
      Created_Date: po.Created_Date
        ? new Date(po.Created_Date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    };

    return NextResponse.json(
      {
        success: true,
        autofillData,
        message: "Autofill data retrieved successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching autofill data:", error);

    let errorMessage = "Failed to fetch autofill data";
    let statusCode = 500;

    if (error.code === "ECONNREFUSED") {
      errorMessage = "Database connection failed";
    } else if (error.code === "ER_NO_SUCH_TABLE") {
      errorMessage = "Purchase order table not found";
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
        autofillData: null,
      },
      { status: statusCode }
    );
  }
}
