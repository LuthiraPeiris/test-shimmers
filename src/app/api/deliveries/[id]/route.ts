import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../../lib/lambdaClient";

// ✅ GET a delivery by Deliver_Id
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Delivery ID is required", items: [], success: false }, { status: 400 });
    }

    // Fetch delivery record from database
    const response = await lambdaClient.select(
      `SELECT 
        Deliver_Id,
        Sales_Order_ID,
        Item_Code,
        Item_Name,
        Quantity,
        Date,
        Status
      FROM deliver_data
      WHERE Deliver_Id = ?`,
      [id]
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch delivery");
    }

    if (response.data.length === 0) {
      return NextResponse.json({ error: "Delivery not found", items: [], success: false }, { status: 404 });
    }

    // Map delivery record to item format
    const items = response.data.map((row: any) => ({
      Item_ID: row.Deliver_Id,
      Item_Code: row.Item_Code,
      Item_Name: row.Item_Name,
      Quantity: row.Quantity,
      Unit_Price: 0,      // Default value
      Total_Amount: 0,    // Default value
      Pack_Size: "",
      Batch_No: "",
      SR_No: "",
      MF_Date: null,
      EX_Date: null,
      Remarks: ""
    }));

    return NextResponse.json({ items, success: true }, { status: 200 });
  } catch (error) {
    console.error("GET delivery error:", error);
    return NextResponse.json({ error: "Internal server error", items: [], success: false }, { status: 500 });
  }
}
