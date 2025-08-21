import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../../lib/lambdaClient";

// ✅ GET a sales order item by ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Sales order item ID is required", success: false }, { status: 400 });
    }

    // Fetch sales order item
    const itemResponse = await lambdaClient.select(
      "SELECT * FROM sales_order_items WHERE Sales_Order_Item_ID = ?",
      [id]
    );

    if (!itemResponse.success) {
      throw new Error(itemResponse.error || "Failed to fetch sales order item");
    }

    if (itemResponse.data.length === 0) {
      return NextResponse.json({ error: "Sales order item not found", success: false }, { status: 404 });
    }

    const item = itemResponse.data[0];

    return NextResponse.json({ ...item, success: true }, { status: 200 });
  } catch (error) {
    console.error("GET sales order item error:", error);
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}
