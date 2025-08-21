import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../../lib/lambdaClient";

// ✅ GET a goods receipt by GRN_ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "GRN_ID is required", goodsReceipt: null, success: false }, { status: 400 });
    }

    const response = await lambdaClient.select(
      "SELECT * FROM good_receipts_data WHERE GRN_ID = ?",
      [id]
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch goods receipt");
    }

    if (response.data.length === 0) {
      return NextResponse.json({ error: "Goods receipt not found", goodsReceipt: null, success: false }, { status: 404 });
    }

    return NextResponse.json({ goodsReceipt: response.data[0], success: true }, { status: 200 });
  } catch (error) {
    console.error("GET goods receipt error:", error);
    return NextResponse.json({ error: "Internal server error", goodsReceipt: null, success: false }, { status: 500 });
  }
}

// ✅ PUT: Update a goods receipt by GRN_ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const {
      Po_Id,
      Item_Code,
      Item_Name,
      Quantity,
      Unit_Price,
      Total_Amount,
      MF_Date,
      Status,
      Ex_Date,
    } = body;

    if (!Po_Id || !Item_Code || !Item_Name || Quantity === undefined || Unit_Price === undefined || Total_Amount === undefined || !MF_Date || !Status || !Ex_Date) {
      return NextResponse.json({ error: "All fields are required", goodsReceipt: null, success: false }, { status: 400 });
    }

    // Check existence
    const existingResponse = await lambdaClient.select(
      "SELECT * FROM good_receipts_data WHERE GRN_ID = ?",
      [id]
    );

    if (!existingResponse.success) throw new Error(existingResponse.error || "Failed to check goods receipt");
    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Goods receipt not found", goodsReceipt: null, success: false }, { status: 404 });
    }

    // Update
    const updateResponse = await lambdaClient.update(
      `UPDATE good_receipts_data SET 
        Po_Id = ?, Item_Code = ?, Item_Name = ?, Quantity = ?, 
        Unit_Price = ?, Total_Amount = ?, MF_Date = ?, Status = ?, Ex_Date = ?
      WHERE GRN_ID = ?`,
      [Po_Id, Item_Code, Item_Name, Quantity, Unit_Price, Total_Amount, MF_Date, Status, Ex_Date, id]
    );

    if (!updateResponse.success) throw new Error(updateResponse.error || "Failed to update goods receipt");

    // Fetch updated
    const updatedResponse = await lambdaClient.select(
      "SELECT * FROM good_receipts_data WHERE GRN_ID = ?",
      [id]
    );

    return NextResponse.json({ goodsReceipt: updatedResponse.data[0], success: true }, { status: 200 });
  } catch (error) {
    console.error("PUT goods receipt error:", error);
    return NextResponse.json({ error: "Failed to update goods receipt", goodsReceipt: null, success: false }, { status: 500 });
  }
}

// ✅ DELETE: Delete a goods receipt by GRN_ID
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Check existence
    const existingResponse = await lambdaClient.select(
      "SELECT * FROM good_receipts_data WHERE GRN_ID = ?",
      [id]
    );

    if (!existingResponse.success) throw new Error(existingResponse.error || "Failed to check goods receipt");
    if (existingResponse.data.length === 0) {
      return NextResponse.json({ error: "Goods receipt not found", success: false }, { status: 404 });
    }

    // Delete
    const deleteResponse = await lambdaClient.delete(
      "DELETE FROM good_receipts_data WHERE GRN_ID = ?",
      [id]
    );

    if (!deleteResponse.success) throw new Error(deleteResponse.error || "Failed to delete goods receipt");

    return NextResponse.json({ message: "Goods receipt deleted successfully", success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE goods receipt error:", error);
    return NextResponse.json({ error: "Failed to delete goods receipt", success: false }, { status: 500 });
  }
}
